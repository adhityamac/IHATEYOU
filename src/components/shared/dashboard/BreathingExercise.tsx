import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw } from 'lucide-react';

interface BreathingExerciseProps {
    onClose: () => void;
}

export default function BreathingExercise({ onClose }: BreathingExerciseProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [timeLeft, setTimeLeft] = useState(4);
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Change phase
                        if (phase === 'inhale') {
                            setPhase('hold');
                            return 4;
                        } else if (phase === 'hold') {
                            setPhase('exhale');
                            return 4;
                        } else {
                            // End of cycle
                            setPhase('inhale');
                            setCycles(c => c + 1);
                            return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, phase]);

    // Cleanup when closing
    useEffect(() => {
        return () => setIsActive(false);
    }, []);

    const getInstruction = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe Out...';
        }
    };

    const getScale = () => {
        const progress = (4 - timeLeft) / 4; // 0 to 1
        switch (phase) {
            case 'inhale': return 1 + (progress * 0.5); // 1.0 -> 1.5
            case 'hold': return 1.5;
            case 'exhale': return 1.5 - (progress * 0.5); // 1.5 -> 1.0
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#2a2a2c] text-white p-8 rounded-[40px] max-w-md w-full relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[500px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-3xl font-serif font-medium mb-8">Box Breathing</h2>

                {/* Animation Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    {/* Outer Rings */}
                    <motion.div
                        animate={{
                            scale: getScale(),
                            opacity: phase === 'hold' ? 0.8 : 0.5
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="absolute w-full h-full rounded-full border border-white/20"
                    />
                    <motion.div
                        animate={{
                            scale: getScale() * 0.8,
                            opacity: phase === 'hold' ? 0.6 : 0.4
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="absolute w-full h-full rounded-full border border-white/20"
                    />

                    {/* Core Circle */}
                    <motion.div
                        animate={{ scale: getScale() }}
                        transition={{ duration: 1, ease: "linear" }}
                        className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-colors duration-500
                            ${phase === 'inhale' ? 'bg-cyan-500/20' : phase === 'hold' ? 'bg-purple-500/20' : 'bg-emerald-500/20'}
                        `}
                    >
                        <span className="text-4xl font-bold font-sans">{timeLeft}</span>
                    </motion.div>
                </div>

                <div className="text-center space-y-2 mb-8 h-16">
                    <p className="text-2xl font-light tracking-wide transition-all duration-300">
                        {isActive ? getInstruction() : "Ready?"}
                    </p>
                    <p className="text-sm text-white/40 uppercase tracking-widest">
                        {isActive ? `Cycle ${cycles + 1}` : "Relax and focus"}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (!isActive) {
                                setIsActive(true);
                                setPhase('inhale'); // Restart phase
                                setTimeLeft(4);
                            } else {
                                setIsActive(false);
                            }
                        }}
                        className={`px-8 py-3 rounded-full flex items-center gap-2 font-medium transition-all ${isActive ? 'bg-white/10 hover:bg-white/20' : 'bg-white text-black hover:bg-white/90'
                            }`}
                    >
                        {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
                    </button>
                    {!isActive && cycles > 0 && (
                        <button
                            onClick={() => {
                                setCycles(0);
                                setTimeLeft(4);
                                setPhase('inhale');
                            }}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <RefreshCw size={18} />
                        </button>
                    )}
                </div>

            </motion.div>
        </motion.div>
    );
}
