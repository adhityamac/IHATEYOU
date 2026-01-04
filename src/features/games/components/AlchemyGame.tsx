'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EMOTIONS = {
  joy: { emoji: '😊', color: 'yellow' },
  sadness: { emoji: '😢', color: 'blue' },
  anger: { emoji: '😠', color: 'red' },
  surprise: { emoji: '😲', color: 'purple' },
};

const COMBINATIONS: { [key: string]: { [key:string]: {name: string, emoji: string} } } = {
  joy: {
    sadness: { name: 'Bittersweet', emoji: '🥲' },
    anger: { name: 'Passion', emoji: '😍' },
    surprise: { name: 'Awe', emoji: '🤩' },
  },
  sadness: {
    joy: { name: 'Bittersweet', emoji: '🥲' },
    anger: { name: 'Resentment', emoji: '😒' },
    surprise: { name: 'Disappointment', emoji: '😟' },
  },
  anger: {
    joy: { name: 'Passion', emoji: '😍' },
    sadness: { name: 'Resentment', emoji: '😒' },
    surprise: { name: 'Outrage', emoji: '😡' },
  },
  surprise: {
    joy: { name: 'Awe', emoji: '🤩' },
    sadness: { name: 'Disappointment', emoji: '😟' },
    anger: { name: 'Outrage', emoji: '😡' },
  },
};

export default function AlchemyGame() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{name: string, emoji: string} | null>(null);

  const selectEmotion = (emotion: string) => {
    if (selected.includes(emotion)) {
      setSelected(selected.filter((e) => e !== emotion));
      return;
    }

    if (selected.length < 2) {
      const newSelected = [...selected, emotion];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const [first, second] = newSelected;
        const combination = COMBINATIONS[first]?.[second];
        if (combination) {
          setResult(combination);
        }
      }
    }
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold text-white">Mix Emotions</h2>
      <div className="flex gap-4">
        {Object.entries(EMOTIONS).map(([name, { emoji, color }]) => (
          <motion.button
            key={name}
            onClick={() => selectEmotion(name)}
            animate={{
              scale: selected.includes(name) ? 1.2 : 1,
              borderColor: selected.includes(name) ? `rgba(var(--${color}-500), 1)` : 'rgba(255, 255, 255, 0.1)',
            }}
            className="w-24 h-24 rounded-full border-2 flex items-center justify-center text-4xl"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <div className="h-24 flex items-center justify-center">
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-white">You&apos;ve created:</p>
              <p className="text-4xl">{result.emoji}</p>
              <p className="text-white">{result.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button onClick={reset} className="flex items-center gap-2 text-white/60 hover:text-white">
        <Sparkles size={16} />
        Reset
      </button>
    </div>
  );
}
