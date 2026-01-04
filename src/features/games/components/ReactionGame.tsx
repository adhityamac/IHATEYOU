'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Trophy, RotateCcw } from 'lucide-react';

export default function ReactionGame() {
    // Stable ID counter for scores
    const INITIAL_ID = 2025122300000;
    const idCounter = useRef(INITIAL_ID);

    const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const getInitialBestTime = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('best-reaction-time');
            if (saved) return parseInt(saved);
        }
        return null;
    };
    const [bestTime, setBestTime] = useState<number | null>(getInitialBestTime);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startTest = () => {
        setGameState('waiting');
        const delay = Math.random() * 3000 + 2000; // 2-5 seconds
        timeoutRef.current = setTimeout(() => {
            setGameState('ready');
            setStartTime(Date.now());
        }, delay);
    };

    const handleAction = () => {
        if (gameState === 'waiting') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setReactionTime(-1); // Too early
            setGameState('result');
        } else if (gameState === 'ready') {
            const time = Date.now() - startTime;
            setReactionTime(time);
            if (!bestTime || time < bestTime) {
                setBestTime(time);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('best-reaction-time', time.toString());
                }
            }
            // Save to leaderboard
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('arcade-leaderboard');
                const scores = saved ? JSON.parse(saved) : [];
                idCounter.current += 1;
                scores.push({
                    id: idCounter.current.toString(),
                    player: 'You',
                    score: time,
                    date: new Date().toISOString(),
                    game: 'reaction'
                });
                localStorage.setItem('arcade-leaderboard', JSON.stringify(scores));
            }
            setGameState('result');
        }
    };

    // Removed setBestTime in useEffect to avoid cascading renders

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-[400px]">
            <div className="flex justify-between w-full px-6 text-center">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Neural Latency</span>
                    <span className="text-xl font-black italic text-white">{reactionTime > 0 ? `${reactionTime}ms` : '--'}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Personal Peak</span>
                    <span className="text-xl font-black italic text-white">{bestTime ? `${bestTime}ms` : '--'}</span>
                </div>
            </div>

            <button
                onClick={gameState === 'idle' || gameState === 'result' ? startTest : handleAction}
                className={`relative w-80 h-80 rounded-full flex flex-col items-center justify-center transition-all duration-300 overflow-hidden border-4 ${gameState === 'idle' ? 'bg-white/5 border-white/10 hover:bg-white/10' :
                    gameState === 'waiting' ? 'bg-rose-500/20 border-rose-500/40 cursor-wait' :
                        gameState === 'ready' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_80px_rgba(16,185,129,0.5)] cursor-pointer' :
                            'bg-white/5 border-white/10'
                    }`}
            >
                {gameState === 'ready' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute inset-0 bg-white/20 rounded-full"
                    />
                )}

                <AnimatePresence mode="wait">
                    {gameState === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                            <Zap className="w-16 h-16 text-white/20 animate-pulse" />
                            <span className="text-sm font-black italic text-white/40 uppercase tracking-[0.2em]">Initiate Pulse</span>
                        </motion.div>
                    )}
                    {gameState === 'waiting' && (
                        <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                            <Timer className="w-16 h-16 text-rose-500/40 animate-spin-slow" />
                            <span className="text-sm font-black italic text-rose-500/40 uppercase tracking-[0.2em]">Standby...</span>
                        </motion.div>
                    )}
                    {gameState === 'ready' && (
                        <motion.div key="ready" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="flex flex-col items-center">
                            <span className="text-5xl font-black italic text-white uppercase tracking-tighter">NOW!</span>
                        </motion.div>
                    )}
                    {gameState === 'result' && (
                        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                            {reactionTime === -1 ? (
                                <span className="text-xl font-black italic text-rose-500 uppercase tracking-widest">Early Trigger!</span>
                            ) : (
                                <>
                                    <Trophy className="w-16 h-16 text-yellow-500" />
                                    <span className="text-4xl font-black italic text-white tracking-widest">{reactionTime}ms</span>
                                </>
                            )}
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                                <RotateCcw size={12} /> Click to retry
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            <div className="text-center px-8">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Test your synaptic response time. Click the sphere the moment it turns emerald.
                </p>
            </div>
        </div>
    );
}
