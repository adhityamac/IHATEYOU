'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Brain, Calendar, Zap, Heart, AlertCircle, Sparkles, Download, BarChart3 } from 'lucide-react';

interface MoodEntry {
    date: string;
    moodId: string;
    note?: string;
    tensionAreas?: string[];
}

interface MoodAnalyticsDashboardProps {
    moodData: Record<string, MoodEntry>;
}

const MOOD_SCORES = {
    amazing: 5,
    happy: 4,
    normal: 3,
    exhausted: 2,
    depressed: 1,
    frustrated: 2,
    stressed: 2,
};

const MOOD_COLORS = {
    amazing: '#f472b6',
    happy: '#4ade80',
    normal: '#a78bfa',
    exhausted: '#fb7185',
    depressed: '#1e3a8a',
    frustrated: '#facc15',
    stressed: '#fb923c',
};

export default function MoodAnalyticsDashboard({ moodData }: MoodAnalyticsDashboardProps) {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
    const [showAIInsights, setShowAIInsights] = useState(false);
    const [aiInsights, setAIInsights] = useState<string[]>([]);

    // Calculate analytics
    const analytics = useMemo(() => {
        const entries = Object.values(moodData);
        if (entries.length === 0) return null;

        const now = new Date();
        const filteredEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (timeRange === 'week') return daysDiff <= 7;
            if (timeRange === 'month') return daysDiff <= 30;
            return daysDiff <= 365;
        });

        // Calculate average mood score
        const scores = filteredEntries.map(e => MOOD_SCORES[e.moodId as keyof typeof MOOD_SCORES] || 3);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Find most common mood
        const moodCounts: Record<string, number> = {};
        filteredEntries.forEach(e => {
            moodCounts[e.moodId] = (moodCounts[e.moodId] || 0) + 1;
        });
        const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

        // Calculate trend (comparing first half vs second half)
        const midpoint = Math.floor(filteredEntries.length / 2);
        const firstHalf = filteredEntries.slice(0, midpoint);
        const secondHalf = filteredEntries.slice(midpoint);
        
        const firstAvg = firstHalf.reduce((sum, e) => sum + (MOOD_SCORES[e.moodId as keyof typeof MOOD_SCORES] || 3), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, e) => sum + (MOOD_SCORES[e.moodId as keyof typeof MOOD_SCORES] || 3), 0) / secondHalf.length;
        const trend = secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'declining' : 'stable';

        // Find most common tension areas
        const tensionCounts: Record<string, number> = {};
        filteredEntries.forEach(e => {
            e.tensionAreas?.forEach(area => {
                tensionCounts[area] = (tensionCounts[area] || 0) + 1;
            });
        });
        const topTensionAreas = Object.entries(tensionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([area]) => area);

        // Mood distribution
        const distribution = Object.entries(moodCounts).map(([mood, count]) => ({
            mood,
            count,
            percentage: Math.round((count / filteredEntries.length) * 100)
        }));

        return {
            avgScore: avgScore.toFixed(1),
            mostCommonMood: mostCommonMood ? mostCommonMood[0] : 'normal',
            trend,
            topTensionAreas,
            distribution,
            totalEntries: filteredEntries.length,
            streakDays: calculateStreak(entries)
        };
    }, [moodData, timeRange]);

    const calculateStreak = (entries: MoodEntry[]) => {
        const sortedDates = entries.map(e => e.date).sort().reverse();
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expected = expectedDate.toISOString().split('T')[0];
            
            if (sortedDates[i] === expected) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    // Generate AI insights
    useEffect(() => {
        if (analytics && showAIInsights) {
            const insights: string[] = [];
            
            if (analytics.trend === 'improving') {
                insights.push("🌟 Your mood has been trending upward! Keep up the positive momentum.");
            } else if (analytics.trend === 'declining') {
                insights.push("💙 Your mood has been lower recently. Consider reaching out to someone you trust.");
            }

            if (analytics.streakDays >= 7) {
                insights.push(`🔥 Amazing! You've checked in for ${analytics.streakDays} days straight. Consistency is key to self-awareness.`);
            }

            if (analytics.topTensionAreas.length > 0) {
                insights.push(`🧘 You're holding tension in your ${analytics.topTensionAreas[0]}. Try some targeted stretches or massage.`);
            }

            const happyMoods = analytics.distribution.filter(d => ['amazing', 'happy', 'grateful'].includes(d.mood));
            const happyPercentage = happyMoods.reduce((sum, m) => sum + m.percentage, 0);
            
            if (happyPercentage > 50) {
                insights.push("✨ Over half your days have been positive! You're doing great at finding joy.");
            } else if (happyPercentage < 20) {
                insights.push("🌱 It's been a challenging period. Remember: tough times don't last, but tough people do.");
            }

            setAIInsights(insights);
        }
    }, [analytics, showAIInsights]);

    if (!analytics) {
        return (
            <div className="p-8 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/40 text-sm">Start tracking your mood to see analytics</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Mood Analytics</h2>
                    <p className="text-white/40 text-xs mt-1">AI-powered insights from your journey</p>
                </div>
                <button
                    onClick={() => setShowAIInsights(!showAIInsights)}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/30 transition-all"
                >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    AI Insights
                </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2 px-6">
                {(['week', 'month', 'year'] as const).map(range => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            timeRange === range
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* AI Insights Panel */}
            <AnimatePresence>
                {showAIInsights && aiInsights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mx-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 space-y-3"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-5 h-5 text-purple-300" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200">AI Insights</h3>
                        </div>
                        {aiInsights.map((insight, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-white/80 text-sm leading-relaxed"
                            >
                                {insight}
                            </motion.p>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 px-6">
                {/* Average Mood Score */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/40">Avg Mood</span>
                    </div>
                    <div className="text-3xl font-black text-white">{analytics.avgScore}</div>
                    <div className="text-xs text-white/40 mt-1">out of 5.0</div>
                </motion.div>

                {/* Streak */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/40">Streak</span>
                    </div>
                    <div className="text-3xl font-black text-white">{analytics.streakDays}</div>
                    <div className="text-xs text-white/40 mt-1">days in a row</div>
                </motion.div>

                {/* Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        {analytics.trend === 'improving' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : analytics.trend === 'declining' ? (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                        ) : (
                            <BarChart3 className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider text-white/40">Trend</span>
                    </div>
                    <div className="text-lg font-black text-white capitalize">{analytics.trend}</div>
                    <div className="text-xs text-white/40 mt-1">vs previous period</div>
                </motion.div>

                {/* Total Entries */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/40">Check-ins</span>
                    </div>
                    <div className="text-3xl font-black text-white">{analytics.totalEntries}</div>
                    <div className="text-xs text-white/40 mt-1">this {timeRange}</div>
                </motion.div>
            </div>

            {/* Mood Distribution */}
            <div className="mx-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Mood Distribution</h3>
                <div className="space-y-3">
                    {analytics.distribution.map((item, i) => (
                        <motion.div
                            key={item.mood}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold uppercase text-white/60">{item.mood}</span>
                                <span className="text-xs font-bold text-white">{item.percentage}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.percentage}%` }}
                                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: MOOD_COLORS[item.mood as keyof typeof MOOD_COLORS] }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tension Areas */}
            {analytics.topTensionAreas.length > 0 && (
                <div className="mx-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Common Tension Areas</h3>
                    <div className="flex flex-wrap gap-2">
                        {analytics.topTensionAreas.map((area, i) => (
                            <motion.div
                                key={area}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase"
                            >
                                {area}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Export Button */}
            <div className="px-6">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white font-bold uppercase tracking-wider hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>
        </div>
    );
}
