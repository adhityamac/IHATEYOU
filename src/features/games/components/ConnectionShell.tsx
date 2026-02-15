'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface ConnectionShellProps {
    title: string;
    icon: string;
    onClose: () => void;
    children: ReactNode;
    gradient?: string;
}

export default function ConnectionShell({
    title,
    icon,
    onClose,
    children,
    gradient = 'from-rose-950/80 via-amber-950/60 to-violet-950/80',
}: ConnectionShellProps) {
    return (
        <div className={`relative w-full h-full bg-gradient-to-br ${gradient} overflow-hidden flex flex-col`}>
            {/* Warm ambient glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-500/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Top bar — minimal */}
            <div className="flex items-center justify-between p-4 z-50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span className="font-medium text-white/80 text-sm tracking-wide">{title}</span>
                    </div>
                </div>
                <Heart size={16} className="text-rose-400/40" />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex-1 relative overflow-hidden"
            >
                {children}
            </motion.div>
        </div>
    );
}
