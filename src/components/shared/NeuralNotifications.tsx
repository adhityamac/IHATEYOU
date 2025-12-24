'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Activity, Radio, ShieldCheck } from 'lucide-react';

interface Notification {
    id: string;
    type: 'pulse' | 'system' | 'sync';
    message: string;
    timestamp: number;
}

export default function NeuralNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Simulated 'Neural Pings' from the collective
        const messages = [
            { type: 'pulse', message: 'Someone feels just like you!' },
            { type: 'system', message: 'Connection established' },
            { type: 'sync', message: 'Distant memory found' },
            { type: 'system', message: 'Optimizing experience...' },
            { type: 'pulse', message: 'Found a mood match: Joyful' },
        ];

        const interval = setInterval(() => {
            if (Math.random() > 0.7 && notifications.length < 3) {
                const draft = messages[Math.floor(Math.random() * messages.length)];
                const newNote: Notification = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: draft.type as any,
                    message: draft.message,
                    timestamp: Date.now()
                };
                setNotifications(prev => [newNote, ...prev].slice(0, 3));

                // Auto-clear
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNote.id));
                }, 5000);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [notifications]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'pulse': return <Activity size={12} className="text-rose-500" />;
            case 'system': return <ShieldCheck size={12} className="text-emerald-500" />;
            case 'sync': return <Radio size={12} className="text-blue-500" />;
            default: return <Zap size={12} className="text-white" />;
        }
    };

    return (
        <div className="fixed top-24 right-8 z-[150] flex flex-col gap-3 pointer-events-none w-72">
            <AnimatePresence>
                {notifications.map((note) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
                        className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl shadow-2xl flex items-start gap-4"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            {getIcon(note.type)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em]">
                                {note.type === 'pulse' ? 'User Update' : note.type === 'system' ? 'System Check' : 'Connection'}
                            </div>
                            <div className="text-[10px] text-white/80 font-bold leading-tight uppercase tracking-tight italic">
                                {note.message}
                            </div>
                        </div>

                        {/* Background Scanning Animation */}
                        <motion.div
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
