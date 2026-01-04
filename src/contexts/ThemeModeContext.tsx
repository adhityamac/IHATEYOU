'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light' | 'retro' | 'retro-soul';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('dark');

    // Load theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('theme-mode') as ThemeMode;
        if (saved && ['dark', 'light', 'retro', 'retro-soul'].includes(saved)) {
            setModeState(saved);
            applyTheme(saved);
        }
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
        applyTheme(newMode);
    };

    const toggleMode = () => {
        const modes: ThemeMode[] = ['dark', 'light', 'retro', 'retro-soul'];
        const currentIndex = modes.indexOf(mode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setMode(nextMode);
    };

    const applyTheme = (theme: ThemeMode) => {
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const colors = {
                dark: '#000000',
                light: '#FFFFFF',
                retro: '#1a1a2e',
                'retro-soul': '#fef9c3'
            };
            metaThemeColor.setAttribute('content', colors[theme]);
        }
    };

    return (
        <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeModeProvider');
    }
    return context;
}
