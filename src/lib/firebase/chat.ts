import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    getDoc,
    serverTimestamp,
    Timestamp,
    limit,
    startAfter,
    DocumentData,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';

// Types
export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: Timestamp;
    isRead: boolean;
    reactions?: Array<{ emoji: string; userId: string }>;
    replyTo?: string;
    type?: 'text' | 'image' | 'voice';
    mediaUrl?: string;
}

export interface Conversation {
    id: string;
    participants: string[];
    participantDetails?: {
        [userId: string]: {
            name: string;
            avatar: string;
            ghostName?: string;
        };
    };
    lastMessage?: {
        content: string;
        senderId: string;
        timestamp: Timestamp;
    };
    unreadCount?: {
        [userId: string]: number;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Create a new conversation
export const createConversation = async (
    userId1: string,
    userId2: string,
    user1Details: { name: string; avatar: string; ghostName?: string },
    user2Details: { name: string; avatar: string; ghostName?: string }
): Promise<string> => {
    try {
        // Check if conversation already exists
        const existingConv = await findConversation(userId1, userId2);
        if (existingConv) {
            return existingConv.id;
        }

        // Create new conversation
        const conversationRef = await addDoc(collection(db, 'conversations'), {
            participants: [userId1, userId2],
            participantDetails: {
                [userId1]: user1Details,
                [userId2]: user2Details,
            },
            unreadCount: {
                [userId1]: 0,
                [userId2]: 0,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return conversationRef.id;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};

// Find existing conversation between two users
export const findConversation = async (
    userId1: string,
    userId2: string
): Promise<Conversation | null> => {
    try {
        const q = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', userId1)
        );

        const snapshot = await getDocs(q);
        const conversation = snapshot.docs.find((doc) => {
            const data = doc.data();
            return data.participants.includes(userId2);
        });

        if (conversation) {
            return {
                id: conversation.id,
                ...conversation.data(),
            } as Conversation;
        }

        return null;
    } catch (error) {
        console.error('Error finding conversation:', error);
        throw error;
    }
};

// Get all conversations for a user
export const getUserConversations = (
    userId: string,
    callback: (conversations: Conversation[]) => void
) => {
    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const conversations: Conversation[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Conversation[];

        callback(conversations);
    });
};

// Send a message
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    content: string,
    recipientId: string,
    type: 'text' | 'image' | 'voice' = 'text',
    mediaUrl?: string
): Promise<string> => {
    try {
        // Add message to messages subcollection
        const messageRef = await addDoc(
            collection(db, 'conversations', conversationId, 'messages'),
            {
                senderId,
                content,
                timestamp: serverTimestamp(),
                isRead: false,
                type,
                mediaUrl: mediaUrl || null,
                reactions: [],
            }
        );

        // Update conversation's last message and timestamp
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);
        const currentUnread = conversationSnap.data()?.unreadCount || {};

        await updateDoc(conversationRef, {
            lastMessage: {
                content,
                senderId,
                timestamp: serverTimestamp(),
            },
            updatedAt: serverTimestamp(),
            [`unreadCount.${recipientId}`]: (currentUnread[recipientId] || 0) + 1,
        });

        return messageRef.id;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Listen to messages in a conversation (real-time)
export const listenToMessages = (
    conversationId: string,
    callback: (messages: ChatMessage[]) => void,
    limitCount: number = 50
) => {
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs
            .map((doc) => ({
                id: doc.id,
                conversationId,
                ...doc.data(),
            }))
            .reverse() as ChatMessage[]; // Reverse to show oldest first

        callback(messages);
    });
};

// Mark messages as read
export const markMessagesAsRead = async (
    conversationId: string,
    userId: string
): Promise<void> => {
    try {
        // Get all unread messages from the other user
        const q = query(
            collection(db, 'conversations', conversationId, 'messages'),
            where('isRead', '==', false),
            where('senderId', '!=', userId)
        );

        const snapshot = await getDocs(q);

        // Update each message
        const updatePromises = snapshot.docs.map((messageDoc) =>
            updateDoc(doc(db, 'conversations', conversationId, 'messages', messageDoc.id), {
                isRead: true,
            })
        );

        await Promise.all(updatePromises);

        // Reset unread count for this user
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
            [`unreadCount.${userId}`]: 0,
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
};

// Add reaction to a message
export const addReaction = async (
    conversationId: string,
    messageId: string,
    userId: string,
    emoji: string
): Promise<void> => {
    try {
        const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
        const messageSnap = await getDoc(messageRef);
        const currentReactions = messageSnap.data()?.reactions || [];

        // Check if user already reacted with this emoji
        const existingReaction = currentReactions.find(
            (r: any) => r.userId === userId && r.emoji === emoji
        );

        if (existingReaction) {
            // Remove reaction
            const updatedReactions = currentReactions.filter(
                (r: any) => !(r.userId === userId && r.emoji === emoji)
            );
            await updateDoc(messageRef, { reactions: updatedReactions });
        } else {
            // Add reaction
            await updateDoc(messageRef, {
                reactions: [...currentReactions, { emoji, userId }],
            });
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
        throw error;
    }
};

// Delete a message
export const deleteMessage = async (
    conversationId: string,
    messageId: string
): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'conversations', conversationId, 'messages', messageId));
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};

// Load more messages (pagination)
export const loadMoreMessages = async (
    conversationId: string,
    lastDoc: QueryDocumentSnapshot<DocumentData>,
    limitCount: number = 50
): Promise<ChatMessage[]> => {
    try {
        const q = query(
            collection(db, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'desc'),
            startAfter(lastDoc),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs
            .map((doc) => ({
                id: doc.id,
                conversationId,
                ...doc.data(),
            }))
            .reverse() as ChatMessage[];
    } catch (error) {
        console.error('Error loading more messages:', error);
        throw error;
    }
};
