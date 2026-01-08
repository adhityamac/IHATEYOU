'use client';

import React, { useEffect, useRef } from 'react';

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize the audio object with a subtle UI click sound
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audioRef.current.volume = 0.15; // Keep it subtle so it's not annoying

        const handleGlobalClick = (e: MouseEvent) => {
            if (!audioRef.current) return;

            // Optional: Only play for interactive elements to keep the UX clean
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('role') === 'button';

            if (isInteractive) {
                // Reset sound to start (allows rapid clicking)
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                    // Browsers block audio until the first user interaction; ignore errors
                });
            }
        };

        window.addEventListener('mousedown', handleGlobalClick);
        return () => window.removeEventListener('mousedown', handleGlobalClick);
    }, []);

    return <>{children}</>;
};