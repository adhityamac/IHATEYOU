'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Conversation, Message, Story, Group } from '@/types/types';
import MessageBubble from './MessageBubble';
import { ChevronDown, ArrowLeft, MessageCircle, Smile, Sparkles, UserPlus, Search as SearchIcon, Send } from 'lucide-react';
import { emojiPack } from '@/data/emojiPack';
import TypingIndicator from './TypingIndicator';
import MessageSearch from './MessageSearch';
import { useSignals } from '@/hooks/useSignals';

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
}

export default function MessagesSection({
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    currentUser,
    mockUsers,
}: MessagesSectionProps) {
    const { trackTool, trackInteraction, trackConnection } = useSignals(currentUser.id);
    const [showSoulSiblingFinder, setShowSoulSiblingFinder] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showNewMessageToast, setShowNewMessageToast] = useState(false);

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
    const [emojiSearch, setEmojiSearch] = useState('');
    const [emojiCombo, setEmojiCombo] = useState<string[]>([]);
    const [emojiSize, setEmojiSize] = useState<'small' | 'medium' | 'large'>('small');
    const [keyboardHeight, setKeyboardHeight] = useState(350);
    const [isResizing, setIsResizing] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight >= 250 && newHeight <= window.innerHeight * 0.7) {
                setKeyboardHeight(newHeight);
            }
        };
        const handleMouseUp = () => setIsResizing(false);
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    // Removed setRecentEmojis in useEffect to avoid cascading renders

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

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageInput.trim() || !activeConversationId) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            content: messageInput,
            timestamp: new Date(),
            isRead: false,
            size: emojiSize,
        };

        setMessageInput('');
        setConversations(prev =>
            prev.map(conv => conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: newMessage } : conv)
        );
        trackInteraction('send_message', 0);

        // Auto-reply logic
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const replies = ["I hear you.", "That's interesting!", "Tell me more about it.", "I feel that too.", "Wow!", "Got it."];
                const replyMessage: Message = {
                    id: `msg-${Date.now() + 1}`,
                    senderId: activeConversation?.participant.id || '',
                    content: replies[Math.floor(Math.random() * replies.length)],
                    timestamp: new Date(),
                    isRead: false,
                    size: 'small'
                };
                setConversations(prev =>
                    prev.map(conv => conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, replyMessage], lastMessage: replyMessage, unreadCount: conv.unreadCount + 1 } : conv)
                );
                setIsTyping(false);
            }, 2000);
        }, 1000);
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
        <div className="flex-1 flex overflow-hidden bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] mt-24 mx-8 mb-8">
            {showSoulSiblingFinder ? (
                <div className="flex-1 relative flex flex-col p-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Find Soul Siblings</h2>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em] mt-3">Connecting you with similar energies</p>
                        </div>
                        <button onClick={() => setShowSoulSiblingFinder(false)} className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all group">
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockUsers.map((user) => (
                                <button key={user.id} onClick={() => handleSelectUser(user)} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.05] hover:border-white/10 transition-all text-left flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-full border-2 border-white/5 overflow-hidden bg-black/40 backdrop-blur-md">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="font-black text-white text-lg italic uppercase tracking-tighter">@{user.username}</div>
                                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">92% Energy Match</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Chat Sidebar */}
                    <div className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">My Chats</h2>
                            <button onClick={() => {
                                setShowSoulSiblingFinder(true);
                                trackTool('soul_sibling_finder', 0);
                            }} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"><UserPlus size={18} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => {
                                        setActiveConversationId(conv.id);
                                        setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                                        trackConnection(conv.participant.id);
                                    }}
                                    className={`w-full p-5 rounded-[32px] transition-all text-left group ${activeConversationId === conv.id ? 'bg-white/10 border border-white/20 shadow-2xl' : 'bg-transparent hover:bg-white/[0.03]'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full border-2 border-white/5 overflow-hidden bg-black flex items-center justify-center shrink-0">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.participant.name}`} alt="avatar" className="w-full h-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-black text-white text-sm uppercase italic tracking-tight">@{conv.participant.username}</div>
                                            <div className="text-[11px] text-white/30 truncate mt-0.5">{conv.lastMessage?.content || 'No messages yet'}</div>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-rose-500/40">{conv.unreadCount}</div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Main */}
                    {activeConversation ? (
                        <div className="flex-1 flex flex-col relative bg-black/20">
                            {/* Simple Chat Header */}
                            <div className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}`} alt="avatar" className="w-full h-full" /></div>
                                    <div>
                                        <div className="font-black text-white italic uppercase tracking-tighter">@{activeConversation.participant.username}</div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${activeConversation.participant.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{activeConversation.participant.isOnline ? 'Active Now' : 'Quiet Now'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowSearch(true)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 transition-all"><SearchIcon size={18} /></button>
                            </div>

                            <AnimatePresence>
                                {showSearch && (
                                    <MessageSearch onClose={() => setShowSearch(false)} messages={activeConversation.messages} />
                                )}
                            </AnimatePresence>

                            {/* Messages Grid */}
                            <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar relative">
                                <div className="space-y-4">
                                    {activeConversation.messages.map((message, index) => {
                                        const isSent = message.senderId === currentUser.id;
                                        const prevMessage = activeConversation.messages[index - 1];
                                        const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
                                        return (
                                            <MessageBubble
                                                key={message.id} message={message} isSent={isSent} showAvatar={showAvatar}
                                                avatar={!isSent ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.participant.name}` : undefined}
                                                username={activeConversation.participant.name} onReact={handleReaction}
                                            />
                                        );
                                    })}
                                    {isTyping && (
                                        <div className="mt-4 ml-2">
                                            <TypingIndicator username={activeConversation.participant.username} />
                                        </div>
                                    )}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* New Message Input Bar (Standard Style) */}
                            <div className="p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex flex-col gap-4">
                                {showEmojiKeyboard && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] rounded-[32px] border border-white/5 overflow-hidden flex flex-col" style={{ height: keyboardHeight }}>
                                        <div className="p-4 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-hide">
                                            {emojiPack.map(cat => (
                                                <button key={cat.id} onClick={() => setActiveEmojiCategory(cat.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeEmojiCategory === cat.id ? 'bg-white text-black' : 'text-white/20 hover:text-white/40'}`}>
                                                    {cat.name.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 sm:grid-cols-8 gap-2 custom-scrollbar">
                                            {(activeEmojiCategory === 'recent' ? recentEmojis : emojiPack.find(c => c.id === activeEmojiCategory)?.emojis || []).map((emoji, idx) => (
                                                <button key={idx} onClick={() => handleSelectEmoji(emoji)} className="aspect-square flex items-center justify-center text-3xl hover:bg-white/5 rounded-xl transition-all">{emoji}</button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                    <button type="button" onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${showEmojiKeyboard ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                        <Smile size={24} />
                                    </button>
                                    <input
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 h-14 text-sm text-white focus:outline-none focus:border-rose-500/30 transition-all font-medium"
                                    />
                                    <button type="submit" disabled={!messageInput.trim()} className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white disabled:opacity-20 transition-all shadow-lg">
                                        <Send size={24} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-12 text-center relative overflow-hidden">
                            <div className="max-w-md relative z-10">
                                <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-3xl"><Sparkles className="w-10 h-10 text-white/10" /></div>
                                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Your Chats</h2>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em] mb-12 max-w-xs mx-auto">Find a soul sibling to start a conversation</p>
                                <button onClick={() => setShowSoulSiblingFinder(true)} className="px-10 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-transform shadow-2xl">Find Soul Siblings</button>
                            </div>
                        </div>
                    )}
                </>
            )
            }
        </div >
    );
}
