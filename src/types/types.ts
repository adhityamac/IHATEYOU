export type Section = 'home' | 'dashboard' | 'messages' | 'settings' | 'search' | 'guide';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
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
  imageUrl: string;
  isViewed: boolean;
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
  content: string;
  time: string;
  color: string;
  echoes: number;
  replies: number;
}