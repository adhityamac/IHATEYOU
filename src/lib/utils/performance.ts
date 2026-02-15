export interface PerformanceSettings {
    pixelDensity: number;
    frameRate: number;
    enableGrain: boolean;
    enableReflection: boolean;
    strength: number;
}

export const getPerformanceSettings = (): PerformanceSettings => {
    if (typeof window === 'undefined') {
        return {
            pixelDensity: 0.6,
            frameRate: 24,
            enableGrain: true,
            enableReflection: true,
            strength: 4
        };
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return {
            pixelDensity: 0.5,
            frameRate: 0,
            enableGrain: false,
            enableReflection: false,
            strength: 1
        };
    }

    const logicalCores = navigator.hardwareConcurrency || 4;
    // @ts-ignore
    const deviceMemory = (navigator as any).deviceMemory || 8;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const isLowEnd = logicalCores < 4 || deviceMemory < 4 || isMobile;

    if (isLowEnd) {
        return {
            pixelDensity: 0.3,
            frameRate: 15,
            enableGrain: false,
            enableReflection: false,
            strength: 2
        };
    }

    return {
        pixelDensity: 0.6,
        frameRate: 30,
        enableGrain: true,
        enableReflection: true,
        strength: 4
    };
};

export const isLowEndDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    const logicalCores = navigator.hardwareConcurrency || 4;
    // @ts-ignore
    const deviceMemory = (navigator as any).deviceMemory || 8;
    return logicalCores < 4 || deviceMemory < 4;
};