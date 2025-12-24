'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid'; // Import nanoid for unique IDs
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';

export default function InteractiveGrid() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [ripples, setRipples] = useState<{ id: string; x: number; y: number }[]>([]);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    function handleClick(e: React.MouseEvent) {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setRipples(prev => [...prev, { id: nanoid(), x, y }]);
    }

    return (
        <div
            className="fixed inset-0 z-0 bg-[#030303] overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            {/* Deep Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-black to-fuchsia-950/40" />

            {/* Floating Orbs for depth */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Base Grid (Subtle) */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"
            />

            {/* Interactive Glowing Grid (Revealed on Hover) */}
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(to_right,#a855f7_1px,transparent_1px),linear-gradient(to_bottom,#a855f7_1px,transparent_1px)] bg-[size:60px_60px] mix-blend-plus-lighter"
                style={{
                    maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                }}
            />

            {/* Click Ripples */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ width: 0, height: 0, opacity: 0.8 }}
                        animate={{ width: 1000, height: 1000, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute rounded-full border border-purple-500/30 bg-purple-500/5 pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            x: "-50%",
                            y: "-50%"
                        }}
                        onAnimationComplete={() => {
                            setRipples(prev => prev.filter(r => r.id !== ripple.id));
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}