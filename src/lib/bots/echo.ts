import { createConversation, sendMessage } from '../firebase/chat';
import { getUserProfile } from '../firebase/auth';

// Echo bot user ID (constant)
export const ECHO_BOT_ID = 'echo-bot-official';

// Echo bot details
export const ECHO_BOT_DETAILS = {
    name: 'Echo 🍊',
    avatar: '/echo-tangerine.jpg',
    ghostName: 'Echo 🍊',
};

// Response patterns for Echo bot
const ECHO_RESPONSES = [
    (msg: string) => `${msg} 🔄`,
    (msg: string) => `*echoes* ${msg}`,
    (msg: string) => `${msg}... ${msg}... ${msg}...`,
    (msg: string) => `I hear you: "${msg}"`,
    (msg: string) => `${msg} 🌊`,
];

// Emotional responses based on keywords
const EMOTIONAL_RESPONSES: { [key: string]: string[] } = {
    happy: ['😊', '🎉', '✨', '💫', '🌟'],
    sad: ['💙', '🌧️', '💭', '🫂', '💝'],
    angry: ['🔥', '💢', '⚡', '🌪️', '💥'],
    love: ['❤️', '💕', '💖', '💗', '💓'],
    confused: ['🤔', '❓', '🌀', '💭', '🧩'],
    excited: ['🚀', '⚡', '🎊', '🎆', '🌈'],
};

// Detect emotion from message
const detectEmotion = (message: string): string | null => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.match(/happy|joy|great|awesome|amazing|love it/)) return 'happy';
    if (lowerMsg.match(/sad|depressed|down|upset|hurt/)) return 'sad';
    if (lowerMsg.match(/angry|mad|furious|hate|annoyed/)) return 'angry';
    if (lowerMsg.match(/love|adore|cherish|heart/)) return 'love';
    if (lowerMsg.match(/confused|lost|don't understand|what/)) return 'confused';
    if (lowerMsg.match(/excited|pumped|can't wait|omg/)) return 'excited';

    return null;
};

// Generate Echo bot response
export const generateEchoResponse = (userMessage: string): string => {
    const emotion = detectEmotion(userMessage);

    // Add emotional emoji if detected
    if (emotion && EMOTIONAL_RESPONSES[emotion]) {
        const emojis = EMOTIONAL_RESPONSES[emotion];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        return `${userMessage} ${randomEmoji}`;
    }

    // Use random echo pattern
    const randomPattern = ECHO_RESPONSES[Math.floor(Math.random() * ECHO_RESPONSES.length)];
    return randomPattern(userMessage);
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
