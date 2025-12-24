// LAYER 1: DATA LAYER - Meaningful signals only
// We observe quietly, never obsessively

import { SignalData } from './types';

export interface UserSignal {
    userId: string;
    timestamp: Date;
    type: SignalType;
    data: SignalData;
}

export type SignalType =
    | 'mood_checkin'
    | 'tool_usage'
    | 'interaction_pause'
    | 'scroll_speed'
    | 'time_of_day'
    | 'conversation_pattern'
    | 'content_dwell';

// Track meaningful signals (NOT everything)
export class SignalCollector {
    private signals: UserSignal[] = [];
    private readonly MAX_SIGNALS = 1000; // Keep it light

    // Mood check-in (emoji-based)
    trackMoodCheckIn(userId: string, emotion: string, intensity: number) {
        this.addSignal({
            userId,
            timestamp: new Date(),
            type: 'mood_checkin',
            data: { emotion, intensity }
        });
    }

    // Time of day usage patterns
    trackTimeOfDay(userId: string, action: string) {
        const hour = new Date().getHours();
        this.addSignal({
            userId,
            timestamp: new Date(),
            type: 'time_of_day',
            data: { hour, action }
        });
    }

    // How long they pause before actions (decision anxiety)
    trackInteractionPause(userId: string, action: string, pauseDuration: number) {
        // Only track if pause is meaningful (>2 seconds)
        if (pauseDuration > 2000) {
            this.addSignal({
                userId,
                timestamp: new Date(),
                type: 'interaction_pause',
                data: { action, pauseDuration }
            });
        }
    }

    // Who they talk to repeatedly (connection strength)
    trackConversationPattern(userId: string, targetUserId: string, messageCount: number) {
        this.addSignal({
            userId,
            timestamp: new Date(),
            type: 'conversation_pattern',
            data: { targetUserId, messageCount }
        });
    }

    // Which tools they use (Echo, meditation, feed)
    trackToolUsage(userId: string, tool: string, duration: number) {
        this.addSignal({
            userId,
            timestamp: new Date(),
            type: 'tool_usage',
            data: { tool, duration }
        });
    }

    // Scroll speed (fast = anxious, slow = contemplative)
    trackScrollSpeed(userId: string, speed: 'fast' | 'slow' | 'normal') {
        this.addSignal({
            userId,
            timestamp: new Date(),
            type: 'scroll_speed',
            data: { speed }
        });
    }

    // Content dwell time (what resonates)
    trackContentDwell(userId: string, contentId: string, dwellTime: number) {
        // Only track if meaningful (>3 seconds)
        if (dwellTime > 3000) {
            this.addSignal({
                userId,
                timestamp: new Date(),
                type: 'content_dwell',
                data: { contentId, dwellTime }
            });
        }
    }

    private addSignal(signal: UserSignal) {
        this.signals.push(signal);

        // Keep signals manageable
        if (this.signals.length > this.MAX_SIGNALS) {
            this.signals = this.signals.slice(-this.MAX_SIGNALS);
        }
    }

    // Get signals for analysis (never expose raw data)
    getSignalsForUser(userId: string, limit: number = 100): UserSignal[] {
        return this.signals
            .filter(s => s.userId === userId)
            .slice(-limit);
    }

    // Clear old signals (privacy-first)
    clearOldSignals(daysOld: number = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);

        this.signals = this.signals.filter(s => s.timestamp > cutoff);
    }
}

// Singleton instance
export const signalCollector = new SignalCollector();
