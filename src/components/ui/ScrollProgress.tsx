'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
    containerRef?: React.RefObject<HTMLElement>;
    color?: string;
    backgroundColor?: string;
    position?: 'left' | 'right' | 'top' | 'bottom';
    thickness?: number;
}

export default function ScrollProgress({
    containerRef,
    color = 'rgb(119, 11, 244)',
    backgroundColor = 'rgba(255, 255, 255, 0.05)',
    position = 'right',
    thickness = 2
}: ScrollProgressProps) {
    const { scrollYProgress } = useScroll(containerRef ? { container: containerRef } : undefined);

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const isVertical = position === 'left' || position === 'right';

    const positionStyles = {
        left: { left: 0, top: 0, bottom: 0, width: thickness },
        right: { right: 0, top: 0, bottom: 0, width: thickness },
        top: { top: 0, left: 0, right: 0, height: thickness },
        bottom: { bottom: 0, left: 0, right: 0, height: thickness }
    };

    return (
        <div
            className="fixed z-[200] overflow-hidden"
            style={{
                ...positionStyles[position],
                backgroundColor
            }}
        >
            <motion.div
                style={{
                    [isVertical ? 'scaleY' : 'scaleX']: scaleY,
                    [isVertical ? 'height' : 'width']: '100%',
                    [isVertical ? 'width' : 'height']: thickness,
                    backgroundColor: color,
                    transformOrigin: isVertical ? 'top' : 'left'
                }}
            />
        </div>
    );
}
