'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

export default function NeuralRipples() {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const addRipple = useCallback((e: MouseEvent | TouchEvent) => {
        const x = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const y = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        const id = Date.now();
        setRipples(prev => [...prev.slice(-5), { id, x, y }]); // Limit to 5 ripples
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 1000);
    }, []);

    // Use useEffect for event listeners to avoid re-rendering parent
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('mousedown', addRipple as any);
            window.addEventListener('touchstart', addRipple as any, { passive: true });
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('mousedown', addRipple as any);
                window.removeEventListener('touchstart', addRipple as any);
            }
        };
    }, [addRipple]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute w-20 h-20 bg-white/10 rounded-full blur-xl"
                        style={{ left: ripple.x - 40, top: ripple.y - 40 }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
