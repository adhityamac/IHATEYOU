'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, HelpCircle, Users, Zap, CheckCircle, XCircle, Clock, Star, Trophy, Rocket } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- Data ---
const QUESTIONS = [
  { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Golgi'], a: 'Mitochondrion', difficulty: 1 },
  { q: 'Which neurotransmitter is associated with pleasure?', options: ['Dopamine', 'Serotonin', 'Cortisol', 'Adrenaline'], a: 'Dopamine', difficulty: 1 },
  { q: 'What is the speed of light approx?', options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', 'Instant'], a: '300,000 km/s', difficulty: 2 },
  { q: 'Who proposed the Theory of Relativity?', options: ['Newton', 'Tesla', 'Einstein', 'Hawking'], a: 'Einstein', difficulty: 2 },
  { q: 'What is the main function of the frontal lobe?', options: ['Vision', 'Balance', 'Decision Making', 'Breathing'], a: 'Decision Making', difficulty: 3 },
  { q: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], a: 'Skin', difficulty: 3 },
  { q: 'Which element has the chemical symbol "Au"?', options: ['Silver', 'Gold', 'Aluminum', 'Argon'], a: 'Gold', difficulty: 4 },
  { q: 'What is the concept of "Flow" in psychology?', options: ['Deep Sleep', 'Optimal Experience', 'Panic State', 'Meditation'], a: 'Optimal Experience', difficulty: 5 },
  { q: 'What is the hottest planet in the solar system?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], a: 'Venus', difficulty: 3 },
  { q: 'Which year did the first human land on the moon?', options: ['1965', '1969', '1972', '1959'], a: '1969', difficulty: 4 },
];

export default function TriviaGame({ onBack }: { onBack: () => void }) {
  return (
    <GameShell title="Cosmic Trivia" icon="🚀" color="#8b5cf6" onClose={onBack}>
      {(gameCtx) => <TriviaBoard gameCtx={gameCtx} />}
    </GameShell>
  );
}

function TriviaBoard({ gameCtx }: { gameCtx: GameContextType }) {
  const [qIndex, setQIndex] = useState(0);
  const [lifelines, setLifelines] = useState({ fifty: true, ask: true });
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const question = QUESTIONS[qIndex];

  // Reset Game
  useEffect(() => {
    if (gameCtx.gameState === 'PLAYING' && qIndex === 0 && gameCtx.score === 0) {
      setLifelines({ fifty: true, ask: true });
      resetRound();
      setStreak(0);
    }
  }, [gameCtx.gameState, gameCtx.score]); // Dependencies simplified to avoid infinite loops

  // Timer Logic
  useEffect(() => {
    if (gameCtx.gameState === 'PLAYING' && !selectedOption && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleTimeOut();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [qIndex, selectedOption, gameCtx.gameState]);

  const resetRound = () => {
    setDisabledOptions([]);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(15);
  };

  const handleTimeOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    gameCtx.playSound('error');
    setIsCorrect(false); // Mark as wrong
    setSelectedOption('TIMEOUT'); // Dummy value
    setTimeout(() => {
      gameCtx.endGame(false, gameCtx.score);
    }, 1500);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption || gameCtx.gameState !== 'PLAYING') return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(option);
    gameCtx.playSound('click');

    const correct = option === question.a;
    setIsCorrect(correct);

    if (correct) {
      gameCtx.playSound('success');
      setStreak(s => s + 1);

      // Score Calc: Difficulty * 100 + Time Bonus + Streak Bonus
      const timeBonus = timeLeft * 10;
      const streakBonus = streak * 50;
      const points = (question.difficulty * 100) + timeBonus + streakBonus;

      gameCtx.setScore(s => s + points);

      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      gameCtx.playSound('error');
      setStreak(0);
      setTimeout(() => {
        gameCtx.endGame(false, gameCtx.score);
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(prev => prev + 1);
      resetRound();
    } else {
      gameCtx.endGame(true, gameCtx.score + 1000); // Grand prize
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fifty || selectedOption) return;
    const wrongs = question.options.filter(o => o !== question.a);
    const removed = wrongs.sort(() => Math.random() - 0.5).slice(0, 2);
    setDisabledOptions(removed);
    setLifelines(prev => ({ ...prev, fifty: false }));
    gameCtx.playSound('pop');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-4 relative overflow-hidden">

      {/* Background Warp Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20`} />
        {/* Stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500, scale: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              z: [0, 100] // simulated depth
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full left-1/2 top-1/2"
            style={{ marginLeft: `${Math.random() * 100 - 50}%`, marginTop: `${Math.random() * 100 - 50}%` }}
          />
        ))}

        {/* Warp Streaks on Correct */}
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/20 mix-blend-overlay"
          />
        )}
      </div>

      {/* HUD */}
      <div className="relative z-10 flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Question</span>
            <span className="text-xl font-black text-white">{qIndex + 1} <span className="text-white/40 text-sm">/ {QUESTIONS.length}</span></span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Streak</span>
            <div className="flex items-center gap-1">
              <Zap size={16} className={`${streak > 1 ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
              <span className="text-xl font-black text-white">{streak}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className={`${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-purple-400'}`} />
            <span className={`font-mono text-xl font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 15) * 100}%` }}
              className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-purple-500'}`}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-8 relative z-10">

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="text-center"
          >
            <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              Difficulty Level {question.difficulty}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl drop-shadow-lg">
              {question.q}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {question.options.map((opt) => {
            const isDisabled = disabledOptions.includes(opt);
            const isSelected = selectedOption === opt;
            const isTarget = opt === question.a;

            // Result Logic: Show Correct if we answered wrong, or show our selection
            const showResult = selectedOption !== null;

            let bgClass = "bg-white/5 hover:bg-white/10 border-white/10";
            if (isSelected) bgClass = "bg-yellow-500/20 border-yellow-500 text-yellow-100";

            if (showResult) {
              if (isTarget) bgClass = "bg-green-500 text-black border-green-500 font-bold shadow-[0_0_30px_rgba(34,197,94,0.4)]";
              else if (isSelected && !isTarget) bgClass = "bg-red-500 text-white border-red-500 opacity-50";
              else bgClass = "bg-black/40 opacity-30 border-transparent";
            }

            if (isDisabled) bgClass = "opacity-10 pointer-events-none scale-95 border-transparent";

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selectedOption || isDisabled}
                className={`
                    p-6 rounded-2xl border text-left font-bold text-lg transition-all duration-300
                    flex items-center justify-between group relative overflow-hidden
                    ${bgClass}
                `}
              >
                <span className="relative z-10">{opt}</span>
                {showResult && isTarget && <CheckCircle className="animate-bounce" />}
                {showResult && isSelected && !isTarget && <XCircle className="animate-pulse" />}

                {/* Hover Glow */}
                {!selectedOption && !isDisabled && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lifelines Footer */}
      <div className="mt-8 relative z-10 flex justify-center gap-4">
        <button
          onClick={useFiftyFifty}
          disabled={!lifelines.fifty || !!selectedOption}
          className={`flex flex-col items-center gap-2 group transition-all ${!lifelines.fifty ? 'opacity-30 grayscale' : 'hover:scale-105'}`}
        >
          <div className="w-12 h-12 rounded-full bg-purple-600 border border-purple-400 flex items-center justify-center text-white font-black shadow-lg shadow-purple-900/50 group-hover:shadow-purple-500/50 transition-all">
            50:50
          </div>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Halve It</span>
        </button>

        <button
          disabled={true} // Placeholder
          className="flex flex-col items-center gap-2 opacity-30 grayscale cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center text-white font-black">
            <Eye size={20} />
          </div>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Oracle</span>
        </button>
      </div>

    </div>
  );
}
