'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, 'rgba(30, 27, 75, 0.2)'); // indigo-950
            gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(1, 'rgba(74, 4, 78, 0.2)'); // fuchsia-950
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Grid settings
            const gridSize = 60;
            const revealRadius = 250;

            // Draw Grid
            ctx.lineWidth = 1;

            for (let x = 0; x <= width; x += gridSize) {
                for (let y = 0; y <= height; y += gridSize) {
                    // Calculate distance to mouse
                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Base opacity
                    let opacity = 0.05;

                    // Reveal effect
                    if (distance < revealRadius) {
                        opacity += (1 - distance / revealRadius) * 0.3;
                    }

                    // Draw vertical line segment
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + gridSize);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.stroke();

                    // Draw horizontal line segment
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + gridSize, y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.stroke();

                    // Highlight intersection if close
                    if (distance < revealRadius) {
                        const highlightOpacity = (1 - distance / revealRadius) * 0.5;
                        ctx.fillStyle = `rgba(168, 85, 247, ${highlightOpacity})`; // Purple highlight
                        ctx.fillRect(x - 1, y - 1, 2, 2);
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 bg-[#030303]"
        />
    );
}
