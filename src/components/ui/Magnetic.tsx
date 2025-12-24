'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useCursor } from '../shared/CursorContext';

interface MagneticProps {
    children: React.ReactNode;
    strength?: number;
}

const Magnetic = ({ children, strength = 0.5 }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { setCursorType } = useCursor();

    // Motion values for the raw mouse position relative to center
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring configuration for the "magnetic" feel
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        // Calculate distance from the center of the element
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Apply strength multiplier
        mouseX.set((clientX - centerX) * strength);
        mouseY.set((clientY - centerY) * strength);
    };

    const handleMouseEnter = () => {
        setCursorType('hover');
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setCursorType('default');
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;