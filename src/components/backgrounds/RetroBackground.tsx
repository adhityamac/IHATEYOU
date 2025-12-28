'use client';

import { motion } from 'framer-motion';

export default function RetroBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
            {/* Retro sunburst pattern */}
            <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 w-1 h-[150%] bg-gradient-to-b from-transparent via-orange-400 to-transparent origin-top"
                        style={{
                            transform: `rotate(${i * 15}deg) translateX(-50%)`,
                        }}
                    />
                ))}
            </div>

            {/* Retro circles */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/4 right-1/4 w-64 h-64 border-8 border-orange-300/30 rounded-full"
            />
            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-1/4 left-1/4 w-80 h-80 border-8 border-pink-300/30 rounded-full"
            />

            {/* Vintage dots pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,146,60,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-transparent to-rose-200/20" />

            {/* Film grain texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
