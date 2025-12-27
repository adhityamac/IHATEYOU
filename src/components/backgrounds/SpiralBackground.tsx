'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function SpiralBackground() {
    // Reduce from 30 to 20 rings for better performance
    const spiralRings = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            id: i,
            size: (i + 1) * 60,
            opacity: 0.08 + (i / 60),
            duration: 20 + i * 2,
            scaleDuration: 6,
            delay: i * 0.08,
            direction: i % 2 === 0 ? 360 : -360
        }));
    }, []);

    return (
        <div
            className="fixed inset-0 -z-10 overflow-hidden bg-black flex items-center justify-center"
            style={{ perspective: '1000px' }}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

            {/* Spiral rings container */}
            <div className="relative w-full h-full flex items-center justify-center">
                {spiralRings.map((ring) => (
                    <motion.div
                        key={ring.id}
                        className="absolute border rounded-full"
                        style={{
                            width: `${ring.size}px`,
                            height: `${ring.size}px`,
                            borderWidth: '1px',
                            borderTopColor: `rgba(168, 85, 247, ${ring.opacity})`, // Purple
                            borderRightColor: 'transparent',
                            borderBottomColor: `rgba(59, 130, 246, ${ring.opacity})`, // Blue
                            borderLeftColor: 'transparent',
                            // Force GPU acceleration
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                        animate={{
                            rotate: ring.direction,
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: ring.duration,
                                repeat: Infinity,
                                ease: "linear",
                            },
                            scale: {
                                duration: ring.scaleDuration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: ring.delay,
                            }
                        }}
                    />
                ))}
            </div>

            {/* Overlay to prevent z-index issues */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />
        </div>
    );
}