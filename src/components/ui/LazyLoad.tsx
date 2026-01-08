'use client';

import { useEffect, useRef, useState, ComponentType } from 'react';
import { Skeleton } from './Skeleton';

interface LazyLoadOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Hook for lazy loading with Intersection Observer
 */
export function useLazyLoad({
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
}: LazyLoadOptions = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.disconnect();
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { elementRef, isVisible };
}

/**
 * Lazy load wrapper component
 */
interface LazyLoadProps extends LazyLoadOptions {
    children: React.ReactNode;
    placeholder?: React.ReactNode;
    height?: string | number;
    className?: string;
}

export function LazyLoad({
    children,
    placeholder,
    height = 'auto',
    className = '',
    ...options
}: LazyLoadProps) {
    const { elementRef, isVisible } = useLazyLoad(options);

    return (
        <div
            ref={elementRef}
            className={className}
            style={{ minHeight: height }}
        >
            {isVisible ? children : (placeholder || <Skeleton height={height} />)}
        </div>
    );
}

/**
 * Lazy load component dynamically
 */
interface LazyComponentProps<T = any> {
    loader: () => Promise<{ default: ComponentType<T> }>;
    props?: T;
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
}

export function LazyComponent<T = any>({
    loader,
    props,
    fallback = <Skeleton height={200} />,
    errorFallback = <div className="text-red-400">Failed to load component</div>,
}: LazyComponentProps<T>) {
    const [Component, setComponent] = useState<ComponentType<T> | null>(null);
    const [error, setError] = useState(false);
    const { elementRef, isVisible } = useLazyLoad();

    useEffect(() => {
        if (isVisible && !Component) {
            loader()
                .then((module) => setComponent(() => module.default))
                .catch(() => setError(true));
        }
    }, [isVisible, Component, loader]);

    return (
        <div ref={elementRef}>
            {error ? errorFallback : Component ? <Component {...(props as T)} /> : fallback}
        </div>
    );
}

/**
 * Preload images on hover
 */
export function usePreloadImage(src: string) {
    const [isPreloaded, setIsPreloaded] = useState(false);

    const preload = () => {
        if (isPreloaded) return;

        const img = new window.Image();
        img.src = src;
        img.onload = () => setIsPreloaded(true);
    };

    return { preload, isPreloaded };
}

/**
 * Lazy load list items with virtualization
 */
interface LazyListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    itemHeight?: number;
    overscan?: number;
    className?: string;
}

export function LazyList<T>({
    items,
    renderItem,
    itemHeight = 100,
    overscan = 3,
    className = '',
}: LazyListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;

            const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
            const end = Math.min(
                items.length,
                Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
            );

            setVisibleRange({ start, end });
        };

        container.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial calculation

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [items.length, itemHeight, overscan]);

    const totalHeight = items.length * itemHeight;
    const offsetY = visibleRange.start * itemHeight;

    return (
        <div
            ref={containerRef}
            className={`overflow-auto ${className}`}
            style={{ height: '100%' }}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
                        <div key={visibleRange.start + index} style={{ height: itemHeight }}>
                            {renderItem(item, visibleRange.start + index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Defer rendering until idle
 */
export function useDeferredRender(delay = 100) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return shouldRender;
}

/**
 * Component that defers rendering
 */
interface DeferredProps {
    children: React.ReactNode;
    delay?: number;
    fallback?: React.ReactNode;
}

export function Deferred({ children, delay = 100, fallback = null }: DeferredProps) {
    const shouldRender = useDeferredRender(delay);
    return <>{shouldRender ? children : fallback}</>;
}
