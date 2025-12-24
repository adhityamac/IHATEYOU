'use client';

import { motion } from 'framer-motion';
import { UserPlus, UserMinus, MessageCircle, Share2, MoreVertical, MapPin, Calendar, Link as LinkIcon, Award } from 'lucide-react';
import { useState } from 'react';

interface EnhancedUserProfileProps {
    username: string;
    bio: string;
    avatar: string;
    isFollowing?: boolean;
    followers?: number;
    following?: number;
    posts?: number;
    joinDate?: string;
    location?: string;
    website?: string;
    badges?: string[];
    recentEmotions?: any[];
}

export default function EnhancedUserProfile({
    username,
    bio,
    avatar,
    isFollowing = false,
    followers = 0,
    following = 0,
    posts = 0,
    joinDate = 'January 2024',
    location,
    website,
    badges = [],
    recentEmotions = []
}: EnhancedUserProfileProps) {
    const [followed, setFollowed] = useState(isFollowing);

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Cover Image */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-48 rounded-[32px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-6 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-3xl" />
                <div className="absolute top-4 right-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all"
                    >
                        <MoreVertical size={20} />
                    </motion.button>
                </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative -mt-20 px-6"
            >
                {/* Avatar */}
                <div className="relative w-32 h-32 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-full h-full rounded-full border-4 border-black bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden shadow-2xl"
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                            alt={username}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Online Status */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-black" />
                </div>

                {/* Username & Bio */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                            {username}
                        </h1>
                        {badges.length > 0 && (
                            <div className="flex gap-1">
                                {badges.map((badge, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                                        title={badge}
                                    >
                                        <Award size={14} className="text-white" />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-white/60 font-medium text-lg leading-relaxed mb-4">{bio}</p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-white/40">
                        {location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>{location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Joined {joinDate}</span>
                        </div>
                        {website && (
                            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                <LinkIcon size={14} />
                                <span>Website</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Posts', value: posts },
                        { label: 'Followers', value: followers },
                        { label: 'Following', value: following },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-[24px] bg-white/[0.05] border border-white/10 text-center cursor-pointer hover:bg-white/[0.08] transition-all"
                        >
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFollowed(!followed)}
                        className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${followed
                                ? 'bg-white/10 border border-white/20 text-white/60 hover:bg-white/20'
                                : 'bg-white text-black shadow-xl hover:shadow-2xl'
                            }`}
                    >
                        {followed ? (
                            <>
                                <UserMinus size={18} />
                                Unfollow
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Follow
                            </>
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                    >
                        <MessageCircle size={18} />
                        Message
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                    >
                        <Share2 size={18} />
                    </motion.button>
                </div>

                {/* Recent Emotional State */}
                {recentEmotions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10"
                    >
                        <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">Recent Vibes</h3>
                        <div className="flex gap-2">
                            {recentEmotions.slice(0, 7).map((emotion, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.05) }}
                                    whileHover={{ scale: 1.2, y: -4 }}
                                    className="w-10 h-10 rounded-full"
                                    style={{ backgroundColor: emotion.color }}
                                    title={emotion.name}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
