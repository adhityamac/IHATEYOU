'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Users, Bot, RotateCcw, Swords, Cpu, Globe, Copy, Check } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';
import { useGame } from '@/hooks/useGame';
import { createGame, joinGame } from '@/lib/firebase/games';
import { useAuth } from '@/contexts/AuthContext';

// --- Assets: 1-Bit Pixel Art ---

// 12x16 Grid Patterns (Matched to Reference Image)
const PIXEL_PATTERNS: Record<string, string[]> = {
    // PAWN: Wide base, round head, simple body
    p: [
        "............",
        "....XXXX....",
        "...XXXXXX...",
        "...XXXXXX...",
        "....XXXX....",
        "....XXXX....",
        ".....XX.....",
        "....XXXX....",
        "...XXXXXX...",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX",
        ".XXXXXXXXXX.",
        "............"
    ],
    // ROOK: Crenellations, tower look
    r: [
        ".XX..XX..XX.",
        ".XX..XX..XX.",
        ".XXXXXXXXXX.",
        ".XXXXXXXXXX.",
        "..XXXXXXXX..",
        "..XXXXXXXX..",
        "...XXXXXX...",
        "...XXXXXX...",
        "...XXXXXX...",
        "...XXXXXX...",
        "...XXXXXX...",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX"
    ],
    // KNIGHT: Horse head profile
    n: [
        "......XXXX..",
        ".....XXXXXX.",
        "....XXXXXXX.",
        "...XXX.XXXX.",
        "..XXX..XXXX.",
        ".XXX...XXXX.",
        ".XX....XXXX.",
        ".......XXXX.",
        "......XXXX..",
        ".....XXXX...",
        ".....XXXX...",
        "....XXXXXX..",
        "...XXXXXXX..",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX"
    ],
    // BISHOP: Mitre hat with cross, tall
    b: [
        ".....XX.....",
        "....XXXX....",
        "...XXXXXX...",
        "..XX.XX.XX..",
        "..XX.XX.XX..",
        "...XXXXXX...",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "...XXXXXX...",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX"
    ],
    // QUEEN: 3-point Crown, very tall
    q: [
        ".X...XX...X.",
        ".XX..XX..XX.",
        ".XX.XXXX.XX.",
        "..XXXXXXXX..",
        "...XXXXXX...",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "...XXXXXX...",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX"
    ],
    // KING: Cross on top, tallest, wide
    k: [
        ".....XX.....",
        ".....XX.....",
        "...XXXXXX...",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "....XXXX....",
        "...XXXXXX...",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX",
        "XXXXXXXXXXXX"
    ]
};

const PixelPiece = ({ type, color }: { type: string, color: 'w' | 'b' }) => {
    const isWhite = color === 'w';
    const pattern = PIXEL_PATTERNS[type.toLowerCase()];

    if (!pattern) return null;

    // High Contrast Palette
    const mainColor = isWhite ? '#FFFFFF' : '#000000'; // Pure White vs Pure Black

    // Updated: No visual stroke for black pieces to ensure "Pure Black" look
    // They will rely on the board background ('#202020') for contrast.

    return (
        <svg viewBox="0 0 12 16" className="w-full h-full drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] shape-rendering-crispEdges">
            {pattern.map((row, y) => (
                row.split('').map((char, x) => {
                    if (char === ' ') return null;
                    if (char === 'X') {
                        return (
                            <rect
                                key={`${x}-${y}`}
                                x={x}
                                y={y}
                                width="1"
                                height="1"
                                fill={mainColor}
                            />
                        );
                    }
                    return null;
                })
            ))}
        </svg>
    );
};

// --- Helper: Captured Pieces ---
const getCapturedPieces = (fen: string) => {
    const pieces = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0, P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0 };
    // Standard counts
    const startCounts: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1, P: 8, N: 2, B: 2, R: 2, Q: 1, K: 1 };

    // Count current
    for (const char of fen.split(' ')[0]) {
        if (pieces.hasOwnProperty(char)) {
            // @ts-ignore
            pieces[char]++;
        }
    }

    const captured: string[] = [];
    // Compare
    Object.keys(startCounts).forEach(type => {
        // @ts-ignore
        const diff = startCounts[type] - (pieces[type] || 0);
        for (let i = 0; i < diff; i++) captured.push(type);
    });

    return captured.sort(); // Sort for consistent display
};

// --- Component ---

export default function PixelChess({ onBack }: { onBack: () => void }) {
    return (
        <GameShell title="Pixel Chess" icon="♟️" color="#3b82f6" onClose={onBack}>
            {(gameCtx) => <ChessBoard gameCtx={gameCtx} />}
        </GameShell>
    );
}

function ChessBoard({ gameCtx }: { gameCtx: GameContextType }) {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    // Explicit Modes
    const [gameMode, setGameMode] = useState<'PVP' | 'AI' | 'ONLINE'>('AI');
    const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('HARD');

    // Online State
    const { user } = useAuth();
    const [onlineGameId, setOnlineGameId] = useState<string | null>(null);
    const [joinIdInput, setJoinIdInput] = useState('');
    const { game: remoteGame, makeMove: makeRemoteMove, isPlayerTurn, playerColor: remotePlayerColor, surrender } = useGame(onlineGameId);
    const [copied, setCopied] = useState(false);

    const [isAiThinking, setIsAiThinking] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    // Derived player color: 'w' for local AI/PVP, or assigned color for Online
    const playerColor = gameMode === 'ONLINE' ? (remotePlayerColor || 'w') : 'w';

    // Reset Helper
    const resetGame = useCallback(() => {
        const g = new Chess();
        setGame(g);
        setFen(g.fen());
        setHistory([]);
        setSelectedSquare(null);
        setPossibleMoves([]);
        setIsAiThinking(false);
    }, []);

    // Change Mode & Reset
    const handleModeChange = (mode: 'PVP' | 'AI' | 'ONLINE') => {
        setGameMode(mode);
        setOnlineGameId(null);
        resetGame();
    };

    // Sync Remote Game State
    useEffect(() => {
        if (gameMode === 'ONLINE' && remoteGame) {
            const newGame = new Chess();
            try {
                newGame.load(remoteGame.fen);
                setGame(newGame);
                setFen(remoteGame.fen);
                setHistory(remoteGame.moves.map(m => m.san));

                // Sound effects for new moves
                if (remoteGame.moves.length > 0) {
                    const lastMove = remoteGame.moves[remoteGame.moves.length - 1];
                    // Simple check if it's a new move to play sound (simplified)
                    gameCtx.playSound('move');
                }

                // End Game checks handled by remoteGame.status/winner in UI
            } catch (e) {
                console.error("Failed to sync remote state", e);
            }
        }
    }, [remoteGame, gameMode, gameCtx]);

    const handleCreateGame = async () => {
        if (!user) return;
        try {
            const id = await createGame(user.id);
            setOnlineGameId(id);
        } catch (e) {
            console.error(e);
        }
    };

    const handleJoinGame = async () => {
        if (!user || !joinIdInput) return;
        try {
            await joinGame(joinIdInput, user.id);
            setOnlineGameId(joinIdInput);
        } catch (e) {
            console.error(e);
            alert("Could not join game. Check ID.");
        }
    };

    const copyGameId = () => {
        if (onlineGameId) {
            navigator.clipboard.writeText(onlineGameId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // --- AI Logic (PST + Minimax) ---
    // Standard PST implementation
    const PST = {
        p: [[0, 0, 0, 0, 0, 0, 0, 0], [50, 50, 50, 50, 50, 50, 50, 50], [10, 10, 20, 30, 30, 20, 10, 10], [5, 5, 10, 25, 25, 10, 5, 5], [0, 0, 0, 20, 20, 0, 0, 0], [5, -5, -10, 0, 0, -10, -5, 5], [5, 10, 10, -20, -20, 10, 10, 5], [0, 0, 0, 0, 0, 0, 0, 0]],
        n: [[-50, -40, -30, -30, -30, -30, -40, -50], [-40, -20, 0, 0, 0, 0, -20, -40], [-30, 0, 10, 15, 15, 10, 0, -30], [-30, 5, 15, 20, 20, 15, 5, -30], [-30, 0, 15, 20, 20, 15, 0, -30], [-30, 5, 10, 15, 15, 10, 5, -30], [-40, -20, 0, 5, 5, 0, -20, -40], [-50, -40, -30, -30, -30, -30, -40, -50]],
        b: [[-20, -10, -10, -10, -10, -10, -10, -20], [-10, 0, 0, 0, 0, 0, 0, -10], [-10, 0, 5, 10, 10, 5, 0, -10], [-10, 5, 5, 10, 10, 5, 5, -10], [-10, 0, 10, 10, 10, 10, 0, -10], [-10, 10, 10, 10, 10, 10, 10, -10], [-10, 5, 0, 0, 0, 0, 5, -10], [-20, -10, -10, -10, -10, -10, -10, -20]],
        r: [[0, 0, 0, 0, 0, 0, 0, 0], [5, 10, 10, 10, 10, 10, 10, 5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [0, 0, 0, 5, 5, 0, 0, 0]],
        q: [[-20, -10, -10, -5, -5, -10, -10, -20], [-10, 0, 0, 0, 0, 0, 0, -10], [-10, 0, 5, 5, 5, 5, 0, -10], [-5, 0, 5, 5, 5, 5, 0, -5], [0, 0, 5, 5, 5, 5, 0, -5], [-10, 5, 5, 5, 5, 5, 0, -10], [-10, 0, 5, 0, 0, 0, 0, -10], [-20, -10, -10, -5, -5, -10, -10, -20]],
        k: [[-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30], [-20, -30, -30, -40, -40, -30, -30, -20], [-10, -20, -20, -20, -20, -20, -20, -10], [20, 20, 0, 0, 0, 0, 20, 20], [20, 30, 10, 0, 0, 10, 30, 20]]
    };

    const evaluateBoard = (g: Chess) => {
        let totalEvaluation = 0;
        const board = g.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const isWhite = piece.color === 'w';
                    const multiplier = isWhite ? 1 : -1;
                    let value = 0;
                    if (piece.type === 'p') value = 100;
                    else if (piece.type === 'n') value = 320;
                    else if (piece.type === 'b') value = 330;
                    else if (piece.type === 'r') value = 500;
                    else if (piece.type === 'q') value = 900;
                    else if (piece.type === 'k') value = 20000;
                    let x = i; const y = j;
                    if (isWhite) x = 7 - i;
                    const pstVal = (PST as any)[piece.type][x][y] || 0;
                    totalEvaluation += (value + pstVal) * multiplier;
                }
            }
        }
        return totalEvaluation;
    };

    const minimax = (g: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
        if (depth === 0) return -evaluateBoard(g);
        const moves = g.moves();
        if (moves.length === 0) return 0;
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                g.move(move);
                const evalVal = minimax(g, depth - 1, alpha, beta, false);
                g.undo();
                maxEval = Math.max(maxEval, evalVal);
                alpha = Math.max(alpha, evalVal);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                g.move(move);
                const evalVal = minimax(g, depth - 1, alpha, beta, true);
                g.undo();
                minEval = Math.min(minEval, evalVal);
                beta = Math.min(beta, evalVal);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    };

    const makeAiMove = useCallback(() => {
        if (game.isGameOver()) return;
        let bestVal = -Infinity;
        let bestMove = null;
        const moves = game.moves();
        moves.sort(() => Math.random() - 0.5);
        for (const move of moves) {
            game.move(move);
            const val = minimax(game, difficulty === 'HARD' ? 2 : 1, -Infinity, Infinity, false);
            game.undo();
            if (val > bestVal) {
                bestVal = val;
                bestMove = move;
            }
        }
        if (bestMove) {
            const moveResult = game.move(bestMove);
            setFen(game.fen());
            setHistory(h => [...h, moveResult.san]);
            if (moveResult.san.includes('#')) gameCtx.playSound('success');
            else if (moveResult.san.includes('+')) gameCtx.playSound('pop');
            else if (moveResult.flags.includes('c')) gameCtx.playSound('pop');
            else gameCtx.playSound('move');
            checkStatus();
        }
    }, [game, difficulty, gameCtx]);

    useEffect(() => {
        if (gameMode === 'AI' && game.turn() !== playerColor && !game.isGameOver()) {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                makeAiMove();
                setIsAiThinking(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [game, fen, gameMode, playerColor, makeAiMove]);

    // Sync Reset
    useEffect(() => {
        if (gameCtx.gameState === 'PLAYING' && gameCtx.score === 0 && history.length === 0) {
            resetGame();
        }
    }, [gameCtx.gameState, gameCtx.score, resetGame]);

    const checkStatus = () => {
        if (game.isCheckmate()) {
            const winner = game.turn() === 'w' ? 'Black' : 'White';
            const isWin = (gameMode === 'AI' && winner === 'White') || gameMode === 'PVP';
            gameCtx.playSound(isWin ? 'success' : 'error');
            gameCtx.endGame(isWin, isWin ? 1000 : 100);
        } else if (game.isDraw() || game.isStalemate()) {
            gameCtx.playSound('gameover');
            gameCtx.endGame(false, 50);
        } else if (game.inCheck()) {
            gameCtx.playSound('click');
        }
    };

    const handleSquareClick = (square: string) => {
        if (gameCtx.gameState !== 'PLAYING') return;
        if (gameMode === 'AI' && game.turn() !== playerColor) return;
        if (gameMode === 'ONLINE' && !isPlayerTurn) return; // Prevent move if not turn

        if (selectedSquare === square) { setSelectedSquare(null); setPossibleMoves([]); return; }
        if (possibleMoves.includes(square)) {
            try {
                if (gameMode === 'ONLINE') {
                    // Optimistic update handled by hook/firebase listener, 
                    // but we call makeRemoteMove here
                    makeRemoteMove(selectedSquare!, square);
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                    return;
                }

                const move = game.move({ from: selectedSquare!, to: square, promotion: 'q' });
                if (move) {
                    setFen(game.fen());
                    setHistory(h => [...h, move.san]);
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                    gameCtx.playSound('move');
                    checkStatus();
                }
            } catch (e) { console.error(e); }
            return;
        }
        const piece = game.get(square as any);
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
            const moves = game.moves({ square: square as any, verbose: true });
            setPossibleMoves(moves.map(m => m.to));
            gameCtx.playSound('click');
        } else { setSelectedSquare(null); setPossibleMoves([]); }
    };

    // Board Generation
    const boardRows = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = `${files[c]}${ranks[r]}`;
            const piece = game.get(square as any);
            const isDark = (r + c) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isPossible = possibleMoves.includes(square);
            const inCheck = piece?.type === 'k' && piece.color === game.turn() && game.inCheck();
            boardRows.push({ square, piece, isDark, isSelected, isPossible, inCheck });
        }
    }

    const capturedPieces = getCapturedPieces(fen);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 font-sans text-slate-200">

            {/* Mode Controls */}
            <div className="w-full max-w-lg flex justify-between mb-4 bg-slate-800/50 p-2 rounded-lg">
                <button
                    onClick={() => handleModeChange('AI')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${gameMode === 'AI' ? 'bg-indigo-500 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                    <Bot size={16} /> vs AI
                </button>

                <h1 className="font-bold text-slate-500 tracking-widest text-xs self-center hidden sm:block">PIXEL CHESS</h1>

                <button
                    onClick={() => handleModeChange('PVP')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${gameMode === 'PVP' ? 'bg-indigo-500 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                    <Users size={16} /> 2P Local
                </button>

                <button
                    onClick={() => handleModeChange('ONLINE')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${gameMode === 'ONLINE' ? 'bg-green-500 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                    <Globe size={16} /> Online
                </button>
            </div>

            {/* Online Menu Overlay */}
            {gameMode === 'ONLINE' && !onlineGameId && (
                <div className="mb-6 p-6 bg-slate-800/80 rounded-xl border border-white/10 w-full max-w-lg flex flex-col gap-4 items-center text-center">
                    <h2 className="text-xl font-bold text-white">Play Online</h2>
                    <p className="text-sm text-slate-400">Create a room or join a friend's Game ID.</p>

                    <div className="flex gap-4 w-full justify-center">
                        <button onClick={handleCreateGame} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold">Create Game</button>
                        <div className="flex gap-2">
                            <input
                                value={joinIdInput}
                                onChange={(e) => setJoinIdInput(e.target.value)}
                                placeholder="Game ID"
                                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white w-32"
                            />
                            <button onClick={handleJoinGame} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-bold">Join</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Online Game Info */}
            {gameMode === 'ONLINE' && onlineGameId && (
                <div className="mb-4 w-full max-w-lg flex justify-between items-center bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-bold uppercase">Online Match</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="bg-black/40 px-2 py-1 rounded text-xs text-white/70 tracking-wider select-all">{onlineGameId}</code>
                        <button onClick={copyGameId} className="text-white/50 hover:text-white">
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Board Frame */}
                <div className="p-2 bg-[#0a0a0a] rounded-xl shadow-2xl border border-white/10 max-w-lg relative w-full flex justify-center">
                    {/* Board Frame Highlight */}
                    <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none" />

                    <div className={`
                        aspect-square bg-[#101010] border-4 border-[#101010]
                        grid grid-cols-8 grid-rows-8 relative
                        w-full max-w-[450px]
                    `}>
                        {boardRows.map((sq) => (
                            <div
                                key={sq.square}
                                onClick={() => handleSquareClick(sq.square)}
                                className={`
                                    relative flex items-center justify-center cursor-pointer select-none ring-inset
                                    ${sq.isDark ? 'bg-[#202020]' : 'bg-[#303030]'} 
                                    ${sq.isSelected ? '!bg-[#4F46E5] ring-2 ring-indigo-400' : ''}
                                    ${sq.isPossible ? 'after:content-[""] after:absolute after:w-3 after:h-3 after:bg-green-500/50 after:rounded-full after:box-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : ''}
                                    ${sq.inCheck ? '!bg-red-500/50 ring-2 ring-red-500' : ''}
                                `}
                            >
                                {/* Grid Pattern Overlay */}
                                <div className="absolute inset-0 border-[0.5px] border-black/10 pointer-events-none" />

                                {/* Piece */}
                                {sq.piece && (
                                    <motion.div
                                        layoutId={`piece-${sq.square}`}
                                        className="w-[85%] h-[85%]"
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    >
                                        <PixelPiece type={sq.piece.type} color={sq.piece.color} />
                                    </motion.div>
                                )}
                            </div>
                        ))}

                        {/* AI Thinking Overlay */}
                        <AnimatePresence>
                            {isAiThinking && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10"
                                >
                                    <div className="text-white font-bold bg-black/80 px-4 py-2 rounded-full flex items-center gap-2 animate-pulse border border-white/20">
                                        <Cpu size={16} /> THINKING
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar: Captures & Info */}
                <div className="w-full md:w-48 flex flex-col gap-4">

                    {/* Captures */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 min-h-[200px]">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            <Swords size={12} /> Captured
                        </h3>
                        <div className="flex flex-wrap gap-1">
                            {capturedPieces.length === 0 && <span className="text-xs text-slate-600 italic">No casualties yet...</span>}
                            {capturedPieces.map((p, i) => (
                                <div key={i} className="w-6 h-6 opacity-80 hover:opacity-100 hover:scale-110 transition-transform">
                                    <PixelPiece type={p.toLowerCase()} color={p === p.toUpperCase() ? 'w' : 'b'} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Game Info */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Status</h3>
                        <div className="text-sm text-slate-300">
                            {game.isCheck() ? <span className="text-red-400 font-bold">CHECK!</span> :
                                game.isCheckmate() ? <span className="text-green-400 font-bold">CHECKMATE!</span> :
                                    game.isDraw() ? <span className="text-yellow-400">DRAW</span> :
                                        `Turn: ${game.turn() === 'w' ? 'White' : 'Black'}`}
                        </div>
                    </div>

                    <button
                        onClick={resetGame}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 transition-colors"
                    >
                        <RotateCcw size={16} /> Reset Board
                    </button>

                    {gameMode === 'ONLINE' && onlineGameId && !game.isGameOver() && (
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to surrender?')) {
                                    surrender();
                                }
                            }}
                            className="p-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 transition-colors font-bold text-sm"
                        >
                            🏳️ Surrender
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}
