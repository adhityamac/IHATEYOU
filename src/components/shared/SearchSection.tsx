'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sparkles,
    Plus,
    Palette,
    Layout,
    Play,
    Music,
    Phone,
    MessageCircle,
    Video,
    Radio,
    Zap,
    Ghost,
    Clock,
    Calendar,
    Smile,
    Image,
    Camera,
    Brush,
    Wind,
    Quote,
    Brain,
    UserPlus,
    Volume2,
    Heart,
    Hand,
    MessageSquare,
    Hash
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import TrendingPosts from '@/features/social/components/TrendingPosts';
import HashtagFeed from '@/features/social/components/HashtagFeed';
import UserRecommendations from '@/features/social/components/UserRecommendations';
import { useSignals } from '@/hooks/useSignals';
import { useAlgorithm } from '@/hooks/useAlgorithm';

interface SearchSectionProps {
    feedPosts: any[];
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
    | 'AUDIO';

interface WidgetItem {
    id: string;
    type: WidgetType;
    colSpan: number;
    rowSpan: number;
    data: any;
}

export default function SearchSection({ feedPosts }: SearchSectionProps) {
    // Stable ID counter for widgets
    const INITIAL_ID = 2025122300000;
    const idCounter = useRef(INITIAL_ID);
    const { trackTool, trackContent } = useSignals('user-1');
    const { state: emotionalState, decision: algoDecision } = useAlgorithm('user-1');

    const [activeMood, setActiveMood] = useState('All');
    const [items, setItems] = useState<WidgetItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'discover' | 'trending' | 'hashtags' | 'people'>('discover');
    const [selectedHashtag, setSelectedHashtag] = useState<string | undefined>();

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

    const generateWidgets = (count: number) => {
        const isOverwhelmed = emotionalState?.primaryState === 'emotionally_overloaded' || emotionalState?.primaryState === 'socially_cautious';

        const types: WidgetType[] = isOverwhelmed
            ? ['PAUSE_BREATHE', 'THOUGHT', 'MEDITATION', 'GROUNDING_TOOL', 'AUDIO'] // Calming tools only
            : ['PAUSE_BREATHE', 'MOOD_CHECKIN', 'THOUGHT', 'MEDITATION', 'PSYCHOLOGY_BITE', 'ASK_GUIDE', 'POST_BOX', 'SOUL_SUGGESTION', 'GROUNDING_TOOL', 'AUDIO'];

        return Array.from({ length: count }).map((_, i) => {
            const type = types[Math.floor(Math.random() * types.length)];
            let colSpan = 1;
            let rowSpan = 1;

            // Layout variations influenced by algorithm
            if (type === 'POST_BOX' || type === 'MOOD_CHECKIN') colSpan = 2;
            if (type === 'MEDITATION' || type === 'PSYCHOLOGY_BITE') rowSpan = 2;
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
    };

    useEffect(() => {
        setItems(generateWidgets(algoDecision?.postsPerPage || 12));
    }, [emotionalState?.primaryState]);

    useEffect(() => {
        if (activeTab !== 'discover') {
            trackTool(`search_${activeTab}`, 0);
        }
    }, [activeTab]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
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

        switch (type) {
            case 'PAUSE_BREATHE':
                return (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setIsBreathing(true)}
                        className="h-full w-full bg-[#1a1a1a] border border-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden"
                    >
                        <Wind className={`w-8 h-8 text-rose-400/50 mb-3 ${isBreathing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                        <div className="text-white font-black uppercase text-[10px] tracking-widest mb-1">Pause. Breathe.</div>
                        <div className="text-white/30 text-[9px] font-bold uppercase tracking-tight">30s Reset</div>

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
                    <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between">
                        <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">How are you right now?</div>
                        <div className="flex justify-between items-center mt-4">
                            {['😊', '😔', '🤯', '😴'].map((emoji, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedMood(emoji)}
                                    className={`text-2xl p-4 rounded-2xl transition-all ${selectedMood === emoji ? 'bg-white/10 scale-110' : 'hover:bg-white/5 active:scale-95'}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'THOUGHT':
                return (
                    <div className="h-full w-full bg-indigo-500/5 border border-white/5 rounded-[40px] p-8 flex flex-col justify-center relative overflow-hidden group">
                        <Quote className="absolute top-6 left-6 w-12 h-12 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <p className="text-lg font-medium text-white/70 italic leading-relaxed relative z-10">"{data.content}"</p>
                        <div className="mt-4 text-[9px] text-white/20 font-black uppercase tracking-widest">Grounding Sentiment</div>
                    </div>
                );

            case 'MEDITATION':
                return (
                    <div className="h-full w-full bg-emerald-500/5 border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
                        <div className="relative z-10">
                            <Sparkles className="text-emerald-500/40 w-6 h-6 mb-4" />
                            <div className="text-2xl font-black text-white italic uppercase leading-tight mb-2">2 min<br />Grounding</div>
                            <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Body Scan • Breathwork</div>
                        </div>
                        <button className="relative z-10 w-full py-4 rounded-2xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest group-hover:bg-emerald-500/20 transition-all">Start Overlay</button>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full" />
                    </div>
                );

            case 'PSYCHOLOGY_BITE':
                return (
                    <div className="h-full w-full bg-amber-500/5 border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer">
                        <div>
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="text-amber-500 w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-black text-white italic uppercase leading-tight mb-2">{data.bite.title}</h4>
                            <p className="text-[11px] text-white/40 font-medium leading-relaxed uppercase">{data.bite.desc}</p>
                        </div>
                        <div className="text-[9px] text-amber-500/40 font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                            Learn more <Plus size={10} />
                        </div>
                    </div>
                );

            case 'ASK_GUIDE':
                return (
                    <div className="h-full w-full bg-[#111] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                                <MessageSquare className="text-blue-400 w-5 h-5" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        </div>
                        <div>
                            <div className="text-sm font-black text-white italic uppercase tracking-tighter mb-1">Ask the Guide</div>
                            <p className="text-[9px] text-white/20 font-bold uppercase">Stuck with a decision?</p>
                        </div>
                    </div>
                );

            case 'POST_BOX':
                return (
                    <div className="h-full w-full bg-white/[0.03] border border-white/10 rounded-[40px] p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer">😶</div>
                            <input
                                type="text"
                                placeholder="Post a feeling..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-white/20 font-medium text-lg leading-none"
                            />
                            <button className="p-4 rounded-2xl bg-white text-black hover:scale-105 transition-transform"><Plus size={20} /></button>
                        </div>
                        <div className="mt-4 flex gap-4">
                            {['Neutral', 'Static', 'Void'].map(tag => (
                                <span key={tag} className="text-[9px] font-black text-white/20 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">#{tag}</span>
                            ))}
                        </div>
                    </div>
                );

            case 'SOUL_SUGGESTION':
                return (
                    <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex items-center gap-4 group cursor-pointer hover:bg-white/[0.04] transition-all">
                        <div className="w-12 h-12 rounded-full bg-black border border-white/10 relative">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`} className="w-full h-full" />
                            <div className="absolute -bottom-1 -right-1 text-[10px]">🌙</div>
                        </div>
                        <div>
                            <div className="text-xs font-black text-white italic truncate uppercase">Someone New</div>
                            <div className="text-[9px] text-white/20 font-bold uppercase">Feeling similar today</div>
                        </div>
                        <UserPlus size={14} className="ml-auto text-white/20 group-hover:text-white transition-colors" />
                    </div>
                );

            case 'GROUNDING_TOOL':
                return (
                    <div className="h-full w-full bg-rose-500/5 border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group cursor-pointer">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                            <Hand className="text-rose-500 w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-black text-white italic uppercase tracking-tighter mb-1">Reset Technique</div>
                            <p className="text-[10px] text-rose-500/60 font-bold uppercase leading-tight">{data.tool}</p>
                        </div>
                    </div>
                );

            case 'AUDIO':
                return (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`h-full w-full ${data.audio.color} border border-white/5 rounded-[32px] p-5 flex items-center gap-3 cursor-pointer group`}
                    >
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                            {data.audio.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-black text-white italic uppercase tracking-tighter truncate">{data.audio.name}</div>
                            <div className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Ambient</div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-rose-500 group-hover:animate-pulse transition-all" />
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
                <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-3xl -mx-6 px-6 pt-4 pb-12 mb-4">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-xl relative group">
                            <div className="absolute -inset-1 bg-white/[0.05] rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                            <div className="relative flex items-center">
                                <Search className="absolute left-6 text-white/20 w-5 h-5 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search souls, moods, thoughts..."
                                    className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-[24px] pl-16 pr-8 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.05] transition-all font-medium text-base shadow-2xl"
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
                                        ? 'bg-white text-black shadow-xl'
                                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
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
