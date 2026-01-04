'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, Type, Trash2, X, Sparkles, Filter, Save, Upload, Compass } from 'lucide-react';
import { useTheme } from '@/components/shared/GradientThemeProvider';

type ItemType = 'image' | 'text' | 'sticker';
type Category = 'All' | 'Career' | 'Love' | 'Health' | 'Vibes';

interface BoardItem {
    id: string;
    type: ItemType;
    content: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    category: Category;
    zIndex: number;
}

const STICKERS = ['✨', '💫', '🌟', '🌙', '🦋', '🔥', '💎', '🍀', '🧿', '🧘‍♀️', '✈️', '🏠', '💰', '❤️'];

export default function VisionBoard() {
    const { theme } = useTheme();
    const isRetro = theme.startsWith('retro');
    const containerRef = useRef<HTMLDivElement>(null);

    // Theme Styles
    const bgColor = isRetro ? 'bg-[#fef9c3]' : 'bg-black/20';
    const corkPattern = isRetro
        ? 'radial-gradient(#854d0e 1px, transparent 1px)'
        : 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)';

    const [items, setItems] = useState<BoardItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [manifestationScore, setManifestationScore] = useState(0);

    // Initial load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('vision_board_items');
            if (saved) setItems(JSON.parse(saved));

            // Initial items if empty
            if (!saved) {
                const initialItems: BoardItem[] = [
                    { id: '1', type: 'text', content: 'Design the life you love', x: 200, y: 200, rotation: -5, scale: 1, category: 'Vibes', zIndex: 1 },
                    { id: '2', type: 'sticker', content: '✨', x: 250, y: 150, rotation: 15, scale: 1.5, category: 'Vibes', zIndex: 2 }
                ];
                setItems(initialItems);
            }
        }
    }, []);

    // Save on change
    useEffect(() => {
        if (typeof window !== 'undefined' && items.length > 0) {
            localStorage.setItem('vision_board_items', JSON.stringify(items));
            // Update score based on activity/count
            setManifestationScore(Math.min(100, items.length * 5 + 10));
        }
    }, [items]);

    const handleAddItem = (type: ItemType, content: string, category: Category = 'Vibes') => {
        const newItem: BoardItem = {
            id: Date.now().toString(),
            type,
            content,
            x: Math.random() * (window.innerWidth / 2) + 50,
            y: Math.random() * (window.innerHeight / 3) + 100,
            rotation: (Math.random() - 0.5) * 20,
            scale: 1,
            category,
            zIndex: items.length + 1
        };
        setItems([...items, newItem]);
        setIsMenuOpen(false);
        setTextInput('');
    };

    const updateItemPosition = (id: string, x: number, y: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, x, y, zIndex: Math.max(...prev.map(i => i.zIndex)) + 1 } : item));
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

    return (
        <div className={`relative w-full h-full min-h-screen overflow-hidden transition-colors duration-500 font-sans ${bgColor}`}>
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: corkPattern,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Header / Manifestation Meter */}
            <div className={`absolute top-0 left-0 right-0 p-8 z-50 pointer-events-none flex justify-between items-start ${isRetro ? 'bg-gradient-to-b from-[#fef9c3] to-transparent' : 'bg-gradient-to-b from-black/50 to-transparent'}`}>
                <div className="pointer-events-auto">
                    <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${isRetro ? 'text-black italic' : 'text-white italic'}`}>
                        Dream Pixels
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${isRetro ? 'text-stone-600' : 'text-white/60'}`}>
                            Manifestation Level
                        </div>
                        <div className="w-32 h-2 bg-black/10 rounded-full overflow-hidden border border-black/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${manifestationScore}%` }}
                                className={`h-full ${isRetro ? 'bg-[#eab308]' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2 pointer-events-auto">
                    {(['All', 'Career', 'Love', 'Health', 'Vibes'] as Category[]).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat
                                ? (isRetro ? 'bg-[#422006] text-[#fef9c3]' : 'bg-white text-black')
                                : (isRetro ? 'bg-stone-100 border-2 border-stone-800 text-stone-800' : 'bg-white/10 text-white hover:bg-white/20')
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Board Area */}
            <div ref={containerRef} className="w-full h-full absolute inset-0 pt-32 pb-32">
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <motion.div
                            key={item.id}
                            drag
                            dragMomentum={false}
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: item.scale, rotate: item.rotation, x: item.x, y: item.y }}
                            exit={{ scale: 0, opacity: 0 }}
                            onDragEnd={(_, info) => updateItemPosition(item.id, item.x + info.offset.x, item.y + info.offset.y)}
                            onClick={() => updateItemPosition(item.id, item.x, item.y)} // Bring to front
                            className={`absolute flex flex-col items-center justify-center p-4 cursor-grab active:cursor-grabbing group`}
                            style={{ zIndex: item.zIndex }}
                        >
                            <div className={`relative transition-transform duration-200 group-hover:scale-105 ${item.type === 'image'
                                ? 'p-2 bg-white shadow-xl rotate-1'
                                : item.type === 'text'
                                    ? (isRetro ? 'bg-[#fef3c7] border-2 border-[#422006] p-6 shadow-[4px_4px_0_#422006]' : 'bg-black/60 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl')
                                    : 'text-6xl drop-shadow-xl'
                                }`}>
                                {item.type === 'text' && (
                                    <p className={`text-center font-bold max-w-[200px] leading-relaxed ${isRetro ? 'text-black font-vt323 text-xl' : 'text-white'}`}>
                                        "{item.content}"
                                    </p>
                                )}
                                {item.type === 'sticker' && (
                                    <span>{item.content}</span>
                                )}
                                {item.type === 'image' && (
                                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {/* Placeholder for actual image logic */}
                                        <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.content}`} alt="vision" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* Delete Button (Hidden unless hover) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                                    className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Floating Action Button */}
            <div className={`fixed bottom-32 right-8 z-[100] ${isRetro ? 'font-vt323' : ''}`}>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className={`absolute bottom-20 right-0 w-72 p-6 rounded-3xl shadow-2xl mb-4 ${isRetro ? 'bg-[#fef9c3] border-4 border-[#422006]' : 'bg-[#1a1a1c] border border-white/10'}`}
                        >
                            <h3 className={`font-black uppercase tracking-widest mb-4 ${isRetro ? 'text-black' : 'text-white'}`}>Add to Board</h3>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={textInput}
                                        onChange={e => setTextInput(e.target.value)}
                                        placeholder="Type an affirmation..."
                                        className={`w-full p-3 rounded-lg text-sm font-bold ${isRetro ? 'bg-white border-2 border-stone-800 text-black' : 'bg-white/5 border border-white/10 text-white'}`}
                                        onKeyDown={e => e.key === 'Enter' && textInput && handleAddItem('text', textInput)}
                                    />
                                    <button
                                        onClick={() => textInput && handleAddItem('text', textInput)}
                                        className={`w-full mt-2 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest ${isRetro ? 'bg-yellow-400 text-black border-2 border-stone-800' : 'bg-white text-black'}`}
                                    >
                                        Post Note
                                    </button>
                                </div>

                                <div className="border-t border-black/10 pt-4">
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isRetro ? 'text-stone-600' : 'text-white/40'}`}>Stickers</p>
                                    <div className="flex flex-wrap gap-2">
                                        {STICKERS.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => handleAddItem('sticker', s)}
                                                className="text-xl hover:scale-125 transition-transform"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${isRetro
                        ? 'bg-[#eab308] border-4 border-[#422006] text-[#422006]'
                        : 'bg-white text-black'
                        }`}
                >
                    <motion.div animate={{ rotate: isMenuOpen ? 45 : 0 }}>
                        <Plus size={32} strokeWidth={3} />
                    </motion.div>
                </button>
            </div>
        </div>
    );
}
