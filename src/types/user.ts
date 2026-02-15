import { Timestamp } from 'firebase/firestore';

export interface UserTheme {
    primary: string;
    secondary: string;
    gradient: string;
}

export interface UserStats {
    posts: number;
    followers: number;
    following: number;
    streak: number;
}

export interface OnboardingData {
    ghostName: string;
    moodBaseline: string;
    intent: string[];
}

export interface UserProfile {
    id: string;
    uid?: string;
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
    coverImage?: string;
    theme: UserTheme;
    badges: string[];
    stats: UserStats;
    email?: string;
    phone?: string;
    ghostName?: string;
    moodBaseline?: string;
    intent?: string;
    photoURL?: string | null;
    lastLoginAt?: Timestamp;
    createdAt?: Timestamp;
    onboardingComplete?: boolean;
    preferences?: {
        notifications: boolean;
        soundEnabled: boolean;
    };
}