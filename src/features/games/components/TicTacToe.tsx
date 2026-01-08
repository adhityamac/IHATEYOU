'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle, RotateCcw, Trophy, Bot, Users, BrainCircuit, BarChart3 } from 'lucide-react';
import Leaderboard from '../../social/components/Leaderboard';
import { useSignals } from '../../../hooks/useSignals';

const INITIAL_ID = 2025122300000;

type Player = 'X' | 'O' | null;
type GameMode = 'PVP' | 'AI';

const checkWinner = (squares: Player[]) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
};

// Minimax Algorithm for AI
const minimax = (squares: Player[], depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(squares);
    if (result?.winner === 'O') return 10 - depth;
    if (result?.winner === 'X') return depth - 10;
    if (!squares.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                squares[i] = 'O';
                const score = minimax(squares, depth + 1, false);
                squares[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                squares[i] = 'X';
                const score = minimax(squares, depth + 1, true);
                squares[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

export default function TicTacToe() {
    const { trackTool, trackInteraction } = useSignals('user-1');
    const idCounter = useRef(INITIAL_ID);
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [gameMode, setGameMode] = useState<GameMode>('AI');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

    const handleMove = (index: number, player: Player) => {
        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
        } else if (!newBoard.includes(null)) {
            setWinner('Draw');
        }
    };

    const makeAiMove = useCallback(() => {
        let bestScore = -Infinity;
        let move = -1;
        const newBoard = [...board];

        // First move optimization: take center if available
        if (board.filter(Boolean).length === 1 && !board[4]) {
            move = 4;
        } else {
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = 'O';
                    const score = minimax(newBoard, 0, false);
                    newBoard[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }
        }

        if (move !== -1) {
            handleMove(move, 'O');
        }
    }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (gameMode === 'AI' && !isXNext && !winner) {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                makeAiMove();
                setIsAiThinking(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, gameMode, winner, makeAiMove]);

    // Save score on win
    useEffect(() => {
        if (winner && winner !== 'Draw') {
            const isUserWin = gameMode === 'AI' ? winner === 'X' : true; // In PvP, someone always wins
            trackInteraction('game_result', isUserWin ? 100 : 0);

            // Simple scoring: 100 for AI win, 50 for PVP win
            // Only save if Player X wins in AI mode, or any player in PVP
            const shouldSave = gameMode === 'PVP' || (gameMode === 'AI' && winner === 'X');

            if (shouldSave) {
                const points = gameMode === 'AI' ? 100 : 50;
                idCounter.current += 1;
                const newScore = {
                    id: idCounter.current.toString(),
                    player: winner === 'X' ? 'Player X' : 'Player O',
                    score: points,
                    date: new Date().toISOString(),
                    game: 'tictactoe'
                };

                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('arcade-leaderboard');
                    const scores = saved ? JSON.parse(saved) : [];
                    scores.push(newScore);
                    localStorage.setItem('arcade-leaderboard', JSON.stringify(scores));
                }
                setRefreshLeaderboard(prev => prev + 1);
            }
        }
    }, [winner, gameMode, trackInteraction]);

    const onSquareClick = (index: number) => {
        if (board[index] || winner || (gameMode === 'AI' && !isXNext)) return;
        handleMove(index, isXNext ? 'X' : 'O');
        trackTool('tictactoe_move', 0);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningLine(null);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
            {showLeaderboard ? (
                <Leaderboard
                    gameId="tictactoe"
                    refreshTrigger={refreshLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />
            ) : (
                <>
                    {/* Mode Toggle */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {(['PVP', 'AI'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => { setGameMode(mode); resetGame(); }}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${gameMode === mode ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    {mode === 'PVP' ? <Users size={14} /> : <Bot size={14} />}
                                    {mode === 'PVP' ? '2 Players' : 'vs AI'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            title="View Leaderboard"
                        >
                            <BarChart3 size={18} />
                        </button>
                    </div>

                    {/* Game Board */}
                    <div className="relative grid grid-cols-3 gap-3 mb-8 p-3 bg-black/40 backdrop-blur-xl rounded-[32px] border border-white/10">
                        {board.map((cell, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: !cell && !winner ? 0.98 : 1 }}
                                whileTap={{ scale: !cell && !winner ? 0.95 : 1 }}
                                onClick={() => onSquareClick(i)}
                                className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl relative overflow-hidden transition-colors ${winningLine?.includes(i) ? 'bg-white/10' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}
                            >
                                <AnimatePresence mode="wait">
                                    {cell === 'X' && (
                                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"><X size={48} strokeWidth={3} /></motion.div>
                                    )}
                                    {cell === 'O' && (
                                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"><Circle size={40} strokeWidth={3.5} /></motion.div>
                                    )}
                                </AnimatePresence>
                                {winningLine?.includes(i) && <motion.div layoutId="win-glow" className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl" />}
                            </motion.button>
                        ))}
                    </div>

                    {/* Status / Game Over */}
                    <div className="h-16 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {winner ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-3">
                                    <div className="text-xl font-black italic uppercase text-white flex items-center gap-2">
                                        {winner === 'Draw' ? 'Draw Game' : <><Trophy size={20} className="text-yellow-500" /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{winner === 'O' && gameMode === 'AI' ? 'AI Wins' : `Player ${winner} Wins`}</span></>}
                                    </div>
                                    <button onClick={resetGame} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-colors"><RotateCcw size={12} /> Play Again</button>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                                    {isAiThinking ? <><BrainCircuit size={14} className="animate-pulse text-pink-500" /> Neural Core Thinking...</> : <>{isXNext ? 'Player X Turn' : (gameMode === 'AI' ? 'AI Turn' : 'Player O Turn')}</>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
}