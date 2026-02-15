'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InteractiveProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: 'scale' | 'glow' | 'lift';
    onClick?: () => void;
}

export const Interactive = forwardRef<HTMLDivElement, InteractiveProps>(({
    children,
    className,
    variant = 'scale',
    onClick,
    ...props
}, ref) => {

    const variants = {
        scale: {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 }
        },
        lift: {
            whileHover: { y: -2, scale: 1.01 },
            whileTap: { scale: 0.99 }
        },
        glow: {
            whileHover: {
                scale: 1.02,
                boxShadow: "0 0 20px rgba(var(--accent-primary), 0.3)"
            },
            whileTap: { scale: 0.98 }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={cn("cursor-pointer select-none", className)}
            onClick={onClick}
            {...variants[variant]}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
});

Interactive.displayName = "Interactive";
