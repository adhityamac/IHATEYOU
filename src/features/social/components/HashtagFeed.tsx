'use client';

import { motion } from 'framer-motion';
import { Hash, TrendingUp, MessageCircle } from 'lucide-react';

interface Hashtag {
    tag: string;
    count: number;
    trending: boolean;
    growth: number;
}

interface HashtagFeedProps {
    selectedTag?: string;
    onTagSelect?: (tag: string) => void;
}

export default function HashtagFeed({ selectedTag, onTagSelect }: HashtagFeedProps) {
    const trendingHashtags: Hashtag[] = [
        { tag: 'selfcare', count: 1234, trending: true, growth: 45 },
        { tag: 'mentalhealth', count: 987, trending: true, growth: 32 },
        { tag: 'gratitude', count: 756, trending: false, growth: 12 },
        { tag: 'mindfulness', count: 654, trending: true, growth: 28 },
        { tag: 'healing', count: 543, trending: false, growth: 8 },
        { tag: 'anxiety', count: 432, trending: false, growth: -5 },
        { tag: 'meditation', count: 389, trending: true, growth: 18 },
        { tag: 'therapy', count: 321, trending: false, growth: 6 },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Hash className="text-blue-400" size={32} />
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Trending Tags</h2>
            </div>

            {/* Hashtag Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingHashtags.map((hashtag, i) => (
                    <motion.button
                        key={hashtag.tag}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onTagSelect?.(hashtag.tag)}
                        className={`p-6 rounded-[24px] border text-left transition-all ${selectedTag === hashtag.tag
                                ? 'bg-blue-500/20 border-blue-500/50'
                                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Hash className="text-blue-400" size={20} />
                                <span className="text-xl font-black text-white">#{hashtag.tag}</span>
                            </div>
                            {hashtag.trending && (
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30"
                                >
                                    <TrendingUp className="text-orange-400" size={14} />
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-white/60">
                                <MessageCircle size={16} />
                                <span className="font-bold">{hashtag.count.toLocaleString()}</span>
                            </div>
                            <div className={`flex items-center gap-1 font-bold ${hashtag.growth > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                <TrendingUp size={16} className={hashtag.growth < 0 ? 'rotate-180' : ''} />
                                <span>{Math.abs(hashtag.growth)}%</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

// Hashtag Input Component
export function HashtagInput({ onHashtagAdd }: { onHashtagAdd: (tag: string) => void }) {
    const [input, setInput] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<string[]>([]);

    const commonTags = ['selfcare', 'mentalhealth', 'gratitude', 'mindfulness', 'healing', 'meditation'];

    const handleInput = (value: string) => {
        setInput(value);
        if (value.startsWith('#')) {
            const query = value.slice(1).toLowerCase();
            setSuggestions(commonTags.filter(tag => tag.includes(query)));
        } else {
            setSuggestions([]);
        }
    };

    const addHashtag = (tag: string) => {
        onHashtagAdd(tag);
        setInput('');
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="Add hashtags... #selfcare"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-blue-500/50 transition-all"
            />

            {suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl z-50"
                >
                    {suggestions.map((tag) => (
                        <motion.button
                            key={tag}
                            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            onClick={() => addHashtag(tag)}
                            className="w-full px-4 py-2 rounded-xl text-left text-white/80 hover:text-white transition-all flex items-center gap-2"
                        >
                            <Hash size={14} className="text-blue-400" />
                            #{tag}
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

// Import React for HashtagInput
import React from 'react';
