'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Getting things ready..." }: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-rose-900/20" />

            {/* Breathing Echo Animation */}
            <div className="relative flex flex-col items-center gap-8">
                {/* Echo Watermelon 🍉 */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    <div className="text-8xl">🍉</div>

                    {/* Pulse Rings */}
                    <motion.div
                        animate={{
                            scale: [1, 2, 2],
                            opacity: [0.5, 0, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                        className="absolute inset-0 rounded-full border-2 border-white/30"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 2.5, 2.5],
                            opacity: [0.3, 0, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.5
                        }}
                        className="absolute inset-0 rounded-full border-2 border-rose-400/30"
                    />
                </motion.div>

                {/* Loading Message */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 text-lg font-light tracking-wide"
                >
                    {message}
                </motion.p>

                {/* Loading Dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-white/50 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </div>
    );
}
