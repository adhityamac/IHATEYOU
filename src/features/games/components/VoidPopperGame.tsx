'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Zap, Bomb, Shield, Skull } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- Types ---
type BubbleType = 'NORMAL' | 'SPEED' | 'ARMORED' | 'NUKE' | 'BOSS';

interface Bubble {
  id: number;
  text: string;
  x: number;
  y: number;
  type: BubbleType;
  hp: number;
  speed: number;
}

const THOUGHTS = ['Doubt', 'Fear', 'Worry', 'Anxiety', 'Insecurity', 'Panic', 'Stress', 'Gloom'];

export default function VoidPopperGame({ onBack }: { onBack: () => void }) {
  return (
    <GameShell title="Void Popper" icon="💥" color="#c026d3" onClose={onBack}>
      {(gameCtx) => <VoidBoard gameCtx={gameCtx} />}
    </GameShell>
  );
}

function VoidBoard({ gameCtx }: { gameCtx: GameContextType }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [wave, setWave] = useState(1);
  const [nextId, setNextId] = useState(0);

  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef(0);

  // Sync Reset
  useEffect(() => {
    if (gameCtx.gameState === 'PLAYING' && wave === 1 && bubbles.length === 0 && gameCtx.score === 0) {
      setBubbles([]);
      setWave(1);
    }
  }, [gameCtx.gameState, gameCtx.score]);


  // --- Game Loop (RAF based for smooth movement) ---
  const gameLoop = (time: number) => {
    if (gameCtx.gameState !== 'PLAYING') return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // 1. Spawn Logic
    spawnTimerRef.current += deltaTime;
    const spawnRate = Math.max(500, 2000 - (wave * 100)); // Faster spawns per wave

    if (spawnTimerRef.current > spawnRate) {
      spawnBubble();
      spawnTimerRef.current = 0;
    }

    // 2. Move Bubbles
    setBubbles(prev => {
      const nextBubbles = prev.map(b => ({
        ...b,
        y: b.y + (b.speed * (deltaTime / 16)) // pixels per frame normalized
      }));

      // 3. Check Game Over (Bottom reach)
      const hitBottom = nextBubbles.find(b => b.y > 550); // Assumed height
      if (hitBottom) {
        gameCtx.endGame(false, gameCtx.score);
        return nextBubbles;
      }

      return nextBubbles;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (gameCtx.gameState === 'PLAYING') {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameCtx.gameState, wave]);


  // --- Spawning Logic ---
  const spawnBubble = () => {
    const typeRoll = Math.random();
    let type: BubbleType = 'NORMAL';
    let hp = 1;
    let speed = 0.5 + (wave * 0.1);

    if (wave > 2 && typeRoll > 0.8) { type = 'SPEED'; speed *= 1.5; }
    if (wave > 3 && typeRoll > 0.9 && typeRoll < 0.95) { type = 'ARMORED'; hp = 3; speed *= 0.8; }
    if (wave > 4 && typeRoll > 0.95) { type = 'NUKE'; hp = 1; speed *= 1.2; }

    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      text: THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)],
      x: Math.random() * 80 + 10, // 10% to 90% width
      y: -50,
      type,
      hp,
      speed
    };

    setBubbles(prev => [...prev, newBubble]);
  };

  // --- Interaction ---
  const hitBubble = (id: number, x: number, y: number) => {
    const bubble = bubbles.find(b => b.id === id);
    if (!bubble) return;

    gameCtx.playSound('click');

    if (bubble.type === 'NUKE') {
      // Chain Reaction: Destroy all bubbles on screen logic
      gameCtx.playSound('pop');
      // visual flash or something
      setBubbles([]); // Screen clear!
      gameCtx.setScore(s => s + 500);
      return;
    }

    if (bubble.hp > 1) {
      // Damage logic
      setBubbles(prev => prev.map(b => b.id === id ? { ...b, hp: b.hp - 1 } : b));
    } else {
      // Destroy
      gameCtx.playSound('pop');
      setBubbles(prev => prev.filter(b => b.id !== id));
      gameCtx.setScore(s => s + 10);

      // Wave Progression
      if (gameCtx.score > wave * 500) {
        setWave(w => w + 1);
        gameCtx.playSound('success'); // Level up sound
      }
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black/50 border-2 border-purple-500/20 rounded-3xl backdrop-blur-sm">

      {/* Background Grid - scrolling effect ideally */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(192,38,211,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(192,38,211,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
        <div className="flex gap-4">
          <div className="bg-purple-900/80 px-4 py-2 rounded-full border border-purple-500/50 flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-purple-300">Wave</span>
            <span className="text-xl font-black text-white">{wave}</span>
          </div>
        </div>
      </div>

      {/* Bubbles */}
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.button
            key={bubble.id}
            layoutId={`bubble-${bubble.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, top: bubble.y, left: `${bubble.x}%` }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0 }} // Managed by RAF loop state updates mainly, but init/exit handled by framer
            style={{ position: 'absolute' }}
            onMouseDown={() => hitBubble(bubble.id, bubble.x, bubble.y)}
            className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        shadow-[0_0_20px_rgba(0,0,0,0.3)] border-2 backdrop-blur-md cursor-crosshair
                        hover:scale-110 active:scale-90 transition-transform select-none
                        ${bubble.type === 'NORMAL' ? 'bg-purple-500/20 border-purple-500 text-white' : ''}
                        ${bubble.type === 'SPEED' ? 'bg-yellow-500/20 border-yellow-500 text-black' : ''}
                        ${bubble.type === 'ARMORED' ? 'bg-slate-700 border-slate-400 text-white' : ''}
                        ${bubble.type === 'NUKE' ? 'bg-red-500/20 border-red-500 text-red-100 animate-pulse' : ''}
                    `}
          >
            {/* Inner content */}
            {bubble.type === 'NUKE' ? <Bomb size={24} /> :
              bubble.type === 'ARMORED' ? <Shield size={24} /> :
                bubble.type === 'SPEED' ? <Zap size={24} /> :
                  <span className="text-[10px] font-bold uppercase truncate max-w-[50px]">{bubble.text}</span>
            }

            {/* HP Indicator for Armored */}
            {bubble.type === 'ARMORED' && <span className="absolute -top-2 -right-2 bg-slate-500 text-xs px-1.5 rounded-full border">{bubble.hp}</span>}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Bottom Danger Zone */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-900/50 to-transparent pointer-events-none flex items-end justify-center pb-2">
        <span className="text-red-500/50 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Critical Zone</span>
      </div>

    </div>
  );
}
