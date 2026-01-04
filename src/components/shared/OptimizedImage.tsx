/**
 * Optimized Image Component
 * Wrapper around next/image with performance optimizations
 */

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { getPerformanceSettings } from '@/lib/utils/performance';

interface OptimizedImageProps extends Omit<ImageProps, 'quality'> {
    quality?: number;
    showPlaceholder?: boolean;
}

export default function OptimizedImage({
    quality,
    showPlaceholder = true,
    className = '',
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const perfSettings = getPerformanceSettings();

    // Use device-optimized quality
    const imageQuality = quality || perfSettings.imageQuality;

    return (
        <div className={`relative ${className}`}>
            {showPlaceholder && isLoading && (
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
            <Image
                {...props}
                quality={imageQuality}
                loading="lazy"
                onLoadingComplete={() => setIsLoading(false)}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    } ${props.className || ''}`}
            />
        </div>
    );
}

/**
 * Avatar Image Component
 * Optimized for user avatars with fallback
 */
export function AvatarImage({
    src,
    alt,
    size = 40,
    className = '',
}: {
    src: string;
    alt: string;
    size?: number;
    className?: string;
}) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold ${className}`}
                style={{ width: size, height: size }}
            >
                {alt.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className={`rounded-full ${className}`}
            onError={() => setError(true)}
            loading="lazy"
        />
    );
}
