import { useState } from 'react';
import { signInAnonymously, signInWithGoogle } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase';
import { updateProfile, User } from 'firebase/auth';

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
    setError: (error: string | null) => void;
}

interface UseAuthFlowProps {
    onAuthSuccess: (user: any) => void;
}

export const useAuthFlow = ({ onAuthSuccess }: UseAuthFlowProps) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [ghostName, setGhostName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to format user data for app consumption
    const formatUserData = (user: User | null, method: string, isGuest = false) => {
        if (!user && isGuest) {
            return {
                id: 'guest-' + Date.now(),
                name: ghostName,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ghostName}`,
                authMethod: 'guest',
                onboardingComplete: true
            };
        }

        if (!user) return null;

        return {
            id: user.uid,
            name: user.displayName || ghostName || 'Soul',
            email: user.email,
            avatar: user.photoURL,
            authMethod: method
        };
    };

    const handleEnterVoid = async () => {
        if (!ghostName.trim()) {
            setError("Identity required to enter the void.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const result = await signInAnonymously();

            if (!result) {
                // Guest Fallback
                console.warn("🎮 Using Guest Mode - Firebase Auth Disabled");
                onAuthSuccess(formatUserData(null, 'guest', true));
            } else {
                const user = auth?.currentUser;
                if (user) {
                    await updateProfile(user, { displayName: ghostName });
                }
                onAuthSuccess(formatUserData(result.user, 'ghost'));
            }
        } catch (e: any) {
            console.error("Auth Failed:", e);
            // Fallback to guest mode on error
            onAuthSuccess(formatUserData(null, 'guest', true));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithGoogle();
            onAuthSuccess(formatUserData(result.user, 'google'));
        } catch (e: any) {
            console.error(e);
            setError("Connection severed. The void rejects this request.");
            setIsLoading(false);
        }
    };

    const handleEmailSignUp = async () => {
        if (!email.trim() || !password.trim() || !ghostName.trim()) {
            setError("All fields must be filled to manifest existence.");
            return;
        }
        setIsLoading(true);
        setError(null);

        // Mock implementation for now as per original code
        console.warn("🎮 Using Guest Mode - Email Sign Up (Mock)");
        setTimeout(() => {
            setIsLoading(false);
            onAuthSuccess({
                id: 'guest-email-' + Date.now(),
                name: ghostName,
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ghostName}`,
                authMethod: 'email',
                onboardingComplete: true
            });
        }, 800);
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
            setError
        }
    };
};
