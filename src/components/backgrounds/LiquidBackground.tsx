'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function LiquidBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const lastUpdateTime = useRef(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Create different movement factors for parallax effect
    const x1 = useTransform(springX, [-1, 1], [-40, 40]);
    const y1 = useTransform(springY, [-1, 1], [-40, 40]);

    const x2 = useTransform(springX, [-1, 1], [30, -30]);
    const y2 = useTransform(springY, [-1, 1], [30, -30]);

    const x3 = useTransform(springX, [-1, 1], [-20, 20]);
    const y3 = useTransform(springY, [-1, 1], [-20, 20]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Throttle to 60fps max (16ms)
            const now = Date.now();
            if (now - lastUpdateTime.current < 16) return;
            lastUpdateTime.current = now;

            const { innerWidth, innerHeight } = window;
            // Normalize mouse position between -1 and 1
            const x = (e.clientX / innerWidth) * 2 - 1;
            const y = (e.clientY / innerHeight) * 2 - 1;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)] opacity-60">
            <motion.div
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%]"
                style={{ x: x1, y: y1 }}
            >
                <motion.div
                    className="w-full h-full rounded-full mix-blend-multiply filter blur-[80px] opacity-50"
                    style={{ background: 'radial-gradient(circle, var(--accent-primary), transparent)' }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </motion.div>

            <motion.div
                className="absolute top-[20%] -right-[10%] w-[60%] h-[60%]"
                style={{ x: x2, y: y2 }}
            >
                <motion.div
                    className="w-full h-full rounded-full mix-blend-multiply filter blur-[80px] opacity-50"
                    style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </motion.div>

            <motion.div
                className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%]"
                style={{ x: x3, y: y3 }}
            >
                <motion.div
                    className="w-full h-full rounded-full mix-blend-multiply filter blur-[80px] opacity-50"
                    style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </motion.div>
            <div className="absolute inset-0 bg-[var(--bg-primary)]/40" />
        </div>
    );
}
