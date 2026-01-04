'use client';

import { motion } from 'framer-motion';

interface EmojiReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

const quickReactions = ['❤️', '😂', '😮', '😢', '👍', '🔥', '🎉', '💯'];

export default function EmojiReactionPicker({ onSelect, onClose }: EmojiReactionPickerProps) {
    const handleReact = (emoji: string) => {
        onSelect(emoji);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 blur-bg border border-[var(--border-primary)] rounded-full px-3 py-2 shadow-lg z-10"
        >
            <div className="flex gap-2">
                {quickReactions.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => handleReact(emoji)}
                        className="text-2xl hover:scale-125 transition-transform"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
