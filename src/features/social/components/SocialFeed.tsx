'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Camera } from 'lucide-react';
import { Post, Story } from '@/types/types';
import { useSignals } from '@/hooks/useSignals';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Mock Data
const MOCK_STORIES: Story[] = [
    {
        id: '1',
        userId: 'user-2',
        username: 'alex_flow',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        imageUrl: 'https://picsum.photos/seed/alex/1080/1920',
        isViewed: false,
        timestamp: new Date()
    },
    {
        id: '2',
        userId: 'user-3',
        username: 'sarah_vibe',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        imageUrl: 'https://picsum.photos/seed/sarah/1080/1920',
        isViewed: false,
        timestamp: new Date()
    },
    {
        id: '3',
        userId: 'user-4',
        username: 'mike_neon',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        imageUrl: 'https://picsum.photos/seed/mike/1080/1920',
        isViewed: true,
        timestamp: new Date()
    },
];

const MOCK_POSTS: Post[] = [
    {
        id: 1,
        user: 'Neo',
        username: 'neo_matrix',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neo',
        content: 'Just jacked into the mainframe. The view is incredible tonight. 🌃 #Cyberpunk #NightCity',
        image: 'https://picsum.photos/seed/cyberpunk1/800/800',
        time: '2h',
        echoes: 1337,
        replies: 42,
        isLiked: true
    },
    {
        id: 2,
        user: 'Trinity',
        username: 'trinity_core',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trinity',
        content: 'System update complete. Feeling faster than ever. ⚡',
        time: '4h',
        echoes: 892,
        replies: 15,
        isLiked: false
    },
    {
        id: 3,
        user: 'Morpheus',
        username: 'morpheus_dream',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morpheus',
        content: 'Blue pill or Red pill? The choice defines you.',
        image: 'https://picsum.photos/seed/matrix/800/600',
        time: '6h',
        echoes: 2405,
        replies: 305,
        isLiked: false
    }
];

interface SocialFeedProps {
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function SocialFeed({ onScroll }: SocialFeedProps) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const { trackInteraction } = useSignals(user?.id || 'anonymous');

    const handleLike = (postId: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const isLiked = !post.isLiked;
                if (isLiked) trackInteraction('like_post', 0);
                return {
                    ...post,
                    isLiked,
                    echoes: post.echoes + (isLiked ? 1 : -1)
                };
            }
            return post;
        }));
    };

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar pt-24 pb-32" onScroll={onScroll}>
            <div className="max-w-xl mx-auto px-4">

                {/* Stories Rail */}
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2 flex-shrink-0 snap-start"
                    >
                        <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-white/20 p-1 cursor-pointer hover:border-white/40 transition-colors">
                            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                <Plus className="text-white/60" size={24} />
                            </div>
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-black">
                                <Plus size={12} className="text-white" strokeWidth={3} />
                            </div>
                        </div>
                        <span className="text-xs text-white/60 font-medium">Add Story</span>
                    </motion.div>

                    {MOCK_STORIES.map((story) => (
                        <motion.div
                            key={story.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 flex-shrink-0 snap-start cursor-pointer group"
                        >
                            <div className={`w-16 h-16 rounded-full p-[2px] ${story.isViewed ? 'bg-white/10' : 'bg-gradient-to-tr from-rose-500 via-purple-500 to-blue-500'}`}>
                                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-zinc-800">
                                    <img src={story.userAvatar} alt={`${story.username}'s story`} loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <span className="text-xs text-white/80 font-medium group-hover:text-white transition-colors">{story.username}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Feed Posts */}
                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <ErrorBoundary key={post.id}>
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-[32px] bg-white/[0.03] border border-white/10 overflow-hidden"
                            >
                                {/* Post Header */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                                            <img src={post.avatar} alt={`${post.username}'s profile picture`} loading="lazy" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{post.username}</div>
                                            <div className="text-xs text-white/40">{post.time}</div>
                                        </div>
                                    </div>
                                    <button className="text-white/40 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                {/* Post Content */}
                                <div className="relative group">
                                    {post.image ? (
                                        <div className="relative aspect-square bg-zinc-900 overflow-hidden" onDoubleClick={() => handleLike(post.id)}>
                                            <img src={post.image} alt={`Post by ${post.username}: ${post.content.substring(0, 100)}`} loading="lazy" className="w-full h-full object-cover" />

                                            {/* Heart Animation could go here */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-y border-white/5 min-h-[200px] flex items-center justify-center text-center">
                                            <p className="text-xl md:text-2xl font-black italic text-white/90 leading-tight">
                                                "{post.content}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <motion.button
                                                whileTap={{ scale: 0.8 }}
                                                onClick={() => handleLike(post.id)}
                                                className="focus:outline-none"
                                            >
                                                <Heart
                                                    size={28}
                                                    className={`transition-all duration-300 ${post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white hover:text-white/60'}`}
                                                />
                                            </motion.button>
                                            <motion.button whileTap={{ scale: 0.9 }}>
                                                <MessageCircle size={28} className="text-white hover:text-white/60 transition-colors" />
                                            </motion.button>
                                            <motion.button whileTap={{ scale: 0.9 }}>
                                                <Send size={28} className="text-white hover:text-white/60 transition-colors" />
                                            </motion.button>
                                        </div>
                                        <motion.button whileTap={{ scale: 0.9 }}>
                                            <Bookmark size={28} className="text-white hover:text-white/60 transition-colors" />
                                        </motion.button>
                                    </div>

                                    <div className="font-bold text-white text-sm mb-2">{post.echoes.toLocaleString()} likes</div>

                                    {post.image && (
                                        <div className="mb-2">
                                            <span className="font-bold text-white text-sm mr-2">{post.username}</span>
                                            <span className="text-white/80 text-sm">{post.content}</span>
                                        </div>
                                    )}

                                    <button className="text-white/40 text-sm font-medium hover:text-white/60 transition-colors">
                                        View all {post.replies} comments
                                    </button>
                                </div>
                            </motion.article>
                        </ErrorBoundary>
                    ))}
                </div>
            </div>
        </div>
    );
}
