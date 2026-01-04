'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, Zap } from 'lucide-react';

const EMOJIS = ['🧠', '💀', '🔥', '💎', '🌙', '🌌', '👻', '🧿', '🧬', '🔮'];

interface Card {
    id: number;
    emoji: string;
    isMatched: boolean;
}

export default function MemoryGame() {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const initializeGame = useCallback(() => {
        const doubledEmojis = [...EMOJIS, ...EMOJIS];
        const shuffled = doubledEmojis
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isMatched: false,
            }));
        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setIsComplete(false);
    }, []);

    // Only initialize game on first render
    const didInit = useRef(false);
    if (!didInit.current) {
        initializeGame();
        didInit.current = true;
    }

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || flippedCards.includes(id) || cards[id].isMatched) return;

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                setTimeout(() => {
                    setCards(prev => prev.map(card =>
                        newFlipped.includes(card.id) ? { ...card, isMatched: true } : card
                    ));
                    setMatches(m => m + 1);
                    setFlippedCards([]);
                    if (matches + 1 === EMOJIS.length) {
                        setIsComplete(true);
                    }
                }, 600);
            } else {
                setTimeout(() => {
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex justify-between w-full max-w-[400px] px-6">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Resonance Matching</span>
                    <span className="text-xl font-black italic text-white">{matches} / {EMOJIS.length}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Neural Moves</span>
                    <span className="text-xl font-black italic text-white">{moves}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 p-4 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl">
                {cards.map((card) => (
                    <motion.button
                        key={card.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCardClick(card.id)}
                        className={`relative w-[60px] h-[60px] xs:w-[70px] xs:h-[70px] rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 preserve-3d ${flippedCards.includes(card.id) || card.isMatched
                            ? 'rotate-y-180 bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                            : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'
                            } border`}
                    >
                        <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                            <div className="w-6 h-6 border-2 border-white/5 rounded-lg opacity-20" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rotate-y-180 backface-hidden">
                            <span className={card.isMatched ? 'opacity-40 grayscale transition-all' : ''}>
                                {card.emoji}
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {isComplete ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="flex items-center gap-3 text-2xl font-black italic uppercase text-white tracking-widest">
                                <Trophy className="text-yellow-500 w-8 h-8" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Memory Restored</span>
                            </div>
                            <button
                                onClick={initializeGame}
                                className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all"
                            >
                                <RefreshCcw size={14} /> Re-Sync Grid
                            </button>
                        </motion.div>
                    ) : (
                        <button
                            onClick={initializeGame}
                            className="flex items-center gap-2 p-4 px-8 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Zap size={14} className="text-yellow-500" /> Reset Neural State
                        </button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
