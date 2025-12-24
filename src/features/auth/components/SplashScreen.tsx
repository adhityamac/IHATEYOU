'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase-based animation timing
        const timer1 = setTimeout(() => setPhase(1), 800);
        const timer2 = setTimeout(() => setPhase(2), 2000);
        const timer3 = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 600);
        }, 2200);

        // IMPORTANT: If 'onComplete' is not memoized (e.g., with useCallback) in the parent,
        // this useEffect might re-run unnecessarily if the parent re-renders and creates
        // a new 'onComplete' function instance. Consider memoizing 'onComplete' in the parent.
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Ambient Background Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="relative flex flex-col items-center">
                {/* Minimal Logo Mark */}
                <div className="relative w-24 h-24 mb-12">
                    <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 100,
                            delay: 0.2
                        }}
                        className="w-full h-full border-2 border-white/10 rounded-[32px] rotate-45"
                    />
                    <motion.div
                        initial={{ scale: 0, rotate: 180, opacity: 0 }}
                        animate={{
                            scale: phase >= 1 ? [1, 1.1, 1] : 1,
                            rotate: phase >= 1 ? 45 : 0,
                            opacity: 1
                        }}
                        transition={{
                            type: 'spring',
                            damping: 15,
                            stiffness: 200,
                            delay: 0.4,
                            scale: { repeat: Infinity, duration: 2 }
                        }}
                        className={`absolute inset-0 border-2 ${phase >= 2 ? 'border-purple-500' : 'border-white'} rounded-[32px] transition-colors duration-1000`}
                    />
                </div>

                {/* Typography */}
                <div className="text-center overflow-hidden">
                    <motion.h1
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl font-black tracking-tighter text-white uppercase italic"
                    >
                        IHATEYOU
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
                        className="text-[10px] font-bold text-white uppercase tracking-[0.5em] mt-4"
                    >
                        Initializing Void
                    </motion.p>
                </div>

                {/* Loading Indicator */}
                <div className="absolute -bottom-24 w-48 h-px bg-white/5 overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                </div>
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')]" /> {/* Changed to local asset path */}
        </motion.div>
    );
}