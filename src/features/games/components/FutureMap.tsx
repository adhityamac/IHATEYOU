'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectionShell from './ConnectionShell';
import { FUTURE_PROMPTS } from '../data/connectionData';

type Phase = 'INTRO' | 'PLAYER1' | 'HANDOFF' | 'PLAYER2' | 'REVEAL';
type Category = 'dreams' | 'fears' | 'goals';

interface Selections {
    dreams: string;
    fears: string;
    goals: string;
}

const EMPTY_SELECTIONS: Selections = { dreams: '', fears: '', goals: '' };

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
    dreams: { label: 'One dream', emoji: '✨', color: '#fbbf24' },
    fears: { label: 'One fear', emoji: '🌑', color: '#94a3b8' },
    goals: { label: 'One goal', emoji: '🎯', color: '#6ee7b7' },
};

export default function FutureMap({ onBack }: { onBack: () => void }) {
    const [phase, setPhase] = useState<Phase>('INTRO');
    const [p1, setP1] = useState<Selections>({ ...EMPTY_SELECTIONS });
    const [p2, setP2] = useState<Selections>({ ...EMPTY_SELECTIONS });
    const [activeCategory, setActiveCategory] = useState<Category>('dreams');

    const isComplete = (sel: Selections): boolean =>
        Boolean(sel.dreams && sel.fears && sel.goals);

    const setSelection = (player: 1 | 2, category: Category, value: string) => {
        const setter = player === 1 ? setP1 : setP2;
        setter((prev) => ({ ...prev, [category]: value }));

        // Auto-advance category
        const cats: Category[] = ['dreams', 'fears', 'goals'];
        const nextIdx = cats.indexOf(category) + 1;
        if (nextIdx < cats.length) {
            setActiveCategory(cats[nextIdx]);
        }
    };

    const overlaps = (Object.keys(CATEGORY_META) as Category[]).filter(
        (cat) => p1[cat] && p2[cat] && p1[cat] === p2[cat]
    );

    const reset = () => {
        setPhase('INTRO');
        setP1({ ...EMPTY_SELECTIONS });
        setP2({ ...EMPTY_SELECTIONS });
        setActiveCategory('dreams');
    };

    return (
        <ConnectionShell
            title="Future Map"
            icon="🌌"
            onClose={onBack}
            gradient="from-indigo-950/80 via-slate-950/80 to-violet-950/80"
        >
            <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto p-6 select-none overflow-y-auto">
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
                            <div className="text-5xl mb-4">🌌</div>
                            <h2 className="text-2xl font-bold text-white/90 mb-2">Future Map</h2>
                            <p className="text-white/30 text-sm mb-2 max-w-xs mx-auto">
                                Each of you picks one dream, one fear, and one goal.
                            </p>
                            <p className="text-white/15 text-xs mb-8 italic">
                                See where your futures overlap.
                            </p>
                            <button
                                onClick={() => setPhase('PLAYER1')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                Begin
                            </button>
                        </motion.div>
                    )}

                    {/* ── PLAYER SELECT (shared component) ── */}
                    {(phase === 'PLAYER1' || phase === 'PLAYER2') && (
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-4 font-bold text-center">
                                {phase === 'PLAYER1' ? 'Player 1' : 'Player 2'}
                            </p>

                            {/* Category tabs */}
                            <div className="flex gap-2 justify-center mb-6">
                                {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
                                    const meta = CATEGORY_META[cat];
                                    const sel = phase === 'PLAYER1' ? p1 : p2;
                                    const selected = Boolean(sel[cat]);
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${activeCategory === cat
                                                    ? 'bg-white/10 border-white/20 text-white/80'
                                                    : 'bg-white/[0.02] border-white/5 text-white/30'
                                                } ${selected ? 'ring-1 ring-emerald-500/30' : ''}`}
                                        >
                                            {meta.emoji} {meta.label} {selected && '✓'}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Options */}
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {FUTURE_PROMPTS[activeCategory].map((prompt, i) => {
                                    const sel = phase === 'PLAYER1' ? p1 : p2;
                                    const isSelected = sel[activeCategory] === prompt;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                setSelection(
                                                    phase === 'PLAYER1' ? 1 : 2,
                                                    activeCategory,
                                                    prompt
                                                )
                                            }
                                            className={`w-full text-left p-3 rounded-xl text-sm transition-all border ${isSelected
                                                    ? 'bg-white/10 border-white/20 text-white/80'
                                                    : 'bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
                                                }`}
                                        >
                                            {prompt}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Continue */}
                            {isComplete(phase === 'PLAYER1' ? p1 : p2) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6"
                                >
                                    <button
                                        onClick={() => {
                                            if (phase === 'PLAYER1') {
                                                setActiveCategory('dreams');
                                                setPhase('HANDOFF');
                                            } else {
                                                setPhase('REVEAL');
                                            }
                                        }}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm font-medium transition-colors"
                                    >
                                        {phase === 'PLAYER1' ? 'Done — pass the phone' : 'Reveal our map'}
                                    </button>
                                </motion.div>
                            )}
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
                            <h2 className="text-xl font-bold text-white/80 mb-2">Pass the phone</h2>
                            <p className="text-white/30 text-sm mb-8">Player 2's turn.</p>
                            <button
                                onClick={() => {
                                    setActiveCategory('dreams');
                                    setPhase('PLAYER2');
                                }}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                I'm Player 2 — Ready
                            </button>
                        </motion.div>
                    )}

                    {/* ── REVEAL ── */}
                    {phase === 'REVEAL' && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="w-full"
                        >
                            <h3 className="text-center text-white/40 text-sm mb-6">Your shared map</h3>

                            <div className="space-y-4">
                                {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
                                    const meta = CATEGORY_META[cat];
                                    const match = p1[cat] === p2[cat];
                                    return (
                                        <motion.div
                                            key={cat}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: ['dreams', 'fears', 'goals'].indexOf(cat) * 0.2 }}
                                            className={`rounded-2xl border p-4 ${match
                                                    ? 'bg-white/10 border-white/20'
                                                    : 'bg-white/[0.03] border-white/5'
                                                }`}
                                            style={match ? { boxShadow: `0 0 40px ${meta.color}15` } : {}}
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span>{meta.emoji}</span>
                                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                                                    {meta.label}
                                                </span>
                                                {match && (
                                                    <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                                        ✦ Aligned
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-[10px] text-white/20 mb-1 font-bold">P1</p>
                                                    <p className="text-white/60 text-sm">{p1[cat]}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-white/20 mb-1 font-bold">P2</p>
                                                    <p className="text-white/60 text-sm">{p2[cat]}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {overlaps.length > 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-center text-white/40 text-xs mt-6 italic"
                                >
                                    {overlaps.length} area{overlaps.length > 1 ? 's' : ''} aligned. That's direction.
                                </motion.p>
                            )}

                            <button
                                onClick={reset}
                                className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 text-sm transition-colors"
                            >
                                Map again
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}
