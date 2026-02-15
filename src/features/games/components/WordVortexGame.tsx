'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Shuffle, Check, X, Terminal, Keyboard, Zap } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

const WORDS = [
  'ASTRAL', 'COSMIC', 'VOID', 'NEBULA', 'PULSAR', 'QUASAR',
  'ZENITH', 'NADIR', 'ECLIPSE', 'ORBIT', 'GRAVITY', 'LUNAR',
  'SOLAR', 'GALAXY', 'COMET', 'METEOR', 'PROTON', 'ATOM',
  'ENTITY', 'SYSTEM', 'MATRIX', 'CIPHER', 'BINARY', 'VECTOR'
];

export default function WordVortexGame({ onBack }: { onBack: () => void }) {
  return (
    <GameShell title="Word Vortex" icon="🌪️" color="#3b82f6" onClose={onBack}>
      {(gameCtx) => <WordVortexBoard gameCtx={gameCtx} />}
    </GameShell>
  );
}

function WordVortexBoard({ gameCtx }: { gameCtx: GameContextType }) {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState<{ char: string, id: number, solved: boolean }[]>([]);
  const [guess, setGuess] = useState('');
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const setupRound = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);

    // Create scrambled objects
    const chars = word.split('').map((c, i) => ({ char: c, id: i, solved: false }));
    setScrambled(chars.sort(() => Math.random() - 0.5));

    setGuess('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (gameCtx.gameState === 'PLAYING' && !currentWord) {
      setupRound();
    }
  }, [gameCtx.gameState]);

  const handleInput = (val: string) => {
    const upper = val.toUpperCase();

    // Check key feedback
    if (upper.length > guess.length) {
      // Just typed a char
      const char = upper[upper.length - 1];
      // Visual effect: Shoot laser at char?
      // Simpler: Highlight matching scrambled letters
      gameCtx.playSound('click');
    }
    setGuess(upper);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (guess === currentWord) {
      // Correct
      gameCtx.playSound('success');
      gameCtx.setScore(s => s + 100 + (streak * 20));
      setStreak(s => s + 1);
      setupRound();
    } else {
      // Wrong
      gameCtx.playSound('error');
      setStreak(0);
      setGuess('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-4 relative overflow-hidden">

      {/* Matrix Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="absolute top-0 text-blue-500 font-mono text-xs writing-vertical-rl animate-rain" style={{ left: `${i * 10}%`, animationDuration: `${Math.random() * 2 + 2}s` }}>
            {'01010101010101'}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Vortex Container */}
        <div className="relative w-80 h-80 mb-8 flex items-center justify-center ">

          {/* Spinning Rings */}
          <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-8 border border-blue-400/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          {/* Letters */}
          {scrambled.map((item, i) => {
            // Determine status
            const isTyped = guess.includes(item.char) && guess.split(item.char).length - 1 >= scrambled.filter(s => s.char === item.char && s.id <= item.id).length;
            // Complex logic to track duplicates, simplifying:
            // Just check if char is in guess for visual feedback
            const inGuess = guess.includes(item.char);

            return (
              <motion.div
                key={`${currentWord}-${item.id}`}
                layoutId={`char-${item.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: inGuess ? 0 : [0, 10, -10, 0], // Jiggle if matched?
                  backgroundColor: inGuess ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: inGuess ? '#60a5fa' : 'rgba(255, 255, 255, 0.1)'
                }}
                className={`
                            absolute w-12 h-12 border rounded-xl flex items-center justify-center font-black text-2xl shadow-lg backdrop-blur-md transition-colors
                            ${inGuess ? 'text-white shadow-[0_0_15px_#3b82f6]' : 'text-white/50'}
                        `}
                style={{
                  // Orbit placement
                  top: '50%',
                  left: '50%',
                  marginTop: -24,
                  marginLeft: -24,
                  transform: `rotate(${i * (360 / scrambled.length)}deg) translate(${120}px) rotate(-${i * (360 / scrambled.length)}deg)`
                  // Note: Framer Motion 'animate' overrides style transform, so we rely on parent/absolute positioning or manually calc x/y
                  // Let's use simple CSS absolute positions relative to center
                }}
              // Simpler manual orbit:
              // We use a custom variant or just hardcode style x/y in animate if possible.
              // For reliability, let's use standard absolute positioning logic
              >
                {item.char}
              </motion.div>
            );
          })}

          {/* Center "Black Hole" Input Visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-black rounded-full border-4 border-blue-500 flex items-center justify-center shadow-[0_0_50px_#3b82f6] z-20">
              <Terminal size={32} className="text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm relative z-30">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => handleInput(e.target.value)}
              maxLength={currentWord.length + 2} // forgive a bit
              className="w-full bg-black/60 border-2 border-blue-500/50 rounded-full px-8 py-4 text-center text-3xl font-black text-white focus:outline-none focus:border-blue-400 focus:shadow-[0_0_30px_#3b82f6] transition-all uppercase tracking-[0.5em] placeholder-white/10"
              placeholder="DECRYPT"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/50">
              <Keyboard size={20} />
            </div>
          </div>
        </form>

        {/* Streak Indicator */}
        <div className="mt-8 flex gap-8 text-white/40 font-bold uppercase tracking-widest text-xs">
          <div className="flex flex-col items-center">
            <span>Streak</span>
            <span className={`text-xl ${streak > 0 ? 'text-blue-400' : ''}`}>{streak}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>Length</span>
            <span>{currentWord.length}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
