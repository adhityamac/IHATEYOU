'use client';

import { useEffect, useRef } from 'react';
import { signalCollector } from '../lib/algorithm/signals';

export function useSignals(userId: string) {
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(Date.now());

    useEffect(() => {
        // Track time of day on mount
        signalCollector.trackTimeOfDay(userId, 'app_mount');

        // Track scroll speed
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            const distance = Math.abs(currentScrollY - lastScrollY.current);
            const timeDiff = currentTime - lastScrollTime.current;

            if (timeDiff > 100) {
                const speedValue = distance / timeDiff;
                let speed: 'fast' | 'slow' | 'normal' = 'normal';

                if (speedValue > 2) speed = 'fast';
                else if (speedValue < 0.2) speed = 'slow';

                signalCollector.trackScrollSpeed(userId, speed);

                lastScrollY.current = currentScrollY;
                lastScrollTime.current = currentTime;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            signalCollector.trackTimeOfDay(userId, 'app_unmount');
        };
    }, [userId]);

    const trackMood = (emotion: string, intensity: number = 1) => {
        signalCollector.trackMoodCheckIn(userId, emotion, intensity);
    };

    const trackTool = (tool: string, duration: number = 0) => {
        signalCollector.trackToolUsage(userId, tool, duration);
    };

    const trackInteraction = (action: string, pauseDuration: number) => {
        signalCollector.trackInteractionPause(userId, action, pauseDuration);
    };

    const trackConnection = (targetUserId: string, messageCount: number = 1) => {
        signalCollector.trackConversationPattern(userId, targetUserId, messageCount);
    };

    const trackContent = (contentId: string, dwellTime: number) => {
        signalCollector.trackContentDwell(userId, contentId, dwellTime);
    };

    return {
        trackMood,
        trackTool,
        trackInteraction,
        trackConnection,
        trackContent
    };
}
