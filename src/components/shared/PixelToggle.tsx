'use client';

import { motion } from 'framer-motion';

interface PixelToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'retro-soul';
}

export default function PixelToggle({
    checked,
    onChange,
    label,
    disabled = false,
    size = 'md',
    variant = 'default'
}: PixelToggleProps) {
    // Dimensions based on size
    const dimensions = {
        sm: { width: 48, height: 24, handle: 20, border: 2, shadow: 2 },
        md: { width: 64, height: 32, handle: 28, border: 4, shadow: 4 },
        lg: { width: 80, height: 40, handle: 36, border: 4, shadow: 4 }
    };

    const dim = dimensions[size];
    const travelDistance = dim.width - (dim.border * 2) - dim.handle;

    // Colors based on variant
    const colors = variant === 'retro-soul' ? {
        on: 'bg-[#8bac0f]',
        off: 'bg-[#306230]',
        border: 'border-[#0f380f]',
        handle: 'bg-[#9bbc0f]',
        handleBorder: 'border-[#0f380f]',
        shadow: '#0f380f',
        text: 'text-[#0f380f]'
    } : {
        on: 'bg-[#4ade80]', // Green-400
        off: 'bg-[#e5e7eb]', // Gray-200
        border: 'border-[#2d2a2e]',
        handle: 'bg-white',
        handleBorder: 'border-[#2d2a2e]',
        shadow: '#2d2a2e',
        text: 'text-[#2d2a2e]'
    };

    return (
        <button
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`
                group flex items-center gap-3 font-vt323 select-none
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {/* Switch Container */}
            <div
                className={`
                    relative transition-all duration-100 ease-linear box-content
                    ${colors.border} ${checked ? colors.on : colors.off}
                `}
                style={{
                    width: dim.width,
                    height: dim.height,
                    borderWidth: dim.border,
                    boxShadow: disabled ? 'none' : `${dim.shadow}px ${dim.shadow}px 0px ${colors.shadow}`,
                    transform: !disabled ? 'var(--active-transform)' : 'none'
                }}
            >
                {/* Sliding Handle */}
                <motion.div
                    initial={false}
                    animate={{
                        x: checked ? travelDistance : 0
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                    }}
                    className={`
                        absolute top-0 left-0 box-border
                        ${colors.handle} ${colors.handleBorder}
                        flex items-center justify-center
                    `}
                    style={{
                        width: dim.handle,
                        height: dim.handle,
                        borderRightWidth: dim.border,
                        borderBottomWidth: dim.border
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
                </motion.div>
            </div>

            {label && (
                <span className={`
                    font-bold uppercase tracking-widest ${colors.text}
                    ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'}
                `}>
                    {label}
                </span>
            )}

            <style jsx>{`
                button:active div:first-child {
                    --active-transform: translate(${dim.shadow}px, ${dim.shadow}px);
                    box-shadow: none !important;
                }
            `}</style>
        </button>
    );
}