'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sparkles,
    Plus,
    Music,
    Radio,
    Zap,
    Clock,
    Wind,
    Quote,
    Brain,
    UserPlus,
    Volume2,
    Hand,
    MessageSquare,
    Hash
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import TrendingPosts from '@/features/social/components/TrendingPosts';
import HashtagFeed from '@/features/social/components/HashtagFeed';
import UserRecommendations from '@/features/social/components/UserRecommendations';
import { useSignals } from '@/hooks/useSignals';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { useTheme } from '@/components/shared/GradientThemeProvider';
import TimeCapsule from '@/features/wellness/components/TimeCapsule';
import QuestBoard from '@/features/gamification/components/QuestBoard';
import Image from 'next/image';

interface SearchSectionProps {
    feedPosts: any[];
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

type WidgetType =
    | 'PAUSE_BREATHE'
    | 'MOOD_CHECKIN'
    | 'THOUGHT'
    | 'MEDITATION'
    | 'PSYCHOLOGY_BITE'
    | 'ASK_GUIDE'
    | 'POST_BOX'
    | 'SOUL_SUGGESTION'
    | 'GROUNDING_TOOL'
    | 'SOUL_SUGGESTION'
    | 'GROUNDING_TOOL'
    | 'AUDIO'
    | 'TIME_CAPSULE'
    | 'TUTORIAL';

interface WidgetItem {
    id: string;
    type: WidgetType;
    colSpan: number;
    rowSpan: number;
    data: any;
}

export default function SearchSection({ feedPosts, onScroll }: SearchSectionProps) {
    // Stable ID counter for widgets
    const INITIAL_ID = 2025122300000;
    const idCounter = useRef(INITIAL_ID);
    const { trackTool } = useSignals('user-1');
    const { state: emotionalState, decision: algoDecision } = useAlgorithm('user-1');

    const [items, setItems] = useState<WidgetItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'discover' | 'trending' | 'hashtags' | 'people'>('discover');
    const [selectedHashtag, setSelectedHashtag] = useState<string | undefined>();

    const { theme } = useTheme();
    const isRetro = theme === 'retro' || theme === 'retro-soul';

    // Theme Variables
    const textColor = isRetro ? 'text-black' : 'text-white';
    const cardShadow = isRetro ? 'shadow-[4px_4px_0px_#2d2a2e]' : '';

    // Widget Specific BGs for Retro
    const getWidgetBg = (type: WidgetType) => {
        if (!isRetro) return '';
        switch (type) {
            case 'PAUSE_BREATHE': return 'bg-stone-200';
            case 'MOOD_CHECKIN': return 'bg-[#fef9c3]';
            case 'THOUGHT': return 'bg-white';
            case 'MEDITATION': return 'bg-stone-100';
            case 'PSYCHOLOGY_BITE': return 'bg-amber-100';
            case 'ASK_GUIDE': return 'bg-black text-white'; // Keep inversion
            case 'POST_BOX': return 'bg-white';
            case 'SOUL_SUGGESTION': return 'bg-stone-50';
            case 'GROUNDING_TOOL': return 'bg-rose-100';
            case 'GROUNDING_TOOL': return 'bg-rose-100';
            case 'AUDIO': return 'bg-blue-100';
            case 'TIME_CAPSULE': return 'bg-purple-100';
            case 'TUTORIAL': return 'bg-emerald-100';
            default: return 'bg-white';
        }
    };


    // Mock Content Libraries
    const thoughts = [
        "You don’t need to fix everything today.",
        "Avoidance is also information.",
        "Your worth is not your productivity.",
        "Silence is a frequency too.",
        "Feelings are visitors, let them come and go."
    ];

    const psychBites = [
        { title: "Why overthinking happens", desc: "It's your brain's way of trying to control the uncontrollable." },
        { title: "Emotional numbness", desc: "A protective shield when the world feels too loud." },
        { title: "The weight of silence", desc: "Why we fear the quiet between thoughts." }
    ];

    const groundingTools = [
        "Name 5 things you can see.",
        "Splash cold water on your face.",
        "The 5-4-3-2-1 exercise.",
        "Press your feet into the floor."
    ];

    const audioOptions = [
        { name: "Rain", icon: <Volume2 size={14} />, color: "bg-blue-500/10" },
        { name: "Brown Noise", icon: <Radio size={14} />, color: "bg-amber-500/10" },
        { name: "Soft Hum", icon: <Music size={14} />, color: "bg-purple-500/10" }
    ];

    const generateWidgets = useCallback((count: number) => {
        const isOverwhelmed = emotionalState?.primaryState === 'emotionally_overloaded' || emotionalState?.primaryState === 'socially_cautious';

        const types: WidgetType[] = isOverwhelmed
            ? ['PAUSE_BREATHE', 'THOUGHT', 'MEDITATION', 'GROUNDING_TOOL', 'AUDIO'] // Calming tools only
            : ['PAUSE_BREATHE', 'MOOD_CHECKIN', 'THOUGHT', 'MEDITATION', 'PSYCHOLOGY_BITE', 'ASK_GUIDE', 'POST_BOX', 'SOUL_SUGGESTION', 'GROUNDING_TOOL', 'AUDIO', 'TIME_CAPSULE', 'TUTORIAL'];

        return Array.from({ length: count }).map((_, i) => {
            const type = types[Math.floor(Math.random() * types.length)];
            let colSpan = 1;
            let rowSpan = 1;

            // Layout variations influenced by algorithm
            if (type === 'POST_BOX' || type === 'MOOD_CHECKIN' || type === 'TIME_CAPSULE' || type === 'TUTORIAL') colSpan = 2;
            if (type === 'MEDITATION' || type === 'PSYCHOLOGY_BITE') rowSpan = 2;
            if (type === 'TIME_CAPSULE' || type === 'TUTORIAL') rowSpan = 2;
            if (type === 'THOUGHT' && Math.random() > 0.5) colSpan = isOverwhelmed ? 1 : 2;

            // If overwhelmed, make widgets larger/more spaced out
            if (isOverwhelmed && (type === 'PAUSE_BREATHE' || type === 'GROUNDING_TOOL')) {
                colSpan = 2;
            }

            idCounter.current += 1;
            return {
                id: `widget-${idCounter.current}-${i}`,
                type,
                colSpan,
                rowSpan,
                data: {
                    content: type === 'THOUGHT' ? thoughts[Math.floor(Math.random() * thoughts.length)] : null,
                    bite: type === 'PSYCHOLOGY_BITE' ? psychBites[Math.floor(Math.random() * psychBites.length)] : null,
                    tool: type === 'GROUNDING_TOOL' ? groundingTools[Math.floor(Math.random() * groundingTools.length)] : null,
                    audio: type === 'AUDIO' ? audioOptions[Math.floor(Math.random() * audioOptions.length)] : null
                }
            };
        });
    }, [emotionalState?.primaryState]); // Only depend on primaryState

    useEffect(() => {
        setItems(generateWidgets(algoDecision?.postsPerPage || 12));
    }, [emotionalState?.primaryState, algoDecision?.postsPerPage, generateWidgets]);

    useEffect(() => {
        if (activeTab !== 'discover') {
            trackTool(`search_${activeTab}`, 0);
        }
    }, [activeTab, trackTool]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        onScroll(e);
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoading) {
            setIsLoading(true);
            setTimeout(() => {
                setItems(prev => [...prev, ...generateWidgets(6)]);
                setIsLoading(false);
            }, 800);
        }
    };

    // Widget Renderers
    const renderWidget = (item: WidgetItem) => {
        const { type, data } = item;
        const baseRetro = isRetro ? `border-2 border-stone-800 ${cardShadow} ${getWidgetBg(type)}` : '';

        switch (type) {
            case 'PAUSE_BREATHE':
                return (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setIsBreathing(true)}
                        className={`h-full w-full rounded-[32px] p-6 flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden ${isRetro ? baseRetro : 'bg-[#1a1a1a] border border-white/5'}`}
                    >
                        <Wind className={`w-8 h-8 mb-3 ${isRetro ? 'text-stone-600' : 'text-rose-400/50'} ${isBreathing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                        <div className={`font-black uppercase text-[10px] tracking-widest mb-1 ${isRetro ? 'text-black' : 'text-white'}`}>Pause. Breathe.</div>
                        <div className={`${isRetro ? 'text-stone-500' : 'text-white/30'} text-[9px] font-bold uppercase tracking-tight`}>30s Reset</div>

                        <AnimatePresence>
                            {isBreathing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-rose-500/10 backdrop-blur-sm flex items-center justify-center"
                                    onAnimationComplete={() => setTimeout(() => setIsBreathing(false), 3000)}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="w-24 h-24 rounded-full border border-rose-500/30 flex items-center justify-center"
                                    >
                                        <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Inhale</div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );

            case 'MOOD_CHECKIN':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-between ${isRetro ? baseRetro : 'bg-white/[0.02] border border-white/5'}`}>
                        <div className={`${isRetro ? 'text-stone-500' : 'text-white/40'} text-[10px] font-black uppercase tracking-widest`}>How are you right now?</div>
                        <div className="flex justify-between items-center mt-4">
                            {['😊', '😔', '🤯', '😴'].map((emoji, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedMood(emoji)}
                                    className={`text-2xl p-4 rounded-2xl transition-all ${selectedMood === emoji ? (isRetro ? 'bg-stone-300 scale-110' : 'bg-white/10 scale-110') : 'hover:bg-white/5 active:scale-95'}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'THOUGHT':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-center relative overflow-hidden group ${isRetro ? baseRetro : 'bg-indigo-500/5 border border-white/5'}`}>
                        <Quote className={`absolute top-6 left-6 w-12 h-12 -rotate-12 group-hover:rotate-0 transition-transform duration-700 ${isRetro ? 'text-stone-300' : 'text-white/5'}`} />
                        <p className={`text-lg font-medium italic leading-relaxed relative z-10 ${textColor}`}>&quot;{data.content}&quot;</p>
                        <div className={`mt-4 text-[9px] font-black uppercase tracking-widest ${isRetro ? 'text-stone-400' : 'text-white/20'}`}>Grounding Sentiment</div>
                    </div>
                );

            case 'MEDITATION':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative ${isRetro ? baseRetro : 'bg-emerald-500/5 border border-white/5'}`}>
                        <div className="relative z-10">
                            <Sparkles className={`w-6 h-6 mb-4 ${isRetro ? 'text-emerald-700' : 'text-emerald-500/40'}`} />
                            <div className={`text-2xl font-black italic uppercase leading-tight mb-2 ${textColor}`}>2 min<br />Grounding</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${isRetro ? 'text-stone-500' : 'text-white/30'}`}>Body Scan • Breathwork</div>
                        </div>
                        <button className={`relative z-10 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isRetro ? 'bg-emerald-200 text-emerald-900 border-2 border-stone-800' : 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20'}`}>Start Overlay</button>
                        <div className={`absolute -right-10 -bottom-10 w-40 h-40 blur-3xl rounded-full ${isRetro ? 'bg-emerald-200/50' : 'bg-emerald-500/5'}`} />
                    </div>
                );

            case 'PSYCHOLOGY_BITE':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer ${isRetro ? baseRetro : 'bg-amber-500/5 border border-white/5'}`}>
                        <div>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isRetro ? 'bg-amber-200 border-2 border-stone-800' : 'bg-amber-500/10'}`}>
                                <Brain className="text-amber-500 w-5 h-5" />
                            </div>
                            <h4 className={`text-lg font-black italic uppercase leading-tight mb-2 ${textColor}`}>{data.bite.title}</h4>
                            <p className={`text-[11px] font-medium leading-relaxed uppercase ${isRetro ? 'text-stone-600' : 'text-white/40'}`}>{data.bite.desc}</p>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-widest mt-4 flex items-center gap-2 ${isRetro ? 'text-stone-500' : 'text-amber-500/40'}`}>
                            Learn more <Plus size={10} />
                        </div>
                    </div>
                );

            case 'ASK_GUIDE':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer ${isRetro ? baseRetro : 'bg-[#111] border border-white/5'}`}>
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isRetro ? 'bg-white border-2 border-white' : 'bg-white/5'}`}>
                                <MessageSquare className={`w-5 h-5 ${isRetro ? 'text-black' : 'text-blue-400'}`} />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        </div>
                        <div>
                            <div className={`text-sm font-black italic uppercase tracking-tighter mb-1 ${isRetro ? 'text-white' : 'text-white'}`}>Ask the Guide</div>
                            <p className="text-[9px] text-white/20 font-bold uppercase">Stuck with a decision?</p>
                        </div>
                    </div>
                );

            case 'POST_BOX':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-center ${isRetro ? baseRetro : 'bg-white/[0.03] border border-white/10'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer ${isRetro ? 'bg-stone-100 border-2 border-stone-800' : 'bg-white/5 border border-white/5'}`}>😶</div>
                            <input
                                type="text"
                                placeholder="Post a feeling..."
                                className={`flex-1 bg-transparent border-none focus:outline-none placeholder:text-white/20 font-medium text-lg leading-none ${isRetro ? 'placeholder:text-stone-400 text-black' : 'text-white'}`}
                            />
                            <button className={`p-4 rounded-2xl transition-transform ${isRetro ? 'bg-black text-white hover:scale-105 shadow-[2px_2px_0px_#2d2a2e]' : 'bg-white text-black hover:scale-105'}`}><Plus size={20} /></button>
                        </div>
                        <div className="mt-4 flex gap-4">
                            {['Neutral', 'Static', 'Void'].map(tag => (
                                <span key={tag} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isRetro ? 'text-stone-500 bg-stone-100 border border-stone-300' : 'text-white/20 bg-white/5'}`}>#{tag}</span>
                            ))}
                        </div>
                    </div>
                );

            case 'SOUL_SUGGESTION':
                return (
                    <div className={`h-full w-full rounded-[40px] p-6 flex items-center gap-4 group cursor-pointer transition-all ${isRetro ? `${baseRetro} hover:bg-stone-50` : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'}`}>
                        <div className={`w-12 h-12 rounded-full bg-black border border-white/10 relative overflow-hidden ${isRetro ? 'border-2 border-stone-800' : ''}`}>
                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`} alt="User" fill className="object-cover" />
                            <div className="absolute -bottom-1 -right-1 text-[10px]">🌙</div>
                        </div>
                        <div>
                            <div className={`text-xs font-black italic truncate uppercase ${textColor}`}>Someone New</div>
                            <div className={`text-[9px] font-bold uppercase ${isRetro ? 'text-stone-500' : 'text-white/20'}`}>Feeling similar today</div>
                        </div>
                        <UserPlus size={14} className={`ml-auto transition-colors ${isRetro ? 'text-stone-400 group-hover:text-black' : 'text-white/20 group-hover:text-white'}`} />
                    </div>
                );

            case 'GROUNDING_TOOL':
                return (
                    <div className={`h-full w-full rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer ${isRetro ? baseRetro : 'bg-rose-500/5 border border-white/5'}`}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isRetro ? 'bg-rose-200 border-2 border-stone-800' : 'bg-rose-500/10'}`}>
                            <Hand className="text-rose-500 w-5 h-5" />
                        </div>
                        <div>
                            <div className={`text-sm font-black italic uppercase tracking-tighter mb-1 ${textColor}`}>Reset Technique</div>
                            <p className="text-[10px] text-rose-500/60 font-bold uppercase leading-tight">{data.tool}</p>
                        </div>
                    </div>
                );

            case 'TIME_CAPSULE':
                return (
                    <div className={`h-full w-full rounded-[40px] p-6 overflow-hidden relative ${isRetro ? baseRetro : 'bg-purple-900/10 border border-white/5'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${isRetro ? 'bg-purple-200 text-purple-900 border border-purple-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                    <Clock size={16} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${textColor}`}>Time Capsule</span>
                            </div>
                            <div className="flex-1 overflow-visible">
                                <TimeCapsule />
                            </div>
                        </div>
                    </div>
                );

            case 'TUTORIAL':
                return (
                    <div className={`h-full w-full rounded-[40px] p-6 overflow-hidden relative ${isRetro ? baseRetro : 'bg-emerald-900/10 border border-white/5'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${isRetro ? 'bg-emerald-200 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                    <Brain size={16} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${textColor}`}>Mind Lab</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <QuestBoard />
                            </div>
                        </div>
                    </div>
                );
            case 'AUDIO':
                return (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`h-full w-full rounded-[32px] p-5 flex items-center gap-3 cursor-pointer group ${isRetro ? baseRetro : `${data.audio.color} border border-white/5`}`}
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isRetro ? 'bg-white/50 text-black border border-stone-800' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                            {data.audio.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-[10px] font-black italic uppercase tracking-tighter truncate ${textColor}`}>{data.audio.name}</div>
                            <div className={`text-[8px] font-bold uppercase tracking-widest ${isRetro ? 'text-stone-500' : 'text-white/20'}`}>Ambient</div>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${isRetro ? 'bg-stone-400 group-hover:bg-rose-500' : 'bg-white/10 group-hover:bg-rose-500 group-hover:animate-pulse'}`} />
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-32 pb-40"
        >
            <div className="max-w-4xl mx-auto w-full">
                {/* Search Header */}
                <div className={`sticky top-0 z-20 -mx-6 px-6 pt-4 pb-12 mb-4 ${isRetro ? 'bg-[#fef9c3]/95 backdrop-blur-xl border-b-2 border-stone-800' : 'bg-black/40 backdrop-blur-3xl'}`}>
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-xl relative group">
                            <div className={`absolute -inset-1 rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 ${isRetro ? 'bg-stone-500/20' : 'bg-white/[0.05]'}`} />
                            <div className="relative flex items-center">
                                <Search className={`absolute left-6 w-5 h-5 transition-colors ${isRetro ? 'text-stone-500 group-focus-within:text-black' : 'text-white/20 group-focus-within:text-white'}`} />
                                <input
                                    type="text"
                                    placeholder="Search souls, moods, thoughts..."
                                    className={`w-full h-16 rounded-[24px] pl-16 pr-8 border focus:outline-none transition-all font-medium text-base shadow-2xl ${isRetro ? 'bg-white border-2 border-stone-800 text-black placeholder:text-stone-400 focus:bg-white' : 'bg-white/[0.03] border-white/5 text-white placeholder:text-white/20 focus:bg-white/[0.05]'}`}
                                />
                            </div>
                        </div>

                        {/* Social Tabs */}
                        <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar w-full justify-center pb-2">
                            {[
                                { id: 'discover' as const, label: 'Discover', icon: Sparkles },
                                { id: 'trending' as const, label: 'Trending', icon: Zap },
                                { id: 'hashtags' as const, label: 'Hashtags', icon: Hash },
                                { id: 'people' as const, label: 'People', icon: UserPlus },
                            ].map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
                                        ? (isRetro ? 'bg-black text-white shadow-[2px_2px_0px_#2d2a2e]' : 'bg-white text-black shadow-xl')
                                        : (isRetro ? 'bg-white border-2 border-stone-800 text-stone-600 hover:bg-stone-100' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10')
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Based on Active Tab */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'discover' && (
                            <>
                                {/* Discovery Grid */}
                                <div className="grid grid-cols-2 gap-4 auto-rows-[140px]">
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (idx % 10) * 0.05 }}
                                            className={`${item.colSpan === 2 ? 'col-span-2' : 'col-span-1'} ${item.rowSpan === 2 ? 'row-span-2' : 'row-span-1'}`}
                                        >
                                            {renderWidget(item)}
                                        </motion.div>
                                    ))}

                                    {/* Infinite Scroll Indicator */}
                                    {isLoading && (
                                        <div className="col-span-2 flex justify-center py-10">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-white/5 border-t-white/20 rounded-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'trending' && <TrendingPosts />}

                        {activeTab === 'hashtags' && (
                            <HashtagFeed
                                selectedTag={selectedHashtag}
                                onTagSelect={setSelectedHashtag}
                            />
                        )}

                        {activeTab === 'people' && <UserRecommendations />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
