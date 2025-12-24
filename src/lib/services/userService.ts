import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseUser {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar: string;
    mood: string;
    moodBaseline: string;
    intent: string[];
    authMethod: 'google' | 'phone' | 'email';
    onboardingComplete: boolean;
    createdAt: Timestamp;
    lastActive: Timestamp;
    isOnline: boolean;
}

/**
 * Create a new user document in Firestore
 */
export async function createUser(userId: string, userData: Partial<FirebaseUser>) {
    try {
        const userRef = doc(db, 'users', userId);

        const newUser: FirebaseUser = {
            id: userId,
            name: userData.name || 'Anonymous',
            email: userData.email,
            phone: userData.phone,
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            mood: userData.mood || '😶',
            moodBaseline: userData.moodBaseline || 'calm',
            intent: userData.intent || [],
            authMethod: userData.authMethod || 'email',
            onboardingComplete: userData.onboardingComplete || false,
            createdAt: serverTimestamp() as Timestamp,
            lastActive: serverTimestamp() as Timestamp,
            isOnline: true,
        };

        await setDoc(userRef, newUser);
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Get user document from Firestore
 */
export async function getUser(userId: string): Promise<FirebaseUser | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as FirebaseUser;
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

/**
 * Update user document
 */
export async function updateUser(userId: string, updates: Partial<FirebaseUser>) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...updates,
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

/**
 * Update user online status
 */
export async function setUserOnlineStatus(userId: string, isOnline: boolean) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isOnline,
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating online status:', error);
        throw error;
    }
}

/**
 * Complete user onboarding
 */
export async function completeUserOnboarding(
    userId: string,
    onboardingData: { name: string; moodBaseline: string; intent: string[] }
) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            name: onboardingData.name,
            moodBaseline: onboardingData.moodBaseline,
            intent: onboardingData.intent,
            onboardingComplete: true,
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error completing onboarding:', error);
        throw error;
    }
}

/**
 * Search users by name
 */
export async function searchUsers(searchTerm: string): Promise<FirebaseUser[]> {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as FirebaseUser);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}

/**
 * Get online users
 */
export async function getOnlineUsers(): Promise<FirebaseUser[]> {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('isOnline', '==', true));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as FirebaseUser);
    } catch (error) {
        console.error('Error getting online users:', error);
        throw error;
    }
}
