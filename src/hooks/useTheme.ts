'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types/theme';

/**
 * Custom hook for managing theme state, including localStorage persistence,
 * system preference detection, and DOM attribute updates.
 */
export const useTheme = () => {
    const getInitialTheme = () => {
        try {
            if (typeof window !== 'undefined') {
                const savedTheme = localStorage.getItem('theme') as Theme | null;
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                return savedTheme || (prefersDark ? 'dark' : 'light');
            }
        } catch (error) {
            console.warn('Failed to access localStorage for theme:', error);
            if (typeof window !== 'undefined') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                return prefersDark ? 'dark' : 'light';
            }
        }
        return 'light';
    };
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }, [theme]);

    return { theme, toggleTheme, mounted };
};