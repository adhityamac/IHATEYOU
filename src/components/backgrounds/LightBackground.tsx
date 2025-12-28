'use client';

import { motion } from 'framer-motion';

export default function LightBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Soft gradient orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/40 to-orange-200/40 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/30 to-teal-200/30 rounded-full blur-3xl"
            />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
        </div>
    );
}
