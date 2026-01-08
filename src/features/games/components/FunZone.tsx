'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSignals } from '@/hooks/useSignals';
import TicTacToe from './TicTacToe';
import MemoryGame from './MemoryGame';
import ReactionGame from './ReactionGame';
import AlchemyGame from './AlchemyGame';
import VoidPopperGame from './VoidPopperGame';
import TriviaGame from './TriviaGame';
import ChessGame from './ChessGame';
import PacmanGame from './PacmanGame';
import InteractiveGamingRoom from './InteractiveGamingRoom';

// Game data matching the modern design
interface Game {
    id: string;
    name: string;
    category: 'Brain Games' | 'Action Games' | 'Creative Games' | 'Quick Play';
    description: string;
    icon: string;
    playCount: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isNew?: boolean;
    isPopular?: boolean;
    isPremium?: boolean;
    gradient: string;
}

const GAMES: Game[] = [
    {
        id: 'chess',
        name: 'Pixel Chess',
        category: 'Brain Games',
        description: 'Classic chess with a retro twist.',
        icon: '♟️',
        playCount: 1200,
        difficulty: 'Hard',
        isPopular: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        id: 'pacman',
        name: 'Neon Pac-Man',
        category: 'Action Games',
        description: 'Arcade classic with neon vibes.',
        icon: '👻',
        playCount: 1500,
        difficulty: 'Medium',
        isPopular: true,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        id: 'alchemy',
        name: 'Mood Alchemy',
        category: 'Creative Games',
        description: 'Mix emotions and create magic.',
        icon: '⚗️',
        playCount: 980,
        difficulty: 'Medium',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        id: 'memory',
        name: 'Memory Match',
        category: 'Brain Games',
        description: 'Test your memory with pixelated cards.',
        icon: '🧩',
        playCount: 700,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        id: 'popper',
        name: 'Void Popper',
        category: 'Action Games',
        description: 'Pop the void bubbles before they reach you.',
        icon: '💥',
        playCount: 400,
        difficulty: 'Hard',
        isPremium: true,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        id: 'trivia',
        name: 'Cosmic Trivia',
        category: 'Brain Games',
        description: 'Test your knowledge across the cosmos.',
        icon: '🧠',
        playCount: 850,
        difficulty: 'Medium',
        isNew: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        id: 'rhythm',
        name: 'Neon Rhythm',
        category: 'Quick Play',
        description: 'Tap to the beat in this rhythm game.',
        icon: '🎵',
        playCount: 920,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
        id: 'tictactoe',
        name: 'Tic Tac Toe',
        category: 'Quick Play',
        description: 'Classic game with a modern twist.',
        icon: '🎲',
        playCount: 1100,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
];

const categories = ['All', 'Brain Games', 'Action Games', 'Creative Games', 'Quick Play'];

interface FunZoneProps {
    onClose: () => void;
}

export default function FunZone({ onClose }: FunZoneProps) {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showStartScreen, setShowStartScreen] = useState(false);
    const [showGames, setShowGames] = useState(false);
    const [gameMode, setGameMode] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const { trackTool } = useSignals('user-1');
    const [score] = useState(5230);

    // Loading animation
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setShowStartScreen(true), 300);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const handleStart = () => {
        setShowGames(true);
    };

    const filteredGames = activeCategory === 'All'
        ? GAMES
        : GAMES.filter(game => game.category === activeCategory);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
        >
            <AnimatePresence mode="wait">
                {!showStartScreen ? (
                    // Loading Screen
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center w-full h-full bg-black"
                    >
                        <div className="flex items-center gap-12">
                            {/* NOW LOADING Text */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white text-3xl font-bold tracking-wider"
                                style={{ fontFamily: '"Press Start 2P", "Courier New", monospace' }}
                            >
                                NOW LOADING ...
                            </motion.div>

                            {/* Pixel Art Computer */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                            >
                                <img
                                    src="/loading-computer.png"
                                    alt="Loading"
                                    className="w-80 h-80 object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                ) : !showGames ? (
                    // Start Screen - ONLY START BUTTON IS INTERACTIVE
                    <motion.div
                        key="start"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative"
                    >
                        {/* Windows 95 Window */}
                        <div className="w-[90vw] max-w-[800px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                            {/* Title Bar - NOT INTERACTIVE */}
                            <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gamepad2 size={16} className="text-white" />
                                    <span className="text-white text-xs">LANDSCAPE.EXE</span>
                                </div>
                                <div className="flex gap-1">
                                    {/* Static maximize button */}
                                    <div className="w-6 h-6 bg-[#c0c0c0] border border-white border-r-black border-b-black flex items-center justify-center">
                                        <Maximize2 size={12} />
                                    </div>
                                    {/* Close button works */}
                                    <button
                                        onClick={onClose}
                                        className="w-6 h-6 bg-[#c0c0c0] border border-white border-r-black border-b-black flex items-center justify-center hover:bg-[#d0d0d0]"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Landscape Image */}
                            <div className="relative w-full aspect-video overflow-hidden bg-black">
                                {/* Pixel Art Background Image */}
                                <img
                                    src="/playzone-landscape.png"
                                    alt="Pixel Landscape"
                                    className="w-full h-full object-cover"
                                    style={{ imageRendering: 'pixelated' }}
                                />

                                {/* Decorative Elements (NOT INTERACTIVE) */}

                                {/* Warning Dialog - Bottom Left (decorative only) */}
                                <div className="absolute bottom-4 left-4 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black p-2 w-40 pointer-events-none">
                                    <div className="bg-[#000080] text-white text-xs px-1 flex items-center justify-between mb-1">
                                        <span>WARNING</span>
                                        <span className="text-white">×</span>
                                    </div>
                                    <div className="text-[10px] text-black mb-2 leading-tight">
                                        DO YOU WANT<br />TO GO BACK ?
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="flex-1 bg-[#c0c0c0] border border-white border-r-black border-b-black text-center text-[10px] py-1">Yes</div>
                                        <div className="flex-1 bg-[#c0c0c0] border border-white border-r-black border-b-black text-center text-[10px] py-1">No</div>
                                    </div>
                                </div>

                                {/* Game Controller Icon - Bottom Right (decorative) */}
                                <div className="absolute bottom-4 right-4 pointer-events-none">
                                    <div className="text-4xl">🎮</div>
                                </div>

                                {/* Folder Icon - Bottom Right (decorative) */}
                                <div className="absolute bottom-16 right-4 pointer-events-none">
                                    <div className="w-12 h-10 bg-yellow-400 border-2 border-yellow-600 relative">
                                        <div className="absolute -top-1 left-0 w-6 h-2 bg-yellow-500 border-t-2 border-l-2 border-yellow-600"></div>
                                    </div>
                                </div>

                                {/* Chat Bubble Icon - Middle Right (decorative) */}
                                <div className="absolute bottom-28 right-4 pointer-events-none">
                                    <div className="bg-white border-2 border-gray-400 rounded-lg p-2 w-10 h-8 relative">
                                        <div className="text-pink-500 text-xl">💗</div>
                                    </div>
                                </div>

                                {/* Heart Icon - Bottom Center (decorative) */}
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                                    <div className="text-3xl animate-pulse">💙</div>
                                </div>

                                {/* Sparkles in Sky - Top Right (decorative) */}
                                <div className="absolute top-8 right-16 pointer-events-none">
                                    <div className="text-yellow-300 text-2xl">✨</div>
                                </div>
                                <div className="absolute top-12 right-8 pointer-events-none">
                                    <div className="text-yellow-200 text-xl">✨</div>
                                </div>

                                {/* START Button - ONLY INTERACTIVE ELEMENT */}
                                <motion.button
                                    onClick={handleStart}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Pixel-perfect START button */}
                                    <div className="relative">
                                        {/* Shadow layer (bottom-right) */}
                                        <div className="absolute top-1 left-1 w-full h-full bg-black/60"></div>

                                        {/* Main button */}
                                        <div className="relative bg-[#4A7C2E] px-8 py-4 border-4 border-[#6BA047] border-b-[#2D5A1E] border-r-[#2D5A1E]">
                                            {/* Top highlight */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#8BC34A]"></div>

                                            {/* Pixel text */}
                                            <span
                                                className="text-white text-xl font-bold tracking-[0.2em] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]"
                                                style={{
                                                    fontFamily: '"Press Start 2P", "Courier New", monospace',
                                                    textShadow: '2px 2px 0 rgba(0,0,0,0.8), -1px -1px 0 rgba(255,255,255,0.2)'
                                                }}
                                            >
                                                START
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Animated Cursor - NOT INTERACTIVE */}
                                <motion.div
                                    className="absolute pointer-events-none z-40"
                                    animate={{
                                        x: [100, 400, 400, 100],
                                        y: [100, 100, 300, 300]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    <div className="w-6 h-8 bg-white border-2 border-black" style={{ clipPath: 'polygon(0 0, 0 100%, 30% 70%, 50% 100%, 60% 90%, 40% 60%, 70% 60%, 0 0)' }} />
                                </motion.div>
                            </div>

                            {/* Status Bar - NOT INTERACTIVE */}
                            <div className="bg-[#c0c0c0] border-t-2 border-[#808080] px-2 py-1">
                                <div className="text-xs text-black">Ready to play</div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // Modern Game Grid
                    <motion.div
                        key="games"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        {!gameMode ? (
                            <InteractiveGamingRoom
                                onSelectGame={(gameId) => {
                                    setGameMode(gameId);
                                    trackTool(`game_${gameId}`, 0);
                                }}
                                onClose={onClose}
                            />
                        ) : (
                            // Individual Game View
                            <div className="w-full h-full bg-black">
                                <div className="p-4">
                                    <button
                                        onClick={() => setGameMode(null)}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        ← BACK TO ROOM
                                    </button>
                                </div>

                                <div className="h-[calc(100%-80px)] overflow-y-auto">
                                    {gameMode === 'chess' && <ChessGame onBack={() => setGameMode(null)} />}
                                    {gameMode === 'pacman' && <PacmanGame onBack={() => setGameMode(null)} tokens={score} onUpdateTokens={() => { }} />}
                                    {gameMode === 'tictactoe' && <TicTacToe />}
                                    {gameMode === 'memory' && <MemoryGame />}
                                    {gameMode === 'rhythm' && <ReactionGame />}
                                    {gameMode === 'alchemy' && <AlchemyGame />}
                                    {gameMode === 'popper' && <VoidPopperGame />}
                                    {gameMode === 'trivia' && <TriviaGame />}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
