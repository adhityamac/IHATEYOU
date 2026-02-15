'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import ConnectionShell from './ConnectionShell';
import { STORY_STARTERS } from '../data/connectionData';

interface Story {
    id: string;
    lines: string[];
    createdAt: number;
}

function loadStories(): Story[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem('memory-builder-stories') || '[]');
    } catch {
        return [];
    }
}

function saveStories(stories: Story[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('memory-builder-stories', JSON.stringify(stories));
}

export default function MemoryBuilder({ onBack }: { onBack: () => void }) {
    const [stories, setStories] = useState<Story[]>([]);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [input, setInput] = useState('');
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [viewingStory, setViewingStory] = useState<Story | null>(null);

    useEffect(() => {
        setStories(loadStories());
    }, []);

    const startNewStory = (starter?: string) => {
        const newStory: Story = {
            id: Date.now().toString(),
            lines: starter ? [starter] : [],
            createdAt: Date.now(),
        };
        setActiveStory(newStory);
        setCurrentPlayer(starter ? 2 : 1);
    };

    const addLine = () => {
        if (!input.trim() || !activeStory) return;
        const updated: Story = {
            ...activeStory,
            lines: [...activeStory.lines, input.trim()],
        };
        setActiveStory(updated);
        setInput('');
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    };

    const finishStory = () => {
        if (!activeStory || activeStory.lines.length === 0) return;
        const updatedStories = [activeStory, ...stories];
        setStories(updatedStories);
        saveStories(updatedStories);
        setActiveStory(null);
    };

    const deleteStory = (id: string) => {
        const updated = stories.filter((s) => s.id !== id);
        setStories(updated);
        saveStories(updated);
    };

    return (
        <ConnectionShell
            title="Memory Builder"
            icon="📖"
            onClose={onBack}
            gradient="from-amber-950/80 via-stone-950/80 to-rose-950/80"
        >
            <div className="flex flex-col h-full w-full max-w-lg mx-auto p-6 select-none">
                <AnimatePresence mode="wait">

                    {/* ── MENU ── */}
                    {!activeStory && !viewingStory && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            <div className="text-center mb-8">
                                <div className="text-4xl mb-3">📖</div>
                                <h2 className="text-xl font-bold text-white/80 mb-1">Memory Builder</h2>
                                <p className="text-white/25 text-xs">Take turns. Build your lore.</p>
                            </div>

                            {/* Start new */}
                            <div className="mb-6">
                                <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold mb-3">
                                    Start with a prompt
                                </p>
                                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {STORY_STARTERS.map((starter, i) => (
                                        <button
                                            key={i}
                                            onClick={() => startNewStory(starter)}
                                            className="text-left p-3 bg-white/[0.03] border border-white/5 rounded-xl text-white/40 text-sm hover:bg-white/10 hover:text-white/70 transition-all"
                                        >
                                            &ldquo;{starter}&rdquo;
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => startNewStory()}
                                    className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 text-sm hover:bg-white/10 hover:text-white/60 transition-all"
                                >
                                    Start blank
                                </button>
                            </div>

                            {/* Saved stories */}
                            {stories.length > 0 && (
                                <div className="flex-1 min-h-0">
                                    <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold mb-3">
                                        Your stories ({stories.length})
                                    </p>
                                    <div className="space-y-2 overflow-y-auto max-h-48">
                                        {stories.map((story) => (
                                            <div
                                                key={story.id}
                                                className="flex items-center gap-2"
                                            >
                                                <button
                                                    onClick={() => setViewingStory(story)}
                                                    className="flex-1 text-left p-3 bg-white/[0.03] border border-white/5 rounded-xl text-white/40 text-sm hover:bg-white/10 transition-all truncate"
                                                >
                                                    {story.lines[0] || 'Untitled'} ({story.lines.length} lines)
                                                </button>
                                                <button
                                                    onClick={() => deleteStory(story.id)}
                                                    className="p-2 text-white/10 hover:text-red-400 transition-colors"
                                                    aria-label="Delete story"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── ACTIVE STORY ── */}
                    {activeStory && (
                        <motion.div
                            key="building"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                                {activeStory.lines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${i % 2 === 0
                                                    ? 'bg-white/5 border border-white/10 text-white/60 rounded-bl-sm'
                                                    : 'bg-rose-500/10 border border-rose-500/15 text-white/70 rounded-br-sm'
                                                }`}
                                        >
                                            {line}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="flex-shrink-0">
                                <p className="text-white/15 text-[10px] uppercase tracking-widest mb-2 text-center font-bold">
                                    Player {currentPlayer}'s turn
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addLine()}
                                        placeholder="Add to the story..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white/80 placeholder:text-white/15 text-sm focus:outline-none focus:border-amber-500/30 transition-colors"
                                        autoFocus
                                    />
                                    <button
                                        onClick={addLine}
                                        disabled={!input.trim()}
                                        className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 text-sm transition-colors disabled:opacity-30"
                                    >
                                        Add
                                    </button>
                                </div>

                                {activeStory.lines.length >= 2 && (
                                    <button
                                        onClick={finishStory}
                                        className="w-full mt-3 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400/70 text-sm font-medium hover:bg-amber-500/20 transition-colors"
                                    >
                                        Save this story
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── VIEWING SAVED STORY ── */}
                    {viewingStory && (
                        <motion.div
                            key="viewing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                {viewingStory.lines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.15 }}
                                        className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${i % 2 === 0
                                                    ? 'bg-white/5 border border-white/10 text-white/60 rounded-bl-sm'
                                                    : 'bg-rose-500/10 border border-rose-500/15 text-white/70 rounded-br-sm'
                                                }`}
                                        >
                                            {line}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-white/10 text-[10px] text-center mb-3 italic">
                                {new Date(viewingStory.createdAt).toLocaleDateString()}
                            </p>

                            <button
                                onClick={() => setViewingStory(null)}
                                className="py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 text-sm hover:bg-white/10 transition-colors"
                            >
                                ← Back
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </ConnectionShell>
    );
}
