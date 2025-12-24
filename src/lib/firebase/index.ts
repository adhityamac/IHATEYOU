// Firebase configuration and services
export { auth, db } from './config';
export {
    signInWithGoogle,
    signOut,
    onAuthStateChange,
    getCurrentUser,
    getUserProfile,
    createOrUpdateUserProfile,
    updateGhostName,
    updateUserTheme,
    type UserProfile,
} from './auth';
export { useAuth, AuthProvider } from './AuthContext';
