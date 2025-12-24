'use client';

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PixelHoverGridProps {
    gridSize?: number;
    hoverColor?: string;
    hoverColor2?: string;
    hoverColor3?: string;
    hoverColor4?: string;
    backgroundColor?: string;
    animationDuration?: number;
    maxOpacity?: number;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: string;
    showCursor?: boolean;
    cursorColor?: string;
    cursorSize?: number;
}

export default function PixelHoverGrid(props: PixelHoverGridProps) {
    const {
        gridSize = 20,
        hoverColor = "#FF5588",
        hoverColor2 = "#0099FF",
        hoverColor3 = "#22CC66",
        hoverColor4 = "#FFBB00",
        backgroundColor = "#F5F5F5",
        animationDuration = 0.8,
        maxOpacity = 1,
        borderColor = "#CCCCCC",
        borderWidth = 1,
        borderStyle = "solid",
        showCursor = true,
        cursorColor = "#FF0000",
        cursorSize = 20
    } = props;

    const [hoveredPixels, setHoveredPixels] = useState(new Set());
    const [animatingPixels, setAnimatingPixels] = useState(new Set());
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isMouseInside, setIsMouseInside] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerDimensions({ width: rect.width, height: rect.height });
            }
        };
        updateDimensions();
        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const actualGridSize = Math.min(gridSize, Math.floor(Math.min(containerDimensions.width, containerDimensions.height) / 10));

    const pixels = useMemo(() => {
        const pixelArray = [];
        for (let row = 0; row < actualGridSize; row++) {
            for (let col = 0; col < actualGridSize; col++) {
                pixelArray.push({ row, col, id: `${row}-${col}` });
            }
        }
        return pixelArray;
    }, [actualGridSize]);

    const handlePixelHover = useCallback((pixelId: string) => {
        setHoveredPixels(prev => new Set(prev).add(pixelId));
        setAnimatingPixels(prev => new Set(prev).add(pixelId));
    }, []);

    const handleAnimationComplete = useCallback((pixelId: string) => {
        setHoveredPixels(prev => {
            const newSet = new Set(prev);
            newSet.delete(pixelId);
            return newSet;
        });
        setAnimatingPixels(prev => {
            const newSet = new Set(prev);
            newSet.delete(pixelId);
            return newSet;
        });
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsMouseInside(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsMouseInside(false);
    }, []);

    const getPixelColor = useCallback((pixelId: string) => {
        const colors = [hoverColor, hoverColor2, hoverColor3, hoverColor4];
        const hash = pixelId.split("-").reduce((acc, val) => acc + parseInt(val), 0);
        return colors[hash % colors.length];
    }, [hoverColor, hoverColor2, hoverColor3, hoverColor4]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor,
                position: "absolute",
                overflow: "hidden",
                cursor: "default",
                userSelect: "none",
                display: "grid",
                gridTemplateColumns: `repeat(${actualGridSize}, 1fr)`,
                gridTemplateRows: `repeat(${actualGridSize}, 1fr)`,
                gap: 8, // Increased gap for spacing
                padding: 20, // Add some breathing room at edges
                border: `${borderWidth}px ${borderStyle} ${borderColor}`
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {pixels.map(pixel => {
                const isAnimating = animatingPixels.has(pixel.id);
                return (
                    <div
                        key={pixel.id}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            border: `1px solid rgba(255,255,255,0.03)`, // Subtler border
                            borderRadius: '12px', // More premium rounded corners
                            overflow: 'hidden'
                        }}
                        onMouseEnter={() => handlePixelHover(pixel.id)}
                    >
                        <AnimatePresence>
                            {isAnimating && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        opacity: [0, maxOpacity, 0],
                                        scale: [0.5, 1.2, 1.5],
                                        filter: ['blur(10px)', 'blur(0px)', 'blur(20px)']
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: animationDuration * 1.5,
                                        ease: "circOut"
                                    }}
                                    onAnimationComplete={() => handleAnimationComplete(pixel.id)}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: getPixelColor(pixel.id),
                                        boxShadow: `0 0 30px ${getPixelColor(pixel.id)}66`
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
            {showCursor && isMouseInside && (
                <motion.div
                    style={{
                        position: "absolute",
                        width: cursorSize,
                        height: cursorSize,
                        backgroundColor: cursorColor,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        zIndex: 1000,
                        left: cursorPosition.x - cursorSize / 2,
                        top: cursorPosition.y - cursorSize / 2,
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </div>
    );
}
