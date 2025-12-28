'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Conversation, Message, Story, Group } from '@/types/types';
import MessageBubble from './MessageBubble';
import { ChevronDown, ArrowLeft, MessageCircle, Smile, Sparkles, UserPlus, Search as SearchIcon, Send, X, Ghost, Plus, Paperclip, Image as ImageIcon, Mic, MoreVertical, Pin, Phone, Video, Info } from 'lucide-react';
import { emojiPack } from '@/data/emojiPack';
import TypingIndicator from './TypingIndicator';
import MessageSearch from './MessageSearch';
import { useSignals } from '@/hooks/useSignals';
import UserDiscovery from '@/features/social/components/UserDiscovery';
import { generateEchoResponse } from '@/lib/bots/echo';

interface MessagesSectionProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    activeConversationId: string | null;
    setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>;
    currentUser: User;
    mockUsers: User[];
    stories?: Story[];
    setStories?: React.Dispatch<React.SetStateAction<Story[]>>;
    groups?: Group[];
    setGroups?: React.Dispatch<React.SetStateAction<Group[]>>;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function MessagesSection({
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    currentUser,
    mockUsers,
    onScroll,
}: MessagesSectionProps) {
    const { trackTool, trackInteraction, trackConnection } = useSignals(currentUser.id);
    const [showSoulSiblingFinder, setShowSoulSiblingFinder] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showNewMessageToast, setShowNewMessageToast] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'video'>('idle');

    const [activeEmojiCategory, setActiveEmojiCategory] = useState(emojiPack[0].id);
    const getInitialRecentEmojis = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('recent-emojis');
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { }
            }
        }
        return [];
    };
    const [recentEmojis, setRecentEmojis] = useState<string[]>(getInitialRecentEmojis);
    const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNewMessageToast(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsAtBottom(entry.isIntersecting);
                if (entry.isIntersecting) setShowNewMessageToast(false);
            },
            { threshold: 0.1 }
        );
        if (messagesEndRef.current) observer.observe(messagesEndRef.current);
        return () => observer.disconnect();
    }, [activeConversationId]);

    useEffect(() => {
        if (!activeConversation?.messages.length) return;
        const lastMessage = activeConversation.messages[activeConversation.messages.length - 1];
        const isFromMe = lastMessage.senderId === currentUser.id;
        if (isAtBottom || isFromMe) {
            scrollToBottom();
        } else if (!isFromMe) {
            setShowNewMessageToast(true);
        }
    }, [activeConversation?.messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageInput.trim() || !activeConversationId) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            content: messageInput,
            timestamp: new Date(),
            isRead: false,
            size: 'small',
            reactions: []
        };

        setMessageInput('');
        const currentInput = messageInput; // Capture for processing

        setConversations(prev =>
            prev.map(conv => conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: newMessage } : conv)
        );
        trackInteraction('send_message', 0);

        // Auto-reply logic with Emotional Intelligence (Echo Bot)
        setTimeout(async () => {
            setIsTyping(true);

            // Determine if we should reply (mock logic, or use Echo bot if ID matches)
            // For now, we'll apply Echo logic to ALL conversations for the demo effect
            // In a real app, this would be `if (activeConversation.participant.id === 'echo-bot')`

            const echoResponse = generateEchoResponse(currentInput);

            setTimeout(() => {
                const replyMessage: Message = {
                    id: `msg-${Date.now() + 1}`,
                    senderId: activeConversation?.participant.id || '',
                    content: echoResponse,
                    timestamp: new Date(),
                    isRead: false,
                    size: 'small',
                    reactions: []
                };

                setConversations(prev =>
                    prev.map(conv => conv.id === activeConversationId ? {
                        ...conv,
                        messages: [...conv.messages, replyMessage],
                        lastMessage: replyMessage,
                        unreadCount: conv.unreadCount + 1
                    } : conv)
                );
                setIsTyping(false);
            }, 1500 + Math.random() * 1000); // Natural delay
        }, 500);
    };

    const handleSelectEmoji = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
        const newRecents = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 30);
        setRecentEmojis(newRecents);
        localStorage.setItem('recent-emojis', JSON.stringify(newRecents));
    };

    const handleReaction = (messageId: string, emoji: string) => {
        setConversations(prev =>
            prev.map(conv => ({
                ...conv,
                messages: conv.messages.map(msg => msg.id === messageId ? { ...msg, reactions: [...(msg.reactions || []), { emoji, userId: currentUser.id }] } : msg)
            }))
        );
    };

    const handleSelectUser = (user: User) => {
        let conv = conversations.find(c => c.participant.id === user.id);
        if (!conv) {
            conv = { id: `conv-${user.id}`, participant: user, messages: [], unreadCount: 0 };
            setConversations([conv, ...conversations]);
        }
        setActiveConversationId(conv.id);
        setShowSoulSiblingFinder(false);
    };

    return (
        <div className="flex-1 flex items-end justify-center w-full h-full px-8 pb-8 pt-32">
            {/* Main Messages Container - macOS Style */}
            <div className="flex w-full max-w-7xl h-full bg-zinc-900/95 backdrop-blur-3xl rounded-[24px] shadow-[0_20px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">

                {/* Left Sidebar - People List */}
                <div className="w-[320px] flex-shrink-0 border-r border-white/10 flex flex-col bg-black/40">
                    {/* Sidebar Header */}
                    <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Messages</h2>
                        <button
                            onClick={() => setShowSoulSiblingFinder(true)}
                            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="px-4 py-3">
                        <div className="relative">
                            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar" onScroll={onScroll} data-scrollable="true">
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setActiveConversationId(conv.id);
                                    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                                    trackConnection(conv.participant.id);
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${activeConversationId === conv.id
                                    ? 'bg-white/10'
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.participant.name}`}
                                        alt={conv.participant.username}
                                        className="w-full h-full"
                                    />
                                    {conv.participant.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-white text-sm truncate">{conv.participant.username}</span>
                                        {conv.lastMessage && (
                                            <span className="text-xs text-white/40 ml-2">
                                                {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-white/50 truncate">
                                            {conv.lastMessage?.content || 'No messages yet'}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] text-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side - Chat Area */}
                {activeConversation ? (
                    <div className="flex-1 flex flex-col bg-zinc-900/50">
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}`}
                                        alt={activeConversation.participant.username}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{activeConversation.participant.username}</h3>
                                    <p className="text-xs text-white/50">
                                        {activeConversation.participant.isOnline ? 'Active now' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCallStatus('calling')}
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                >
                                    <Phone size={18} />
                                </button>
                                <button
                                    onClick={() => setCallStatus('video')}
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                >
                                    <Video size={18} />
                                </button>
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                >
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar" onScroll={onScroll} data-scrollable="true">
                            <div className="space-y-4">
                                {activeConversation.messages.map((message, index) => {
                                    const isSent = message.senderId === currentUser.id;
                                    const prevMessage = activeConversation.messages[index - 1];
                                    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
                                    return (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            isSent={isSent}
                                            showAvatar={showAvatar}
                                            avatar={!isSent ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}` : undefined}
                                            username={activeConversation.participant.name}
                                            onReact={handleReaction}
                                            onReply={() => { }}
                                        />
                                    );
                                })}
                                {isTyping && (
                                    <div className="flex items-end gap-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}`}
                                                alt={activeConversation.participant.username}
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <TypingIndicator username={activeConversation.participant.username} />
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area - Fixed at Bottom */}
                        <div className="px-6 py-4 border-t border-white/10 bg-black/20">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)}
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0"
                                >
                                    <Smile size={20} />
                                </button>
                                <button
                                    type="button"
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0"
                                >
                                    <ImageIcon size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Your message"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${messageInput.trim()
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                                        }`}
                                >
                                    <Send size={18} />
                                </button>
                            </form>

                            {/* Emoji Picker */}
                            <AnimatePresence>
                                {showEmojiKeyboard && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-20 left-6 right-6 bg-zinc-800 border border-white/10 rounded-2xl p-4 shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar"
                                    >
                                        <div className="flex gap-2 mb-3 pb-3 border-b border-white/10">
                                            {emojiPack.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveEmojiCategory(cat.id)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeEmojiCategory === cat.id
                                                        ? 'bg-white text-black'
                                                        : 'text-white/60 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-8 gap-2">
                                            {(activeEmojiCategory === 'recent' ? recentEmojis : emojiPack.find(c => c.id === activeEmojiCategory)?.emojis || []).map((emoji, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        handleSelectEmoji(emoji);
                                                        setShowEmojiKeyboard(false);
                                                    }}
                                                    className="aspect-square flex items-center justify-center text-2xl hover:bg-white/10 rounded-lg transition-all"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 text-white/40">
                        <MessageCircle size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                        <p className="text-sm">Choose from your existing conversations or start a new one</p>
                    </div>
                )}

                {/* User Discovery Modal */}
                <AnimatePresence>
                    {showSoulSiblingFinder && (
                        <UserDiscovery
                            onClose={() => setShowSoulSiblingFinder(false)}
                            onUserSelected={() => setShowSoulSiblingFinder(false)}
                        />
                    )}

                </AnimatePresence>

                {/* Profile Slide-over */}
                <AnimatePresence>
                    {showProfile && activeConversation && (
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            className="absolute inset-y-0 right-0 w-[300px] bg-black/95 backdrop-blur-3xl border-l border-white/10 z-20 flex flex-col p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-white">Profile</h3>
                                <button onClick={() => setShowProfile(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full p-1 border-2 border-white/10 mb-4 relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}`}
                                        className="w-full h-full rounded-full bg-zinc-800"
                                    />
                                    {activeConversation.participant.isOnline && (
                                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-black rounded-full" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">{activeConversation.participant.username}</h2>
                                <p className="text-white/40 text-sm">@{activeConversation.participant.name.toLowerCase().replace(/\s/g, '')}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setCallStatus('calling')} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all">
                                        <Phone size={20} />
                                        <span className="text-xs font-bold">Call</span>
                                    </button>
                                    <button onClick={() => setCallStatus('video')} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all">
                                        <Video size={20} />
                                        <span className="text-xs font-bold">Video</span>
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">About</h4>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Exploring the digital void. ✨<br />
                                        Loves retro music and deep chats.
                                    </p>
                                </div>

                                <button className="w-full py-3 rounded-xl bg-white/5 text-rose-400 font-bold hover:bg-rose-500/10 transition-all text-sm">
                                    Block User
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Calling Overlay */}
                <AnimatePresence>
                    {callStatus !== 'idle' && activeConversation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-32 h-32 rounded-full p-1 border-4 border-white/10 relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}`}
                                        className="w-full h-full rounded-full bg-zinc-800"
                                    />
                                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-50" />
                                </div>
                                <div className="text-center">
                                    <h2 className="text-3xl font-black text-white mb-2">{activeConversation.participant.username}</h2>
                                    <p className="text-white/50 animate-pulse">
                                        {callStatus === 'calling' ? 'Calling...' : 'Video Calling...'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCallStatus('idle')}
                                    className="mt-8 px-8 py-3 rounded-full bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                                >
                                    End Call
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
