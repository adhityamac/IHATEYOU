import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, serverTimestamp, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export const usePresence = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id || !db) return;

        const userRef = doc(db, 'users', user.id);

        // Initial set
        const setOnline = () => {
            setDoc(userRef, {
                isOnline: true,
                lastSeen: serverTimestamp()
            }, { merge: true });
        };

        setOnline();

        // Interval heartbeat (every minute)
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                setOnline();
            }
        }, 60000);

        // Visibility change handler
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setOnline();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        // Offline handler (disconnect)
        // Firestore doesn't support "onDisconnect" natively like Realtime DB, 
        // implies "online" is "seen recently".
        // But we can verify "isOnline" flag optimistically.

        return () => {
            clearInterval(interval);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user?.id]);
};
