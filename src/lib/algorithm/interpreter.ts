// LAYER 2: INTERPRETATION LAYER - Turning signals into meaning
// This is where "IQ" lives. We infer states, not labels.

import { SignalCollector, UserSignal } from './signals';
import { InferenceContext } from './types';

// Internal emotional states (NEVER shown to users)
export type EmotionalState =
    | 'reflective'
    | 'socially_cautious'
    | 'emotionally_overloaded'
    | 'grounded'
    | 'seeking_reassurance'
    | 'introspective'
    | 'observing'
    | 'anxious_decision_making'
    | 'energized'
    | 'withdrawn';

export interface UserState {
    userId: string;
    primaryState: EmotionalState;
    secondaryStates: EmotionalState[];
    confidence: number; // 0-1
    lastUpdated: Date;
    context: {
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late_night';
        recentMoods: string[];
        toolPreferences: string[];
        socialActivity: 'high' | 'medium' | 'low';
    };
}

export class StateInterpreter {
    private signalCollector: SignalCollector;

    constructor(signalCollector: SignalCollector) {
        this.signalCollector = signalCollector;
    }

    // Interpret user's current emotional state
    interpretUserState(userId: string): UserState {
        const signals = this.signalCollector.getSignalsForUser(userId, 50);

        if (signals.length === 0) {
            return this.getDefaultState(userId);
        }

        const timeOfDay = this.getTimeOfDay();
        const recentMoods = this.extractRecentMoods(signals);
        const toolUsage = this.analyzeToolUsage(signals);
        const socialBehavior = this.analyzeSocialBehavior(signals);
        const interactionPatterns = this.analyzeInteractionPatterns(signals);

        // Infer primary state
        const primaryState = this.inferPrimaryState({
            timeOfDay,
            recentMoods,
            toolUsage,
            socialBehavior,
            interactionPatterns,
            signals
        });

        const secondaryStates = this.inferSecondaryStates({
            timeOfDay,
            recentMoods,
            toolUsage,
            socialBehavior,
            interactionPatterns
        });

        return {
            userId,
            primaryState,
            secondaryStates,
            confidence: this.calculateConfidence(signals.length),
            lastUpdated: new Date(),
            context: {
                timeOfDay,
                recentMoods,
                toolPreferences: toolUsage.map(t => t.tool),
                socialActivity: socialBehavior.activity
            }
        };
    }

    private inferPrimaryState(context: InferenceContext): EmotionalState {
        const { timeOfDay, recentMoods, toolUsage, socialBehavior, interactionPatterns, signals } = context;

        // Late night + introspective emoji = likely introspective
        if (timeOfDay === 'late_night' && recentMoods.some((m: string) => ['😶‍🌫️', 'pensive', 'thoughtful'].includes(m))) {
            return 'introspective';
        }

        // Avoids posting but reads others = observing
        if (socialBehavior.postsCount === 0 && socialBehavior.readsCount > 5) {
            return 'observing';
        }

        // Uses Echo before messaging = anxious decision-making
        const usedEchoBeforeMessaging = this.checkEchoBeforeMessaging((context.signals as UserSignal[]) || []);
        if (usedEchoBeforeMessaging) {
            return 'anxious_decision_making';
        }

        // High pause times = socially cautious
        if (interactionPatterns.avgPause > 5000) {
            return 'socially_cautious';
        }

        // Multiple heavy emotions = emotionally overloaded
        const heavyEmotions = recentMoods.filter((m: string) =>
            ['anxious', 'overwhelmed', 'sad', 'angry'].includes(m)
        );
        if (heavyEmotions.length >= 3) {
            return 'emotionally_overloaded';
        }

        // Uses grounding tools frequently = seeking grounding
        const usesGroundingTools = toolUsage.some((t: { tool: string; count: number }) =>
            ['breathe', 'meditation', 'grounding'].includes(t.tool)
        );
        if (usesGroundingTools) {
            return 'grounded';
        }

        // Reaches out frequently = seeking reassurance
        if (socialBehavior.messagesCount > 10 && socialBehavior.postsCount < 2) {
            return 'seeking_reassurance';
        }

        // Default to reflective
        return 'reflective';
    }

    private inferSecondaryStates(context: InferenceContext): EmotionalState[] {
        const states: EmotionalState[] = [];
        const { recentMoods, socialBehavior, toolUsage } = context;

        if (socialBehavior.activity === 'low') states.push('withdrawn');
        if (recentMoods.some((m: string) => ['joyful', 'excited'].includes(m))) states.push('energized');
        if (toolUsage.some((t: { tool: string; count: number }) => t.tool === 'journal')) states.push('reflective');

        return states.slice(0, 2); // Max 2 secondary states
    }

    private checkEchoBeforeMessaging(signals: UserSignal[]): boolean {
        for (let i = 0; i < signals.length - 1; i++) {
            const current = signals[i];
            const next = signals[i + 1];

            if (current.type === 'tool_usage' && current.data.tool === 'echo' &&
                next.type === 'conversation_pattern') {
                const timeDiff = next.timestamp.getTime() - current.timestamp.getTime();
                if (timeDiff < 300000) { // Within 5 minutes
                    return true;
                }
            }
        }
        return false;
    }

    private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'late_night' {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 22) return 'evening';
        return 'late_night';
    }

    private extractRecentMoods(signals: UserSignal[]): string[] {
        return signals
            .filter(s => s.type === 'mood_checkin')
            .map(s => (s.data as { emotion?: string }).emotion || '')
            .filter(e => e !== '')
            .slice(-5);
    }

    private analyzeToolUsage(signals: UserSignal[]): Array<{ tool: string; count: number }> {
        const toolCounts: Record<string, number> = {};

        signals
            .filter(s => s.type === 'tool_usage')
            .forEach(s => {
                const tool = (s.data as { tool?: string }).tool || '';
                toolCounts[tool] = (toolCounts[tool] || 0) + 1;
            });

        return Object.entries(toolCounts)
            .map(([tool, count]) => ({ tool, count }))
            .sort((a, b) => b.count - a.count);
    }

    private analyzeSocialBehavior(signals: UserSignal[]): {
        activity: 'high' | 'medium' | 'low';
        postsCount: number;
        readsCount: number;
        messagesCount: number;
    } {
        const conversations = signals.filter(s => s.type === 'conversation_pattern');
        const dwells = signals.filter(s => s.type === 'content_dwell');

        const messagesCount = conversations.reduce((sum, s) => sum + ((s.data as { messageCount?: number }).messageCount || 0), 0);
        const readsCount = dwells.length;
        const postsCount = 0; // Would track from actual post signals

        const totalActivity = messagesCount + readsCount + postsCount;
        const activity = totalActivity > 20 ? 'high' : totalActivity > 5 ? 'medium' : 'low';

        return { activity, postsCount, readsCount, messagesCount };
    }

    private analyzeInteractionPatterns(signals: UserSignal[]): {
        avgPause: number;
        scrollSpeed: string;
    } {
        const pauses = signals.filter(s => s.type === 'interaction_pause');
        const avgPause = pauses.length > 0
            ? pauses.reduce((sum, s) => sum + ((s.data as { pauseDuration?: number }).pauseDuration || 0), 0) / pauses.length
            : 0;

        const scrollSignals = signals.filter(s => s.type === 'scroll_speed');
        const scrollSpeed = scrollSignals.length > 0
            ? (scrollSignals[scrollSignals.length - 1].data as { speed?: string }).speed || 'normal'
            : 'normal';

        return { avgPause, scrollSpeed };
    }

    private calculateConfidence(signalCount: number): number {
        // More signals = higher confidence, but cap at 0.95
        return Math.min(0.95, signalCount / 100);
    }

    private getDefaultState(userId: string): UserState {
        return {
            userId,
            primaryState: 'reflective',
            secondaryStates: [],
            confidence: 0.1,
            lastUpdated: new Date(),
            context: {
                timeOfDay: this.getTimeOfDay(),
                recentMoods: [],
                toolPreferences: [],
                socialActivity: 'low'
            }
        };
    }
}
