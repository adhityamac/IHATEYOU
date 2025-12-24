'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Plus, MessageCircle, User, Trash2, Edit3, Zap, Play, Copy, Check, Gamepad2, ArrowRight, MessageSquare, X, Send, EyeOff, Timer, Smile } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import SynapseMap from '@/components/shared/SynapseMap';
import NeuralAura from '@/components/backgrounds/NeuralAura';
import { useSignals } from '@/hooks/useSignals';

// Yellow Emoji Grid Configuration
const SPRITE_CONFIG = {
    cols: 5,
    rows: 6,
    scale: 1,
};

// Emotional Mapping
const emotions = [
    { id: 'joyful', name: 'Joyful', color: '#F5A8C8', sentence: 'Light feels possible today.', prompt: 'Share a moment of light.', gridPos: { row: 0, col: 3 } },
    { id: 'loved', name: 'Loved', color: '#F8B8C8', sentence: 'Held by something bigger.', prompt: 'Who makes you feel seen?', gridPos: { row: 0, col: 2 } },
    { id: 'nostalgic', name: 'Nostalgic', color: '#D8B8A8', sentence: 'Visiting places that don\'t exist.', prompt: 'Where have you gone back to?', gridPos: { row: 1, col: 1 } },
    { id: 'calm', name: 'Calm', color: '#A8C5E0', sentence: 'Quiet, but not at peace.', prompt: 'What is keeping you still?', gridPos: { row: 1, col: 0 } },
    { id: 'peaceful', name: 'Peaceful', color: '#B8E8D8', sentence: 'Finally, a moment of quiet.', prompt: 'Where did you find peace?', gridPos: { row: 4, col: 0 } },
    { id: 'grateful', name: 'Grateful', color: '#E8D8A8', sentence: 'Small things feel big today.', prompt: 'What are you thankful for?', gridPos: { row: 0, col: 4 } },

    { id: 'restless', name: 'Restless', color: '#C0C0E8', sentence: 'Skin feels too tight.', prompt: 'What is pulling at you?', gridPos: { row: 2, col: 0 } },
    { id: 'overthinking', name: 'Overthinking', color: '#C8A8E8', sentence: 'Stuck in loops again.', prompt: 'What loop are you stuck in?', gridPos: { row: 1, col: 3 } },
    { id: 'drained', name: 'Drained', color: '#A8B8C8', sentence: 'Running on empty.', prompt: 'What took your energy today?', gridPos: { row: 1, col: 4 } },

    { id: 'hurt', name: 'Hurt', color: '#E8A898', sentence: 'Still processing the ache.', prompt: 'Where does it hurt the most?', gridPos: { row: 2, col: 4 } },
    { id: 'excited', name: 'Excited', color: '#F8D8A8', sentence: 'Buzzing with possibility.', prompt: 'What has you energized?', gridPos: { row: 0, col: 1 } },
    { id: 'overwhelmed', name: 'Overwhelmed', color: '#D8A8B8', sentence: 'Drowning in everything.', prompt: 'What is too much right now?', gridPos: { row: 1, col: 2 } },
    { id: 'anxious', name: 'Anxious', color: '#E8B898', sentence: 'Everything feels too much.', prompt: 'Focus on one small thing.', gridPos: { row: 2, col: 1 } },

    { id: 'confident', name: 'Confident', color: '#F8C888', sentence: 'I know who I am.', prompt: 'What is your strength today?', gridPos: { row: 3, col: 1 } },
    { id: 'angry', name: 'Angry', color: '#E89888', sentence: 'Fire beneath the surface.', prompt: 'Let the fire speak.', gridPos: { row: 3, col: 2 } },
    { id: 'brave', name: 'Brave', color: '#F8A888', sentence: 'Doing it even with the fear.', prompt: 'What are you facing today?', gridPos: { row: 0, col: 0 } },

    { id: 'detached', name: 'Detached', color: '#B8B8C8', sentence: 'Here, but not really.', prompt: 'Where is your mind drifting?', gridPos: { row: 2, col: 2 } },
    { id: 'numb', name: 'Numb', color: '#A8A8A8', sentence: 'Feeling nothing at all.', prompt: 'Describe the void.', gridPos: { row: 4, col: 2 } },
    { id: 'empty', name: 'Empty', color: '#98A8A8', sentence: 'Hollow inside.', prompt: 'What is missing?', gridPos: { row: 5, col: 1 } },
    { id: 'invisible', name: 'Invisible', color: '#98A8B8', sentence: 'No one sees me today.', prompt: 'Speak to the space around you.', gridPos: { row: 3, col: 0 } },

    { id: 'hopeful', name: 'Hopeful', color: '#A8E8C0', sentence: 'Waiting for the sunrise.', prompt: 'What are you waiting for?', gridPos: { row: 4, col: 3 } },
    { id: 'lonely', name: 'Lonely', color: '#8898B8', sentence: 'Surrounded, still alone.', prompt: 'What does the silence say?', gridPos: { row: 2, col: 3 } },
    { id: 'confused', name: 'Confused', color: '#C8C8D8', sentence: 'Lost in the fog.', prompt: 'What is unclear?', gridPos: { row: 3, col: 4 } },
    { id: 'silly', name: 'Silly', color: '#FFD700', sentence: 'Just being goofy today.', prompt: 'What made you laugh?', gridPos: { row: 5, col: 3 } },
    { id: 'shy', name: 'Shy', color: '#FFB6C1', sentence: 'Feeling a bit bashful.', prompt: 'What makes you shy?', gridPos: { row: 3, col: 3 } },
    { id: 'playful', name: 'Playful', color: '#87CEEB', sentence: 'Ready to have fun.', prompt: 'What sounds fun?', gridPos: { row: 5, col: 4 } },
];

const EmotionFace = ({ emotion, isSelected }: { emotion: any, isSelected: boolean }) => {
    const { row, col } = emotion.gridPos || { row: 0, col: 0 };
    const xPosition = (col / (SPRITE_CONFIG.cols - 1)) * 100;
    const yPosition = (row / (SPRITE_CONFIG.rows - 1)) * 100;

    // Custom emojis with white backgrounds for ALL emotions
    const customEmojis: Record<string, string> = {
        'joyful': '/emoji_joyful_1766520658552.png',
        'loved': '/emoji_loved_1766520674693.png',
        'nostalgic': '/emoji_nostalgic_1766520689574.png',
        'calm': '/emoji_calm_1766520705031.png',
        'peaceful': '/emoji_peaceful_1766520720777.png',
        'grateful': '/emoji_grateful_1766520737694.png',
        'restless': '/emoji_restless_1766520752741.png',
        'overthinking': '/emoji_overthinking_1766520768316.png',
        'drained': '/emoji_drained_1766520783032.png',
        'hurt': '/emoji_hurt_1766520798376.png',
        'excited': '/emoji_excited_1766520813550.png',
        'overwhelmed': '/emoji_overwhelmed_1766520828544.png',
        'anxious': '/emoji_anxious_1766520842318.png',
        'confident': '/emoji_confident_1766520856667.png',
        'angry': '/emoji_angry_1766520875584.png',
        'brave': '/emoji_brave_1766520892414.png',
        'detached': '/emoji_detached_1766520908903.png',
        'numb': '/emoji_numb_1766520925821.png',
        'empty': '/emoji_empty_1766520943864.png',
        'invisible': '/emoji_invisible_1766520959192.png',
        'hopeful': '/emoji_hopeful_1766520974750.png',
        // Fallback to sprite for remaining emotions (lonely, confused, silly, shy, playful)
    };

    const hasCustomEmoji = customEmojis[emotion.id];

    return (
        <div className="w-full h-full rounded-full overflow-hidden relative shadow-lg flex items-center justify-center bg-transparent">
            {hasCustomEmoji ? (
                <img
                    src={hasCustomEmoji}
                    alt={emotion.name}
                    className="w-full h-full object-cover"
                    style={{
                        transform: 'scale(1.0)',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(/emotion-emojis.jpg)',
                        backgroundSize: `${SPRITE_CONFIG.cols * 100}% ${SPRITE_CONFIG.rows * 100}%`,
                        backgroundPosition: `${xPosition}% ${yPosition}%`,
                        backgroundRepeat: 'no-repeat',
                        transform: `scale(1.15)`,
                        transformOrigin: '50% 50%',
                    }}
                />
            )}
            {isSelected && <div className="absolute inset-0 bg-white/20 border-4 border-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.9)]" />}
        </div>
    );
};

const getChannelForEmotion = (emotionId: string) => {
    const light = ['joyful', 'loved', 'calm', 'peaceful', 'grateful', 'excited', 'confident', 'brave', 'hopeful'];
    const heavy = ['hurt', 'angry', 'lonely', 'drained', 'empty'];
    const static_noise = ['restless', 'overthinking', 'overwhelmed', 'anxious', 'confused'];

    if (light.includes(emotionId)) return 'Light';
    if (heavy.includes(emotionId)) return 'Heavy';
    if (static_noise.includes(emotionId)) return 'Static';
    return 'Void';
};

export default function EmotionalCheckIn() {
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const { trackMood, trackTool } = useSignals('user-1'); // Using fixed ID for demo
    const [activeNav, setActiveNav] = useState('checkin');
    const [showPostingArea, setShowPostingArea] = useState(false);
    const [postText, setPostText] = useState('');
    const [myPosts, setMyPosts] = useState<any[]>([]);
    // Use a constant for initial ID (safe for SSR)
    const INITIAL_ID = 2025122300000;
    const idCounter = useRef(INITIAL_ID);
    const [interactions, setInteractions] = useState<Record<number, string[]>>({});
    const [username, setUsername] = useState('Guest');
    const [feedView, setFeedView] = useState<'list' | 'map'>('list');
    const [userBio, setUserBio] = useState('Existing in the digital void.');
    const [userAvatar, setUserAvatar] = useState('calm');
    const [mapTimeOffset, setMapTimeOffset] = useState(0);
    const [currentArchetype, setCurrentArchetype] = useState('The Balanced Observer');
    const [activeChannel, setActiveChannel] = useState('All');
    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState<Record<number, any[]>>({
        1: [{ id: 101, username: 'echo_zero', content: 'I feel this deeply.', timestamp: '1h ago' }]
    });
    const [activeWhispers, setActiveWhispers] = useState<{ id: number, sender: string, recipient: string, content: string, expiresAt: number }[]>([]);
    const [whisperTarget, setWhisperTarget] = useState<string | null>(null);
    const [whisperText, setWhisperText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedName = localStorage.getItem('user_identity');
            const savedBio = localStorage.getItem('user_bio');
            const savedAvatar = localStorage.getItem('user_avatar');
            const savedPosts = localStorage.getItem('user_posts');

            if (savedName) setUsername(savedName);
            if (savedBio) setUserBio(savedBio);
            if (savedAvatar) setUserAvatar(savedAvatar);
            if (savedPosts) setMyPosts(JSON.parse(savedPosts));
        }
    }, []);

    // Timer state for whispers
    const [now, setNow] = useState(INITIAL_ID);
    useEffect(() => {
        setNow(Date.now());
    }, []);
    useEffect(() => {
        if (activeWhispers.length === 0) return;
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 100);
        return () => clearInterval(interval);
    }, [activeWhispers.length]);
    useEffect(() => {
        setActiveWhispers(prev => prev.filter(w => w.expiresAt > now));
    }, [now]);

    const selectedEmotionData = emotions.find(e => e.id === selectedEmotion);
    const avatarEmotionData = emotions.find(e => e.id === userAvatar) || emotions[0];

    const handlePost = () => {
        if (!postText.trim() || !selectedEmotionData) return;
        idCounter.current += 1;
        const newPost = {
            id: idCounter.current,
            username: username,
            emotion: selectedEmotionData,
            content: postText,
            timestamp: 'just now',
            isUserPost: true
        };
        const updatedPosts = [newPost, ...myPosts];
        setMyPosts(updatedPosts);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_posts', JSON.stringify(updatedPosts));
        }
        setPostText('');
        setShowPostingArea(false);
        setActiveNav('feed');
    };

    const deletePost = (postId: number) => {
        const updatedPosts = myPosts.filter(p => p.id !== postId);
        setMyPosts(updatedPosts);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_posts', JSON.stringify(updatedPosts));
        }
    };

    const toggleInteraction = (postId: number, action: string) => {
        setInteractions(prev => {
            const postInteractions = prev[postId] || [];
            if (postInteractions.includes(action)) {
                return { ...prev, [postId]: postInteractions.filter(a => a !== action) };
            }
            return { ...prev, [postId]: [...postInteractions, action] };
        });
    };

    const handleReply = (postId: number) => {
        if (!replyText.trim()) return;
        idCounter.current += 1;
        const newReply = {
            id: idCounter.current,
            username: username,
            content: replyText,
            timestamp: 'just now',
            isUser: true
        };
        setReplies(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newReply] }));
        setReplyText('');
    };

    const sendWhisper = () => {
        if (!whisperText.trim() || !whisperTarget) return;
        idCounter.current += 1;
        const newWhisper = {
            id: idCounter.current,
            sender: username,
            recipient: whisperTarget,
            content: whisperText,
            expiresAt: Date.now() + 15000 // 15 seconds
        };
        setActiveWhispers(prev => [...prev, newWhisper]);
        setWhisperText('');
        setWhisperTarget(null);
    };

    const streak = useMemo(() => {
        let s = 0;
        const today = new Date();
        let cursor = new Date();
        const hasToday = myPosts.some(p => new Date(p.id).toDateString() === today.toDateString());
        if (!hasToday) cursor.setDate(cursor.getDate() - 1);

        while (true) {
            const hasPost = myPosts.some(p => new Date(p.id).toDateString() === cursor.toDateString());
            if (hasPost) { s++; cursor.setDate(cursor.getDate() - 1); }
            else break;
        }
        return s;
    }, [myPosts]);

    const baseFeedPosts = [
        { id: 1, username: 'luna_sky', emotion: emotions[3], content: 'The silence here is different today.', timestamp: '2h ago' },
        { id: 2, username: 'pixel_drifter', emotion: emotions[0], content: 'Found a fragment of joy in the day.', timestamp: '5h ago' },
        { id: 3, username: 'echo_zero', emotion: emotions[22], content: 'Disconnected but present.', timestamp: '1d ago' },
    ];

    const feedPosts = [...myPosts, ...baseFeedPosts];
    const filteredPosts = feedPosts.filter(post => {
        if (activeChannel === 'All') return true;
        return getChannelForEmotion(post.emotion.id) === activeChannel;
    });

    const expandedPost = expandedPostId ? feedPosts.find(p => p.id === expandedPostId) : null;

    return (
        <div className="min-h-screen pb-40 transition-colors duration-1000" style={{ backgroundColor: selectedEmotionData ? `${selectedEmotionData.color}10` : 'transparent' }}>
            <AnimatePresence mode="wait">
                {showPostingArea ? (
                    <motion.div key="posting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl p-8 flex flex-col items-center justify-center">
                        <div className="max-w-lg w-full">
                            <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-center">Sharing your {selectedEmotionData?.name} Energy</h2>
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                autoFocus
                                className="w-full bg-transparent text-4xl font-black text-center text-white focus:outline-none resize-none min-h-[200px] italic"
                                placeholder="What's on your mind?"
                            />
                            <div className="flex gap-4 mt-12">
                                <button onClick={() => setShowPostingArea(false)} className="flex-1 py-5 rounded-2xl bg-white/5 text-white/40 font-black uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                                <button onClick={handlePost} disabled={!postText.trim()} className="flex-1 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest disabled:opacity-20 transition-all flex items-center justify-center gap-3">Share Post <ArrowRight size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                ) : activeNav === 'checkin' ? (
                    <motion.div key="checkin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-xl mx-auto pt-20">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white mb-4">Daily Check-In</h1>
                            <p className="text-white/30 font-bold tracking-widest uppercase text-[10px]">How are you feeling today, {username}?</p>
                        </div>

                        <div className="grid grid-cols-4 gap-6 mb-20">
                            {emotions.map((emotion, i) => (
                                <motion.div key={emotion.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const newEmotion = selectedEmotion === emotion.id ? null : emotion.id;
                                            setSelectedEmotion(newEmotion);
                                            if (newEmotion) trackMood(newEmotion);
                                        }}
                                        className={`w-full aspect-square rounded-full group relative transition-all duration-500 ${selectedEmotion === emotion.id ? 'scale-110 shadow-[0_0_40px_rgba(255,255,255,0.2)]' : 'scale-100 hover:scale-105'}`}
                                    >
                                        <EmotionFace emotion={emotion} isSelected={selectedEmotion === emotion.id} />
                                    </button>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedEmotion === emotion.id ? 'text-white' : 'text-white/20'}`}>{emotion.name}</span>
                                </motion.div>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedEmotionData && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="p-12 rounded-[56px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl text-center shadow-3xl">
                                    <h2 className="text-6xl font-black mb-6 tracking-tighter" style={{ color: selectedEmotionData.color }}>{selectedEmotionData.name}</h2>
                                    <p className="text-2xl text-white/50 mb-12 italic font-bold leading-tight">"{selectedEmotionData.sentence}"</p>
                                    <div className="flex flex-col gap-4">
                                        <button onClick={() => setShowPostingArea(true)} className="w-full py-6 rounded-3xl bg-white text-black font-black text-xl uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-4">Tell more <ArrowRight size={24} /></button>
                                        <button onClick={() => setActiveNav('feed')} className="w-full py-6 rounded-3xl bg-white/5 text-white/40 font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Just browse</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : activeNav === 'feed' ? (
                    <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-2xl mx-auto pt-20">
                        <AnimatePresence>
                            {whisperTarget && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-8">
                                    <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-white font-bold flex items-center gap-2"><EyeOff size={18} className="text-purple-400" /> Whisper to @{whisperTarget}</h3>
                                            <button onClick={() => setWhisperTarget(null)} className="text-white/30 hover:text-white"><X size={20} /></button>
                                        </div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Message will self-destruct in 15s</p>
                                        <textarea value={whisperText} onChange={e => setWhisperText(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 min-h-[100px] mb-6 resize-none" placeholder="Secrets go here..." autoFocus />
                                        <button onClick={sendWhisper} className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest hover:bg-purple-400 transition-colors">Send Whisper</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {expandedPost && (
                                <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col">
                                    <button onClick={() => setExpandedPostId(null)} className="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white z-50"><X size={24} /></button>

                                    <div className="flex-1 overflow-y-auto p-6 pt-20">
                                        <div className="max-w-xl mx-auto">
                                            <div className="mb-12">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-16 h-16"><EmotionFace emotion={expandedPost.emotion} isSelected={false} /></div>
                                                    <div>
                                                        <div className="text-2xl font-bold text-white">@{expandedPost.username}</div>
                                                        <div className="text-xs text-white/30 font-black uppercase tracking-widest">{expandedPost.timestamp}</div>
                                                    </div>
                                                </div>
                                                <p className="text-4xl font-black italic text-white/90 leading-tight mb-8">"{expandedPost.content}"</p>
                                            </div>

                                            <div className="space-y-6 mb-32">
                                                <div className="text-xs font-black uppercase tracking-widest text-white/20 mb-8">Echoes ({replies[expandedPost.id]?.length || 0})</div>
                                                {replies[expandedPost.id]?.map(reply => (
                                                    <div key={reply.id} className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="font-bold text-white/60">@{reply.username}</span>
                                                            <span className="text-[10px] text-white/20 uppercase">{reply.timestamp}</span>
                                                        </div>
                                                        <p className="text-white/80">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/80 backdrop-blur-xl border-t border-white/5 shrink-0 z-50">
                                        <div className="max-w-xl mx-auto relative">
                                            <AnimatePresence>
                                                {showEmojiPicker && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-0 mb-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl w-full z-50"
                                                    >
                                                        <div className="grid grid-cols-8 gap-2">
                                                            {["❤️", "✨", "🔥", "🙏", "🥺", "😂", "😭", "😡", "💀", "👀", "🫂", "💪", "🧠", "🫀", "🌌", "🌑", "⚡", "🌊", "🥀", "🌻"].map(emoji => (
                                                                <button key={emoji} onClick={() => setReplyText(prev => prev + emoji)} className="aspect-square flex items-center justify-center text-xl hover:bg-white/10 rounded-lg transition-colors">{emoji}</button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-4 rounded-full transition-all ${showEmojiPicker ? 'bg-white text-black' : 'bg-white/10 text-white/50 hover:text-white'}`}><Smile size={20} /></button>
                                                <div className="relative flex-1">
                                                    <input
                                                        value={replyText}
                                                        onChange={e => setReplyText(e.target.value)}
                                                        placeholder="Send an echo..."
                                                        className="w-full bg-white/10 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/20 transition-all"
                                                        onKeyDown={e => e.key === 'Enter' && handleReply(expandedPost.id)}
                                                    />
                                                    <button onClick={() => handleReply(expandedPost.id)} className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-white text-black flex items-center justify-center hover:scale-95 transition-transform"><Send size={18} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">Neural Nexus</h1>
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] mt-3">Collective Frequencies</p>
                            </div>
                            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-3xl">
                                <button onClick={() => setFeedView('list')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${feedView === 'list' ? 'bg-white text-black shadow-2xl' : 'text-white/30 hover:text-white'}`}>List</button>
                                <button onClick={() => setFeedView('map')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${feedView === 'map' ? 'bg-white text-black shadow-2xl' : 'text-white/30 hover:text-white'}`}>Map</button>
                            </div>

                            {/* Active Whispers Display */}
                            <AnimatePresence>
                                {activeWhispers.length > 0 && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 overflow-hidden">
                                        {activeWhispers.map(w => (
                                            <div key={w.id} className="p-4 mb-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-purple-500/20"><EyeOff size={14} className="text-purple-300" /></div>
                                                    <div>
                                                        <div className="text-xs text-purple-200 font-bold">@{w.sender} <span className="text-white/20">→</span> @{w.recipient}</div>
                                                        <div className="text-sm text-white/80 italic">"{w.content}"</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-mono text-purple-300">
                                                    <Timer size={12} />
                                                    {Math.ceil((w.expiresAt - now) / 1000)}s
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {feedView === 'list' && (
                            <div className="flex gap-3 overflow-x-auto pb-6 mb-8 no-scrollbar mask-linear-fade">
                                {['All', 'Light', 'Heavy', 'Static', 'Void'].map(channel => (
                                    <button
                                        key={channel}
                                        onClick={() => setActiveChannel(channel)}
                                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeChannel === channel ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                                    >
                                        {channel}
                                    </button>
                                ))}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {feedView === 'list' ? (
                                <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                    {filteredPosts.map((post, i) => (
                                        <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-10 rounded-[48px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group overflow-hidden relative">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 group-hover:scale-110 transition-transform duration-500"><EmotionFace emotion={post.emotion} isSelected={false} /></div>
                                                    <div>
                                                        <div className="text-xl font-bold text-white tracking-tight">@{post.username}</div>
                                                        <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">{post.emotion.name} • {post.timestamp}</div>
                                                    </div>
                                                </div>
                                                {post.isUserPost && <button onClick={() => deletePost(post.id)} className="p-3 rounded-2xl bg-white/5 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>}
                                            </div>
                                            <p className="text-3xl text-white/90 font-bold italic leading-tight mb-10 pl-4 border-l-2 border-white/10">"{post.content}"</p>
                                            <div className="flex gap-3">
                                                <button onClick={() => setExpandedPostId(post.id)} className="px-6 py-4 rounded-2xl border border-white/5 text-white/20 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                                                    <MessageSquare size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{replies[post.id]?.length || 0}</span>
                                                </button>
                                                <button onClick={() => setWhisperTarget(post.username)} className="px-4 py-4 rounded-2xl border border-white/5 text-white/20 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30 transition-all"><EyeOff size={16} /></button>
                                                {['I feel this', 'Support'].map(action => (
                                                    <button key={action} onClick={() => toggleInteraction(post.id, action)} className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${interactions[post.id]?.includes(action) ? 'bg-white text-black shadow-glow' : 'border-white/5 text-white/20 hover:bg-white/10'}`}>{action}</button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div key="map" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="relative">
                                    <SynapseMap posts={feedPosts} EmotionFace={EmotionFace} timeOffset={mapTimeOffset} />
                                    <div className="mt-12 p-10 rounded-[56px] bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-3xl">
                                        <div className="flex justify-between items-center mb-8">
                                            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">Historical View</span>
                                            <span className="text-[10px] text-white font-black uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">{mapTimeOffset === 0 ? 'LIVE' : `T-${mapTimeOffset}H`}</span>
                                        </div>
                                        <input type="range" min="0" max="72" value={mapTimeOffset} onChange={(e) => setMapTimeOffset(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" />
                                        <div className="flex justify-between mt-4 text-[8px] text-white/10 font-black uppercase"><span>Now</span><span>3 Days Ago</span></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-xl mx-auto pt-20">
                        <div className="flex flex-col items-center mb-16 text-center">
                            <div className="relative mb-14 group cursor-pointer" onClick={() => {
                                const nextIndex = (emotions.findIndex(e => e.id === userAvatar) + 1) % emotions.length;
                                setUserAvatar(emotions[nextIndex].id);
                                localStorage.setItem('user_avatar', emotions[nextIndex].id);
                            }}>
                                <NeuralAura
                                    recentEmotions={myPosts.length > 0 ? myPosts.slice(0, 7).map(p => p.emotion) : [avatarEmotionData]}
                                    size={240}
                                    className="absolute inset-0"
                                    onArchetypeDetected={setCurrentArchetype}
                                />
                                <div className="w-32 h-32 rounded-full border-4 border-white/10 relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="Avatar" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Edit3 size={32} className="text-white" /></div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <motion.div className="text-[10px] text-white/30 font-black uppercase tracking-[0.6em] mb-2">My Vibe Archetype</motion.div>
                                <motion.div key={currentArchetype} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-black italic text-white tracking-tight uppercase" style={{ textShadow: `0 0 20px ${avatarEmotionData.color}44` }}>{currentArchetype}</motion.div>
                            </div>

                            <input value={username} onChange={(e) => { setUsername(e.target.value); localStorage.setItem('user_identity', e.target.value); }} className="text-4xl font-black italic bg-transparent border-none text-center focus:outline-none uppercase tracking-tighter text-white mb-2" />
                            <textarea value={userBio} onChange={(e) => { setUserBio(e.target.value); localStorage.setItem('user_bio', e.target.value); }} className="bg-transparent border-none text-center text-white/40 font-bold text-sm focus:outline-none resize-none w-full max-w-sm" rows={2} />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 text-center">
                                <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-2">My Streak</div>
                                <div className="text-4xl font-black text-white italic">{streak} <span className="text-xs text-white/20 not-italic uppercase tracking-widest">days</span></div>
                            </div>
                            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 text-center">
                                <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-2">Total Posts</div>
                                <div className="text-4xl font-black text-white italic">{myPosts.length}</div>
                            </div>
                        </div>

                        <div className="p-10 rounded-[56px] bg-white/[0.03] border border-white/5 shadow-3xl">
                            <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-10 text-center">Mood Calendar</div>
                            <div className="flex justify-between gap-3">
                                {Array.from({ length: 14 }).map((_, i) => {
                                    const d = new Date(); d.setDate(d.getDate() - (13 - i));
                                    const post = myPosts.find(p => new Date(p.id).toDateString() === d.toDateString());
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-3 flex-1">
                                            <div className={`w-full aspect-[2/3] rounded-full transition-all duration-700 ${post ? 'opacity-100' : 'opacity-10 bg-white/10'}`} style={{ backgroundColor: post?.emotion.color }} />
                                            <span className={`text-[8px] font-black uppercase ${d.toDateString() === new Date().toDateString() ? 'text-white' : 'text-white/20'}`}>{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-3 p-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-3xl shadow-3xl">
                    <button onClick={() => setActiveNav('checkin')} className={`p-5 rounded-full transition-all hover:bg-white/10 ${activeNav === 'checkin' ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}><Home size={28} /></button>
                    <button onClick={() => setActiveNav('feed')} className={`p-5 rounded-full transition-all hover:bg-white/10 ${activeNav === 'feed' ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}><MessageCircle size={28} /></button>
                    <button onClick={() => setActiveNav('profile')} className={`p-5 rounded-full transition-all hover:bg-white/10 ${activeNav === 'profile' ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}><User size={28} /></button>
                </div>
            </div>
        </div>
    );
}
