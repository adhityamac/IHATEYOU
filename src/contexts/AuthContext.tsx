'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, getUserProfile, updateGhostName, updateUserOnboardingData, updateUserTheme, signOut as firebaseSignOut } from '@/lib/firebase/auth';
import { createEchoBotConversation } from '@/lib/bots/echo';

interface UserProfile {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar: string;
    authMethod: 'google' | 'phone' | 'email';
    onboardingComplete: boolean;
    moodBaseline?: string;
    intent?: string[];
    ghostName?: string;
    theme?: string;
    createdAt: Date;
}

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    setUser: (user: UserProfile | null) => void;
    completeOnboarding: (data: { name: string; moodBaseline: string; intent: string[] }) => Promise<void>;
    updateUserGhostName: (ghostName: string) => Promise<void>;
    updateTheme: (theme: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (authUser) => {
            setFirebaseUser(authUser);

            if (authUser) {
                try {
                    // Fetch user profile from Firestore
                    const profile = await getUserProfile(authUser.uid);

                    if (profile) {
                        // Convert Firestore profile to our UserProfile format
                        setUser({
                            id: profile.uid,
                            name: profile.displayName || 'User',
                            email: profile.email || undefined,
                            phone: undefined,
                            avatar: profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`,
                            authMethod: 'google', // Default to google for now
                            onboardingComplete: !!profile.ghostName, // If they have a ghost name, onboarding is complete
                            moodBaseline: profile.moodBaseline,
                            intent: profile.intent,
                            ghostName: profile.ghostName,
                            theme: profile.theme,
                            createdAt: profile.createdAt?.toDate() || new Date()
                        });
                    } else {
                        // Create basic profile if none exists
                        const basicProfile: UserProfile = {
                            id: authUser.uid,
                            name: authUser.displayName || 'User',
                            email: authUser.email || undefined,
                            phone: authUser.phoneNumber || undefined,
                            avatar: authUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.uid}`,
                            authMethod: authUser.providerData[0]?.providerId.includes('google') ? 'google' :
                                authUser.providerData[0]?.providerId.includes('phone') ? 'phone' : 'email',
                            onboardingComplete: false,
                            createdAt: new Date()
                        };
                        setUser(basicProfile);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    // Fallback to basic profile from Firebase auth
                    const basicProfile: UserProfile = {
                        id: authUser.uid,
                        name: authUser.displayName || 'User',
                        email: authUser.email || undefined,
                        phone: authUser.phoneNumber || undefined,
                        avatar: authUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.uid}`,
                        authMethod: 'google',
                        onboardingComplete: false,
                        createdAt: new Date()
                    };
                    setUser(basicProfile);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const completeOnboarding = async (data: { name: string; moodBaseline: string; intent: string[] }) => {
        if (user && firebaseUser) {
            try {
                // Update user onboarding data in Firestore
                await updateUserOnboardingData(firebaseUser.uid, {
                    ghostName: data.name,
                    moodBaseline: data.moodBaseline,
                    intent: data.intent
                });

                const updatedUser: UserProfile = {
                    ...user,
                    ghostName: data.name,
                    moodBaseline: data.moodBaseline,
                    intent: data.intent,
                    onboardingComplete: true,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
                };
                setUser(updatedUser);

                // Create Echo bot conversation for new user
                try {
                    await createEchoBotConversation(
                        firebaseUser.uid,
                        updatedUser.name,
                        updatedUser.avatar,
                        updatedUser.ghostName
                    );
                    console.log('Echo bot conversation created successfully');
                } catch (echoError) {
                    console.error('Error creating Echo bot conversation:', echoError);
                    // Don't throw - onboarding should still complete
                }
            } catch (error) {
                console.error('Error completing onboarding:', error);
                throw error;
            }
        }
    };

    const updateUserGhostName = async (ghostName: string) => {
        if (user && firebaseUser) {
            try {
                await updateGhostName(firebaseUser.uid, ghostName);
                setUser({ ...user, ghostName });
            } catch (error) {
                console.error('Error updating ghost name:', error);
                throw error;
            }
        }
    };

    const updateTheme = async (theme: string) => {
        if (user && firebaseUser) {
            try {
                await updateUserTheme(firebaseUser.uid, theme);
                setUser({ ...user, theme });
            } catch (error) {
                console.error('Error updating theme:', error);
                throw error;
            }
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut();
            setUser(null);
            setFirebaseUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            firebaseUser,
            loading,
            setUser,
            completeOnboarding,
            updateUserGhostName,
            updateTheme,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
