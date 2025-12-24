'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Heart, Copy, Check } from 'lucide-react';
import { useSignals } from '@/hooks/useSignals';

const AFFIRMATIONS = [
    { text: "You are worthy of love and respect.", category: "self-love" },
    { text: "Your feelings are valid and important.", category: "validation" },
    { text: "You have the strength to overcome challenges.", category: "strength" },
    { text: "It's okay to take things one step at a time.", category: "patience" },
    { text: "You deserve peace and happiness.", category: "self-love" },
    { text: "Your presence makes a difference.", category: "impact" },
    { text: "You are enough, exactly as you are.", category: "self-acceptance" },
    { text: "It's okay to ask for help when you need it.", category: "vulnerability" },
    { text: "You are growing and evolving every day.", category: "growth" },
    { text: "Your journey is unique and valuable.", category: "validation" },
    { text: "You have permission to rest and recharge.", category: "self-care" },
    { text: "You are capable of amazing things.", category: "confidence" },
    { text: "Your emotions don't define you.", category: "awareness" },
    { text: "You are creating your own path.", category: "empowerment" },
    { text: "It's okay to not be okay sometimes.", category: "acceptance" },
    { text: "You are loved, even when you don't feel it.", category: "love" },
    { text: "Your story matters.", category: "validation" },
    { text: "You have survived 100% of your worst days.", category: "resilience" },
    { text: "You are allowed to change your mind.", category: "freedom" },
    { text: "Your best is always good enough.", category: "self-compassion" },
];

export default function DailyAffirmations() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const { trackInteraction, trackTool } = useSignals('user-1');

    useEffect(() => {
        // Get daily affirmation based on date
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('affirmation_date');
        const savedIndex = localStorage.getItem('affirmation_index');

        if (savedDate === today && savedIndex) {
            setCurrentIndex(parseInt(savedIndex));
        } else {
            const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
            setCurrentIndex(randomIndex);
            localStorage.setItem('affirmation_date', today);
            localStorage.setItem('affirmation_index', randomIndex.toString());
        }
    }, []);

    const currentAffirmation = AFFIRMATIONS[currentIndex];

    const getNewAffirmation = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
        } while (newIndex === currentIndex);

        setCurrentIndex(newIndex);
        setLiked(false);
        setCopied(false);
        trackTool('affirmation_refresh', 0);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentAffirmation.text);
        setCopied(true);
        trackInteraction('affirmation_copy', 0);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="text-yellow-400" size={32} />
                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Daily Affirmation</h2>
                </div>
                <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
                    A gentle reminder for you today
                </p>
            </div>

            {/* Affirmation Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    transition={{ duration: 0.5 }}
                    className="relative p-12 rounded-[56px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-xl shadow-3xl overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 p-40 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-40 bg-pink-500/20 blur-[120px] rounded-full pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Category Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
                        >
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
                                {currentAffirmation.category}
                            </span>
                        </motion.div>

                        {/* Affirmation Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black italic text-white leading-tight mb-8"
                        >
                            "{currentAffirmation.text}"
                        </motion.p>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setLiked(!liked);
                                    if (!liked) trackInteraction('affirmation_like', 0);
                                }}
                                className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-sm transition-all ${liked
                                    ? 'bg-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.5)]'
                                    : 'bg-white/10 border border-white/20 text-white/60 hover:bg-white/20'
                                    }`}
                            >
                                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                                {liked ? 'Loved' : 'Love this'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 font-black uppercase tracking-widest text-sm flex items-center gap-2 transition-all"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, rotate: 180 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={getNewAffirmation}
                                className="px-6 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm flex items-center gap-2 shadow-xl transition-all"
                            >
                                <RefreshCw size={18} />
                                New
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 rounded-[24px] bg-white/[0.03] border border-white/10 text-center"
            >
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                    Take a moment to breathe and let this affirmation sink in.
                    You can come back to this anytime you need a reminder of your worth.
                </p>
            </motion.div>
        </div>
    );
}
