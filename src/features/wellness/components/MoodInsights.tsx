'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Brain, Heart, Zap } from 'lucide-react';
import { useMemo } from 'react';

interface MoodInsightsProps {
    posts: any[];
}

export default function MoodInsights({ posts }: MoodInsightsProps) {
    const insights = useMemo(() => {
        if (posts.length === 0) return null;

        // Categorize emotions
        const positive = ['joyful', 'loved', 'grateful', 'excited', 'confident', 'brave', 'hopeful', 'peaceful', 'calm'];
        const negative = ['hurt', 'angry', 'lonely', 'drained', 'empty', 'anxious', 'overwhelmed'];
        const neutral = ['nostalgic', 'restless', 'overthinking', 'detached', 'numb', 'confused'];

        const emotionCounts = posts.reduce((acc, post) => {
            const emotionId = post.emotion.id;
            acc[emotionId] = (acc[emotionId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const positiveCount = posts.filter(p => positive.includes(p.emotion.id)).length;
        const negativeCount = posts.filter(p => negative.includes(p.emotion.id)).length;
        const neutralCount = posts.filter(p => neutral.includes(p.emotion.id)).length;

        const total = posts.length;
        const positivePercent = Math.round((positiveCount / total) * 100);
        const negativePercent = Math.round((negativeCount / total) * 100);
        const neutralPercent = Math.round((neutralCount / total) * 100);

        // Find most common emotion
        const mostCommon = Object.entries(emotionCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

        // Trend analysis (last 7 days vs previous 7 days)
        const last7Days = posts.slice(0, 7);
        const prev7Days = posts.slice(7, 14);

        const last7Positive = last7Days.filter(p => positive.includes(p.emotion.id)).length;
        const prev7Positive = prev7Days.filter(p => positive.includes(p.emotion.id)).length;

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (last7Positive > prev7Positive) trend = 'up';
        else if (last7Positive < prev7Positive) trend = 'down';

        return {
            positivePercent,
            negativePercent,
            neutralPercent,
            mostCommon: mostCommon ? mostCommon[0] : null,
            trend,
            totalPosts: total
        };
    }, [posts]);

    if (!insights) {
        return (
            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 text-center">
                <p className="text-white/40 font-bold text-sm">Not enough data yet. Keep checking in!</p>
            </div>
        );
    }

    const getTrendIcon = () => {
        switch (insights.trend) {
            case 'up': return <TrendingUp className="text-green-400" size={20} />;
            case 'down': return <TrendingDown className="text-red-400" size={20} />;
            default: return <Minus className="text-yellow-400" size={20} />;
        }
    };

    const getTrendMessage = () => {
        switch (insights.trend) {
            case 'up': return 'Your mood is improving! 🌟';
            case 'down': return 'Take care of yourself 💙';
            default: return 'Staying steady 🌊';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Mood Insights</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    {getTrendIcon()}
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{insights.totalPosts} Posts</span>
                </div>
            </div>

            {/* Trend Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[32px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Brain className="text-purple-400" size={24} />
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Weekly Trend</h3>
                    </div>
                    <p className="text-3xl font-black text-white mb-2">{getTrendMessage()}</p>
                    <p className="text-white/40 text-sm font-bold">Based on your last 14 check-ins</p>
                </div>
            </motion.div>

            {/* Emotion Distribution */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-[24px] bg-green-500/10 border border-green-500/20"
                >
                    <Heart className="text-green-400 mb-3" size={20} />
                    <div className="text-3xl font-black text-white mb-1">{insights.positivePercent}%</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Light</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-[24px] bg-yellow-500/10 border border-yellow-500/20"
                >
                    <Zap className="text-yellow-400 mb-3" size={20} />
                    <div className="text-3xl font-black text-white mb-1">{insights.neutralPercent}%</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Static</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-[24px] bg-blue-500/10 border border-blue-500/20"
                >
                    <Brain className="text-blue-400 mb-3" size={20} />
                    <div className="text-3xl font-black text-white mb-1">{insights.negativePercent}%</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Heavy</div>
                </motion.div>
            </div>

            {/* Recommendation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10"
            >
                <h4 className="text-sm font-black text-white/60 uppercase tracking-widest mb-3">Recommendation</h4>
                <p className="text-white/80 font-medium leading-relaxed">
                    {insights.trend === 'down'
                        ? "Consider taking a break, practicing self-care, or reaching out to someone you trust. Your feelings are valid."
                        : insights.trend === 'up'
                            ? "Keep up the positive momentum! Continue the practices that are working for you."
                            : "You're maintaining balance. Stay mindful of your emotional patterns and keep checking in."}
                </p>
            </motion.div>
        </div>
    );
}
