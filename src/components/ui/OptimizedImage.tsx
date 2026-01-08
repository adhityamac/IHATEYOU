'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { useNetworkSpeed } from '@/hooks/useMobileUtils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    lowQualitySrc?: string;
    blurDataURL?: string;
    aspectRatio?: string;
    fallback?: string;
    onLoadComplete?: () => void;
}

/**
 * Optimized image component with:
 * - Automatic blur placeholder
 * - Network-aware quality
 * - Progressive loading
 * - Lazy loading by default
 * - Error fallback
 */
export function OptimizedImage({
    src,
    lowQualitySrc,
    blurDataURL,
    alt,
    aspectRatio,
    fallback = '/placeholder.png',
    onLoadComplete,
    priority = false,
    quality,
    ...props
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const networkSpeed = useNetworkSpeed();

    // Adjust quality based on network speed
    const getQuality = () => {
        if (quality) return quality;

        switch (networkSpeed) {
            case 'slow':
                return 50;
            case 'medium':
                return 70;
            case 'fast':
                return 85;
            default:
                return 75;
        }
    };

    useEffect(() => {
        setImageSrc(src);
        setHasError(false);
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
        onLoadComplete?.();
    };

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
        if (fallback) {
            setImageSrc(fallback);
        }
    };

    return (
        <div className="relative overflow-hidden" style={{ aspectRatio }}>
            {/* Loading skeleton */}
            {isLoading && (
                <div className="absolute inset-0 skeleton animate-shimmer" />
            )}

            {/* Actual image */}
            <Image
                {...props}
                src={imageSrc}
                alt={alt}
                quality={getQuality()}
                priority={priority}
                placeholder={blurDataURL ? 'blur' : 'empty'}
                blurDataURL={blurDataURL}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    } ${props.className || ''}`}
            />

            {/* Error state */}
            {hasError && !fallback && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 text-sm">
                    Failed to load image
                </div>
            )}
        </div>
    );
}

/**
 * Avatar component with automatic optimization
 */
interface AvatarProps {
    src: string;
    alt: string;
    size?: number;
    fallbackText?: string;
    className?: string;
}

export function Avatar({
    src,
    alt,
    size = 40,
    fallbackText,
    className = '',
}: AvatarProps) {
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={`relative rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {!hasError ? (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    quality={60}
                    className="object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <span className="text-white font-bold text-sm">
                    {fallbackText || alt.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );
}

/**
 * Background image with blur effect
 */
interface BackgroundImageProps {
    src: string;
    alt: string;
    blur?: number;
    opacity?: number;
    overlay?: boolean;
    children?: React.ReactNode;
}

export function BackgroundImage({
    src,
    alt,
    blur = 0,
    opacity = 100,
    overlay = false,
    children,
}: BackgroundImageProps) {
    return (
        <div className="relative w-full h-full">
            <Image
                src={src}
                alt={alt}
                fill
                quality={60}
                className="object-cover"
                style={{
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                    opacity: opacity / 100,
                }}
                priority={false}
            />
            {overlay && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
            )}
            {children && (
                <div className="relative z-10">
                    {children}
                </div>
            )}
        </div>
    );
}
