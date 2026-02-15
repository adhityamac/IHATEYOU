import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Helper to create lazy loaded components with a standard loading state
export function lazyLoad<T>(
    importFunc: () => Promise<{ default: ComponentType<T> }>,
    loadingHeight: string | number = '100%',
    ssr: boolean = false
) {
    return dynamic(importFunc, {
        loading: () => (
            <div 
                className= "w-full animate-pulse bg-white/5 rounded-xl flex items-center justify-center" 
                style={{ height: loadingHeight }}
            >
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
        ),
ssr
    });
}

// Pre-configured lazy components
// Note: We use the path we know exists from the context
export const LazyShaderGradientBackground = lazyLoad(() => import('@/components/backgrounds/ShaderGradientBackground'), '100vh');