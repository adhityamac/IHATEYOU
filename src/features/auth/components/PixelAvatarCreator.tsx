'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, Check, RefreshCw } from 'lucide-react';

interface AvatarConfig {
    skinTone: string;
    eyes: number;
    mouth: number;
    accessory: number;
}

interface PixelAvatarCreatorProps {
    initialConfig?: AvatarConfig;
    onComplete: (config: AvatarConfig) => void;
}

const SKIN_TONES = [
    '#FFCBA4', // Pale
    '#F5C396', // Fair
    '#E0AC69', // Medium
    '#C68642', // Tan
    '#8D5524', // Dark
    '#523218', // Deep
    '#9bbc0f', // GameBoy Green (Retro)
    '#a78bfa', // Alien Purple
];

// Pixel Art Assets (32x32 Grid)
const EYES = [
    // 0: Normal
    <g key="e0"><rect x="10" y="13" width="2" height="2" fill="currentColor" /><rect x="20" y="13" width="2" height="2" fill="currentColor" /></g>,
    // 1: Wide
    <g key="e1"><rect x="9" y="12" width="4" height="4" fill="currentColor" /><rect x="19" y="12" width="4" height="4" fill="currentColor" /><rect x="10" y="13" width="2" height="2" fill="white" /><rect x="20" y="13" width="2" height="2" fill="white" /></g>,
    // 2: Sleepy
    <g key="e2"><rect x="10" y="14" width="2" height="1" fill="currentColor" /><rect x="20" y="14" width="2" height="1" fill="currentColor" /><rect x="9" y="12" width="4" height="1" fill="currentColor" opacity="0.5" /><rect x="19" y="12" width="4" height="1" fill="currentColor" opacity="0.5" /></g>,
    // 3: Happy
    <g key="e3"><path d="M9 13h1v-1h2v1h1 M19 13h1v-1h2v1h1" fill="currentColor" stroke="none" /></g>,
    // 4: Suspicious
    <g key="e4"><rect x="10" y="13" width="2" height="1" fill="currentColor" /><rect x="20" y="12" width="2" height="3" fill="currentColor" /></g>,
];

const MOUTHS = [
    // 0: Neutral
    <g key="m0"><rect x="13" y="22" width="6" height="2" fill="currentColor" /></g>,
    // 1: Smile
    <g key="m1"><rect x="12" y="21" width="1" height="1" fill="currentColor" /><rect x="13" y="22" width="6" height="1" fill="currentColor" /><rect x="19" y="21" width="1" height="1" fill="currentColor" /></g>,
    // 2: Frown
    <g key="m2"><rect x="12" y="23" width="1" height="1" fill="currentColor" /><rect x="13" y="22" width="6" height="1" fill="currentColor" /><rect x="19" y="23" width="1" height="1" fill="currentColor" /></g>,
    // 3: Open
    <g key="m3"><rect x="13" y="21" width="6" height="3" fill="currentColor" /></g>,
    // 4: Smirk
    <g key="m4"><rect x="13" y="22" width="4" height="1" fill="currentColor" /><rect x="17" y="21" width="2" height="1" fill="currentColor" /></g>,
];

const ACCESSORIES = [
    // 0: None
    null,
    // 1: Glasses
    <g key="a1"><rect x="8" y="12" width="6" height="4" fill="none" stroke="currentColor" strokeWidth="1" /><rect x="18" y="12" width="6" height="4" fill="none" stroke="currentColor" strokeWidth="1" /><rect x="14" y="13" width="4" height="1" fill="currentColor" /></g>,
    // 2: 3D Glasses
    <g key="a2"><rect x="8" y="12" width="6" height="4" fill="#ef4444" opacity="0.8" /><rect x="18" y="12" width="6" height="4" fill="#3b82f6" opacity="0.8" /><rect x="7" y="13" width="18" height="1" fill="currentColor" /></g>,
    // 3: Headband
    <g key="a3"><rect x="7" y="7" width="18" height="3" fill="#ef4444" /><rect x="24" y="6" width="2" height="4" fill="#ef4444" /><rect x="6" y="6" width="2" height="4" fill="#ef4444" /></g>,
    // 4: Blush
    <g key="a4"><rect x="7" y="17" width="3" height="1" fill="#f472b6" opacity="0.6" /><rect x="22" y="17" width="3" height="1" fill="#f472b6" opacity="0.6" /></g>,
];

export default function PixelAvatarCreator({ initialConfig, onComplete }: PixelAvatarCreatorProps) {
    const [config, setConfig] = useState<AvatarConfig>(initialConfig || {
        skinTone: SKIN_TONES[2],
        eyes: 0,
        mouth: 0,
        accessory: 0
    });

    const handleRandomize = () => {
        setConfig({
            skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
            eyes: Math.floor(Math.random() * EYES.length),
            mouth: Math.floor(Math.random() * MOUTHS.length),
            accessory: Math.floor(Math.random() * ACCESSORIES.length),
        });
    };

    const cycleOption = (key: keyof AvatarConfig, direction: 1 | -1) => {
        setConfig(prev => {
            let max = 0;
            if (key === 'eyes') max = EYES.length;
            if (key === 'mouth') max = MOUTHS.length;
            if (key === 'accessory') max = ACCESSORIES.length;
            if (key === 'skinTone') return prev; // Handled separately

            let next = (prev[key] as number) + direction;
            if (next < 0) next = max - 1;
            if (next >= max) next = 0;

            return { ...prev, [key]: next };
        });
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#0f380f] border-4 border-[#8bac0f] p-6 font-vt323 shadow-[8px_8px_0px_#306230]">
            <div className="text-center mb-6">
                <h2 className="text-[#9bbc0f] text-2xl uppercase tracking-widest mb-1">Identity Matrix</h2>
                <div className="h-1 w-full bg-[#306230]" />
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48 bg-[#9bbc0f] border-4 border-[#306230] shadow-[4px_4px_0px_#0f380f]">
                    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                        {/* Base Head */}
                        <rect x="8" y="6" width="16" height="20" fill={config.skinTone} />
                        <rect x="6" y="8" width="2" height="16" fill={config.skinTone} />
                        <rect x="24" y="8" width="2" height="16" fill={config.skinTone} />

                        {/* Hair/Top Outline (Simple) */}
                        <path d="M8 6h16v2h-16z M6 8h2v2h-2z M24 8h2v2h-2z" fill="#0f380f" opacity="0.2" />

                        {/* Features */}
                        <g color="#0f380f">
                            {EYES[config.eyes]}
                            {MOUTHS[config.mouth]}
                            {ACCESSORIES[config.accessory]}
                        </g>
                    </svg>

                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,56,15,0.1)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none" />
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 mb-8">
                {/* Skin Tone */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#8bac0f] text-sm uppercase tracking-wider">Skin Tone</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#306230] scrollbar-track-transparent">
                        {SKIN_TONES.map(tone => (
                            <button
                                key={tone}
                                onClick={() => setConfig(prev => ({ ...prev, skinTone: tone }))}
                                className={`w-8 h-8 shrink-0 border-2 transition-transform ${config.skinTone === tone ? 'border-[#9bbc0f] scale-110' : 'border-[#306230] hover:scale-105'}`}
                                style={{ backgroundColor: tone }}
                            />
                        ))}
                    </div>
                </div>

                {/* Eyes Control */}
                <ControlRow
                    label="Eyes"
                    value={config.eyes + 1}
                    max={EYES.length}
                    onPrev={() => cycleOption('eyes', -1)}
                    onNext={() => cycleOption('eyes', 1)}
                />

                {/* Mouth Control */}
                <ControlRow
                    label="Mouth"
                    value={config.mouth + 1}
                    max={MOUTHS.length}
                    onPrev={() => cycleOption('mouth', -1)}
                    onNext={() => cycleOption('mouth', 1)}
                />

                {/* Accessory Control */}
                <ControlRow
                    label="Accessory"
                    value={config.accessory + 1}
                    max={ACCESSORIES.length}
                    onPrev={() => cycleOption('accessory', -1)}
                    onNext={() => cycleOption('accessory', 1)}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={handleRandomize}
                    className="flex-1 py-3 border-2 border-[#306230] bg-[#0f380f] text-[#8bac0f] hover:bg-[#306230] hover:text-[#9bbc0f] transition-colors flex items-center justify-center gap-2 group"
                >
                    <Shuffle size={18} className="group-hover:rotate-180 transition-transform" />
                    <span className="uppercase tracking-wider">Random</span>
                </button>

                <button
                    onClick={() => onComplete(config)}
                    className="flex-[2] py-3 bg-[#8bac0f] text-[#0f380f] border-2 border-[#8bac0f] hover:bg-[#9bbc0f] hover:border-[#9bbc0f] transition-colors flex items-center justify-center gap-2 font-bold shadow-[4px_4px_0px_#306230] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <Check size={20} strokeWidth={3} />
                    <span className="uppercase tracking-widest text-lg">Confirm Identity</span>
                </button>
            </div>
        </div>
    );
}

function ControlRow({ label, value, max, onPrev, onNext }: {
    label: string,
    value: number,
    max: number,
    onPrev: () => void,
    onNext: () => void
}) {
    return (
        <div className="flex items-center justify-between bg-[#306230] p-2 border border-[#0f380f]">
            <span className="text-[#9bbc0f] uppercase tracking-wider w-24">{label}</span>

            <div className="flex items-center gap-4">
                <button
                    onClick={onPrev}
                    className="p-1 text-[#8bac0f] hover:text-[#9bbc0f] hover:bg-[#0f380f] transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                <span className="text-[#9bbc0f] font-mono w-12 text-center">
                    {value}/{max}
                </span>

                <button
                    onClick={onNext}
                    className="p-1 text-[#8bac0f] hover:text-[#9bbc0f] hover:bg-[#0f380f] transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
