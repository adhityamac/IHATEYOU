/**
 * Performance Utilities
 * Device detection and performance optimization helpers
 */

/**
 * Detect if the device is low-end based on hardware capabilities
 */
export const isLowEndDevice = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;
    if (cores < 4) return true;

    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) return true;

    // Check connection speed
    const connection = (navigator as any).connection;
    if (connection) {
        const slowConnections = ['slow-2g', '2g', '3g'];
        if (slowConnections.includes(connection.effectiveType)) return true;
    }

    return false;
};

/**
 * Detect if the device is mobile
 */
export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

/**
 * Detect if the device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimal performance settings based on device capabilities
 */
export const getPerformanceSettings = () => {
    const isLowEnd = isLowEndDevice();
    const isMobile = isMobileDevice();
    const reducedMotion = prefersReducedMotion();

    return {
        // Shader/3D settings
        shaderPixelDensity: isLowEnd ? 0.3 : isMobile ? 0.5 : 0.6,
        shaderFrameRate: isLowEnd ? 15 : isMobile ? 24 : 30,
        enableShaderGrain: !isLowEnd,

        // Animation settings
        enableAnimations: !reducedMotion,
        animationDuration: reducedMotion ? 0 : isLowEnd ? 200 : 300,

        // Image settings
        imageQuality: isLowEnd ? 75 : 90,
        lazyLoadImages: true,

        // General
        enableBlur: !isLowEnd,
        enableShadows: !isLowEnd,
        virtualScrolling: isMobile,
    };
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
    typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (cb: IdleRequestCallback) => setTimeout(cb, 1);

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
    typeof window !== 'undefined' && 'cancelIdleCallback' in window
        ? window.cancelIdleCallback
        : (id: number) => clearTimeout(id);
