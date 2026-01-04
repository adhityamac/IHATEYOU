'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Conversation, Message } from '@/types/types';
import MessageBubble from './MessageBubble';
import { ArrowLeft, Send, Smile, Phone, Video, Info, Plus, Image as ImageIcon, Search as SearchIcon, Archive } from 'lucide-react';
import { emojiPack } from '@/data/emojiPack';
import TypingIndicator from './TypingIndicator';
import { useSignals } from '@/hooks/useSignals';
import dynamic from 'next/dynamic';
import { useTheme } from '@/components/shared/GradientThemeProvider';
const UserDiscovery = dynamic(() => import('@/features/social/components/UserDiscovery'), {
    loading: () => <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center text-white font-mono">Loading Neural Interface...</div>
});
// @ts-ignore
import * as ReactWindow from 'react-window';
// @ts-ignore
import * as AutoSizerPkg from 'react-virtualized-auto-sizer';

const FixedSizeList = ReactWindow.FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
const AutoSizer = (AutoSizerPkg as any).default || AutoSizerPkg.AutoSizer || AutoSizerPkg;

// Manual type definition for scroll props since the export might be missing in this version
type ScrollProps = {
    scrollDirection: "forward" | "backward";
    scrollOffset: number;
    scrollUpdateWasRequested: boolean;
};

interface MessagesSectionProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    activeConversationId: string | null;
    setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>;
    currentUser: User;
    mockUsers: User[];
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const MessagesSection = memo(function MessagesSection({
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    currentUser,
    mockUsers,
    onScroll,
}: MessagesSectionProps) {
    const { trackInteraction, trackConnection } = useSignals(currentUser.id);
    const [showUserDiscovery, setShowUserDiscovery] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const listRef = useRef<any>(null);
    const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [activeEmojiCategory, setActiveEmojiCategory] = useState(emojiPack[0].id);
    const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
    const [showHeader, setShowHeader] = useState(true);

    const { theme } = useTheme();
    const isRetro = theme === 'retro' || theme === 'retro-soul';

    // Theme Variables
    const bgColor = isRetro ? 'bg-[#e7e5e4]' : 'bg-black';
    const textColor = isRetro ? 'text-black' : 'text-white';
    const mutedText = isRetro ? 'text-stone-600' : 'text-white/50';
    const borderColor = isRetro ? 'border-stone-800' : 'border-white/10';
    const headerBg = isRetro ? 'bg-[#fef9c3] border-b-2 border-stone-800' : 'bg-black/50 backdrop-blur-xl border-b border-white/10';
    const itemHover = isRetro ? 'hover:bg-stone-200' : 'hover:bg-white/5';
    const inputBg = isRetro ? 'bg-white border-2 border-stone-800' : 'bg-white/5 border border-white/10';
    const iconColor = isRetro ? 'text-black' : 'text-white';


    const activeConversation = conversations.find(c => c.id === activeConversationId);

    // Auto-scroll to bottom only when new messages arrive
    useEffect(() => {
        if (activeConversation?.messages?.length && listRef.current) {
            // Check if we were near the bottom before scrolling, or if it's a new message
            const itemCount = activeConversation.messages.length + (isTyping ? 1 : 0);
            listRef.current.scrollToItem(itemCount - 1, 'end');
        }
    }, [activeConversation?.messages?.length, isTyping]);


    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageInput.trim() || !activeConversationId) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            content: messageInput,
            timestamp: new Date(),
            isRead: false,
            size: 'small'
        };

        setMessageInput('');
        setConversations(prev =>
            prev.map(conv => conv.id === activeConversationId
                ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: newMessage }
                : conv)
        );
        trackInteraction('send_message', 0);

        // Simulate reply
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const replies = ["I hear you 💙", "That resonates with me", "Tell me more", "I feel that too", "Sending you good vibes ✨"];
                const replyMessage: Message = {
                    id: `msg-${Date.now() + 1}`,
                    senderId: activeConversation?.participant.id || '',
                    content: replies[Math.floor(Math.random() * replies.length)],
                    timestamp: new Date(),
                    isRead: false,
                    size: 'small'
                };
                setConversations(prev =>
                    prev.map(conv => conv.id === activeConversationId
                        ? { ...conv, messages: [...conv.messages, replyMessage], lastMessage: replyMessage }
                        : conv)
                );
                setIsTyping(false);
            }, 1500);
        }, 800);
    };

    const handleSelectEmoji = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
        const newRecents = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 30);
        setRecentEmojis(newRecents);
    };

    const handleReaction = (messageId: string, emoji: string) => {
        setConversations(prev =>
            prev.map(conv => ({
                ...conv,
                messages: conv.messages.map(msg =>
                    msg.id === messageId
                        ? { ...msg, reactions: [...(msg.reactions || []), { emoji, userId: currentUser.id }] }
                        : msg
                )
            }))
        );
    };

    // Row Renderer for Virtual List
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        if (!activeConversation) return null;

        // Typing indicator row
        if (isTyping && index === activeConversation.messages.length) {
            return (
                <div style={style} className="px-4 py-2">
                    <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800">
                            <img
                                src={activeConversation.participant.avatar}
                                alt={activeConversation.participant.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <TypingIndicator username={activeConversation.participant.username} />
                    </div>
                </div>
            );
        }

        const message = activeConversation.messages[index];
        if (!message) return null;

        const isSent = message.senderId === currentUser.id;
        const prevMessage = activeConversation.messages[index - 1];
        const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

        return (
            <div style={style} className="px-4">
                <MessageBubble
                    key={message.id}
                    message={message}
                    isSent={isSent}
                    showAvatar={showAvatar}
                    avatar={!isSent ? activeConversation.participant.avatar : undefined}
                    username={activeConversation.participant.name}
                    onReact={handleReaction}
                    onReply={() => { }}
                />
            </div>
        );
    };


    // Conversation List View
    if (!activeConversationId) {
        return (
            <div className={`flex-1 flex flex-col h-full ${bgColor}`}>
                {/* Header */}
                <div className={`px-6 py-4 ${headerBg}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className={`text-2xl font-black ${textColor} ${isRetro ? 'font-vt323 tracking-widest' : ''}`}>Messages</h1>
                        <button
                            onClick={() => setShowUserDiscovery(true)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRetro ? 'bg-white border-2 border-stone-800 hover:bg-stone-100 shadow-[2px_2px_0px_#2d2a2e]' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            <Plus size={20} className={iconColor} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <SearchIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`} />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className={`w-full rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${inputBg} ${textColor} ${isRetro ? 'placeholder:text-stone-500' : 'placeholder:text-white/40 focus:border-white/30'}`}
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <div key={conv.id} className="relative w-full overflow-hidden">
                            {/* Archive Background */}
                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-end px-6">
                                <Archive className="text-red-400" size={24} />
                            </div>

                            <motion.button
                                drag="x"
                                dragConstraints={{ left: -100, right: 0 }}
                                dragElastic={0.1}
                                onDragEnd={(e, { offset }) => {
                                    if (offset.x < -80) {
                                        setConversations(prev => prev.filter(c => c.id !== conv.id));
                                        trackInteraction('archive_conversation', 0);
                                    }
                                }}
                                onClick={() => {
                                    setActiveConversationId(conv.id);
                                    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                                    trackConnection(conv.participant.id);
                                }}
                                className={`w-full px-6 py-4 flex items-center gap-4 transition-all border-b relative z-10 ${itemHover} ${bgColor} ${isRetro ? 'border-stone-800' : 'border-white/5'}`}
                                style={{ x: 0 }}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800">
                                        <img
                                            src={conv.participant.avatar}
                                            alt={conv.participant.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {conv.participant.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-white truncate">{conv.participant.username}</span>
                                        {conv.lastMessage && (
                                            <span className="text-xs text-white/40 ml-2">
                                                {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-white/50 truncate">
                                            {conv.lastMessage?.content || 'Start a conversation'}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    ))}
                </div>

                {/* User Discovery Modal */}
                <AnimatePresence>
                    {showUserDiscovery && (
                        <UserDiscovery
                            onClose={() => setShowUserDiscovery(false)}
                            onUserSelected={() => setShowUserDiscovery(false)}
                        />
                    )}
                </AnimatePresence>
            </div >
        );
    }

    // Active Chat View
    if (!activeConversation) {
        return null;
    }

    return (
        <div className={`flex-1 flex flex-col h-full relative ${bgColor}`}>
            {/* Chat Header - Instagram Style */}
            <AnimatePresence>
                {showHeader && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`px-4 py-3 flex items-center justify-between sticky top-0 z-50 h-[65px] ${headerBg}`}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => setActiveConversationId(null)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRetro ? 'hover:bg-stone-200 text-black' : 'hover:bg-white/10 text-white'}`}
                            >
                                <ArrowLeft size={20} />
                            </button>

                            <div className={`w-10 h-10 rounded-full overflow-hidden border ${isRetro ? 'border-stone-800 bg-white' : 'bg-zinc-800 border-none'}`}>
                                <img
                                    src={activeConversation.participant.avatar}
                                    alt={activeConversation.participant.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-sm truncate ${textColor} ${isRetro ? 'font-vt323 text-xl' : ''}`}>{activeConversation.participant.username}</h3>
                                <p className={`text-xs ${mutedText}`}>
                                    {activeConversation.participant.isOnline ? 'Active now' : 'Offline'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRetro ? 'hover:bg-stone-200 text-black' : 'hover:bg-white/10 text-white'}`}>
                                <Phone size={18} />
                            </button>
                            <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRetro ? 'hover:bg-stone-200 text-black' : 'hover:bg-white/10 text-white'}`}>
                                <Video size={18} />
                            </button>
                            <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRetro ? 'hover:bg-stone-200 text-black' : 'hover:bg-white/10 text-white'}`}>
                                <Info size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area - Virtualized */}
            <div className="flex-1 relative">
                <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                        <FixedSizeList
                            ref={listRef}
                            height={height}
                            width={width}
                            itemCount={activeConversation.messages.length + (isTyping ? 1 : 0)}
                            itemSize={80} // Estimated row height, consider VariableSizeList if bubbles vary wildly
                            className="pb-4"
                            onScroll={({ scrollOffset, scrollDirection }: ScrollProps) => {
                                // Simple scroll direction check
                                if (scrollDirection === 'forward' && scrollOffset > 50) {
                                    setShowHeader(false);
                                } else if (scrollDirection === 'backward') {
                                    setShowHeader(true);
                                }
                                // Pass scroll event to parent if needed, though react-window handles it differently
                            }}
                        >
                            {Row}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </div>

            {/* Input Area - Sticky Bottom */}
            <div className={`px-4 py-3 sticky bottom-0 ${isRetro ? 'bg-white border-t-2 border-stone-800' : 'bg-black/80 backdrop-blur-xl border-t border-white/10'}`}>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isRetro ? 'bg-stone-100 hover:bg-stone-200 text-stone-600' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                    >
                        <Smile size={20} />
                    </button>

                    <button
                        type="button"
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isRetro ? 'bg-stone-100 hover:bg-stone-200 text-stone-600' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                    >
                        <ImageIcon size={20} />
                    </button>

                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Message..."
                        className={`flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none transition-all ${inputBg} ${textColor} ${isRetro ? 'placeholder:text-stone-400' : 'placeholder:text-white/40 focus:border-white/30'}`}
                    />

                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${messageInput.trim()
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : isRetro ? 'bg-stone-100 text-stone-300' : 'bg-white/5 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </form>

                {/* Emoji Picker */}
                <AnimatePresence>
                    {showEmojiKeyboard && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={`absolute bottom-full left-0 right-0 mb-2 mx-4 rounded-2xl p-4 shadow-2xl max-h-[300px] overflow-y-auto ${isRetro ? 'bg-white border-2 border-stone-800' : 'bg-zinc-900 border border-white/10'}`}
                        >
                            <div className={`flex gap-2 mb-3 pb-3 border-b overflow-x-auto ${isRetro ? 'border-stone-200' : 'border-white/10'}`}>
                                {emojiPack.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveEmojiCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeEmojiCategory === cat.id
                                            ? isRetro ? 'bg-black text-white' : 'bg-white text-black'
                                            : isRetro ? 'text-stone-500 hover:bg-stone-100' : 'text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-8 gap-2">
                                {(emojiPack.find(c => c.id === activeEmojiCategory)?.emojis || []).map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            handleSelectEmoji(emoji);
                                            setShowEmojiKeyboard(false);
                                        }}
                                        className={`aspect-square flex items-center justify-center text-2xl rounded-lg transition-all ${isRetro ? 'hover:bg-stone-100' : 'hover:bg-white/10'}`}
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
    );
});

export default MessagesSection;
