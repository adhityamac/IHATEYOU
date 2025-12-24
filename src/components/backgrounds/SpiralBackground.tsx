'use client';

import { motion } from 'framer-motion';

export default function SpiralBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black flex items-center justify-center perspective-1000">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute border border-white/10 rounded-full"
                    style={{
                        width: `${(i + 1) * 50}px`,
                        height: `${(i + 1) * 50}px`,
                        borderTopColor: `rgba(255, 255, 255, ${0.05 + (i / 80)})`,
                        borderRightColor: 'transparent',
                        borderBottomColor: `rgba(255, 255, 255, ${0.05 + (i / 80)})`,
                        borderLeftColor: 'transparent',
                    }}
                    animate={{
                        rotate: i % 2 === 0 ? 360 : -360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 25 + i,
                            repeat: Infinity,
                            ease: "linear",
                        },
                        scale: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1
                        }
                    }}
                />
            ))}
        </div>
    );
}