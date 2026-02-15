'use client';

import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'pop' | 'move' | 'eat' | 'gameover' | 'win';

export default function useGameSound(enabled: boolean = true) {
    const audioContext = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first interaction if possible, or lazily
        if (typeof window !== 'undefined' && !audioContext.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) audioContext.current = new AudioCtx();
        }
    }, []);

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
        if (!enabled || !audioContext.current) return;

        // Resume if suspended (browser autoplay policy)
        if (audioContext.current.state === 'suspended') {
            audioContext.current.resume();
        }

        const ctx = audioContext.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [enabled]);

    const playSound = useCallback((type: SoundType) => {
        if (!enabled) return;

        switch (type) {
            case 'click':
                playTone(800, 'sine', 0.1, 0.05);
                break;
            case 'pop':
                playTone(600, 'triangle', 0.05, 0.1);
                setTimeout(() => playTone(1200, 'triangle', 0.1, 0.05), 50);
                break;
            case 'move':
                playTone(200, 'square', 0.05, 0.02);
                break;
            case 'eat':
                playTone(300, 'triangle', 0.1, 0.05);
                setTimeout(() => playTone(450, 'triangle', 0.1, 0.05), 100);
                break;
            case 'success':
                playTone(440, 'sine', 0.1);
                setTimeout(() => playTone(554, 'sine', 0.1), 100);
                setTimeout(() => playTone(659, 'sine', 0.2), 200);
                break;
            case 'error':
                playTone(150, 'sawtooth', 0.3);
                setTimeout(() => playTone(100, 'sawtooth', 0.3), 150);
                break;
            case 'gameover':
                playTone(300, 'sawtooth', 0.3);
                setTimeout(() => playTone(250, 'sawtooth', 0.3), 300);
                setTimeout(() => playTone(200, 'sawtooth', 0.4), 600);
                setTimeout(() => playTone(150, 'sawtooth', 0.6), 900);
                break;
            case 'win':
                [440, 554, 659, 880, 554, 659, 880, 1108].forEach((freq, i) => {
                    setTimeout(() => playTone(freq, 'square', 0.1, 0.1), i * 150);
                });
                break;
        }
    }, [enabled, playTone]);

    return { playSound };
}
