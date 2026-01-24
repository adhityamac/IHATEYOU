'use client';

import { motion } from 'framer-motion';
import { X, Info, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';

interface HintProps {
    title: string;
    description: string;
    icon?: 'info' | 'lightbulb' | 'alert' | 'check';
    variant?: 'info' | 'warning' | 'success' | 'hint';
    onDismiss?: () => void;
    dismissible?: boolean;
}

export function Hint({
    title,
    description,
    icon = 'lightbulb',
    variant = 'hint',
    onDismiss,
    dismissible = true,
}: HintProps) {
    const icons = {
        info: Info,
        lightbulb: Lightbulb,
        alert: AlertCircle,
        check: CheckCircle,
    };

    const Icon = icons[icon];

    const variantStyles = {
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        warning: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        success: 'bg-green-500/10 border-green-500/20 text-green-400',
        hint: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative p-4 rounded-2xl border backdrop-blur-sm ${variantStyles[variant]}`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm mb-1">{title}</h4>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
                {dismissible && onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Dismiss hint"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
