'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, UserPlus, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface RecommendedUser {
    username: string;
    bio: string;
    followers: number;
    mutualFollowers: number;
    recentEmotion: string;
    emotionColor: string;
    matchScore: number;
    reason: string;
}

export default function UserRecommendations() {
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

    const recommendations: RecommendedUser[] = [
        {
            username: 'luna_sky',
            bio: 'Finding light in the darkness ✨',
            followers: 1234,
            mutualFollowers: 12,
            recentEmotion: 'Hopeful',
            emotionColor: '#A8E8C0',
            matchScore: 95,
            reason: 'Similar emotional journey'
        },
        {
            username: 'pixel_drifter',
            bio: 'Digital nomad seeking inner peace 🌊',
            followers: 987,
            mutualFollowers: 8,
            recentEmotion: 'Calm',
            emotionColor: '#A8C5E0',
            matchScore: 88,
            reason: 'Shared interests in mindfulness'
        },
        {
            username: 'echo_zero',
            bio: 'Navigating the void with curiosity 🌌',
            followers: 756,
            mutualFollowers: 5,
            recentEmotion: 'Curious',
            emotionColor: '#87CEEB',
            matchScore: 82,
            reason: 'Active in similar communities'
        },
        {
            username: 'soul_seeker',
            bio: 'On a journey of self-discovery 🦋',
            followers: 654,
            mutualFollowers: 15,
            recentEmotion: 'Grateful',
            emotionColor: '#E8D8A8',
            matchScore: 79,
            reason: 'Many mutual connections'
        },
    ];

    const toggleFollow = (username: string) => {
        setFollowedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(username)) {
                newSet.delete(username);
            } else {
                newSet.add(username);
            }
            return newSet;
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-yellow-400" size={32} />
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Suggested For You</h2>
                </div>
                <div className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">Personalized</span>
                </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((user, i) => (
                    <motion.div
                        key={user.username}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all relative overflow-hidden group"
                    >
                        {/* Match Score Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                            <span className="text-xs font-black text-white">{user.matchScore}% Match</span>
                        </div>

                        {/* Avatar */}
                        <div className="relative w-20 h-20 mb-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden border-4 border-black shadow-xl relative"
                            >
                                <Image
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    alt={user.username}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* Emotion Indicator */}
                            <div
                                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-black shadow-lg"
                                style={{ backgroundColor: user.emotionColor }}
                                title={user.recentEmotion}
                            />
                        </div>

                        {/* User Info */}
                        <div className="mb-4">
                            <h3 className="text-2xl font-black text-white mb-1">@{user.username}</h3>
                            <p className="text-white/60 font-medium text-sm mb-3">{user.bio}</p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                                <div className="flex items-center gap-1">
                                    <Users size={14} />
                                    <span className="font-bold">{user.followers}</span>
                                </div>
                                {user.mutualFollowers > 0 && (
                                    <div className="flex items-center gap-1 text-purple-400">
                                        <Users size={14} />
                                        <span className="font-bold">{user.mutualFollowers} mutual</span>
                                    </div>
                                )}
                            </div>

                            {/* Reason */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
                                <TrendingUp size={12} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                                    {user.reason}
                                </span>
                            </div>
                        </div>

                        {/* Follow Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleFollow(user.username)}
                            className={`w-full py-3 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${followedUsers.has(user.username)
                                    ? 'bg-white/10 border border-white/20 text-white/60'
                                    : 'bg-white text-black shadow-lg hover:shadow-xl'
                                }`}
                        >
                            <UserPlus size={18} />
                            {followedUsers.has(user.username) ? 'Following' : 'Follow'}
                        </motion.button>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* See More */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest transition-all"
            >
                Discover More People
            </motion.button>
        </div>
    );
}
