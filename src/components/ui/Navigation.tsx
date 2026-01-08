'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useHapticFeedback } from '@/hooks/useMobileUtils';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface NavigationHelperProps {
    breadcrumbs?: BreadcrumbItem[];
    onBack?: () => void;
    onHome?: () => void;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function NavigationHelper({
    breadcrumbs,
    onBack,
    onHome,
    title,
    subtitle,
    actions,
}: NavigationHelperProps) {
    const { triggerHaptic } = useHapticFeedback();

    const handleBack = () => {
        triggerHaptic('light');
        onBack?.();
    };

    const handleHome = () => {
        triggerHaptic('medium');
        onHome?.();
    };

    return (
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Back/Home + Breadcrumbs */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {onBack && (
                            <button
                                onClick={handleBack}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors focus-ring"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} className="text-white" />
                            </button>
                        )}

                        {onHome && (
                            <button
                                onClick={handleHome}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors focus-ring"
                                aria-label="Go home"
                            >
                                <Home size={20} className="text-white" />
                            </button>
                        )}

                        {/* Breadcrumbs or Title */}
                        {breadcrumbs ? (
                            <nav className="flex items-center gap-2 overflow-x-auto">
                                {breadcrumbs.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {index > 0 && (
                                            <span className="text-white/40">/</span>
                                        )}
                                        {item.onClick ? (
                                            <button
                                                onClick={() => {
                                                    triggerHaptic('light');
                                                    item.onClick?.();
                                                }}
                                                className="text-sm font-medium text-white/60 hover:text-white transition-colors whitespace-nowrap"
                                            >
                                                {item.label}
                                            </button>
                                        ) : (
                                            <span className="text-sm font-medium text-white whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        ) : title ? (
                            <div className="min-w-0">
                                <h1 className="text-lg font-bold text-white truncate">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-sm text-white/60 truncate">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Right: Actions */}
                    {actions && (
                        <div className="flex items-center gap-2 ml-4">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mobile-friendly bottom navigation
interface BottomNavItem {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    badge?: number;
}

interface BottomNavigationProps {
    items: BottomNavItem[];
}

export function BottomNavigation({ items }: BottomNavigationProps) {
    const { triggerHaptic } = useHapticFeedback();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
            <div className="bg-black/90 backdrop-blur-xl border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-around h-16">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    triggerHaptic('light');
                                    item.onClick();
                                }}
                                className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] ${item.active
                                        ? 'text-purple-400'
                                        : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                <div className="relative">
                                    {item.icon}
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-semibold">
                                    {item.label}
                                </span>
                                {item.active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Floating Action Button
interface FABProps {
    icon: React.ReactNode;
    label?: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function FloatingActionButton({
    icon,
    label,
    onClick,
    variant = 'primary',
    position = 'bottom-right',
}: FABProps) {
    const { triggerHaptic } = useHapticFeedback();
    const [isExpanded, setIsExpanded] = useState(false);

    const positionClasses = {
        'bottom-right': 'bottom-20 right-6',
        'bottom-left': 'bottom-20 left-6',
        'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow-primary',
        secondary: 'bg-white/10 text-white backdrop-blur-sm border border-white/20',
    };

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
                triggerHaptic('medium');
                onClick();
            }}
            onMouseEnter={() => label && setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`fixed z-50 ${positionClasses[position]} ${variantClasses[variant]} rounded-full shadow-2xl transition-all focus-ring`}
        >
            <div className="flex items-center gap-2 px-4 py-4">
                {icon}
                <AnimatePresence>
                    {label && isExpanded && (
                        <motion.span
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="font-bold text-sm whitespace-nowrap overflow-hidden"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
}
