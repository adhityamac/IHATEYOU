'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RetroCoupleBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Base Gradient - Warm Retro Colors */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                            rgba(255, 182, 193, 0.3) 0%, 
                            transparent 50%),
                        linear-gradient(135deg, 
                            #FFB6C1 0%,
                            #FFE4B5 25%,
                            #FFDAB9 50%,
                            #FFB6C1 75%,
                            #FFA07A 100%
                        )
                    `,
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            {/* Polaroid Frames Floating */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-32 h-40 bg-white shadow-2xl"
                        style={{
                            left: `${(i * 20) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                            transform: `rotate(${i * 15}deg)`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [i * 15, i * 15 + 10, i * 15],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="w-full h-3/4 bg-gradient-to-br from-pink-200 to-orange-200" />
                        <div className="h-1/4 flex items-center justify-center">
                            <div className="w-16 h-1 bg-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cassette Tape Elements */}
            <div className="absolute inset-0 opacity-5">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`cassette-${i}`}
                        className="absolute"
                        style={{
                            left: `${25 + i * 20}%`,
                            top: `${20 + i * 20}%`,
                        }}
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 30 + i * 10,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        {/* Cassette Tape SVG */}
                        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                            <rect width="120" height="80" rx="4" fill="#FF69B4" opacity="0.3" />
                            <circle cx="30" cy="40" r="15" fill="#FFB6C1" opacity="0.5" />
                            <circle cx="90" cy="40" r="15" fill="#FFB6C1" opacity="0.5" />
                            <rect x="40" y="35" width="40" height="10" fill="#FFA07A" opacity="0.4" />
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Vinyl Record Elements */}
            <div className="absolute inset-0 opacity-8">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`vinyl-${i}`}
                        className="absolute"
                        style={{
                            left: `${10 + i * 35}%`,
                            top: `${60 + i * 10}%`,
                        }}
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 20 - i * 5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400/20 to-orange-400/20 border-4 border-pink-300/30 relative">
                            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-pink-200/20" />
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-300/20 to-pink-300/20" />
                            <div className="absolute inset-8 rounded-full bg-pink-200/30" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Retro Sunburst Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    background: `
                        repeating-conic-gradient(
                            from 0deg at 50% 50%,
                            #FFB6C1 0deg 10deg,
                            #FFA07A 10deg 20deg
                        )
                    `,
                }}
            />

            {/* Vintage Typography Elements */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <motion.div
                    className="text-[20rem] font-black italic text-pink-300"
                    style={{
                        fontFamily: 'Impact, sans-serif',
                        WebkitTextStroke: '2px rgba(255, 160, 122, 0.3)',
                        textShadow: '4px 4px 0 rgba(255, 182, 193, 0.2)',
                    }}
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.05, 0.08, 0.05],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    LOVE
                </motion.div>
            </div>

            {/* Hearts Floating */}
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`heart-${i}`}
                        className="absolute text-4xl"
                        style={{
                            left: `${(i * 8.33) % 100}%`,
                            top: `${100 + (i * 10)}%`,
                        }}
                        animate={{
                            y: [0, -1200],
                            x: [0, Math.sin(i) * 50],
                            rotate: [0, 360],
                            opacity: [0, 0.3, 0],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: i * 0.5,
                        }}
                    >
                        💕
                    </motion.div>
                ))}
            </div>

            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-10 mix-blend-overlay"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
            />

            {/* Gradient Overlay for Depth */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
                }}
            />
        </div>
    );
}
