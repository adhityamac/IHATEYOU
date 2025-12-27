import { useState, useEffect, useCallback } from 'react';
import {
    getUserConversations,
    listenToMessages,
    sendMessage,
    markMessagesAsRead,
    addReaction,
    createConversation,
    ChatMessage,
    Conversation,
} from '@/lib/firebase/chat';
import { handleEchoBotResponse, isEchoBotConversation, ECHO_BOT_ID } from '@/lib/bots/echo';
import { useAuth } from '@/contexts/AuthContext';

export const useChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Load user's conversations
    useEffect(() => {
        if (!user?.id) return;

        setLoading(true);
        const unsubscribe = getUserConversations(user.id, (convs) => {
            setConversations(convs);
            setLoading(false);

            // Auto-select first conversation if none selected
            if (!activeConversationId && convs.length > 0) {
                setActiveConversationId(convs[0].id);
            }
        });

        return () => unsubscribe();
    }, [user?.id]);

    // Listen to messages in active conversation
    useEffect(() => {
        if (!activeConversationId) {
            setMessages([]);
            return;
        }

        const unsubscribe = listenToMessages(activeConversationId, (msgs) => {
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [activeConversationId]);

    // Mark messages as read when conversation is opened
    useEffect(() => {
        if (activeConversationId && user?.id) {
            markMessagesAsRead(activeConversationId, user.id).catch((error) => {
                console.error('Error marking messages as read:', error);
            });
        }
    }, [activeConversationId, user?.id]);

    // Send a message
    const handleSendMessage = useCallback(
        async (content: string, type: 'text' | 'image' | 'voice' = 'text', mediaUrl?: string) => {
            if (!user?.id || !activeConversationId || !content.trim()) return;

            setSending(true);
            try {
                // Get recipient ID from conversation
                const conversation = conversations.find((c) => c.id === activeConversationId);
                if (!conversation) throw new Error('Conversation not found');

                const recipientId = conversation.participants.find((p) => p !== user.id);
                if (!recipientId) throw new Error('Recipient not found');

                // Send message
                await sendMessage(activeConversationId, user.id, content, recipientId, type, mediaUrl);

                // If it's Echo bot, trigger auto-response
                if (isEchoBotConversation(conversation.participants)) {
                    handleEchoBotResponse(activeConversationId, content, user.id);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                throw error;
            } finally {
                setSending(false);
            }
        },
        [user?.id, activeConversationId, conversations]
    );

    // Add reaction to message
    const handleAddReaction = useCallback(
        async (messageId: string, emoji: string) => {
            if (!user?.id || !activeConversationId) return;

            try {
                await addReaction(activeConversationId, messageId, user.id, emoji);
            } catch (error) {
                console.error('Error adding reaction:', error);
                throw error;
            }
        },
        [user?.id, activeConversationId]
    );

    // Start new conversation
    const startConversation = useCallback(
        async (
            recipientId: string,
            recipientDetails: { name: string; avatar: string; ghostName?: string }
        ) => {
            if (!user?.id) return null;

            try {
                const conversationId = await createConversation(
                    user.id,
                    recipientId,
                    {
                        name: user.name,
                        avatar: user.avatar,
                        ghostName: user.ghostName,
                    },
                    recipientDetails
                );

                setActiveConversationId(conversationId);
                return conversationId;
            } catch (error) {
                console.error('Error starting conversation:', error);
                throw error;
            }
        },
        [user]
    );

    return {
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        loading,
        sending,
        sendMessage: handleSendMessage,
        addReaction: handleAddReaction,
        startConversation,
    };
};
