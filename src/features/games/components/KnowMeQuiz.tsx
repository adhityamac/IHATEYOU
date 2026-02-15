'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectionShell from './ConnectionShell';
import { KNOW_ME_QUESTIONS, type KnowMeQuestion } from '../data/connectionData';

type Phase = 'INTRO' | 'ANSWER' | 'HANDOFF' | 'GUESS' | 'RESULT';

export default function KnowMeQuiz({ onBack }: { onBack: () => void }) {
    const [phase, setPhase] = useState<Phase>('INTRO');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [guess, setGuess] = useState('');
    const [results, setResults] = useState<Array<{ question: string; answer: string; guess: string }>>([]);

    const shuffledQuestions = useMemo(() => {
        return [...KNOW_ME_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    }, []);

    const currentQ: KnowMeQuestion | undefined = shuffledQuestions[questionIndex];

    const handleAnswer = () => {
        if (!answer.trim()) return;
        setPhase('HANDOFF');
    };

    const handleGuess = () => {
        if (!guess.trim() || !currentQ) return;
        setResults((prev) => [
            ...prev,
            { question: currentQ.question, answer, guess },
        ]);
        setPhase('RESULT');
    };

    const nextQuestion = () => {
        if (questionIndex < shuffledQuestions.length - 1) {
            setQuestionIndex((i) => i + 1);
            setAnswer('');
            setGuess('');
            setPhase('ANSWER');
        }
    };

    const isMatch = () => {
        return answer.trim().toLowerCase() === guess.trim().toLowerCase();
    };

    const reset = () => {
        setPhase('INTRO');
        setQuestionIndex(0);
        setAnswer('');
        setGuess('');
        setResults([]);
    };

    const isLastQuestion = questionIndex >= shuffledQuestions.length - 1;

    return (
        <ConnectionShell
            title="How Well Do You Know Me?"
            icon="🧠"
            onClose={onBack}
            gradient="from-cyan-950/80 via-slate-950/80 to-violet-950/80"
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
                            <div className="text-5xl mb-4">🧠</div>
                            <h2 className="text-2xl font-bold text-white/90 mb-2">
                                How Well Do You Know Me?
                            </h2>
                            <p className="text-white/30 text-sm mb-2 max-w-xs mx-auto">
                                Player 1 answers honestly. Player 2 guesses.
                            </p>
                            <p className="text-white/15 text-xs mb-8 italic">
                                Wrong answers aren't failures — they're invitations to learn.
                            </p>
                            <button
                                onClick={() => setPhase('ANSWER')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                Start — 5 questions
                            </button>
                        </motion.div>
                    )}

                    {/* ── PLAYER 1 ANSWERS ── */}
                    {phase === 'ANSWER' && currentQ && (
                        <motion.div
                            key={`answer-${questionIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-1 font-bold">
                                Player 1 — Answer honestly
                            </p>
                            <p className="text-white/10 text-[10px] mb-6">
                                {questionIndex + 1} / {shuffledQuestions.length}
                            </p>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                                <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
                                    {currentQ.category}
                                </span>
                                <h3 className="text-xl font-bold text-white/85 mt-2">
                                    {currentQ.question}
                                </h3>
                            </div>

                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
                                placeholder={currentQ.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 placeholder:text-white/15 text-sm focus:outline-none focus:border-cyan-500/30 transition-colors mb-4"
                                autoFocus
                            />

                            <button
                                onClick={handleAnswer}
                                disabled={!answer.trim()}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Lock Answer
                            </button>
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
                                Pass the phone to Player 2
                            </h2>
                            <p className="text-white/30 text-sm mb-8">
                                No peeking!
                            </p>
                            <button
                                onClick={() => setPhase('GUESS')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                I'm Player 2 — Ready to guess
                            </button>
                        </motion.div>
                    )}

                    {/* ── PLAYER 2 GUESSES ── */}
                    {phase === 'GUESS' && currentQ && (
                        <motion.div
                            key={`guess-${questionIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-4 font-bold">
                                Player 2 — What do you think?
                            </p>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-white/85">
                                    {currentQ.question}
                                </h3>
                            </div>

                            <input
                                type="text"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                                placeholder="Your guess..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 placeholder:text-white/15 text-sm focus:outline-none focus:border-violet-500/30 transition-colors mb-4"
                                autoFocus
                            />

                            <button
                                onClick={handleGuess}
                                disabled={!guess.trim()}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Reveal
                            </button>
                        </motion.div>
                    )}

                    {/* ── RESULT ── */}
                    {phase === 'RESULT' && currentQ && (
                        <motion.div
                            key={`result-${questionIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center w-full"
                        >
                            <h3 className="text-white/50 text-sm mb-6">{currentQ.question}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">Her answer</p>
                                    <p className="text-white/80 font-medium">{answer}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">Your guess</p>
                                    <p className="text-white/80 font-medium">{guess}</p>
                                </div>
                            </div>

                            {isMatch() ? (
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6"
                                >
                                    <p className="text-emerald-400 font-bold">You know her well 💚</p>
                                </motion.div>
                            ) : (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                                    <p className="text-amber-400/80 text-sm font-medium mb-1">
                                        Learn this about her:
                                    </p>
                                    <p className="text-white/60 text-sm italic">
                                        The answer is "{answer}" — now you know.
                                    </p>
                                </div>
                            )}

                            {isLastQuestion ? (
                                <div className="space-y-3">
                                    <p className="text-white/30 text-xs">
                                        Round complete — {results.filter((r) => r.answer.toLowerCase() === r.guess.toLowerCase()).length}/{results.length} matched
                                    </p>
                                    <button
                                        onClick={reset}
                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                    >
                                        Play again
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                >
                                    Next question →
                                </button>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}
