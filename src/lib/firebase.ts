/**
 * Firebase Configuration - Single Source of Truth
 * 
 * This is the ONLY place where Firebase should be initialized.
 * All other files should import from here.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Validate required environment variables
// Check if Firebase credentials are available
// FORCED GUEST MODE: Temporarily disabled to prevent invalid API key crash
const hasFirebaseCredentials = false;
/* !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
); */

// Firebase configuration from environment variables
const firebaseConfig = hasFirebaseCredentials ? {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
} : null;

// Initialize Firebase (singleton pattern) with error handling
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
    if (firebaseConfig && hasFirebaseCredentials) {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();

        // Configure Google Provider
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });

        console.log('✅ Firebase initialized successfully');
    } else {
        console.warn('⚠️ Firebase credentials not configured - running in guest mode');
    }
} catch (error: any) {
    console.warn('⚠️ Firebase initialization failed - running in guest mode:', error.message);
    // Reset to null on error
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
}

export { app, auth, db, googleProvider, hasFirebaseCredentials };
export default app;
