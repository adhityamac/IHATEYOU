'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Camera } from 'lucide-react';
import { Post, Story } from '@/types/types';
import { useSignals } from '@/hooks/useSignals';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useTheme } from '@/components/shared/GradientThemeProvider';
// @ts-ignore
import * as ReactWindow from 'react-window';
// @ts-ignore
import * as AutoSizerPkg from 'react-virtualized-auto-sizer';

// @ts-ignore
const List = ReactWindow.VariableSizeList || (ReactWindow as any).default?.VariableSizeList || (ReactWindow as any).default?.default?.VariableSizeList;
const AutoSizer = (AutoSizerPkg as any).default || AutoSizerPkg.AutoSizer || AutoSizerPkg;

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

    const { theme } = useTheme();
    const isRetro = theme === 'retro' || theme === 'retro-soul';

    // Theme Variables
    const textColor = isRetro ? 'text-black' : 'text-white';
    const mutedText = isRetro ? 'text-stone-600' : 'text-white/60';
    const cardBg = isRetro ? 'bg-white border-2 border-stone-800 shadow-[4px_4px_0px_#2d2a2e]' : 'bg-white/[0.03] border border-white/10';
    const storyBorder = isRetro ? 'border-stone-800' : 'border-white/20';
    const iconColor = isRetro ? 'text-black' : 'text-white';


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

    const listRef = useRef<any>(null);
    const getItemSize = (index: number) => {
        if (index === 0) return 140; // Stories Rail Height
        const post = posts[index - 1];
        // Rough estimation
        let size = 150; // Header + Actions + Padding
        if (post.image) size += 400; // Image aspect ratio
        else size += 150; // Text content
        return size + 32; // Margin
    };

    const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        if (index === 0) {
            return (
                <div style={style} className="px-4 pt-4">
                    {/* Stories Rail */}
                    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 flex-shrink-0 snap-start"
                        >
                            <div className={`relative w-16 h-16 rounded-full border-2 border-dashed p-1 cursor-pointer transition-colors ${storyBorder} ${isRetro ? 'hover:border-stone-600' : 'hover:border-white/40'}`}>
                                <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isRetro ? 'bg-stone-200' : 'bg-white/10'}`}>
                                    <Plus className={isRetro ? 'text-stone-500' : 'text-white/60'} size={24} />
                                </div>
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-black">
                                    <Plus size={12} className="text-white" strokeWidth={3} />
                                </div>
                            </div>
                            <span className={`text-xs font-medium ${mutedText}`}>Add Story</span>
                        </motion.div>

                        {MOCK_STORIES.map((story) => (
                            <motion.div
                                key={story.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-2 flex-shrink-0 snap-start cursor-pointer group"
                            >
                                <div className={`w-16 h-16 rounded-full p-[2px] ${story.isViewed ? (isRetro ? 'bg-stone-300' : 'bg-white/10') : 'bg-gradient-to-tr from-rose-500 via-purple-500 to-blue-500'}`}>
                                    <div className={`w-full h-full rounded-full border-2 overflow-hidden ${isRetro ? 'border-stone-800 bg-white' : 'border-black bg-zinc-800'}`}>
                                        <img src={story.userAvatar} alt={`${story.username}'s story`} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <span className={`text-xs font-medium transition-colors ${isRetro ? 'text-stone-700 group-hover:text-black' : 'text-white/80 group-hover:text-white'}`}>{story.username}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            );
        }

        const post = posts[index - 1];
        return (
            <div style={{ ...style, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 20 }}>
                <div className="max-w-xl mx-auto h-full">
                    <ErrorBoundary key={post.id}>
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-[32px] overflow-hidden ${cardBg} h-full flex flex-col`}
                        >
                            {/* Post Header */}
                            <div className="p-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full overflow-hidden border ${isRetro ? 'border-stone-800 bg-white' : 'bg-zinc-800 border-white/10'}`}>
                                        <img src={post.avatar} alt={`${post.username}'s profile picture`} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${textColor} ${isRetro ? 'font-vt323 text-lg' : ''}`}>{post.username}</div>
                                        <div className={`text-xs ${mutedText}`}>{post.time}</div>
                                    </div>
                                </div>
                                <button className={`${mutedText} ${isRetro ? 'hover:text-black' : 'hover:text-white'} transition-colors`}>
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            {/* Post Content */}
                            <div className={`relative group flex-1 ${isRetro ? 'border-y-2 border-stone-800' : ''}`}>
                                {post.image ? (
                                    <div className="relative w-full h-64 md:h-80 bg-zinc-900 overflow-hidden" onDoubleClick={() => handleLike(post.id)}>
                                        <img src={post.image} alt="Post" loading="lazy" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                ) : (
                                    <div className={`p-8 border-y h-full flex items-center justify-center text-center ${isRetro ? 'bg-[#fef9c3] border-stone-800' : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/5'}`}>
                                        <p className={`text-xl font-black italic leading-tight ${textColor} ${isRetro ? 'font-vt323 text-2xl' : 'text-white/90'}`}>
                                            "{post.content}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-4 shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className="focus:outline-none"
                                        >
                                            <Heart
                                                size={28}
                                                className={`transition-all duration-300 ${post.isLiked ? 'fill-rose-500 text-rose-500' : `${iconColor} ${isRetro ? 'hover:text-stone-600' : 'hover:text-white/60'}`}`}
                                            />
                                        </button>
                                        <MessageCircle size={28} className={`${iconColor} ${isRetro ? 'hover:text-stone-600' : 'hover:text-white/60'} transition-colors cursor-pointer`} />
                                        <Send size={28} className={`${iconColor} ${isRetro ? 'hover:text-stone-600' : 'hover:text-white/60'} transition-colors cursor-pointer`} />
                                    </div>
                                    <Bookmark size={28} className={`${iconColor} ${isRetro ? 'hover:text-stone-600' : 'hover:text-white/60'} transition-colors cursor-pointer`} />
                                </div>

                                <div className={`font-bold text-sm mb-2 ${textColor}`}>{post.echoes.toLocaleString()} likes</div>

                                {post.image && (
                                    <div className="mb-2">
                                        <span className={`font-bold text-sm mr-2 ${textColor}`}>{post.username}</span>
                                        <span className={`text-sm ${isRetro ? 'text-stone-800' : 'text-white/80'}`}>{post.content}</span>
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    </ErrorBoundary>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full pt-20 pb-32">
            <AutoSizer>
                {({ height, width }: { height: number; width: number }) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        itemCount={posts.length + 1}
                        itemSize={getItemSize}
                        className="custom-scrollbar"
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </div>
    );
}
