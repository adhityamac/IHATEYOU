import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserPresence {
    isOnline: boolean;
    lastSeen?: Date;
}

export const useUsersPresence = (userIds: string[]) => {
    const [presenceData, setPresenceData] = useState<Record<string, UserPresence>>({});

    useEffect(() => {
        if (userIds.length === 0 || !db) return;

        // Dedup ids
        const uniqueIds = Array.from(new Set(userIds));
        const unsubscribes: (() => void)[] = [];
        const firestore = db;

        uniqueIds.forEach(uid => {
            const userRef = doc(firestore, 'users', uid);
            const unsub = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const lastSeen = data.lastSeen?.toDate();
                    const isOnline = data.isOnline === true || (
                        lastSeen && (Date.now() - lastSeen.getTime() < 5 * 60 * 1000) // 5 minutes timeout
                    );

                    setPresenceData(prev => ({
                        ...prev,
                        [uid]: {
                            isOnline: !!isOnline,
                            lastSeen
                        }
                    }));
                }
            });
            unsubscribes.push(unsub);
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [JSON.stringify(userIds)]); // dependent on id list changing

    return presenceData;
};
