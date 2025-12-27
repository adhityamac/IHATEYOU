import {
    doc,
    updateDoc,
    getDoc,
} from 'firebase/firestore';
import { db } from './config';

// User preferences interface
export interface UserPreferences {
    readReceipts: boolean;
    onlineStatus: boolean;
    typingIndicators: boolean;
    profileVisibility: boolean;
    notifications: boolean;
    soundEnabled: boolean;
}

// Update user preferences
export const updateUserPreferences = async (
    userId: string,
    preferences: Partial<UserPreferences>
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            'preferences': preferences,
        });
    } catch (error) {
        console.error('Error updating user preferences:', error);
        throw error;
    }
};

// Get user preferences
export const getUserPreferences = async (
    userId: string
): Promise<UserPreferences | null> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            return data.preferences as UserPreferences || null;
        }

        return null;
    } catch (error) {
        console.error('Error getting user preferences:', error);
        throw error;
    }
};

// Update user bio
export const updateUserBio = async (
    userId: string,
    bio: string
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { bio });
    } catch (error) {
        console.error('Error updating user bio:', error);
        throw error;
    }
};
