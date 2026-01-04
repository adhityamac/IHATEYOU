'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface BodyScanProps {
    onComplete: (areas: string[]) => void;
    onSkip: () => void;
}

export default function BodyScan({ onComplete, onSkip }: BodyScanProps) {
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const toggleArea = (area: string) => {
        setSelectedAreas(prev =>
            prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
        );
    };

    const areas = [
        { id: 'head', label: 'Head', d: 'M10 2h4v4h-4z', x: 10, y: 2 },
        { id: 'shoulders', label: 'Shoulders', d: 'M6 6h12v2h-12z', x: 6, y: 6 },
        { id: 'chest', label: 'Chest', d: 'M8 8h8v5h-8z', x: 8, y: 8 },
        { id: 'stomach', label: 'Stomach', d: 'M8 13h8v4h-8z', x: 8, y: 13 },
        { id: 'arms', label: 'Arms', d: 'M4 6h2v10h-2z M18 6h2v10h-2z', x: 4, y: 6 },
        { id: 'legs', label: 'Legs', d: 'M8 17h3v7h-3z M13 17h3v7h-3z', x: 8, y: 17 },
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-black uppercase tracking-widest font-vt323 text-stone-800">Body Scan</h3>
                <p className="text-xs font-mono text-stone-500 mt-1">Where are you holding tension?</p>
            </div>

            <div className="relative w-64 h-64 mb-8">
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl">
                    {areas.map((area) => (
                        <motion.path
                            key={area.id}
                            d={area.d}
                            onClick={() => toggleArea(area.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`cursor-pointer transition-colors duration-200 ${selectedAreas.includes(area.id)
                                    ? 'fill-rose-500 stroke-rose-700'
                                    : 'fill-stone-200 stroke-stone-300 hover:fill-stone-300'
                                }`}
                            strokeWidth="0.5"
                        />
                    ))}
                </svg>

                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none" />
            </div>

            <div className="flex gap-2 mb-6 flex-wrap justify-center">
                {selectedAreas.length > 0 ? (
                    selectedAreas.map(area => (
                        <span key={area} className="px-2 py-1 bg-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-200">
                            {area}
                        </span>
                    ))
                ) : (
                    <span className="text-[10px] text-stone-400 font-mono">No areas selected</span>
                )}
            </div>

            <div className="flex w-full gap-4">
                <button
                    onClick={onSkip}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
                >
                    Skip
                </button>
                <button
                    onClick={() => onComplete(selectedAreas)}
                    className="flex-[2] py-3 bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    Next Step <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}