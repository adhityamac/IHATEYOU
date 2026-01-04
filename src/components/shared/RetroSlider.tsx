'use client';

import { useRef, useEffect, useState } from 'react';

interface RetroSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'retro-soul';
}

export default function RetroSlider({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    disabled = false,
    size = 'md',
    variant = 'default'
}: RetroSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Dimensions based on size
    const dimensions = {
        sm: { height: 24, thumb: 16, border: 2, shadow: 2 },
        md: { height: 32, thumb: 24, border: 4, shadow: 4 },
        lg: { height: 40, thumb: 32, border: 4, shadow: 4 }
    };

    const dim = dimensions[size];

    // Colors based on variant
    const colors = variant === 'retro-soul' ? {
        track: 'bg-[#306230]',
        fill: 'bg-[#8bac0f]',
        border: 'border-[#0f380f]',
        thumb: 'bg-[#9bbc0f]',
        thumbBorder: 'border-[#0f380f]',
        shadow: '#0f380f',
        text: 'text-[#0f380f]'
    } : {
        track: 'bg-[#e5e7eb]', // Gray-200
        fill: 'bg-[#4ade80]', // Green-400
        border: 'border-[#2d2a2e]',
        thumb: 'bg-white',
        thumbBorder: 'border-[#2d2a2e]',
        shadow: '#2d2a2e',
        text: 'text-[#2d2a2e]'
    };

    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    const handleInteraction = (clientX: number) => {
        if (disabled || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const width = rect.width;

        let newValue = (x / width) * (max - min) + min;

        // Apply step
        if (step > 0) {
            newValue = Math.round(newValue / step) * step;
        }

        // Clamp
        newValue = Math.min(max, Math.max(min, newValue));

        if (newValue !== value) {
            onChange(newValue);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleInteraction(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleInteraction(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            handleInteraction(clientX);
        };

        const handleUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, min, max, step, disabled]);

    return (
        <div className={`flex flex-col gap-2 font-vt323 select-none ${disabled ? 'opacity-50' : ''}`}>
            {label && (
                <div className="flex justify-between items-end">
                    <span className={`font-bold uppercase tracking-widest ${colors.text} ${size === 'sm' ? 'text-sm' : 'text-lg'}`}>
                        {label}
                    </span>
                    <span className={`font-mono text-xs opacity-60 ${colors.text}`}>
                        {value}
                    </span>
                </div>
            )}

            <div
                ref={containerRef}
                className={`
                    relative cursor-pointer touch-none overflow-hidden
                    ${colors.border} ${colors.track}
                `}
                style={{
                    height: dim.height,
                    borderWidth: dim.border,
                    boxShadow: disabled ? 'none' : `${dim.shadow}px ${dim.shadow}px 0px ${colors.shadow}`,
                    transform: isDragging && !disabled ? `translate(${dim.shadow / 2}px, ${dim.shadow / 2}px)` : 'none',
                    transition: 'transform 0.1s'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Fill Bar */}
                <div
                    className={`absolute top-0 left-0 h-full ${colors.fill}`}
                    style={{ width: `${percentage}%` }}
                />

                {/* Thumb (Visual only, interaction is on container) */}
                <div
                    className={`
                        absolute top-0 bottom-0
                        ${colors.thumb} ${colors.thumbBorder}
                        flex items-center justify-center
                    `}
                    style={{
                        left: `${percentage}%`,
                        width: dim.thumb,
                        marginLeft: `-${dim.thumb / 2}px`, // Center thumb on value
                        borderLeftWidth: dim.border,
                        borderRightWidth: dim.border,
                    }}
                >
                    {/* Grip Texture */}
                    <div className="flex gap-[2px] opacity-20">
                        {[1, 2].map(i => (
                            <div
                                key={i}
                                className="bg-black"
                                style={{
                                    width: size === 'sm' ? 1 : 2,
                                    height: size === 'sm' ? 8 : 12
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}