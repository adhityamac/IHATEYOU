'use client';

import { useState, useEffect, useCallback } from 'react';
import { GradientTheme, GRADIENT_THEMES } from '../types/GradientThemes';

export const useGradientTheme = () => {
    const [theme, setTheme] = useState<GradientTheme>('purple-pink');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const savedTheme = localStorage.getItem('gradient-theme') as GradientTheme | null;
            const initialTheme = savedTheme || 'purple-pink';
            setTheme(initialTheme);
            applyTheme(initialTheme);
        } catch (error) {
            console.warn('Failed to access localStorage for theme:', error);
            applyTheme('purple-pink');
        }
    }, []);

    const applyTheme = (newTheme: GradientTheme) => {
        const colors = GRADIENT_THEMES[newTheme];
        const root = document.documentElement;

        root.style.setProperty('--gradient-from', colors.gradient.from);
        root.style.setProperty('--gradient-via', colors.gradient.via);
        root.style.setProperty('--gradient-to', colors.gradient.to);
        root.style.setProperty('--accent-primary', colors.accent);
        root.style.setProperty('--accent-hover', colors.accent);
        root.style.setProperty('--message-sent', colors.accent);
    };

    const changeTheme = useCallback((newTheme: GradientTheme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
        try {
            localStorage.setItem('gradient-theme', newTheme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }, []);

    return { theme, changeTheme, mounted };
};
