'use client';

import { useState, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid'; // Import nanoid for unique IDs
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';

export default function InteractiveGrid() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const lastUpdateTime = useRef(0);

    const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        // Throttle to 60fps max
        const now = Date.now();
        if (now - lastUpdateTime.current < 16) return;
        lastUpdateTime.current = now;

        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }, [mouseX, mouseY]);

    return (
        <div
            className="fixed inset-0 z-0 bg-[#030303] overflow-hidden will-change-transform"
            onMouseMove={handleMouseMove}
        >
            {/* Deep Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-fuchsia-950/20" />

            {/* Floating Orbs for depth - optimized */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Base Grid (Subtle) */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"
            />

            {/* Interactive Glowing Grid (Revealed on Hover) */}
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(to_right,#a855f7_0.5px,transparent_0.5px),linear-gradient(to_bottom,#a855f7_0.5px,transparent_0.5px)] bg-[size:60px_60px] mix-blend-screen"
                style={{
                    maskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    WebkitMaskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                }}
            />
        </div>
    );
}
