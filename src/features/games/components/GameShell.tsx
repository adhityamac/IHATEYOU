'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, RotateCcw, Volume2, VolumeX, Trophy, Settings, Home } from 'lucide-react';

interface GameShellProps {
    title: string;
    icon: string;
    color: string; // e.g., 'text-purple-500' or hex for custom styles
    onClose: () => void;
    children: (context: GameContextType) => ReactNode;
    score?: number;
    highScore?: number;
    instructions?: string;
    className?: string;
}

import useGameSound from './useGameSound';

export interface GameContextType {
    gameState: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'WON';
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: (win: boolean, finalScore: number) => void;
    playSound: (type: 'click' | 'success' | 'error' | 'pop' | 'move' | 'eat' | 'gameover' | 'win') => void;
    score: number;
    setScore: (s: number | ((prev: number) => number)) => void;
}

export default function GameShell({
    title,
    icon,
    color,
    onClose,
    children,
    instructions,
    className = ""
}: GameShellProps) {
    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'WON'>('IDLE');
    const [score, setScore] = useState(0);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [highScore, setHighScore] = useState(0);

    const { playSound } = useGameSound(isSoundEnabled);

    // Load High Score
    useEffect(() => {
        const key = `highscore_${title.replace(/\s+/g, '').toLowerCase()}`;
        const saved = localStorage.getItem(key);
        if (saved) setHighScore(parseInt(saved));
    }, [title]);

    // Save High Score on Game Over
    const endGame = (win: boolean, finalScore: number) => {
        setGameState(win ? 'WON' : 'GAMEOVER');
        if (win) playSound('win');
        else playSound('gameover');

        if (finalScore > highScore) {
            setHighScore(finalScore);
            const key = `highscore_${title.replace(/\s+/g, '').toLowerCase()}`;
            localStorage.setItem(key, finalScore.toString());
        }
    };

    const startGame = () => {
        setScore(0);
        setGameState('PLAYING');
        playSound('click');
    };

    const contextValue: GameContextType = {
        gameState,
        startGame,
        pauseGame: () => setGameState('PAUSED'),
        resumeGame: () => setGameState('PLAYING'),
        endGame,
        playSound,
        score,
        setScore
    };

    return (
        <div className={`relative w-full h-full bg-[#050505] overflow-hidden flex flex-col ${className}`}>

            {/* --- TOP BAR --- */}
            <div className="flex items-center justify-between p-4 z-50 bg-black/20 backdrop-blur-sm pointer-events-none">
                {/* Left: Back / Title */}
                <div className="flex items-center gap-3 pointer-events-auto">
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    {gameState !== 'IDLE' && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{icon}</span>
                            <span className="font-bold text-white hidden md:block">{title}</span>
                        </div>
                    )}
                </div>

                {/* Center: Score (In Game) */}
                {gameState !== 'IDLE' && (
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="text-xs text-white/50 font-mono uppercase tracking-widest">Score</span>
                        <span className="text-2xl font-mono font-black text-white">{score}</span>
                    </div>
                )}

                {/* Right: Controls */}
                <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className="p-2 text-white/50 hover:text-white transition-colors"
                    >
                        {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>

                    {gameState === 'PLAYING' && (
                        <button
                            onClick={() => setGameState('PAUSED')}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <Pause size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* --- GAME CONTENT --- */}
            <div className="flex-1 relative overflow-hidden">
                {children(contextValue)}
            </div>

            {/* --- OVERLAYS --- */}
            <AnimatePresence>

                {/* IDLE / START SCREEN */}
                {gameState === 'IDLE' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-6xl shadow-2xl mb-6 border border-white/10 animate-pulse">
                            {icon}
                        </div>
                        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase" style={{ textShadow: `0 0 30px ${color}` }}>
                            {title}
                        </h1>
                        <p className="text-white/60 mb-8 max-w-sm font-medium leading-relaxed">
                            {instructions || "Ready to play? Insert coin to start."}
                        </p>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <button
                                onClick={startGame}
                                className="w-full py-4 bg-white text-black font-black text-lg uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                Play Game
                            </button>
                            {highScore > 0 && (
                                <div className="text-white/40 text-xs font-mono uppercase tracking-widest flex justify-center gap-2">
                                    <Trophy size={14} /> High Score: <span className="text-white">{highScore}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* PAUSE MENU */}
                {gameState === 'PAUSED' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl"
                    >
                        <h2 className="text-4xl font-black text-white mb-8 tracking-widest">PAUSED</h2>
                        <div className="flex flex-col gap-3 w-64">
                            <button onClick={() => setGameState('PLAYING')} className="flex items-center justify-center gap-3 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200">
                                <Play size={20} fill="currentColor" /> Resume
                            </button>
                            <button onClick={() => setGameState('IDLE')} className="flex items-center justify-center gap-3 py-3 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20">
                                <RotateCcw size={20} /> Restart
                            </button>
                            <button onClick={onClose} className="flex items-center justify-center gap-3 py-3 bg-red-500/10 text-red-500 rounded-lg font-bold hover:bg-red-500/20">
                                <Home size={20} /> Quit
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* GAME OVER / WIN */}
                {(gameState === 'GAMEOVER' || gameState === 'WON') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6"
                    >
                        <div className="mb-4 text-center">
                            <h2 className={`text-6xl font-black mb-2 tracking-tighter ${gameState === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
                                {gameState === 'WON' ? 'YOU WIN!' : 'GAME OVER'}
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-widest font-bold">Final Score</p>
                        </div>

                        <div className="text-7xl font-mono text-white mb-8 font-bold" style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>
                            {score}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={startGame} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2">
                                <RotateCcw size={18} /> Play Again
                            </button>
                            <button onClick={onClose} className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
                                Exit
                            </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
