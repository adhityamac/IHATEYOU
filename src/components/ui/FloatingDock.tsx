'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

// --- Dock Item Component ---
interface DockItemProps {
    mouseX: any;
    icon: React.ReactNode;
    label?: string;
    onClick: () => void;
    active?: boolean;
    badge?: number;
}

function DockItem({ mouseX, icon, label, onClick, active, badge }: DockItemProps) {
    let ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    let distance = useTransform(mouseX, (val: number) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square relative group"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200 border border-white/5 relative overflow-hidden ${active
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
            >
                {/* Icon wrapper to ensure it scales nicely */}
                <div className="bg-transparent w-5 h-5 flex items-center justify-center transform scale-125">
                    {icon}
                </div>

                {/* Badge */}
                {badge !== undefined && badge > 0 && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-black" />
                )}

                {/* Active Indicator (Dot below) */}
                {active && (
                    <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-white/50" />
                )}
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
                {label && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: -45, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="absolute left-1/2 top-0 px-3 py-1.5 rounded-xl bg-[#1A1A1D]/90 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap z-50 pointer-events-none"
                    >
                        {label}
                        {/* Triangle arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1D]/90 rotate-45 border-r border-b border-white/10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// --- Main Floating Dock ---
interface DockAction {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    badge?: number;
}

interface FloatingDockProps {
    items: DockAction[];
    className?: string;
}

export function FloatingDock({ items, className = '' }: FloatingDockProps) {
    let mouseX = useMotionValue(Infinity);

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${className}`}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                className="flex h-16 items-end gap-4 rounded-[32px] bg-[#0A0A0C]/40 backdrop-blur-2xl px-4 pb-3 border border-white/5 shadow-2xl"
                style={{
                    boxShadow: '0 0 50px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                {items.map((item, i) => (
                    <DockItem
                        key={i}
                        mouseX={mouseX}
                        {...item}
                    />
                ))}
            </motion.div>
        </div>
    );
}
