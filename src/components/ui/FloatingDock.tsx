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

    // Framer Logic: Map distance to width
    // Distance 250 for smoother falloff (matches Apple Dock source)
    let distance = useTransform(mouseX, (val: number) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Redesigned: Base 50 -> Max 100 (2x scale), stiffness 150 (Framer default)
    let widthSync = useTransform(distance, [-200, 0, 200], [50, 100, 50]);
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square relative group z-10 flex items-end justify-center pb-3"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 border relative overflow-hidden ${active
                    ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                    : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                whileTap={{ scale: 0.85 }}
            >
                {/* Icon wrapper */}
                <motion.div className="w-full h-full p-3 flex items-center justify-center">
                    {icon}
                </motion.div>

                {/* Badge */}
                {badge !== undefined && badge > 0 && (
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-black shadow-sm" />
                )}

                {/* Glass Reflection */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent opacity-50" />
            </motion.div>

            {/* Active Dot */}
            {active && (
                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white opacity-80 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            )}

            {/* Tooltip */}
            <AnimatePresence>
                {label && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, x: "-50%" }}
                        animate={{ opacity: 1, y: -60, x: "-50%" }}
                        exit={{ opacity: 0, y: 0, x: "-50%" }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-0 px-3 py-1.5 rounded-full bg-[#1A1A1D]/90 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap z-50 pointer-events-none shadow-xl"
                    >
                        {label}
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
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 h-32 flex items-end ${className}`}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                className="flex items-end gap-5 rounded-[36px] bg-neutral-900/60 backdrop-blur-2xl px-6 py-4 border border-white/10 shadow-2xl relative"
                style={{
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255,255,255,0.1)'
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
