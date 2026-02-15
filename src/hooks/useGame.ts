import { useState, useEffect } from 'react';
import { FirestoreGame, subscribeToGame, makeMove } from '@/lib/firebase/games';
import { useAuth } from '@/contexts/AuthContext';

export const useGame = (gameId: string | null) => {
    const { user } = useAuth();
    const [game, setGame] = useState<FirestoreGame | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) {
            setGame(null);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToGame(gameId, (data) => {
            setGame(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [gameId]);

    const handleMove = async (from: string, to: string) => {
        if (!gameId || !user) return;
        try {
            await makeMove(gameId, user.id, from, to);
        } catch (err: any) {
            console.error('Move failed:', err);
            setError(err.message);
            // Clear error after 2s
            setTimeout(() => setError(null), 2000);
        }
    };

    return {
        game,
        loading,
        error,
        makeMove: handleMove,
        isPlayerTurn: game?.turn === (game?.players.w === user?.id ? 'w' : 'b'),
        playerColor: game?.players.w === user?.id ? 'w' : (game?.players.b === user?.id ? 'b' : null)
    };
};
