'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Lock, Unlock, Play, Music, Film, Fingerprint, Eye, Zap, Headphones, X, Moon, Sun, Heart, Sparkles } from 'lucide-react';

/* 
  THE QUIET WORLD (Refined Sanctuary)
  A place of pure stillness and discovery.
*/

type Artifact = {
    id: string;
    title: string;
    icon: any;
    description: string;
    lockedDescription: string;
    isLocked: boolean;
    type: 'terminal' | 'chat' | 'light' | 'trust';
    content: React.ReactNode;
    color: string;
};

interface HerWorldProps {
    onClose: () => void;
}

const BreathingBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [-20, 20, -20],
                y: [-20, 20, -20]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px]"
        />
        <motion.div
            animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
                x: [20, -20, 20],
                y: [20, -20, 20]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"
        />
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0, 0.4, 0],
                    scale: [0, 1, 0],
                    y: [0, -100],
                    x: Math.random() * 20 - 10
                }}
                transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                }}
            />
        ))}
    </div>
);

export default function HerWorld({ onClose }: HerWorldProps) {
    const [activeArtifact, setActiveArtifact] = useState<string | null>(null);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdInterval = useRef<NodeJS.Timeout | null>(null);
    const [isTrustUnlocked, setIsTrustUnlocked] = useState(false);

    // Puzzle 4: Stillness Mechanic
    const startHold = () => {
        if (isTrustUnlocked) return;
        setHoldProgress(0);
        holdInterval.current = setInterval(() => {
            setHoldProgress(prev => {
                if (prev >= 100) {
                    clearInterval(holdInterval.current!);
                    setIsTrustUnlocked(true);
                    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
                    return 100;
                }
                return prev + 1.5; // Roughly 3.3 seconds
            });
        }, 50);
    };

    const stopHold = () => {
        if (isTrustUnlocked) return;
        if (holdInterval.current) clearInterval(holdInterval.current);
        setHoldProgress(0);
    };

    const artifacts: Artifact[] = [
        {
            id: 'glitch',
            title: 'The Open Door',
            icon: Zap,
            color: '#4ADE80',
            description: 'A crack where the light gets in.',
            lockedDescription: 'Unlocked by the sequence of the lonely.',
            isLocked: false,
            type: 'terminal',
            content: (
                <div className="font-mono text-green-400/90 py-4 leading-relaxed tracking-wide">
                    <p className="mb-6 opacity-40 text-xs uppercase tracking-[0.2em]">{`// Fragment_Detected: 0xNE0`}</p>
                    <p className="text-xl">"The world is loud. This place is not. You don't have to perform here. You just have to be."</p>
                    <div className="mt-8 h-px w-12 bg-green-500/20" />
                </div>
            )
        },
        {
            id: 'chat',
            title: 'The Signal',
            icon: Headphones,
            color: '#A855F7',
            description: 'A whisper heard in the static.',
            lockedDescription: 'Unlocked by asking about the start.',
            isLocked: false,
            type: 'chat',
            content: (
                <div className="py-2">
                    <h3 className="text-purple-300/60 font-medium text-xs uppercase tracking-[0.3em] mb-4">Memory Sync 001</h3>
                    <p className="italic text-white/90 text-2xl font-light leading-snug">"It started with a simple thought: What if there was a place where you didn't have to pretend?"</p>
                </div>
            )
        },
        {
            id: 'light',
            title: 'The Midnight Sun',
            icon: Sun,
            color: '#FBBF24',
            description: 'A bloom in the deepest night.',
            lockedDescription: 'Unlocked between 11 PM and 1 AM.',
            isLocked: false,
            type: 'light',
            content: (
                <div className="py-2">
                    <h3 className="text-yellow-500/60 font-medium text-xs uppercase tracking-[0.3em] mb-4">Artifact: The Beacon</h3>
                    <p className="text-white/90 text-2xl font-light leading-snug italic">"The night is not just for darkness. It is also for the stars that refuse to go out."</p>
                </div>
            )
        },
        {
            id: 'trust',
            title: 'The Silence',
            icon: Heart,
            color: '#FFFFFF',
            description: 'A reward for the art of waiting.',
            lockedDescription: 'Stillness is a choice. (Press & Hold)',
            isLocked: !isTrustUnlocked,
            type: 'trust',
            content: (
                <div className="py-2">
                    <h3 className="text-white/40 font-medium text-[10px] uppercase tracking-[0.5em] mb-8">Letter to Player One</h3>
                    <div className="space-y-6">
                        <p className="font-serif text-2xl leading-relaxed text-white/95">
                            "You don't owe anyone anything. Not perfection, not a smile, not even your time."
                        </p>
                        <p className="font-serif text-2xl leading-relaxed text-white/80">
                            "Thank you for simply being here."
                        </p>
                    </div>
                    <p className="mt-12 text-right font-signature text-2xl text-white/30 italic">- The Architect</p>
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-[#030303] text-white overflow-hidden flex flex-col font-sans selection:bg-white/10">
            <BreathingBackground />

            {/* Header */}
            <div className="relative z-10 p-8 flex justify-between items-center pt-16 max-w-2xl mx-auto w-full">
                <div className="space-y-1">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-light tracking-tight text-white/90"
                    >
                        The Quiet World
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-[10px] font-medium uppercase tracking-[0.5em] text-white/20"
                    >
                        Sanctuary for Player One
                    </motion.p>
                </div>
                <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-white/20 hover:text-white transition-all group scale-100 active:scale-90"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            {/* Artifact Grid */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto pb-40">
                    {artifacts.map((artifact, i) => (
                        <motion.div
                            key={artifact.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.15, duration: 0.8 }}
                            layoutId={`artifact-${artifact.id}`}
                            onClick={() => !artifact.isLocked && setActiveArtifact(artifact.id)}
                            className={`group aspect-[4/3.2] rounded-[40px] p-8 relative overflow-hidden transition-all duration-700 ${artifact.isLocked
                                    ? 'bg-white/[0.01] border border-white/[0.03]'
                                    : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] cursor-pointer'
                                }`}
                        >
                            {/* Inner Glow for Unlocked */}
                            {!artifact.isLocked && (
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at bottom right, ${artifact.color}44, transparent)` }}
                                />
                            )}

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl transition-all duration-500 ${artifact.isLocked ? 'bg-white/[0.03] text-white/10' : 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                        }`}>
                                        <artifact.icon size={22} className={!artifact.isLocked ? 'animate-pulse' : ''} style={{ animationDuration: '4s' }} />
                                    </div>
                                    {!artifact.isLocked && (
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: artifact.color }}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h3 className={`text-xl font-light tracking-wide ${artifact.isLocked ? 'text-white/20' : 'text-white/90'}`}>
                                        {artifact.title}
                                    </h3>
                                    <p className={`text-xs font-light leading-relaxed tracking-wider ${artifact.isLocked ? 'text-white/10 italic' : 'text-white/40'}`}>
                                        {artifact.isLocked ? artifact.lockedDescription : artifact.description}
                                    </p>
                                </div>
                            </div>

                            {/* Trust Puzzle Logic: Stillness Overlay */}
                            {artifact.id === 'trust' && !isTrustUnlocked && (
                                <button
                                    onMouseDown={startHold}
                                    onMouseUp={stopHold}
                                    onMouseLeave={stopHold}
                                    onTouchStart={startHold}
                                    onTouchEnd={stopHold}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-700 cursor-none"
                                >
                                    <div className="relative scale-110">
                                        <svg className="w-28 h-28 -rotate-90">
                                            <circle cx="56" cy="56" r="54" stroke="white" strokeWidth="0.5" fill="transparent" className="opacity-5" />
                                            <circle
                                                cx="56" cy="56" r="54"
                                                stroke="white" strokeWidth="1.5" fill="transparent"
                                                className="opacity-60 transition-all duration-150 ease-linear"
                                                strokeDasharray={339}
                                                strokeDashoffset={339 - (339 * holdProgress) / 100}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${holdProgress > 0 ? 'scale-110 opacity-100 text-white' : 'scale-100 opacity-20 text-white/50'}`}>
                                            <Fingerprint size={32} />
                                        </div>
                                    </div>
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Expanded Content View */}
            <AnimatePresence>
                {activeArtifact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
                        onClick={() => setActiveArtifact(null)}
                    >
                        <motion.div
                            layoutId={`artifact-${activeArtifact}`}
                            className="w-full max-w-xl bg-white/[0.02] border border-white/5 rounded-[64px] p-10 md:p-16 shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveArtifact(null)}
                                className="absolute top-10 right-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="mt-6 flex flex-col items-center text-center">
                                <div className="mb-10 relative">
                                    <div className="p-8 rounded-[40px] bg-white/[0.04] border border-white/10 relative z-10">
                                        {(() => {
                                            const art = artifacts.find(a => a.id === activeArtifact);
                                            const Icon = art?.icon;
                                            return Icon ? <Icon size={40} className="text-white" /> : null;
                                        })()}
                                    </div>
                                    {/* Soft Radial Glow */}
                                    <div
                                        className="absolute inset-0 blur-[60px] opacity-20 scale-150"
                                        style={{ backgroundColor: artifacts.find(a => a.id === activeArtifact)?.color }}
                                    />
                                </div>
                                <div className="mb-12">
                                    <h3 className="text-3xl font-light text-white mb-2">{artifacts.find(a => a.id === activeArtifact)?.title}</h3>
                                    <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.5em]">Fragment Restored</p>
                                </div>
                                <div className="w-full text-left">
                                    {artifacts.find(a => a.id === activeArtifact)?.content}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .font-signature { font-family: cursive, 'Dancing Script', serif; }
            `}</style>
        </div>
    );
}
