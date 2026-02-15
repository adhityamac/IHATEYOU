'use client';

import React, { useEffect, useRef } from 'react';

/**
 * CustomCursor
 * Adapted from Framer Trailing Cursor
 * https://framer.com/m/Trailing-Cursor-ktFr.js@vy1KHk7Zy54inEaEh96v
 */

interface CustomCursorProps {
    trailColor?: string;
    trailLength?: number;
    trailWidth?: number;
    smoothness?: number;
    damping?: number;
    fadeOnLeave?: boolean;
}

export default function CustomCursor({
    trailColor = "#0FEC9F",
    trailLength = 30,
    trailWidth = 6,
    smoothness = 0.1,
    damping = 0.7,
    fadeOnLeave = true
}: CustomCursorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(null);
    const stateRef = useRef({
        mouseX: 0,
        mouseY: 0,
        cursorX: 0,
        cursorY: 0,
        velocityX: 0,
        velocityY: 0,
        trailPoints: [] as { x: number; y: number }[],
        cursorOpacity: 1,
        targetOpacity: 1
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const state = stateRef.current;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        // Initialize state
        state.cursorX = window.innerWidth / 2;
        state.cursorY = window.innerHeight / 2;
        state.mouseX = state.cursorX;
        state.mouseY = state.cursorY;

        const handleMouseMove = (e: MouseEvent) => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
            // Ensure opacity is up when moving
            if (fadeOnLeave) state.targetOpacity = 1;
        };

        const handleMouseEnter = () => {
            if (fadeOnLeave) state.targetOpacity = 1;
        };

        const handleMouseLeave = () => {
            if (fadeOnLeave) state.targetOpacity = 0;
        };

        function hexToRgba(hex: string, alpha: number) {
            // Handle simple hex codes
            let r = 0, g = 0, b = 0;

            if (hex.startsWith('#')) {
                const hexVal = hex.slice(1);
                if (hexVal.length === 3) {
                    r = parseInt(hexVal[0] + hexVal[0], 16);
                    g = parseInt(hexVal[1] + hexVal[1], 16);
                    b = parseInt(hexVal[2] + hexVal[2], 16);
                } else if (hexVal.length === 6) {
                    r = parseInt(hexVal.slice(0, 2), 16);
                    g = parseInt(hexVal.slice(2, 4), 16);
                    b = parseInt(hexVal.slice(4, 6), 16);
                }
            } else if (hex.startsWith('rgb')) {
                // Return as is but add alpha/replace it is tricky, so simplified fallback
                return hex.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            }

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        const animate = () => {
            // Physics movement
            const deltaX = (state.mouseX - state.cursorX) * smoothness;
            const deltaY = (state.mouseY - state.cursorY) * smoothness;

            state.velocityX = damping * state.velocityX + deltaX;
            state.velocityY = damping * state.velocityY + deltaY;

            state.cursorX += state.velocityX;
            state.cursorY += state.velocityY;

            // Add new point
            state.trailPoints.push({ x: state.cursorX, y: state.cursorY });

            // Remove old points
            if (state.trailPoints.length > trailLength) {
                state.trailPoints.shift();
            }

            // Opacity transition
            state.cursorOpacity += (state.targetOpacity - state.cursorOpacity) * 0.1;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw trail
            if (state.trailPoints.length > 1) {
                // Set styles
                ctx.lineCap = "round";

                // Draw segments
                for (let i = 0; i < state.trailPoints.length - 1; i++) {
                    const point1 = state.trailPoints[i];
                    const point2 = state.trailPoints[i + 1];
                    const progress = (i + 1) / state.trailPoints.length;
                    const opacity = progress * state.cursorOpacity;

                    // Color logic
                    const color = trailColor.startsWith("#")
                        ? hexToRgba(trailColor, opacity)
                        : `rgba(${trailColor.match(/\d+/g)?.slice(0, 3).join(",") || "255,97,78"}, ${opacity})`;

                    ctx.strokeStyle = color;
                    ctx.lineWidth = trailWidth * progress;

                    ctx.beginPath();
                    ctx.moveTo(point1.x, point1.y);
                    ctx.lineTo(point2.x, point2.y);
                    ctx.stroke();
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", resizeCanvas);

        animate();

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [trailColor, trailLength, trailWidth, smoothness, damping, fadeOnLeave]);

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none"
                }}
            />
        </div>
    );
}