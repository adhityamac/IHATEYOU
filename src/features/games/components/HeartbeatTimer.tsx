'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectionShell from './ConnectionShell';

type Phase = 'INTRO' | 'BREATHING' | 'TIMER' | 'REFLECT';

export default function HeartbeatTimer({ onBack }: { onBack: () => void }) {
    const [phase, setPhase] = useState<Phase>('INTRO');
    const [timeLeft, setTimeLeft] = useState(30);
    const [reflection, setReflection] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        setPhase('BREATHING');
        // Brief 3-second breathing transition
        setTimeout(() => {
            setPhase('TIMER');
            setTimeLeft(30);
        }, 3000);
    };

    useEffect(() => {
        if (phase === 'TIMER' && timeLeft > 0) {
            intervalRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        }
        if (phase === 'TIMER' && timeLeft === 0) {
            setPhase('REFLECT');
        }
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [phase, timeLeft]);

    const opacity = phase === 'TIMER' ? Math.max(0.15, timeLeft / 30) : 1;

    return (
        <ConnectionShell
            title="Heartbeat Timer"
            icon="🫀"
            onClose={onBack}
            gradient="from-rose-950/90 via-stone-950/80 to-neutral-950/90"
        >
            <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto p-6 select-none">
                <AnimatePresence mode="wait">

                    {/* ── INTRO ── */}
                    {phase === 'INTRO' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="text-7xl mb-8">🫀</div>
                            <h2 className="text-2xl font-bold text-white/90 mb-3 tracking-tight">
                                30 seconds of presence
                            </h2>
                            <p className="text-white/40 text-sm mb-2 max-w-xs mx-auto leading-relaxed">
                                No talking. Just being here.
                            </p>
                            <p className="text-white/25 text-xs mb-10 italic">
                                If together — eye contact. If apart — close your eyes.
                            </p>
                            <button
                                onClick={startTimer}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/30 rounded-2xl text-white font-medium transition-all"
                            >
                                Begin
                            </button>
                        </motion.div>
                    )}

                    {/* ── BREATHING TRANSITION ── */}
                    {phase === 'BREATHING' && (
                        <motion.div
                            key="breathing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 3, ease: 'easeInOut' }}
                                className="w-24 h-24 rounded-full bg-rose-500/20 border border-rose-500/30 mx-auto mb-6 flex items-center justify-center"
                            >
                                <div className="w-8 h-8 rounded-full bg-rose-500/60" />
                            </motion.div>
                            <p className="text-white/40 text-sm tracking-widest uppercase">
                                Breathe in...
                            </p>
                        </motion.div>
                    )}

                    {/* ── TIMER ── */}
                    {phase === 'TIMER' && (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                            style={{ opacity }}
                        >
                            {/* Pulsing heartbeat */}
                            <motion.div
                                animate={{ scale: [1, 1.08, 1, 1.08, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                                className="mb-8"
                            >
                                <div className="w-32 h-32 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-rose-500/50" />
                                    </div>
                                </div>
                            </motion.div>

                            <p className="text-6xl font-extralight text-white/60 tabular-nums tracking-tighter">
                                {timeLeft}
                            </p>
                        </motion.div>
                    )}

                    {/* ── REFLECT ── */}
                    {phase === 'REFLECT' && (
                        <motion.div
                            key="reflect"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center w-full"
                        >
                            <div className="text-4xl mb-6">✨</div>
                            <h2 className="text-xl font-bold text-white/80 mb-2">
                                What did you feel?
                            </h2>
                            <p className="text-white/30 text-xs mb-8">
                                No right answer. Just notice.
                            </p>

                            <textarea
                                value={reflection}
                                onChange={(e) => setReflection(e.target.value)}
                                placeholder="I felt..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 placeholder:text-white/20 text-sm resize-none h-28 focus:outline-none focus:border-rose-500/30 transition-colors"
                            />

                            <div className="flex gap-3 mt-6 justify-center">
                                <button
                                    onClick={() => {
                                        setPhase('INTRO');
                                        setTimeLeft(30);
                                        setReflection('');
                                    }}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                >
                                    Again
                                </button>
                                <button
                                    onClick={onBack}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}
