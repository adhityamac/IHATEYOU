'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Cpu, Lock, Shield, Key, Database, Wifi, Terminal, Search, Eye, FileDigit, Hash, Code2, Binary } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- Assets: Cyber Heist Icons ---
const ICONS = [Cpu, Database, Wifi, Shield, Key, Terminal, Search, Eye, FileDigit, Hash, Code2, Binary];
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444']; // Cyber Palette

// --- Types ---
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Card {
    id: number;
    iconIndex: number; // Index into ICONS array
    color: string;
    isMatched: boolean;
    isGlitching: boolean;
}

// --- Config ---
const LEVELS: Record<Difficulty, { pairs: number, cols: number, timeLimit: number }> = {
    'EASY': { pairs: 6, cols: 3, timeLimit: 45 },
    'MEDIUM': { pairs: 10, cols: 5, timeLimit: 60 },
    'HARD': { pairs: 15, cols: 6, timeLimit: 90 },
};

// --- Component ---

export default function MemoryGame({ onBack }: { onBack: () => void }) {
    return (
        <GameShell title="Memory Match" icon="🧩" color="#10b981" onClose={onBack}>
            {(gameCtx) => <CyberBoard gameCtx={gameCtx} />}
        </GameShell>
    );
}

function CyberBoard({ gameCtx }: { gameCtx: GameContextType }) {
    const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [systemStatus, setSystemStatus] = useState<'SECURE' | 'BREACHING' | 'HACKED' | 'LOCKED'>('SECURE');

    // Timer Ref
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialization
    const initializeGame = useCallback(() => {
        const config = LEVELS[difficulty];

        // Select random icons and colors
        const selectedIndices = Array.from({ length: config.pairs }, (_, i) => i % ICONS.length);
        const shuffledIndices = selectedIndices.sort(() => Math.random() - 0.5);

        const deck: Card[] = [];
        for (let i = 0; i < config.pairs; i++) {
            const iconIndex = shuffledIndices[i];
            const color = COLORS[i % COLORS.length];
            // Add Pair
            deck.push({ id: i * 2, iconIndex, color, isMatched: false, isGlitching: false });
            deck.push({ id: i * 2 + 1, iconIndex, color, isMatched: false, isGlitching: false });
        }

        setCards(deck.sort(() => Math.random() - 0.5));
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setCombo(0);
        setTimeLeft(config.timeLimit);
        setSystemStatus('BREACHING');

        // Start Timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    gameCtx.endGame(false, 0);
                    setSystemStatus('LOCKED');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

    }, [difficulty, gameCtx]);

    // Check for Start/Reset
    useEffect(() => {
        if (gameCtx.gameState === 'PLAYING' && cards.length === 0) {
            initializeGame();
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [gameCtx.gameState, initializeGame, cards.length]);

    // Effect for detecting win
    useEffect(() => {
        if (matches > 0 && matches === LEVELS[difficulty].pairs && systemStatus !== 'HACKED') {
            if (timerRef.current) clearInterval(timerRef.current);
            setSystemStatus('HACKED');
            gameCtx.playSound('success');
            // Calc Score: Time Remaining * 100 + Moves Penalty
            const finalScore = (timeLeft * 50) + (1000 - moves * 10);
            gameCtx.endGame(true, finalScore);
        }
    }, [matches, difficulty, timeLeft, moves, gameCtx, systemStatus]);


    const handleCardClick = (index: number) => {
        if (gameCtx.gameState !== 'PLAYING' || flippedCards.length === 2 || cards[index].isMatched || flippedCards.includes(index) || systemStatus === 'LOCKED') return;

        gameCtx.playSound('click');
        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [firstIndex, secondIndex] = newFlipped;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.iconIndex === secondCard.iconIndex) {
                // Match
                gameCtx.playSound('pop'); // Distinct match sound
                setCombo(c => Math.min(c + 1, 5)); // Cap combo at 5x

                // Delay visual update slightly for impact
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) =>
                        (i === firstIndex || i === secondIndex) ? { ...c, isMatched: true } : c
                    ));
                    setMatches(m => m + 1);
                    setFlippedCards([]);
                    gameCtx.setScore(s => s + (100 * (combo + 1))); // Combo Bonus
                }, 300);

            } else {
                // Mismatch
                gameCtx.playSound('error');
                setCombo(0); // Reset Combo
                setTimeout(() => {
                    setFlippedCards([]);
                }, 800);
            }
        }
    };

    const ConfigIcon = ICONS[0]; // Placeholder for generic usage

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 font-mono text-emerald-400">

            {/* HUD */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-black/40 p-4 rounded-xl border border-emerald-500/20 backdrop-blur-md">

                <div className="flex gap-6 items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-emerald-500/50 tracking-widest">System Status</span>
                        <div className="flex items-center gap-2">
                            {systemStatus === 'BREACHING' && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />}
                            {systemStatus === 'HACKED' && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                            {systemStatus === 'LOCKED' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                            <span className={`font-bold ${systemStatus === 'HACKED' ? 'text-emerald-400' : systemStatus === 'LOCKED' ? 'text-red-500' : 'text-yellow-400'}`}>
                                {systemStatus}
                            </span>
                        </div>
                    </div>

                    <div className="h-8 w-[1px] bg-emerald-500/20" />

                    <div className="flex flex-col w-32">
                        <span className="text-[10px] uppercase text-emerald-500/50 tracking-widest flex justify-between">
                            Encryption <span>{timeLeft}s</span>
                        </span>
                        <div className="h-2 w-full bg-emerald-900/30 rounded-full overflow-hidden mt-1">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(timeLeft / LEVELS[difficulty].timeLimit) * 100}%` }}
                                transition={{ ease: "linear", duration: 1 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Difficulty Toggles */}
                {gameCtx.gameState !== 'PLAYING' ? (
                    <div className="flex gap-2">
                        {(Object.keys(LEVELS) as Difficulty[]).map(d => (
                            <button
                                key={d}
                                onClick={() => { setDifficulty(d); }}
                                className={`px-3 py-1 text-xs border border-emerald-500/30 rounded hover:bg-emerald-500/10 ${difficulty === d ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-700'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase text-emerald-500/50 tracking-widest">Breach Multiplier</span>
                        <div className="flex items-center gap-1 text-xl font-bold text-white">
                            x{combo + 1} <Zap size={16} className={`${combo > 1 ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                        </div>
                    </div>
                )}
            </div>

            {/* Matrix Grid */}
            <div className={`
                flex-1 grid gap-3 p-4 bg-black/60 border border-emerald-500/10 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.05)]
                overflow-y-auto
                ${difficulty === 'EASY' ? 'grid-cols-3' : difficulty === 'MEDIUM' ? 'grid-cols-4 sm:grid-cols-5' : 'grid-cols-4 sm:grid-cols-6'}
            `}>
                <AnimatePresence>
                    {cards.map((card, index) => {
                        const Icon = ICONS[card.iconIndex];
                        const isFlipped = flippedCards.includes(index) || card.isMatched;

                        return (
                            <motion.button
                                key={card.id}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                onClick={() => handleCardClick(index)}
                                className={`
                                    relative aspect-square rounded-lg flex items-center justify-center
                                    transition-all duration-300 overflow-hidden group
                                    ${isFlipped ? 'bg-slate-800' : 'bg-emerald-900/20 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'}
                                `}
                            >
                                {/* Card Back (Lock) */}
                                {!isFlipped && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-500/40 gap-2">
                                        <Lock size={20} />
                                        <div className="text-[8px] font-mono opacity-50">ENCRYPTED</div>
                                        {/* Glitch Overlay */}
                                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 animate-pulse" />
                                    </div>
                                )}

                                {/* Card Front (Icon) */}
                                {isFlipped && (
                                    <motion.div
                                        initial={{ rotateY: 90 }}
                                        animate={{ rotateY: 0 }}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <Icon
                                            size={32}
                                            color={card.isMatched ? '#10b981' : card.color}
                                            className={card.isMatched ? 'drop-shadow-[0_0_10px_#10b981]' : ''}
                                        />
                                        {card.isMatched && <span className="text-[8px] text-emerald-400 font-bold">DECRYPTED</span>}
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Footer Status */}
            <div className="mt-4 flex justify-between text-xs text-emerald-500/40 font-mono">
                <div>// SEC_LEVEL: {difficulty}</div>
                <div>// NODES_REMAINING: {LEVELS[difficulty].pairs - matches}</div>
            </div>

        </div>
    );
}
