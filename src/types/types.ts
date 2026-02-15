export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: Date | any; // Firestore Timestamp or Date
    bio?: string;
    phone?: string;
    ghostName?: string;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    size: 'small' | 'medium' | 'large';
    reactions: { emoji: string; userId?: string }[];
    replyTo?: {
        id: string;
        username: string;
        content: string;
    };
}

export interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
    unreadCount: number;
}

export type Section = 'home' | 'dashboard' | 'messages' | 'social' | 'search' | 'guide' | 'settings' | 'games' | 'music' | 'vision';