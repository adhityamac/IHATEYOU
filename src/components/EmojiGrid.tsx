'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Exact emojis from the user's reference image
const EMOJIS = [
    '⚡', '🔥', '💿', '🕹️', '🧸', '🎈', '🎀', '🎁', '🪄', '🦄', '🪩', '🎨',
    '🦺', '👖', '🧶', '🧤', '🧢', '🎩', '🎓', '⛑️', '🥽', '🐶', '🐱', '🐭',
    '🐹', '🐰', '🦊', '🐻', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙊',
    '🐦', '🐤', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦋', '🐌', '🐞', '🐜',
    '🕷️', '🦂', '🦟', '🦠', '🦑', '🦖', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬',
    '🐅', '🐆', '🦓', '🦍', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🐃', '🐂', '🦘', '🐊'
];

export default function EmojiGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Liquid hover effect logic
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const emojis = container.querySelectorAll('.emoji-item');
            emojis.forEach(emoji => {
                const rect = emoji.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                // Calculate distance from mouse to emoji center
                const dx = e.clientX - x;
                const dy = e.clientY - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const hoverRadius = 120; // Slightly larger radius

                if (distance < hoverRadius) {
                    // Calculate angle for rotation
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    const scale = 1 + (1 - distance / hoverRadius) * 0.6;

                    Object.assign((emoji as HTMLElement).style, {
                        transform: `scale(${scale}) rotate(${angle}deg)`,
                        filter: 'brightness(1.5) drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                        zIndex: '10'
                    });
                } else {
                    // Reset
                    Object.assign((emoji as HTMLElement).style, {
                        transform: 'scale(1) rotate(0deg)',
                        filter: 'grayscale(0.5) brightness(0.8)',
                        zIndex: '1'
                    });
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center bg-transparent"
        >
            {/* Adjusted Grid Container to fit screen better */}
            <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                <div className="grid grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-8 md:gap-10 place-items-center">
                    {EMOJIS.slice(0, 72).map((emoji, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.005 }}
                            className="emoji-item flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 ease-out will-change-transform cursor-crosshair"
                            style={{
                                filter: 'grayscale(0.5) brightness(0.8)',
                            } as React.CSSProperties}
                        >
                            {emoji}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
