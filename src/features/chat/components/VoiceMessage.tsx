'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Trash2, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface VoiceMessageProps {
    duration?: number;
    isRecording?: boolean;
    onPlay?: () => void;
    onDelete?: () => void;
    timestamp?: string;
}

export default function VoiceMessage({
    duration = 0,
    isRecording = false,
    onPlay,
    onDelete,
    timestamp = 'just now'
}: VoiceMessageProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    // Generate stable random heights for waveform bars
    // Generate stable random heights for waveform bars (SSR-safe)
    const baseHeightsRef = useRef<number[]>([]);

    // Initialize on first render
    if (baseHeightsRef.current.length === 0) {
        // Use a seeded pseudo-random generator for SSR safety if needed
        const arr = [];
        let seed = 20251223; // Use a fixed seed for SSR consistency
        function seededRandom() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }
        for (let i = 0; i < 20; i++) {
            arr.push(seededRandom() * 100);
        }
        baseHeightsRef.current = arr;
    }
    // For animated heights during recording
    const [animatedHeights, setAnimatedHeights] = useState<number[]>([]);
    useEffect(() => {
        setAnimatedHeights(baseHeightsRef.current);
    }, []);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 1) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 0.01; // Approx 100 steps
                });
            }, duration * 10); // duration * 1000 / 100
            return () => clearInterval(interval);
        }
    }, [isPlaying, duration]);

    useEffect(() => {
        if (isRecording) {
            const interval = setInterval(() => {
                // Use seeded random for animation, but it's fine to use Math.random here since it's not in render
                setAnimatedHeights(Array.from({ length: 20 }, () => Math.random() * 100));
            }, 300);
            return () => clearInterval(interval);
        } else {
            setAnimatedHeights(baseHeightsRef.current);
        }
    }, [isRecording, baseHeightsRef]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        onPlay?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 p-4 rounded-[24px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-md max-w-md"
        >
            {/* Play/Pause Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
            >
                {isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                ) : (
                    <Play size={20} fill="currentColor" className="ml-1" />
                )}
            </motion.button>

            {/* Waveform & Info */}
            <div className="flex-1">
                {/* Waveform */}
                <div className="flex items-center gap-1 mb-2 h-8">
                    {animatedHeights.map((base, i) => {
                        const height = isRecording
                            ? base
                            : 30 + Math.sin(i * 0.5) * 30;
                        return (
                            <motion.div
                                key={i}
                                className={`w-1 rounded-full ${i < (progress * 20)
                                    ? 'bg-white'
                                    : 'bg-white/30'
                                    }`}
                                style={{ height: `${height}%` }}
                                animate={isPlaying ? {
                                    backgroundColor: i < (progress * 20) ? '#ffffff' : 'rgba(255,255,255,0.3)'
                                } : {}}
                                transition={{
                                    duration: 0.3,
                                    repeat: 0,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Duration & Timestamp */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                        {formatDuration(duration)}
                    </span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {timestamp}
                    </span>
                </div>
            </div>

            {/* Recording Indicator or Delete Button */}
            {isRecording ? (
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                    className="flex items-center gap-2"
                >
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">REC</span>
                </motion.div>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onDelete}
                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-red-400 transition-all"
                >
                    <Trash2 size={18} />
                </motion.button>
            )}
        </motion.div>
    );
}

// Voice Recorder Component
export function VoiceRecorder({ onSend }: { onSend: (duration: number) => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);

    const startRecording = () => {
        setIsRecording(true);
        setDuration(0);
        // Start recording logic here
    };

    const stopRecording = () => {
        setIsRecording(false);
        onSend(duration);
    };

    return (
        <div className="flex items-center gap-4">
            {isRecording && (
                <VoiceMessage
                    duration={duration}
                    isRecording={true}
                />
            )}

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full flex items-center justify-center transition-all ${isRecording
                    ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                    : 'bg-white/10 border border-white/20 text-white/60 hover:bg-white/20'
                    }`}
            >
                <Mic size={24} />
            </motion.button>
        </div>
    );
}
