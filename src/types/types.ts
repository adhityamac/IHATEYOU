export type Section = 'home' | 'dashboard' | 'messages' | 'settings' | 'search' | 'guide' | 'social';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  currentEmotion?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  reactions?: Reaction[];
  size?: 'small' | 'medium' | 'large';
  replyTo?: {
    id: string;
    username: string;
    content: string;
  };
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Story {
  id: string;
  userId: string;
  username: string; // Added for UI
  userAvatar: string; // Added for UI
  imageUrl: string;
  isViewed: boolean;
  timestamp: Date; // Added for sorting
}

export interface EmojiAvatar {
  emojis: string[];
  background?: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Post {
  id: number;
  user: string;
  username?: string; // Added
  avatar?: string; // Added
  content: string;
  image?: string; // Added for media posts
  time: string;
  color?: string; // Optional now
  echoes: number; // Likes
  replies: number; // Comments
  isLiked?: boolean; // UI state
}