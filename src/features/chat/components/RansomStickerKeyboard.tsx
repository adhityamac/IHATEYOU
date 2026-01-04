'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Smile } from 'lucide-react';
import Image from 'next/image';

interface RansomStickerKeyboardProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLetter: (letter: string) => void;
    onSelectSticker?: (sticker: string) => void;
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

// Hand-drawn sticker emojis (simple text-based for now, can be replaced with images)
const HAND_DRAWN_STICKERS = [
    // Basic emotions
    '(◕‿◕)', '(｡◕‿◕｡)', '(◕ᴗ◕✿)', '(◕‿◕✿)', '(◕ω◕)',
    // Happy/Love
    '(♡‿♡)', '(◕‿◕)♡', '♡(◕‿◕)♡', '(◕ε◕♡)', '(◕3◕)',
    // Sad/Crying
    '(╥﹏╥)', '(｡•́︿•̀｡)', '(｡T ω T｡)', '(ಥ﹏ಥ)', '(｡•́ - •̀｡)',
    // Excited/Energetic
    '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(ﾉ≧∀≦)ﾉ', '(ﾉ´ヮ`)ﾉ*: ･ﾟ', '٩(◕‿◕｡)۶', '(ﾉ^ヮ^)ﾉ',
    // Confused/Thinking
    '(・_・ヾ', '(・・ ) ?', '(◔_◔)', '(・・;)', '(¯―¯٥)',
    // Cool/Chill
    '(⌐■_■)', '(▀̿Ĺ̯▀̿ ̿)', '(•_•)', '(¬‿¬)', '(◕‿-)✧',
    // Shy/Blushing
    '(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '(//▽//)', '(///▽///)', '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)', '(*/ω＼*)',
    // Angry/Frustrated
    '(╬ಠ益ಠ)', '(ಠ_ಠ)', '(¬_¬)', '(︶︹︺)', '(ಠ益ಠ)',
    // Surprised
    '(⊙_⊙)', '(◎_◎;)', '(°ロ°)', '(o_O)', '(O_O)',
    // Sleepy/Tired
    '(´ぅω・｀)', '(-_-)zzz', '(-.-)Zzz...', '(~_~;)', '(´～｀)',
];

// Categories for better organization
const STICKER_CATEGORIES = {
    happy: ['(◕‿◕)', '(｡◕‿◕｡)', '(◕ᴗ◕✿)', '(◕‿◕✿)', '(◕ω◕)'],
    love: ['(♡‿♡)', '(◕‿◕)♡', '♡(◕‿◕)♡', '(◕ε◕♡)', '(◕3◕)'],
    sad: ['(╥﹏╥)', '(｡•́︿•̀｡)', '(｡T ω T｡)', '(ಥ﹏ಥ)', '(｡•́ - •̀｡)'],
    excited: ['(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(ﾉ≧∀≦)ﾉ', '(ﾉ´ヮ`)ﾉ*: ･ﾟ', '٩(◕‿◕｡)۶', '(ﾉ^ヮ^)ﾉ'],
    confused: ['(・_・ヾ', '(・・ ) ?', '(◔_◔)', '(・・;)', '(¯―¯٥)'],
    cool: ['(⌐■_■)', '(▀̿Ĺ̯▀̿ ̿)', '(•_•)', '(¬‿¬)', '(◕‿-)✧'],
    shy: ['(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '(//▽//)', '(///▽///)', '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)', '(*/ω＼*)'],
    angry: ['(╬ಠ益ಠ)', '(ಠ_ಠ)', '(¬_¬)', '(︶︹︺)', '(ಠ益ಠ)'],
};

type TabType = 'ransom' | 'stickers';

export default function RansomStickerKeyboard({ isOpen, onClose, onSelectLetter, onSelectSticker }: RansomStickerKeyboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('ransom');

    // Generate static random styles for each letter
    const [letterStyles] = useState(() => ALPHABET.map((char) => ({
        char,
        rotation: Math.random() * 20 - 10,
        bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        textColor: Math.random() > 0.5 ? '#000' : '#fff',
        font: FONTS[Math.floor(Math.random() * FONTS.length)],
        scale: 0.8 + Math.random() * 0.4,
        borderRadius: Math.random() > 0.5 ? '0px' : '4px',
        padding: '2px 6px',
        border: Math.random() > 0.7 ? '2px solid black' : 'none',
        clipPath: Math.random() > 0.8 ? 'polygon(0 0, 100% 5%, 95% 100%, 5% 95%)' : 'none'
    })));

    const handleStickerClick = (sticker: string) => {
        if (onSelectSticker) {
            onSelectSticker(sticker);
        } else {
            onSelectLetter(sticker);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 380, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full bg-[#1a1a1a] border-t-4 border-[#eab308] overflow-hidden"
                >
                    {/* Header with tabs */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('ransom')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'ransom'
                                        ? 'bg-[#eab308] text-black font-bold'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                                    }`}
                            >
                                <Type size={16} />
                                <span className="text-sm font-rubik-vinyl uppercase tracking-wider">Ransom</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('stickers')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'stickers'
                                        ? 'bg-[#eab308] text-black font-bold'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                                    }`}
                            >
                                <Smile size={16} />
                                <span className="text-sm font-rubik-vinyl uppercase tracking-wider">Stickers</span>
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close sticker keyboard"
                            className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 h-[300px] overflow-y-auto custom-scrollbar">
                        {activeTab === 'ransom' && (
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
                        )}

                        {activeTab === 'stickers' && (
                            <div className="space-y-6">
                                {Object.entries(STICKER_CATEGORIES).map(([category, stickers]) => (
                                    <div key={category}>
                                        <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3 capitalize">
                                            {category}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {stickers.map((sticker, i) => (
                                                <motion.button
                                                    key={i}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleStickerClick(sticker)}
                                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-2xl border border-white/10 hover:border-[#eab308]/50"
                                                    title={category}
                                                >
                                                    {sticker}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
