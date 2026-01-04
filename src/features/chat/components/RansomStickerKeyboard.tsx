'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Smile, Sparkles } from 'lucide-react';
import { STICKER_CATEGORIES, getStickersByCategory } from '@/data/stickers';

interface RansomStickerKeyboardProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLetter: (letter: string) => void;
    onSelectSticker?: (sticker: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?.,@#$".split("");
const COLORS = [
    '#ef4444', '#f97316', '#facc15', '#4ade80', '#3b82f6',
    '#a855f7', '#ec4899', '#1c1917', '#ffffff', '#78716c',
];

const FONTS = [
    'var(--font-rubik-vinyl)',
    'var(--font-special-elite)',
    'var(--font-press-start)',
    'sans-serif',
    'serif'
];

type TabType = 'ransom' | 'stickers';

export default function RansomStickerKeyboard({ isOpen, onClose, onSelectLetter, onSelectSticker }: RansomStickerKeyboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('stickers');
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof STICKER_CATEGORIES>('happy');

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

    const categoryStickers = getStickersByCategory(selectedCategory);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 420, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full bg-[#1a1a1a] border-t-4 border-[#eab308] overflow-hidden"
                >
                    {/* Header with tabs */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('ransom')}
                                aria-label="Ransom letters tab"
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
                                aria-label="Stickers tab"
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

                    {/* Sticker Categories (only show when stickers tab is active) */}
                    {activeTab === 'stickers' && (
                        <div className="px-4 pt-3 pb-2 border-b border-white/5 bg-black/10">
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                                {Object.entries(STICKER_CATEGORIES).map(([key, category]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key as keyof typeof STICKER_CATEGORIES)}
                                        className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap transition-all ${selectedCategory === key
                                                ? 'text-black font-bold shadow-lg'
                                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                                            }`}
                                        style={{
                                            backgroundColor: selectedCategory === key ? category.color : undefined
                                        }}
                                    >
                                        <span className="text-sm">{category.emoji}</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

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
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                {categoryStickers.map((sticker) => (
                                    <motion.button
                                        key={sticker.id}
                                        whileHover={{ scale: 1.15, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleStickerClick(sticker.emoji)}
                                        className="aspect-square p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-3xl border border-white/10 hover:border-[#eab308]/50 flex items-center justify-center relative group"
                                        title={sticker.name}
                                    >
                                        {sticker.emoji}

                                        {/* Tooltip */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                                                {sticker.name}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className="px-4 py-2 border-t border-white/5 bg-black/10">
                        <div className="flex items-center justify-center gap-2 text-white/30">
                            <Sparkles size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {activeTab === 'ransom' ? 'Click to add ransom letters' : `${categoryStickers.length} ${STICKER_CATEGORIES[selectedCategory].name} stickers`}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
