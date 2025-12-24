'use client';

import { Message } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Reply, Heart } from 'lucide-react';
import { memo, useState } from 'react';

function MessageBubbleComponent({ message, isSent, showAvatar, avatar, onReact, onReply, username }: MessageBubbleProps) {
    const [lastTap, setLastTap] = useState(0);
    const [showHeartBurst, setShowHeartBurst] = useState(false);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();
    };

    const handleReact = (emoji: string) => {
        if (onReact) onReact(message.id, emoji);
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        if (now - lastTap < 300) {
            handleReact('❤️');
            setShowHeartBurst(true);
            setTimeout(() => setShowHeartBurst(false), 1000);
        }
        setLastTap(now);
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

                {/* Quick Reply Button - Appears on Hover */}
                <button
                    onClick={() => onReply?.(message)}
                    className={`absolute ${isSent ? '-left-12' : '-right-12'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 text-white/40 hover:text-white`}
                    title="Reply"
                >
                    <Reply size={16} />
                </button>

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

                {/* HEART BURST ANIMATION */}
                <AnimatePresence>
                    {showHeartBurst && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none"
                        >
                            <Heart size={80} fill="#f43f5e" className="text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                    {/* Quoted Message Block */}
                    {message.replyTo && (
                        <div className={`mb-1 px-4 py-2 rounded-t-2xl border-x border-t border-white/5 bg-white/[0.02] text-xs max-w-xs ${isSent ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-none mb-1">Reply to {message.replyTo.username}</p>
                            <p className="text-white/40 truncate italic">"{message.replyTo.content}"</p>
                        </div>
                    )}

                    <motion.div
                        onTap={handleDoubleTap}
                        whileHover={{ scale: 1.01 }}
                        className={`relative px-5 py-3 border transition-all ${isSent
                            ? 'bg-gradient-to-br from-rose-500/10 to-rose-600/10 border-rose-500/20 text-white shadow-xl'
                            : 'bg-white/[0.03] border-white/5 text-white shadow-lg'
                            } ${message.replyTo ? 'rounded-b-2xl rounded-tr-2xl' : 'rounded-[24px]'}`}
                    >
                        {/* Content Area */}
                        <div className="text-sm leading-relaxed font-semibold">
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
                </div>

                {/* Active Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex gap-1 mt-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {Array.from(new Set(message.reactions.map(r => r.emoji))).map((emoji, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="px-2 py-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full text-sm shadow-md"
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

const MessageBubble = memo(MessageBubbleComponent);
export default MessageBubble;
