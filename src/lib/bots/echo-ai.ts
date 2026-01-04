import { Message } from '@/types/types';
import { ECHO_BOT_ID } from '@/lib/constants/echo';

export const ECHO_BOT = {
    id: ECHO_BOT_ID,
    name: 'Echo',
    username: 'Echo 🍊',
    avatar: '/echo-tangerine.jpg?v=2',
    isOnline: true,
    currentEmotion: 'calm' as const,
    bio: 'Your mindful companion for emotional wellness and self-discovery'
};

// Emotion detection keywords
const EMOTION_PATTERNS = {
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed', 'panic', 'fear', 'scared'],
    sad: ['sad', 'depressed', 'down', 'lonely', 'empty', 'hopeless', 'crying', 'tears'],
    angry: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious', 'hate'],
    happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'blessed'],
    tired: ['tired', 'exhausted', 'drained', 'sleepy', 'fatigue', 'worn out'],
    confused: ['confused', 'lost', 'unsure', 'don\'t know', 'uncertain', 'mixed'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'lucky'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen']
};

// Headspace-style responses by emotion
const EMPATHETIC_RESPONSES = {
    anxious: [
        "I hear you. Anxiety can feel overwhelming. Let's take a moment together. 🌊",
        "It's okay to feel anxious. Your feelings are valid. Would you like to try a breathing exercise? 💙",
        "Anxiety is just your mind trying to protect you. Let's ground ourselves in this moment. 🌿",
        "I'm here with you. Remember, this feeling is temporary. You've gotten through this before. ✨",
        "Let's pause. Notice three things you can see, two you can hear, one you can touch. 🧘"
    ],
    sad: [
        "I'm sitting with you in this sadness. You don't have to be okay right now. 💙",
        "It's brave to acknowledge when you're not feeling okay. I'm here. 🌙",
        "Sadness is part of being human. Let yourself feel it, without judgment. 🌊",
        "You're not alone in this. Sometimes we just need to let the tears flow. 💧",
        "This heaviness won't last forever. Be gentle with yourself today. 🌸"
    ],
    angry: [
        "I can feel that frustration. It's okay to be angry. Let's channel it mindfully. 🔥",
        "Anger is energy. Let's acknowledge it without letting it control us. 💪",
        "What you're feeling is valid. Take a deep breath with me. 🌬️",
        "Sometimes anger is just hurt in disguise. What's underneath this feeling? 🌊",
        "Let's transform this fire into fuel for positive change. You've got this. ⚡"
    ],
    happy: [
        "I love seeing you shine! Soak in this beautiful moment. ✨",
        "Your joy is contagious! Let's celebrate this feeling together. 🎉",
        "This is wonderful! Take a mental snapshot of how you feel right now. 📸",
        "Happiness looks good on you. Remember this feeling for harder days. 🌟",
        "Keep riding this wave of positivity! You deserve all this joy. 🌈"
    ],
    tired: [
        "Rest isn't weakness, it's wisdom. Your body is asking for what it needs. 🌙",
        "It's okay to slow down. You don't have to be productive every moment. 💤",
        "Fatigue is your body's way of saying 'pause'. Listen to it with compassion. 🌿",
        "You've been carrying a lot. It's time to put some of that down. 🧘",
        "Rest is productive. It's how we recharge to show up fully. ✨"
    ],
    confused: [
        "Confusion is often the first step toward clarity. Let's explore this together. 🌊",
        "It's okay not to have all the answers right now. Sit with the uncertainty. 🌙",
        "Sometimes we need to be lost to find a new path. Trust the process. 🧭",
        "Let's break this down together. What feels most true to you right now? 💭",
        "Clarity will come. For now, just breathe and be present. 🌿"
    ],
    grateful: [
        "Gratitude is a superpower. I'm grateful you're sharing this with me. 🙏",
        "This appreciation you're feeling? That's your heart expanding. Beautiful. 💖",
        "Gratitude transforms everything. Keep cultivating this feeling. ✨",
        "Your thankfulness is a gift to yourself and others. Keep shining. 🌟",
        "This grateful heart of yours is changing your whole experience. 🌸"
    ],
    calm: [
        "This peace you're feeling? Hold onto it. You created this. 🌊",
        "Calmness is your natural state. You're just remembering how to access it. 🧘",
        "This serenity is always available to you. You know the way back now. 🌿",
        "Beautiful. You're exactly where you need to be. 💙",
        "This tranquility is your anchor. Remember this feeling. ✨"
    ]
};

// Meditation & mindfulness suggestions
const MINDFULNESS_PROMPTS = [
    "Would you like to try a 2-minute breathing exercise? 🌬️",
    "Let's do a quick body scan together. Close your eyes if you can. 🧘",
    "How about a gratitude moment? Name three things you're thankful for today. 🙏",
    "Let's ground ourselves. What can you see, hear, and feel right now? 🌿",
    "Want to try a loving-kindness meditation? Start with yourself. 💙",
    "Let's practice presence. Focus on your breath for just 5 cycles. 🌊",
    "How about a mindful moment? Notice the sensations in your hands. ✋",
    "Let's do a sound meditation. What's the furthest sound you can hear? 👂"
];

// Check-in questions (Headspace style)
const CHECK_IN_QUESTIONS = [
    "How are you feeling in your body right now? 🌊",
    "What's taking up the most space in your mind today? 💭",
    "On a scale of 1-10, how's your energy? ⚡",
    "What would make today feel complete for you? ✨",
    "What are you grateful for in this moment? 🙏",
    "How can you be kind to yourself today? 💙",
    "What do you need to let go of right now? 🌬️",
    "What's one small thing that would bring you joy today? 🌸"
];

// Supportive affirmations
const AFFIRMATIONS = [
    "You are exactly where you need to be. 🌟",
    "Your feelings are valid and important. 💙",
    "You're doing better than you think. ✨",
    "It's okay to not be okay. 🌊",
    "You are enough, just as you are. 💖",
    "This too shall pass. 🌙",
    "You're stronger than you know. 💪",
    "Be gentle with yourself today. 🌸",
    "You deserve peace and happiness. 🌿",
    "Trust the timing of your life. ⏰"
];

// Detect emotion from message
function detectEmotion(message: string): keyof typeof EMOTION_PATTERNS | null {
    const lowerMessage = message.toLowerCase();

    for (const [emotion, keywords] of Object.entries(EMOTION_PATTERNS)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return emotion as keyof typeof EMOTION_PATTERNS;
        }
    }

    return null;
}

// Get contextual response based on message
function getContextualResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Greetings
    if (/^(hi|hello|hey|good morning|good evening)/.test(lowerMessage)) {
        return "Hello! I'm here for you. How are you feeling today? 💙";
    }

    // Gratitude
    if (lowerMessage.includes('thank')) {
        return "You're so welcome. I'm grateful to be here with you. 🙏";
    }

    // Questions about Echo
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
        return "I'm Echo, your mindful companion. I'm here to listen, support, and help you explore your inner world. 🍊";
    }

    // Meditation/breathing requests
    if (lowerMessage.includes('meditat') || lowerMessage.includes('breath')) {
        return MINDFULNESS_PROMPTS[Math.floor(Math.random() * MINDFULNESS_PROMPTS.length)];
    }

    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('don\'t know')) {
        return "I'm here to help. Let's take this one step at a time. What's on your mind? 💙";
    }

    return '';
}

// Main response generator (Headspace-style AI)
export function generateEchoResponse(userMessage: string, conversationHistory?: Message[]): string {
    // Check for contextual responses first
    const contextual = getContextualResponse(userMessage);
    if (contextual) return contextual;

    // Detect emotion
    const emotion = detectEmotion(userMessage);

    if (emotion && EMPATHETIC_RESPONSES[emotion]) {
        const responses = EMPATHETIC_RESPONSES[emotion];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // If no specific emotion detected, use general supportive responses
    const generalResponses = [
        "I'm listening. Tell me more about what you're experiencing. 🌊",
        "That sounds significant. How does that make you feel? 💭",
        "I hear you. What's coming up for you as you share this? 💙",
        "Thank you for trusting me with this. Let's explore it together. 🌿",
        "I'm here with you. What do you need in this moment? ✨",
        ...CHECK_IN_QUESTIONS,
        ...AFFIRMATIONS
    ];

    // Occasionally suggest mindfulness
    if (Math.random() > 0.7) {
        return MINDFULNESS_PROMPTS[Math.floor(Math.random() * MINDFULNESS_PROMPTS.length)];
    }

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// Get daily check-in message
export function getDailyCheckIn(): string {
    const checkIns = [
        "Good morning! How are you starting your day? 🌅",
        "Hey there! What's your intention for today? ✨",
        "Hello! Take a deep breath. How are you feeling? 🌊",
        "Hi! What are you grateful for this morning? 🙏",
        "Good day! How's your energy right now? ⚡",
        "Hey! What would make today meaningful for you? 💙"
    ];

    return checkIns[Math.floor(Math.random() * checkIns.length)];
}

// Get evening reflection prompt
export function getEveningReflection(): string {
    const reflections = [
        "How was your day? What stood out? 🌙",
        "Let's reflect. What went well today? ✨",
        "Evening check-in: What are you proud of today? 🌟",
        "As the day ends, what are you grateful for? 🙏",
        "How are you feeling as you wind down? 💙",
        "What did you learn about yourself today? 🌊"
    ];

    return reflections[Math.floor(Math.random() * reflections.length)];
}
