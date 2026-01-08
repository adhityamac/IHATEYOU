'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface ChatSequenceMessage {
    text: string;
    sender: boolean; // true for me, false for them
}

interface ChatSequenceProps {
    messages: ChatSequenceMessage[];
    typingDurationMs?: number;
    messageRevealGapMs?: number;
    onComplete?: () => void;
}

export default function ChatSequence({
    messages,
    typingDurationMs = 1200,
    onComplete
}: ChatSequenceProps) {
    const [visibleMessages, setVisibleMessages] = useState<ChatSequenceMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentIndex < messages.length) {
            const timer = setTimeout(() => {
                setIsTyping(false);
                setVisibleMessages(prev => [...prev, messages[currentIndex]]);
                setCurrentIndex(prev => prev + 1);
            }, typingDurationMs);

            return () => clearTimeout(timer);
        } else {
            onComplete?.();
        }
    }, [currentIndex, messages, typingDurationMs, onComplete]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    return (
        <div
            ref={scrollRef}
            className="flex flex-col gap-4 w-full h-full max-h-[400px] overflow-y-auto p-6 bg-white/[0.02] rounded-[40px] border border-white/5 custom-scrollbar"
        >
            <AnimatePresence initial={false}>
                {visibleMessages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.sender ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] px-5 py-3 rounded-3xl text-sm font-medium ${msg.sender
                                ? 'bg-purple-500/20 text-white border border-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.2)]'
                                : 'bg-white/5 text-white/80 border border-white/10'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 px-4 py-3 rounded-full flex gap-1 items-center">
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                className="w-1.5 h-1.5 bg-white/40 rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                className="w-1.5 h-1.5 bg-white/40 rounded-full"
                            />
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                className="w-1.5 h-1.5 bg-white/40 rounded-full"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
