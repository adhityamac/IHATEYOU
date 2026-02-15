import React from 'react';
import { cn } from '@/lib/utils';
import LiquidImage from './LiquidImage';

interface PhotogradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    showLiquid?: boolean;
    intensity?: number;
}

export function PhotogradientBackground({
    className,
    children,
    showLiquid = true,
    intensity = 1
}: PhotogradientBackgroundProps) {
    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-[#050505]", className)}>
            {/* Photogradient Mesh Background */}
            {/* Photogradient Mesh Background - BOOSTED INTENSITY */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]">
                {/* 1. Primary Violet Glow (Top Left) */}
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/40 blur-[130px] animate-pulse mix-blend-screen" />

                {/* 2. Cyan Highlight (Top Right) */}
                <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/30 blur-[120px] mix-blend-screen" />

                {/* 3. Deep Fuchsia (Bottom Left) */}
                <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[60%] rounded-full bg-fuchsia-600/30 blur-[140px] animate-pulse" style={{ animationDelay: '4s' }} />

                {/* 4. Electric Blue (Bottom Right) */}
                <div className="absolute bottom-[-20%] right-[-5%] w-[60%] h-[60%] rounded-full bg-blue-600/40 blur-[130px] mix-blend-screen" />

                {/* 5. Center Light Spot (Aurora Core) - New! */}
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse mix-blend-overlay" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Liquid Background Layer (Subtle) */}
            {showLiquid && (
                <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
                    <LiquidImage strength={0.02 * intensity} speed={0.15 * intensity} />
                </div>
            )}

            {/* Content Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
