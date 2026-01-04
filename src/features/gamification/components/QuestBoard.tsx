'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lock, Star, ChevronRight, CheckCircle2, BookOpen, Map } from 'lucide-react';
import { useTheme } from '@/components/shared/GradientThemeProvider';

interface Quest {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    state: 'locked' | 'unlocked' | 'completed';
    slides: Slide[];
}

interface Slide {
    title: string;
    content: string;
    icon?: React.ReactNode;
}

const QUESTS: Quest[] = [
    {
        id: 'q1',
        title: "The Loop",
        description: "Understand the CBT Triangle",
        icon: <Brain size={24} />,
        state: 'unlocked',
        slides: [
            { title: "Level 1: The Loop", content: "Thoughts, Feelings, and Behaviors are connected in a loop. Changing one changes the others.", icon: <Brain size={48} className="text-blue-400" /> },
            { title: "Identify the Trigger", content: "What happened right before you felt this way? Was it an event, a thought, or a sensation?", icon: <BookOpen size={48} className="text-purple-400" /> },
            { title: "Catch the Thought", content: "Automatic thoughts pop up instantly. 'I'm not good enough' or 'This will fail'. Notice them.", icon: <CheckCircle2 size={48} className="text-green-400" /> },
        ]
    },
    {
        id: 'q2',
        title: "Box Breathing",
        description: "Master physiological regulation",
        icon: <BookOpen size={24} />,
        state: 'locked',
        slides: [
            { title: "Box Breathing", content: "Inhale for 4. Hold for 4. Exhale for 4. Hold for 4.", icon: <BookOpen size={48} className="text-emerald-400" /> }
        ]
    },
    {
        id: 'q3',
        title: "Cognitive Reframing",
        description: "Challenge negative thoughts",
        icon: <Star size={24} />,
        state: 'locked',
        slides: [
            { title: "Challenge", content: "Is this thought 100% true? What is the evidence?", icon: <Star size={48} className="text-yellow-400" /> }
        ]
    }
];

export default function QuestBoard() {
    const { theme } = useTheme();
    const isRetro = theme === 'retro' || theme === 'retro-soul';

    // State to track quest progress (mocked for now, normally from DB)
    const [questStates, setQuestStates] = useState(QUESTS.reduce((acc, q) => ({ ...acc, [q.id]: q.state }), {} as Record<string, string>));

    const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleQuestClick = (quest: Quest) => {
        if (questStates[quest.id] === 'locked') return;
        setActiveQuest(quest);
        setCurrentSlide(0);
    };

    const nextSlide = () => {
        if (!activeQuest) return;
        if (currentSlide < activeQuest.slides.length - 1) {
            setCurrentSlide(c => c + 1);
        } else {
            // Complete Quest
            const nextQuestIndex = QUESTS.findIndex(q => q.id === activeQuest.id) + 1;
            const updates = { [activeQuest.id]: 'completed' };

            if (nextQuestIndex < QUESTS.length) {
                updates[QUESTS[nextQuestIndex].id] = 'unlocked';
            }

            setQuestStates(prev => ({ ...prev, ...updates }));
            setActiveQuest(null);
        }
    };

    // Render Active Quest (Slide Deck)
    if (activeQuest) {
        return (
            <div className={`
                w-full h-[500px] flex flex-col items-center justify-center relative overflow-hidden p-8 rounded-[40px]
                ${isRetro ? 'bg-stone-100 border-4 border-stone-800 shadow-[8px_8px_0px_#2d2a2e]' : 'bg-black/40 border border-white/10 backdrop-blur-xl'}
            `}>
                <div className={`absolute top-8 right-8 text-xs font-bold uppercase tracking-widest ${isRetro ? 'text-stone-500' : 'text-white/20'}`}>
                    Slide {currentSlide + 1}/{activeQuest.slides.length}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="text-center max-w-md relative z-10"
                    >
                        <div className="mb-8 flex justify-center scale-125">{activeQuest.slides[currentSlide].icon}</div>
                        <h3 className={`text-3xl font-black mb-6 italic ${isRetro ? 'text-black' : 'text-white'}`}>{activeQuest.slides[currentSlide].title}</h3>
                        <p className={`text-xl leading-relaxed ${isRetro ? 'text-stone-700 font-medium' : 'text-white/70'}`}>{activeQuest.slides[currentSlide].content}</p>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={nextSlide}
                    className={`
                        mt-12 px-10 py-4 rounded-full font-black uppercase tracking-widest flex items-center gap-3 transition-all
                        ${isRetro
                            ? 'bg-[#E0F8CF] border-2 border-stone-800 text-stone-900 shadow-[4px_4px_0px_#2d2a2e] hover:translate-y-1 hover:shadow-none'
                            : 'bg-white text-black hover:bg-gray-200 shadow-glow'}
                    `}
                >
                    {currentSlide === activeQuest.slides.length - 1 ? 'Complete Quest' : 'Next Step'} <ChevronRight size={18} />
                </button>

                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/noise.png')] mix-blend-overlay" />
            </div>
        );
    }

    // Render Quest Map
    return (
        <div className="w-full relative min-h-[500px] py-10">
            {/* Connecting Line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 ${isRetro ? 'bg-stone-300' : 'bg-white/10'}`} />

            <div className="relative space-y-24">
                {QUESTS.map((quest, index) => {
                    const status = questStates[quest.id] || 'locked';
                    const isLeft = index % 2 === 0;

                    return (
                        <motion.div
                            key={quest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center ${isLeft ? 'justify-start md:pr-[50%]' : 'justify-end md:pl-[50%]'} relative`}
                        >
                            {/* Connector Dot on Center Line */}
                            <div className={`
                                absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center
                                ${status === 'completed'
                                    ? (isRetro ? 'bg-green-500 border-stone-800' : 'bg-green-500 border-black shadow-glow')
                                    : status === 'unlocked'
                                        ? (isRetro ? 'bg-white border-stone-800' : 'bg-white border-black animate-pulse')
                                        : (isRetro ? 'bg-stone-300 border-stone-400' : 'bg-white/10 border-white/5')
                                }
                            `}>
                                {status === 'completed' && <CheckCircle2 size={12} className="text-black" />}
                            </div>

                            {/* Quest Node */}
                            <button
                                onClick={() => handleQuestClick(quest)}
                                disabled={status === 'locked'}
                                className={`
                                    group relative w-[calc(100%-2rem)] md:w-[80%] p-6 rounded-[32px] text-left transition-all duration-300
                                    ${isLeft ? 'mr-8 md:mr-16 origin-right' : 'ml-8 md:ml-16 origin-left'}
                                    ${status === 'locked' ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                                    ${isRetro
                                        ? 'bg-white border-2 border-stone-800 shadow-[6px_6px_0px_#2d2a2e]'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                                `}
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`
                                        p-3 rounded-2xl 
                                        ${isRetro ? 'bg-stone-100 border border-stone-800' : 'bg-white/10'}
                                    `}>
                                        {status === 'locked' ? <Lock size={20} /> : quest.icon}
                                    </div>
                                    <div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${isRetro ? 'text-stone-500' : 'text-white/40'}`}>
                                            Quest {index + 1}
                                        </div>
                                        <h3 className={`text-xl font-black italic ${isRetro ? 'text-black' : 'text-white'}`}>
                                            {quest.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className={`text-sm ${isRetro ? 'text-stone-600' : 'text-white/60'}`}>
                                    {quest.description}
                                </p>

                                {status === 'unlocked' && (
                                    <div className={`
                                        absolute -top-2 -right-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                        ${isRetro ? 'bg-rose-400 text-black border border-stone-800' : 'bg-rose-500 text-white shadow-glow'}
                                    `}>
                                        Start
                                    </div>
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-32 text-center">
                <div className={`inline-block px-6 py-2 rounded-full border ${isRetro ? 'border-stone-800 bg-stone-200 text-stone-600' : 'border-white/10 bg-white/5 text-white/30'} text-xs font-bold uppercase tracking-widest`}>
                    More Quests Coming Soon
                </div>
            </div>
        </div>
    );
}
