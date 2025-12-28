'use client';

import { motion } from 'framer-motion';

export default function RetroMinimalBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FDFBF7]">
            {/* Minimal Grid Pattern - Teal Accent - Using CSS for performance */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#0d9488 1px, transparent 1px), linear-gradient(90deg, #0d9488 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Muted Orange Accent - Optimized Animation */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[15%] right-[15%] w-[40vh] h-[40vh] rounded-full bg-orange-100/40 mix-blend-multiply"
                style={{ willChange: 'transform' }}
            />

            {/* Muted Teal Accent - Optimized Animation */}
            <motion.div
                animate={{
                    y: [0, 40, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[20%] left-[10%] w-[35vh] h-[35vh] rounded-full bg-teal-100/40 mix-blend-multiply"
                style={{ willChange: 'transform' }}
            />

            {/* Paper/Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
