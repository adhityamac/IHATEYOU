'use client';

import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { useUsersPresence } from '@/hooks/useUsersPresence';
import MessagesSection from './MessagesSection';
import { ChatMessage } from '@/lib/firebase/chat';
import { Conversation, Message, User } from '@/types/types';

interface MessagesSectionWrapperProps {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

// Convert Firebase message to app message format
const convertMessage = (fbMsg: ChatMessage): Message => {
    return {
        id: fbMsg.id,
        senderId: fbMsg.senderId,
        content: fbMsg.content,
        timestamp: fbMsg.timestamp?.toDate() || new Date(),
        isRead: fbMsg.isRead,
        reactions: fbMsg.reactions || [],
        size: 'small',
    };
};

export default function MessagesSectionWrapper({ onScroll }: MessagesSectionWrapperProps) {
    const { user } = useAuth();
    usePresence(); // Start heartbeats
    const {
        conversations: fbConversations,
        activeConversationId,
        setActiveConversationId,
        messages: fbMessages,
        loading,
        sendMessage,
        addReaction,
    } = useChat();

    // State to hold the mapped conversations
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // Extract all participant IDs for presence monitoring
    const participantIds = useMemo(() => {
        if (!fbConversations) return [];
        const ids = new Set<string>();
        fbConversations.forEach(c => c.participants.forEach(p => ids.add(p)));
        return Array.from(ids);
    }, [fbConversations]);

    const presenceMap = useUsersPresence(participantIds);

    // Filter conversations to only show those where current user is a participant
    // AND map to our app's Conversation type with real user details
    useEffect(() => {
        if (!user || !fbConversations) return;

        const mapConversations = async () => {
            const mapped = await Promise.all(fbConversations.map(async (fbConv) => {
                // Get other participants
                // In a real app, we might need to fetch user profiles here if not in details
                // But we can fallback to the details stored in conversation

                const participantsNodes: User[] = fbConv.participants.map(uid => {
                    const details = fbConv.participantDetails?.[uid];
                    const presence = presenceMap[uid];

                    // If it's the current user, use auth user data
                    if (uid === user.id) {
                        return {
                            id: user.id,
                            name: user.name,
                            username: user.ghostName || user.name,
                            avatar: user.avatar,
                            isOnline: true // Always online for self
                        };
                    }

                    return {
                        id: uid,
                        name: details?.name || 'Unknown',
                        username: details?.ghostName || details?.name || 'Unknown',
                        avatar: details?.avatar || '',
                        isOnline: presence?.isOnline || false
                    };
                });

                // ... rest of mapping
                const messages: Message[] = []; // We load these separately or from lastMessage

                // Map last message
                let lastMessage: Message | undefined;
                if (fbConv.lastMessage) {
                    lastMessage = {
                        id: 'latest', // we don't have ID in summary
                        senderId: fbConv.lastMessage.senderId,
                        content: fbConv.lastMessage.content,
                        timestamp: fbConv.lastMessage.timestamp.toDate(),
                        isRead: true, // simplified
                        size: 'small',
                        reactions: []
                    };
                }

                return {
                    id: fbConv.id,
                    participants: participantsNodes,
                    messages: messages,
                    lastMessage,
                    unreadCount: fbConv.unreadCount?.[user.id] || 0
                };
            }));

            setConversations(mapped);
        };

        mapConversations();
    }, [user, fbConversations, presenceMap]);

    if (!user) return null;

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
            onScroll={onScroll}
            onSendMessage={handleSendMessage}
            onReaction={handleReaction}
        />
    );
}
