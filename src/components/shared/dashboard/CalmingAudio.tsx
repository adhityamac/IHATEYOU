'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { Interactive } from '@/components/ui/Interactive';

interface AudioTrack {
    id: string;
    title: string;
    duration: number; // in seconds
    src?: string; // Placeholder for real audio
}

const TRACKS: AudioTrack[] = [
    { id: '1', title: 'Breathe with me', duration: 180 },
    { id: '2', title: 'You are enough', duration: 105 },
    { id: '3', title: 'Let go of today', duration: 260 },
];

interface CalmingAudioProps {
    onClose: () => void;
}

export default function CalmingAudio({ onClose }: CalmingAudioProps) {
    const [currentTrack, setCurrentTrack] = useState<AudioTrack>(TRACKS[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Mock Playback
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= currentTrack.duration) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return p + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTrack]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full max-w-sm bg-[#1a1a1c] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Player Interface */}
                <div className="relative z-10 flex flex-col items-center text-center mt-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-rose-500/20 flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 group">
                        {isPlaying ? (
                            <div className="flex gap-1 h-8 items-center">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 30, 10] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-white/60 rounded-full"
                                    />
                                ))}
                            </div>
                        ) : (
                            <Play size={32} className="ml-1 text-white/60" />
                        )}
                    </div>

                    <h2 className="text-xl font-serif text-white mb-1">{currentTrack.title}</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-8">
                        Voice Note • {formatTime(currentTrack.duration)}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full mb-8 relative overflow-hidden cursor-pointer">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
                            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
                            layoutId="progress"
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-8 mb-8">
                        <button className="text-white/40 hover:text-white transition-colors">
                            <SkipBack size={24} />
                        </button>

                        <Interactive className="scale-110">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                        </Interactive>

                        <button className="text-white/40 hover:text-white transition-colors">
                            <SkipForward size={24} />
                        </button>
                    </div>

                    {/* Playlist (Mini) */}
                    <div className="w-full space-y-2">
                        {TRACKS.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => {
                                    setCurrentTrack(track);
                                    setIsPlaying(true);
                                    setProgress(0);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${currentTrack.id === track.id ? 'bg-white/10' : 'hover:bg-white/5'
                                    }`}
                            >
                                <span className={`text-sm font-medium ${currentTrack.id === track.id ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
                                    {track.title}
                                </span>
                                {currentTrack.id === track.id && (
                                    <Volume2 size={14} className="text-white/60" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
