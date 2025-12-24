'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Search, Settings, Home, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostData {
    id: number;
    username: string;
    avatar: string;
    image: string;
    likes: number;
    caption: string;
    comments: number;
    time: string;
}

const Post = ({ post }: { post: PostData }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);

    const handleDoubleTap = () => {
        setIsLiked(true);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                        <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{post.username}</span>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-900 cursor-pointer" />
            </div>

            {/* Post Image */}
            <div
                className="w-full bg-gray-100 relative cursor-pointer"
                onDoubleClick={handleDoubleTap}
            >
                <img src={post.image} alt="Post content" className="w-full h-auto object-cover select-none" />
                <AnimatePresence>
                    {showHeart && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.25, type: 'spring', stiffness: 200 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Post Actions & Footer */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={toggleLike}
                            className="focus:outline-none"
                        >
                            <Heart
                                className={`w-6 h-6 transition-colors ${isLiked ? 'fill-[#ff3040] text-[#ff3040]' : 'text-gray-900 hover:text-gray-600'}`}
                            />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <MessageCircle className="w-6 h-6 text-gray-900 hover:text-gray-600 cursor-pointer transition-colors" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Send className="w-6 h-6 text-gray-900 hover:text-gray-600 cursor-pointer transition-colors" />
                        </motion.button>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Bookmark className="w-6 h-6 text-gray-900 hover:text-gray-600 cursor-pointer transition-colors" />
                    </motion.button>
                </div>

                <div className="font-semibold text-sm mb-2 text-gray-900">{(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes</div>

                <div className="text-sm mb-2 text-gray-900">
                    <span className="font-semibold mr-2">{post.username}</span>
                    {post.caption}
                </div>

                <div className="text-gray-500 text-sm cursor-pointer mb-1">
                    View all {post.comments} comments
                </div>

                <div className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">
                    {post.time}
                </div>
            </div>
        </motion.article>
    );
};

export default function InstagramFeed() {
    const [activeTab, setActiveTab] = useState('home');

    // Mock data for visualization
    const posts = [
        {
            id: 1,
            username: 'wanderlust_geo',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            image: 'https://picsum.photos/seed/travel/600/600',
            likes: 1234,
            caption: 'Sunset vibes 🌅 #nature #peace',
            comments: 42,
            time: '2 HOURS AGO',
        },
        {
            id: 2,
            username: 'coffee_lover',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
            image: 'https://picsum.photos/seed/coffee/600/750', // Portrait aspect ratio
            likes: 856,
            caption: 'Monday morning essentials ☕',
            comments: 12,
            time: '5 HOURS AGO',
        },
        {
            id: 3,
            username: 'design_daily',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
            image: 'https://picsum.photos/seed/art/600/600',
            likes: 2405,
            caption: 'Minimalist setup for the day.',
            comments: 89,
            time: '1 DAY AGO',
        },
    ];

    return (
        <div className="max-w-[470px] mx-auto w-full bg-gray-50 min-h-screen relative">
            <div className="pb-16">
                {activeTab === 'home' && (
                    <>
                        {/* Sticky Header with Logo, Actions, and Search */}
                        <div className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3">
                                <h1 className="text-2xl font-bold tracking-tighter" style={{ fontFamily: 'cursive' }}>
                                    Instagram
                                </h1>
                                <div className="flex items-center gap-5">
                                    <Settings className="w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-600 transition-colors" />
                                    <div className="relative cursor-pointer hover:text-gray-600 transition-colors">
                                        <Send className="w-6 h-6 text-gray-900 -rotate-12" />
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                            2
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="px-4 pb-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stories Rail */}
                        <div className="flex gap-4 overflow-x-auto p-4 bg-white border border-gray-200 rounded-lg mb-6 mt-4 mx-2 scrollbar-hide">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center space-y-1 min-w-[66px] cursor-pointer"
                                >
                                    <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
                                        <div className="w-full h-full rounded-full border-2 border-white bg-gray-50 overflow-hidden">
                                             <img
                                                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                                                 alt={`Story from user ${i + 1}`}
                                                 className="w-full h-full object-cover"
                                             />
                                        </div>
                                    </div>
                                    <span className="text-xs truncate w-full text-center text-gray-700">user_{i + 1}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Feed Posts */}
                        <div className="space-y-4 mx-2">
                            {posts.map((post) => (
                                <Post key={post.id} post={post} />
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'search' && (
                    <div className="min-h-screen bg-white p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search" className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 text-gray-900 placeholder-gray-500" />
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200">
                                     <img src={`https://picsum.photos/seed/explore${i}/300/300`} alt="Explore content" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="bg-white min-h-screen">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                            <div className="font-bold text-lg flex items-center gap-1">
                                username <span className="text-xs">▼</span>
                            </div>
                            <Settings className="w-6 h-6 text-gray-900" />
                        </div>
                        <div className="p-4">
                            <div className="font-bold text-base mb-4">Messages</div>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=msg${i}`} alt="avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">user_friend_{i}</div>
                                        <div className="text-gray-500 text-xs truncate">Sent you a post • 2h</div>
                                    </div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white min-h-screen p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="font-bold text-xl">username</h1>
                            <Settings className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                             <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex justify-around text-center">
                                <div><div className="font-bold">12</div><div className="text-xs">Posts</div></div>
                                <div><div className="font-bold">1.2k</div><div className="text-xs">Followers</div></div>
                                <div><div className="font-bold">450</div><div className="text-xs">Following</div></div>
                            </div>
                        </div>
                        <div className="font-semibold mb-1">User Name</div>
                        <div className="text-sm text-gray-600 mb-4">Digital Creator • Travel • Life</div>
                        <div className="grid grid-cols-3 gap-1">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200">
                                         <img src={`https://picsum.photos/seed/profile${i}/300/300`} alt="Profile post" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="max-w-[470px] mx-auto flex justify-around items-center h-14">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('home')} className={`p-2 ${activeTab === 'home' ? 'text-black' : 'text-gray-500'}`}>
                        <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-black' : ''}`} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('search')} className={`p-2 ${activeTab === 'search' ? 'text-black' : 'text-gray-500'}`}>
                        <Search className={`w-6 h-6 ${activeTab === 'search' ? 'stroke-[3px]' : ''}`} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('messages')} className={`p-2 ${activeTab === 'messages' ? 'text-black' : 'text-gray-500'}`}>
                        <MessageCircle className={`w-6 h-6 ${activeTab === 'messages' ? 'fill-black' : ''}`} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('profile')} className={`p-2 ${activeTab === 'profile' ? 'text-black' : 'text-gray-500'}`}>
                        <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-black' : ''}`} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}