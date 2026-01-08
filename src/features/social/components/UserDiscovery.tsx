'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, X, UserPlus, Loader2, Users, Sparkles } from 'lucide-react';
import { searchUsersByGhostName, getRandomUsers } from '@/lib/firebase/users';
import { UserProfile } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';

interface UserDiscoveryProps {
    onClose: () => void;
    onUserSelected?: (userId: string) => void;
}

export default function UserDiscovery({ onClose, onUserSelected }: UserDiscoveryProps) {
    const { user } = useAuth();
    const { startConversation } = useChat();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [randomUsers, setRandomUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'discover' | 'search'>('discover');

    // Load random users function
    const loadRandomUsers = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const users = await getRandomUsers(user.id, 12);
            setRandomUsers(users);
        } catch (error) {
            console.error('Error loading random users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load random users on mount
    useEffect(() => {
        if (user?.id) {
            loadRandomUsers();
        }
    }, [user?.id]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const results = await searchUsersByGhostName(searchQuery);
            // Filter out current user
            setSearchResults(results.filter(u => u.uid !== user?.id));
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartConversation = async (selectedUser: UserProfile) => {
        if (!user) return;

        try {
            const conversationId = await startConversation(
                selectedUser.uid,
                {
                    name: selectedUser.displayName || 'User',
                    avatar: selectedUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.uid}`,
                    ghostName: selectedUser.ghostName,
                }
            );

            if (conversationId) {
                onUserSelected?.(selectedUser.uid);
                onClose();
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    const displayUsers = activeTab === 'search' ? searchResults : randomUsers;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-1">Find People</h2>
                        <p className="text-sm text-white/40">Discover souls in the void</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'discover'
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles size={16} />
                            Discover
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'search'
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Search size={16} />
                            Search
                        </div>
                    </button>
                </div>

                {/* Search Bar (only show in search tab) */}
                {activeTab === 'search' && (
                    <div className="mb-6">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by ghost name..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={!searchQuery.trim() || loading}
                            className="mt-3 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-white/30 text-white py-3 rounded-xl font-bold text-sm transition-all"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                )}

                {/* Users Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading && activeTab === 'discover' ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                        </div>
                    ) : displayUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/40">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">
                                {activeTab === 'search'
                                    ? 'No users found. Try a different search.'
                                    : 'No users to discover yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {displayUsers.map((discoveredUser) => (
                                <motion.button
                                    key={discoveredUser.uid}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleStartConversation(discoveredUser)}
                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-left group"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-800 mb-3 ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                                            <Image
                                                src={discoveredUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${discoveredUser.uid}`}
                                                alt={discoveredUser.ghostName || discoveredUser.displayName || 'User'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="font-bold text-white text-sm mb-1 truncate w-full">
                                            {discoveredUser.ghostName || discoveredUser.displayName || 'Anonymous'}
                                        </div>
                                        {discoveredUser.moodBaseline && (
                                            <div className="text-xs text-white/40 mb-2">
                                                Feeling {discoveredUser.moodBaseline}
                                            </div>
                                        )}
                                        <div className="mt-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <UserPlus size={12} />
                                            Chat
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Refresh Button (discover tab only) */}
                {activeTab === 'discover' && (
                    <button
                        onClick={loadRandomUsers}
                        disabled={loading}
                        className="mt-6 w-full bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16} />
                        {loading ? 'Loading...' : 'Discover More'}
                    </button>
                )}
            </motion.div>
        </motion.div>
    );
}
