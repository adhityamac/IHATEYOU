// LAYER 3: DECISION LAYER - What the app does next
// This is the algorithm users FEEL (never see)

import { UserState, EmotionalState } from './interpreter';
import { ContentItem, InferenceContext } from './types';

export interface FeedDecision {
    postsPerPage: number;
    scrollSpeed: 'slow' | 'normal' | 'fast';
    contentTypes: string[];
    showGroundingWidgets: boolean;
    notificationIntensity: 'high' | 'medium' | 'low' | 'minimal';
    suggestedTools: string[];
}

export interface ContentScore {
    contentId: string;
    finalScore: number;
    breakdown: {
        relevance: number;
        emotionalMatch: number;
        timing: number;
        randomness: number;
    };
}

export class DecisionEngine {
    // The algorithm users feel
    decideFeedBehavior(userState: UserState): FeedDecision {
        const { primaryState, context } = userState;

        // Emotionally heavy states
        if (this.isEmotionallyHeavy(primaryState)) {
            return {
                postsPerPage: 3, // Fewer posts
                scrollSpeed: 'slow', // Slower feed
                contentTypes: ['grounding', 'calm', 'supportive'],
                showGroundingWidgets: true, // More grounding widgets
                notificationIntensity: 'minimal',
                suggestedTools: ['breathe', 'journal', 'echo']
            };
        }

        // Curious/energized states
        if (this.isCurious(primaryState)) {
            return {
                postsPerPage: 8, // More content
                scrollSpeed: 'normal',
                contentTypes: ['discovery', 'new_people', 'light'],
                showGroundingWidgets: false,
                notificationIntensity: 'medium',
                suggestedTools: ['explore', 'connect']
            };
        }

        // Overstimulated states
        if (this.isOverstimulated(primaryState, context)) {
            return {
                postsPerPage: 2, // Very few posts
                scrollSpeed: 'slow',
                contentTypes: ['minimal', 'quiet'],
                showGroundingWidgets: true,
                notificationIntensity: 'minimal', // Reduce notifications
                suggestedTools: ['pause', 'breathe', 'disconnect'] // Suggest pause tools
            };
        }

        // Socially cautious
        if (primaryState === 'socially_cautious') {
            return {
                postsPerPage: 5,
                scrollSpeed: 'slow',
                contentTypes: ['familiar', 'safe', 'low_pressure'],
                showGroundingWidgets: false,
                notificationIntensity: 'low',
                suggestedTools: ['echo', 'journal']
            };
        }

        // Default balanced state
        return {
            postsPerPage: 6,
            scrollSpeed: 'normal',
            contentTypes: ['balanced', 'varied'],
            showGroundingWidgets: false,
            notificationIntensity: 'medium',
            suggestedTools: []
        };
    }

    // Rank content (multi-factor, obfuscated)
    rankContent(
        contentItems: ContentItem[],
        userState: UserState,
        currentTime: Date = new Date()
    ): ContentScore[] {
        return contentItems.map(item => {
            // Calculate individual scores
            const relevanceScore = this.calculateRelevance(item, userState);
            const emotionalMatch = this.calculateEmotionalMatch(item, userState);
            const timingScore = this.calculateTiming(item, currentTime, userState);
            const randomness = Math.random() * 0.15; // 5-15% randomness

            // OBFUSCATION: Dynamic weights (change these often in production)
            const weights = this.getDynamicWeights(userState);

            // Final score (never a single number in production)
            const finalScore =
                relevanceScore * weights.relevance +
                emotionalMatch * weights.emotional +
                timingScore * weights.timing +
                randomness * weights.random;

            return {
                contentId: item.id,
                finalScore,
                breakdown: {
                    relevance: relevanceScore,
                    emotionalMatch,
                    timing: timingScore,
                    randomness
                }
            };
        }).sort((a, b) => b.finalScore - a.finalScore);
    }

    // Silence-aware logic
    handleInactiveUser(userState: UserState, daysSinceLastInteraction: number): FeedDecision {
        // Don't punish silence
        // Don't flood them
        // Gently reduce intensity

        if (daysSinceLastInteraction > 7) {
            return {
                postsPerPage: 2, // Very gentle
                scrollSpeed: 'slow',
                contentTypes: ['welcoming', 'low_pressure'],
                showGroundingWidgets: false,
                notificationIntensity: 'minimal', // Almost none
                suggestedTools: []
            };
        }

        if (daysSinceLastInteraction > 3) {
            return {
                postsPerPage: 4,
                scrollSpeed: 'slow',
                contentTypes: ['gentle', 'familiar'],
                showGroundingWidgets: false,
                notificationIntensity: 'low',
                suggestedTools: []
            };
        }

        return this.decideFeedBehavior(userState);
    }

    // Private helper methods

    private isEmotionallyHeavy(state: EmotionalState): boolean {
        return ['emotionally_overloaded', 'anxious_decision_making', 'seeking_reassurance'].includes(state);
    }

    private isCurious(state: EmotionalState): boolean {
        return ['energized', 'grounded'].includes(state);
    }

    private isOverstimulated(state: EmotionalState, context: { socialActivity: string; recentMoods: string[] }): boolean {
        return state === 'emotionally_overloaded' ||
            (context.socialActivity === 'high' && context.recentMoods.length > 5);
    }

    private calculateRelevance(item: ContentItem, userState: UserState): number {
        // Content matches user's interests/connections
        let score = 0.5; // Base score

        // Boost if from close connections
        if (item.isFromCloseConnection) score += 0.3;

        // Boost if matches recent topics
        if (this.matchesRecentTopics(item, userState)) score += 0.2;

        return Math.min(1, score);
    }

    private calculateEmotionalMatch(item: ContentItem, userState: UserState): number {
        // Does content's emotional tone match user's state?
        const { primaryState } = userState;

        // Heavy state = prefer calm content
        if (this.isEmotionallyHeavy(primaryState)) {
            return item.tone === 'calm' || item.tone === 'supportive' ? 0.9 : 0.3;
        }

        // Energized = prefer exciting content
        if (primaryState === 'energized') {
            return item.tone === 'exciting' || item.tone === 'inspiring' ? 0.9 : 0.5;
        }

        return 0.6; // Neutral match
    }

    private calculateTiming(item: ContentItem, currentTime: Date, userState: UserState): number {
        // Context > content: same post at different times = different impact

        const hourOfDay = currentTime.getHours();
        const itemAge = currentTime.getTime() - new Date(item.createdAt || item.timestamp).getTime();
        const ageInHours = itemAge / (1000 * 60 * 60);

        let score = 0.5;

        // Fresh content bonus (but not too aggressive)
        if (ageInHours < 2) score += 0.2;
        else if (ageInHours < 24) score += 0.1;

        // Time-of-day relevance
        if (userState.context.timeOfDay === 'late_night') {
            // Prefer calmer content late at night
            if (item.tone === 'calm' || item.tone === 'reflective') score += 0.2;
        }

        // Decay old content
        if (ageInHours > 48) score *= 0.5;

        return Math.min(1, score);
    }

    private getDynamicWeights(userState: UserState): {
        relevance: number;
        emotional: number;
        timing: number;
        random: number;
    } {
        // OBFUSCATION: Change these weights based on state
        // In production, vary these silently and often

        if (this.isEmotionallyHeavy(userState.primaryState)) {
            return {
                relevance: 0.3,
                emotional: 0.5, // Prioritize emotional match
                timing: 0.1,
                random: 0.1
            };
        }

        // Default weights
        return {
            relevance: 0.4,
            emotional: 0.3,
            timing: 0.2,
            random: 0.1
        };
    }

    private matchesRecentTopics(item: ContentItem, userState: UserState): boolean {
        // Simple topic matching (expand in production)
        return userState.context.recentMoods.some(mood =>
            item.tags?.includes(mood)
        );
    }

    // Intent inference
    inferUserIntent(userState: UserState, recentActions: string[]): string {
        // User opens Echo before chatting? → seeking clarity, not conversation
        if (recentActions.includes('echo') && recentActions.includes('open_messages')) {
            return 'seeking_clarity';
        }

        // User browses but doesn't interact? → observing
        if (recentActions.includes('scroll') && !recentActions.includes('like') && !recentActions.includes('comment')) {
            return 'observing';
        }

        // User uses grounding tools? → needs calm
        if (recentActions.includes('breathe') || recentActions.includes('meditate')) {
            return 'needs_calm';
        }

        return 'exploring';
    }
}
