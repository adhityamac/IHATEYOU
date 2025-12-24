import { User, EmojiAvatar, Message } from './types';

export interface Story {
    id: string;
    userId: string;
    emojis: string[];
    background?: string;
    timestamp: Date;
    expiresAt: Date;
    views: string[];
    reactions: { emoji: string; userId: string }[];
}

export interface Group {
    id: string;
    name: string;
    emojiName: string[];
    avatar?: string;
    emojiAvatar?: EmojiAvatar;
    members: User[];
    admins: string[];
    messages: Message[];
    createdAt: Date;
}
