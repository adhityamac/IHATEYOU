'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Send, Heart, MessageCircle, Share2, Search, Bell, Plus, Users, User, MoreHorizontal, Smile } from 'lucide-react';
// @ts-ignore
import * as ReactWindow from 'react-window';
// @ts-ignore
import * as AutoSizerPkg from 'react-virtualized-auto-sizer';
const FixedSizeList = ReactWindow.FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
const AutoSizer = (AutoSizerPkg as any).default || AutoSizerPkg.AutoSizer || AutoSizerPkg;

// Palette and Grid Configuration (matching EmotionalCheckIn)
const SPRITE_CONFIG = {
    cols: 5,
    rows: 6,
    scale: 1,
};

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

const EmotionFace = ({ emotion, index }: { emotion: typeof emotions[0], index: number }) => {
    const { row, col } = emotion.gridPos || { row: 0, col: 0 };
    const xPosition = (col / (SPRITE_CONFIG.cols - 1)) * 100;
    const yPosition = (row / (SPRITE_CONFIG.rows - 1)) * 100;

    return (
        <div
            className="w-full h-full rounded-full overflow-hidden relative shadow-inner flex items-center justify-center bg-[#feda59]"
        >
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

export default function UnifiedHome() {
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([
        { id: 1, user: 'alex', emoji: emotions[1], content: 'Feeling a bit more like myself today. Small steps.', time: '2h', likes: 12, comments: 4 },
        { id: 2, user: 'ghost', emoji: emotions[3], content: 'Replaying the same thoughts in my head. Why is it so loud?', time: '5h', likes: 8, comments: 2 },
        { id: 3, user: 'Luna', emoji: emotions[5], content: 'The silence here is loud today. 🌌', time: '1d', likes: 45, comments: 15 }
    ]);
    // Use a constant for initial ID (safe for SSR)
    const INITIAL_ID = 2025122300000;
    const idCounter = useRef(INITIAL_ID);

    const handleSend = () => {
        if (!postText.trim()) return;
        const selected = emotions.find(e => e.id === selectedEmoji) || emotions[0];
        idCounter.current += 1;
        const newPost = {
            id: idCounter.current,
            user: 'you',
            emoji: selected,
            content: postText,
            time: 'Just now',
            likes: 0,
            comments: 0
        };
        setPosts([newPost, ...posts]);
        setPostText('');
        setSelectedEmoji(null);
    };

    const PostRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const post = posts[index];
        return (
            <div style={{ ...style, paddingBottom: '20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[48px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all relative overflow-hidden group shadow-xl mx-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 relative group-hover:scale-110 transition-transform duration-500">
                                <EmotionFace emotion={post.emoji} index={index} />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-[#FEDA59] rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg tracking-tight">@{post.user}</h4>
                                <p className="text-[10px] text-white/20 uppercase tracking-widest font-black leading-none mt-1">{post.emoji.name} • {post.time} ago</p>
                            </div>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    <p className="text-2xl text-white/80 leading-relaxed font-bold italic mb-10 pl-2 border-l-2 border-white/5">
                        "{post.content}"
                    </p>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-[11px] font-bold text-white/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5 uppercase tracking-widest">
                            <Heart size={14} /> {post.likes}
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-[11px] font-bold text-white/30 hover:bg-blue-500/10 hover:text-blue-500 transition-all border border-white/5 uppercase tracking-widest">
                            <MessageCircle size={14} /> {post.comments}
                        </button>
                        <button className="ml-auto w-12 h-12 flex items-center justify-center text-white/10 hover:text-white/40 transition-all">
                            <Share2 size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
            {/* Header Area */}
            <div className="p-8 flex items-center justify-between pb-4">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">IHATEYOU</h1>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mt-2 font-bold">Neural Home Interface</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                        <Search size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full" />
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto px-8 pb-4 pt-4 custom-scrollbar">

                {/* Emoji Grid (from wireframe) */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black">Current Presence</h2>
                        <span className="text-[10px] text-white/10 uppercase tracking-widest font-bold">5x8 Cluster</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                        {emotions.map((emotion, i) => (
                            <motion.button
                                key={emotion.id}
                                whileHover={{ scale: 1.1, rotate: 0 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedEmoji(emotion.id)}
                                className={`aspect-square rounded-full transition-all duration-500 relative ${selectedEmoji === emotion.id
                                    ? 'ring-4 ring-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)] z-10'
                                    : 'opacity-40 hover:opacity-100'
                                    }`}
                            >
                                <EmotionFace emotion={emotion} index={i} />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Combined Post Area (from wireframe) */}
                <div className="mb-12">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center flex-shrink-0">
                                {selectedEmoji ? (
                                    <div className="w-10 h-10">
                                        <EmotionFace emotion={emotions.find(e => e.id === selectedEmoji)!} index={0} />
                                    </div>
                                ) : (
                                    <Smile className="text-white/20" size={24} />
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    placeholder={selectedEmoji ? `"${emotions.find(e => e.id === selectedEmoji)?.prompt}"` : "Speak to the void..."}
                                    className="w-full bg-transparent border-none text-xl text-white placeholder:text-white/5 focus:outline-none resize-none h-24 font-bold leading-tight"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"><Plus size={18} /></button>
                                        <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"><Users size={18} /></button>
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!postText.trim()}
                                        className="px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-20 flex items-center gap-2"
                                    >
                                        <Send size={14} fill="currentColor" /> Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integrated Vertical Feed (from wireframe) */}
                <div className="h-[600px] w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Neural Feed</h2>
                        <div className="h-[1px] flex-1 mx-8 bg-white/5" />
                    </div>

                    <AutoSizer>
                        {({ height, width }: { height: number; width: number }) => (
                            <FixedSizeList
                                height={height}
                                width={width}
                                itemCount={posts.length}
                                itemSize={350} // Approximate height of a post card
                            >
                                {PostRow}
                            </FixedSizeList>
                        )}
                    </AutoSizer>
                </div>

            </div>
        </div>
    );
}
