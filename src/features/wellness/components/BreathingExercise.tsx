'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function BreathingExercise() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<BreathPhase>('inhale');
    const [count, setCount] = useState(0);
    const [cycles, setCycles] = useState(0);

    const phaseDurations = {
        inhale: 4,
        hold: 4,
        exhale: 4,
        rest: 2
    };

    const phaseMessages = {
        inhale: 'Breathe In',
        hold: 'Hold',
        exhale: 'Breathe Out',
        rest: 'Rest'
    };

    useEffect(() => {
        if (!isActive) return;

        const duration = phaseDurations[phase];

        if (count < duration) {
            const timer = setTimeout(() => setCount(count + 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Move to next phase
            const phases: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phases.indexOf(phase);
            const nextIndex = (currentIndex + 1) % phases.length;

            if (nextIndex === 0) {
                setCycles(cycles + 1);
            }

            setPhase(phases[nextIndex]);
            setCount(0);
        }
    }, [isActive, count, phase, cycles]);

    const reset = () => {
        setIsActive(false);
        setPhase('inhale');
        setCount(0);
        setCycles(0);
    };

    const getCircleScale = () => {
        const progress = count / phaseDurations[phase];
        switch (phase) {
            case 'inhale': return 0.5 + (progress * 0.5);
            case 'hold': return 1;
            case 'exhale': return 1 - (progress * 0.5);
            case 'rest': return 0.5;
            default: return 0.5;
        }
    };

    const getCircleColor = () => {
        switch (phase) {
            case 'inhale': return 'from-blue-500 to-cyan-500';
            case 'hold': return 'from-purple-500 to-pink-500';
            case 'exhale': return 'from-green-500 to-emerald-500';
            case 'rest': return 'from-gray-500 to-slate-500';
            default: return 'from-blue-500 to-cyan-500';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Wind className="text-cyan-400" size={32} />
                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Breathing Exercise</h2>
                </div>
                <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
                    4-4-4-2 Pattern • {cycles} Cycles Completed
                </p>
            </div>

            {/* Breathing Circle */}
            <div className="relative w-80 h-80 mb-12">
                {/* Outer Rings */}
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-white/10"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    />
                ))}

                {/* Main Circle */}
                <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl flex items-center justify-center`}
                    animate={{
                        scale: getCircleScale(),
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="text-center">
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black text-white uppercase tracking-tighter mb-2"
                        >
                            {phaseMessages[phase]}
                        </motion.div>
                        <motion.div
                            className="text-6xl font-black text-white"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                            }}
                        >
                            {phaseDurations[phase] - count}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsActive(!isActive)}
                    className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest flex items-center gap-3 shadow-xl"
                >
                    {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    {isActive ? 'Pause' : 'Start'}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={reset}
                    className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all"
                >
                    <RotateCcw size={20} />
                    Reset
                </motion.button>
            </div>

            {/* Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 rounded-[24px] bg-white/[0.03] border border-white/10 max-w-md"
            >
                <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-3">How it works</h3>
                <ul className="space-y-2 text-white/60 text-sm">
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Inhale deeply for 4 seconds</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>Hold your breath for 4 seconds</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span>Exhale slowly for 4 seconds</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span>Rest for 2 seconds</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}
