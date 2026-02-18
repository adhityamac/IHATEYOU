'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle, RotateCcw, Trophy, Bot, Users, BrainCircuit, BarChart3, Zap } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- Types ---
type Player = 'X' | 'O' | null;
type GameMode = 'PVP' | 'AI';
type Difficulty = 'EASY' | 'IMPOSSIBLE';

// --- Logic ---
const checkWinner = (squares: Player[]) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
};

// Simplified AI to prevent max call stack errors
const findBestMove = (squares: Player[]): number => {
    // 1. Can AI Win?
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            squares[i] = 'O';
            if (checkWinner(squares)?.winner === 'O') {
                squares[i] = null;
                return i;
            }
            squares[i] = null;
        }
    }
    // 2. Must Block Player?
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            squares[i] = 'X';
            if (checkWinner(squares)?.winner === 'X') {
                squares[i] = null;
                return i;
            }
            squares[i] = null;
        }
    }
    // 3. Take Center
    if (!squares[4]) return 4;

    // 4. Random Corner
    const corners = [0, 2, 6, 8].filter(i => !squares[i]);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    // 5. Random Side
    const sides = [1, 3, 5, 7].filter(i => !squares[i]);
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];

    return -1;
};

// --- Component ---

export default function TicTacToe({ onBack }: { onBack: () => void }) {
    return (
        <GameShell title="Quantum Tic-Tac-Toe" icon="⭕" color="#ec4899" onClose={onBack}>
            {(gameCtx) => <TicTacToeBoard gameCtx={gameCtx} />}
        </GameShell>
    );
}

function TicTacToeBoard({ gameCtx }: { gameCtx: GameContextType }) {
    // Game State
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [gameMode, setGameMode] = useState<GameMode>('AI');
    const [difficulty, setDifficulty] = useState<Difficulty>('IMPOSSIBLE');
    const [variant, setVariant] = useState<'CLASSIC' | 'INFINITY' | 'GRAVITY'>('CLASSIC');
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // Infinity Mode History: Track moves as { index, player }
    const [moveHistory, setMoveHistory] = useState<{ index: number, player: Player }[]>([]);

    // Taunts
    const [taunt, setTaunt] = useState<{ text: string, id: number } | null>(null);

    // Valid Ref pattern
    const stateRef = useRef({ board, winningLine, variant, moveHistory });
    stateRef.current = { board, winningLine, variant, moveHistory };

    // Sync Reset
    useEffect(() => {
        const { board: currentBoard, winningLine: currentLine } = stateRef.current;
        if (gameCtx.gameState === 'PLAYING') {
            if (currentLine || (!currentBoard.includes(null) && variant !== 'INFINITY')) {
                resetBoard();
            }
            else if (gameCtx.score === 0 && currentBoard.some(c => c !== null)) {
                resetBoard();
            }
        }
    }, [gameCtx.gameState, gameCtx.score, variant]);

    const resetBoard = () => {
        setBoard(Array(9).fill(null));
        setWinningLine(null);
        setIsXNext(true);
        setMoveHistory([]);
        setTaunt(null);
    };

    const handleMove = useCallback((index: number, player: Player) => {
        let targetIndex = index;
        const currentBoard = [...stateRef.current.board];
        let currentHistory = [...stateRef.current.moveHistory];

        // 1. Gravity Logic: Fall to bottom
        if (stateRef.current.variant === 'GRAVITY') {
            const col = index % 3;
            if (!currentBoard[col + 6]) targetIndex = col + 6;
            else if (!currentBoard[col + 3]) targetIndex = col + 3;
            else if (!currentBoard[col]) targetIndex = col;
            else return; // Column full
        }
        // Classic Check
        else if (currentBoard[targetIndex]) {
            return;
        }

        // 2. Infinity Logic
        if (stateRef.current.variant === 'INFINITY') {
            const playerMoves = currentHistory.filter(m => m.player === player);
            if (playerMoves.length >= 3) {
                const oldest = playerMoves[0];
                currentBoard[oldest.index] = null;
                currentHistory = currentHistory.filter(m => m !== oldest);
            }
        }

        // Apply Move
        currentBoard[targetIndex] = player;
        currentHistory.push({ index: targetIndex, player });

        setBoard(currentBoard);
        setMoveHistory(currentHistory);
        setIsXNext(player === 'X' ? false : true);
        gameCtx.playSound(player === 'X' ? 'click' : 'pop');

        // Check Win
        const result = checkWinner(currentBoard);
        if (result) {
            setWinningLine(result.line);
            gameCtx.endGame(gameMode === 'AI' ? result.winner === 'X' : true, gameCtx.score + 100);
            return;
        }

        // Draw Check
        if (stateRef.current.variant !== 'INFINITY' && !currentBoard.includes(null)) {
            gameCtx.playSound('gameover');
            gameCtx.endGame(false, gameCtx.score + 10);
        }
    }, [board, gameMode, gameCtx]);

    // AI Logic
    const makeAiMove = useCallback(() => {
        const { board: currBoard, variant: currVariant } = stateRef.current;
        let move = -1;

        // Available moves (simplified for fallbacks)
        let available: number[] = [];
        if (currVariant === 'GRAVITY') {
            [0, 1, 2].forEach(col => { if (!currBoard[col]) available.push(col); });
        } else {
            available = currBoard.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
        }

        if (available.length === 0) return;

        if (difficulty === 'EASY' || currVariant !== 'CLASSIC') {
            // Random move for easy/variants
            move = available[Math.floor(Math.random() * available.length)];
        } else {
            // Smart Move (Impossible-ish)
            // Use our simplified `findBestMove` helper instead of full minimax to avoid recursion depth issues
            move = findBestMove(currBoard);
            if (move === -1 || currBoard[move]) {
                // Fallback if logic fails
                move = available[Math.floor(Math.random() * available.length)];
            }
        }

        if (move !== -1) handleMove(move, 'O');
    }, [difficulty, handleMove]);

    useEffect(() => {
        if (gameCtx.gameState === 'PLAYING' && gameMode === 'AI' && !isXNext && !winningLine) {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                makeAiMove();
                setIsAiThinking(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, gameMode, winningLine, gameCtx.gameState, makeAiMove]);

    const sendTaunt = (emoji: string) => {
        setTaunt({ text: emoji, id: Date.now() });
        setTimeout(() => setTaunt(null), 2000);
        gameCtx.playSound('pop');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-4 relative">

            {/* Mode & Variant Controls */}
            {gameCtx.gameState === 'IDLE' ? null : (
                <div className="flex flex-col w-full gap-4 mb-6">
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => { setGameMode(m => m === 'AI' ? 'PVP' : 'AI'); resetBoard(); }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10"
                        >
                            {gameMode === 'PVP' ? <Users size={14} /> : <Bot size={14} />}
                            {gameMode === 'PVP' ? '2 Player' : 'vs AI'}
                        </button>
                        {gameMode === 'AI' && (
                            <button
                                onClick={() => setDifficulty(d => d === 'EASY' ? 'IMPOSSIBLE' : 'EASY')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${difficulty === 'IMPOSSIBLE' ? 'text-red-400 border-red-500/50' : 'text-green-400 border-green-500/50'}`}
                            >
                                <Zap size={14} /> {difficulty}
                            </button>
                        )}
                    </div>

                    {/* Variant Selector */}
                    <div className="flex justify-center gap-2 bg-black/40 p-1 rounded-xl">
                        {(['CLASSIC', 'INFINITY', 'GRAVITY'] as const).map(v => (
                            <button
                                key={v}
                                onClick={() => { setVariant(v); resetBoard(); }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${variant === v ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Board */}
            <div className={`
                p-1 bg-white rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] relative
                ${gameCtx.gameState !== 'PLAYING' ? 'opacity-50 pointer-events-none' : ''}
            `}>
                <div className="grid grid-cols-3 gap-1 bg-white border border-white rounded-lg overflow-hidden">
                    {board.map((cell, i) => {
                        let opacity = 1;
                        if (variant === 'INFINITY' && cell) {
                            const playerMoves = moveHistory.filter(m => m.player === cell);
                            // Fade oldest if we have 3
                            if (playerMoves.length === 3 && playerMoves[0].index === i) opacity = 0.5;
                        }

                        return (
                            <motion.button
                                key={i}
                                whileHover={{ backgroundColor: !cell ? '#171717' : '#0a0a0a' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (gameCtx.gameState === 'PLAYING' && (gameMode === 'PVP' || isXNext)) {
                                        handleMove(i, isXNext ? 'X' : 'O');
                                    }
                                }}
                                className={`
                                w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-5xl relative 
                                transition-colors duration-200 bg-black
                                ${winningLine?.includes(i) ? '!bg-white/20' : ''}
                            `}
                            >
                                <AnimatePresence mode="wait">
                                    {cell === 'X' && (
                                        <motion.div
                                            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                                            animate={{ scale: 1, rotate: 0, opacity }}
                                            className="text-cyan-400 drop-shadow-[0_0_10px_cyan]"
                                        >
                                            <X size={64} strokeWidth={3} />
                                        </motion.div>
                                    )}
                                    {cell === 'O' && (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity }}
                                            className="text-pink-500 drop-shadow-[0_0_10px_magenta]"
                                        >
                                            <Circle size={56} strokeWidth={3.5} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Taunt Overlay */}
                <AnimatePresence>
                    {taunt && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 0 }}
                            animate={{ opacity: 1, scale: 1.5, y: -50 }}
                            exit={{ opacity: 0, y: -100 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl pointer-events-none z-50 drop-shadow-2xl"
                        >
                            {taunt.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="h-16 flex items-center justify-between gap-4 mt-8 w-full max-w-xs">
                <div className="flex gap-2">
                    {['😂', '😭', '😡', '😱'].map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => sendTaunt(emoji)}
                            className="text-xl hover:scale-125 transition-transform p-2 bg-white/5 rounded-full"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {isAiThinking ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase tracking-widest"
                        >
                            <BrainCircuit className="animate-pulse" size={14} /> Thinking...
                        </motion.div>
                    ) : (
                        <span className="text-white/30 font-mono text-xs uppercase tracking-widest">
                            {isXNext ? 'X Turn' : 'O Turn'}
                        </span>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
