'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WORDS = ['SYNAPSE', 'NEURON', 'ASTRAL', 'COSMIC', 'VOID'];

export default function WordVortexGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const setupWord = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    setScrambledWord(scrambled);
    setGuess('');
    setIsCorrect(null);
  };

  useEffect(() => {
    setupWord();
  }, []);

  const handleGuess = () => {
    if (guess.toUpperCase() === currentWord) {
      setIsCorrect(true);
      setTimeout(setupWord, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold text-white">Word Vortex</h2>
      <div className="text-4xl font-bold tracking-widest text-white">{scrambledWord}</div>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
        className="w-full max-w-xs bg-gray-800 text-white text-center text-xl p-2 rounded"
        placeholder="Your guess"
      />
      <button onClick={handleGuess} className="px-4 py-2 bg-purple-600 text-white rounded-full">
        Guess
      </button>
      {isCorrect === true && <p className="text-green-500">Correct!</p>}
      {isCorrect === false && <p className="text-red-500">Incorrect, try again.</p>}
    </div>
  );
}
