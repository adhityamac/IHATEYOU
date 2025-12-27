'use client';

import { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import MessagesSection from './MessagesSection';
import { Conversation as FirebaseConversation, ChatMessage } from '@/lib/firebase/chat';
import { Conversation, Message, User } from '@/types/types';
import { Timestamp } from 'firebase/firestore';

interface MessagesSectionWrapperProps {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

// Convert Firebase conversation to app conversation format
const convertConversation = (fbConv: FirebaseConversation, currentUserId: string): Conversation | null => {
    const otherUserId = fbConv.participants.find(p => p !== currentUserId);
    if (!otherUserId || !fbConv.participantDetails?.[otherUserId]) return null;

    const participant = fbConv.participantDetails[otherUserId];

    return {
        id: fbConv.id,
        participant: {
            id: otherUserId,
            name: participant.name,
            username: participant.ghostName || participant.name,
            avatar: participant.avatar,
            isOnline: true, // TODO: Add presence system
            currentEmotion: 'static',
        },
        messages: [], // Messages are loaded separately
        lastMessage: fbConv.lastMessage ? {
            id: 'last',
            senderId: fbConv.lastMessage.senderId,
            content: fbConv.lastMessage.content,
            timestamp: fbConv.lastMessage.timestamp?.toDate() || new Date(),
            isRead: true,
        } : undefined,
        unreadCount: fbConv.unreadCount?.[currentUserId] || 0,
    };
};

// Convert Firebase message to app message format
const convertMessage = (fbMsg: ChatMessage): Message => {
    return {
        id: fbMsg.id,
        senderId: fbMsg.senderId,
        content: fbMsg.content,
        timestamp: fbMsg.timestamp?.toDate() || new Date(),
        isRead: fbMsg.isRead,
        reactions: fbMsg.reactions,
        size: 'small',
    };
};

export default function MessagesSectionWrapper({ onScroll }: MessagesSectionWrapperProps) {
    const { user } = useAuth();
    const {
        conversations: fbConversations,
        activeConversationId,
        setActiveConversationId,
        messages: fbMessages,
        loading,
        sendMessage,
        addReaction,
    } = useChat();

    if (!user) return null;

    // Convert Firebase data to app format
    const conversations: Conversation[] = fbConversations
        .map(conv => convertConversation(conv, user.id))
        .filter((conv): conv is Conversation => conv !== null);

    const messages: Message[] = fbMessages.map(convertMessage);

    // Update active conversation with current messages
    const conversationsWithMessages = conversations.map(conv => {
        if (conv.id === activeConversationId) {
            return { ...conv, messages };
        }
        return conv;
    });

    const currentUser: User = {
        id: user.id,
        name: user.name,
        username: user.ghostName || user.name,
        avatar: user.avatar,
        isOnline: true,
        currentEmotion: 'static',
    };

    // Handle send message - integrate with Firebase
    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;
        try {
            await sendMessage(content);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle reaction - integrate with Firebase
    const handleReaction = async (messageId: string, emoji: string) => {
        try {
            await addReaction(messageId, emoji);
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-white/60">Loading conversations...</div>
            </div>
        );
    }

    return (
        <MessagesSection
            conversations={conversationsWithMessages}
            setConversations={() => { }} // Not needed with Firebase
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            currentUser={currentUser}
            mockUsers={[]} // Will be replaced with real user discovery
            onScroll={onScroll}
        />
    );
}
