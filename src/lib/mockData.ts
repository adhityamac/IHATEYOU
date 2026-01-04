import { User, Message, Conversation } from '@/types/types';

// Mock Data
export const DEFAULT_USER: User = {
    id: 'user-1',
    name: 'You',
    username: 'you',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    isOnline: true,
};

export const mockUsers: User[] = [
    {
        id: 'user-2',
        name: 'Alex',
        username: 'alex',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        isOnline: true,
    },
    {
        id: 'user-3',
        name: 'Sarah',
        username: 'sarah',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        isOnline: false,
    },
    {
        id: 'user-4',
        name: 'Mike',
        username: 'mike',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        isOnline: true,
    },
    {
        id: 'user-5',
        name: 'Emma',
        username: 'emma',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        isOnline: true,
    },
    {
        id: 'user-6',
        name: 'James',
        username: 'james',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        isOnline: false,
    },
];

export const createMockMessages = (userId: string): Message[] => [
    {
        id: '1',
        senderId: userId,
        content: 'Hey! How are you doing? 👋',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
    },
    {
        id: '2',
        senderId: DEFAULT_USER.id,
        content: "I'm doing great! Just working on this new chat app 🚀",
        timestamp: new Date(Date.now() - 3500000),
        isRead: true,
    },
    {
        id: '3',
        senderId: userId,
        content: 'That sounds awesome! What features are you adding?',
        timestamp: new Date(Date.now() - 3400000),
        isRead: true,
    },
    {
        id: '4',
        senderId: DEFAULT_USER.id,
        content: 'Emoji support, real-time messaging, and a sleek dark mode design! 😎✨',
        timestamp: new Date(Date.now() - 3300000),
        isRead: true,
        reactions: [
            { emoji: '🔥', userId: 'user-2' },
            { emoji: '❤️', userId: 'user-3' }
        ],
    },
    {
        id: '5',
        senderId: userId,
        content: "Love it! Can't wait to try it out! 🎉",
        timestamp: new Date(Date.now() - 1800000),
        isRead: true,
    },
];

export const initialConversations: Conversation[] = mockUsers.map((user, index) => ({
    id: `conv-${user.id}`,
    participant: user,
    messages: createMockMessages(user.id),
    lastMessage: createMockMessages(user.id)[createMockMessages(user.id).length - 1],
    unreadCount: index === 0 ? 0 : Math.floor(Math.random() * 3),
}));

export const INITIAL_POSTS = [
    { id: 1, user: 'You', content: 'Just synced my neural core. Feeling balanced. 💎', time: '1m', color: 'from-rose-500 to-orange-500', echoes: 42, replies: 3 },
    { id: 2, user: 'Luna', content: 'The silence here is loud today. 🌌', time: '5m', color: 'from-purple-500 to-blue-500', echoes: 124, replies: 12 },
    { id: 3, user: 'Ghost', content: 'Echoes of a digital past. Who else still feels it?', time: '15m', color: 'from-pink-500 to-rose-500', echoes: 89, replies: 5 },
    { id: 4, user: 'VoidWalker', content: 'Scanning the frequency... resonance detected at 42Hz.', time: '1h', color: 'from-cyan-500 to-emerald-500', echoes: 432, replies: 45 }
];