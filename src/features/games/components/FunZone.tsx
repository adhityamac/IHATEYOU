'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSignals } from '@/hooks/useSignals';
import TicTacToe from './TicTacToe';
import ReactionGame from './ReactionGame';
import PixelChess from './PixelChess';
import PacmanGame from './PacmanGame';
import InteractiveGamingRoom from './InteractiveGamingRoom';
import TruthOrDepth from './TruthOrDepth';
import KnowMeQuiz from './KnowMeQuiz';
import MoodSync from './MoodSync';
import MemoryBuilder from './MemoryBuilder';
import ConflictSim from './ConflictSim';
import FutureMap from './FutureMap';
import HeartbeatTimer from './HeartbeatTimer';

// Game data matching the modern design
interface Game {
    id: string;
    name: string;
    category: 'Brain Games' | 'Action Games' | 'Creative Games' | 'Quick Play' | 'Connection';
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
    // ─── Connection Activities ────────────────────────────
    {
        id: 'truth-or-depth',
        name: 'Truth or Depth',
        category: 'Connection',
        description: 'Layered questions that build deeper trust.',
        icon: '💌',
        playCount: 0,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    },
    {
        id: 'know-me',
        name: 'How Well Do You Know Me?',
        category: 'Connection',
        description: 'Two-player quiz — wrong answers teach, not shame.',
        icon: '🧠',
        playCount: 0,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    },
    {
        id: 'mood-sync',
        name: 'Mood Sync',
        category: 'Connection',
        description: 'See if you\'re on the same wavelength.',
        icon: '🌙',
        playCount: 0,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    },
    {
        id: 'memory-builder',
        name: 'Memory Builder',
        category: 'Connection',
        description: 'Build your shared story, one line at a time.',
        icon: '📖',
        playCount: 0,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #d97706 0%, #f43f5e 100%)',
    },
    {
        id: 'conflict-sim',
        name: 'Conflict Simulator',
        category: 'Connection',
        description: 'Practice disagreements before they happen.',
        icon: '🧩',
        playCount: 0,
        difficulty: 'Medium',
        gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
    },
    {
        id: 'future-map',
        name: 'Future Map',
        category: 'Connection',
        description: 'Visualize where your futures overlap.',
        icon: '🌌',
        playCount: 0,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
    },
    {
        id: 'heartbeat',
        name: 'Heartbeat Timer',
        category: 'Connection',
        description: '30 seconds of pure presence.',
        icon: '🫀',
        playCount: 0,
        difficulty: 'Easy',
        gradient: 'linear-gradient(135deg, #be123c 0%, #881337 100%)',
    },
];

const categories = ['All', 'Brain Games', 'Action Games', 'Quick Play', 'Connection'];

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
                ) : [
                    'truth-or-depth', 'know-me', 'mood-sync',
                    'memory-builder', 'conflict-sim', 'future-map', 'heartbeat',
                ].includes(gameMode) ? (
                    // Connection activities — fullscreen via ConnectionShell
                    <div className="w-full h-full">
                        {gameMode === 'truth-or-depth' && <TruthOrDepth onBack={() => setGameMode(null)} />}
                        {gameMode === 'know-me' && <KnowMeQuiz onBack={() => setGameMode(null)} />}
                        {gameMode === 'mood-sync' && <MoodSync onBack={() => setGameMode(null)} />}
                        {gameMode === 'memory-builder' && <MemoryBuilder onBack={() => setGameMode(null)} />}
                        {gameMode === 'conflict-sim' && <ConflictSim onBack={() => setGameMode(null)} />}
                        {gameMode === 'future-map' && <FutureMap onBack={() => setGameMode(null)} />}
                        {gameMode === 'heartbeat' && <HeartbeatTimer onBack={() => setGameMode(null)} />}
                    </div>
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
                            {gameMode === 'pacman' && <PacmanGame onBack={() => setGameMode(null)} />}
                            {gameMode === 'tictactoe' && <TicTacToe onBack={() => setGameMode(null)} />}
                            {gameMode === 'rhythm' && <ReactionGame onBack={() => setGameMode(null)} />}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
