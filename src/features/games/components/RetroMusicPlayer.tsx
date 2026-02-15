'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Mock Tracks with Pixel Art Covers
const TRACKS = [
    {
        id: 1,
        title: "Stardust Memories",
        artist: "8-Bit Dreams",
        duration: "3:45",
        cover: "https://i.pinimg.com/736x/2a/36/41/2a3641d4b684824dc1d23467c64c7e62.jpg",
        color: "bg-[#2d2a4a]"
    },
    {
        id: 2,
        title: "Neon Horizon",
        artist: "Cyber Soul",
        duration: "2:30",
        cover: "https://i.pinimg.com/originals/8a/8d/3f/8a8d3f62663f719adc1b43956fc270eb.gif",
        color: "bg-[#4a2a3e]"
    },
    {
        id: 3,
        title: "Coffee Shop Glitch",
        artist: "Pixel Brewers",
        duration: "4:05",
        cover: "https://i.pinimg.com/originals/2b/32/11/2b3211157e3df318ee436e2f18374828.gif",
        color: "bg-[#3e2a4a]"
    }
];

// Helper for Pixel Art Icons (Simulated with SVGs)
const PixelIcon = ({ path, size = 24, filled = false }: { path: string, size?: number, filled?: boolean }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        shapeRendering="geometricPrecision" // Crisp edges
        className="text-[#1a1a1c] hover:text-[#555] transition-colors"
    >
        <path d={path} />
    </svg>
);

export default function RetroMusicPlayer({ onClose }: { onClose: () => void }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const currentTrack = TRACKS[currentTrackIndex];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setProgress(0);
        setIsPlaying(true);
    };
    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setProgress(0);
        setIsPlaying(true);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl font-mono">
            {/* Back Button */}
            <button
                onClick={onClose}
                className="absolute top-8 left-8 p-3 bg-white text-black hover:bg-gray-200 transition-all z-50 font-bold flex items-center gap-2 uppercase tracking-widest text-sm rounded-none border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-1 active:shadow-none"
            >
                <ArrowLeft size={16} /> Close Deck
            </button>

            {/* The Main Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-[400px] bg-[#fff0d5] px-6 py-8 rounded-[4px] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] border-4 border-[#1a1a1c] relative"
            >
                {/* Header Text */}
                <div className="absolute top-4 left-0 right-0 text-center">
                    <span className="text-[10px] font-bold text-[#1a1a1c]/40 tracking-[0.3em] uppercase">Pixel::Audio</span>
                </div>

                {/* Album Art Frame */}
                <div className="aspect-square w-full bg-[#2a2a2c] border-4 border-[#1a1a1c] mb-6 mt-4 relative group overflow-hidden">
                    <img
                        src={currentTrack.cover}
                        alt="Album Art"
                        className="w-full h-full object-cover rendering-pixelated"
                        style={{ imageRendering: 'pixelated' }}
                    />
                    {/* Inner Shadow / Glare */}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>

                {/* Title & Heart Row */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-1">
                        {/* Title Replacement Block (like in mockup) - Using skeletal loading look or actual text */}
                        <h2 className="text-xl font-bold text-[#1a1a1c] leading-none tracking-tight">{currentTrack.title}</h2>
                        <div className="h-2 w-24 bg-[#1a1a1c]/10 rounded-none mt-1" /> {/* Decorative skeleton line */}
                    </div>
                    <button onClick={() => setIsLiked(!isLiked)} className="hover:scale-110 active:scale-95 transition-transform">
                        {/* Pixel Heart Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? "#1a1a1c" : "none"} stroke="#1a1a1c" strokeWidth="2.5" className="pixelated-svg">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 relative">
                    <div className="h-[3px] bg-[#1a1a1c] w-full relative flex items-center">
                        {/* Progress Dot */}
                        <motion.div
                            className="absolute h-4 w-4 bg-[#1a1a1c] -translate-x-1/2 rotate-45 border-2 border-[#fff0d5]"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                    {/* Time (Hidden in mockup but useful) -- Keeping it minimal */}
                </div>

                {/* Main Controls Row */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {/* Shuffle Icon */}
                    <button className="opacity-60 hover:opacity-100"><PixelIcon path="M21 16v5h-5 M2 21h5l9-9h5 M16 3h5v5 M2 3h5l9 9h5" size={20} /></button>

                    {/* Prev Icon */}
                    <button onClick={handlePrev} className="hover:scale-105 active:scale-95 transition-transform">
                        <PixelIcon path="M19 20L9 12l10-8v16z M5 19V5h2v14H5z" size={28} filled={true} />
                    </button>

                    {/* Play/Pause Button (Large Circle) */}
                    <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 bg-[#1a1a1c] rounded-full flex items-center justify-center text-[#fff0d5] hover:scale-105 active:scale-95 transition-transform shadow-xl"
                    >
                        {isPlaying ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                        )}
                    </button>

                    {/* Next Icon */}
                    <button onClick={handleNext} className="hover:scale-105 active:scale-95 transition-transform">
                        <PixelIcon path="M5 4l10 8-10 8V4z M19 5v14h-2V5h2z" size={28} filled={true} />
                    </button>

                    {/* Repeat/List Icon */}
                    <button className="opacity-60 hover:opacity-100"><PixelIcon path="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16 M3 21v-5h5" size={20} /></button>
                </div>

                {/* Bottom Bar: Spotify + Waveform */}
                <div className="flex items-center gap-4 pt-2">
                    {/* Spotify-ish Icon */}
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1c] flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff0d5" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z M8 14.5c2.5-1 6.5-1 9 0 M7 11.5c3-1.5 8-1.5 11 0 M6 8.5c4-2 10-2 14 0" />
                        </svg>
                    </div>

                    {/* Waveform Barcode */}
                    <div className="flex-1 flex items-center justify-between h-8 opacity-80">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: isPlaying ? [10, 24, 8, 16] : 6 }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.05,
                                    repeatType: "mirror"
                                }}
                                className="w-[3px] bg-[#1a1a1c] rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
