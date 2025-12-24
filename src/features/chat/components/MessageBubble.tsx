'use client';

import { Message } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
    message: Message;
    isSent: boolean;
    showAvatar?: boolean;
    avatar?: string;
    onReact?: (messageId: string, emoji: string) => void;
    username?: string;
}

export default function MessageBubble({ message, isSent, showAvatar, avatar, onReact, username }: MessageBubbleProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();
    };

    const handleReact = (emoji: string) => {
        if (onReact) {
            onReact(message.id, emoji);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: isSent ? 20 : -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`flex items-end gap-3 mb-6 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            {showAvatar && !isSent && (
                <div className="mb-6">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                        <img
                            src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Soul'}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}
            {!showAvatar && !isSent && <div className="w-10" />}

            {/* Bubble Content */}
            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[85%] relative group`}>
                {/* Reactions UI */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    whileHover={{ opacity: 1, scale: 1, y: 0 }}
                    className={`absolute ${isSent ? 'right-0' : 'left-0'} -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full p-2 shadow-2xl z-20`}
                >
                    {['❤️', '😂', '👍', '🔥', '😮', '😢'].map((emoji) => (
                        <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReact(emoji)}
                            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white/10 rounded-full transition-all"
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`relative px-5 py-3 rounded-[24px] border transition-all ${isSent
                        ? 'bg-gradient-to-br from-rose-500/10 to-rose-600/10 border-rose-500/20 text-white shadow-xl'
                        : 'bg-white/[0.03] border-white/5 text-white shadow-lg'
                        }`}
                >
                    {/* Content Area */}
                    <div className={`${message.size === 'small' ? 'text-sm' :
                        message.size === 'medium' ? 'text-base' :
                            'text-2xl'
                        } leading-relaxed font-medium`}>
                        {message.content}
                    </div>

                    {/* Meta Info */}
                    <div className={`flex items-center gap-2 mt-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">
                            {formatTime(message.timestamp)}
                        </span>
                        {isSent && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                {message.isRead ? (
                                    <CheckCheck className="w-3 h-3 text-rose-500" strokeWidth={3} />
                                ) : (
                                    <Check className="w-3 h-3 text-white/10" strokeWidth={3} />
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Active Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex gap-1 mt-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {message.reactions.map((reaction, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="px-2 py-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full text-sm shadow-md"
                            >
                                {reaction.emoji}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
