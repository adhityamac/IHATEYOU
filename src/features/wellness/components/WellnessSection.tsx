'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart, Wind, BookOpen, Brain, TrendingUp, Sparkles } from 'lucide-react';
import DailyAffirmations from './DailyAffirmations';
import BreathingExercise from './BreathingExercise';
import JournalPrompts from './JournalPrompts';
import MoodInsights from './MoodInsights';

type WellnessTab = 'affirmations' | 'breathing' | 'journal' | 'insights';

interface WellnessSectionProps {
    posts?: any[];
}

export default function WellnessSection({ posts = [] }: WellnessSectionProps) {
    const [activeTab, setActiveTab] = useState<WellnessTab>('affirmations');

    const tabs = [
        { id: 'affirmations' as WellnessTab, label: 'Affirmations', icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
        { id: 'breathing' as WellnessTab, label: 'Breathe', icon: Wind, color: 'from-cyan-500 to-blue-500' },
        { id: 'journal' as WellnessTab, label: 'Journal', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
        { id: 'insights' as WellnessTab, label: 'Insights', icon: Brain, color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 pb-6"
            >
                <div className="flex items-center gap-4 mb-2">
                    <Heart className="text-pink-400" size={40} />
                    <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
                        Wellness Hub
                    </h1>
                </div>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs ml-14">
                    Your space for self-care and growth
                </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="px-8 mb-8">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {tabs.map((tab, i) => (
                        <motion.button
                            key={tab.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-8 py-4 rounded-[24px] font-black uppercase tracking-widest text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-white text-black shadow-xl'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={20} />
                                {tab.label}
                            </div>

                            {/* Active Indicator */}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute inset-0 rounded-[24px] bg-gradient-to-r ${tab.color} opacity-10 -z-10`}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'affirmations' && <DailyAffirmations />}
                {activeTab === 'breathing' && <BreathingExercise />}
                {activeTab === 'journal' && <JournalPrompts />}
                {activeTab === 'insights' && <MoodInsights posts={posts} />}
            </motion.div>
        </div>
    );
}
