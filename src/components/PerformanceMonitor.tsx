'use client';

import { useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformance';

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
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">Performance</span>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/60 hover:text-white"
                >
                    ×
                </button>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between gap-4">
                    <span className="text-white/60">FPS:</span>
                    <span className={`font-bold ${getFPSColor(metrics.fps)}`}>
                        {metrics.fps}
                    </span>
                </div>
                {metrics.memory && (
                    <div className="flex justify-between gap-4">
                        <span className="text-white/60">Memory:</span>
                        <span className="text-white">{metrics.memory} MB</span>
                    </div>
                )}
                <div className="flex justify-between gap-4">
                    <span className="text-white/60">Load:</span>
                    <span className="text-white">{metrics.loadTime} ms</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-white/60">Render:</span>
                    <span className="text-white">{metrics.renderTime} ms</span>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 text-white/40 text-[10px]">
                Press Ctrl + Shift + P to toggle
            </div>
        </div>
    );
}
