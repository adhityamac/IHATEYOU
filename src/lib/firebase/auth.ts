import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    UserCredential,
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { auth, db } from './config';

// User profile interface
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    ghostName?: string;
    createdAt: Timestamp;
    lastLoginAt: Timestamp;
    theme?: string;
    preferences?: {
        notifications?: boolean;
        soundEnabled?: boolean;
    };
}

// Google Sign-In
export const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account',
    });

    try {
        const result = await signInWithPopup(auth, provider);

        // Create or update user profile in Firestore
        await createOrUpdateUserProfile(result.user);

        return result;
    } catch (error: any) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

// Create or update user profile in Firestore
export const createOrUpdateUserProfile = async (user: User): Promise<void> => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const userData: Partial<UserProfile> = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLoginAt: serverTimestamp() as Timestamp,
    };

    if (userSnap.exists()) {
        // Update existing user
        await updateDoc(userRef, userData);
    } else {
        // Create new user
        await setDoc(userRef, {
            ...userData,
            createdAt: serverTimestamp(),
            preferences: {
                notifications: true,
                soundEnabled: true,
            },
        });
    }
};

// Update user's ghost name
export const updateGhostName = async (uid: string, ghostName: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { ghostName });
};

// Update user theme
export const updateUserTheme = async (uid: string, theme: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { theme });
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }

    return null;
};

// Sign out
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
