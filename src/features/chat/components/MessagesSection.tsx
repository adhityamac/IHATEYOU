'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Conversation, Message } from '@/types/types';
import MessageBubble from './MessageBubble';
import { ArrowLeft, Send, Smile, Phone, Video, Info, Plus, Image as ImageIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { emojiPack } from '@/data/emojiPack';
import TypingIndicator from './TypingIndicator';
import { useSignals } from '@/hooks/useSignals';
import UserDiscovery from '@/features/social/components/UserDiscovery';

interface MessagesSectionProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    activeConversationId: string | null;
    setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>;
    currentUser: User;
    mockUsers: User[];
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
    const [showUserDiscovery, setShowUserDiscovery] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [activeEmojiCategory, setActiveEmojiCategory] = useState(emojiPack[0].id);
    const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages]);

    // Handle scroll to hide/show header
    const handleMessagesScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;
        const scrollingDown = currentScrollY > lastScrollY.current;

        if (scrollingDown && currentScrollY > 50) {
            setShowHeader(false);
        } else if (!scrollingDown) {
            setShowHeader(true);
        }

        lastScrollY.current = currentScrollY;
        onScroll(e);
    };

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

    // Conversation List View
    if (!activeConversationId) {
        return (
            <div className="flex-1 flex flex-col h-full bg-black">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-black text-white">Messages</h1>
                        <button
                            onClick={() => setShowUserDiscovery(true)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                            <Plus size={20} className="text-white" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => {
                                setActiveConversationId(conv.id);
                                setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                                trackConnection(conv.participant.id);
                            }}
                            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-all border-b border-white/5"
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
                        </button>
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
            </div>
        );
    }

    // Active Chat View
    return (
        <div className="flex-1 flex flex-col h-full bg-black relative">
            {/* Chat Header - Instagram Style */}
            <AnimatePresence>
                {showHeader && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="px-4 py-3 border-b border-white/10 bg-black/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => setActiveConversationId(null)}
                                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
                            >
                                <ArrowLeft size={20} className="text-white" />
                            </button>

                            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                                <img
                                    src={activeConversation.participant.avatar}
                                    alt={activeConversation.participant.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white text-sm truncate">{activeConversation.participant.username}</h3>
                                <p className="text-xs text-white/50">
                                    {activeConversation.participant.isOnline ? 'Active now' : 'Offline'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
                                <Phone size={18} className="text-white" />
                            </button>
                            <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
                                <Video size={18} className="text-white" />
                            </button>
                            <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
                                <Info size={18} className="text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4"
                onScroll={handleMessagesScroll}
            >
                <div className="space-y-3 pb-4">
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
                                avatar={!isSent ? activeConversation.participant.avatar : undefined}
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
                                    src={activeConversation.participant.avatar}
                                    alt={activeConversation.participant.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <TypingIndicator username={activeConversation.participant.username} />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area - Sticky Bottom */}
            <div className="px-4 py-3 border-t border-white/10 bg-black/80 backdrop-blur-xl sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all flex-shrink-0"
                    >
                        <Smile size={20} className="text-white/60" />
                    </button>

                    <button
                        type="button"
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all flex-shrink-0"
                    >
                        <ImageIcon size={20} className="text-white/60" />
                    </button>

                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
                    />

                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${messageInput.trim()
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl max-h-[300px] overflow-y-auto"
                        >
                            <div className="flex gap-2 mb-3 pb-3 border-b border-white/10 overflow-x-auto">
                                {emojiPack.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveEmojiCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeEmojiCategory === cat.id
                                                ? 'bg-white text-black'
                                                : 'text-white/60 hover:bg-white/10'
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
    );
}
