'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypewriterProps {
    text: string;
    className?: string;
    delay?: number;
    speed?: number;
    justify?: 'start' | 'center' | 'end';
}

export default function Typewriter({ text, className = "", delay = 0, speed = 0.05, justify = "center" }: TypewriterProps) {
    const characters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: speed, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 10,
        },
    };

    return (
        <motion.div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: justify }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {characters.map((char, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.div>
    );
}