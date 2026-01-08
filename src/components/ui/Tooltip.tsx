'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    variant?: 'default' | 'info' | 'warning' | 'success' | 'hint';
    delay?: number;
    showArrow?: boolean;
}

export function Tooltip({
    content,
    children,
    position = 'top',
    variant = 'default',
    delay = 200,
    showArrow = true,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent',
    };

    const variantStyles = {
        default: 'bg-gray-900 text-white border-gray-700',
        info: 'bg-blue-900 text-blue-100 border-blue-700',
        warning: 'bg-orange-900 text-orange-100 border-orange-700',
        success: 'bg-green-900 text-green-100 border-green-700',
        hint: 'bg-purple-900 text-purple-100 border-purple-700',
    };

    const arrowColors = {
        default: 'border-t-gray-900',
        info: 'border-t-blue-900',
        warning: 'border-t-orange-900',
        success: 'border-t-green-900',
        hint: 'border-t-purple-900',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
                    >
                        <div
                            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border backdrop-blur-sm ${variantStyles[variant]} shadow-xl`}
                        >
                            {content}
                        </div>
                        {showArrow && (
                            <div
                                className={`absolute w-0 h-0 ${arrowClasses[position]} ${arrowColors[variant]}`}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

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

interface OnboardingStepProps {
    step: number;
    totalSteps: number;
    title: string;
    description: string;
    onNext?: () => void;
    onSkip?: () => void;
    onPrevious?: () => void;
    showSkip?: boolean;
}

export function OnboardingStep({
    step,
    totalSteps,
    title,
    description,
    onNext,
    onSkip,
    onPrevious,
    showSkip = true,
}: OnboardingStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-2xl max-w-md"
        >
            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
                    <span>Step {step} of {totalSteps}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="h-1 bg-purple-900/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
                <p className="text-purple-200">{description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                    {step > 1 && onPrevious && (
                        <button
                            onClick={onPrevious}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                        >
                            Back
                        </button>
                    )}
                    {showSkip && onSkip && (
                        <button
                            onClick={onSkip}
                            className="px-4 py-2 rounded-xl text-purple-300 hover:text-white font-semibold transition-colors"
                        >
                            Skip
                        </button>
                    )}
                </div>
                {onNext && (
                    <button
                        onClick={onNext}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                        {step === totalSteps ? 'Get Started' : 'Next'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
