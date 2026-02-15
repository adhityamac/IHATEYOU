'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, Zap, Settings, Volume2, BarChart3, Users, Play, Medal } from 'lucide-react';
import StatsDashboard from './StatsDashboard';
import AchievementsList from './AchievementsList';
import DailyChallenges from './DailyChallenges';
import { MOCK_USER_STATS, MOCK_ACHIEVEMENTS, MOCK_CHALLENGES } from '../data/mockEngagementData';
import { GameCard } from './GameCard';

interface InteractiveGamingRoomProps {
    onSelectGame: (gameId: string) => void;
    onClose: () => void;
}

const GAMES = [
    { id: 'chess', name: 'Pixel Chess', description: 'Master the classic strategy.', icon: '♟️', category: 'brain', time: 15, difficulty: 'Hard', multiplayer: true, featured: true },
    { id: 'pacman', name: 'Neon Pac-Man', description: 'Retro arcade action.', icon: '👻', category: 'action', time: 10, difficulty: 'Medium', multiplayer: false, featured: false },
    { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Classic 3x3 for quick wins.', icon: '🎲', category: 'quick', time: 3, difficulty: 'Easy', multiplayer: true },
    { id: 'rhythm', name: 'Neon Rhythm', description: 'Tap to the beat.', icon: '🎵', category: 'quick', time: 5, difficulty: 'Easy', multiplayer: false },
    // Connection Activities
    { id: 'truth-or-depth', name: 'Truth or Depth', description: 'Deep questions for connection.', icon: '💌', category: 'connection', time: 10, difficulty: 'Easy', multiplayer: true },
    { id: 'know-me', name: 'Know Me Quiz', description: 'Test your friendship.', icon: '🧠', category: 'connection', time: 10, difficulty: 'Easy', multiplayer: true },
    { id: 'mood-sync', name: 'Mood Sync', description: 'Align your vibes.', icon: '🌙', category: 'connection', time: 3, difficulty: 'Easy', multiplayer: true },
    { id: 'memory-builder', name: 'Memory Builder', description: 'Craft shared stories.', icon: '📖', category: 'connection', time: 15, difficulty: 'Easy', multiplayer: true },
    { id: 'conflict-sim', name: 'Conflict Sim', description: 'Safe space for disputes.', icon: '🧩', category: 'connection', time: 10, difficulty: 'Medium', multiplayer: true },
    { id: 'future-map', name: 'Future Map', description: 'Align your paths.', icon: '🌌', category: 'connection', time: 10, difficulty: 'Easy', multiplayer: true },
    { id: 'heartbeat', name: 'Heartbeat Timer', description: 'Sync up now.', icon: '🫀', category: 'connection', time: 1, difficulty: 'Easy', multiplayer: true },
];

const THEMES = [
    { id: 'purple', name: 'Purple Dream', primary: '#9333ea', secondary: '#ec4899' },
    { id: 'blue', name: 'Ocean Blue', primary: '#3b82f6', secondary: '#06b6d4' },
    { id: 'green', name: 'Forest Green', primary: '#10b981', secondary: '#84cc16' },
    { id: 'orange', name: 'Sunset Orange', primary: '#f97316', secondary: '#eab308' },
    { id: 'red', name: 'Fire Red', primary: '#ef4444', secondary: '#f5576c' },
];

export default function InteractiveGamingRoom({ onSelectGame, onClose }: InteractiveGamingRoomProps) {
    // Modal States
    const [showGameMenu, setShowGameMenu] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showTournaments, setShowTournaments] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // User Settings
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [userAvatar, setUserAvatar] = useState('🎮');
    const [userName, setUserName] = useState('PlayerOne');
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [notification, setNotification] = useState<string | null>(null);

    // Mock Data State
    const [userStats, setUserStats] = useState(MOCK_USER_STATS);
    const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);
    const [challenges, setChallenges] = useState(MOCK_CHALLENGES);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 2000);
    };

    const playSound = (type: 'click' | 'success' | 'error') => {
        if (!soundEnabled) return;
        // console.log(`Playing ${type} sound`);
    };

    const handleClaimChallenge = (id: string) => {
        setChallenges(prev => prev.map(c =>
            c.id === id ? { ...c, claimed: true } : c
        ));
        playSound('success');
        showNotification('Reward Claimed! +300 XP');
        // Update local stats mock
        setUserStats(prev => ({
            ...prev,
            totalXp: prev.totalXp + 300
        }));
    };

    // Helper for Glass Cards
    const GlassCard = ({ children, className = "", onClick, style }: any) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl overflow-hidden relative cursor-pointer group hover:bg-white/15 transition-colors ${className}`}
            style={style}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {children}
        </motion.div>
    );

    return (
        <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden text-white font-sans selection:bg-orange-500/30">
            {/* Animated Mesh Background - Warm Orange Tone */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-black animate-gradient-xy opacity-80" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

            {/* Floating Orbs (Decorative - Warm) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-[100px] animate-blob" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />

            {/* Main Content Container */}
            <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col max-w-[1600px] mx-auto">

                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <span className="text-2xl">{userAvatar}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Welcome, {userName}</h1>
                            <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Level {userStats.level} • {userStats.totalXp.toLocaleString()} XP</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => { playSound('click'); setShowAchievements(true) }} className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm border border-white/10 transition-colors relative">
                            <Medal size={20} className="text-yellow-400" />
                            {achievements.filter(a => a.progress >= a.maxProgress).length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />}
                        </button>
                        <button onClick={() => { playSound('click'); setShowSettings(true) }} className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm border border-white/10 transition-colors">
                            <Settings size={20} />
                        </button>
                        <button onClick={onClose} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full backdrop-blur-sm border border-red-500/20 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </header>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-rows-4 gap-4 flex-1 min-h-0">

                    {/* 1. Featured Game (Hero) - Large */}
                    <GlassCard
                        className="col-span-2 md:col-span-4 lg:col-span-4 row-span-2 flex flex-col justify-end p-8 relative overflow-hidden"
                        onClick={() => onSelectGame('chess')}
                    >
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1610631066894-6245271549ea?q=80&w=2574&auto=format&fit=crop"
                                alt="Featured"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">Featured</span>
                                <span className="flex items-center gap-1 text-white/60 text-xs font-bold"><Users size={12} /> 1.2k playing</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 text-white">PIXEL CHESS</h2>
                            <p className="text-white/80 max-w-md mb-6 line-clamp-2">Master the board in this retro-styled classic. Challenge friends or climb the global leaderboard.</p>
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors flex items-center gap-2 w-fit">
                                <Play size={18} fill="currentColor" /> Play Now
                            </button>
                        </div>
                    </GlassCard>

                    {/* 2. Challenges Card */}
                    <GlassCard
                        className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex flex-col gap-4 group justify-between"
                        onClick={() => setShowTournaments(true)}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold flex items-center gap-2"><Target /> Quests</h3>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full">{challenges.filter(c => !c.completed).length} Active</span>
                        </div>

                        <div className="space-y-3">
                            {challenges.slice(0, 2).map(c => (
                                <div key={c.id} className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>{c.icon}</span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold">{c.title}</span>
                                            <span className="text-[10px] text-white/50">{c.progress}/{c.maxProgress}</span>
                                        </div>
                                    </div>
                                    {c.completed && !c.claimed && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                                </div>
                            ))}
                        </div>

                        <div className="text-xs text-center text-white/40 uppercase font-bold tracking-widest mt-2 group-hover:text-white transition-colors">
                            View All Challenges
                        </div>
                    </GlassCard>

                    {/* 3. Library / All Games - MEGA SIZE */}
                    <GlassCard
                        className="col-span-2 md:col-span-4 lg:col-span-4 row-span-2 bg-white/5 hover:bg-white/10"
                        onClick={() => setShowGameMenu(true)}
                    >
                        <div className="flex flex-col h-full p-4">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold mb-1">Library</h3>
                                    <p className="text-white/50">Explore full collection</p>
                                </div>
                                <div className="p-2 bg-white/10 rounded-full">
                                    <Target className="text-white" />
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-4 gap-4 items-stretch content-start overflow-y-auto pr-2 custom-scrollbar">
                                {GAMES.slice(0, 4).map((game) => (
                                    <GameCard
                                        key={game.id}
                                        {...game}
                                        onClick={() => onSelectGame(game.id)}
                                        className={game.featured ? "col-span-2 row-span-2 min-h-[auto]" : "col-span-1 min-h-[140px]"}
                                    />
                                ))}
                            </div>

                            <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/5">
                                <span className="text-xs font-bold text-white/40">{GAMES.length} Games Available</span>
                                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">View All <Play size={10} /></span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* 4. Stats & Analytics - TALL */}
                    <GlassCard
                        className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 flex flex-col"
                        onClick={() => setShowStats(true)}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-green-400">Stats</h3>
                                <p className="text-white/40 text-xs">Your progress</p>
                            </div>
                            <BarChart3 className="text-green-500 opacity-80" />
                        </div>

                        <div className="flex-1 flex flex-col justify-end gap-4">
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Rank</p>
                                <p className="text-2xl font-black text-white">{userStats.rank}</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Win Rate</p>
                                <p className="text-2xl font-black text-white">{userStats.winRate}%</p>
                            </div>
                        </div>
                    </GlassCard>

                </div>
            </div>

            {/* --- MODAL LAYERS --- */}

            {/* Game Menu (Library) */}
            <AnimatePresence>
                {showGameMenu && (
                    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-5xl h-[80vh] flex flex-col bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900/50">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Target className="text-purple-500" /> Game Library
                                </h2>
                                <button onClick={() => setShowGameMenu(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 custom-scrollbar">
                                {GAMES.map(game => (
                                    <GameCard
                                        key={game.id}
                                        {...game}
                                        onClick={() => { onSelectGame(game.id); setShowGameMenu(false); }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Stats Modal */}
            <AnimatePresence>
                {showStats && (
                    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            className="w-full max-w-4xl h-[85vh] bg-gray-900 border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2"><BarChart3 /> Career Stats</h2>
                                <button onClick={() => setShowStats(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-hidden p-6">
                                <StatsDashboard stats={userStats} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Achievements Modal */}
            <AnimatePresence>
                {showAchievements && (
                    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl h-[85vh] bg-gray-900 border border-yellow-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Trophy /> Achievements</h2>
                                <button onClick={() => setShowAchievements(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-hidden p-6">
                                <AchievementsList achievements={achievements} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Challenges Modal (Replaces Tournaments for now) */}
            <AnimatePresence>
                {showTournaments && (
                    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="w-full max-w-2xl h-[80vh] bg-gray-900 border border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-orange-500/5 to-transparent">
                                <h2 className="text-2xl font-bold flex items-center gap-3 text-orange-400">
                                    <Target /> Daily Quests
                                </h2>
                                <button onClick={() => setShowTournaments(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <p className="text-white/50 text-sm mb-6">Complete quests to earn XP and unlock rare rewards. Daily quests reset every 24h.</p>
                                <DailyChallenges challenges={challenges} onClaim={handleClaimChallenge} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md bg-gray-900 border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl p-8 relative"
                        >
                            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={20} /></button>
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-blue-400">
                                <Settings /> Settings
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Volume2 /> <span>Sound Effects</span>
                                    </div>
                                    <button onClick={() => setSoundEnabled(!soundEnabled)} className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-700'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Volume2 /> <span>Music</span>
                                    </div>
                                    <button onClick={() => setMusicEnabled(!musicEnabled)} className={`w-12 h-6 rounded-full relative transition-colors ${musicEnabled ? 'bg-green-500' : 'bg-gray-700'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${musicEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-white font-bold shadow-2xl z-[200]"
                    >
                        {notification}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
