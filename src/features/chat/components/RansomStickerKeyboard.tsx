'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Delete } from 'lucide-react';

interface RansomStickerKeyboardProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLetter: (letter: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?.,@#$".split("");
const COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#facc15', // Yellow
    '#4ade80', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#1c1917', // Black
    '#ffffff', // White
    '#78716c', // Stone
];

const FONTS = [
    'var(--font-rubik-vinyl)',
    'var(--font-special-elite)',
    'var(--font-press-start)',
    'sans-serif',
    'serif'
];

export default function RansomStickerKeyboard({ isOpen, onClose, onSelectLetter }: RansomStickerKeyboardProps) {
    // Generate static random styles for each letter to ensure they look consistent across renders
    const [letterStyles] = useState(() => ALPHABET.map((char) => ({
        char,
        rotation: Math.random() * 20 - 10, // -10 to 10 deg
        bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        textColor: Math.random() > 0.5 ? '#000' : '#fff',
        font: FONTS[Math.floor(Math.random() * FONTS.length)],
        scale: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
        borderRadius: Math.random() > 0.5 ? '0px' : '4px',
        padding: '2px 6px',
        border: Math.random() > 0.7 ? '2px solid black' : 'none',
        clipPath: Math.random() > 0.8 ? 'polygon(0 0, 100% 5%, 95% 100%, 5% 95%)' : 'none' // Rough cut effect
    })));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 320, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full bg-[#1a1a1a] border-t-4 border-[#eab308] overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                        <span className="text-[#eab308] font-rubik-vinyl text-xl uppercase tracking-widest">
                            Ransom Stickers
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 h-[260px] overflow-y-auto custom-scrollbar">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {letterStyles.map((style, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.2, zIndex: 10, rotate: 0 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onSelectLetter(style.char)}
                                    className="relative group select-none shadow-lg"
                                    style={{
                                        fontFamily: style.font,
                                        transform: `rotate(${style.rotation}deg) scale(${style.scale})`,
                                        backgroundColor: style.bgColor,
                                        color: style.textColor === '#fff' && style.bgColor === '#ffffff' ? '#000' : style.textColor,
                                        padding: style.padding,
                                        borderRadius: style.borderRadius,
                                        border: style.border,
                                        clipPath: style.clipPath,
                                        minWidth: '40px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        boxShadow: '2px 4px 0px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {style.char}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
