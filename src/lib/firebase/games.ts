import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    runTransaction,
    Timestamp
} from 'firebase/firestore';
import { ChessEngine } from '@/features/games/logic/chessEngine';
import { GameState, Move, PieceColor } from '@/types/chess';

export interface FirestoreGame {
    id: string;
    players: {
        w?: string;
        b?: string;
    };
    board: string; // FEN
    fen: string; // Redundant but explicit
    turn: PieceColor;
    status: 'waiting' | 'active' | 'completed' | 'abandoned';
    winner?: PieceColor | 'draw';
    moves: Array<{
        from: string;
        to: string;
        san: string; // Standard Algebraic Notation
        timestamp: Timestamp;
        playerId: string;
    }>;
    createdAt: Timestamp;
    lastMoveAt?: Timestamp;
}

const GAMES_COLLECTION = 'games';

// Helper to sanitize undefined values
const cleanData = (data: any) => {
    return JSON.parse(JSON.stringify(data));
};

export const createGame = async (userId: string): Promise<string> => {
    if (!db) throw new Error('Firebase not initialized');

    const engine = new ChessEngine(); // Start fresh
    const gameRef = doc(collection(db, GAMES_COLLECTION));

    // 50% chance to be white or black? For now, creator is White.
    const gameData: Omit<FirestoreGame, 'id'> = {
        players: {
            w: userId
        },
        board: engine.getFen(),
        fen: engine.getFen(),
        turn: 'w',
        status: 'waiting',
        moves: [],
        createdAt: serverTimestamp() as Timestamp
    };

    await setDoc(gameRef, gameData);
    return gameRef.id;
};

export const joinGame = async (gameId: string, userId: string): Promise<void> => {
    if (!db) throw new Error('Firebase not initialized');

    const gameRef = doc(db, GAMES_COLLECTION, gameId);

    await runTransaction(db, async (transaction) => {
        const gameDoc = await transaction.get(gameRef);
        if (!gameDoc.exists()) throw new Error('Game not found');

        const data = gameDoc.data() as FirestoreGame;

        if (data.status !== 'waiting') {
            // Check if user is already in the game (re-joining)
            if (data.players.w === userId || data.players.b === userId) return;
            throw new Error('Game is not open for joining');
        }

        if (data.players.w === userId) return; // Already joined as white

        // Assign Black to joiner
        transaction.update(gameRef, {
            'players.b': userId,
            status: 'active'
        });
    });
};

export const makeMove = async (gameId: string, userId: string, from: string, to: string): Promise<void> => {
    if (!db) throw new Error('Firebase not initialized');

    const gameRef = doc(db, GAMES_COLLECTION, gameId);

    await runTransaction(db, async (transaction) => {
        const gameDoc = await transaction.get(gameRef);
        if (!gameDoc.exists()) throw new Error('Game not found');

        const data = gameDoc.data() as FirestoreGame;

        if (data.status !== 'active') throw new Error('Game is not active');

        // Verify turn
        const playerColor = data.players.w === userId ? 'w' : (data.players.b === userId ? 'b' : null);
        if (!playerColor) throw new Error('User is not a player in this game');
        if (data.turn !== playerColor) throw new Error('Not your turn');

        // Validate move with engine
        const engine = new ChessEngine(data.fen);
        const result = engine.makeMove(from, to, 'q'); // Auto-queen for now

        if (!result) throw new Error('Invalid move');

        // Update Game State
        const newState = engine.getGameState();

        // Fix TS narrowing
        let status: FirestoreGame['status'] = data.status;
        let winner = data.winner;

        if (newState.isCheckmate) {
            status = 'completed';
            winner = newState.winner;
        } else if (newState.isDraw || newState.isStalemate) {
            status = 'completed';
            winner = 'draw';
        }

        const newMove = {
            from,
            to,
            san: newState.history[newState.history.length - 1] || `${from}-${to}`,
            timestamp: Timestamp.now(),
            playerId: userId
        };

        transaction.update(gameRef, {
            fen: newState.fen,
            board: newState.fen,
            turn: newState.turn,
            status,
            winner: winner || null, // null is better than undefined for Firestore
            lastMoveAt: serverTimestamp(),
            moves: [...data.moves, newMove]
        });
    });
};

export const abandonGame = async (gameId: string, userId: string): Promise<void> => {
    if (!db) throw new Error('Firebase not initialized');

    const gameRef = doc(db, GAMES_COLLECTION, gameId);

    await runTransaction(db, async (transaction) => {
        const gameDoc = await transaction.get(gameRef);
        if (!gameDoc.exists()) throw new Error('Game not found');

        const data = gameDoc.data() as FirestoreGame;

        if (data.status !== 'active') throw new Error('Game is not active');

        // Determine forfeiter and winner
        const winner = data.players.w === userId ? 'b' : (data.players.b === userId ? 'w' : null);
        if (!winner) throw new Error('User is not a player in this game');

        transaction.update(gameRef, {
            status: 'abandoned', // or 'completed' depending on how we handle it
            winner: winner
        });
    });
};

export const subscribeToGame = (gameId: string, callback: (game: FirestoreGame | null) => void) => {
    if (!db) return () => { };

    return onSnapshot(doc(db, GAMES_COLLECTION, gameId), (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() } as FirestoreGame);
        } else {
            callback(null);
        }
    });
};
