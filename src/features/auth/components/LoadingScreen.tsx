'use client';

import { motion } from 'framer-motion';

import EmojiDoodleBackground from '@/components/backgrounds/EmojiDoodleBackground';

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Getting things ready..." }: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
            <EmojiDoodleBackground />

            {/* Animated Background Gradient (Subtle Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/80 to-rose-900/40 mix-blend-overlay" />

            {/* Void Loading Animation (Matching Splash Screen) */}
            <div className="relative flex flex-col items-center gap-8">
                <div className="relative w-16 h-16">
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0 border-2 border-white/20 rounded-2xl"
                    />
                    <motion.div
                        animate={{
                            rotate: -360,
                            scale: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0 border-2 border-purple-500/50 rounded-2xl"
                        style={{ margin: '-4px' }}
                    />
                    <motion.div
                        animate={{
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-white/10 blur-xl rounded-full"
                    />
                </div>

                {/* Loading Message */}
                <div className="flex flex-col items-center gap-2">
                    <motion.h3
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white font-bold tracking-[0.2em] uppercase text-sm"
                    >
                        {message}
                    </motion.h3>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -4, 0],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                                className="w-1 h-1 bg-purple-500 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.svg')]" />
            </div>
        </div>
    );
}
