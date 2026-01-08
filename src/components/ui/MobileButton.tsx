'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useHapticFeedback, useIsTouchDevice } from '@/hooks/useMobileUtils';

interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    hapticFeedback?: 'light' | 'medium' | 'heavy';
    fullWidth?: boolean;
    loading?: boolean;
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            hapticFeedback = 'light',
            fullWidth = false,
            loading = false,
            disabled,
            onClick,
            className = '',
            ...props
        },
        ref
    ) => {
        const { triggerHaptic } = useHapticFeedback();
        const isTouch = useIsTouchDevice();

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled || loading) return;

            if (isTouch) {
                triggerHaptic(hapticFeedback);
            }

            onClick?.(e);
        };

        const baseStyles = 'relative font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed no-select';

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm min-h-[40px]',
            md: 'px-6 py-3 text-base min-h-[48px]',
            lg: 'px-8 py-4 text-lg min-h-[56px]',
        };

        const variantStyles = {
            primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl',
            secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm',
            ghost: 'bg-transparent text-white hover:bg-white/10',
            danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl',
        };

        const widthStyle = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
                onClick={handleClick}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);

MobileButton.displayName = 'MobileButton';
