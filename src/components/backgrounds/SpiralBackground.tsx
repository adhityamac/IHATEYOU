'use client';

import { motion } from 'framer-motion';

export default function SpiralBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden bg-black -z-10">
            <div className="absolute inset-0 opacity-30">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 border-[1px] border-white/20 rounded-full"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
