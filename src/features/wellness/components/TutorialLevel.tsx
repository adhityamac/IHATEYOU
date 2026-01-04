'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, BookOpen, Brain } from 'lucide-react';

interface Slide {
    title: string;
    content: string;
    icon?: React.ReactNode;
}

const CBT_LEVEL_1: Slide[] = [
    { title: "Level 1: The Loop", content: "Thoughts, Feelings, and Behaviors are connected in a loop. Changing one changes the others.", icon: <Brain size={48} className="text-blue-400" /> },
    { title: "Identify the Trigger", content: "What happened right before you felt this way? Was it an event, a thought, or a sensation?", icon: <BookOpen size={48} className="text-purple-400" /> },
    { title: "Catch the Thought", content: "Automatic thoughts pop up instantly. 'I'm not good enough' or 'This will fail'. Notice them.", icon: <CheckCircle2 size={48} className="text-green-400" /> },
];

export default function TutorialLevel() {
    const [activeLevel, setActiveLevel] = useState<Slide[] | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const startLevel = (slides: Slide[]) => {
        setActiveLevel(slides);
        setCurrentSlide(0);
    };

    const nextSlide = () => {
        if (!activeLevel) return;
        if (currentSlide < activeLevel.length - 1) {
            setCurrentSlide(c => c + 1);
        } else {
            setActiveLevel(null); // Complete
        }
    };

    if (activeLevel) {
        return (
            <div className="bg-black/40 border border-white/10 rounded-[32px] p-8 h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 right-4 text-xs font-bold text-white/20 uppercase tracking-widest">
                    Slide {currentSlide + 1}/{activeLevel.length}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="text-center max-w-md"
                    >
                        <div className="mb-6 flex justify-center">{activeLevel[currentSlide].icon}</div>
                        <h3 className="text-2xl font-black text-white mb-4 italic">{activeLevel[currentSlide].title}</h3>
                        <p className="text-white/70 text-lg leading-relaxed">{activeLevel[currentSlide].content}</p>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={nextSlide}
                    className="mt-12 px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    {currentSlide === activeLevel.length - 1 ? 'Complete Level' : 'Next'} <ChevronRight size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
                onClick={() => startLevel(CBT_LEVEL_1)}
                className="group relative p-8 rounded-[32px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 text-left hover:border-white/30 transition-all overflow-hidden"
            >
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                        <Brain size={24} />
                    </div>
                    <h3 className="text-xl font-black text-white italic mb-2">CBT Basics: The Loop</h3>
                    <p className="text-sm text-white/50 mb-4">Learn how thoughts affect feelings.</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        Start Tutorial <ChevronRight size={12} />
                    </div>
                </div>
            </button>

            <button
                onClick={() => startLevel([
                    { title: "Box Breathing", content: "Inhale for 4. Hold for 4. Exhale for 4. Hold for 4.", icon: <BookOpen size={48} className="text-emerald-400" /> }
                ])}
                className="group relative p-8 rounded-[32px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 text-left hover:border-white/30 transition-all overflow-hidden"
            >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-xl font-black text-white italic mb-2">Meditation 101</h3>
                    <p className="text-sm text-white/50 mb-4">Master the art of box breathing.</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        Start Tutorial <ChevronRight size={12} />
                    </div>
                </div>
            </button>
        </div>
    );
}