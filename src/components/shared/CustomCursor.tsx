'use client';

import React, { useRef, useEffect, useState, useCallback, startTransition } from 'react';

/**
 * PixelCursor
 * adapted from https://framer.com/m/PixelCursor-pXAX.js@ZQRN50hLzsasowU2i4rG
 */

interface Pixel {
    id: number;
    x: number;
    y: number;
    color: string;
    timestamp: number;
}

interface PixelCursorProps {
    pixelSize?: number;
    density?: number;
    fadeTime?: number;
    palette?: string[];
    maxPixels?: number;
    shape?: 'square' | 'circle' | 'triangle' | 'star';
}

export default function CustomCursor({
    pixelSize = 8,
    density = 2,
    fadeTime = 800,
    palette = ["#FF0000", "#FF8800", "#FFFF00", "#00FF00", "#0088FF", "#8800FF", "#FF0088"],
    maxPixels = 40,
    shape = "square"
}: PixelCursorProps) {
    const [pixels, setPixels] = useState<Pixel[]>([]);
    const [isOverButton, setIsOverButton] = useState(false);
    const pixelIdRef = useRef(0);
    const lastMoveTime = useRef(0);
    const lastPosition = useRef({ x: -100, y: -100 });
    const animationFrameRef = useRef<number>();

    // Get shape styles based on selected shape
    const getShapeStyles = useCallback((shape: string, size: number) => {
        const baseStyles: React.CSSProperties = { width: size, height: size };
        switch (shape) {
            case "circle":
                return { ...baseStyles, borderRadius: "50%" };
            case "triangle":
                return {
                    width: 0,
                    height: 0,
                    borderLeft: `${size / 2}px solid transparent`,
                    borderRight: `${size / 2}px solid transparent`,
                    borderBottom: `${size}px solid`,
                    backgroundColor: "transparent"
                };
            case "star":
                return {
                    ...baseStyles,
                    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                };
            case "square":
            default:
                return baseStyles;
        }
    }, []);

    // Optimized pixel cleanup
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cleanup = () => {
            const now = Date.now();
            startTransition(() => {
                setPixels(prev => prev.filter(pixel => now - pixel.timestamp < fadeTime));
            });
            animationFrameRef.current = requestAnimationFrame(cleanup);
        };

        animationFrameRef.current = requestAnimationFrame(cleanup);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [fadeTime]);

    // Check if element is a button
    const isButton = useCallback((element: Element | null) => {
        if (!element) return false;
        return (
            element.tagName.toLowerCase() === "button" ||
            element.getAttribute("role") === "button" ||
            (element as HTMLElement).onclick !== null ||
            element.tagName.toLowerCase() === "a"
        );
    }, []);

    // Global mouse move handler for website-wide cursor trail
    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        // Check if cursor is over a button
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        const overButton = isButton(elementUnderCursor);

        if (overButton !== isOverButton) {
            startTransition(() => {
                setIsOverButton(overButton);
            });
        }

        // Don't create trail pixels when over buttons
        // if (overButton) return; // Optional: keeps trail even over buttons if commented out

        const now = Date.now();
        if (now - lastMoveTime.current < 16) return; // 60fps throttle
        lastMoveTime.current = now;

        const x = e.clientX;
        const y = e.clientY;
        const dx = x - lastPosition.current.x;
        const dy = y - lastPosition.current.y;

        // Update last pos even if we don't draw (to avoid jumps)
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 3) {
            const newPixels: Pixel[] = [];
            const steps = Math.min(Math.ceil(dist / 8) * density, 5);

            for (let i = 0; i < steps; i++) {
                const progress = i / Math.max(steps - 1, 1);
                const pixelX = lastPosition.current.x + dx * progress;
                const pixelY = lastPosition.current.y + dy * progress;

                newPixels.push({
                    id: pixelIdRef.current++,
                    x: pixelX,
                    y: pixelY,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    timestamp: now
                });
            }

            startTransition(() => {
                setPixels(prev => [...prev, ...newPixels].slice(-maxPixels));
            });
        }

        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }

        lastPosition.current = { x, y };
    }, [density, palette, maxPixels, isOverButton, isButton]);

    // Attach global listeners
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onMouseMove = (e: MouseEvent) => handleGlobalMouseMove(e);
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [handleGlobalMouseMove]);

    const cursorRef = useRef<HTMLDivElement>(null);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            {pixels.map(pixel => {
                const age = Date.now() - pixel.timestamp;
                const opacity = Math.max(0, 1 - age / fadeTime);
                const shapeStyle = getShapeStyles(shape, pixelSize);
                const isTriangle = shape === "triangle";

                return (
                    <div
                        key={pixel.id}
                        style={{
                            position: 'absolute',
                            left: pixel.x,
                            top: pixel.y,
                            opacity: opacity,
                            transform: `translate(-50%, -50%) scale(${opacity})`,
                            backgroundColor: isTriangle ? undefined : pixel.color,
                            borderBottomColor: isTriangle ? pixel.color : undefined,
                            ...shapeStyle
                        }}
                    />
                );
            })}

            {/* Main cursor dot */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '8px',
                    height: '8px',
                    backgroundColor: isOverButton ? 'white' : 'transparent',
                    border: '1px solid white',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    mixBlendMode: 'difference',
                    transition: 'width 0.2s, height 0.2s, background-color 0.2s',
                    zIndex: 10000,
                    transform: 'translate(-50%, -50%)' // Initial transform, updated by ref
                }}
            />
        </div>
    );
}