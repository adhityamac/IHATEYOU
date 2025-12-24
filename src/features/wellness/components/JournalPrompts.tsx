'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, RefreshCw, Save, Sparkles, Calendar } from 'lucide-react';

interface JournalPrompt {
    id: number;
    category: string;
    prompt: string;
    followUp?: string[];
}

export default function JournalPrompts() {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [response, setResponse] = useState('');
    const [saved, setSaved] = useState(false);

    const prompts: JournalPrompt[] = [
        {
            id: 1,
            category: 'Gratitude',
            prompt: 'What are three things that made you smile today, no matter how small?',
            followUp: ['Why did these moments matter to you?', 'How can you create more of these moments?']
        },
        {
            id: 2,
            category: 'Self-Reflection',
            prompt: 'What emotion have you been avoiding, and what is it trying to tell you?',
            followUp: ['What would happen if you listened to it?', 'What support do you need?']
        },
        {
            id: 3,
            category: 'Growth',
            prompt: 'Describe a challenge you faced recently. What did it teach you about yourself?',
            followUp: ['How have you grown from this?', 'What would you do differently?']
        },
        {
            id: 4,
            category: 'Self-Love',
            prompt: 'Write a letter to yourself as if you were your own best friend. What would you say?',
            followUp: ['What kindness do you need to hear?', 'How can you be gentler with yourself?']
        },
        {
            id: 5,
            category: 'Dreams',
            prompt: 'If fear wasn\'t a factor, what would you be doing right now?',
            followUp: ['What\'s one small step toward that?', 'What\'s holding you back?']
        },
        {
            id: 6,
            category: 'Healing',
            prompt: 'What part of yourself needs the most compassion right now?',
            followUp: ['How can you give yourself that compassion?', 'What would healing look like?']
        },
        {
            id: 7,
            category: 'Present Moment',
            prompt: 'Describe this exact moment. What do you see, hear, feel, and think?',
            followUp: ['What are you grateful for right now?', 'What can you let go of?']
        },
        {
            id: 8,
            category: 'Relationships',
            prompt: 'Who in your life truly sees you? How does that make you feel?',
            followUp: ['How can you nurture this connection?', 'What do you appreciate about them?']
        },
    ];

    const currentPrompt = prompts[currentPromptIndex];

    const getNewPrompt = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * prompts.length);
        } while (newIndex === currentPromptIndex);
        setCurrentPromptIndex(newIndex);
        setResponse('');
        setSaved(false);
    };

    const saveEntry = () => {
        // Save to localStorage or backend
        const entry = {
            promptId: currentPrompt.id,
            prompt: currentPrompt.prompt,
            response,
            timestamp: new Date().toISOString(),
        };
        if (typeof window !== 'undefined') {
            const savedEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
            savedEntries.push(entry);
            localStorage.setItem('journal_entries', JSON.stringify(savedEntries));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <BookOpen className="text-purple-400" size={32} />
                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Journal Prompts</h2>
                </div>
                <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
                    Guided reflection for deeper self-understanding
                </p>
            </div>

            {/* Prompt Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPromptIndex}
                    initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: 10, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="relative p-10 rounded-[48px] bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 backdrop-blur-xl shadow-3xl overflow-hidden mb-8"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 p-40 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

                    {/* Category Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
                    >
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
                            {currentPrompt.category}
                        </span>
                    </motion.div>

                    {/* Prompt */}
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-black italic text-white leading-tight mb-8"
                    >
                        {currentPrompt.prompt}
                    </motion.h3>

                    {/* Follow-up Questions */}
                    {currentPrompt.followUp && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-3">Consider:</p>
                            {currentPrompt.followUp.map((question, i) => (
                                <div key={i} className="flex items-start gap-2 text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                                    <p className="text-sm font-medium">{question}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Writing Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
            >
                <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Start writing your thoughts..."
                    className="w-full min-h-[300px] p-8 rounded-[32px] bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all resize-none font-medium text-lg leading-relaxed"
                />

                <div className="flex items-center justify-between mt-4 px-4">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                        {response.length} characters
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest">
                        <Calendar size={14} />
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveEntry}
                    disabled={!response.trim()}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${saved
                            ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]'
                            : response.trim()
                                ? 'bg-white text-black shadow-xl hover:shadow-2xl'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}
                >
                    <Save size={20} />
                    {saved ? 'Saved!' : 'Save Entry'}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, rotate: 180 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getNewPrompt}
                    className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all"
                >
                    <RefreshCw size={20} />
                    New Prompt
                </motion.button>
            </div>

            {/* Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 rounded-[24px] bg-white/[0.03] border border-white/10 text-center"
            >
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                    There are no right or wrong answers. This is your safe space to explore your thoughts and feelings.
                </p>
            </motion.div>
        </div>
    );
}
