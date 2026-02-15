'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Trophy, RotateCcw, Activity, Flame, Play } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- Types ---
type GamePhase = 'IDLE' | 'WAITING' | 'READY' | 'VARNISH' | 'RESULT';
type Mode = 'SINGLE' | 'HEAT'; // Single shot vs Average of 5

export default function ReactionGame({ onBack }: { onBack: () => void }) {
    return (
        <GameShell title="Reaction Game" icon="⚡" color="#f43f5e" onClose={onBack}>
            {(gameCtx) => <ReactionBoard gameCtx={gameCtx} />}
        </GameShell>
    );
}

function ReactionBoard({ gameCtx }: { gameCtx: GameContextType }) {
    const [phase, setPhase] = useState<GamePhase>('IDLE');
    const [mode, setMode] = useState<Mode>('SINGLE');

    // Heat Mode State
    const [heatRound, setHeatRound] = useState(1);
    const [heatScores, setHeatScores] = useState<number[]>([]);

    const [reactionTime, setReactionTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [bestTime, setBestTime] = useState<number | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync Best Time
    useEffect(() => {
        const saved = localStorage.getItem('best-reaction-time');
        if (saved) setBestTime(parseInt(saved));
    }, []);

    // --- Game Logic ---

    const startRound = () => {
        setPhase('WAITING');
        const delay = Math.random() * 3000 + 2000; // 2-5s random delay

        timeoutRef.current = setTimeout(() => {
            setPhase('READY');
            setStartTime(performance.now());
        }, delay);
    };

    const handleInteraction = () => {
        if (phase === 'IDLE' || phase === 'RESULT') {
            // Restart
            setReactionTime(0);
            if (mode === 'HEAT') {
                setHeatRound(1);
                setHeatScores([]);
            }
            startRound();
        } else if (phase === 'WAITING') {
            // Too Early
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setReactionTime(-1); // Flag for "Too Early"
            gameCtx.playSound('error');
            setPhase('RESULT');
        } else if (phase === 'READY') {
            // Success
            const end = performance.now();
            const time = Math.round(end - startTime);
            setReactionTime(time);
            gameCtx.playSound('success');

            if (mode === 'SINGLE') {
                updateStats(time);
                setPhase('RESULT');
            } else {
                // HEAT MODE LOGIC
                const newScores = [...heatScores, time];
                setHeatScores(newScores);

                if (heatRound < 5) {
                    setHeatRound(prev => prev + 1);
                    setPhase('VARNISH'); // Brief pause between rounds
                    setTimeout(() => startRound(), 1000);
                } else {
                    // Heat Finished
                    const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / 5);
                    updateStats(avg);
                    setReactionTime(avg); // Show average as final result
                    setPhase('RESULT');
                }
            }
        }
    };

    const updateStats = (time: number) => {
        gameCtx.setScore(s => s + Math.max(0, 1000 - time)); // Score based on speed
        if (!bestTime || time < bestTime) {
            setBestTime(time);
            localStorage.setItem('best-reaction-time', time.toString());
            gameCtx.playSound('pop'); // New Record Sound
        }
    };

    // Cleanup
    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);


    // --- Visuals ---

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-4 select-none">

            {/* Mode Switcher */}
            {phase === 'IDLE' && (
                <div className="absolute top-4 flex gap-4 bg-black/40 p-1 rounded-full border border-white/10">
                    <button
                        onClick={() => setMode('SINGLE')}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${mode === 'SINGLE' ? 'bg-rose-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Single Pulse
                    </button>
                    <button
                        onClick={() => setMode('HEAT')}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 ${mode === 'HEAT' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        <Flame size={12} /> Heat Mode (x5)
                    </button>
                </div>
            )}

            {/* Main Interactive Core */}
            <div className="relative">
                {/* Background Glow Ring */}
                <div className={`
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-500
                    ${phase === 'WAITING' ? 'bg-rose-900/40' : phase === 'READY' ? 'bg-emerald-500/60' : 'bg-transparent'}
                `} />

                <button
                    onMouseDown={handleInteraction}
                    // Touch support
                    onTouchStart={(e) => { e.preventDefault(); handleInteraction(); }}
                    className={`
                        relative w-72 h-72 md:w-96 md:h-96 rounded-full border-8 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-100
                        shadow-2xl active:scale-95
                        ${phase === 'IDLE' ? 'border-white/10 bg-white/5 hover:bg-white/10' : ''}
                        ${phase === 'WAITING' ? 'border-rose-500/30 bg-rose-500/10 animate-pulse' : ''}
                        ${phase === 'READY' ? 'border-emerald-400 bg-emerald-500 text-white scale-105 shadow-[0_0_100px_#10b981]' : ''}
                        ${phase === 'RESULT' ? (reactionTime === -1 ? 'border-red-500 bg-red-900/50' : 'border-blue-500 bg-blue-900/50') : ''}
                        ${phase === 'VARNISH' ? 'border-orange-500/50 bg-orange-500/20' : ''}
                    `}
                >
                    {/* Inner UI Content */}
                    <AnimatePresence mode="wait">

                        {phase === 'IDLE' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                                <Zap size={48} className="mx-auto mb-4 text-rose-500" />
                                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Initiate</h1>
                                <p className="text-white/40 text-xs font-mono mt-2 uppercase">Tap to start</p>
                            </motion.div>
                        )}

                        {phase === 'WAITING' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                                <Activity size={64} className="mx-auto text-rose-500 animate-pulse" />
                                <p className="text-rose-400 font-bold text-lg mt-4 uppercase tracking-[0.3em]">Wait for Green</p>
                            </motion.div>
                        )}

                        {phase === 'READY' && (
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} className="text-center">
                                <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">CLICK!</h1>
                            </motion.div>
                        )}

                        {phase === 'VARNISH' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                <p className="text-orange-400 font-bold text-2xl uppercase">Next Round...</p>
                            </motion.div>
                        )}

                        {phase === 'RESULT' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
                                {reactionTime === -1 ? (
                                    <>
                                        <h2 className="text-3xl font-black text-red-500 uppercase italic mb-2">Too Early!</h2>
                                        <p className="text-white/60 text-sm">Don't anticipate. React.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center gap-2 mb-2 text-blue-400">
                                            {mode === 'HEAT' && <Flame size={20} />}
                                            <span className="text-xs font-bold uppercase tracking-widest">{mode === 'HEAT' ? 'Average' : 'Reaction Time'}</span>
                                        </div>
                                        <h1 className="text-7xl font-black text-white tracking-tighter mb-4">{reactionTime}<span className="text-3xl text-white/40">ms</span></h1>
                                        {bestTime && reactionTime <= bestTime && <div className="inline-block px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase rounded-full animate-bounce">New Record!</div>}
                                    </>
                                )}
                                <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    <RotateCcw size={12} /> Tap to Retry
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </button>
            </div>

            {/* Heat Scores Indicator */}
            {mode === 'HEAT' && phase !== 'IDLE' && (
                <div className="mt-8 flex gap-2">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className={`
                            w-3 h-3 rounded-full border border-white/20 transition-all
                            ${i < heatRound - 1 ? 'bg-white' : i === heatRound - 1 ? 'bg-orange-500 animate-pulse' : 'bg-transparent'}
                        `} />
                    ))}
                </div>
            )}

            {/* Personal Best */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center opacity-50 hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Personal Best</p>
                <div className="flex items-center gap-2 text-white font-mono text-xl">
                    <Trophy size={16} className="text-yellow-500" />
                    {bestTime ? `${bestTime}ms` : '--'}
                </div>
            </div>

        </div>
    );
}
