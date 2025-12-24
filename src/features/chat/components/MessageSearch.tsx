'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Search, X, Clock, Hash, User } from 'lucide-react';

interface SearchResult {
    id: number;
    type: 'message' | 'user' | 'hashtag';
    content: string;
    username?: string;
    timestamp?: string;
    context?: string;
}

interface MessageSearchProps {
    onClose: () => void;
    messages?: any[];
}

export default function MessageSearch({ onClose, messages = [] }: MessageSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'messages' | 'users' | 'hashtags'>('all');

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);

        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        // Mock search results - replace with actual search logic
        const mockResults: SearchResult[] = [
            {
                id: 1,
                type: 'message',
                content: 'Feeling grateful today for all the small moments',
                username: 'you',
                timestamp: '2h ago',
                context: '...grateful today for all...'
            },
            {
                id: 2,
                type: 'user',
                content: '@luna_sky',
                username: 'luna_sky',
            },
            {
                id: 3,
                type: 'hashtag',
                content: '#selfcare',
            },
            {
                id: 4,
                type: 'message',
                content: 'Just finished a great meditation session',
                username: 'pixel_drifter',
                timestamp: '1d ago',
                context: '...great meditation session...'
            },
        ];

        const filtered = mockResults.filter(result => {
            if (activeFilter !== 'all' && result.type !== activeFilter.slice(0, -1)) {
                return false;
            }
            return result.content.toLowerCase().includes(searchQuery.toLowerCase());
        });

        setResults(filtered);
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'message': return <Search size={16} className="text-white/40" />;
            case 'user': return <User size={16} className="text-purple-400" />;
            case 'hashtag': return <Hash size={16} className="text-blue-400" />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-start justify-center p-6 overflow-y-auto"
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl mt-20"
            >
                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Search</h2>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            <X size={24} />
                        </motion.button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search messages, users, or hashtags..."
                            autoFocus
                            className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all font-medium"
                        />
                        {query && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    setQuery('');
                                    setResults([]);
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            >
                                <X size={16} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {['all', 'messages', 'users', 'hashtags'].map((filter) => (
                        <motion.button
                            key={filter}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === filter
                                    ? 'bg-white text-black shadow-xl'
                                    : 'bg-white/10 border border-white/20 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            {filter}
                        </motion.button>
                    ))}
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {query && results.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20"
                        >
                            <Search className="mx-auto mb-4 text-white/20" size={48} />
                            <p className="text-white/40 font-bold text-lg">No results found</p>
                            <p className="text-white/20 text-sm mt-2">Try a different search term</p>
                        </motion.div>
                    ) : query ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                        >
                            {results.map((result, i) => (
                                <motion.div
                                    key={result.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className="p-6 rounded-[24px] bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-xl bg-white/10">
                                            {getResultIcon(result.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {result.username && (
                                                    <span className="text-sm font-bold text-white/60">@{result.username}</span>
                                                )}
                                                {result.timestamp && (
                                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                        {result.timestamp}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white font-medium">{result.content}</p>
                                            {result.context && (
                                                <p className="text-white/40 text-sm mt-2">{result.context}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <Search className="mx-auto mb-4 text-white/20" size={48} />
                            <p className="text-white/40 font-bold text-lg">Start typing to search</p>
                            <p className="text-white/20 text-sm mt-2">Find messages, users, or hashtags</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recent Searches */}
                {!query && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Recent Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {['#selfcare', '@luna_sky', 'meditation', 'grateful'].map((term) => (
                                <motion.button
                                    key={term}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSearch(term)}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white text-sm font-bold transition-all flex items-center gap-2"
                                >
                                    <Clock size={14} />
                                    {term}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}
