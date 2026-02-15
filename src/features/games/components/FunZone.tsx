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
import PixelChess from './PixelChess';
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
    const [showGames, setShowGames] = useState(true); // Start with games visible
    const [gameMode, setGameMode] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const { trackTool } = useSignals('user-1');
    const [score] = useState(5230);

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
            {/* Modern Game Grid - Direct Entry */}
            <motion.div
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
                            {gameMode === 'chess' && <PixelChess onBack={() => setGameMode(null)} />}
                            {gameMode === 'pacman' && <PacmanGame onBack={() => setGameMode(null)} tokens={score} onUpdateTokens={() => { }} />}
                            {gameMode === 'tictactoe' && <TicTacToe onBack={() => setGameMode(null)} />}
                            {gameMode === 'memory' && <MemoryGame onBack={() => setGameMode(null)} />}
                            {gameMode === 'rhythm' && <ReactionGame onBack={() => setGameMode(null)} />}
                            {gameMode === 'alchemy' && <AlchemyGame onBack={() => setGameMode(null)} />}
                            {gameMode === 'popper' && <VoidPopperGame onBack={() => setGameMode(null)} />}
                            {gameMode === 'trivia' && <TriviaGame onBack={() => setGameMode(null)} />}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
