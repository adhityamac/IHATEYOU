'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    MessageCircle,
    Search,
    Settings,
    Zap,
    Flame,
    Users,
    Wifi,
    ChevronRight,
    Brain,
    Ghost,
    Sparkles,
    CheckCircle2,
    Circle,
    Plus,
    X,
    Heart,
    BookOpen,
    Wind,
    Music,
    Lock,
    GraduationCap,
    Camera
} from 'lucide-react';
import { Section } from '@/types/types';
import { useState, useCallback, memo } from 'react';
import DailyAffirmations from '@/features/wellness/components/DailyAffirmations';
import BreathingExercise from '@/features/wellness/components/BreathingExercise';
import JournalPrompts from '@/features/wellness/components/JournalPrompts';
import MoodInsights from '@/features/wellness/components/MoodInsights';
import RetroPlayer from '@/features/music/components/RetroPlayer';
import TimeCapsule from '@/features/wellness/components/TimeCapsule';
import QuestBoard from '@/features/gamification/components/QuestBoard';
import ModelViewer from '@/components/shared/ModelViewer';
import FocusTimer from './FocusTimer';
import WeatherWidget from './WeatherWidget';
import { useSignals } from '@/hooks/useSignals';
import { useTheme } from '@/components/shared/GradientThemeProvider';
import { useHapticFeedback, useIsMobile } from '@/hooks/useMobileUtils';
import { MobileButton } from '@/components/ui/MobileButton';

interface DashboardProps {
    onSectionChange: (section: Section) => void;
}

function DashboardComponent({ onSectionChange }: DashboardProps) {
    // Initialize greeting based on current hour to avoid setState in effect
    const getInitialGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        else if (hour < 18) return 'Good Afternoon';
        else return 'Good Evening';
    };
    const [greeting] = useState(getInitialGreeting);
    const { trackTool, trackInteraction } = useSignals('user-1'); // Fixed ID for demo
    const [systemStatus] = useState('OPTIMAL');
    const [activeWellnessTab, setActiveWellnessTab] = useState<'overview' | 'affirmations' | 'breathe' | 'journal' | 'insights' | 'capsule' | 'tutorials'>('overview');
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const [tasks, setTasks] = useState<{ id: number, text: string, completed: boolean }[]>([
        { id: 1, text: 'Meditate for 10m', completed: true },
        { id: 2, text: 'Journal thoughts', completed: false },
        { id: 3, text: 'Drink water', completed: false },
    ]);
    const [newTask, setNewTask] = useState('');

    // Mock posts for mood insights
    const mockPosts = [
        { id: 1, emotion: { id: 'joyful', name: 'Joyful' }, timestamp: new Date() },
        { id: 2, emotion: { id: 'calm', name: 'Calm' }, timestamp: new Date() },
        { id: 3, emotion: { id: 'grateful', name: 'Grateful' }, timestamp: new Date() },
    ];

    const addTask = useCallback(() => {
        if (!newTask.trim()) return;
        setTasks(prev => [...prev, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    }, [newTask]);

    const toggleTask = useCallback((id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        trackInteraction('task_toggle', 0);
    }, [trackInteraction]);

    const deleteTask = useCallback((id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    // Removed setGreeting in useEffect to avoid cascading renders

    // Theme integration
    const { theme } = useTheme();
    const isRetro = theme === 'retro-soul' || theme === 'retro';
    const { triggerHaptic } = useHapticFeedback();
    const isMobile = useIsMobile();

    // Theme Variables
    const textColor = isRetro ? 'text-black' : 'text-white';
    const mutedText = isRetro ? 'text-stone-600' : 'text-white/60';
    const cardBg = isRetro ? 'bg-stone-50/50 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-white/[0.03] border border-white/10';

    const stats = [
        { label: 'Current Streak', value: '12', unit: 'days', icon: Flame, color: isRetro ? 'text-orange-600' : 'text-orange-500', bg: isRetro ? 'bg-orange-100 border-2 border-orange-900' : 'bg-orange-500/10' },
        { label: 'Mood Score', value: '84', unit: '%', icon: Activity, color: isRetro ? 'text-emerald-700' : 'text-emerald-500', bg: isRetro ? 'bg-emerald-100 border-2 border-emerald-900' : 'bg-emerald-500/10' },
        { label: 'Neural Echoes', value: '1.2k', unit: 'sent', icon: Wifi, color: isRetro ? 'text-blue-700' : 'text-blue-500', bg: isRetro ? 'bg-blue-100 border-2 border-blue-900' : 'bg-blue-500/10' },
        { label: 'Soul Sync', value: '98', unit: '%', icon: Brain, color: isRetro ? 'text-purple-700' : 'text-purple-500', bg: isRetro ? 'bg-purple-100 border-2 border-purple-900' : 'bg-purple-500/10' },
    ];



    const recentActivity = [
        { id: 1, type: 'connection', content: 'New resonance with @luna_sky', time: '2m ago', icon: Users },
        { id: 2, type: 'achievement', content: 'Unlocked "Void Walker" badge', time: '1h ago', icon: Ghost },
        { id: 3, type: 'system', content: 'Neural core optimized', time: '3h ago', icon: Zap },
    ];

    return (
        <div className="p-6 pb-32 max-w-5xl mx-auto w-full">
            {/* Header Section - Neural Core Update */}
            <div className="relative mb-20 pt-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl opacity-30" />
                    {/* Floating Procedural Node */}
                    {/* 3D Model Container */}
                    <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-80 h-80 opacity-60 pointer-events-auto">
                        <ModelViewer path="/model.glb" />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center"
                >
                    <h1 className={`text-5xl md:text-8xl font-black italic ${textColor} tracking-tighter uppercase mb-4 leading-none`}>
                        {greeting}<br />
                        <span className={`${isRetro ? 'text-stone-800' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400'} glitch-text-sm`}>TRAVELER</span>
                    </h1>

                    <div className="flex flex-col items-center gap-4 mt-6">
                        <div className="flex items-center gap-6">
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${isRetro ? 'bg-white border-2 border-stone-800 shadow-[2px_2px_0px_#000]' : 'glass-premium'}`}>
                                <span className={`w-2 h-2 rounded-full ${isRetro ? 'bg-green-600' : 'bg-green-500'} animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]`} />
                                <span className={`text-[10px] font-black ${isRetro ? 'text-stone-600' : 'text-white/60'} tracking-widest uppercase`}>Core: {systemStatus}</span>
                            </div>
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${isRetro ? 'bg-white border-2 border-stone-800 shadow-[2px_2px_0px_#000]' : 'glass-premium'}`}>
                                <Wifi size={14} className={isRetro ? 'text-blue-600' : 'text-blue-400'} />
                                <span className={`text-[10px] font-black ${isRetro ? 'text-stone-600' : 'text-white/60'} tracking-widest uppercase`}>Resonance Link</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bento Grid Layout - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 auto-rows-[200px]">
                {/* Check In - HERO CARD (spans 3 cols, 2 rows) */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        if (isMobile) triggerHaptic('medium');
                        trackTool('check_in', 0);
                        onSectionChange('home');
                    }}
                    aria-label="Daily Check-In: Track your mood and emotions"
                    className="md:col-span-3 md:row-span-2 rounded-[32px] p-8 text-left relative overflow-hidden group hover-lift transition-smooth"
                    style={{ backgroundColor: isRetro ? '#c4b5fd' : '#c4b5fd' }}
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-4xl font-black text-black mb-2">Daily Check-In</h3>
                                    <p className="text-black/60 font-medium text-sm">How are you feeling today?</p>
                                </div>
                                {/* Last Mood Preview */}
                                <div className="text-6xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    😊
                                </div>
                            </div>

                            {/* Contextual Suggestion */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 px-4 py-2 bg-black/10 rounded-full inline-block"
                            >
                                <span className="text-xs font-bold text-black/70">💡 You haven't checked in today</span>
                            </motion.div>
                        </div>

                        {/* Quick Action on Hover */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity size={20} className="text-black/80" />
                                <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Track Your Mood</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all"
                            >
                                Start Now →
                            </motion.div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Activity size={40} className="text-black/40 animate-pulse" />
                    </div>
                </motion.button>

                {/* Streak Stats - Green Card with Live Counter */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="md:row-span-2 rounded-[32px] p-6 relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#bef264' : '#bef264' }}
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold text-black/60 uppercase tracking-wider mb-2">Current Streak</div>
                            <motion.div
                                className="text-6xl font-black text-black mb-1"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {stats[0].value}
                            </motion.div>
                            <div className="text-sm font-bold text-black/60">Days Strong 🔥</div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-black/30"
                                    initial={{ width: 0 }}
                                    animate={{ width: '80%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <p className="text-xs text-black/50 mt-2">8 more days to beat your record!</p>
                        </div>
                    </div>
                    <Flame size={24} className="absolute top-4 right-4 text-black/30 group-hover:text-orange-500 transition-colors" />
                </motion.div>

                {/* Wellness Hub - Pink Card with Quick Actions */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange('dashboard')}
                    aria-label="Wellness Hub: Access self-care tools including breathe, journal, and timer"
                    className="md:col-span-2 rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#fda4af' : '#fda4af' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-black mb-2">Wellness Hub</h3>
                        <p className="text-black/60 font-medium text-sm mb-4">Tools for self-care</p>

                        {/* Quick Action Buttons on Hover */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold text-black">
                                🧘 Breathe
                            </div>
                            <div className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold text-black">
                                📝 Journal
                            </div>
                            <div className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold text-black">
                                ⏱️ Timer
                            </div>
                        </div>
                    </div>
                    <Heart size={24} className="absolute bottom-4 right-4 text-black/30 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                </motion.button>

                {/* Messages - Yellow Card with Unread Badge */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange('messages')}
                    aria-label="Messages: View your conversations. You have 3 unread messages"
                    className="rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#fde047' : '#fde047' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-black mb-1">Messages</h3>
                        <p className="text-black/60 font-medium text-xs">Neural Link</p>

                        {/* Unread Count Badge */}
                        <motion.div
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-black"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            3
                        </motion.div>
                    </div>
                    <MessageCircle size={20} className="absolute bottom-4 right-4 text-black/30" />
                </motion.button>

                {/* Vision Board - Teal Card with Mini Collage Preview */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange('vision')}
                    aria-label="Vision Board: Create and view your dream pixels manifestation board"
                    className="rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#5eead4' : '#5eead4' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-black mb-1">Vision Board</h3>
                        <p className="text-black/60 font-medium text-xs mb-3">Dream Pixels</p>

                        {/* Mini Collage Preview */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-black/10 rounded text-center text-xl">✨</div>
                            <div className="w-8 h-8 bg-black/10 rounded text-center text-xl">🌟</div>
                            <div className="w-8 h-8 bg-black/10 rounded text-center text-xl">💫</div>
                        </div>
                    </div>
                    <Camera size={20} className="absolute bottom-4 right-4 text-black/30" />
                </motion.button>

                {/* Discovery - Orange Card (spans 2 cols) */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange('search')}
                    aria-label="Discovery: Find and explore new connections"
                    className="md:col-span-2 rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#fdba74' : '#fdba74' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-black mb-2">Discovery</h3>
                        <p className="text-black/60 font-medium text-sm">Find resonance & explore</p>
                    </div>
                    <Search size={24} className="absolute bottom-4 right-4 text-black/30 group-hover:scale-110 transition-transform" />
                </motion.button>

                {/* Soul Guide - Blue Card */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange('guide')}
                    aria-label="Soul Guide: Chat with your AI wellness companion"
                    className="rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#93c5fd' : '#93c5fd' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-black mb-1">Soul Guide</h3>
                        <p className="text-black/60 font-medium text-xs">AI Companion</p>
                    </div>
                    <Brain size={20} className="absolute bottom-4 right-4 text-black/30 group-hover:text-purple-600 transition-colors" />
                </motion.button>

                {/* Music Player - Rose Card */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMusicPlayer(true)}
                    aria-label="Retro Tunes: Open 90s music station player"
                    className="rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#fb7185' : '#fb7185' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-black mb-1">Retro Tunes</h3>
                        <p className="text-black/60 font-medium text-xs">90s Station</p>
                    </div>
                    <Music size={20} className="absolute bottom-4 right-4 text-black/30 group-hover:animate-pulse" />
                </motion.button>

                {/* Settings - Gray Card */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange('settings')}
                    aria-label="Settings: Manage app preferences and configuration"
                    className="rounded-[32px] p-6 text-left relative overflow-hidden group"
                    style={{ backgroundColor: isRetro ? '#d1d5db' : '#d1d5db' }}
                >
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-black mb-1">Settings</h3>
                        <p className="text-black/60 font-medium text-xs">Preferences</p>
                    </div>
                    <Settings size={20} className="absolute bottom-4 right-4 text-black/30 group-hover:rotate-90 transition-transform duration-300" />
                </motion.button>
            </div>

            {/* Recent Activity Feed - NEW */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 p-6 rounded-[32px] bg-white/5 border border-white/10"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-black ${textColor}`}>Recent Activity</h3>
                    <span className={`text-xs ${mutedText}`}>Last 24 hours</span>
                </div>
                <div className="space-y-3">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <activity.icon size={18} className={textColor} />
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${textColor}`}>{activity.content}</p>
                                <p className={`text-xs ${mutedText}`}>{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity & Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`md:col-span-2 p-8 rounded-[40px] ${cardBg}`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-xl font-black italic ${textColor} uppercase tracking-tighter`}>Neural Feed</h3>
                        <button className={`text-[10px] font-bold ${mutedText} uppercase tracking-widest hover:text-white`}>View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 group">
                                <div className={`w-12 h-12 rounded-2xl ${isRetro ? 'bg-white border-2 border-stone-800' : 'bg-white/5 border border-white/5'} flex items-center justify-center transition-colors`}>
                                    <item.icon size={20} className={isRetro ? 'text-stone-800' : 'text-white/60'} />
                                </div>
                                <div className="flex-1">
                                    <div className={`text-sm font-bold ${textColor}`}>{item.content}</div>
                                    <div className={`text-[10px] font-bold ${mutedText} uppercase tracking-widest`}>{item.time}</div>
                                </div>
                                <button className={`p-2 rounded-full ${isRetro ? 'hover:bg-stone-200 text-stone-400 hover:text-stone-900' : 'hover:bg-white/10 text-white/20 hover:text-white'} transition-colors`}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className={`p-8 rounded-[40px] ${isRetro ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10'} flex flex-col justify-between relative overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div>
                        <div className={`w-12 h-12 rounded-2xl ${isRetro ? 'bg-white border-2 border-stone-800' : 'bg-white/10'} flex items-center justify-center mb-6`}>
                            <Sparkles size={24} className={isRetro ? 'text-purple-600' : 'text-purple-300'} />
                        </div>
                        <h3 className={`text-xl font-black italic ${textColor} uppercase tracking-tighter mb-4`}>Daily Insight</h3>
                        <p className={`text-lg font-medium ${isRetro ? 'text-stone-800' : 'text-white/70'} italic leading-relaxed`}>
                            "The void is not empty; it is full of potential waiting to be shaped by your perception."
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold ${mutedText} uppercase tracking-widest`}>Resonance</span>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-black" />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <FocusTimer />

            <WeatherWidget />

            {/* Tasks Widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className={`mt-6 p-8 rounded-[40px] ${cardBg}`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-black italic ${textColor} uppercase tracking-tighter`}>Daily Goals</h3>
                    <div className={`text-[10px] font-bold ${mutedText} uppercase tracking-widest`}>
                        {tasks.filter(t => t.completed).length}/{tasks.length} Completed
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 group">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`p-1 rounded-full transition-colors ${task.completed ? 'text-emerald-400' : `${isRetro ? 'text-stone-400 hover:text-stone-800' : 'text-white/20 hover:text-white/40'}`}`}
                            >
                                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <span className={`flex-1 text-lg font-medium transition-all ${task.completed ? `${isRetro ? 'text-stone-300' : 'text-white/20'} line-through` : textColor}`}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className={`opacity-0 group-hover:opacity-100 p-2 ${isRetro ? 'text-stone-400 hover:text-red-600' : 'text-white/20 hover:text-red-400'} transition-all`}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Add a new goal..."
                        className={`flex-1 ${isRetro ? 'bg-white border-stone-800 text-black placeholder:text-stone-400' : 'bg-white/5 border-white/10 text-white placeholder:text-white/20'} border rounded-xl px-4 py-3 focus:outline-none focus:border-opacity-50 transition-colors`}
                    />
                    <button
                        onClick={addTask}
                        className={`p-3 rounded-xl ${isRetro ? 'bg-stone-900 text-white hover:bg-black border-2 border-black' : 'bg-white text-black hover:bg-gray-200'} transition-colors`}
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </motion.div>

            {/* Wellness Hub Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mt-6"
            >
                {/* Wellness Header & Tabs */}
                <div className="mb-6">
                    <h2 className={`text-3xl font-black italic ${textColor} uppercase tracking-tighter mb-6 flex items-center gap-3`}>
                        <Heart className="text-pink-400" size={32} />
                        Wellness Hub
                    </h2>

                    {/* Wellness Tabs */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { id: 'overview' as const, label: 'Overview', icon: Sparkles },
                            { id: 'affirmations' as const, label: 'Affirmations', icon: Sparkles },
                            { id: 'breathe' as const, label: 'Breathe', icon: Wind },
                            { id: 'journal' as const, label: 'Journal', icon: BookOpen },
                            { id: 'insights' as const, label: 'Insights', icon: Brain },
                            { id: 'capsule' as const, label: 'Time Capsule', icon: Lock },
                            { id: 'tutorials' as const, label: 'Tutorials', icon: GraduationCap },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setActiveWellnessTab(tab.id);
                                    trackTool(`wellness_${tab.id}`, 0);
                                }}
                                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeWellnessTab === tab.id
                                    ? 'bg-white text-black shadow-xl'
                                    : `${isRetro ? 'bg-white border-2 border-stone-800 text-stone-600 hover:bg-stone-100' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Wellness Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeWellnessTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeWellnessTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('affirmations')}
                                    className={`p-8 rounded-[32px] ${isRetro ? 'bg-orange-100 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10'} text-left group`}
                                >
                                    <Sparkles className="text-yellow-400 mb-4" size={32} />
                                    <h3 className={`text-2xl font-black ${textColor} mb-2`}>Daily Affirmations</h3>
                                    <p className={`${mutedText} text-sm`}>Positive messages to start your day</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('breathe')}
                                    className={`p-8 rounded-[32px] ${isRetro ? 'bg-cyan-100 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10'} text-left group`}
                                >
                                    <Wind className="text-cyan-400 mb-4" size={32} />
                                    <h3 className={`text-2xl font-black ${textColor} mb-2`}>Breathing Exercise</h3>
                                    <p className={`${mutedText} text-sm`}>4-4-4-2 guided meditation</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('journal')}
                                    className={`p-8 rounded-[32px] ${isRetro ? 'bg-purple-100 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10'} text-left group`}
                                >
                                    <BookOpen className="text-purple-400 mb-4" size={32} />
                                    <h3 className={`text-2xl font-black ${textColor} mb-2`}>Journal Prompts</h3>
                                    <p className={`${mutedText} text-sm`}>Guided self-reflection</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('insights')}
                                    className={`p-8 rounded-[32px] ${isRetro ? 'bg-emerald-100 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10'} text-left group`}
                                >
                                    <Brain className="text-green-400 mb-4" size={32} />
                                    <h3 className={`text-2xl font-black ${textColor} mb-2`}>Mood Insights</h3>
                                    <p className={`${mutedText} text-sm`}>Emotional analytics</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('capsule')}
                                    className={`p-8 rounded-[32px] ${isRetro ? 'bg-stone-200 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-white/10'} text-left group`}
                                >
                                    <Lock className="text-indigo-400 mb-4" size={32} />
                                    <h3 className={`text-2xl font-black ${textColor} mb-2`}>Time Capsule</h3>
                                    <p className={`${mutedText} text-sm`}>Message your future self</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('tutorials')}
                                    className={`p-8 rounded-[32px] ${isRetro ? 'bg-blue-100 border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10'} text-left group`}
                                >
                                    <GraduationCap className="text-blue-400 mb-4" size={32} />
                                    <h3 className={`text-2xl font-black ${textColor} mb-2`}>Tutorials</h3>
                                    <p className={`${mutedText} text-sm`}>Learn CBT & Meditation</p>
                                </motion.button>
                            </div>
                        )}

                        {activeWellnessTab === 'affirmations' && <DailyAffirmations />}
                        {activeWellnessTab === 'breathe' && <BreathingExercise />}
                        {activeWellnessTab === 'journal' && <JournalPrompts />}
                        {activeWellnessTab === 'insights' && <MoodInsights posts={mockPosts} />}
                        {activeWellnessTab === 'capsule' && <TimeCapsule />}
                        {activeWellnessTab === 'tutorials' && <QuestBoard />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Music Player Modal */}
            <AnimatePresence>
                {showMusicPlayer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setShowMusicPlayer(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg bg-[#1a1a1c] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl h-[80vh]"
                        >
                            <button
                                onClick={() => setShowMusicPlayer(false)}
                                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                            <RetroPlayer />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Dashboard = memo(DashboardComponent);
export default Dashboard;