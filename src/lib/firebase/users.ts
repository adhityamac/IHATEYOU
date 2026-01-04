import {
    collection,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    limit,
    orderBy,
    startAfter,
    QueryDocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from './auth';

// Search users by ghost name
export const searchUsersByGhostName = async (
    searchTerm: string,
    limitCount: number = 20
): Promise<UserProfile[]> => {
    try {
        if (!searchTerm.trim()) return [];

        const q = query(
            collection(db, 'users'),
            where('ghostName', '>=', searchTerm),
            where('ghostName', '<=', searchTerm + '\uf8ff'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.data() as UserProfile);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

// Get random users for discovery (excluding current user and Echo bot)
export const getRandomUsers = async (
    currentUserId: string,
    limitCount: number = 10
): Promise<UserProfile[]> => {
    try {
        // Fetch all users with a reasonable limit
        // We can't use where('uid', '!=', currentUserId) without orderBy('uid')
        // So we fetch more users and filter client-side
        const q = query(
            collection(db, 'users'),
            limit(limitCount * 3) // Fetch 3x to ensure enough after filtering
        );

        const snapshot = await getDocs(q);
        const users = snapshot.docs
            .map((doc) => doc.data() as UserProfile)
            .filter((user) =>
                user.uid !== currentUserId &&
                user.uid !== 'echo-bot-official' // Filter out current user and Echo bot
            )
            .slice(0, limitCount);

        // Shuffle array for randomness
        return users.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error getting random users:', error);
        throw error;
    }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<UserProfile | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

// Get multiple users by IDs
export const getUsersByIds = async (userIds: string[]): Promise<UserProfile[]> => {
    try {
        if (userIds.length === 0) return [];

        const userPromises = userIds.map((id) => getUserById(id));
        const users = await Promise.all(userPromises);

        return users.filter((user) => user !== null) as UserProfile[];
    } catch (error) {
        console.error('Error getting users by IDs:', error);
        throw error;
    }
};

// Get users with pagination
export const getUsersWithPagination = async (
    lastDoc: QueryDocumentSnapshot<DocumentData> | null,
    limitCount: number = 20
): Promise<{ users: UserProfile[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
    try {
        let q;

        if (lastDoc) {
            q = query(
                collection(db, 'users'),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(limitCount)
            );
        } else {
            q = query(
                collection(db, 'users'),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
        }

        const snapshot = await getDocs(q);
        const users = snapshot.docs.map((doc) => doc.data() as UserProfile);
        const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

        return { users, lastDoc: newLastDoc };
    } catch (error) {
        console.error('Error getting users with pagination:', error);
        throw error;
    }
};
