import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInAnonymously as firebaseSignInAnonymously,
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
import { auth, db } from '@/lib/firebase';
import { UserProfile, OnboardingData } from '@/types/user';

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

// Anonymous Sign-In
export const signInAnonymously = async (): Promise<UserCredential | null> => {
    try {
        const result = await firebaseSignInAnonymously(auth);

        // Ensure profile is created
        await createOrUpdateUserProfile(result.user);

        return result;
    } catch (error: any) {
        // Suppress Firebase error logging for guest mode
        if (error?.code === 'auth/admin-restricted-operation' || error?.code === 'auth/operation-not-allowed') {
            // Return null to indicate guest mode should be used
            return null;
        }
        console.error('Error signing in anonymously:', error);
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

// Update user's onboarding data
export const updateUserOnboardingData = async (
    uid: string,
    data: OnboardingData
): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        ghostName: data.ghostName,
        moodBaseline: data.moodBaseline,
        intent: data.intent,
        onboardingComplete: true // Mark as complete in DB too if needed, though we use ghostName check currently
    });
};

// Update user's ghost name (Legacy / Individual update)
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
