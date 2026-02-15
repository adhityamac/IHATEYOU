'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import { Sparkles, Atom, BookOpen, Trash2, Search, X, Zap, Flame, Droplets, Wind, Mountain, Star, Sun, Cloud, Skull, Heart } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- DATA: Elemental Logic ---

type ElementType = 'base' | 'complex' | 'master';

interface Element {
  id: string;
  name: string;
  icon: any; // Lucide Icon or Emoji string
  color: string;
  type: ElementType;
  desc: string;
  particles: string;
}

const BASE_ELEMENTS: Element[] = [
  { id: 'fire', name: 'Fire', icon: Flame, color: '#ef4444', type: 'base', desc: 'Burning intensity.', particles: '🔥' },
  { id: 'water', name: 'Water', icon: Droplets, color: '#3b82f6', type: 'base', desc: 'Flowing life.', particles: '💧' },
  { id: 'air', name: 'Air', icon: Wind, color: '#a855f7', type: 'base', desc: 'Invisible force.', particles: '💨' },
  { id: 'earth', name: 'Earth', icon: Mountain, color: '#22c55e', type: 'base', desc: 'Solid foundation.', particles: '🌿' },
];

const RECIPES: Record<string, Record<string, string>> = {
  fire: {
    water: 'steam',
    air: 'energy',
    earth: 'lava',
    fire: 'plasma'
  },
  water: {
    fire: 'steam',
    air: 'rain',
    earth: 'mud',
    water: 'ocean'
  },
  air: {
    fire: 'energy',
    water: 'rain',
    earth: 'dust',
    air: 'storm'
  },
  earth: {
    fire: 'lava',
    water: 'mud',
    air: 'dust',
    earth: 'mountain'
  },
  steam: { air: 'cloud', fire: 'engine' },
  energy: { earth: 'life', air: 'lightning' },
  lava: { water: 'stone' },
  life: { earth: 'human', water: 'fish' }
  // Add more as needed for depth
};

// Discovery Definitions
const DISCOVERIES: Record<string, Element> = {
  steam: { id: 'steam', name: 'Steam', icon: Cloud, color: '#cbd5e1', type: 'complex', desc: 'Hot vapor.', particles: '☁️' },
  energy: { id: 'energy', name: 'Energy', icon: Zap, color: '#eab308', type: 'complex', desc: 'Pure power.', particles: '⚡' },
  lava: { id: 'lava', name: 'Lava', icon: Flame, color: '#c2410c', type: 'complex', desc: 'Molten earth.', particles: '🌋' },
  plasma: { id: 'plasma', name: 'Plasma', icon: Sun, color: '#f5d0fe', type: 'complex', desc: 'Superheated matter.', particles: '✨' },
  rain: { id: 'rain', name: 'Rain', icon: Droplets, color: '#60a5fa', type: 'complex', desc: 'Falling water.', particles: '🌧️' },
  mud: { id: 'mud', name: 'Mud', icon: Mountain, color: '#78350f', type: 'complex', desc: 'Wet dirt.', particles: '💩' },
  ocean: { id: 'ocean', name: 'Ocean', icon: Droplets, color: '#1e3a8a', type: 'complex', desc: 'Vast waters.', particles: '🌊' },
  dust: { id: 'dust', name: 'Dust', icon: Wind, color: '#a8a29e', type: 'complex', desc: 'Fine particles.', particles: '🌪️' },
  storm: { id: 'storm', name: 'Storm', icon: Zap, color: '#4c1d95', type: 'complex', desc: 'Violent weather.', particles: '⛈️' },
  mountain: { id: 'mountain', name: 'Mountain', icon: Mountain, color: '#57534e', type: 'complex', desc: 'High peak.', particles: '🏔️' },
  life: { id: 'life', name: 'Life', icon: Heart, color: '#ec4899', type: 'master', desc: 'The spark of being.', particles: '❤️' },
  lightning: { id: 'lightning', name: 'Lightning', icon: Zap, color: '#fbbf24', type: 'complex', desc: 'Electric discharge.', particles: '⚡' },
  stone: { id: 'stone', name: 'Stone', icon: Mountain, color: '#78716c', type: 'complex', desc: 'Hard rock.', particles: '🪨' },
  cloud: { id: 'cloud', name: 'Cloud', icon: Cloud, color: '#f1f5f9', type: 'complex', desc: 'Floating vapor.', particles: '☁️' },
  human: { id: 'human', name: 'Human', icon: Skull, color: '#fda4af', type: 'master', desc: 'Sentient being.', particles: '🧍' },
};

// --- COMPONENT ---

export default function AlchemyGame({ onBack }: { onBack: () => void }) {
  return (
    <GameShell
      title="Mood Alchemy"
      icon="⚗️"
      color="#8b5cf6"
      onClose={onBack}
    >
      {(gameCtx) => <AlchemyBoard gameCtx={gameCtx} />}
    </GameShell>
  );
}

function AlchemyBoard({ gameCtx }: { gameCtx: GameContextType }) {
  const [discovered, setDiscovered] = useState<string[]>(['fire', 'water', 'air', 'earth']);
  const [workspace, setWorkspace] = useState<{ id: string, x: number, y: number, element: Element }[]>([]);
  const [lastDiscovery, setLastDiscovery] = useState<Element | null>(null);

  // AudioRef for "looping" ambience (simulated)

  useEffect(() => {
    gameCtx.setScore(discovered.length * 100);
  }, [discovered]);

  const addToWorkspace = (elementId: string) => {
    const element = BASE_ELEMENTS.find(e => e.id === elementId) || DISCOVERIES[elementId];
    if (!element) return;

    const newItem = {
      id: `${elementId}-${Date.now()}-${Math.random()}`,
      // center + random jitter
      x: window.innerWidth / 2 - 200 + (Math.random() * 40 - 20),
      y: window.innerHeight / 2 - 100 + (Math.random() * 40 - 20),
      element
    };

    setWorkspace(prev => [...prev, newItem]);
    gameCtx.playSound('pop');
  };

  const handleDragEnd = (itemId: string, x: number, y: number) => {
    // 1. Update Position in State (Essential for React collision logic)
    // In a real physics engine we'd use refs, but for simple React state this is "okay" for < 20 items
    // Actually, we usually defer state updates to avoid re-renders during drag, but we need it for collision.
    // Instead of precise coord tracking, we'll check collision against ALL other items using DOM Rects via helper.

    // Find the item
    const item = workspace.find(i => i.id === itemId);
    if (!item) return;

    // We can't easily get the *exact* DOM rect of the dropped item here without a Ref map.
    // Simplifying: Check if dropped element is "close enough" to any other element in `workspace` state.
    // Since we don't strictly track x/y in state during drag (framer handles it visually), this is tricky.
    // SOLUTION: Pure visual logic -> The `DraggableElement` component handles the "Did I hit something?" check using `document.elementFromPoint` or similar? 
    // No, easier -> Pass a `checkCollision` callback to the child.
  };

  const attemptCombine = (sourceId: string, targetId: string) => {
    const item1 = workspace.find(i => i.id === sourceId);
    const item2 = workspace.find(i => i.id === targetId);
    if (!item1 || !item2) return;

    const el1 = item1.element.id;
    const el2 = item2.element.id;

    // Check recipe
    const resultId = RECIPES[el1]?.[el2] || RECIPES[el2]?.[el1];

    if (resultId && DISCOVERIES[resultId]) {
      const resultElement = DISCOVERIES[resultId];

      // Success
      gameCtx.playSound('success');

      // Remove both
      setWorkspace(prev => prev.filter(i => i.id !== sourceId && i.id !== targetId));

      // Spawn Result at midpoint
      // (For now, just visual center of workspace or offset is fine)
      const newItem = {
        id: `${resultId}-${Date.now()}`,
        x: 0, // Reset logic usually needed for Framer Motion "layout"
        y: 0,
        element: resultElement
      };

      // We need to actually effectively "replace" one and remove other to keep visual continuity?
      // Simpler: Just clear both and add new.
      setWorkspace(prev => [...prev.filter(i => i.id !== sourceId && i.id !== targetId), newItem]);

      // Discovery?
      if (!discovered.includes(resultId)) {
        setDiscovered(prev => [...prev, resultId]);
        setLastDiscovery(resultElement);
      }
    } else {
      // Just move them apart or do nothing
    }
  };

  // Improved Combine Logic:
  // We will let the *Child* component handle the logic of "I was dropped on X".
  const onDrop = (draggedId: string, dropRect: DOMRect) => {
    // Find valid target in workspace
    // This is a bit "heavy" but fine for small n
    // We iterate DOM nodes or just rely on the fact that the user aimed well.
    // Actually, Framer Motion doesn't give drop target easily.

    // Let's use a distance check on State? No state isn't updated.
    // We will fallback to a simple specific logic:
    // The `DraggableElement` will fire `onDrop` with its final screen coords.
    // Parent checks if those coords overlap any *other* item's estimated coords.
    // Since we don't track coords live, this isn't possible.

    // ALTERNATIVE: "Magnetic" Attraction.
    // We will skip complex physics for now and implement "Click to Select, Click to Target" as fallback?
    // No, Drag is essential.

    // WORKING SOLUTION:
    // Use efficient collision detection by updating state onDragEnd.
  };

  const updatePosition = (id: string, x: number, y: number) => {
    setWorkspace(prev => prev.map(i => i.id === id ? { ...i, x, y } : i));
  }

  const checkCollision = (id: string, rect: DOMRect) => {
    // Get all element refs... tough.
    // Let's simplify: Use the `elementsFromPoint` strategy.
    const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const hits = document.elementsFromPoint(center.x, center.y);

    // Find an element that is NOT the dragged one
    const target = hits.find(el => el.getAttribute('data-alchemy-id') && el.getAttribute('data-alchemy-id') !== id);

    if (target) {
      const targetId = target.getAttribute('data-alchemy-id');
      if (targetId) attemptCombine(id, targetId);
    }
  }

  return (
    <div className="flex h-full bg-[#0a0a0a] text-white font-sans overflow-hidden">

      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-black to-purple-900/30 animate-pulse pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

      {/* Sidebar (Library) */}
      <div className="w-20 md:w-64 bg-black/40 border-r border-white/10 flex flex-col z-10 backdrop-blur-xl">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <BookOpen size={18} className="text-purple-400" />
          <span className="font-bold hidden md:block text-purple-100">Grimoire</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {discovered.map(id => {
              const el = BASE_ELEMENTS.find(e => e.id === id) || DISCOVERIES[id];
              if (!el) return null;
              return (
                <motion.button
                  key={id}
                  layoutId={`lib-${id}`}
                  onClick={() => addToWorkspace(id)}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5 bg-white/5 hover:border-purple-500/50 transition-all group"
                >
                  <el.icon size={24} style={{ color: el.color }} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  <span className="text-[10px] font-bold text-white/60 truncate w-full text-center hidden md:block">{el.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 flex gap-4 z-20">
          <button
            onClick={() => setWorkspace([])}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 shadow-lg backdrop-blur-sm transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Hint / Empty State */}
        {workspace.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="text-center">
              <Atom size={96} className="mx-auto mb-6 text-purple-500 animate-spin-slow" />
              <p className="text-2xl font-black uppercase tracking-widest text-white/50">Forge The Universe</p>
            </div>
          </div>
        )}

        {/* Draggable Items */}
        {workspace.map((item) => (
          <DraggableElement
            key={item.id}
            item={item}
            onCheckCollision={checkCollision}
          />
        ))}
      </div>

      {/* Discovery Modal */}
      <AnimatePresence>
        {lastDiscovery && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-purple-500/50 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(168,85,247,0.4)]"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-500 rounded-full blur-[50px] animate-pulse" />
              <lastDiscovery.icon size={80} style={{ color: lastDiscovery.color }} className="mx-auto mb-6 relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />

              <h2 className="text-sm font-bold text-purple-400 uppercase tracking-[0.3em] mb-2">Discovery Unlocked</h2>
              <h1 className="text-4xl font-black text-white mb-4">{lastDiscovery.name}</h1>
              <p className="text-white/60 mb-8 font-serif italic text-lg">{lastDiscovery.desc}</p>

              <button
                onClick={() => setLastDiscovery(null)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-900/50 transition-all hover:scale-105"
              >
                Collect Essence
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function DraggableElement({ item, onCheckCollision }: any) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.2, zIndex: 50, cursor: 'grabbing' }}
      whileHover={{ scale: 1.1, cursor: 'grab' }}
      onDragEnd={(e) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          onCheckCollision(item.id, rect);
        }
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1, x: item.x, y: item.y }} // Use visual init position
      // Using layoutId causes issues with multiple same items, avoid for duplicates
      className="absolute top-0 left-0 w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center bg-gray-900 border-2 border-white/10 backdrop-blur-sm group"
      style={{
        boxShadow: `0 0 20px -5px ${item.element.color}`
      }}
      data-alchemy-id={item.id}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none" />
      <item.element.icon size={32} style={{ color: item.element.color }} className="drop-shadow-md" />

      <span className="absolute -bottom-6 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
        {item.element.name}
      </span>
    </motion.div>
  );
}
