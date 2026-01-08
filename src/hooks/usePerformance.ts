'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
    fps: number;
    memory?: number;
    loadTime: number;
    renderTime: number;
}

/**
 * Hook to monitor FPS (frames per second)
 */
export function useFPS() {
    const [fps, setFps] = useState(60);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
        let animationFrameId: number;

        const measureFPS = () => {
            frameCountRef.current++;
            const currentTime = performance.now();
            const elapsed = currentTime - lastTimeRef.current;

            if (elapsed >= 1000) {
                setFps(Math.round((frameCountRef.current * 1000) / elapsed));
                frameCountRef.current = 0;
                lastTimeRef.current = currentTime;
            }

            animationFrameId = requestAnimationFrame(measureFPS);
        };

        animationFrameId = requestAnimationFrame(measureFPS);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return fps;
}

/**
 * Hook to monitor memory usage (Chrome only)
 */
export function useMemory() {
    const [memory, setMemory] = useState<number | null>(null);

    useEffect(() => {
        const checkMemory = () => {
            if ('memory' in performance) {
                const mem = (performance as any).memory;
                const usedMB = mem.usedJSHeapSize / 1048576;
                setMemory(Math.round(usedMB));
            }
        };

        checkMemory();
        const interval = setInterval(checkMemory, 5000);

        return () => clearInterval(interval);
    }, []);

    return memory;
}

/**
 * Hook to measure component render time
 */
export function useRenderTime(componentName: string) {
    const renderStartRef = useRef(performance.now());
    const [renderTime, setRenderTime] = useState(0);

    useEffect(() => {
        const renderEnd = performance.now();
        const duration = renderEnd - renderStartRef.current;
        setRenderTime(duration);

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
        }
    });

    return renderTime;
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor() {
    const fps = useFPS();
    const memory = useMemory();
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 60,
        memory: undefined,
        loadTime: 0,
        renderTime: 0,
    });

    useEffect(() => {
        // Get navigation timing
        if (typeof window !== 'undefined' && window.performance) {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                const renderTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;

                setMetrics((prev) => ({
                    ...prev,
                    loadTime: Math.round(loadTime),
                    renderTime: Math.round(renderTime),
                }));
            }
        }
    }, []);

    useEffect(() => {
        setMetrics((prev) => ({
            ...prev,
            fps,
            memory: memory || undefined,
        }));
    }, [fps, memory]);

    return metrics;
}

/**
 * Debounce hook for performance
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Throttle hook for performance
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const lastRun = useRef(Date.now());

    return useCallback(
        ((...args) => {
            const now = Date.now();
            if (now - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = now;
            }
        }) as T,
        [callback, delay]
    );
}

/**
 * Hook to detect slow device
 */
export function useIsSlowDevice() {
    const [isSlowDevice, setIsSlowDevice] = useState(false);

    useEffect(() => {
        // Check hardware concurrency (CPU cores)
        const cores = navigator.hardwareConcurrency || 2;

        // Check device memory (if available)
        const memory = (navigator as any).deviceMemory || 4;

        // Consider device slow if < 4 cores or < 4GB RAM
        setIsSlowDevice(cores < 4 || memory < 4);
    }, []);

    return isSlowDevice;
}

/**
 * Hook to reduce motion for accessibility and performance
 */
export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * Performance monitoring component for development
 */
export function PerformanceMonitor() {
    const metrics = usePerformanceMonitor();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                setIsVisible((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (!isVisible || process.env.NODE_ENV !== 'development') {
        return null;
    }

    const getFPSColor = (fps: number) => {
        if (fps >= 55) return 'text-green-400';
        if (fps >= 30) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className= "fixed bottom-4 right-4 z-[9999] bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 font-mono text-xs" >
        <div className="flex items-center justify-between mb-2" >
            <span className="font-bold text-white" > Performance </span>
                < button
    onClick = {() => setIsVisible(false)
}
className = "text-white/60 hover:text-white"
    >
                    ×
</button>
    </div>
    < div className = "space-y-1" >
        <div className="flex justify-between gap-4" >
            <span className="text-white/60" > FPS: </span>
                < span className = {`font-bold ${getFPSColor(metrics.fps)}`}>
                    { metrics.fps }
                    </span>
                    </div>
{
    metrics.memory && (
        <div className="flex justify-between gap-4" >
            <span className="text-white/60" > Memory: </span>
                < span className = "text-white" > { metrics.memory } MB </span>
                    </div>
                )
}
<div className="flex justify-between gap-4" >
    <span className="text-white/60" > Load: </span>
        < span className = "text-white" > { metrics.loadTime } ms </span>
            </div>
            < div className = "flex justify-between gap-4" >
                <span className="text-white/60" > Render: </span>
                    < span className = "text-white" > { metrics.renderTime } ms </span>
                        </div>
                        </div>
                        < div className = "mt-2 pt-2 border-t border-white/10 text-white/40 text-[10px]" >
                            Press Ctrl + Shift + P to toggle
                                </div>
                                </div>
    );
}
