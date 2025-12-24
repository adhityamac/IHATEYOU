'use client';

import { motion } from 'framer-motion';

interface LoadingAnimationProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function LoadingAnimation({ message = 'Loading...', size = 'md' }: LoadingAnimationProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            {/* Animated Circles */}
            <div className={`relative ${sizeClasses[size]}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-4 border-white/20"
                        style={{
                            borderTopColor: 'white',
                        }}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: i * 0.2,
                            },
                            scale: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.2,
                            }
                        }}
                    />
                ))}
            </div>

            {/* Loading Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/60 font-bold uppercase tracking-widest text-xs"
            >
                {message.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        animate={{
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>

            {/* Pulse Dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
