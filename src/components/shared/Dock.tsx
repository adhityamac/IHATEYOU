'use client';

import { motion, useSpring } from 'framer-motion';
import { Home, MessageCircle, Settings, LayoutGrid, Search, Brain, Camera, Gamepad2, Music } from 'lucide-react';
import { Section } from '@/types/types';
import { useRef, useEffect, useState } from 'react';

interface DockProps {
    activeSection: Section;
    onSectionChange: (section: Section) => void;
}

export default function Dock({ activeSection, onSectionChange }: DockProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const lastScrollY = useRef(0);

    const items = [
        { id: 'home' as Section, icon: Home },
        { id: 'dashboard' as Section, icon: LayoutGrid },
        { id: 'messages' as Section, icon: MessageCircle, label: 'Chat' },
        { id: 'guide' as Section, icon: Brain },
        { id: 'search' as Section, icon: Search },
        { id: 'settings' as Section, icon: Settings },
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const activeIndex = items.findIndex(item => item.id === activeSection);
    const [bubbleLeft, setBubbleLeft] = useState(32);

    // Intelligent Scroll Hide/Show - Improved for all sections
    useEffect(() => {
        const handleScroll = () => {
            // Find all scrollable containers
            const scrollableElements = document.querySelectorAll('[data-scrollable="true"]');
            let currentScrollY = 0;

            // Get the maximum scroll position from all scrollable elements
            scrollableElements.forEach((el) => {
                const scrollTop = el.scrollTop;
                if (scrollTop > currentScrollY) {
                    currentScrollY = scrollTop;
                }
            });

            // Also check window scroll as fallback
            if (currentScrollY === 0) {
                currentScrollY = window.scrollY || document.documentElement.scrollTop;
            }

            // Basic direction check with improved threshold
            if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
                setIsVisible(false); // Scrolling down
            } else if (currentScrollY < lastScrollY.current || currentScrollY < 20) {
                setIsVisible(true);  // Scrolling up or near top
            }
            lastScrollY.current = currentScrollY;
        };

        // Listen to scroll events on window and capture phase for child elements
        window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

        // Also add a custom event listener for manual scroll tracking
        const customScrollHandler = (e: Event) => handleScroll();
        document.addEventListener('custom-scroll', customScrollHandler);

        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
            document.removeEventListener('custom-scroll', customScrollHandler);
        };
    }, []);

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

    const showDock = isHovered || isVisible;

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
                    y: showDock ? -20 : 120, // Slide down further when hidden
                    opacity: showDock ? 1 : 0,
                    scale: showDock ? 1 : 0.95,
                    filter: showDock ? 'blur(0px)' : 'blur(4px)'
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