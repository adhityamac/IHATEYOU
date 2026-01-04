'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function FocusTimer() {
    const [timer, setTimer] = useState(25 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const toggleTimer = () => setIsTimerActive(!isTimerActive);
    const resetTimer = () => {
        setIsTimerActive(false);
        setTimer(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
                        <Clock size={20} />
                    </div>
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Focus Mode</h3>
                </div>
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest max-w-md">
                    Align your frequency. 25 minutes of deep work.
                </p>
            </div>

            <div className="flex items-center gap-8 relative z-10">
                <div className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums">
                    {formatTime(timer)}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={toggleTimer}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isTimerActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:scale-105'}`}
                    >
                        {isTimerActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white/40 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}