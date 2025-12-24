'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface NeuralAuraProps {
    recentEmotions: any[]; // Array of emotion objects
    size?: number;
    className?: string;
    onArchetypeDetected?: (archetype: string) => void;
}

export default function NeuralAura({ recentEmotions, size = 100, className = "", onArchetypeDetected }: NeuralAuraProps) {
    // Stable random durations for particles
    const particleDurations = useMemo(() => {
        // Use a seeded pseudo-random generator for SSR safety
        const arr = [];
        let seed = 20251223;
        function seededRandom() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }
        for (let i = 0; i < 6; i++) {
            arr.push(3 + seededRandom() * 2);
        }
        return arr;
    }, []);

    // Generate a procedural shape and Archetype based on the dominant emotions
    const identity = useMemo(() => {
        if (!recentEmotions || recentEmotions.length === 0) {
            return { color: '#ffffff22', borderRadius: '50%', scale: 1, duration: 10, archetype: 'The Silent Void' };
        }

        const colors = recentEmotions.map(e => e.color);
        const primaryColor = colors[0];

        const activeCount = recentEmotions.filter(e => ['joyful', 'angry', 'anxious', 'excited', 'brave'].includes(e.id)).length;
        const ratio = activeCount / recentEmotions.length;

        // Archetype Detection Logic
        let archetype = 'The Balanced Observer';
        if (ratio > 0.8) archetype = 'The Radiant Engine';
        else if (ratio < 0.2) archetype = 'The Still Shadow';
        else if (recentEmotions.some(e => ['joyful', 'loved'].includes(e.id))) archetype = 'The Heart Anchor';
        else if (recentEmotions.some(e => ['anxious', 'overthinking'].includes(e.id))) archetype = 'The Glass Storm';

        if (onArchetypeDetected) onArchetypeDetected(archetype);

        return {
            color: primaryColor,
            borderRadius: ratio > 0.6 ? "40% 60% 70% 30% / 40% 50% 60% 70%" : "60% 40% 30% 70% / 60% 30% 70% 40%",
            scale: 1.2 + (ratio * 0.4),
            duration: 9 - (ratio * 5),
            archetype: archetype
        };
    }, [recentEmotions, onArchetypeDetected]);

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* Outer Frequency Layer - Subtle environmental glow */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        identity.borderRadius,
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    scale: [1, identity.scale * 1.1, 0.9, 1],
                    rotate: [0, 120, 240, 360],
                    opacity: [0.05, 0.2, 0.05]
                }}
                transition={{ duration: identity.duration * 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset--8 blur-3xl"
                style={{ backgroundColor: identity.color }}
            />

            {/* Core Resonance Layer - The main morphing shape */}
            <motion.div
                animate={{
                    borderRadius: [
                        identity.borderRadius,
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        identity.borderRadius
                    ],
                    scale: [1, identity.scale, 0.95, 1],
                    rotate: [0, -90, -180, -270, -360],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: identity.duration, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 blur-2xl"
                style={{ backgroundColor: identity.color }}
            />

            {/* Inner Pulsating Heart - Represents current 'Now' state */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-4 rounded-full blur-xl"
                style={{ backgroundColor: identity.color }}
            />

            {/* Particle 'Specks' - Representing historical echoes */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [Math.cos(i) * 40, Math.cos(i + 2) * 60, Math.cos(i) * 40],
                        y: [Math.sin(i) * 40, Math.sin(i + 2) * 60, Math.sin(i) * 40],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={useMemo(() => ({
                        duration: particleDurations[i],
                        repeat: Infinity,
                        delay: i * 0.5
                    }), [i])}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: identity.color, filter: 'blur(1px)' }}
                />
            ))}
        </div>
    );
}
