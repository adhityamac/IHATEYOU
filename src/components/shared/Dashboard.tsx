'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    MessageCircle,
    Search,
    Settings,
    Zap,
    Flame,
    TrendingUp,
    Users,
    Clock,
    Calendar,
    Shield,
    Wifi,
    Battery,
    ChevronRight,
    Bell,
    Brain,
    Ghost,
    Sparkles,
    Play,
    Pause,
    RotateCcw,
    CloudRain,
    Wind,
    Droplets,
    CheckCircle2,
    Circle,
    Plus,
    X,
    Heart,
    BookOpen
} from 'lucide-react';
import { Section } from '@/types/types';
import { useState, useEffect } from 'react';
import DailyAffirmations from '@/features/wellness/components/DailyAffirmations';
import BreathingExercise from '@/features/wellness/components/BreathingExercise';
import JournalPrompts from '@/features/wellness/components/JournalPrompts';
import MoodInsights from '@/features/wellness/components/MoodInsights';
import { useSignals } from '@/hooks/useSignals';

interface DashboardProps {
    onSectionChange: (section: Section) => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
    // Initialize greeting based on current hour to avoid setState in effect
    const getInitialGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        else if (hour < 18) return 'Good Afternoon';
        else return 'Good Evening';
    };
    const [greeting, setGreeting] = useState(getInitialGreeting);
    const { trackTool, trackInteraction } = useSignals('user-1'); // Fixed ID for demo
    const [systemStatus, setSystemStatus] = useState('OPTIMAL');
    const [timer, setTimer] = useState(25 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [activeWellnessTab, setActiveWellnessTab] = useState<'overview' | 'affirmations' | 'breathe' | 'journal' | 'insights'>('overview');
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

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        trackInteraction('task_toggle', 0);
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const toggleTimer = () => setIsTimerActive(!isTimerActive);
    const resetTimer = () => {
        setIsTimerActive(false);
        setTimer(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Removed setGreeting in useEffect to avoid cascading renders

    const stats = [
        { label: 'Current Streak', value: '12', unit: 'days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Mood Score', value: '84', unit: '%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Neural Echoes', value: '1.2k', unit: 'sent', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Soul Sync', value: '98', unit: '%', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    const quickActions = [
        { id: 'home', label: 'Check In', icon: Activity, desc: 'Log your frequency', color: 'from-rose-500 to-orange-500' },
        { id: 'wellness', label: 'Wellness Hub', icon: Heart, desc: 'Self-care tools', color: 'from-pink-500 to-purple-500' },
        { id: 'messages', label: 'Neural Link', icon: MessageCircle, desc: 'Open channels', color: 'from-purple-500 to-blue-500' },
        { id: 'search', label: 'Discovery', icon: Search, desc: 'Find resonance', color: 'from-emerald-500 to-teal-500' },
        { id: 'settings', label: 'Settings', icon: Settings, desc: 'App preferences', color: 'from-gray-500 to-gray-800' },
        { id: 'trending', label: 'Trending', icon: Flame, desc: 'See what’s hot', color: 'from-yellow-500 to-red-500' },
    ];

    const recentActivity = [
        { id: 1, type: 'connection', content: 'New resonance with @luna_sky', time: '2m ago', icon: Users },
        { id: 2, type: 'achievement', content: 'Unlocked "Void Walker" badge', time: '1h ago', icon: Ghost },
        { id: 3, type: 'system', content: 'Neural core optimized', time: '3h ago', icon: Zap },
    ];

    return (
        <div className="p-6 pb-32 max-w-5xl mx-auto w-full">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-end mb-12"
            >
                <div>
                    <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase mb-2">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Traveler</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        System Status: {systemStatus}
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <Battery size={16} className="text-white/60" />
                        <span className="text-xs font-mono text-white/60">100%</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <Wifi size={16} className="text-white/60" />
                        <span className="text-xs font-mono text-white/60">LINKED</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
                    >
                        <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                            <stat.icon size={20} className={stat.color} />
                        </div>
                        <div className="text-3xl font-black text-white italic mb-1">{stat.value}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>

                        <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-10 transition-opacity">
                            <stat.icon size={80} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {quickActions.map((action, i) => (
                    <motion.button
                        key={action.id}
                        onClick={() => onSectionChange(action.id as Section)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative h-48 rounded-[40px] overflow-hidden group text-left p-8"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md w-fit">
                                    <action.icon size={24} className="text-white" />
                                </div>
                                <div className="p-2 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                    <ChevronRight size={20} className="text-white" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-1">{action.label}</h3>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{action.desc}</p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Recent Activity & Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="md:col-span-2 p-8 rounded-[40px] bg-white/[0.03] border border-white/10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Neural Feed</h3>
                        <button className="text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white">View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                                    <item.icon size={20} className="text-white/60" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white/80">{item.content}</div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.time}</div>
                                </div>
                                <button className="p-2 rounded-full hover:bg-white/10 text-white/20 hover:text-white transition-colors">
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
                    className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                            <Sparkles size={24} className="text-purple-300" />
                        </div>
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-4">Daily Insight</h3>
                        <p className="text-lg font-medium text-white/70 italic leading-relaxed">
                            "The void is not empty; it is full of potential waiting to be shaped by your perception."
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Resonance</span>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-black" />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Focus Timer Widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Focus Mode</h3>
                    </div>
                    <p className="text-white/40 font-bold text-xs uppercase tracking-widest max-w-md">
                        Align your frequency. 25 minutes of deep work.
                    </p>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums">
                        {formatTime(timer)}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={toggleTimer}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isTimerActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:scale-105'}`}
                        >
                            {isTimerActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white/40 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                                <CloudRain size={20} />
                            </div>
                            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Local Atmosphere</h3>
                        </div>
                        <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
                            Sector 7 • Neon District
                        </p>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="text-center">
                            <div className="text-5xl font-black text-white italic tracking-tighter">18°</div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Heavy Mist</div>
                        </div>

                        <div className="flex gap-8 border-l border-white/10 pl-8">
                            <div>
                                <div className="flex items-center gap-2 text-white/60 mb-1">
                                    <Wind size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Wind</span>
                                </div>
                                <div className="text-lg font-bold text-white">12 <span className="text-xs text-white/40">km/h</span></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-white/60 mb-1">
                                    <Droplets size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Humidity</span>
                                </div>
                                <div className="text-lg font-bold text-white">84 <span className="text-xs text-white/40">%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tasks Widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Daily Goals</h3>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {tasks.filter(t => t.completed).length}/{tasks.length} Completed
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 group">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`p-1 rounded-full transition-colors ${task.completed ? 'text-emerald-400' : 'text-white/20 hover:text-white/40'}`}
                            >
                                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <span className={`flex-1 text-lg font-medium transition-all ${task.completed ? 'text-white/20 line-through' : 'text-white/80'}`}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
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
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <button
                        onClick={addTask}
                        className="p-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors"
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
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
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
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
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
                                    className="p-8 rounded-[32px] bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10 text-left group"
                                >
                                    <Sparkles className="text-yellow-400 mb-4" size={32} />
                                    <h3 className="text-2xl font-black text-white mb-2">Daily Affirmations</h3>
                                    <p className="text-white/60 text-sm">Positive messages to start your day</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('breathe')}
                                    className="p-8 rounded-[32px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 text-left group"
                                >
                                    <Wind className="text-cyan-400 mb-4" size={32} />
                                    <h3 className="text-2xl font-black text-white mb-2">Breathing Exercise</h3>
                                    <p className="text-white/60 text-sm">4-4-4-2 guided meditation</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('journal')}
                                    className="p-8 rounded-[32px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 text-left group"
                                >
                                    <BookOpen className="text-purple-400 mb-4" size={32} />
                                    <h3 className="text-2xl font-black text-white mb-2">Journal Prompts</h3>
                                    <p className="text-white/60 text-sm">Guided self-reflection</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveWellnessTab('insights')}
                                    className="p-8 rounded-[32px] bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 text-left group"
                                >
                                    <Brain className="text-green-400 mb-4" size={32} />
                                    <h3 className="text-2xl font-black text-white mb-2">Mood Insights</h3>
                                    <p className="text-white/60 text-sm">Emotional analytics</p>
                                </motion.button>
                            </div>
                        )}

                        {activeWellnessTab === 'affirmations' && <DailyAffirmations />}
                        {activeWellnessTab === 'breathe' && <BreathingExercise />}
                        {activeWellnessTab === 'journal' && <JournalPrompts />}
                        {activeWellnessTab === 'insights' && <MoodInsights posts={mockPosts} />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}