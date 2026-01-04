
'use client';

import { useState, useEffect, useCallback } from 'react';
import { emotionalAlgorithm } from '../lib/algorithm';
import { UserState } from '../lib/algorithm/interpreter';
import { FeedDecision } from '../lib/algorithm/decisions';

export function useAlgorithm(userId: string) {
    const [state, setState] = useState<UserState | null>(null);
    const [decision, setDecision] = useState<FeedDecision | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Refresh state periodically or on demand
    const refresh = useCallback(() => {
        // In a real app, this would be a server call
        // Here we simulate the server-side logic on the client for demo purposes
        const interpreter = (emotionalAlgorithm as any).interpreter;
        const decisionEngine = (emotionalAlgorithm as any).decisionEngine;

        if (interpreter && decisionEngine) {
            const newState = interpreter.interpretUserState(userId);
            const newDecision = decisionEngine.decideFeedBehavior(newState);

            setState(newState);
            setDecision(newDecision);
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refresh();
        // Refresh every 30 seconds to adjust to timing/recent signals
        const interval = setInterval(refresh, 30000);
        return () => clearInterval(interval);
    }, [refresh, userId]);

    return {
        state,
        decision,
        isLoading,
        refresh,
        // Helper to rank contentPOOL
        rankContent: (pool: any[]) => {
            if (!state) return pool;
            const decisionEngine = (emotionalAlgorithm as any).decisionEngine;
            return decisionEngine.rankContent(pool, state).map((ranked: any) =>
                pool.find(p => p.id === ranked.contentId)
            );
        }
    };
}
