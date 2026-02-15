'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { isLowEndDevice } from '@/lib/utils/performance';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
    fallbackSrc?: string;
    containerClassName?: string;
}

export default function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    fallbackSrc = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop', // Abstract fallback
    quality,
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [deviceQuality, setDeviceQuality] = useState(75);

    useEffect(() => {
        if (isLowEndDevice()) {
            setDeviceQuality(60);
        } else {
            setDeviceQuality(90);
        }
    }, []);

    const finalQuality = quality || deviceQuality;

    return (
        <div className={`relative overflow-hidden ${containerClassName || ''}`}>
            <Image
                src={error ? fallbackSrc : src}
                alt={alt}
                quality={finalQuality}
                onLoad={() => setIsLoading(false)}
                onError={() => setError(true)}
                className={`transition-all duration-500 ${isLoading ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'
                    } ${className || ''}`}
                {...props}
            />
        </div>
    );
}

export function AvatarImage({ src, alt, size = 40, className }: { src: string; alt: string; size?: number; className?: string }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            containerClassName={`rounded-full ${className || ''}`}
            fallbackSrc={`https://api.dicebear.com/7.x/initials/svg?seed=${alt}`}
        />
    );
}