'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Hand-drawn doodle styles mimicking the reference image
const DoodleFace = ({ type, color = "#FFD700" }: { type: number, color?: string }) => {
    switch (type) {
        case 0: // Blushy happy
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    <circle cx="50" cy="50" r="45" fill={color} stroke="black" strokeWidth="3" />
                    <path d="M30 40 Q35 35 40 40" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M60 40 Q65 35 70 40" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <ellipse cx="25" cy="55" rx="10" ry="6" fill="#FF6B6B" opacity="0.6" />
                    <ellipse cx="75" cy="55" rx="10" ry="6" fill="#FF6B6B" opacity="0.6" />
                    <path d="M40 70 Q50 80 60 70" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );
        case 1: // Heart eyes
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    <circle cx="50" cy="50" r="45" fill={color} stroke="black" strokeWidth="3" />
                    <path d="M25 40 Q25 30 35 30 T45 40 T35 50 T25 40" fill="#FF4757" stroke="black" strokeWidth="1" />
                    <path d="M55 40 Q55 30 65 30 T75 40 T65 50 T55 40" fill="#FF4757" stroke="black" strokeWidth="1" />
                    <ellipse cx="25" cy="65" rx="8" ry="5" fill="#FF6B6B" opacity="0.5" />
                    <ellipse cx="75" cy="65" rx="8" ry="5" fill="#FF6B6B" opacity="0.5" />
                    <path d="M35 75 Q50 85 65 75" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );
        case 2: // Watery eyes / Shy
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    <circle cx="50" cy="50" r="45" fill={color} stroke="black" strokeWidth="3" />
                    <circle cx="35" cy="45" r="8" fill="black" />
                    <circle cx="37" cy="42" r="3" fill="white" />
                    <circle cx="65" cy="45" r="8" fill="black" />
                    <circle cx="67" cy="42" r="3" fill="white" />
                    <ellipse cx="50" cy="55" rx="15" ry="10" fill="#FF6B6B" opacity="0.7" />
                    <path d="M45 75 Q50 72 55 75" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case 3: // Big sparkle eyes
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    <circle cx="50" cy="50" r="45" fill={color} stroke="black" strokeWidth="3" />
                    <circle cx="30" cy="45" r="12" fill="black" />
                    <circle cx="28" cy="40" r="4" fill="white" />
                    <circle cx="32" cy="48" r="2" fill="white" />
                    <circle cx="70" cy="45" r="12" fill="black" />
                    <circle cx="68" cy="40" r="4" fill="white" />
                    <circle cx="72" cy="48" r="2" fill="white" />
                    <ellipse cx="25" cy="60" rx="12" ry="7" fill="#FF6B6B" opacity="0.6" />
                    <ellipse cx="75" cy="60" rx="12" ry="7" fill="#FF6B6B" opacity="0.6" />
                    <path d="M40 80 Q50 70 60 80" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );
        default:
            return null;
    }
};

interface EmojiItem {
    id: number;
    type: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
    duration: number;
}

const generateEmojis = (): EmojiItem[] => {
    return Array.from({ length: 25 }).map((_, index) => ({
        id: index,
        type: Math.floor(Math.random() * 4),
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: (Math.random() - 0.5) * 40,
        scale: 0.5 + Math.random() * 0.7,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
    }));
};

export default function EmojiDoodleBackground() {
    const [emojis] = useState<EmojiItem[]>(generateEmojis());

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {emojis.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [0.8 * item.scale, 1 * item.scale, 1.1 * item.scale, 0.9 * item.scale],
                        rotate: [item.rotation, item.rotation + 10, item.rotation - 10, item.rotation],
                        y: [0, -40, -80, -120],
                        x: [0, (item.scale - 0.5) * 40, (item.scale - 0.3) * 40, 0]
                    }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: '80px',
                        height: '80px',
                    }}
                >
                    <DoodleFace type={item.type} />
                </motion.div>
            ))}

            {/* Hand-drawn noise / texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

            {/* Decorative doodles */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
                        style={{
                            position: 'absolute',
                            left: `${(i * 7) % 100}%`,
                            top: `${(i * 5) % 100}%`,
                            color: i % 2 === 0 ? '#FF6B6B' : '#FFD700',
                            fontSize: '20px'
                        }}
                    >
                        {i % 3 === 0 ? '✨' : i % 3 === 1 ? '❤️' : '⭐'}
                    </motion.div>
                ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0F]/90 via-[#0D0D0F]/70 to-[#0D0D0F]/90" />
        </div>
    );
}
