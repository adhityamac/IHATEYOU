'use client';

import React, { useState } from 'react';
import { Smile, Paperclip, Send, Mic, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '../../../components/ui/Magnetic';
import RansomStickerKeyboard from './RansomStickerKeyboard';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showStickers, setShowStickers] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage('');
        setShowStickers(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
            <motion.div
                animate={{
                    backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'
                }}
                className={`relative flex items-center gap-2 p-2 rounded-[32px] border transition-all duration-700 ${isFocused ? 'border-white/30 shadow-[0_0_60px_rgba(255,255,255,0.08)]' : 'border-white/10'
                    } backdrop-blur-3xl`}
            >
                {/* Protocol Accessories */}
                <div className="flex items-center gap-1 pl-2">
                    <button
                        onClick={() => setShowStickers(!showStickers)}
                        className={`w-12 h-12 flex items-center justify-center transition-all rounded-2xl hover:bg-white/5 group ${showStickers ? 'bg-white/10 text-white' : 'text-white/20'}`}
                    >
                        <Smile size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-white transition-all rounded-2xl hover:bg-white/5 group">
                        <Paperclip size={18} strokeWidth={2.5} className="group-hover:-rotate-45 transition-transform" />
                    </button>
                </div>

                {/* Neural Input Layer */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="INITIATE FREQUENCY TRANSMISSION..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white text-[13px] placeholder-white/10 py-5 px-4 font-black italic uppercase tracking-[0.2em]"
                />

                {/* Kinetic Trigger */}
                <div className="pr-2">
                    <Magnetic strength={0.2}>
                        <AnimatePresence mode="wait">
                            {message.trim() ? (
                                <motion.button
                                    key="send"
                                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                                    onClick={handleSend}
                                    className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-[22px] shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all group"
                                >
                                    <Send size={20} fill="currentColor" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="mic"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="w-14 h-14 flex items-center justify-center bg-white/5 text-white/20 rounded-[22px] hover:bg-white/10 hover:text-white transition-all group"
                                >
                                    <Mic size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </Magnetic>
                </div>
            </motion.div>

            <RansomStickerKeyboard
                isOpen={showStickers}
                onClose={() => setShowStickers(false)}
                onSelectLetter={(char) => setMessage(prev => prev + char)}
            />

            {/* Subliminal Metadata */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-4 flex items-center justify-center gap-4 py-2"
                    >
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
                            <Zap size={10} className="text-white/40" />
                            <span className="text-[8px] font-black italic uppercase tracking-[0.3em] text-white/20">
                                Signaling layer active
                            </span>
                        </div>
                        <div className="h-[1px] w-12 bg-white/5" />
                        <span className="text-[8px] font-black italic uppercase tracking-[0.3em] text-white/10">
                            Enter to manifest
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessageInput;
