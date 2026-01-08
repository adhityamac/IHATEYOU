'use client';

import { useCallback, useEffect } from 'react';

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook to provide haptic feedback on mobile devices
 * Falls back to visual feedback on unsupported devices
 */
export function useHapticFeedback() {
    const isSupported = useCallback(() => {
        return 'vibrate' in navigator;
    }, []);

    const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
        if (!isSupported()) return;

        const patterns: Record<HapticFeedbackType, number | number[]> = {
            light: 10,
            medium: 20,
            heavy: 30,
            success: [10, 50, 10],
            warning: [20, 100, 20],
            error: [30, 100, 30, 100, 30],
        };

        const pattern = patterns[type];

        if (Array.isArray(pattern)) {
            navigator.vibrate(pattern);
        } else {
            navigator.vibrate(pattern);
        }
    }, [isSupported]);

    return { triggerHaptic, isSupported: isSupported() };
}

/**
 * Hook to detect if device is mobile
 */
export function useIsMobile() {
    const checkIsMobile = useCallback(() => {
        if (typeof window === 'undefined') return false;

        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) || window.innerWidth < 768;
    }, []);

    return checkIsMobile();
}

/**
 * Hook to detect touch device
 */
export function useIsTouchDevice() {
    const checkIsTouch = useCallback(() => {
        if (typeof window === 'undefined') return false;

        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }, []);

    return checkIsTouch();
}

/**
 * Hook to handle safe area insets
 */
export function useSafeAreaInsets() {
    const getSafeAreaInsets = useCallback(() => {
        if (typeof window === 'undefined') {
            return { top: 0, bottom: 0, left: 0, right: 0 };
        }

        const style = getComputedStyle(document.documentElement);

        return {
            top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
            bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
            left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
            right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
        };
    }, []);

    return getSafeAreaInsets();
}

/**
 * Hook to prevent body scroll (useful for modals on mobile)
 */
export function usePreventBodyScroll(isActive: boolean) {
    useEffect(() => {
        if (!isActive) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalPosition = window.getComputedStyle(document.body).position;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.position = originalPosition;
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, [isActive]);
}

/**
 * Hook to detect network speed (useful for adaptive loading)
 */
export function useNetworkSpeed() {
    const getNetworkSpeed = useCallback(() => {
        if (typeof navigator === 'undefined' || !('connection' in navigator)) {
            return 'unknown';
        }

        const connection = (navigator as any).connection;
        const effectiveType = connection?.effectiveType;

        if (effectiveType === '4g') return 'fast';
        if (effectiveType === '3g') return 'medium';
        if (effectiveType === '2g' || effectiveType === 'slow-2g') return 'slow';

        return 'unknown';
    }, []);

    return getNetworkSpeed();
}
