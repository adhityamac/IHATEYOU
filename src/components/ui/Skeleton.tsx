'use client';

import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'button';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export function Skeleton({
    variant = 'rectangular',
    width,
    height,
    count = 1,
    className = '',
    ...props
}: SkeletonProps) {
    const baseClasses = 'skeleton animate-shimmer';

    const variantClasses = {
        text: 'skeleton-text',
        circular: 'skeleton-circle',
        rectangular: '',
        button: 'skeleton-button',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? height : undefined),
        height: height,
    };

    if (count > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                        style={style}
                        {...props}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            {...props}
        />
    );
}

// Pre-built skeleton layouts
export function MessageSkeleton() {
    return (
        <div className="flex items-start gap-3 p-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="80%" height={14} />
                <Skeleton variant="text" width="60%" height={14} />
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="card space-y-4">
            <Skeleton variant="rectangular" width="100%" height={200} />
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="100%" height={16} count={3} />
            <div className="flex gap-2">
                <Skeleton variant="button" width={100} />
                <Skeleton variant="button" width={100} />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="flex items-center gap-4 p-6">
            <Skeleton variant="circular" width={80} height={80} />
            <div className="flex-1 space-y-3">
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="60%" height={16} />
                <div className="flex gap-4 mt-4">
                    <Skeleton variant="rectangular" width={80} height={60} />
                    <Skeleton variant="rectangular" width={80} height={60} />
                    <Skeleton variant="rectangular" width={80} height={60} />
                </div>
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="40%" height={16} />
                        <Skeleton variant="text" width="70%" height={14} />
                    </div>
                    <Skeleton variant="rectangular" width={60} height={32} />
                </div>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton variant="text" width="30%" height={32} />
                <Skeleton variant="text" width="50%" height={16} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card space-y-3">
                        <Skeleton variant="circular" width={48} height={48} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="40%" height={32} />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                <div className="space-y-4">
                    <ListSkeleton count={3} />
                </div>
            </div>
        </div>
    );
}
