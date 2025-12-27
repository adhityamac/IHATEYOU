'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'liquid' | 'dark' | 'spiral' | 'grid';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a GradientThemeProvider');
    return context;
};

export const GradientThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const getInitialTheme = () => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('app-theme') as Theme;
            if (savedTheme) return savedTheme;
        }
        return 'liquid';
    };
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('app-theme', theme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};