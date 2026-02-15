'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Heart, MessageCircle, Share2, Search, Bell, Plus, Users, MoreHorizontal, Smile, Home, Compass, User, Settings } from 'lucide-react';
import Link from 'next/link';
import * as ReactWindow from 'react-window';
import * as AutoSizerPkg from 'react-virtualized-auto-sizer';

const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
const AutoSizer = (AutoSizerPkg as any).default || (AutoSizerPkg as any).AutoSizer || AutoSizerPkg;
import LiquidImage from '@/components/backgrounds/LiquidImage';
import { isLowEndDevice } from '@/lib/utils/performance';
import { FloatingDock } from '../ui/FloatingDock';
import { PhotogradientBackground } from '@/components/backgrounds/PhotogradientBackground';

// --- Configuration ---
const SPRITE_CONFIG = { cols: 5, rows: 6, scale: 1 };
const emotions = [
    { id: 'calm', name: 'Calm', color: '#A8C5E0', prompt: 'What is keeping you still?', gridPos: { row: 0, col: 3 } },
    { id: 'joyful', name: 'Joyful', color: '#F5A8C8', prompt: 'Share a moment of light.', gridPos: { row: 0, col: 0 } },
    { id: 'detached', name: 'Detached', color: '#B8B8C8', prompt: 'Where is your mind drifting?', gridPos: { row: 4, col: 0 } },
    { id: 'overthinking', name: 'Overthinking', color: '#C8A8E8', prompt: 'What loop are you stuck in?', gridPos: { row: 1, col: 2 } },
    { id: 'drained', name: 'Drained', color: '#A8B8C8', prompt: 'What took your energy today?', gridPos: { row: 1, col: 3 } },
    { id: 'lonely', name: 'Lonely', color: '#8898B8', prompt: 'What does the silence say?', gridPos: { row: 5, col: 1 } },
    { id: 'invisible', name: 'Invisible', color: '#98A8B8', prompt: 'Speak to the space around you.', gridPos: { row: 4, col: 1 } },
    { id: 'confident', name: 'Confident', color: '#F8C888', prompt: 'What is your strength today?', gridPos: { row: 3, col: 1 } },
];

// --- Sub-Components ---
export const EmotionFace = ({ emotion }: { emotion: typeof emotions[0], index?: number }) => {
    const { row, col } = emotion.gridPos || { row: 0, col: 0 };
    const xPosition = (col / (SPRITE_CONFIG.cols - 1)) * 100;
    const yPosition = (row / (SPRITE_CONFIG.rows - 1)) * 100;

    return (
        <div className="w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center bg-[#feda59]">
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/custom-emojis.png)',
                    backgroundSize: `${SPRITE_CONFIG.cols * 100}% ${SPRITE_CONFIG.rows * 100}%`,
                    backgroundPosition: `${xPosition}% ${yPosition}%`,
                    backgroundRepeat: 'no-repeat',
                    transform: `scale(1.6)`,
                    transformOrigin: '50% 50%',
                }}
            />
        </div>
    );
};

const PostRow = ({ index, style, data }: { index: number; style: React.CSSProperties; data: any[] }) => {
    const post = data[index];
    return (
        <div style={{ ...style, paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-[40px] bg-[#0A0A0C]/60 backdrop-blur-xl border border-white/5 hover:bg-[#0A0A0C]/80 transition-all relative overflow-hidden group shadow-2xl"
            >
                {/* Gradient Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-[50px] group-hover:bg-rose-500/20 transition-colors" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-500 rounded-full ring-2 ring-white/5 p-0.5">
                            <EmotionFace emotion={post.emoji} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-base tracking-tight">@{post.user}</h4>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">{post.emoji.name} • {post.time}</p>
                        </div>
                    </div>
                    <button aria-label="More options" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                <p className="text-xl text-white/90 leading-relaxed font-medium mb-8 relative z-10">
                    {post.content}
                </p>

                <div className="flex gap-3 relative z-10">
                    <button aria-label="Like post" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-[10px] font-bold text-white/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5 uppercase tracking-widest group/btn">
                        <Heart size={14} className="group-hover/btn:scale-110 transition-transform" /> {post.likes}
                    </button>
                    <button aria-label="Comment" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-[10px] font-bold text-white/40 hover:bg-blue-500/10 hover:text-blue-500 transition-all border border-white/5 uppercase tracking-widest">
                        <MessageCircle size={14} /> {post.comments}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default function UnifiedHome() {
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([
        { id: 1, user: 'alex', emoji: emotions[1], content: 'Feeling a bit more like myself today. Small steps.', time: '2h', likes: 12, comments: 4 },
        { id: 2, user: 'ghost', emoji: emotions[3], content: 'Replaying the same thoughts in my head. Why is it so loud?', time: '5h', likes: 8, comments: 2 },
        { id: 3, user: 'Luna', emoji: emotions[5], content: 'The silence here is loud today. 🌌', time: '1d', likes: 45, comments: 15 }
    ]);
    const idCounter = useRef(2025122300000);
    const [isLowEnd, setIsLowEnd] = useState(false);

    useEffect(() => {
        setIsLowEnd(isLowEndDevice());
    }, []);

    const handleSend = () => {
        if (!postText.trim()) return;
        const selected = emotions.find(e => e.id === selectedEmoji) || emotions[0];
        idCounter.current += 1;
        setPosts([{
            id: idCounter.current,
            user: 'you',
            emoji: selected,
            content: postText,
            time: 'Just now',
            likes: 0,
            comments: 0
        }, ...posts]);
        setPostText('');
        setSelectedEmoji(null);
    };

    const dockItems = [
        { icon: <Home size={18} />, label: 'Home', onClick: () => { }, active: true },
        { icon: <Compass size={18} />, label: 'Explore', onClick: () => { } },
        { icon: <Plus size={18} />, label: 'Create', onClick: () => { } },
        { icon: <Bell size={18} />, label: 'Alerts', onClick: () => { }, badge: 2 },
        { icon: <User size={18} />, label: 'Profile', onClick: () => { } },
    ];

    return (
        <PhotogradientBackground className="flex-1 flex flex-col font-sans selection:bg-rose-500/30" showLiquid={true}>
            {/* Header */}
            <header className="px-6 py-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <span className="font-black italic text-white text-lg">ih</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white leading-none tracking-tight">IHATEYOU</h1>
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Neural Interface</p>
                    </div>
                </div>
                <button aria-label="Settings" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <Settings size={18} />
                </button>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-32">
                <div className="max-w-2xl mx-auto w-full">

                    {/* Creation Area */}
                    <div className="px-6 mb-12">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2">How do you feel?</h2>
                        </div>

                        {/* Emoji Slider */}
                        <div className="flex gap-4 overflow-x-auto pb-6 px-2 snap-x scrollbar-hide">
                            {emotions.map((emotion, i) => (
                                <motion.button
                                    key={emotion.id}
                                    aria-label={emotion.name}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedEmoji(emotion.id)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-2xl p-0.5 transition-all relative snap-center ${selectedEmoji === emotion.id
                                        ? 'bg-gradient-to-b from-white to-white/50 shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-110'
                                        : 'bg-white/5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                                        }`}
                                >
                                    <div className="w-full h-full rounded-[14px] overflow-hidden bg-black/50">
                                        <EmotionFace emotion={emotion} index={i} />
                                    </div>
                                    {selectedEmoji === emotion.id && (
                                        <motion.div layoutId="activeEmoji" className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
                                                {emotion.name}
                                            </span>
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Input Box */}
                        <AnimatePresence>
                            <motion.div
                                layout
                                className={`bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl transition-all duration-500 overflow-hidden relative group ${selectedEmoji ? 'ring-2 ring-white/10' : ''
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

                                <textarea
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    placeholder={selectedEmoji ? `"${emotions.find(e => e.id === selectedEmoji)?.prompt}"` : "Tap an emotion above..."}
                                    className="w-full bg-transparent border-none text-lg text-white placeholder:text-white/20 focus:outline-none resize-none h-24 font-medium leading-relaxed"
                                />

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        <button aria-label="Add attachment" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!postText.trim()}
                                        className="px-6 py-2 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-20 disabled:scale-95 flex items-center gap-2"
                                    >
                                        Share <ArrowRightIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Feed Header */}
                    <div className="px-8 mb-6 flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Neural Stream</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Virtualized Feed */}
                    <div style={{ height: '800px', width: '100%' }}>
                        <AutoSizer>
                            {({ height, width }: { height: number; width: number }) => (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={posts.length}
                                    itemSize={300} // Approximate height
                                    itemData={posts}
                                >
                                    {PostRow}
                                </List>
                            )}
                        </AutoSizer>
                    </div>
                </div>
            </div>

            {/* Floating Dock Navigation */}
            <FloatingDock items={dockItems} />
        </PhotogradientBackground>
    );
}

function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
