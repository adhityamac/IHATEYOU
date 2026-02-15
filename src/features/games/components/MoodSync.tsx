'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectionShell from './ConnectionShell';
import { MOOD_OPTIONS, type MoodOption } from '../data/connectionData';

type Phase = 'PLAYER1' | 'HANDOFF' | 'PLAYER2' | 'REVEAL';

export default function MoodSync({ onBack }: { onBack: () => void }) {
    const [phase, setPhase] = useState<Phase>('PLAYER1');
    const [mood1, setMood1] = useState<MoodOption | null>(null);
    const [mood2, setMood2] = useState<MoodOption | null>(null);

    const handleSelect1 = (mood: MoodOption) => {
        setMood1(mood);
        setPhase('HANDOFF');
    };

    const handleSelect2 = (mood: MoodOption) => {
        setMood2(mood);
        setPhase('REVEAL');
    };

    const moodsMatch = mood1 && mood2 && mood1.label === mood2.label;

    const reset = () => {
        setPhase('PLAYER1');
        setMood1(null);
        setMood2(null);
    };

    return (
        <ConnectionShell
            title="Mood Sync"
            icon="🌙"
            onClose={onBack}
            gradient="from-violet-950/80 via-slate-950/80 to-indigo-950/80"
        >
            <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto p-6 select-none">
                <AnimatePresence mode="wait">

                    {/* ── PLAYER 1 SELECT ── */}
                    {phase === 'PLAYER1' && (
                        <motion.div
                            key="p1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-2 font-bold">
                                Player 1
                            </p>
                            <h2 className="text-xl font-bold text-white/80 mb-2">
                                How are you feeling right now?
                            </h2>
                            <p className="text-white/25 text-xs mb-8 italic">
                                Be honest. No one's watching yet.
                            </p>
                            <MoodGrid onSelect={handleSelect1} />
                        </motion.div>
                    )}

                    {/* ── HANDOFF ── */}
                    {phase === 'HANDOFF' && (
                        <motion.div
                            key="handoff"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="text-4xl mb-6">🤝</div>
                            <h2 className="text-xl font-bold text-white/80 mb-2">
                                Pass the phone
                            </h2>
                            <p className="text-white/30 text-sm mb-8">
                                Don't peek at each other's answers.
                            </p>
                            <button
                                onClick={() => setPhase('PLAYER2')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                I'm Player 2 — Ready
                            </button>
                        </motion.div>
                    )}

                    {/* ── PLAYER 2 SELECT ── */}
                    {phase === 'PLAYER2' && (
                        <motion.div
                            key="p2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-2 font-bold">
                                Player 2
                            </p>
                            <h2 className="text-xl font-bold text-white/80 mb-2">
                                How are you feeling right now?
                            </h2>
                            <p className="text-white/25 text-xs mb-8 italic">
                                No right answer.
                            </p>
                            <MoodGrid onSelect={handleSelect2} />
                        </motion.div>
                    )}

                    {/* ── REVEAL ── */}
                    {phase === 'REVEAL' && mood1 && mood2 && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center w-full"
                        >
                            {moodsMatch ? (
                                <>
                                    {/* Match glow */}
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${mood1.color}15`,
                                            border: `2px solid ${mood1.color}40`,
                                            boxShadow: `0 0 60px ${mood1.color}20`,
                                        }}
                                    >
                                        <span className="text-5xl">{mood1.emoji}</span>
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white/90 mb-2">
                                        In sync
                                    </h2>
                                    <p className="text-white/40 text-sm">
                                        You're both feeling <span style={{ color: mood1.color }}>{mood1.label.toLowerCase()}</span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    {/* Mismatch — gentle prompt */}
                                    <div className="flex items-center justify-center gap-8 mb-8">
                                        <div className="text-center">
                                            <div
                                                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2 mx-auto"
                                                style={{ backgroundColor: `${mood1.color}15`, border: `1px solid ${mood1.color}30` }}
                                            >
                                                <span className="text-3xl">{mood1.emoji}</span>
                                            </div>
                                            <p className="text-xs text-white/30">Player 1</p>
                                            <p className="text-sm font-medium" style={{ color: mood1.color }}>{mood1.label}</p>
                                        </div>

                                        <div className="text-white/10 text-2xl">×</div>

                                        <div className="text-center">
                                            <div
                                                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2 mx-auto"
                                                style={{ backgroundColor: `${mood2.color}15`, border: `1px solid ${mood2.color}30` }}
                                            >
                                                <span className="text-3xl">{mood2.emoji}</span>
                                            </div>
                                            <p className="text-xs text-white/30">Player 2</p>
                                            <p className="text-sm font-medium" style={{ color: mood2.color }}>{mood2.label}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                                        <p className="text-white/60 text-sm">
                                            You're in different spaces right now.
                                        </p>
                                        <p className="text-white/80 text-sm font-medium mt-2">
                                            Want to check in with each other?
                                        </p>
                                    </div>
                                </>
                            )}

                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 text-sm transition-colors mt-4"
                            >
                                Sync again
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}

function MoodGrid({ onSelect }: { onSelect: (mood: MoodOption) => void }) {
    return (
        <div className="grid grid-cols-4 gap-3 w-full max-w-sm mx-auto">
            {MOOD_OPTIONS.map((mood) => (
                <button
                    key={mood.label}
                    onClick={() => onSelect(mood)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
                    <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors font-medium">
                        {mood.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
