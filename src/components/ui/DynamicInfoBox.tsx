'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Zap, Shield, Heart } from 'lucide-react';

const INFO_ITEMS = [
    {
        id: 'active',
        icon: Users,
        label: 'Active Souls',
        value: '1,284',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10'
    },
    {
        id: 'resonance',
        icon: Zap,
        label: 'Global Resonance',
        value: '84%',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10'
    },
    {
        id: 'safety',
        icon: Shield,
        label: 'Matrix Status',
        value: 'Stable',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'hearts',
        icon: Heart,
        label: 'Deep Echoes',
        value: '12K',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10'
    }
];

export default function DynamicInfoBox() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % INFO_ITEMS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const CurrentItem = INFO_ITEMS[index];
    const Icon = CurrentItem.icon;

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIndex((prev) => (prev + 1) % INFO_ITEMS.length)}
            className="cursor-pointer select-none"
        >
            <div className="relative group p-[1px] rounded-2xl bg-white/10 overflow-hidden shadow-xl transition-all duration-300 hover:bg-white/20">
                {/* Animated border light */}
                <motion.div
                    animate={{
                        left: ['0%', '100%', '0%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent -translate-x-1/2 blur-sm"
                />

                <div className="relative bg-[#09090b]/60 backdrop-blur-3xl px-4 py-2.5 rounded-[15px] flex items-center gap-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={CurrentItem.id}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className={`w-6 h-6 rounded-lg ${CurrentItem.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-3 h-3 ${CurrentItem.color}`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-sm font-black italic text-white leading-none">
                                    {CurrentItem.value}
                                </div>
                                <div className="text-[7px] text-white/30 uppercase tracking-[0.1em] font-black leading-none pt-0.5">
                                    {CurrentItem.label}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-1 pr-2">
                        {INFO_ITEMS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-all duration-500 ${i === index ? 'w-2.5 bg-purple-500' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Notification Dot */}
                    <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
