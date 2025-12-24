'use client';

import { motion } from 'framer-motion';

// A curated list of emojis matching the vibe in the screenshot (objects, animals, minimal)
const EMOJI_GRID = [
    '⚡', '🔥', '💿', '🕹️', '🧸', '🎈', '🎀', '🎁',
    '🪄', '🦄', '🪩', '🎨', '🦺', '👖', '🧶', '🧤',
    '🧢', '🎩', '🎓', '⛑️', '🥽', '🐶', '🐱', '🐭',
    '🐹', '🐰', '🦊', '🐻', '🦁', '🐮', '🐷', '🐽',
    '🐸', '🐵', '🙈', '🙊', '🐦', '🐤', '🦅', '🦉',
    '🦇', '🐺', '🐗', '🐴', '🦋', '🐌', '🐞', '🐜',
    '🕷️', '🦂', '🦟', '🦠', '🦑', '🦖', '🦞', '🦀',
    '🐡', '🐠', '🐟', '🐬', '🐅', '🐆', '🦓', '🦍'
];

export default function EmojiDoodleBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Container */}
            <div className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 gap-8 md:gap-12 p-8 opacity-20 pointer-events-none select-none">
                {EMOJI_GRID.map((emoji, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02, duration: 0.5 }}
                        className="flex items-center justify-center text-3xl md:text-4xl grayscale brightness-150 contrast-125"
                    >
                        {emoji}
                    </motion.div>
                ))}
                {/* Repeat the grid to fill screen if needed */}
                {EMOJI_GRID.map((emoji, index) => (
                    <motion.div
                        key={`repeat-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (index + 64) * 0.02, duration: 0.5 }}
                        className="flex items-center justify-center text-3xl md:text-4xl grayscale brightness-150 contrast-125 hidden md:flex"
                    >
                        {emoji}
                    </motion.div>
                ))}
            </div>

            {/* Vignette Overlay for focus */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/50 to-[#050505] pointer-events-none" />
        </div>
    );
}
