'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, TrendingUp, Hash, Sparkles } from 'lucide-react';
import TrendingPosts from './TrendingPosts';
import HashtagFeed from './HashtagFeed';
import UserRecommendations from './UserRecommendations';
import EnhancedUserProfile from '../../../components/shared/EnhancedUserProfile';

type SocialTab = 'trending' | 'hashtags' | 'discover' | 'profile';

export default function SocialHub() {
    const [activeTab, setActiveTab] = useState<SocialTab>('trending');
    const [selectedHashtag, setSelectedHashtag] = useState<string | undefined>();

    const tabs = [
        { id: 'trending' as SocialTab, label: 'Trending', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
        { id: 'hashtags' as SocialTab, label: 'Hashtags', icon: Hash, color: 'from-blue-500 to-cyan-500' },
        { id: 'discover' as SocialTab, label: 'Discover', icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
        { id: 'profile' as SocialTab, label: 'Profile', icon: Users, color: 'from-purple-500 to-pink-500' },
    ];

    // Mock user data for profile
    const currentUser = {
        username: 'traveler',
        bio: 'Existing in the digital void, finding light in the darkness.',
        avatar: 'traveler',
        followers: 234,
        following: 156,
        posts: 89,
        joinDate: 'January 2024',
        location: 'The Void',
        website: 'https://example.com',
        badges: ['Early Adopter', 'Soul Seeker'],
        recentEmotions: [
            { name: 'Joyful', color: '#F5A8C8' },
            { name: 'Calm', color: '#A8C5E0' },
            { name: 'Grateful', color: '#E8D8A8' },
            { name: 'Hopeful', color: '#A8E8C0' },
            { name: 'Excited', color: '#F8D8A8' },
        ]
    };

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 pb-6"
            >
                <div className="flex items-center gap-4 mb-2">
                    <Users className="text-purple-400" size={40} />
                    <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
                        Social Hub
                    </h1>
                </div>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs ml-14">
                    Connect, discover, and share your journey
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
                                    layoutId="activeSocialTab"
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
                className="px-2"
            >
                {activeTab === 'trending' && <TrendingPosts />}
                {activeTab === 'hashtags' && (
                    <HashtagFeed
                        selectedTag={selectedHashtag}
                        onTagSelect={setSelectedHashtag}
                    />
                )}
                {activeTab === 'discover' && <UserRecommendations />}
                {activeTab === 'profile' && <EnhancedUserProfile {...currentUser} />}
            </motion.div>
        </div>
    );
}
