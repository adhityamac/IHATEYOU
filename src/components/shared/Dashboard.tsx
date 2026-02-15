'use client';

import { motion } from 'framer-motion';
import {
    Search,
    Home,
    BookOpen,
    Heart,
    Activity,
    Settings,
    LogOut,
    Gift,
    ChevronRight,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    MessageCircle,
    User,
    BarChart3,
    Disc
} from 'lucide-react';
import { Section } from '@/types/types';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CharacterBook from '@/features/auth/components/CharacterBook';
import { AnimatePresence } from 'framer-motion';

import BreathingExercise from './dashboard/BreathingExercise';
import Journal from './dashboard/Journal';
import Affirmations from './dashboard/Affirmations';
import Insights from './dashboard/Insights';




interface DashboardProps {
    onSectionChange: (section: Section) => void;
}


import { useDashboardData } from '@/hooks/useDashboardData';

// --- Mock Data ---

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: Home, active: true },
    { id: 'social', label: 'Social', icon: User },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'games', label: 'Play Zone', icon: Play },
    { id: 'guide', label: 'Soul Guide', icon: BookOpen },
    { id: 'vision', label: 'Vision Board', icon: Activity }, // Activity icon as placeholder for Vision
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard({ onSectionChange }: DashboardProps) {
    const { user, completeOnboarding, logout } = useAuth();
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Persistent Data Hook
    const {
        goals,
        currentMood,
        toggleGoal,
        addGoal,
        deleteGoal,
        updateMood,
        hydration,
        streak,
        updateHydration
    } = useDashboardData();

    // UI State
    const [newGoal, setNewGoal] = useState('');
    const [showBreathing, setShowBreathing] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [showAffirmations, setShowAffirmations] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [quote, setQuote] = useState({ text: "You are stronger than you think.", author: "Unknown" });

    // Quotes Data
    const QUOTES = [
        { text: "The only way out is through.", author: "Robert Frost" },
        { text: "Breathe. It's just a bad day, not a bad life.", author: "Unknown" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
        { text: "Happiness depends upon ourselves.", author: "Aristotle" }
    ];

    const refreshQuote = () => {
        const randomals = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomals);
    };

    const getMoodMessage = () => {
        switch (currentMood) {
            case '😤': return "Take a deep breath. It's okay to feel this way.";
            case '😢': return "Sending you a virtual hug. You are not alone.";
            case '😐': return "A balanced state. Ready for whatever comes.";
            case '🙂': return "Glad you're feeling good! Keep it up.";
            case '🤩': return "That's the spirit! Shine on!";
            default: return "You are stronger than you think.";
        }
    };

    // Greeting Logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const getDateString = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const handleUpdateProfile = async (data: any) => {
        await completeOnboarding(data);
        setShowOnboarding(false);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#FFD6A5] via-[#FFD6A5] to-[#FF9E9E] p-4 md:p-8 font-serif flex items-center justify-center overflow-x-hidden relative">
            <AnimatePresence>
                {showOnboarding && (
                    <div className="fixed inset-0 z-[100]">
                        <CharacterBook
                            userName={user?.name || ''}
                            onComplete={handleUpdateProfile}
                            onClose={() => setShowOnboarding(false)}
                        />
                    </div>
                )}
                {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
                {showJournal && <Journal onClose={() => setShowJournal(false)} />}
                {showAffirmations && <Affirmations onClose={() => setShowAffirmations(false)} />}
                {showInsights && <Insights onClose={() => setShowInsights(false)} />}
            </AnimatePresence>

            {/* Main Container - The "My Mind" Space */}
            <div className="w-full max-w-[1400px] bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/40 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[85vh]">

                {/* --- LEFT SIDEBAR --- */}
                <aside className="w-full md:w-64 bg-white/20 border-r border-white/20 flex flex-col p-8 overflow-y-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-serif font-medium text-[#1a1a1c] tracking-tight flex items-center gap-3">
                            MindBloom
                            <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full border border-orange-200" title="Daily Streak">
                                <span className="text-sm">🔥</span>
                                <span className="text-xs font-bold text-orange-600">{streak}</span>
                            </div>
                        </h1>
                        <div className="mt-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1c]/40">{getDateString()}</p>
                            <p className="text-lg font-serif italic text-[#1a1a1c]/80">{getGreeting()}, {user?.name}</p>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id as Section)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all font-medium text-sm ${item.id === 'dashboard'
                                    ? 'bg-[#1a1a1c] text-white shadow-lg'
                                    : 'text-[#1a1a1c]/60 hover:bg-white/40'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-[#1a1a1c]/5">
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-2 text-[#1a1a1c]/60 font-medium text-sm hover:text-[#1a1a1c] hover:bg-red-50 rounded-full transition-all w-full text-left"
                        >
                            <LogOut size={18} />
                            Log out
                        </button>

                        <div className="mt-8 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 bg-orange-200/50 w-24 h-24 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <Gift size={32} className="text-orange-400 mb-3" />
                                <h3 className="font-serif font-medium text-lg text-[#1a1a1c] mb-1">Upgrade</h3>
                                <p className="text-xs text-[#1a1a1c]/60 font-sans mb-4">Unlock full access</p>
                                <button className="w-full bg-white/80 hover:bg-white backdrop-blur-sm rounded-full py-2 text-xs font-bold uppercase tracking-wider text-[#1a1a1c] transition-all shadow-sm">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN FEED (Center) --- */}
                <main className="flex-1 bg-white/40 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">

                    {/* Header: Search & Tags */}


                    {/* Mood Section */}
                    <section className="mb-12">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-serif text-[#1a1a1c]">Current Mood</h2>
                        </div>

                        <div className="flex items-start gap-8">
                            {/* Pixel Avatar - In a soft elegant container */}
                            <div className="w-28 h-28 bg-white rounded-[32px] shadow-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100 to-transparent opacity-50" />
                                <img
                                    src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix"
                                    alt="Pixel Avatar"
                                    className="w-20 h-20 relative z-10 group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Speech Bubble - Minimalist */}
                            <div className="flex-1 bg-white/80 backdrop-blur-md rounded-[32px] p-8 shadow-sm relative border border-white/50 group">
                                <button
                                    onClick={refreshQuote}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-black/5 rounded-full"
                                    title="New Quote"
                                >
                                    <svg className="w-4 h-4 text-[#1a1a1c]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                                <p className="text-2xl font-serif font-medium text-[#1a1a1c] mb-3 leading-relaxed italic">
                                    "{currentMood ? getMoodMessage() : quote.text}"
                                </p>
                                <p className="text-sm font-sans text-[#1a1a1c]/50 font-medium uppercase tracking-widest">
                                    {currentMood ? `— Mood: ${currentMood}` : `— ${quote.author}`}
                                </p>
                            </div>
                        </div>

                        {/* Quick Mood Selectors */}
                        <div className="mt-8 flex gap-4">
                            {['😤', '😢', '😐', '🙂', '🤩'].map((emoji, i) => (
                                <button
                                    key={i}
                                    onClick={() => updateMood(emoji)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-110 transition-all text-xl ${currentMood === emoji ? 'bg-[#1a1a1c] scale-110' : 'bg-white/60 hover:bg-white'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Daily Check-in & Hydration */}
                    <section className="mb-12">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-serif text-[#1a1a1c]">Daily Care</h2>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Hydration Card */}
                            <div className="bg-blue-50/50 rounded-[32px] p-6 shadow-sm border border-blue-100 flex flex-col relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
                                <h4 className="font-serif font-medium text-lg text-blue-900 mb-1 z-10">Hydration</h4>
                                <p className="text-[10px] text-blue-900/40 font-bold uppercase tracking-widest mb-4 z-10">{hydration}/8 Glasses</p>

                                <div className="flex flex-wrap gap-2 mb-4 z-10">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-full transition-all ${i < hydration ? 'bg-blue-400 scale-110' : 'bg-blue-100'}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => updateHydration(1)}
                                    className="mt-auto w-full bg-white text-blue-600 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <span>+</span> Add Water
                                </button>
                            </div>

                            {/* Blackboard Card */}
                            <div className="bg-[#1a1a1c] rounded-[32px] p-6 text-white shadow-xl flex flex-col items-center justify-center text-center aspect-video lg:aspect-square relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="font-serif text-lg italic opacity-90 mb-3">
                                    Focus
                                </p>
                                <div className="w-full max-w-[100px] h-1 bg-white/20 rounded-full mt-2 relative overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${goals.length > 0 ? (goals.filter(g => g.done).length / goals.length) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-[10px] uppercase tracking-widest mt-2 opacity-60">
                                    {Math.round(goals.length > 0 ? (goals.filter(g => g.done).length / goals.length) * 100 : 0)}% Complete
                                </p>
                            </div>

                            {/* Action Cards */}
                            {/* Retro Music Player Card */}
                            <button
                                onClick={() => onSectionChange('music')}
                                className="bg-[#1a1a1c] relative rounded-[32px] p-6 text-left shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-white/10 group overflow-hidden"
                            >
                                {/* Gramophone / Record aesthetic */}
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
                                <div className="absolute top-6 right-6 text-amber-100/50 group-hover:rotate-12 transition-transform duration-700">
                                    <Disc size={48} strokeWidth={1} />
                                </div>

                                <div className="z-10 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 mb-4 backdrop-blur-sm">
                                        <Disc size={16} className="animate-spin-slow" />
                                    </div>
                                    <h4 className="font-serif font-medium text-lg text-amber-50 mb-1">Retro Player</h4>
                                    <p className="text-[10px] text-amber-50/40 font-bold uppercase tracking-widest">Lo-Fi & Classics</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Daily Goals & Tools Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                        {/* Daily Goals (Takes up 2/3 on LG) */}
                        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[40px] p-8 shadow-sm border border-white/40 flex flex-col justify-between relative overflow-hidden">
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <h2 className="text-2xl font-serif text-[#1a1a1c] mb-1">Daily Goals</h2>
                                    <p className="text-xs font-sans font-bold text-[#1a1a1c]/40 uppercase tracking-widest">Focus & Consistency</p>
                                </div>
                                <span className="bg-[#1a1a1c] text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {goals.filter(g => g.done).length}/{goals.length} Completed
                                </span>
                            </div>

                            <div className="mt-8 space-y-4 z-10">
                                {goals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="flex items-center gap-4 group cursor-pointer"
                                        onClick={() => toggleGoal(goal.id)}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${goal.done ? 'bg-[#10B981] border-[#10B981]' : 'border-[#1a1a1c]/20 group-hover:border-[#1a1a1c]/40'
                                            }`}>
                                            {goal.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={`font-serif text-lg ${goal.done ? 'text-[#1a1a1c]/40 line-through' : 'text-[#1a1a1c]'}`}>{goal.text}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full text-red-500 transition-all ml-auto"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (newGoal.trim()) {
                                            addGoal(newGoal);
                                            setNewGoal('');
                                        }
                                    }}
                                    className="pt-2 relative flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        placeholder="Add a new goal..."
                                        className="bg-transparent border-b border-[#1a1a1c]/10 w-full py-2 text-sm font-sans text-[#1a1a1c] placeholder-[#1a1a1c]/30 focus:outline-none focus:border-[#1a1a1c]/30 transition-colors pr-8"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newGoal.trim()}
                                        className="absolute right-0 text-[#1a1a1c]/40 hover:text-[#1a1a1c] disabled:opacity-0 transition-all p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </form>
                            </div>

                            {/* Decorative Trail */}
                            <div className="absolute bottom-0 right-0 w-full h-32 pointer-events-none opacity-50">
                                <div className="absolute bottom-8 right-8 flex gap-1">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 rounded-full" style={{
                                            backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'][i % 6],
                                            opacity: 0.8 - (i * 0.1),
                                            transform: `translateY(${Math.sin(i) * 10}px)`
                                        }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tools Grid (Takes up 1/3) */}
                        <div className="lg:col-span-1 grid grid-cols-1 gap-4">
                            {[
                                { title: 'Breathing', sub: '4-4-4-2', icon: '💨', color: 'bg-cyan-100 text-cyan-800', action: () => setShowBreathing(true) },
                                { title: 'Journal', sub: 'Reflect', icon: '📓', color: 'bg-purple-100 text-purple-800', action: () => setShowJournal(true) },
                                { title: 'Affirmations', sub: 'Start well', icon: '✨', color: 'bg-amber-100 text-amber-800', action: () => setShowAffirmations(true) },
                                { title: 'Insights', sub: 'Analytics', icon: '🧠', color: 'bg-emerald-100 text-emerald-800', action: () => setShowInsights(true) },
                            ].map((tool, i) => (
                                <button
                                    key={i}
                                    onClick={tool.action}
                                    className="bg-white/70 backdrop-blur-md rounded-[32px] p-6 text-left shadow-sm hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="mb-2 text-2xl">{tool.icon}</div>
                                        <h4 className="font-serif font-bold text-[#1a1a1c] leading-none">{tool.title}</h4>
                                        <p className="text-[10px] text-[#1a1a1c]/50 font-bold uppercase tracking-wider mt-1">{tool.sub}</p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full ${tool.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        <ChevronRight size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>


                </main>

                {/* --- RIGHT SIDEBAR (Stats) --- */}
                <aside className="hidden xl:flex w-80 bg-white/30 border-l border-white/20 flex-col p-8 overflow-y-auto">
                    {/* User Profile */}
                    <button
                        onClick={() => setShowOnboarding(true)}
                        className="flex items-center gap-4 mb-8 text-left hover:bg-white/40 p-2 rounded-2xl transition-all group"
                    >
                        <div className="w-14 h-14 bg-rose-100 rounded-full shadow-inner overflow-hidden border-2 border-white group-hover:scale-110 transition-transform">
                            <img
                                src={user?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.name || 'User'}`}
                                alt="User"
                            />
                        </div>
                        <div>
                            <h3 className="font-serif font-medium text-lg text-[#1a1a1c]">{user?.name || 'Guest'}</h3>
                            <p className="text-xs text-[#1a1a1c]/50 font-bold uppercase tracking-wider group-hover:text-[#1a1a1c]/80 transition-colors">Edit Profile</p>
                        </div>
                    </button>



                    {/* Connect Button */}
                    <div className="mt-8">
                        <button
                            onClick={() => onSectionChange('messages')}
                            className="w-full bg-[#1a1a1c] text-white rounded-full py-4 flex items-center gap-3 justify-center shadow-lg hover:bg-black hover:scale-[1.02] transition-all"
                        >
                            <div className="w-6 h-6 bg-purple-200 rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Therapist" alt="Therapist" />
                            </div>
                            <span className="font-bold text-xs uppercase tracking-wider">Talk to Echo</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}