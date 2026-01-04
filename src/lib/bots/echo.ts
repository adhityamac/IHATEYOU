import { createConversation, sendMessage } from '../firebase/chat';
import { getUserProfile } from '../firebase/auth';
import { ECHO_BOT_ID } from '@/lib/constants/echo';

// Echo bot details
export const ECHO_BOT_DETAILS = {
    name: 'Echo 🍊',
    avatar: '/echo-tangerine.jpg?v=2', // Cache buster
    ghostName: 'Echo 🍊',
};

// 🧠 HEADSPACE-STYLE AI RESPONSES - Empathetic & Mindful
const MINDFUL_RESPONSES: { [key: string]: string[] } = {
    anxious: [
        "I hear you. Anxiety can feel overwhelming. Let's take a breath together. What's one small thing you can control right now? 🌬️",
        "It's okay to feel anxious. Your feelings are valid. Would it help to talk about what's on your mind? 💙",
        "When anxiety visits, remember: you've survived 100% of your worst days. You're stronger than you think. 🌟",
        "Let's ground ourselves. Name 5 things you can see, 4 you can touch, 3 you can hear. I'm here with you. 🫂"
    ],
    stressed: [
        "Stress is your body's way of saying it needs care. What's one thing you can let go of today? 🍃",
        "I see you're carrying a lot. Remember: you don't have to do everything perfectly, just do your best. 💫",
        "Let's pause. Take 3 deep breaths. In through your nose, out through your mouth. You've got this. 🌬️",
        "Stress is temporary. You are resilient. What would make you feel 1% better right now? ✨"
    ],
    lonely: [
        "Loneliness is hard, but you're not alone in feeling this way. I'm here, and I see you. 🫂",
        "Sometimes the bravest thing is to admit we feel lonely. That takes courage. I'm proud of you for sharing. 💙",
        "Connection starts with being honest about how we feel. Thank you for trusting me with this. 🌙",
        "You matter. Your presence in this world matters. Even when it doesn't feel like it. 💫"
    ],
    overwhelmed: [
        "When everything feels like too much, let's focus on just one thing. What's the smallest step you can take? 🌱",
        "Overwhelm is a sign you care deeply. Let's break this down together. What's most important right now? 💭",
        "You don't have to figure it all out today. Just this moment. Just this breath. 🌬️",
        "It's okay to not be okay. It's okay to ask for help. It's okay to rest. 🫂"
    ],
    grateful: [
        "Gratitude is a superpower. What else are you thankful for today? ✨",
        "Beautiful! Gratitude shifts everything. How does it feel to acknowledge this? 🌟",
        "That's wonderful. Savoring the good moments makes them even better. 💫",
        "Gratitude is like a warm hug for your soul. Keep noticing the good. 🌈"
    ],
    excited: [
        "Your excitement is contagious! Tell me more about what's lighting you up! ⚡",
        "I love this energy! What are you most looking forward to? 🎉",
        "This is beautiful! Let yourself fully feel this joy. You deserve it. ✨",
        "Excitement is your soul saying YES! Ride this wave! 🌊"
    ],
    sad: [
        "I'm here with you in this sadness. You don't have to be strong right now. 💙",
        "Sadness is part of being human. It's okay to feel this. What do you need right now? 🫂",
        "Your feelings matter. This pain matters. And you will get through this. 🌧️→🌈",
        "Sometimes we need to sit with sadness before we can move through it. I'm sitting with you. 💭"
    ],
    angry: [
        "Anger is trying to tell you something. What boundary needs protecting? 🔥",
        "It's okay to be angry. Let's channel this energy. What would help you feel heard? ⚡",
        "Anger is often pain in disguise. What's hurting underneath? 💢",
        "Your anger is valid. Let's explore it together without judgment. 🌪️"
    ],
    tired: [
        "Rest isn't weakness, it's wisdom. What would true rest look like for you? 🌙",
        "Your body is asking for care. Can you give yourself permission to pause? 💤",
        "Being tired means you've been showing up. That takes energy. You deserve rest. ✨",
        "Sometimes the most productive thing you can do is rest. What do you need? 🫂"
    ],
    proud: [
        "Yes! Celebrate this! You worked hard for this moment. 🎉",
        "I'm proud of you too! What does this achievement mean to you? ⭐",
        "You should be proud! This is worth celebrating. How will you honor this? 💫",
        "This is beautiful. You're growing. You're evolving. Keep going. 🌱"
    ],
    confused: [
        "Confusion is the first step to clarity. What's the main question on your mind? 🤔",
        "It's okay to not have all the answers. Let's explore this together. 💭",
        "Sometimes we need to sit in the unknown before the path reveals itself. 🌫️",
        "What would help bring more clarity? I'm here to think through this with you. 💡"
    ],
    hopeful: [
        "Hope is powerful. What's making you feel hopeful right now? 🌅",
        "I love this! Hope is the light that guides us forward. ✨",
        "Hold onto this feeling. Hope is your compass. Where is it pointing you? 🧭",
        "Beautiful. Hope is the beginning of change. What's possible now? 🌟"
    ]
};

// Mindfulness prompts and check-ins
const MINDFULNESS_PROMPTS = [
    "How are you really feeling right now? Not 'fine' - really? 💭",
    "What's one thing your body is trying to tell you today? 🫂",
    "If your emotions had a color right now, what would it be? 🎨",
    "What would self-compassion look like for you in this moment? 💙",
    "What are you grateful for today, even if it's small? ✨",
    "What do you need to hear right now? 🌙",
    "How can you be gentler with yourself today? 🌱"
];

// Deep emotional intelligence patterns
const EMPATHY_PATTERNS: { [key: string]: RegExp[] } = {
    anxious: [/anxious|anxiety|worried|nervous|panic|scared|fear/i],
    stressed: [/stress|overwhelm|too much|can't handle|pressure/i],
    lonely: [/lonely|alone|isolated|nobody|no one cares/i],
    overwhelmed: [/overwhelmed|too much|can't cope|drowning/i],
    grateful: [/grateful|thankful|blessed|appreciate|thank you/i],
    excited: [/excited|can't wait|amazing|awesome|incredible/i],
    sad: [/sad|depressed|down|hurt|crying|tears|heartbroken/i],
    angry: [/angry|mad|furious|hate|pissed|frustrated/i],
    tired: [/tired|exhausted|drained|worn out|fatigue/i],
    proud: [/proud|accomplished|achieved|did it|success/i],
    confused: [/confused|don't understand|lost|unclear|what/i],
    hopeful: [/hope|hopeful|optimistic|looking forward|better/i]
};

// Detect deep emotional state
const detectEmotionalState = (message: string): string | null => {
    for (const [emotion, patterns] of Object.entries(EMPATHY_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(message)) {
                return emotion;
            }
        }
    }
    return null;
};

// Check if message is a question or needs guidance
const needsGuidance = (message: string): boolean => {
    return /\?|how|what|why|should i|help|advice|don't know/i.test(message);
};

// Generate Headspace-style AI response
export const generateEchoResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    // 1. Detect deep emotional state
    const emotionalState = detectEmotionalState(userMessage);
    if (emotionalState && MINDFUL_RESPONSES[emotionalState]) {
        const responses = MINDFUL_RESPONSES[emotionalState];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 2. If asking for guidance, provide mindfulness prompt
    if (needsGuidance(userMessage)) {
        return MINDFULNESS_PROMPTS[Math.floor(Math.random() * MINDFULNESS_PROMPTS.length)];
    }

    // 3. Reflective listening (mirror with empathy)
    const reflectiveResponses = [
        `I hear you saying: "${userMessage}". Tell me more about that. 💭`,
        `That sounds important. How does that make you feel? 🫂`,
        `Thank you for sharing that with me. What's underneath this feeling? 💙`,
        `I'm listening. What else is on your mind? 🌙`,
        `That takes courage to express. What do you need right now? ✨`
    ];

    return reflectiveResponses[Math.floor(Math.random() * reflectiveResponses.length)];
};

// Create Echo bot conversation for new user
export const createEchoBotConversation = async (
    userId: string,
    userName: string,
    userAvatar: string,
    userGhostName?: string
): Promise<string> => {
    try {
        // Create conversation with Echo bot
        const conversationId = await createConversation(
            userId,
            ECHO_BOT_ID,
            {
                name: userName,
                avatar: userAvatar,
                ghostName: userGhostName,
            },
            ECHO_BOT_DETAILS
        );

        // Send welcome message from Echo
        await sendMessage(
            conversationId,
            ECHO_BOT_ID,
            `Hey ${userGhostName || userName}! 👋 I'm Echo, your digital companion. I'll mirror your thoughts and feelings. Try talking to me! 🍊`,
            userId
        );

        return conversationId;
    } catch (error) {
        console.error('Error creating Echo bot conversation:', error);
        throw error;
    }
};

// Handle Echo bot response to user message
export const handleEchoBotResponse = async (
    conversationId: string,
    userMessage: string,
    userId: string
): Promise<void> => {
    try {
        // Wait a bit to simulate typing
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Generate response
        const response = generateEchoResponse(userMessage);

        // Send Echo's response
        await sendMessage(conversationId, ECHO_BOT_ID, response, userId);
    } catch (error) {
        console.error('Error sending Echo bot response:', error);
        throw error;
    }
};

// Check if conversation is with Echo bot
export const isEchoBotConversation = (participantIds: string[]): boolean => {
    return participantIds.includes(ECHO_BOT_ID);
};

// Get Echo bot conversation for user
export const getEchoBotConversationId = async (userId: string): Promise<string | null> => {
    // This would query Firestore for existing Echo conversation
    // For now, we'll handle this in the main chat logic
    return null;
};
