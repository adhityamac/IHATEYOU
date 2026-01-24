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
    BarChart3
} from 'lucide-react';
import { Section } from '@/types/types';
import { useState } from 'react';

interface DashboardProps {
    onSectionChange: (section: Section) => void;
}

// --- Mock Data ---
const TOPICS = [
    { id: 'coding', label: 'Coding', icon: '💻' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'marketing', label: 'Marketing', icon: '📢' },
    { id: 'code', label: 'Code', icon: '⌨️' },
];



const LEARNED_ITEMS = [
    { id: 1, name: 'Artikel Solal Arl', user: 'Status Meme', price: '$46', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1' },
    { id: 2, name: 'Tncat', user: 'Sensei Meow', price: '$45', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2' },
    { id: 3, name: 'SereneSoul', user: 'Sent User', price: '$30', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=3' },
];

const MENU_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Home, active: true },
    { id: 'home', label: 'Home', icon: BookOpen, active: false },
    { id: 'mood', label: 'Mood Journal', icon: BookOpen, active: false },
    { id: 'guided', label: 'Guided Meditations', icon: Heart, active: false },
    { id: 'therapy', label: 'Therapy Sessions', icon: Heart, active: false },
    { id: 'progress', label: 'Progress', icon: Settings, active: false },
];

export default function Dashboard({ onSectionChange }: DashboardProps) {

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#FFD6A5] via-[#FFD6A5] to-[#FF9E9E] p-4 md:p-8 font-serif flex items-center justify-center overflow-x-hidden">
            {/* Main Container - The "My Mind" Space */}
            <div className="w-full max-w-[1400px] bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/40 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[85vh]">

                {/* --- LEFT SIDEBAR --- */}
                <aside className="w-full md:w-64 bg-white/20 border-r border-white/20 flex flex-col p-8 overflow-y-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-serif font-medium text-[#1a1a1c] tracking-tight">MindBloom</h1>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id as Section)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all font-medium text-sm ${item.active
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
                        <button className="flex items-center gap-3 px-4 py-2 text-[#1a1a1c]/60 font-medium text-sm hover:text-[#1a1a1c]">
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
                    <header className="flex flex-col gap-8 mb-10">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1a1a1c]/40 group-focus-within:text-[#1a1a1c]" size={20} />
                            <input
                                type="text"
                                placeholder="Search your mind..."
                                className="w-full bg-white/50 border border-white/40 rounded-full pl-14 pr-6 py-4 font-sans text-sm focus:outline-none focus:bg-white focus:shadow-lg transition-all placeholder:text-[#1a1a1c]/30"
                            />
                        </div>

                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {TOPICS.map(topic => (
                                <button key={topic.id} className="flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white/20 rounded-full whitespace-nowrap hover:bg-white hover:shadow-md transition-all">
                                    <span className="text-lg opacity-80">{topic.icon}</span>
                                    <span className="text-xs font-bold text-[#1a1a1c]/80 tracking-wide uppercase">{topic.label}</span>
                                </button>
                            ))}
                            <button className="text-xs font-bold underline text-[#1a1a1c]/40 ml-2 hover:text-[#1a1a1c]">See all</button>
                        </div>
                    </header>

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
                            <div className="flex-1 bg-white/80 backdrop-blur-md rounded-[32px] p-8 shadow-sm relative border border-white/50">
                                <p className="text-2xl font-serif font-medium text-[#1a1a1c] mb-3 leading-relaxed italic">
                                    "You are stronger than you think."
                                </p>
                                <p className="text-sm font-sans text-[#1a1a1c]/50 font-medium uppercase tracking-widest">
                                    — How are you feeling?
                                </p>
                            </div>
                        </div>

                        {/* Quick Mood Selectors */}
                        <div className="mt-8 flex gap-4">
                            {['😤', '😢', '😐', '🙂', '🤩'].map((emoji, i) => (
                                <button key={i} className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center shadow-sm hover:shadow-lg hover:bg-white hover:scale-110 transition-all text-xl">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Daily Check-in */}
                    <section className="mb-12">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-serif text-[#1a1a1c]">Daily Check-in</h2>
                            <button className="text-xs font-sans font-bold text-[#1a1a1c]/40 hover:text-[#1a1a1c] uppercase tracking-wider">View All</button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Blackboard Card */}
                            <div className="bg-[#1a1a1c] rounded-[32px] p-6 text-white shadow-xl flex flex-col items-center justify-center text-center aspect-video lg:aspect-square relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="font-serif text-lg italic opacity-90 mb-3">
                                    Focus
                                </p>
                                <div className="w-12 h-1 bg-white/20 rounded-full mt-2">
                                    <div className="w-2/3 h-full bg-white rounded-full"></div>
                                </div>
                            </div>

                            {/* Action Cards */}
                            {[
                                { title: 'Gratitude', sub: 'Clear mind', price: '$45' },
                                { title: 'Breathe', sub: 'Calmness', price: '$45' },
                                { title: 'Mindful', sub: 'Presence', price: '$45' },
                            ].map((card, i) => (
                                <button key={i} className="bg-white rounded-[32px] p-6 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-white/50">
                                    <div>
                                        <h4 className="font-serif font-medium text-lg text-[#1a1a1c] mb-1">{card.title}</h4>
                                        <p className="text-[10px] text-[#1a1a1c]/40 font-bold uppercase tracking-widest">{card.sub}</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="w-8 h-8 rounded-full bg-[#1a1a1c]/5 flex items-center justify-center text-[#1a1a1c]">
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </button>
                            ))}
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
                                <span className="bg-[#1a1a1c] text-white text-xs font-bold px-3 py-1 rounded-full">1/3 Completed</span>
                            </div>

                            <div className="mt-8 space-y-4 z-10">
                                {[
                                    { id: 1, text: "Meditate for 10m", done: true },
                                    { id: 2, text: "Journal thoughts", done: false },
                                    { id: 3, text: "Drink water", done: false },
                                ].map((goal) => (
                                    <div key={goal.id} className="flex items-center gap-4 group cursor-pointer">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${goal.done ? 'bg-[#10B981] border-[#10B981]' : 'border-[#1a1a1c]/20 group-hover:border-[#1a1a1c]/40'
                                            }`}>
                                            {goal.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={`font-serif text-lg ${goal.done ? 'text-[#1a1a1c]/40 line-through' : 'text-[#1a1a1c]'}`}>{goal.text}</span>
                                    </div>
                                ))}

                                <div className="pt-2">
                                    <input
                                        type="text"
                                        placeholder="Add a new goal..."
                                        className="bg-transparent border-b border-[#1a1a1c]/10 w-full py-2 text-sm font-sans placeholder-[#1a1a1c]/30 focus:outline-none focus:border-[#1a1a1c]/30 transition-colors"
                                    />
                                </div>
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
                                { title: 'Breathing', sub: '4-4-4-2', icon: '💨', color: 'bg-cyan-100 text-cyan-800' },
                                { title: 'Journal', sub: 'Reflect', icon: '📓', color: 'bg-purple-100 text-purple-800' },
                                { title: 'Affirmations', sub: 'Start well', icon: '✨', color: 'bg-amber-100 text-amber-800' },
                                { title: 'Insights', sub: 'Analytics', icon: '🧠', color: 'bg-emerald-100 text-emerald-800' },
                            ].map((tool, i) => (
                                <button key={i} className="bg-white/70 backdrop-blur-md rounded-[32px] p-6 text-left shadow-sm hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-between group">
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
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-rose-100 rounded-full shadow-inner overflow-hidden border-2 border-white">
                            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=User" alt="User" />
                        </div>
                        <div>
                            <h3 className="font-serif font-medium text-lg text-[#1a1a1c]">Alex</h3>
                            <p className="text-xs text-[#1a1a1c]/50 font-bold uppercase tracking-wider">Dreamer</p>
                        </div>
                    </div>

                    {/* Minimalist Music Player */}
                    <div className="mb-10 bg-white/60 backdrop-blur-xl rounded-[32px] p-6 shadow-sm border border-white/40 relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-4">
                            {/* Gramophone-ish / Vinyl Icon */}
                            <div className="w-12 h-12 bg-[#1a1a1c] rounded-full flex items-center justify-center relative overflow-hidden shrink-0 animate-[spin_4s_linear_infinite] shadow-lg border-2 border-[#1a1a1c]">
                                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_60deg,#ffffff20_60deg_120deg,transparent_120deg_180deg,#ffffff20_180deg_240deg,transparent_240deg_300deg,#ffffff20_300deg_360deg)]" />
                                <div className="w-4 h-4 bg-[#F59E0B] rounded-full z-10 border-2 border-white/20" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-serif font-medium text-sm text-[#1a1a1c] truncate">Clair de Lune</h4>
                                <p className="text-[10px] text-[#1a1a1c]/50 font-bold uppercase tracking-widest truncate">Debussy</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 h-1 bg-[#1a1a1c]/5 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-[#1a1a1c] rounded-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#1a1a1c]">
                                    <SkipBack size={14} />
                                </button>
                                <button className="w-8 h-8 bg-[#1a1a1c] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                                    <Play size={12} fill="currentColor" className="ml-0.5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#1a1a1c]">
                                    <SkipForward size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Latest Learned */}
                    <div className="mb-10">
                        <h4 className="font-sans font-bold text-xs text-[#1a1a1c]/40 uppercase tracking-widest mb-6">Latest Learned</h4>
                        <div className="space-y-4">
                            {LEARNED_ITEMS.map(item => (
                                <div key={item.id} className="bg-white/60 hover:bg-white rounded-2xl p-4 transition-colors flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                            <img src={item.avatar} alt="Avatar" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1a1a1c]">{item.name}</p>
                                            <p className="text-[10px] text-[#1a1a1c]/40 font-bold uppercase">{item.user}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Snapshot */}
                    <div className="flex-1">
                        <h4 className="font-sans font-bold text-xs text-[#1a1a1c]/40 uppercase tracking-widest mb-6">Weekly Flow</h4>
                        <div className="bg-white/50 rounded-[32px] p-6 h-56 relative shadow-sm border border-white/40">
                            {/* Simple Bar Chart Mockup */}
                            <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 pt-12">
                                {[40, 65, 35, 80, 50, 90, 45].map((h, i) => (
                                    <div key={i} className="w-3 bg-[#1a1a1c] rounded-full opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <div className="mt-8">
                        <button className="w-full bg-[#1a1a1c] text-white rounded-full py-4 flex items-center gap-3 justify-center shadow-lg hover:bg-black hover:scale-[1.02] transition-all">
                            <div className="w-6 h-6 bg-purple-200 rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Therapist" alt="Therapist" />
                            </div>
                            <span className="font-bold text-xs uppercase tracking-wider">Talk to Someone</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}