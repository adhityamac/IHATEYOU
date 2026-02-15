'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Radio, Coffee, Volume2, VolumeX, ChevronUp } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

export default function AmbienceSelector() {
    const { currentAmbience, setAmbience, volume, setVolume, isPlaying, togglePlay } = useAudio();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 left-4 z-[9000] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl w-64"
                    >
                        <h3 className="text-xs font-bold text-white/40 uppercase mb-3 tracking-widest">Aural Atmosphere</h3>

                        {/* Tracks */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setAmbience(currentAmbience === 'rain' ? null : 'rain')}
                                className={`flex-1 aspect-square rounded-xl flex items-center justify-center transition-all ${currentAmbience === 'rain' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <CloudRain size={20} />
                            </button>
                            <button
                                onClick={() => setAmbience(currentAmbience === 'static' ? null : 'static')}
                                className={`flex-1 aspect-square rounded-xl flex items-center justify-center transition-all ${currentAmbience === 'static' ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <Radio size={20} />
                            </button>
                            <button
                                onClick={() => setAmbience(currentAmbience === 'cafe' ? null : 'cafe')}
                                className={`flex-1 aspect-square rounded-xl flex items-center justify-center transition-all ${currentAmbience === 'cafe' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <Coffee size={20} />
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-3">
                            <button onClick={togglePlay} disabled={!currentAmbience} className="text-slate-400 hover:text-white transition-colors">
                                {volume === 0 || !isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    h-12 w-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-xl
                    ${currentAmbience ? 'bg-white/10 border-white/20 text-white animate-pulse-slow' : 'bg-black/50 border-white/5 text-white/40 hover:text-white hover:bg-black/70'}
                `}
            >
                {currentAmbience === 'rain' && <CloudRain size={20} />}
                {currentAmbience === 'static' && <Radio size={20} />}
                {currentAmbience === 'cafe' && <Coffee size={20} />}
                {!currentAmbience && <Volume2 size={20} />}
            </button>
        </div>
    );
}
