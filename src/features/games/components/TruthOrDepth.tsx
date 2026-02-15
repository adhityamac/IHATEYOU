'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectionShell from './ConnectionShell';
import { DEPTH_QUESTIONS, DEPTH_LEVEL_THRESHOLDS, type DepthQuestion } from '../data/connectionData';

type Level = 'light' | 'personal' | 'vulnerable';

const LEVEL_META: Record<Level, { label: string; color: string; emoji: string; description: string }> = {
    light: { label: 'Light', color: '#6ee7b7', emoji: '🌤️', description: 'Easy, warm-up questions' },
    personal: { label: 'Personal', color: '#fbbf24', emoji: '🌅', description: 'Requires some openness' },
    vulnerable: { label: 'Vulnerable', color: '#f472b6', emoji: '🌙', description: 'Deep trust territory' },
};

function getSessionCount(): number {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('truth-depth-sessions') || '0', 10);
}

function incrementSession(): void {
    if (typeof window === 'undefined') return;
    const current = getSessionCount();
    localStorage.setItem('truth-depth-sessions', (current + 1).toString());
}

function isLevelUnlocked(level: Level): boolean {
    if (level === 'light') return true;
    const sessions = getSessionCount();
    return sessions >= DEPTH_LEVEL_THRESHOLDS[level];
}

function getRandomQuestion(level: Level): DepthQuestion {
    const pool = DEPTH_QUESTIONS[level];
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function TruthOrDepth({ onBack }: { onBack: () => void }) {
    const [activeLevel, setActiveLevel] = useState<Level>('light');
    const [question, setQuestion] = useState<DepthQuestion | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
        setSessions(getSessionCount());
    }, []);

    const drawQuestion = useCallback((level: Level) => {
        setActiveLevel(level);
        setQuestion(getRandomQuestion(level));
        setShowFollowUp(false);
        incrementSession();
        setSessions(getSessionCount());
    }, []);

    const nextQuestion = () => {
        setQuestion(getRandomQuestion(activeLevel));
        setShowFollowUp(false);
    };

    return (
        <ConnectionShell
            title="Truth or Depth"
            icon="💌"
            onClose={onBack}
            gradient="from-indigo-950/80 via-rose-950/60 to-amber-950/80"
        >
            <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto p-6 select-none">
                <AnimatePresence mode="wait">

                    {/* ── LEVEL SELECT ── */}
                    {!question && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center w-full"
                        >
                            <div className="text-5xl mb-4">💌</div>
                            <h2 className="text-2xl font-bold text-white/90 mb-1 tracking-tight">
                                Truth or Depth
                            </h2>
                            <p className="text-white/30 text-xs mb-8">
                                Choose your depth. No rush.
                            </p>

                            <div className="space-y-3 w-full">
                                {(Object.keys(LEVEL_META) as Level[]).map((level) => {
                                    const meta = LEVEL_META[level];
                                    const unlocked = isLevelUnlocked(level);
                                    const threshold = level === 'light' ? 0 : DEPTH_LEVEL_THRESHOLDS[level];

                                    return (
                                        <button
                                            key={level}
                                            onClick={() => unlocked && drawQuestion(level)}
                                            disabled={!unlocked}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all ${unlocked
                                                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                                                    : 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{meta.emoji}</span>
                                                    <div>
                                                        <div className="font-bold text-white/80 text-sm" style={{ color: unlocked ? meta.color : undefined }}>
                                                            {meta.label}
                                                        </div>
                                                        <div className="text-white/30 text-xs">{meta.description}</div>
                                                    </div>
                                                </div>
                                                {!unlocked && (
                                                    <span className="text-[10px] text-white/20 font-mono">
                                                        {sessions}/{threshold} sessions
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="text-white/15 text-[10px] mt-6 italic">
                                {sessions} session{sessions !== 1 ? 's' : ''} so far. Deeper levels unlock with consistency.
                            </p>
                        </motion.div>
                    )}

                    {/* ── QUESTION CARD ── */}
                    {question && (
                        <motion.div
                            key={question.text}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="text-center w-full"
                        >
                            {/* Level indicator */}
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-8 border"
                                style={{
                                    color: LEVEL_META[activeLevel].color,
                                    borderColor: `${LEVEL_META[activeLevel].color}30`,
                                    backgroundColor: `${LEVEL_META[activeLevel].color}10`,
                                }}
                            >
                                {LEVEL_META[activeLevel].emoji} {LEVEL_META[activeLevel].label}
                            </div>

                            {/* Question */}
                            <h2 className="text-2xl md:text-3xl font-bold text-white/90 leading-snug mb-6 px-4">
                                {question.text}
                            </h2>

                            {/* Follow-up */}
                            <AnimatePresence>
                                {showFollowUp && question.followUp && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-white/40 text-sm italic mb-6"
                                    >
                                        {question.followUp}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 mt-8 items-center">
                                {question.followUp && !showFollowUp && (
                                    <button
                                        onClick={() => setShowFollowUp(true)}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 text-sm transition-colors"
                                    >
                                        Go deeper →
                                    </button>
                                )}

                                <button
                                    onClick={nextQuestion}
                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                >
                                    Next question
                                </button>

                                <button
                                    onClick={() => setQuestion(null)}
                                    className="text-white/20 text-xs hover:text-white/40 transition-colors mt-2"
                                >
                                    ← Back to levels
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}
