'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Smile } from 'lucide-react';

interface MessageReactionsProps {
    messageId: number;
    onReact: (emoji: string) => void;
    reactions?: Record<string, number>;
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👍', '🙏', '✨'];

export default function MessageReactions({ onReact, reactions = {} }: MessageReactionsProps) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div className="relative">
            {/* Reaction Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPicker(!showPicker)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
                <Smile size={16} />
            </motion.button>

            {/* Reaction Picker */}
            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 p-3 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl z-50"
                    >
                        <div className="flex gap-2">
                            {QUICK_REACTIONS.map((emoji, i) => (
                                <motion.button
                                    key={emoji}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.3, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        onReact(emoji);
                                        setShowPicker(false);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-white/10 rounded-xl transition-all"
                                >
                                    {emoji}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Display Reactions */}
            {Object.keys(reactions).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-3 right-0 flex gap-1"
                >
                    {Object.entries(reactions).map(([emoji, count]) => (
                        <motion.div
                            key={emoji}
                            whileHover={{ scale: 1.1 }}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded-full flex items-center gap-1 text-xs backdrop-blur-md"
                        >
                            <span>{emoji}</span>
                            <span className="text-white/60 font-bold">{count}</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
