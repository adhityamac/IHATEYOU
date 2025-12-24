'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface NeuralAudioProps {
    emotion?: string;
    intensity?: number; // 0 to 1
    frequency?: number; // base frequency in Hz
}

export default function NeuralAudio({ emotion, intensity = 0.5, frequency = 432 }: NeuralAudioProps) {
    const audioCtx = useRef<AudioContext | null>(null);
    const oscillator = useRef<OscillatorNode | null>(null);
    const gainNode = useRef<GainNode | null>(null);
    const filterNode = useRef<BiquadFilterNode | null>(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Base Oscillator (The Hum)
            oscillator.current = audioCtx.current.createOscillator();
            oscillator.current.type = 'sine';
            oscillator.current.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);

            // Filter (For that 'underwater' neural feel)
            filterNode.current = audioCtx.current.createBiquadFilter();
            filterNode.current.type = 'lowpass';
            filterNode.current.frequency.setValueAtTime(1000, audioCtx.current.currentTime);
            filterNode.current.Q.setValueAtTime(10, audioCtx.current.currentTime);

            // Volume Control
            gainNode.current = audioCtx.current.createGain();
            gainNode.current.gain.setValueAtTime(0, audioCtx.current.currentTime);

            oscillator.current.connect(filterNode.current);
            filterNode.current.connect(gainNode.current);
            gainNode.current.connect(audioCtx.current.destination);

            oscillator.current.start();
        }

        if (isMuted) {
            gainNode.current?.gain.exponentialRampToValueAtTime(0.05 * intensity, audioCtx.current.currentTime + 2);
            setIsMuted(false);
        } else {
            gainNode.current?.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + 1);
            setTimeout(() => setIsMuted(true), 1100);
        }
    };

    // Update audio parameters based on props
    useEffect(() => {
        if (!audioCtx.current || isMuted) return;

        const now = audioCtx.current.currentTime;

        // Adjust frequency based on 'vibe'
        let targetFreq = frequency;
        if (emotion === 'joyful' || emotion === 'excited') targetFreq *= 1.2;
        if (emotion === 'calm' || emotion === 'peaceful') targetFreq *= 0.8;
        if (emotion === 'anxious' || emotion === 'angry') targetFreq *= 1.5;

        oscillator.current?.frequency.exponentialRampToValueAtTime(targetFreq, now + 1);
        gainNode.current?.gain.exponentialRampToValueAtTime(0.05 * intensity, now + 1);
        filterNode.current?.frequency.exponentialRampToValueAtTime(500 + (intensity * 2000), now + 1);

    }, [emotion, intensity, frequency, isMuted]);

    return (
        <button
            onClick={toggleAudio}
            className={`fixed top-8 right-40 z-[200] p-4 rounded-2xl backdrop-blur-3xl border transition-all duration-500 overflow-hidden group ${isMuted ? 'bg-white/5 border-white/10 opacity-30' : 'bg-rose-500/20 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.3)]'}`}
        >
            <div className="flex items-center gap-3 relative z-10">
                <div className="flex gap-1 items-end h-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`w-0.5 rounded-full transition-all duration-300 ${isMuted ? 'h-1 bg-white/20' : 'bg-rose-500'}`}
                            style={useMemo(() => ({
                                height: isMuted ? '4px' : `${Math.random() * 100}%`,
                                animation: isMuted ? 'none' : `wave 1s infinite ${i * 0.1}s ease-in-out`
                            }), [isMuted, i])}
                        />
                    ))}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isMuted ? 'text-white/20' : 'text-rose-500'}`}>
                    {isMuted ? 'Sound Off' : 'Mood Sound'}
                </span>
            </div>

            <style jsx>{`
                @keyframes wave {
                    0%, 100% { height: 4px; }
                    50% { height: 16px; }
                }
            `}</style>
        </button>
    );
}
