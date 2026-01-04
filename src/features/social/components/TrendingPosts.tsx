'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Flame, Zap, Heart, MessageCircle, Eye } from 'lucide-react';

interface TrendingPost {
    id: number;
    username: string;
    emotion: any;
    content: string;
    likes: number;
    comments: number;
    views: number;
    trendScore: number;
    timestamp: string;
}

export default function TrendingPosts() {
    // Mock trending posts
    const trendingPosts: TrendingPost[] = [
        {
            id: 1,
            username: 'luna_sky',
            emotion: { name: 'Joyful', color: '#F5A8C8' },
            content: 'Finally found peace in the chaos. Sometimes the best moments come when you stop searching.',
            likes: 234,
            comments: 45,
            views: 1200,
            trendScore: 95,
            timestamp: '2h ago'
        },
        {
            id: 2,
            username: 'pixel_drifter',
            emotion: { name: 'Grateful', color: '#E8D8A8' },
            content: 'Grateful for the small things today. A warm cup of coffee, a kind smile, and this moment.',
            likes: 189,
            comments: 32,
            views: 890,
            trendScore: 87,
            timestamp: '4h ago'
        },
        {
            id: 3,
            username: 'echo_zero',
            emotion: { name: 'Hopeful', color: '#A8E8C0' },
            content: 'Tomorrow is a new beginning. Every sunrise brings new possibilities.',
            likes: 156,
            comments: 28,
            views: 720,
            trendScore: 78,
            timestamp: '6h ago'
        },
    ];

    const getTrendIcon = (score: number) => {
        if (score >= 90) return <Flame className="text-orange-500" size={20} />;
        if (score >= 80) return <TrendingUp className="text-red-500" size={20} />;
        return <Zap className="text-yellow-500" size={20} />;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Flame className="text-orange-500" size={32} />
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Trending Now</h2>
                </div>
                <div className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* Trending Posts */}
            <div className="space-y-4">
                {trendingPosts.map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="relative p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer overflow-hidden group"
                    >
                        {/* Rank Badge */}
                        <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-black text-white">#{i + 1}</span>
                        </div>

                        {/* Trend Score */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md">
                            {getTrendIcon(post.trendScore)}
                            <span className="text-sm font-black text-white">{post.trendScore}</span>
                        </div>

                        {/* Content */}
                        <div className="ml-16">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                                <div>
                                    <div className="text-lg font-bold text-white">@{post.username}</div>
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                        {post.emotion.name} • {post.timestamp}
                                    </div>
                                </div>
                            </div>

                            {/* Post Content */}
                            <p className="text-2xl text-white/90 font-bold italic leading-tight mb-6">
                                &quot;{post.content}&quot;
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-white/40 hover:text-pink-400 transition-colors">
                                    <Heart size={18} />
                                    <span className="text-sm font-bold">{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors">
                                    <MessageCircle size={18} />
                                    <span className="text-sm font-bold">{post.comments}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40">
                                    <Eye size={18} />
                                    <span className="text-sm font-bold">{post.views}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* View More */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest transition-all"
            >
                View All Trending
            </motion.button>
        </div>
    );
}
