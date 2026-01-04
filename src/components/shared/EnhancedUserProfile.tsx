'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Camera, Palette, Save, X, Sparkles, Heart, Zap, Star } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
    coverImage?: string;
    theme: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    badges: string[];
    stats: {
        posts: number;
        followers: number;
        following: number;
        streak: number;
    };
}

const THEME_PRESETS = [
    { name: 'Purple Dream', primary: '#8b5cf6', secondary: '#ec4899', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Ocean Blue', primary: '#3b82f6', secondary: '#06b6d4', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Sunset', primary: '#f59e0b', secondary: '#f43f5e', gradient: 'from-orange-500 to-red-500' },
    { name: 'Forest', primary: '#10b981', secondary: '#059669', gradient: 'from-emerald-500 to-green-600' },
    { name: 'Lavender', primary: '#a855f7', secondary: '#d946ef', gradient: 'from-violet-500 to-fuchsia-500' },
    { name: 'Fire', primary: '#ef4444', secondary: '#f97316', gradient: 'from-red-500 to-orange-500' },
];

const AVATAR_STYLES = [
    'adventurer', 'avataaars', 'big-ears', 'big-smile', 'bottts', 'croodles',
    'fun-emoji', 'icons', 'identicon', 'lorelei', 'micah', 'miniavs',
    'notionists', 'open-peeps', 'personas', 'pixel-art'
];

const BADGES = [
    { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Joined in the first month' },
    { id: 'streak-master', name: 'Streak Master', icon: '🔥', description: '30-day check-in streak' },
    { id: 'social-butterfly', name: 'Social Butterfly', icon: '🦋', description: '100+ connections' },
    { id: 'wellness-warrior', name: 'Wellness Warrior', icon: '💪', description: 'Completed all wellness activities' },
    { id: 'night-owl', name: 'Night Owl', icon: '🦉', description: 'Active after midnight' },
    { id: 'emoji-master', name: 'Emoji Master', icon: '😎', description: 'Used 100+ different emojis' },
];

interface EnhancedUserProfileProps extends Omit<UserProfile, 'theme'> {
    theme: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    recentEmotions?: Array<{ name: string; color: string }>;
    joinDate?: string;
    location?: string;
    website?: string;
}

export default function EnhancedUserProfile({
    id,
    username,
    displayName,
    bio,
    avatar,
    coverImage,
    theme: initialTheme,
    badges = [],
    stats,
    recentEmotions = [],
    joinDate,
    location,
    website
}: EnhancedUserProfileProps) {
    const [profile, setProfile] = useState<UserProfile>({
        id,
        username,
        displayName,
        bio,
        avatar,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
        theme: THEME_PRESETS.find(t => t.primary === initialTheme.primary) || THEME_PRESETS[0],
        badges: badges,
        stats: stats || {
            posts: 0,
            followers: 0,
            following: 0,
            streak: 0,
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'avatar' | 'badges'>('profile');

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const generateAvatar = (style: string) => {
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${profile.username}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 rounded-t-3xl overflow-hidden group">
                {editedProfile.coverImage ? (
                    <Image
                        src={editedProfile.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-r ${editedProfile.theme.gradient}`} />
                )}
                {isEditing && (
                    <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={32} className="text-white" />
                    </button>
                )}
            </div>

            {/* Profile Header */}
            <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-black group relative">
                        <Image
                            src={editedProfile.avatar}
                            alt={editedProfile.displayName}
                            fill
                            className="object-cover"
                        />
                        {isEditing && (
                            <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={24} className="text-white" />
                            </button>
                        )}
                    </div>
                    {/* Online Status */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-black" />
                </div>

                {/* Name & Bio */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editedProfile.displayName}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-2xl font-bold focus:outline-none focus:border-purple-500"
                                    placeholder="Display Name"
                                />
                                <input
                                    type="text"
                                    value={editedProfile.username}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white/60 focus:outline-none focus:border-purple-500"
                                    placeholder="@username"
                                />
                                <textarea
                                    value={editedProfile.bio}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white/80 focus:outline-none focus:border-purple-500 resize-none"
                                    rows={3}
                                    placeholder="Bio"
                                    maxLength={150}
                                />
                                <div className="text-white/40 text-sm text-right">
                                    {editedProfile.bio.length}/150
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-black text-white mb-1">{profile.displayName}</h1>
                                <p className="text-white/60 mb-2">{profile.username}</p>
                                <p className="text-white/80">{profile.bio}</p>
                            </>
                        )}
                    </div>

                    {/* Edit Button */}
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="ml-4 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-2 transition-colors"
                        >
                            <Edit3 size={18} />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="ml-4 flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-2 transition-colors"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Save size={18} />
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Posts', value: profile.stats.posts },
                        { label: 'Followers', value: profile.stats.followers },
                        { label: 'Following', value: profile.stats.following },
                        { label: 'Streak', value: `${profile.stats.streak}🔥` },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Badges */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                        {BADGES.filter(b => profile.badges.includes(b.id)).map((badge) => (
                            <div
                                key={badge.id}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center gap-2"
                                title={badge.description}
                            >
                                <span className="text-2xl">{badge.icon}</span>
                                <span className="text-white font-medium text-sm">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customization Tabs (Only visible when editing) */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6"
                        >
                            {/* Tabs */}
                            <div className="flex gap-2 mb-4 overflow-x-auto">
                                {[
                                    { id: 'profile', label: 'Profile', icon: Edit3 },
                                    { id: 'theme', label: 'Theme', icon: Palette },
                                    { id: 'avatar', label: 'Avatar', icon: Camera },
                                    { id: 'badges', label: 'Badges', icon: Star },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === tab.id
                                                ? 'bg-white text-black'
                                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                {activeTab === 'theme' && (
                                    <div>
                                        <h4 className="text-white font-bold mb-4">Choose Your Theme</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {THEME_PRESETS.map((theme) => (
                                                <button
                                                    key={theme.name}
                                                    onClick={() => setEditedProfile({ ...editedProfile, theme })}
                                                    className={`p-4 rounded-2xl border-2 transition-all ${editedProfile.theme.primary === theme.primary
                                                            ? 'border-white scale-105'
                                                            : 'border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className={`h-20 rounded-xl bg-gradient-to-r ${theme.gradient} mb-3`} />
                                                    <div className="text-white font-bold text-sm">{theme.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'avatar' && (
                                    <div>
                                        <h4 className="text-white font-bold mb-4">Choose Avatar Style</h4>
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                            {AVATAR_STYLES.map((style) => (
                                                <button
                                                    key={style}
                                                    onClick={() => setEditedProfile({ ...editedProfile, avatar: generateAvatar(style) })}
                                                    className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all hover:scale-105 relative ${editedProfile.avatar.includes(style)
                                                            ? 'border-white'
                                                            : 'border-white/10'
                                                        }`}
                                                >
                                                    <Image
                                                        src={generateAvatar(style)}
                                                        alt={style}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'badges' && (
                                    <div>
                                        <h4 className="text-white font-bold mb-4">Your Achievements</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {BADGES.map((badge) => {
                                                const isUnlocked = profile.badges.includes(badge.id);
                                                return (
                                                    <div
                                                        key={badge.id}
                                                        className={`p-4 rounded-2xl border transition-all ${isUnlocked
                                                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
                                                                : 'bg-white/5 border-white/10 opacity-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-3xl">{badge.icon}</span>
                                                            <div className="flex-1">
                                                                <div className="text-white font-bold">{badge.name}</div>
                                                                <div className="text-white/60 text-sm">{badge.description}</div>
                                                            </div>
                                                            {isUnlocked && <Sparkles size={20} className="text-yellow-400" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
