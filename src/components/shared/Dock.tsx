'use client';

import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, Camera, Brain } from 'lucide-react';
import { Section } from '@/types/types';
import { useRef, useEffect, useState } from 'react';
import { useThemeMode } from '@/contexts/ThemeModeContext';

// --- Dock Icon Component ---
function DockIcon({ mouseX, item, isActive, onClick }: { mouseX: any, item: any, isActive: boolean, onClick: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Framer Style: More aggressive scaling
    // Matches FloatingDock.tsx (Apple Dock source)
    const widthSync = useTransform(distance, [-200, 0, 200], [50, 100, 50]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const Icon = item.icon;

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square relative group z-10 flex items-end justify-center pb-3" // Align to bottom
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 border relative overflow-hidden ${isActive
                    ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                    : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                whileTap={{ scale: 0.85 }}
            >
                {/* Icon scales slightly inside the box */}
                <motion.div className="w-full h-full p-3 flex items-center justify-center">
                    <Icon className="w-full h-full" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>

                {/* Glass Reflection/Sheen */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent opacity-50" />
            </motion.div>

            {/* Active Indicator (Dot below) */}
            {isActive && (
                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white opacity-80 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            )}

            {/* Tooltip */}
            <AnimatePresence>
                {item.label && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, x: "-50%" }}
                        animate={{ opacity: 1, y: -60, x: "-50%" }} // Adjusted Y to clear larger icons
                        exit={{ opacity: 0, y: 0, x: "-50%" }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-0 px-3 py-1.5 rounded-full bg-[#1A1A1D]/90 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap z-50 pointer-events-none shadow-xl"
                    >
                        {item.label}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// --- Main Dock Component ---
interface DockProps {
    activeSection: Section;
    showDock?: boolean; // Optional, defaults to true
    onSectionChange: (section: Section) => void;
}

export default function Dock({ activeSection, showDock = true, onSectionChange }: DockProps) {
    const { mode } = useThemeMode();
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(Infinity);

    const items = [
        { id: 'home' as Section, icon: Home, label: 'Home' },
        { id: 'messages' as Section, icon: MessageCircle, label: 'Chat' },
        { id: 'camera' as Section, icon: Camera, label: 'Camera' },
        { id: 'guide' as Section, icon: Brain, label: 'Guide' },
    ];

    const isVisible = isHovered || showDock; // Show on hover OR when parent says to show

    // RETRO DOCK IMPLEMENTATION
    if (mode === 'retro-soul') {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-[100] h-32 flex justify-center items-end pointer-events-none font-vt323">
                <div
                    className="absolute bottom-0 left-0 right-0 h-4 pointer-events-auto"
                    onMouseEnter={() => setIsHovered(true)}
                />
                <motion.div
                    initial={false}
                    animate={{
                        y: isVisible ? -20 : 120,
                        opacity: isVisible ? 1 : 0,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative pointer-events-auto"
                >
                    <div className="flex items-center gap-2 px-6 py-4 bg-[#fef9c3] border-4 border-[#eab308] shadow-[4px_4px_0_#422006]">
                        {items.map((item) => {
                            const isActive = activeSection === item.id;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onSectionChange(item.id)}
                                    className={`relative w-12 h-12 flex items-center justify-center transition-all ${isActive ? 'bg-[#eab308] text-[#422006] translate-y-1' : 'hover:bg-[#fde047] text-[#854d0e]'
                                        } border-2 border-transparent hover:border-[#422006] rounded-none`}
                                >
                                    <Icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
                                    {isActive && (
                                        <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#422006]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        );
    }

    // MODERN DOCK (DEFAULT) - Redesigned
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[100] h-32 flex justify-center items-end pointer-events-none pb-0"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            {/* Trigger Zone */}
            <div
                className="absolute bottom-0 left-0 right-0 h-6 pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
            />

            {/* The actual dock with animation */}
            <motion.div
                initial={false}
                animate={{
                    y: isVisible ? 0 : 100,
                    opacity: isVisible ? 1 : 0,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative pointer-events-auto"
            >
                <div className="flex items-end gap-5 px-6 py-4 rounded-[36px] bg-neutral-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl mx-auto mb-6"
                    style={{
                        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255,255,255,0.1)'
                    }}
                >
                    {items.map((item) => (
                        <DockIcon
                            key={item.id}
                            mouseX={mouseX}
                            item={item}
                            isActive={activeSection === item.id}
                            onClick={() => onSectionChange(item.id)}
                        />
                    ))}

                    {/* Separator for potential future items */}
                    {/* <div className="w-px h-8 bg-white/10 mx-1 self-center" /> */}
                </div>
            </motion.div>
        </div>
    );
}