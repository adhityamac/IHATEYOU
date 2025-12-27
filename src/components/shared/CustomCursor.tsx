'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useCursor } from './CursorContext';

const CustomCursor = () => {
    const { cursorType } = useCursor();
    const [isVisible, setIsVisible] = useState(false);
    const lastUpdateTime = useRef(0);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring configuration
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            // Throttle to 60fps max (16ms)
            const now = Date.now();
            if (now - lastUpdateTime.current < 16) return;
            lastUpdateTime.current = now;

            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [mouseX, mouseY, isVisible]);

    // Disable on touch devices
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
        return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%',
            }}
            animate={{
                scale: cursorType === 'hover' ? 4 : 1,
                opacity: isVisible ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
        />
    );
};

export default CustomCursor;