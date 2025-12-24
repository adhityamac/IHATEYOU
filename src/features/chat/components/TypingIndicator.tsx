'use client';

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
    username?: string;
}

export default function TypingIndicator({ username = 'Someone' }: TypingIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit"
        >
            {/* Avatar Pulse */}
            <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                }}
            />

            {/* Username */}
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                {username}
            </span>

            {/* Animated Dots */}
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/60"
                        animate={{
                            y: [0, -8, 0],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
