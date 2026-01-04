// LAYER 4: OBFUSCATION LAYER - Security & Secrecy
// How you protect the algo from reverse engineering

import { SignalCollector, signalCollector } from './signals';
import { StateInterpreter, UserState } from './interpreter';
import { DecisionEngine } from './decisions';
import { ContentItem, RankedContent } from './types';

// Main algorithm orchestrator (server-side ONLY)
export class EmotionalAlgorithm {
    private signalCollector: SignalCollector;
    private interpreter: StateInterpreter;
    private decisionEngine: DecisionEngine;

    // Weight randomization for obfuscation
    private weightVariation: number = 0.05; // 5% random variation

    constructor() {
        this.signalCollector = signalCollector;
        this.interpreter = new StateInterpreter(this.signalCollector);
        this.decisionEngine = new DecisionEngine();
    }

    // PUBLIC API (what frontend calls)
    // Never expose internal logic

    /**
     * Get personalized feed
     * Frontend never sees WHY content was chosen
     */
    async getPersonalizedFeed(userId: string, contentPool: ContentItem[]): Promise<ContentItem[]> {
        // 1. Interpret user state (private)
        const userState = this.interpreter.interpretUserState(userId);

        // 2. Make feed decisions (private)
        const feedDecision = this.decisionEngine.decideFeedBehavior(userState);

        // 3. Rank content with obfuscation
        const rankedContent = this.rankWithObfuscation(contentPool, userState);

        // 4. Apply feed decision limits
        const limitedContent = rankedContent.slice(0, feedDecision.postsPerPage);

        // 5. Inject controlled randomness (prevents gaming)
        const finalContent = this.injectRandomness(limitedContent, 0.1);

        // Return ONLY the content, never the scores or reasoning
        return finalContent.map(item => item.content);
    }

    /**
     * Get suggested tools
     * Frontend never sees the state interpretation
     */
    async getSuggestedTools(userId: string): Promise<string[]> {
        const userState = this.interpreter.interpretUserState(userId);
        const feedDecision = this.decisionEngine.decideFeedBehavior(userState);

        // Add randomness to suggestions
        const tools = feedDecision.suggestedTools;
        if (Math.random() > 0.7) {
            // 30% chance to add a random tool
            const randomTools = ['echo', 'journal', 'breathe', 'meditate', 'explore'];
            const randomTool = randomTools[Math.floor(Math.random() * randomTools.length)];
            if (!tools.includes(randomTool)) {
                tools.push(randomTool);
            }
        }

        return tools;
    }

    /**
     * Get notification settings
     * Adapts to user state without explaining why
     */
    async getNotificationIntensity(userId: string): Promise<'high' | 'medium' | 'low' | 'minimal'> {
        const userState = this.interpreter.interpretUserState(userId);
        const feedDecision = this.decisionEngine.decideFeedBehavior(userState);

        return feedDecision.notificationIntensity;
    }

    // PRIVATE METHODS (never exposed)

    /**
     * Rank content with multiple layers of obfuscation
     */
    private rankWithObfuscation(contentPool: ContentItem[], userState: UserState): RankedContent[] {
        // Use decision engine to rank
        const scores = this.decisionEngine.rankContent(contentPool, userState);

        // Apply weight variation (makes reverse engineering harder)
        const variedScores = scores.map(score => ({
            ...score,
            finalScore: score.finalScore * (1 + (Math.random() - 0.5) * this.weightVariation)
        }));

        // Map back to content with scores
        return variedScores
            .map(score => ({
                content: contentPool.find(c => c.id === score.contentId),
                score: score.finalScore
            }))
            .filter((item): item is RankedContent => item.content !== undefined);
    }

    /**
     * Inject controlled randomness
     * Prevents gaming and keeps feed fresh
     */
    private injectRandomness(rankedContent: RankedContent[], randomnessPercent: number): RankedContent[] {
        const count = Math.floor(rankedContent.length * randomnessPercent);

        // Shuffle a small percentage
        for (let i = 0; i < count; i++) {
            const idx1 = Math.floor(Math.random() * rankedContent.length);
            const idx2 = Math.floor(Math.random() * rankedContent.length);
            [rankedContent[idx1], rankedContent[idx2]] = [rankedContent[idx2], rankedContent[idx1]];
        }

        return rankedContent;
    }

    /**
     * Rotate algorithm weights (call this periodically)
     * Makes the algorithm a moving target
     */
    rotateWeights(): void {
        // In production, change weights every few hours
        this.weightVariation = 0.03 + Math.random() * 0.07; // 3-10% variation
    }

    /**
     * Detect suspicious behavior
     * Log quietly, never alert the user
     */
    detectAnomalies(userId: string): boolean {
        const signals = this.signalCollector.getSignalsForUser(userId, 100);

        // Detect bot-like patterns
        const rapidActions = signals.filter((s, i) => {
            if (i === 0) return false;
            const timeDiff = s.timestamp.getTime() - signals[i - 1].timestamp.getTime();
            return timeDiff < 100; // Actions less than 100ms apart
        });

        if (rapidActions.length > 10) {
            // Log anomaly (don't expose to user)
            console.warn(`[ALGO] Suspicious activity detected for user ${userId}`);
            return true;
        }

        return false;
    }
}

// Singleton instance (server-side only)
export const emotionalAlgorithm = new EmotionalAlgorithm();

// Rotate weights every 6 hours
if (typeof window === 'undefined') {
    setInterval(() => {
        emotionalAlgorithm.rotateWeights();
    }, 6 * 60 * 60 * 1000);
}
