'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Moon, Zap } from 'lucide-react';
import { Theme } from './GradientThemeProvider';

interface ThemeSelectorProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const themeData = [
    {
        id: 'liquid' as Theme,
        label: 'Vivid Liquid',
        description: 'Fluid dreamscape',
        icon: Sparkles,
        colors: 'from-purple-500 via-pink-500 to-orange-500'
    },
    {
        id: 'spiral' as Theme,
        label: 'Twisted Void',
        description: 'Infinite spiral descent',
        icon: Zap,
        colors: 'from-indigo-600 via-cyan-500 to-emerald-400'
    },
    {
        id: 'dark' as Theme,
        label: 'Pure Abyss',
        description: 'OLED silence',
        icon: Moon,
        colors: 'from-zinc-900 via-black to-zinc-900'
    }
];

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
    return (
        <div className="space-y-3">
            {themeData.map((theme) => {
                const isActive = currentTheme === theme.id;
                const Icon = theme.icon;

                return (
                    <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className={`w-full group relative overflow-hidden rounded-[32px] p-0.5 transition-all duration-500 ${isActive ? 'scale-[1.02] shadow-2xl shadow-white/5' : 'hover:scale-[1.01]'
                            }`}
                    >
                        {/* Background Animated Gradient for Active State */}
                        {isActive && (
                            <motion.div
                                layoutId="theme-border"
                                className={`absolute inset-0 bg-gradient-to-r ${theme.colors} opacity-40`}
                            />
                        )}

                        <div className={`relative flex items-center gap-5 p-5 rounded-[30px] bg-[#09090b] border transition-all duration-500 ${isActive ? 'border-transparent' : 'border-white/5 group-hover:bg-white/5'
                            }`}>
                            {/* Graphic Preview */}
                            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.colors} flex items-center justify-center p-0.5 transition-transform duration-700 group-hover:rotate-12`}>
                                <div className="w-full h-full rounded-[14px] bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center">
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-white/40'} strokeWidth={3} />
                                </div>
                            </div>

                            {/* Label Info */}
                            <div className="flex-1 text-left">
                                <h4 className={`text-sm font-black tracking-tight transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                                    {theme.label}
                                </h4>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">
                                    {theme.description}
                                </p>
                            </div>

                            {/* Status Indicator */}
                            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-500 ${isActive
                                    ? 'bg-white text-black border-white'
                                    : 'bg-white/5 border-white/5 text-transparent'
                                }`}>
                                <Check size={14} strokeWidth={4} />
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}