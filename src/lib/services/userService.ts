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
import { UserProfile } from '@/types/user';

/**
 * @deprecated This interface is deprecated. Use UserProfile from @/types/user instead.
 * Kept for backward compatibility only.
 */
export interface FirebaseUser extends UserProfile {
    id: string; // Alias for uid
    name: string; // Alias for displayName
    avatar: string; // Alias for photoURL
    mood: string;
    authMethod: 'google' | 'phone' | 'email';
    onboardingComplete: boolean;
    lastActive: Timestamp;
    isOnline: boolean;
}

/**
 * Create a new user document in Firestore
 */
export async function createUser(userId: string, userData: Partial<FirebaseUser> & { moodBaseline?: string; intent?: string[] }) {
    try {
        if (!db) {
            console.warn('Firebase DB not initialized - running in guest mode (createUser)');
            // Return a mock user for guest mode to prevent crashes
            const now = Timestamp.now();
            return {
                // UserProfile fields
                id: userId,
                username: userId, // Default to uid
                displayName: userData.name || 'Anonymous',
                bio: '',
                avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                email: userData.email || undefined,
                theme: { primary: '#000000', secondary: '#ffffff', gradient: 'none' },
                badges: [],
                stats: { posts: 0, followers: 0, following: 0, streak: 0 },

                // FirebaseUser specific
                uid: userId, // Legacy
                name: userData.name || 'Anonymous',
                mood: userData.mood || '😶',
                authMethod: userData.authMethod || 'email',
                onboardingComplete: userData.onboardingComplete || false,
                lastActive: now,
                isOnline: true,
                photoURL: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                createdAt: now,
                lastLoginAt: now,
            } as unknown as FirebaseUser;
        }

        const userRef = doc(db, 'users', userId);

        // Prepare the new user object
        // Note: casting to any to allow extra properties if needed, or stick to interface
        const newUser: any = {
            uid: userId,
            email: userData.email || null,
            displayName: userData.name || 'Anonymous',
            photoURL: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),

            // UserProfile defaults
            username: userId,
            bio: '',
            theme: { primary: '#000000', secondary: '#ffffff', gradient: 'none' },
            badges: [],
            stats: { posts: 0, followers: 0, following: 0, streak: 0 },

            // FirebaseUser specific
            id: userId,
            name: userData.name || 'Anonymous',
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            mood: userData.mood || '😶',
            moodBaseline: userData.moodBaseline || 'calm',
            intent: userData.intent || [],
            authMethod: userData.authMethod || 'email',
            onboardingComplete: userData.onboardingComplete || false,
            lastActive: serverTimestamp(),
            isOnline: true,
        };

        await setDoc(userRef, newUser);
        return newUser as FirebaseUser;
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
        if (!db) return null;
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
        if (!db) return;
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
        if (!db) return;
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
        if (!db) return;
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
        if (!db) return [];
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
        if (!db) return [];
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('isOnline', '==', true));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as FirebaseUser);
    } catch (error) {
        console.error('Error getting online users:', error);
        throw error;
    }
}
