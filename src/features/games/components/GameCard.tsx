'use client';

import { motion } from 'framer-motion';
import { Target, Play, Zap, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for merging classes

interface GameCardProps {
    id: string;
    name: string;
    description?: string;
    icon: React.ReactNode;
    category: string;
    difficulty: string;
    time?: number;
    multiplayer?: boolean;
    onClick: () => void;
    className?: string;
    featured?: boolean;
}

export function GameCard({
    id,
    name,
    description,
    icon,
    category,
    difficulty,
    time,
    multiplayer,
    onClick,
    className,
    featured = false,
}: GameCardProps) {
    // Theme Logic
    const variant = id === 'chess' ? 'chess' : id === 'pacman' ? 'pacman' : 'default';

    const getThemeStyles = () => {
        switch (variant) {
            case 'chess':
                return {
                    container: 'bg-gradient-to-br from-gray-900 to-black border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
                    iconBg: 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 text-amber-100',
                    title: 'font-serif tracking-wider text-amber-50',
                    accent: 'text-amber-400',
                    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                };
            case 'pacman':
                return {
                    container: 'bg-black border-pink-500/40 hover:border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]',
                    iconBg: 'bg-pink-500/10 border-pink-500/30 text-pink-400 relative overflow-hidden',
                    title: 'font-mono tracking-tighter text-pink-200',
                    accent: 'text-cyan-400',
                    badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
                };
            default:
                return {
                    container: 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 shadow-lg',
                    iconBg: 'bg-white/5 border-white/10 text-white/80',
                    title: 'font-sans text-white',
                    accent: 'text-orange-400',
                    badge: 'bg-white/5 text-white/40',
                };
        }
    };

    const theme = getThemeStyles();

    return (
        <motion.button
            layoutId={`game-card-${id}`}
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative group flex flex-col p-6 rounded-3xl border transition-all duration-300 text-left overflow-hidden h-full min-h-[180px]",
                theme.container,
                featured ? "col-span-2 row-span-2" : "col-span-1",
                className
            )}
        >
            {/* Background Glow Effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full",
                    variant === 'chess' ? "bg-amber-500/10" :
                        variant === 'pacman' ? "bg-pink-500/10" :
                            "bg-white/5"
                )} />
            </div>

            {/* Scanline Effect for Pacman */}
            {variant === 'pacman' && (
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
            )}

            {/* Icon & Badges */}
            <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                <motion.div
                    className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-3xl border backdrop-blur-md shadow-sm",
                        theme.iconBg
                    )}
                    animate={variant === 'chess' ? { y: [0, -4, 0] } : variant === 'pacman' ? { x: [0, 1, -1, 0] } : {}}
                    transition={{
                        repeat: Infinity,
                        duration: variant === 'chess' ? 4 : 0.2,
                        repeatType: variant === 'chess' ? "reverse" : "mirror",
                        repeatDelay: variant === 'pacman' ? 3 : 0
                    }}
                >
                    {icon}
                    {variant === 'pacman' && <div className="absolute inset-0 bg-pink-500/10 animate-pulse rounded-2xl" />}
                </motion.div>

                <div className="flex gap-2">
                    {time && (
                        <div className={cn("px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider flex items-center gap-1", theme.badge)}>
                            <Clock size={10} /> {time}m
                        </div>
                    )}
                    {multiplayer && (
                        <div className={cn("px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider flex items-center gap-1", theme.badge)}>
                            <Users size={10} />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mt-auto relative z-10">
                <h3 className={cn("text-lg font-bold mb-1 flex items-center gap-2", theme.title)}>
                    {name}
                </h3>

                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-60">
                    <span className={theme.accent}>{category}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{difficulty}</span>
                </div>
            </div>

            {/* Play Button Overlay (appears on hover) */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                    variant === 'chess' ? "bg-amber-500 text-black" :
                        variant === 'pacman' ? "bg-pink-500 text-white" :
                            "bg-white text-black"
                )}>
                    <Play size={12} fill="currentColor" />
                </div>
            </div>
        </motion.button>
    );
}
