'use client';

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type CurrentTheme = 'light' | 'dark';

interface UseDarkModeReturn {
    mode: ThemeMode;
    currentTheme: CurrentTheme;
    setMode: (mode: ThemeMode) => void;
    isAutoMode: boolean;
}

/**
 * Hook for managing dark/light mode with time-based auto-switching
 * Auto mode: 6 AM - 6 PM = Light, 6 PM - 6 AM = Dark
 */
export const useDarkMode = (): UseDarkModeReturn => {
    // Load saved preference from localStorage using lazy initialization
    const getInitialMode = () => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
            if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
                return savedMode;
            }
        }
        return 'auto';
    };

    const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
    const [mounted, setMounted] = useState(false);

    // Get time-based theme
    const getTimeBasedTheme = useCallback((): CurrentTheme => {
        const hour = new Date().getHours();
        // 6 AM (6) to 6 PM (18) = Light mode
        // 6 PM (18) to 6 AM (6) = Dark mode
        return hour >= 6 && hour < 18 ? 'light' : 'dark';
    }, []);

    // Calculate current theme based on mode
    const calculateCurrentTheme = useCallback((themeMode: ThemeMode): CurrentTheme => {
        if (themeMode === 'auto') {
            return getTimeBasedTheme();
        }
        return themeMode;
    }, [getTimeBasedTheme]);

    // Set initial theme based on mode
    const [currentTheme, setCurrentTheme] = useState<CurrentTheme>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
            if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
                return calculateCurrentTheme(savedMode);
            }
        }
        return getTimeBasedTheme();
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Update theme when mode changes
    useEffect(() => {
        if (!mounted) return;

        const newTheme = calculateCurrentTheme(mode);
        setCurrentTheme(newTheme);

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', newTheme);

        // Save to localStorage
        localStorage.setItem('themeMode', mode);
    }, [mode, mounted, calculateCurrentTheme]);

    // Auto-update theme every minute if in auto mode
    useEffect(() => {
        if (!mounted || mode !== 'auto') return;

        const interval = setInterval(() => {
            const newTheme = getTimeBasedTheme();
            if (newTheme !== currentTheme) {
                setCurrentTheme(newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [mode, currentTheme, mounted, getTimeBasedTheme]);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
    };

    return {
        mode,
        currentTheme,
        setMode,
        isAutoMode: mode === 'auto',
    };
};
