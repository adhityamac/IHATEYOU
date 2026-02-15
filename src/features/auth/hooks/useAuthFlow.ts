import { useState } from 'react';
import {
    signInAnonymously,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    getIdToken,
} from '@/lib/firebase/auth';
import { auth, hasFirebaseCredentials } from '@/lib/firebase';
import { updateProfile, User } from 'firebase/auth';
import {
    validateEmail,
    validatePassword,
    validateGhostName,
    sanitizeInput,
} from '@/lib/validation';

export type AuthMode = 'signin' | 'signup';

export interface AuthState {
    mode: AuthMode;
    isLoading: boolean;
    error: string | null;
    ghostName: string;
    email: string;
    password: string;
}

export interface AuthActions {
    setMode: (mode: AuthMode) => void;
    setGhostName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleEnterVoid: () => Promise<void>;
    handleGoogleLogin: () => Promise<void>;
    handleEmailSignUp: () => Promise<void>;
    handleEmailSignIn: () => Promise<void>;
    setError: (error: string | null) => void;
}

interface UseAuthFlowProps {
    onAuthSuccess: (user: any) => void;
}

/** Post-auth: exchange Firebase ID token for httpOnly session cookie */
async function createSessionCookie(): Promise<void> {
    const idToken = await getIdToken();
    if (!idToken) return;

    await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });
}

export const useAuthFlow = ({ onAuthSuccess }: UseAuthFlowProps) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [ghostName, setGhostName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatUserData = (user: User | null, method: string, isGuest = false) => {
        if (!user && isGuest) {
            return {
                id: 'guest-' + Date.now(),
                name: sanitizeInput(ghostName),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(ghostName)}`,
                authMethod: 'guest',
                onboardingComplete: true,
            };
        }

        if (!user) return null;

        return {
            id: user.uid,
            name: user.displayName || sanitizeInput(ghostName) || 'Soul',
            email: user.email,
            avatar: user.photoURL,
            authMethod: method,
        };
    };

    // Anonymous / Guest entry
    const handleEnterVoid = async () => {
        const nameCheck = validateGhostName(ghostName);
        if (!nameCheck.valid) {
            setError(nameCheck.error ?? 'Invalid identity.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await signInAnonymously();

            if (!result) {
                // Guest fallback — no Firebase
                onAuthSuccess(formatUserData(null, 'guest', true));
            } else {
                const user = auth?.currentUser;
                if (user) {
                    await updateProfile(user, { displayName: sanitizeInput(ghostName) });
                }
                await createSessionCookie();
                onAuthSuccess(formatUserData(result.user, 'ghost'));
            }
        } catch (e: unknown) {
            console.error('Auth Failed:', e);
            onAuthSuccess(formatUserData(null, 'guest', true));
        } finally {
            setIsLoading(false);
        }
    };

    // Google OAuth
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);

        if (!hasFirebaseCredentials) {
            setError('Firebase not configured. Running in guest mode.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await signInWithGoogle();
            await createSessionCookie();
            onAuthSuccess(formatUserData(result.user, 'google'));
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Connection failed';
            console.error(message);
            setError('Connection severed. The void rejects this request.');
            setIsLoading(false);
        }
    };

    // Email/Password Sign Up
    const handleEmailSignUp = async () => {
        const nameCheck = validateGhostName(ghostName);
        if (!nameCheck.valid) {
            setError(nameCheck.error ?? 'Invalid identity.');
            return;
        }

        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            setError(emailCheck.error ?? 'Invalid email.');
            return;
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            setError(passwordCheck.error ?? 'Weak password.');
            return;
        }

        if (!hasFirebaseCredentials) {
            // Guest fallback when Firebase is not configured
            setIsLoading(true);
            setError(null);
            onAuthSuccess(formatUserData(null, 'guest', true));
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await signUpWithEmail(
                email.trim(),
                password,
                sanitizeInput(ghostName)
            );
            await createSessionCookie();
            onAuthSuccess(formatUserData(result.user, 'email'));
        } catch (e: unknown) {
            const firebaseError = e as { code?: string; message?: string };
            if (firebaseError.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Try signing in.');
            } else if (firebaseError.code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 8 characters with a number and uppercase letter.');
            } else {
                setError('Failed to create account. Please try again.');
            }
            console.error('Email signup error:', firebaseError.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Email/Password Sign In
    const handleEmailSignIn = async () => {
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            setError(emailCheck.error ?? 'Invalid email.');
            return;
        }

        if (!password.trim()) {
            setError('Password is required.');
            return;
        }

        if (!hasFirebaseCredentials) {
            setError('Firebase not configured. Use guest mode.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await signInWithEmail(email.trim(), password);
            await createSessionCookie();
            onAuthSuccess(formatUserData(result.user, 'email'));
        } catch (e: unknown) {
            const firebaseError = e as { code?: string };
            if (
                firebaseError.code === 'auth/user-not-found' ||
                firebaseError.code === 'auth/wrong-password' ||
                firebaseError.code === 'auth/invalid-credential'
            ) {
                setError('Invalid email or password.');
            } else if (firebaseError.code === 'auth/too-many-requests') {
                setError('Too many attempts. Try again later.');
            } else {
                setError('Sign in failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        state: { mode, isLoading, error, ghostName, email, password },
        actions: {
            setMode,
            setGhostName,
            setEmail,
            setPassword,
            handleEnterVoid,
            handleGoogleLogin,
            handleEmailSignUp,
            handleEmailSignIn,
            setError,
        },
    };
};
