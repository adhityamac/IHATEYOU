'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectionShell from './ConnectionShell';
import {
    CONFLICT_SCENARIOS,
    CONFLICT_STYLE_INSIGHTS,
    type ConflictScenario,
    type ConflictResponse,
} from '../data/connectionData';

type Phase = 'INTRO' | 'PLAYER1' | 'HANDOFF' | 'PLAYER2' | 'COMPARE';

export default function ConflictSim({ onBack }: { onBack: () => void }) {
    const [phase, setPhase] = useState<Phase>('INTRO');
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [choice1, setChoice1] = useState<ConflictResponse | null>(null);
    const [choice2, setChoice2] = useState<ConflictResponse | null>(null);

    const shuffledScenarios = useMemo(() => {
        return [...CONFLICT_SCENARIOS].sort(() => Math.random() - 0.5);
    }, []);

    const scenario: ConflictScenario | undefined = shuffledScenarios[scenarioIndex];

    const selectP1 = (response: ConflictResponse) => {
        setChoice1(response);
        setPhase('HANDOFF');
    };

    const selectP2 = (response: ConflictResponse) => {
        setChoice2(response);
        setPhase('COMPARE');
    };

    const nextScenario = () => {
        if (scenarioIndex < shuffledScenarios.length - 1) {
            setScenarioIndex((i) => i + 1);
            setChoice1(null);
            setChoice2(null);
            setPhase('PLAYER1');
        }
    };

    const reset = () => {
        setPhase('INTRO');
        setScenarioIndex(0);
        setChoice1(null);
        setChoice2(null);
    };

    return (
        <ConnectionShell
            title="Conflict Simulator"
            icon="🧩"
            onClose={onBack}
            gradient="from-orange-950/80 via-stone-950/80 to-red-950/80"
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
                            <div className="text-5xl mb-4">🧩</div>
                            <h2 className="text-2xl font-bold text-white/90 mb-2">
                                Conflict Simulator
                            </h2>
                            <p className="text-white/30 text-sm mb-2 max-w-xs mx-auto">
                                Hypothetical disagreements. Real communication practice.
                            </p>
                            <p className="text-white/15 text-xs mb-8 italic max-w-xs mx-auto">
                                No right answers. Just understanding how you each respond.
                            </p>
                            <button
                                onClick={() => setPhase('PLAYER1')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                Begin
                            </button>
                        </motion.div>
                    )}

                    {/* ── PLAYER 1 ── */}
                    {phase === 'PLAYER1' && scenario && (
                        <motion.div
                            key={`p1-${scenarioIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-4 font-bold text-center">
                                Player 1 — How would you respond?
                            </p>
                            <ScenarioCard scenario={scenario} />
                            <ResponseList responses={scenario.responses} onSelect={selectP1} />
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
                                Player 2's turn to respond independently.
                            </p>
                            <button
                                onClick={() => setPhase('PLAYER2')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 font-medium transition-all"
                            >
                                I'm Player 2 — Ready
                            </button>
                        </motion.div>
                    )}

                    {/* ── PLAYER 2 ── */}
                    {phase === 'PLAYER2' && scenario && (
                        <motion.div
                            key={`p2-${scenarioIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <p className="text-white/20 text-xs uppercase tracking-widest mb-4 font-bold text-center">
                                Player 2 — How would you respond?
                            </p>
                            <ScenarioCard scenario={scenario} />
                            <ResponseList responses={scenario.responses} onSelect={selectP2} />
                        </motion.div>
                    )}

                    {/* ── COMPARE ── */}
                    {phase === 'COMPARE' && choice1 && choice2 && (
                        <motion.div
                            key={`compare-${scenarioIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <h3 className="text-white/50 text-sm mb-6 text-center">
                                {scenario?.situation}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">Player 1</p>
                                    <p className="text-white/70 text-sm mb-2">&ldquo;{choice1.text}&rdquo;</p>
                                    <span className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-white/30 font-bold">
                                        {choice1.label}
                                    </span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">Player 2</p>
                                    <p className="text-white/70 text-sm mb-2">&ldquo;{choice2.text}&rdquo;</p>
                                    <span className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-white/30 font-bold">
                                        {choice2.label}
                                    </span>
                                </div>
                            </div>

                            {/* Insights */}
                            <div className="space-y-2 mb-6">
                                {[choice1, choice2].map((choice, i) => (
                                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1 font-bold">
                                            Player {i + 1}'s style: {choice.label}
                                        </p>
                                        <p className="text-white/40 text-xs leading-relaxed">
                                            {CONFLICT_STYLE_INSIGHTS[choice.style]}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {scenarioIndex < shuffledScenarios.length - 1 ? (
                                <button
                                    onClick={nextScenario}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                >
                                    Next scenario →
                                </button>
                            ) : (
                                <button
                                    onClick={reset}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-sm transition-colors"
                                >
                                    Start over
                                </button>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}

function ScenarioCard({ scenario }: { scenario: ConflictScenario }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 text-center">
            <h3 className="text-lg font-bold text-white/85 mb-2">&ldquo;{scenario.situation}&rdquo;</h3>
            <p className="text-white/30 text-xs">{scenario.context}</p>
        </div>
    );
}

function ResponseList({
    responses,
    onSelect,
}: {
    responses: ConflictResponse[];
    onSelect: (r: ConflictResponse) => void;
}) {
    return (
        <div className="space-y-2">
            {responses.map((response, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(response)}
                    className="w-full text-left p-3 bg-white/[0.03] border border-white/5 rounded-xl text-white/50 text-sm hover:bg-white/10 hover:text-white/80 hover:border-white/15 transition-all"
                >
                    &ldquo;{response.text}&rdquo;
                </button>
            ))}
        </div>
    );
}
