'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Save, Smile, Trash2 } from 'lucide-react';
import { Interactive } from '@/components/ui/Interactive';

interface VentBoxProps {
    onClose: () => void;
}

export default function VentBox({ onClose }: VentBoxProps) {
    const [text, setText] = useState('');
    const [mood, setMood] = useState<string | null>(null);
    const [released, setReleased] = useState(false);

    const handleRelease = () => {
        if (!text.trim()) return;
        setReleased(true);
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg bg-[#1a1a1c] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <AnimatePresence mode="wait">
                    {!released ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-serif text-white mb-2 flex items-center gap-2">
                                <span className="text-2xl">💌</span> Vent Box
                            </h2>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-6">
                                No judgment. Type anything. Release it.
                            </p>

                            {/* Text Area */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="What's weighing on you?"
                                    className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none resize-none relative z-10 font-serif text-lg leading-relaxed custom-scrollbar"
                                    autoFocus
                                />
                            </div>

                            {/* Mood Selector (Optional) */}
                            <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {['😤', '😢', '😐', '🙂', '😴'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${mood === m ? 'bg-white/20 scale-110' : 'bg-white/5 hover:bg-white/10'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex gap-4">
                                <Interactive className="flex-1">
                                    <button
                                        onClick={handleRelease}
                                        disabled={!text.trim()}
                                        className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                                    >
                                        <Flame size={16} className="group-hover:animate-pulse" />
                                        Release (Burn)
                                    </button>
                                </Interactive>

                                <Interactive className="flex-1">
                                    <button
                                        disabled={!text.trim()}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                                    >
                                        <Save size={16} />
                                        Keep It
                                    </button>
                                </Interactive>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="released"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 relative">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.8, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                                />
                                <Flame size={32} className="text-red-400" />
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-2">Released.</h3>
                            <p className="text-white/40 text-sm">Your words have dissolved into the void.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
