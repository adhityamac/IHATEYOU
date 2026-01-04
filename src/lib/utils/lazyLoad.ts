/**
 * Lazy Loading Utilities
 * Dynamic imports for code splitting and performance
 */

import { lazy, ComponentType } from 'react';

/**
 * Lazy load a component with a custom loading fallback
 */
export const lazyLoad = <T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>
) => {
    const LazyComponent = lazy(importFunc);

    return LazyComponent;
};

/**
 * Preload a lazy component
 * Useful for prefetching components before they're needed
 */
export const preloadComponent = (importFunc: () => Promise<any>) => {
    importFunc();
};

// Lazy loaded wellness components
export const LazyVisionBoard = lazy(() => import('@/features/wellness/components/VisionBoard'));
export const LazyTimeCapsule = lazy(() => import('@/features/wellness/components/TimeCapsule'));
export const LazyYearInPixels = lazy(() => import('@/features/wellness/components/YearInPixels'));
export const LazyBodyScan = lazy(() => import('@/features/wellness/components/BodyScan'));

// Lazy loaded chat components  
export const LazyMessagesSection = lazy(() => import('@/features/chat/components/MessagesSection'));

// Lazy loaded backgrounds (heavy 3D/shader components)
export const LazyShaderGradientBackground = lazy(() => import('@/components/backgrounds/ShaderGradientBackground'));
export const LazyModelViewer = lazy(() => import('@/components/shared/ModelViewer'));

// Lazy loaded playzone components
export const LazyChessGame = lazy(() => import('@/features/playzone/components/ChessGame'));
export const LazyTetrisGame = lazy(() => import('@/features/playzone/components/TetrisGame'));
