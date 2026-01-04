'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Heart, Brain, Target, Trophy, Wind, AlertCircle, 
    BarChart3, Calendar, Sparkles, ChevronRight 
} from 'lucide-react';
import MoodAnalyticsDashboard from './MoodAnalyticsDashboard';
import HabitTracker from './HabitTracker';
import MeditationTimer from './MeditationTimer';
import EmergencySupport from './EmergencySupport';
import WellnessChallenges from '@/features/social/components/WellnessChallenges';
import YearInPixels from './YearInPixels';

type WellnessView = 'overview' | 'analytics' | 'habits' | 'meditation' | 'challenges' | 'emergency' | 'pixels';

export default function EnhancedWellnessHub() {
    const [activeView, setActiveView] = useState<WellnessView>('overview');
    const [moodData, setMoodData] = useState<Record<string, any>>({});

    // Load mood data from Year in Pixels
    useEffect(() => {
        const saved = localStorage.getItem('yearInPixels');
        if (saved) {
            setMoodData(JSON.parse(saved));
        }
    }, []);

    const features = [
        {
            id: 'analytics' as WellnessView,
            title: 'Mood Analytics',
            description: 'AI-powered insights from your emotional journey',
            icon: BarChart3,
            color: 'from-purple-500 to-pink-500',
            badge: 'NEW'
        },
        {
            id: 'habits' as WellnessView,
            title: 'Habit Tracker',
            description: 'Build consistency with daily habit tracking',
            icon: Target,
            color: 'from-green-500 to-emerald-500',
            badge: 'NEW'
        },
        {
            id: 'meditation' as WellnessView,
            title: 'Meditation',
            description: 'Guided sessions and mindful breathing',
            icon: Wind,
            color: 'from-blue-500 to-cyan-500',
            badge: 'NEW'
        },
        {
            id: 'challenges' as WellnessView,
            title: 'Wellness Challenges',
            description: 'Join community challenges and grow together',
            icon: Trophy,
            color: 'from-yellow-500 to-orange-500',
            badge: 'NEW'
        },
        {
            id: 'pixels' as WellnessView,
            title: 'Year in Pixels',
            description: 'Track your mood every day of the year',
            icon: Calendar,
            color: 'from-pink-500 to-rose-500',
            badge: null
        },
        {
            id: 'emergency' as WellnessView,
            title: 'Emergency Support',
            description: '24/7 crisis resources and quick calm exercises',
            icon: AlertCircle,
            color: 'from-red-500 to-orange-500',
            badge: 'IMPORTANT'
        }
    ];

    if (activeView !== 'overview') {
        return (
            <div className="min-h-screen pb-32">
                {/* Back Button */}
                <div className="p-6 pb-0">
                    <button
                        onClick={() => setActiveView('overview')}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Back to Hub
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6"
                    >
                        {activeView === 'analytics' && <MoodAnalyticsDashboard moodData={moodData} />}
                        {activeView === 'habits' && <HabitTracker />}
                        {activeView === 'meditation' && <MeditationTimer />}
                        {activeView === 'challenges' && <WellnessChallenges />}
                        {activeView === 'pixels' && <YearInPixels />}
                        {activeView === 'emergency' && <EmergencySupport />}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 pb-6"
            >
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                            Wellness Hub
                        </h1>
                        <p className="text-white/40 text-xs uppercase tracking-widest">Enhanced Features</p>
                    </div>
                </div>
                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                    Your complete wellness toolkit with advanced tracking, guided meditation, community challenges, and emergency support.
                </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 px-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                >
                    <div className="text-2xl font-black text-white">{Object.keys(moodData).length}</div>
                    <div className="text-xs text-white/60 mt-1">Mood Entries</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
                >
                    <div className="text-2xl font-black text-white">
                        {(() => {
                            const habits = localStorage.getItem('habits');
                            return habits ? JSON.parse(habits).filter((h: any) => h.joined).length : 0;
                        })()}
                    </div>
                    <div className="text-xs text-white/60 mt-1">Active Habits</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                >
                    <div className="text-2xl font-black text-white">
                        {(() => {
                            const completed = localStorage.getItem('completedMeditations');
                            return completed ? JSON.parse(completed).length : 0;
                        })()}
                    </div>
                    <div className="text-xs text-white/60 mt-1">Meditations</div>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="space-y-4 px-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">Explore Features</h2>
                {features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                        <motion.button
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setActiveView(feature.id)}
                            className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                                        {feature.badge && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                feature.badge === 'NEW' 
                                                    ? 'bg-purple-500/30 text-purple-300' 
                                                    : 'bg-red-500/30 text-red-300'
                                            }`}>
                                                {feature.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/60 text-sm">{feature.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Wellness Tip */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mx-8 mt-8 p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
            >
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                        <h3 className="text-white font-bold mb-2">Daily Wellness Tip</h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            {[
                                "Take 5 deep breaths before checking your phone in the morning.",
                                "Drink a glass of water first thing when you wake up.",
                                "Write down 3 things you're grateful for today.",
                                "Take a 10-minute walk outside to reset your mind.",
                                "Reach out to a friend you haven't talked to in a while.",
                                "Practice the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds."
                            ][Math.floor(Math.random() * 6)]}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
