'use client';

import { motion, useSpring } from 'framer-motion';
import { Home, MessageCircle, Settings, LayoutGrid, Search, Brain, Camera, Gamepad2, Music } from 'lucide-react';
import { Section } from '@/types/types';
import { useRef, useEffect, useState } from 'react';
import { useThemeMode } from '@/contexts/ThemeModeContext';

interface DockProps {
    activeSection: Section;
    showDock?: boolean; // Optional, defaults to true
    onSectionChange: (section: Section) => void;
}

export default function Dock({ activeSection, showDock = true, onSectionChange }: DockProps) {
    const { mode } = useThemeMode();
    const [isHovered, setIsHovered] = useState(false);
    const lastScrollY = useRef(0);

    const items = [
        { id: 'home' as Section, icon: Home },
        { id: 'dashboard' as Section, icon: LayoutGrid },
        { id: 'messages' as Section, icon: MessageCircle, label: 'Chat' },
        { id: 'guide' as Section, icon: Brain },
        { id: 'search' as Section, icon: Search },
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const activeIndex = items.findIndex(item => item.id === activeSection);
    const [bubbleLeft, setBubbleLeft] = useState(32);

    // Intelligent Scroll Hide/Show is now handled by parent component
    // Dock visibility is controlled via showDock prop

    useEffect(() => {
        if (containerRef.current) {
            const buttons = containerRef.current.querySelectorAll('button');
            if (buttons[activeIndex]) {
                const rect = buttons[activeIndex].getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                setBubbleLeft(rect.left - containerRect.left + (rect.width / 2) - 32);
            }
        }
    }, [activeIndex]);

    const bubbleX = useSpring(bubbleLeft, {
        stiffness: 300,
        damping: 30,
    });

    useEffect(() => {
        bubbleX.set(bubbleLeft);
    }, [bubbleLeft, bubbleX]);

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

    // MODERN DOCK (DEFAULT)
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[100] h-32 flex justify-center items-end pointer-events-none"
        >
            {/* Tiny Trigger Zone: only 4px high at the very bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1 pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
            />

            {/* The actual dock with animation */}
            <motion.div
                initial={false}
                animate={{
                    y: isVisible ? -20 : 120, // Slide down further when hidden
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.95,
                    filter: isVisible ? 'blur(0px)' : 'blur(4px)'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8
                }}
                className="relative pointer-events-auto will-change-transform"
            >
                <div
                    ref={containerRef}
                    className="relative flex items-center gap-6 px-8 py-6 rounded-[40px] bg-[#1a1a1c]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                >
                    {/* Animated Active Bubble - stays inside */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00cc66] shadow-[0_10px_40px_rgba(0,255,136,0.6)] flex items-center justify-center pointer-events-none"
                        style={{
                            left: bubbleX,
                        }}
                    >
                        <motion.div
                            initial={false}
                            animate={{ scale: [0.9, 1.05, 1] }}
                            transition={{ duration: 0.3 }}
                            key={activeSection}
                        >
                            {(() => {
                                const ActiveIcon = items[activeIndex]?.icon;
                                return ActiveIcon ? <ActiveIcon className="w-7 h-7 text-black" strokeWidth={2.5} /> : null;
                            })()}
                        </motion.div>
                    </motion.div>

                    {/* Navigation Icons */}
                    {items.map((item) => {
                        const isActive = activeSection === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className="relative w-16 h-16 flex items-center justify-center transition-all z-10"
                            >
                                <motion.div
                                    animate={{
                                        opacity: isActive ? 0 : 0.4,
                                        scale: isActive ? 0.8 : 1
                                    }}
                                    className="text-white hover:opacity-100 transition-opacity"
                                >
                                    <Icon className="w-6 h-6" strokeWidth={2} />
                                </motion.div>
                            </button>
                        );
                    })}

                    {/* Subtle glow line */}
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                </div>
            </motion.div>
        </div>
    );
}