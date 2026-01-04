'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music, List } from 'lucide-react';

const OLD_SONGS = [
    { id: 1, title: "Dream A Little Dream", artist: "Ella Fitzgerald", duration: "3:05", color: "from-rose-400 to-orange-300", audioUrl: null },
    { id: 2, title: "Fly Me To The Moon", artist: "Frank Sinatra", duration: "2:27", color: "from-blue-400 to-indigo-400", audioUrl: null },
    { id: 3, title: "Can't Help Falling in Love", artist: "Elvis Presley", duration: "3:00", color: "from-amber-200 to-yellow-400", audioUrl: null },
    { id: 4, title: "La Vie En Rose", artist: "Édith Piaf", duration: "3:06", color: "from-pink-400 to-rose-400", audioUrl: null },
    { id: 5, title: "Moon River", artist: "Audrey Hepburn", duration: "3:41", color: "from-cyan-200 to-blue-300", audioUrl: null },
    { id: 6, title: "Unchained Melody", artist: "The Righteous Brothers", duration: "3:37", color: "from-purple-300 to-indigo-400", audioUrl: null },
    { id: 7, title: "My Way", artist: "Frank Sinatra", duration: "4:35", color: "from-emerald-300 to-teal-400", audioUrl: null },
    { id: 8, title: "Ambalapuzhe Unni Kannanodu", artist: "Kavya Ajit", duration: "4:12", color: "from-orange-400 to-amber-500", audioUrl: "/audio/ambalapuzhe-unni-kannanodu.mp3" },
];

export default function RetroPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(7); // Start with the uploaded song
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [view, setView] = useState<'player' | 'list'>('player');
    const [liked, setLiked] = useState<number[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = OLD_SONGS[currentTrackIndex];

    // Initialize audio element
    useEffect(() => {
        if (currentTrack.audioUrl) {
            audioRef.current = new Audio(currentTrack.audioUrl);

            const audio = audioRef.current;

            const handleTimeUpdate = () => {
                if (audio.duration) {
                    setCurrentTime(audio.currentTime);
                    setProgress((audio.currentTime / audio.duration) * 100);
                }
            };

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };

            const handleEnded = () => {
                handleNext();
            };

            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('ended', handleEnded);
                audio.pause();
            };
        }
    }, [currentTrackIndex, currentTrack.audioUrl, handleNext]);

    // Handle play/pause
    useEffect(() => {
        if (audioRef.current && currentTrack.audioUrl) {
            if (isPlaying) {
                audioRef.current.play().catch(err => console.error('Playback error:', err));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack.audioUrl]);

    // Mock progress for songs without audio files
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && !currentTrack.audioUrl) {
            timer = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 0.5));
            }, 100);
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentTrack.audioUrl]);

    useEffect(() => {
        if (progress >= 100 && !currentTrack.audioUrl) {
            handleNext();
        }
    }, [progress, currentTrack.audioUrl]);

    const handleNext = useCallback(() => {
        setIsPlaying(false);
        setTimeout(() => {
            setCurrentTrackIndex(prev => (prev + 1) % OLD_SONGS.length);
            setProgress(0);
            setCurrentTime(0);
            setIsPlaying(true);
        }, 300);
    }, []);

    const handlePrev = useCallback(() => {
        setIsPlaying(false);
        setTimeout(() => {
            setCurrentTrackIndex(prev => (prev - 1 + OLD_SONGS.length) % OLD_SONGS.length);
            setProgress(0);
            setCurrentTime(0);
            setIsPlaying(true);
        }, 300);
    }, []);

    const toggleLike = (id: number) => {
        setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-20 px-6 relative overflow-hidden">
            {/* Background Vibe */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack?.color || 'from-gray-800 to-black'} opacity-20 blur-[100px] transition-colors duration-1000`} />

            {/* Header */}
            <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <Music size={20} className="text-white/60" />
                </button>
                <h2 className="text-sm font-mono tracking-widest uppercase text-white/40">Retro 90s Station</h2>
                <button
                    onClick={() => setView(view === 'player' ? 'list' : 'player')}
                    className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <List size={20} className={view === 'list' ? "text-white" : "text-white/60"} />
                </button>
            </div>

            <AnimatePresence mode='wait'>
                {view === 'player' ? (
                    <motion.div
                        key="player"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md flex flex-col items-center z-10"
                    >
                        {/* Cassette / Vinyl Visual */}
                        <div className="relative w-64 h-64 mb-12">
                            {/* Glow */}
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentTrack.color} blur-[40px] opacity-40 animate-pulse`} />

                            {/* Spinning Disc */}
                            <motion.div
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="w-full h-full rounded-full bg-black border-4 border-white/10 shadow-2xl relative flex items-center justify-center overflow-hidden"
                            >
                                {/* Vinyl Grooves */}
                                <div className="absolute inset-2 rounded-full border border-white/5" />
                                <div className="absolute inset-4 rounded-full border border-white/5" />
                                <div className="absolute inset-6 rounded-full border border-white/5" />
                                <div className="absolute inset-8 rounded-full border border-white/5" />

                                {/* Label */}
                                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentTrack.color} flex items-center justify-center`}>
                                    <div className="w-3 h-3 bg-white/80 rounded-full shadow-inner" />
                                </div>
                            </motion.div>

                            {/* Tone Arm (Static representation for retro feel) */}
                            <div className="absolute -top-4 -right-4 w-20 h-32 pointer-events-none opacity-80">
                                <div className="w-4 h-4 rounded-full bg-white/20 absolute top-0 right-0" />
                                <div className={`w-1 h-32 bg-white/10 origin-top rotate-[25deg] transition-transform duration-500 ${isPlaying ? 'rotate-[25deg]' : 'rotate-[0deg]'}`} />
                            </div>
                        </div>

                        {/* Song Info */}
                        <div className="text-center mb-10 w-full">
                            <motion.h1
                                key={currentTrack.title}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-3xl font-black text-white mb-2 tracking-tight"
                            >
                                {currentTrack.title}
                            </motion.h1>
                            <motion.p
                                key={currentTrack.artist}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-white/50 font-medium"
                            >
                                {currentTrack.artist}
                            </motion.p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full mb-10">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-white"
                                    style={{ width: `${progress}%` }}
                                    layoutId="progress"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-white/30 font-mono">
                                <span>{currentTrack.audioUrl ? formatTime(currentTime) : `${Math.floor((progress / 100) * 180 / 60)}:${String(Math.floor((progress / 100) * 180 % 60)).padStart(2, '0')}`}</span>
                                <span>{currentTrack.audioUrl && duration ? formatTime(duration) : currentTrack.duration}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-8">
                            <button onClick={handlePrev} className="p-4 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all">
                                <SkipBack size={28} fill="currentColor" />
                            </button>

                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-20 h-20 rounded-[30px] bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            >
                                {isPlaying ? (
                                    <Pause size={32} fill="currentColor" />
                                ) : (
                                    <Play size={32} fill="currentColor" className="ml-1" />
                                )}
                            </button>

                            <button onClick={handleNext} className="p-4 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all">
                                <SkipForward size={28} fill="currentColor" />
                            </button>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => toggleLike(currentTrack.id)}
                                className={`p-3 rounded-full border transition-all ${liked.includes(currentTrack.id) ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                            >
                                <Heart size={20} fill={liked.includes(currentTrack.id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-md h-full overflow-y-auto pb-40 z-10"
                    >
                        <h3 className="text-white/40 font-bold uppercase tracking-widest text-xs mb-6">Queue</h3>
                        <div className="flex flex-col gap-3">
                            {OLD_SONGS.map((song, idx) => (
                                <button
                                    key={song.id}
                                    onClick={() => {
                                        setCurrentTrackIndex(idx);
                                        setProgress(0);
                                        setCurrentTime(0);
                                        setView('player');
                                        setIsPlaying(true);
                                    }}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer ${currentTrackIndex === idx ? 'bg-white/10 border border-white/10' : 'bg-transparent hover:bg-white/5 border border-transparent hover:border-white/5'}`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                                        {isPlaying && currentTrackIndex === idx ? (
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-1 bg-white animate-[bounce_0.5s_infinite]" />
                                                <div className="w-1 bg-white animate-[bounce_0.7s_infinite]" />
                                                <div className="w-1 bg-white animate-[bounce_0.4s_infinite]" />
                                            </div>
                                        ) : idx + 1}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className={`font-bold ${currentTrackIndex === idx ? 'text-white' : 'text-white/70'}`}>{song.title}</div>
                                        <div className="text-xs text-white/40">{song.artist}</div>
                                    </div>
                                    <div className="text-xs text-white/20 font-mono">{song.duration}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
