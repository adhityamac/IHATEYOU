'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import BodyScan from './BodyScan';

// Mood definitions matching the specific reference image
const MOODS = [
    { id: 'amazing', label: 'AMAZING, FANTASTIC DAY', color: '#f472b6', icon: '😄' },   // Pink
    { id: 'happy', label: 'REALLY GOOD, HAPPY DAY', color: '#4ade80', icon: '🙂' },      // Green
    { id: 'normal', label: 'NORMAL, AVERAGE DAY', color: '#a78bfa', icon: '😐' },       // Purple
    { id: 'exhausted', label: 'EXHAUSTED, TIRED DAY', color: '#fb7185', icon: '😴' },   // Salmon
    { id: 'depressed', label: 'DEPRESSED, SAD DAY', color: '#1e3a8a', icon: '😢' },     // Dark Blue
    { id: 'frustrated', label: 'FRUSTRATED, ANGRY DAY', color: '#facc15', icon: '😡' }, // Yellow
    { id: 'stressed', label: 'STRESSED-OUT, FRANTIC DAY', color: '#fb923c', icon: '😫' },// Orange
];

interface DayData {
    date: string;
    moodId: string;
    note?: string;
    tensionAreas?: string[];
}

export default function YearInPixels() {
    const { mode } = useThemeMode();
    const isRetro = mode === 'retro' || mode === 'retro-soul';

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [pixels, setPixels] = useState<Record<string, DayData>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState<'bodyscan' | 'mood'>('bodyscan');
    const [currentNote, setCurrentNote] = useState(''); // New state for temporary note
    const [currentTension, setCurrentTension] = useState<string[]>([]);

    // Load data from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('yearInPixels');
            if (saved) {
                setPixels(JSON.parse(saved));
            }
        }
    }, []);

    // Save data to localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined' && Object.keys(pixels).length > 0) {
            localStorage.setItem('yearInPixels', JSON.stringify(pixels));
        }
    }, [pixels]);

    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const handlePixelClick = (monthIndex: number, day: number) => {
        const dateStr = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        // Load existing note if exists
        setCurrentNote(pixels[dateStr]?.note || '');
        setCurrentTension(pixels[dateStr]?.tensionAreas || []);
        // Reset to body scan if no data exists, else go straight to mood
        setStep(pixels[dateStr] ? 'mood' : 'bodyscan');
        setShowModal(true);
    };

    const handleMoodSelect = (moodId: string) => {
        if (selectedDate) {
            setPixels(prev => ({
                ...prev,
                [selectedDate]: {
                    date: selectedDate,
                    moodId,
                    note: currentNote, // Save the note
                    tensionAreas: currentTension
                }
            }));
            setShowModal(false);
        }
    };

    return (
        <div className={`
            w-full max-w-6xl mx-auto p-4 md:p-8 transition-all duration-300
            ${isRetro
                ? 'bg-[#fff5f5] border-4 border-[#2c1810] shadow-[8px_8px_0px_#2c1810]'
                : 'bg-white/90 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl'
            }
        `}>
            {/* Header Title Area */}
            <div className="text-center mb-12">
                <h3 className={`text-xl md:text-3xl font-handwriting mb-2 ${isRetro ? 'font-vt323 uppercase text-[#2c1810]' : 'font-caveat text-stone-500'}`}>My Year in</h3>
                <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter ${isRetro ? 'font-press-start text-[#8b5cf6] drop-shadow-[4px_4px_0px_#2c1810]' : 'font-rubik-vinyl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                    PIXELS
                </h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-12 items-start justify-center">
                {/* Main Grid Section */}
                <div className="flex-1 w-full overflow-x-auto pb-8 custom-scrollbar">
                    <div className="min-w-[500px] bg-white border-2 border-stone-800 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] p-1">
                        {/* Month Headers */}
                        <div className="flex border-b-2 border-stone-800 bg-[#e9d5ff]">
                            <div className="w-8 shrink-0 border-r-2 border-stone-800 bg-white"></div> {/* Corner spacer */}
                            {months.map((m, i) => (
                                <div key={i} className="flex-1 text-center font-bold text-stone-800 py-2 border-r border-stone-800 last:border-r-0 font-vt323 text-xl">
                                    {m}
                                </div>
                            ))}
                        </div>

                        {/* Grid Rows (Days) */}
                        <div className="flex flex-col">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <div key={day} className="flex h-8 border-b border-stone-200 last:border-b-0">
                                    {/* Day Number */}
                                    <div className="w-8 shrink-0 flex items-center justify-center font-bold text-stone-500 bg-[#fff5f5] border-r-2 border-stone-800 font-mono text-xs">
                                        {day}
                                    </div>

                                    {months.map((_, monthIndex) => {
                                        const daysInMonth = getDaysInMonth(monthIndex, selectedYear);
                                        const isValidDay = day <= daysInMonth;
                                        const dateStr = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const pixelData = pixels[dateStr];
                                        const mood = pixelData ? MOODS.find(m => m.id === pixelData.moodId) : null;

                                        if (!isValidDay) {
                                            return <div key={`${monthIndex}-${day}`} className="flex-1 bg-stone-100 border-r border-stone-200 last:border-r-0 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-stone-300/20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                                            </div>;
                                        }

                                        return (
                                            <button
                                                key={`${monthIndex}-${day}`}
                                                onClick={() => handlePixelClick(monthIndex, day)}
                                                className="flex-1 border-r border-stone-200 last:border-r-0 hover:bg-stone-50 transition-all relative group"
                                                style={{
                                                    backgroundColor: mood ? mood.color : 'transparent',
                                                }}
                                            >
                                                {!mood && <div className="hidden group-hover:block absolute inset-0 bg-black/5" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Year Control below grid */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button onClick={() => setSelectedYear(y => y - 1)} className="p-2 bg-white border-2 border-stone-800 shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-2xl font-black font-vt323">{selectedYear}</span>
                        <button onClick={() => setSelectedYear(y => y + 1)} className="p-2 bg-white border-2 border-stone-800 shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Legend Section (Desktop: Right, Mobile: Bottom) */}
                <div className="w-full xl:w-80 shrink-0">
                    <div className={`p-8 border-2 border-stone-800 shadow-[8px_8px_0px_#2d2a2e] ${isRetro ? 'bg-[#fff5f5]' : 'bg-white'}`}>
                        <h4 className="text-xl font-black uppercase tracking-widest mb-6 border-b-4 border-stone-800 pb-2 font-vt323">Mood Key</h4>
                        <div className="space-y-5">
                            {MOODS.map(mood => (
                                <div key={mood.id} className="flex items-center gap-4 group cursor-help">
                                    <div
                                        className="w-8 h-8 shrink-0 border-2 border-stone-800 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: mood.color }}
                                    />
                                    <span className="text-xs font-bold uppercase tracking-wide text-stone-600 font-mono">{mood.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t-2 border-stone-200">
                            <div className="text-center px-4 py-3 bg-stone-100 border-2 border-dashed border-stone-300 rounded font-mono text-[10px] text-stone-400">
                                TAP A CELL TO LOG YOUR DAY
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection Modal */}
            <AnimatePresence>
                {showModal && selectedDate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotate: 5 }}
                            className={`bg-white p-6 max-w-sm w-full shadow-[20px_20px_0px_rgba(0,0,0,0.5)] border-4 border-stone-900 overflow-hidden relative`}
                        >
                            {/* Decorative tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#fbbf24] rotate-2 opacity-90 shadow-sm" />

                            <div className="flex justify-between items-end mb-6 mt-2">
                                <div>
                                    <div className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-1">Entry for</div>
                                    <h3 className="font-black text-3xl font-vt323 text-stone-800">{selectedDate}</h3>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {step === 'bodyscan' ? (
                                <BodyScan
                                    onComplete={(areas) => {
                                        setCurrentTension(areas);
                                        setStep('mood');
                                    }}
                                    onSkip={() => setStep('mood')}
                                />
                            ) : (
                                <>
                                    {/* Journal Entry Input */}
                                    <div className="mb-6">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-mono">Journal Entry (Optional)</label>
                                        <textarea
                                            value={currentNote}
                                            onChange={(e) => setCurrentNote(e.target.value)}
                                            placeholder="How was your day?"
                                            className="w-full p-3 bg-stone-50 border-2 border-stone-200 rounded text-sm font-mono focus:outline-none focus:border-stone-800 focus:bg-white transition-colors custom-scrollbar resize-none h-24 text-stone-700"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {MOODS.map(mood => (
                                            <button
                                                key={mood.id}
                                                onClick={() => handleMoodSelect(mood.id)}
                                                className="flex items-center gap-4 p-3 border-2 border-stone-100 hover:border-stone-800 hover:bg-stone-50 transition-all group relative overflow-hidden"
                                            >
                                                <div
                                                    className="w-10 h-10 flex items-center justify-center text-xl border-2 border-stone-800 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all shrink-0 bg-white"
                                                    style={{ backgroundColor: mood.color }}
                                                >
                                                    {mood.icon}
                                                </div>
                                                <span className="font-bold text-stone-700 text-xs uppercase tracking-wider text-left font-mono">{mood.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            const newPixels = { ...pixels };
                                            delete newPixels[selectedDate];
                                            setPixels(newPixels);
                                            setShowModal(false);
                                        }}
                                        className="w-full mt-6 py-3 font-bold text-red-500 border-2 border-dashed border-red-200 hover:bg-red-50 hover:border-red-500 transition-all text-xs uppercase tracking-widest"
                                    >
                                        Clear Entry
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}