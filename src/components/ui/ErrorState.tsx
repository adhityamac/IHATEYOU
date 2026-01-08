'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, XCircle, AlertTriangle, WifiOff, RefreshCw, Home } from 'lucide-react';
import { MobileButton } from './MobileButton';

interface ErrorStateProps {
    type?: 'error' | 'warning' | 'offline' | 'notFound' | 'empty';
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    icon?: ReactNode;
    children?: ReactNode;
}

export function ErrorState({
    type = 'error',
    title,
    message,
    action,
    secondaryAction,
    icon,
    children,
}: ErrorStateProps) {
    const defaultContent = {
        error: {
            icon: <XCircle size={64} />,
            title: 'Something went wrong',
            message: 'We encountered an unexpected error. Please try again.',
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
        },
        warning: {
            icon: <AlertTriangle size={64} />,
            title: 'Warning',
            message: 'Please review the information and try again.',
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10',
        },
        offline: {
            icon: <WifiOff size={64} />,
            title: 'No internet connection',
            message: 'Please check your connection and try again.',
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/10',
        },
        notFound: {
            icon: <AlertCircle size={64} />,
            title: 'Not found',
            message: "We couldn't find what you're looking for.",
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
        },
        empty: {
            icon: <AlertCircle size={64} />,
            title: 'Nothing here yet',
            message: 'Get started by adding some content.',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
    };

    const config = defaultContent[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[400px] p-8"
        >
            <div className="text-center max-w-md">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${config.bgColor} ${config.color}`}
                >
                    {icon || config.icon}
                </motion.div>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-black text-white mb-3"
                >
                    {title || config.title}
                </motion.h2>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/60 mb-6"
                >
                    {message || config.message}
                </motion.p>

                {/* Custom Content */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        {children}
                    </motion.div>
                )}

                {/* Actions */}
                {(action || secondaryAction) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        {action && (
                            <MobileButton
                                variant="primary"
                                onClick={action.onClick}
                                hapticFeedback="medium"
                            >
                                {action.label}
                            </MobileButton>
                        )}
                        {secondaryAction && (
                            <MobileButton
                                variant="secondary"
                                onClick={secondaryAction.onClick}
                                hapticFeedback="light"
                            >
                                {secondaryAction.label}
                            </MobileButton>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

// Pre-built error states
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorState
            type="offline"
            action={onRetry ? {
                label: 'Try Again',
                onClick: onRetry,
            } : undefined}
        />
    );
}

export function NotFoundError({ onGoHome }: { onGoHome?: () => void }) {
    return (
        <ErrorState
            type="notFound"
            title="404 - Page Not Found"
            message="The page you're looking for doesn't exist."
            icon={<Home size={64} />}
            action={onGoHome ? {
                label: 'Go Home',
                onClick: onGoHome,
            } : undefined}
        />
    );
}

export function EmptyState({
    title,
    message,
    actionLabel,
    onAction,
}: {
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <ErrorState
            type="empty"
            title={title}
            message={message}
            action={onAction && actionLabel ? {
                label: actionLabel,
                onClick: onAction,
            } : undefined}
        />
    );
}

// Inline error for forms
interface InlineErrorProps {
    message: string;
    variant?: 'error' | 'warning' | 'info';
}

export function InlineError({ message, variant = 'error' }: InlineErrorProps) {
    const variantStyles = {
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        warning: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };

    const icons = {
        error: <XCircle size={16} />,
        warning: <AlertTriangle size={16} />,
        info: <AlertCircle size={16} />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${variantStyles[variant]}`}
        >
            {icons[variant]}
            <span>{message}</span>
        </motion.div>
    );
}

// Loading error with retry
export function LoadingError({
    message = 'Failed to load content',
    onRetry,
}: {
    message?: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <RefreshCw size={48} className="text-red-400 animate-pulse" />
            <p className="text-white/60 text-center">{message}</p>
            <MobileButton
                variant="primary"
                size="sm"
                onClick={onRetry}
                hapticFeedback="medium"
            >
                <RefreshCw size={16} className="mr-2" />
                Retry
            </MobileButton>
        </div>
    );
}
