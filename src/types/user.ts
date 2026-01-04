/**
 * User Type Definitions
 * Consolidated user model for the entire application
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Main User Profile Type
 * This is the canonical user type used throughout the application
 */
export interface UserProfile {
    // Core Identity
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;

    // App-specific Identity
    ghostName?: string;
    avatar?: string;

    // Wellness Data
    mood?: string;
    moodBaseline?: string;
    intent?: string[];

    // Auth & Status
    authMethod?: 'google' | 'phone' | 'email' | 'anonymous';
    isOnline?: boolean;
    onboardingComplete?: boolean;

    // Timestamps
    createdAt: Timestamp;
    lastLoginAt?: Timestamp;
    lastActive?: Timestamp;

    // Preferences
    theme?: string;
    preferences?: {
        notifications?: boolean;
        soundEnabled?: boolean;
    };
}

/**
 * Minimal User Info
 * Used for lightweight user references (e.g., in conversations)
 */
export interface MinimalUserInfo {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    ghostName?: string;
}

/**
 * User Update Data
 * Type for partial user updates
 */
export type UserUpdateData = Partial<Omit<UserProfile, 'uid' | 'createdAt'>>;

/**
 * Onboarding Data
 * Data collected during user onboarding
 */
export interface OnboardingData {
    ghostName: string;
    moodBaseline: string;
    intent: string[];
}
