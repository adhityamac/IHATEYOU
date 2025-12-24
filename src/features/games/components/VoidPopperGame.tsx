'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const THOUGHTS = ['Doubt', 'Fear', 'Worry', 'Anxiety', 'Insecurity'];

export default function VoidPopperGame() {
  const [thoughts, setThoughts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const gameInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    gameInterval.current = setInterval(() => {
      setThoughts((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)],
          x: Math.random() * 80 + 10,
          y: -10,
        },
      ]);
    }, 1000);

    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, []);

  const popThought = (id: number) => {
    setThoughts((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold text-white">Void Popper</h2>
      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
        {thoughts.map((thought) => (
          <motion.div
            key={thought.id}
            initial={{ y: thought.y }}
            animate={{ y: 400 }}
            transition={{ duration: 5, ease: 'linear' }}
            onAnimationComplete={() => popThought(thought.id)}
            style={{ left: `${thought.x}%`, position: 'absolute' }}
          >
            <button
              onClick={() => popThought(thought.id)}
              className="px-4 py-2 bg-purple-600 text-white rounded-full"
            >
              {thought.text}
            </button>
          </motion.div>
        ))}
      </div>
      <p className="text-white">Score: {score}</p>
    </div>
  );
}
