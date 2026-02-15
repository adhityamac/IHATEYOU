'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type AmbienceType = 'rain' | 'static' | 'cafe' | null;

interface AudioContextType {
    currentAmbience: AmbienceType;
    volume: number;
    setAmbience: (type: AmbienceType) => void;
    setVolume: (vol: number) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    // Music Support
    currentTrack: { title: string; artist: string; url: string; cover: string } | null;
    playTrack: (track: { title: string; artist: string; url: string; cover: string }) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Audio Sources (Public domain or placeholder loops)
const AMBIENCE_SOURCES = {
    rain: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_06d0428612.mp3?filename=rain-and-thunder-113218.mp3', // Example rain
    static: 'https://cdn.pixabay.com/download/audio/2022/11/03/audio_c97699313a.mp3?filename=tv-static-noise-12563.mp3', // Example static
    cafe: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cafe-ambience-15286.mp3' // Example cafe
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentAmbience, setCurrentAmbience] = useState<AmbienceType>(null);
    const [volume, setVolume] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);

    // Music State
    const [currentTrack, setCurrentTrack] = useState<{ title: string; artist: string; url: string; cover: string } | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist Settings
    useEffect(() => {
        const savedAmbience = localStorage.getItem('void_ambience') as AmbienceType;
        const savedVolume = localStorage.getItem('void_volume');

        if (savedAmbience) setCurrentAmbience(savedAmbience);
        if (savedVolume) setVolume(parseFloat(savedVolume));
    }, []);

    useEffect(() => {
        if (currentAmbience && !currentTrack) {
            localStorage.setItem('void_ambience', currentAmbience);
        } else if (!currentTrack) {
            localStorage.removeItem('void_ambience');
        }
    }, [currentAmbience, currentTrack]);

    useEffect(() => {
        localStorage.setItem('void_volume', volume.toString());
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Audio Logic
    useEffect(() => {
        // Stop any previous audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Logic: Music takes priority. If music, play music. Else if ambience, play ambience.
        const sourceUrl = currentTrack ? currentTrack.url : (currentAmbience ? AMBIENCE_SOURCES[currentAmbience] : null);

        if (!sourceUrl) {
            audioRef.current = null;
            setIsPlaying(false);
            return;
        }

        audioRef.current = new Audio(sourceUrl);
        audioRef.current.loop = !currentTrack; // Loop ambience, not music
        audioRef.current.volume = volume;

        // Auto-play
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch(err => {
                    console.warn("Auto-play prevented:", err);
                    setIsPlaying(false);
                });
        }

        // Handle track end for music
        if (currentTrack) {
            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [currentAmbience, currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

    const togglePlay = () => {
        if (!audioRef.current || (!currentAmbience && !currentTrack)) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    const playTrack = (track: { title: string; artist: string; url: string; cover: string }) => {
        setCurrentTrack(track);
    };

    return (
        <AudioContext.Provider value={{
            currentAmbience,
            volume,
            setAmbience: setCurrentAmbience,
            setVolume,
            isPlaying,
            togglePlay,
            currentTrack,
            playTrack
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
