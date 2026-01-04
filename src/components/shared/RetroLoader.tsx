'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RetroLoaderProps {
    isLoading: boolean;
    onComplete?: () => void;
    text?: string;
}

export default function RetroLoader({ isLoading, onComplete, text = "INITIALIZING..." }: RetroLoaderProps) {
    const [shouldShow, setShouldShow] = useState(isLoading);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            setShouldShow(true);
            setProgress(0);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!shouldShow) return;

        const interval = setInterval(() => {
            if (isLoading) {
                // Slow progress up to 90% while waiting
                setProgress(prev => {
                    const next = prev + (Math.random() * 3);
                    return next > 90 ? 90 : next;
                });
            } else {
                // Fast finish when loading is done
                setProgress(100);
                clearInterval(interval);
                setTimeout(() => {
                    setShouldShow(false);
                    onComplete?.();
                }, 800);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [shouldShow, isLoading, onComplete]);

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] bg-[#0f380f] flex flex-col items-center justify-center font-mono select-none"
                >
                    {/* Pixel Hourglass SVG */}
                    <div className="mb-12">
                        <motion.svg
                            width="80"
                            height="80"
                            viewBox="0 0 16 16"
                            fill="#9bbc0f"
                            animate={{ rotate: 180 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "steps(4)", repeatDelay: 0.5 }}
                            style={{ shapeRendering: 'crispEdges' }}
                        >
                            {/* Frame */}
                            <path d="M2 0h12v2H2zM2 14h12v2H2z" />
                            {/* Glass Walls */}
                            <path d="M3 2h2v1H3zM11 2h2v1h-2z M4 3h2v1H4zM10 3h2v1h-2z M5 4h2v1H5zM9 4h2v1H9z M6 5h4v1H6z M7 6h2v4H7z M6 10h4v1H6z M5 11h2v1H5zM9 11h2v1H9z M4 12h2v1H4zM10 12h2v1h-2z M3 13h2v1H3zM11 13h2v1h-2z" opacity="0.6" />

                            {/* Sand */}
                            <rect x="6" y="2" width="4" height="3" />
                            <rect x="7" y="5" width="2" height="2" />
                            <rect x="6" y="11" width="4" height="3" />
                        </motion.svg>
                    </div>

                    {/* Loading Text */}
                    <div className="text-[#9bbc0f] text-xl font-black tracking-[0.3em] mb-6 animate-pulse font-vt323 uppercase">
                        {text}
                    </div>

                    {/* Retro Progress Bar */}
                    <div className="w-72 h-10 border-4 border-[#8bac0f] p-1 bg-[#306230] shadow-[4px_4px_0px_#0f380f]">
                        <div
                            className="h-full bg-[#9bbc0f] transition-all duration-200 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Percentage */}
                    <div className="mt-4 text-[#9bbc0f] text-2xl font-bold font-vt323">
                        {Math.floor(progress)}%
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}