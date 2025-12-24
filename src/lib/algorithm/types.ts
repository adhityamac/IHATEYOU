// Algorithm-specific type definitions

export interface ContentItem {
    id: string;
    type: 'post' | 'message' | 'story' | 'suggestion';
    content: string;
    emotion?: {
        id: string;
        label: string;
        emoji: string;
    };
    timestamp: Date;
    userId?: string;
    createdAt?: Date;
    tone?: string;
    tags?: string[];
    isFromCloseConnection?: boolean;
    metadata?: {
        tags?: string[];
        topics?: string[];
        intensity?: number;
    };
}

export interface RankedContent {
    content: ContentItem;
    score: number;
}

export interface SignalData {
    [key: string]: unknown;
}

export interface InferenceContext {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late_night';
    recentMoods: string[];
    toolUsage: Array<{ tool: string; count: number }>;
    socialBehavior: {
        activity: 'high' | 'medium' | 'low';
        postsCount: number;
        readsCount: number;
        messagesCount: number;
    };
    interactionPatterns: {
        avgPause: number;
        scrollSpeed: string;
    };
    signals?: unknown[];
}

export interface EmotionData {
    id: string;
    label: string;
    emoji: string;
    color?: string;
    gradient?: string;
}

export interface Post {
    id: string | number;
    user?: string;
    content: string;
    emotion?: EmotionData;
    timestamp?: Date;
    time?: string;
    color?: string;
    echoes?: number;
    replies?: number;
}

export interface WidgetData {
    id: string;
    type: string;
    title?: string;
    data?: unknown;
}
