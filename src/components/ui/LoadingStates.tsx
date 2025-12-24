'use client';

import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
    type?: 'spinner' | 'pulse' | 'dots' | 'skeleton';
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
}

export function LoadingState({ type = 'spinner', size = 'md', message, fullScreen = false }: LoadingStateProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const Container = fullScreen ? 'div' : motion.div;
    const containerProps = fullScreen
        ? { className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50' }
        : { className: 'flex flex-col items-center justify-center p-8' };

    return (
        <Container {...containerProps}>
            <div className="flex flex-col items-center gap-4">
                {type === 'spinner' && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <Loader2 className={`${sizeClasses[size]} text-purple-500`} />
                    </motion.div>
                )}

                {type === 'pulse' && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-500 to-pink-500`}
                    />
                )}

                {type === 'dots' && (
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                        ))}
                    </div>
                )}

                {type === 'skeleton' && (
                    <div className="w-full max-w-md space-y-3">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="h-12 rounded-xl bg-white/10"
                            />
                        ))}
                    </div>
                )}

                {message && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 text-sm font-medium"
                    >
                        {message}
                    </motion.p>
                )}
            </div>
        </Container>
    );
}

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    fullScreen?: boolean;
}

export function ErrorState({
    title = 'Something went wrong',
    message,
    onRetry,
    onDismiss,
    fullScreen = false,
}: ErrorStateProps) {
    const Container = fullScreen ? 'div' : motion.div;
    const containerProps = fullScreen
        ? { className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8' }
        : { className: 'flex flex-col items-center justify-center p-8' };

    return (
        <Container {...containerProps}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full p-8 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl"
            >
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                        className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4"
                    >
                        <AlertCircle size={32} className="text-red-400" />
                    </motion.div>

                    <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
                    <p className="text-white/60 mb-6">{message}</p>

                    <div className="flex gap-3 w-full">
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                            >
                                Dismiss
                            </button>
                        )}
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </Container>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            {icon && (
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-6 text-white/20"
                >
                    {icon}
                </motion.div>
            )}

            <h3 className="text-2xl font-black text-white/40 mb-2">{title}</h3>
            <p className="text-white/30 mb-6 max-w-md">{message}</p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}

// Skeleton components for different content types
export function SkeletonCard() {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-white/10"
                />
                <div className="flex-1 space-y-2">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                        className="h-4 w-32 rounded bg-white/10"
                    />
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="h-3 w-24 rounded bg-white/10"
                    />
                </div>
            </div>
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="h-20 rounded-xl bg-white/10"
            />
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
