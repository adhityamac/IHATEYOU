'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, Star, Zap, TrendingUp, Award, Clock, Users, Share2, Swords, Crown, Medal, Send, Settings, Palette, Volume2, VolumeX, User, BarChart3, Calendar, MessageCircle } from 'lucide-react';

interface InteractiveGamingRoomProps {
    onSelectGame: (gameId: string) => void;
    onClose: () => void;
}

const GAMES = [
    { id: 'chess', name: 'Pixel Chess', icon: '♟️', category: 'brain', time: 15, difficulty: 'Hard', multiplayer: true },
    { id: 'pacman', name: 'Neon Pac-Man', icon: '👻', category: 'action', time: 10, difficulty: 'Medium', multiplayer: false },
    { id: 'memory', name: 'Memory Match', icon: '🧩', category: 'brain', time: 5, difficulty: 'Easy', multiplayer: true },
    { id: 'alchemy', name: 'Mood Alchemy', icon: '⚗️', category: 'creative', time: 8, difficulty: 'Medium', multiplayer: false },
    { id: 'trivia', name: 'Cosmic Trivia', icon: '🧠', category: 'brain', time: 10, difficulty: 'Hard', multiplayer: true },
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: '🎲', category: 'quick', time: 3, difficulty: 'Easy', multiplayer: true },
];

const AVATARS = ['😎', '🎮', '🚀', '⭐', '🎨', '🧠', '⚡', '🔥', '💎', '👑', '🦄', '🐉'];
const THEMES = [
    { id: 'purple', name: 'Purple Dream', primary: '#9333ea', secondary: '#ec4899' },
    { id: 'blue', name: 'Ocean Blue', primary: '#3b82f6', secondary: '#06b6d4' },
    { id: 'green', name: 'Forest Green', primary: '#10b981', secondary: '#84cc16' },
    { id: 'orange', name: 'Sunset Orange', primary: '#f97316', secondary: '#eab308' },
    { id: 'red', name: 'Fire Red', primary: '#ef4444', secondary: '#f59e0b' },
];

const TOURNAMENTS = [
    { id: 1, name: 'Weekend Warriors', game: 'Chess', players: 32, prize: '1000 XP', starts: '2 hours', status: 'open' },
    { id: 2, name: 'Speed Challenge', game: 'Pac-Man', players: 64, prize: '500 XP', starts: '1 day', status: 'open' },
    { id: 3, name: 'Brain Battle', game: 'Trivia', players: 16, prize: '750 XP', starts: 'Live', status: 'live' },
];

const ANALYTICS_DATA = {
    weeklyGames: [12, 15, 18, 22, 19, 25, 28],
    skillProgress: [45, 52, 58, 65, 72, 78, 85],
    categoryBreakdown: { brain: 40, action: 30, creative: 20, quick: 10 },
};

export default function InteractiveGamingRoom({ onSelectGame, onClose }: InteractiveGamingRoomProps) {
    const [showGameMenu, setShowGameMenu] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showChallenges, setShowChallenges] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showMultiplayer, setShowMultiplayer] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showTournaments, setShowTournaments] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);
    const [hoveredArea, setHoveredArea] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [lastPlayed, setLastPlayed] = useState<string | null>('chess');
    const [leaderboardTab, setLeaderboardTab] = useState<'daily' | 'weekly' | 'alltime'>('daily');

    // Phase 4 State
    const [userAvatar, setUserAvatar] = useState('🎮');
    const [userName, setUserName] = useState('You');
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 2000);
    };

    const playSound = (type: 'click' | 'success' | 'error') => {
        if (!soundEnabled) return;
        // Sound effect would play here
        console.log(`Playing ${type} sound`);
    };

    const hotspots = [
        {
            id: 'computer',
            name: 'Computer',
            icon: '🖥️',
            left: '35%',
            top: '40%',
            width: '20%',
            height: '25%',
            action: () => { playSound('click'); setShowGameMenu(true); },
        },
        {
            id: 'arcade',
            name: 'Arcade Cabinet',
            icon: '🕹️',
            left: '5%',
            top: '30%',
            width: '18%',
            height: '40%',
            action: () => { playSound('click'); setShowTournaments(true); },
        },
        {
            id: 'lamp',
            name: 'Desk Lamp',
            icon: '💡',
            left: '30%',
            top: '25%',
            width: '10%',
            height: '15%',
            action: () => {
                const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
                playSound('success');
                showNotification(`🎲 Random: ${randomGame.name}!`);
                setTimeout(() => onSelectGame(randomGame.id), 1000);
            },
        },
        {
            id: 'bookshelf',
            name: 'Bookshelf',
            icon: '📚',
            left: '70%',
            top: '20%',
            width: '25%',
            height: '50%',
            action: () => { playSound('click'); setShowAchievements(true); },
        },
        {
            id: 'gameboy',
            name: 'Game Boy',
            icon: '🎮',
            left: '45%',
            top: '70%',
            width: '12%',
            height: '15%',
            action: () => { playSound('click'); setShowAnalytics(true); },
        },
    ];

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            {/* Gaming Room Background */}
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src="/gaming-room.png"
                    alt="Gaming Room"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Interactive Hotspots */}
            {hotspots.map((hotspot) => (
                <motion.button
                    key={hotspot.id}
                    className="absolute cursor-pointer group z-10"
                    style={{
                        left: hotspot.left,
                        top: hotspot.top,
                        width: hotspot.width,
                        height: hotspot.height,
                    }}
                    onClick={hotspot.action}
                    onMouseEnter={() => setHoveredArea(hotspot.id)}
                    onMouseLeave={() => setHoveredArea(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="w-full h-full" />

                    <AnimatePresence>
                        {hoveredArea === hotspot.id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 border-4 border-yellow-400 rounded-lg bg-yellow-400/20 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="text-white text-center">
                                    <div className="text-4xl mb-2">{hotspot.icon}</div>
                                    <div className="text-sm font-bold">{hotspot.name}</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            ))}


            {/* Settings & Sound Toggle */}
            <div className="absolute top-4 right-20 z-50 flex gap-2">
                <button
                    onClick={() => { playSound('click'); setSoundEnabled(!soundEnabled); }}
                    className="p-3 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm transition-colors shadow-lg"
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button
                    onClick={() => { playSound('click'); setShowSettings(true); }}
                    className="p-3 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm transition-colors shadow-lg"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Close Button */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={onClose}
                    className="p-3 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm transition-colors shadow-lg"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl shadow-lg max-w-xs z-20"
            >
                <p className="font-bold mb-2 text-yellow-400">🎮 Click on objects!</p>
                <ul className="space-y-1 text-sm">
                    <li>🖥️ Computer → Play games</li>
                    <li>🕹️ Arcade → Tournaments</li>
                    <li>💡 Lamp → Random game</li>
                    <li>📚 Bookshelf → Achievements</li>
                    <li>🎮 Game Boy → Analytics</li>
                </ul>
            </motion.div>

            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-8 py-4 rounded-full shadow-2xl text-lg font-bold z-50"
                    >
                        {notification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Customization Modal - PHASE 4 */}
            <AnimatePresence>
                {showProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-40"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-gray-900 to-black border-4 border-pink-500 rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 flex items-center gap-3">
                                    <User size={32} />
                                    Customize Profile
                                </h2>
                                <button onClick={() => setShowProfile(false)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Avatar Selection */}
                            <div className="mb-6">
                                <h3 className="text-white font-bold mb-3">Choose Avatar</h3>
                                <div className="grid grid-cols-6 gap-3">
                                    {AVATARS.map((avatar) => (
                                        <button
                                            key={avatar}
                                            onClick={() => { setUserAvatar(avatar); playSound('click'); }}
                                            className={`text-4xl p-4 rounded-xl transition-all ${userAvatar === avatar
                                                ? 'bg-pink-600 scale-110'
                                                : 'bg-gray-800 hover:bg-gray-700'
                                                }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Username */}
                            <div className="mb-6">
                                <h3 className="text-white font-bold mb-3">Username</h3>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border-2 border-gray-700 focus:border-pink-500 outline-none"
                                    placeholder="Enter username"
                                />
                            </div>

                            {/* Theme Selection */}
                            <div className="mb-6">
                                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <Palette size={20} />
                                    Choose Theme
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {THEMES.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => { setSelectedTheme(theme); playSound('click'); }}
                                            className={`p-4 rounded-xl transition-all ${selectedTheme.id === theme.id
                                                ? 'ring-4 ring-white scale-105'
                                                : 'hover:scale-105'
                                                }`}
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                                            }}
                                        >
                                            <p className="text-white font-bold">{theme.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => { playSound('success'); showNotification('✅ Profile saved!'); setShowProfile(false); }}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all"
                            >
                                Save Profile
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Analytics Dashboard - PHASE 4 */}
            <AnimatePresence>
                {showAnalytics && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-40"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-500 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 flex items-center gap-3">
                                    <BarChart3 size={32} />
                                    Advanced Analytics
                                </h2>
                                <button onClick={() => setShowAnalytics(false)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Weekly Games Chart */}
                            <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
                                <h3 className="text-white font-bold mb-4">Games Played This Week</h3>
                                <div className="flex items-end justify-between h-40 gap-2">
                                    {ANALYTICS_DATA.weeklyGames.map((count, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(count / 30) * 100}%` }}
                                                transition={{ delay: i * 0.1 }}
                                                className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-lg min-h-[20px]"
                                            />
                                            <span className="text-white text-sm">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                            <span className="text-gray-400 text-xs">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skill Progress */}
                            <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
                                <h3 className="text-white font-bold mb-4">Skill Progress</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Overall Skill</span>
                                            <span className="text-white font-bold">85%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '85%' }}
                                                className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-700/50 p-3 rounded-lg">
                                            <p className="text-gray-400 text-sm">Avg Score</p>
                                            <p className="text-white text-2xl font-bold">1,245</p>
                                        </div>
                                        <div className="bg-gray-700/50 p-3 rounded-lg">
                                            <p className="text-gray-400 text-sm">Best Streak</p>
                                            <p className="text-white text-2xl font-bold">12 🔥</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="bg-gray-800/50 p-6 rounded-xl">
                                <h3 className="text-white font-bold mb-4">Play Time by Category</h3>
                                <div className="space-y-3">
                                    {Object.entries(ANALYTICS_DATA.categoryBreakdown).map(([category, percent]) => (
                                        <div key={category}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400 capitalize">{category} Games</span>
                                                <span className="text-white font-bold">{percent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tournament System - PHASE 4 */}
            <AnimatePresence>
                {showTournaments && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-40"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-gray-900 to-black border-4 border-orange-500 rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 flex items-center gap-3">
                                    <Trophy size={32} />
                                    Tournaments
                                </h2>
                                <button onClick={() => setShowTournaments(false)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {TOURNAMENTS.map((tournament) => (
                                    <div key={tournament.id} className="bg-gray-800/50 p-6 rounded-xl border-2 border-gray-700">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-white font-bold text-xl mb-1">{tournament.name}</h3>
                                                <p className="text-gray-400 text-sm">{tournament.game}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${tournament.status === 'live'
                                                ? 'bg-red-600 text-white animate-pulse'
                                                : 'bg-green-600 text-white'
                                                }`}>
                                                {tournament.status === 'live' ? '🔴 LIVE' : '🟢 OPEN'}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                                                <p className="text-gray-400 text-xs">Players</p>
                                                <p className="text-white font-bold">{tournament.players}</p>
                                            </div>
                                            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                                                <p className="text-gray-400 text-xs">Prize</p>
                                                <p className="text-yellow-400 font-bold">{tournament.prize}</p>
                                            </div>
                                            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                                                <p className="text-gray-400 text-xs">Starts In</p>
                                                <p className="text-white font-bold">{tournament.starts}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { playSound('success'); showNotification(`🏆 Joined ${tournament.name}!`); }}
                                            className={`w-full py-3 rounded-xl font-bold transition-all ${tournament.status === 'live'
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white'
                                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                                                }`}
                                        >
                                            {tournament.status === 'live' ? 'Watch Live' : 'Join Tournament'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal - PHASE 4 */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-40"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-gradient-to-br from-gray-900 to-black border-4 border-blue-500 rounded-3xl p-8 max-w-md w-full mx-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Settings size={28} />
                                    Settings
                                </h2>
                                <button onClick={() => setShowSettings(false)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Sound Toggle */}
                                <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Volume2 size={20} className="text-white" />
                                        <span className="text-white font-bold">Sound Effects</span>
                                    </div>
                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className={`w-14 h-8 rounded-full transition-all ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: soundEnabled ? 24 : 0 }}
                                            className="w-6 h-6 bg-white rounded-full m-1"
                                        />
                                    </button>
                                </div>

                                {/* Music Toggle */}
                                <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Volume2 size={20} className="text-white" />
                                        <span className="text-white font-bold">Background Music</span>
                                    </div>
                                    <button
                                        onClick={() => setMusicEnabled(!musicEnabled)}
                                        className={`w-14 h-8 rounded-full transition-all ${musicEnabled ? 'bg-green-600' : 'bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: musicEnabled ? 24 : 0 }}
                                            className="w-6 h-6 bg-white rounded-full m-1"
                                        />
                                    </button>
                                </div>

                                {/* Notifications */}
                                <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle size={20} className="text-white" />
                                        <span className="text-white font-bold">Notifications</span>
                                    </div>
                                    <button className="w-14 h-8 rounded-full bg-green-600">
                                        <motion.div
                                            animate={{ x: 24 }}
                                            className="w-6 h-6 bg-white rounded-full m-1"
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Selection Menu (keeping existing) */}
            <AnimatePresence>
                {showGameMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-40"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-gray-900 to-black border-4 border-purple-500 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                                    🎮 SELECT GAME
                                </h2>
                                <button
                                    onClick={() => setShowGameMenu(false)}
                                    className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {GAMES.map((game) => (
                                    <motion.button
                                        key={game.id}
                                        onClick={() => { playSound('click'); onSelectGame(game.id); setShowGameMenu(false); }}
                                        className="group relative p-8 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white font-bold text-xl transition-all transform hover:scale-105 shadow-xl overflow-hidden"
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 flex flex-col items-center gap-3">
                                            <div className="text-6xl">{game.icon}</div>
                                            <div className="text-center">{game.name}</div>
                                            <div className="flex gap-2 text-xs">
                                                <span className="px-2 py-1 bg-white/20 rounded-full">{game.difficulty}</span>
                                                <span className="px-2 py-1 bg-white/20 rounded-full">{game.time}min</span>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Achievements Modal (keeping existing) */}
            <AnimatePresence>
                {showAchievements && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-40"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-500 rounded-3xl p-8 max-w-2xl w-full mx-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-3">
                                    <Trophy size={32} />
                                    Achievements
                                </h2>
                                <button onClick={() => setShowAchievements(false)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="text-center text-gray-400 py-8">
                                <Trophy size={64} className="mx-auto mb-4 opacity-50" />
                                <p>Your achievements will appear here!</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
