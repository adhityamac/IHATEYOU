'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const EMOJIS = [
    '⚡️', '🔥', '💿', '🕹️', '💎', '🧬', '🔮', '🧿',
    '🧸', '🎈', '🎀', '🎁', '🪄', '🪅', '🪩', '🎨',
    '🧵', '🧶', '🧥', '🥼', '🦺', '👖', '🧣', '🧤',
    '🧢', '🎩', '🎓', '⛑️', '👑', '💍', '🕶️', '👓',
    '🥽', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻',
    '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽',
    '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧',
    '🐦', '🐤', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
    '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🕷️', '🦂', '🦟', '🦠', '🐢', '🐍', '🦎', '🐙',
    '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬',
    '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍'
];

interface LoginScreenProps {
    onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const titleX = useMotionValue(0);
    const titleY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        }
    };

    const handleTitleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        titleX.set(clientX - left);
        titleY.set(clientY - top);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            setIsLoading(true);
            setTimeout(() => onLogin(username), 1000);
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212] overflow-hidden"
        >
            {/* Liquid Emoji Grid Background */}
            <div className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 gap-8 p-8 content-center justify-items-center pointer-events-none">
                {EMOJIS.slice(0, 96).map((emoji, i) => (
                    <LiquidEmoji
                        key={i}
                        emoji={emoji}
                        mouseX={smoothX}
                        mouseY={smoothY}
                    />
                ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />

            {/* Main Login Card - Glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[440px] px-8 py-12"
            >
                {/* Glass Card Background */}
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-[0_20px_80px_rgba(0,0,0,0.5)]" />

                <div className="relative flex flex-col items-center space-y-12 z-10">
                    {/* Brand Title with Grainy Text Effect */}
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-2"
                        >
                            Digital Soul 0.1
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                            className="relative inline-block group"
                            onMouseMove={handleTitleMouseMove}
                        >
                            {/* Glow effect behind the box */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                            {/* Main Box */}
                            <div className="relative px-8 py-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
                                {/* Spotlight Effect */}
                                <motion.div
                                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: useMotionTemplate`
                                            radial-gradient(
                                                200px circle at ${titleX}px ${titleY}px,
                                                rgba(255,255,255,0.15),
                                                transparent 80%
                                            )
                                        `
                                    }}
                                />

                                {/* Animated Gradient Background */}
                                <motion.div
                                    animate={{
                                        background: [
                                            "radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                                            "radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
                                            "radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                                            "radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
                                        ],
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0"
                                />

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <motion.h1
                                    className="text-6xl font-black italic tracking-[-0.05em] text-white uppercase leading-none relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                >
                                    IHATEYOU
                                </motion.h1>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 0.4 }}
                            className="text-xs text-white/40 font-bold uppercase tracking-[0.4em] mt-6"
                        >
                            the emotional playground
                        </motion.p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="w-full space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="group relative"
                        >
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your ghost name"
                                className="w-full h-18 bg-black/40 border border-white/10 rounded-[24px] px-8 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all text-lg font-medium shadow-inner"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            type="submit"
                            disabled={isLoading || !username.trim()}
                            className="relative w-full h-18 bg-white text-black font-black text-sm uppercase tracking-widest rounded-[24px] overflow-hidden transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full"
                                />
                            ) : (
                                <>
                                    ENTER THE VOID <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer with subtle interaction */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center space-y-4"
                    >
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                            A minimalist space for authentic souls.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

function LiquidEmoji({ emoji, mouseX, mouseY }: { emoji: string; mouseX: any; mouseY: any }) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform([mouseX, mouseY], (values: any[]) => {
        const [x, y] = values;
        if (!ref.current) return 0;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.hypot(x - centerX, y - centerY);
    });

    const scale = useTransform(distance, [0, 200], [2.5, 1]);
    const opacity = useTransform(distance, [0, 300], [1, 0.5]);
    const rotate = useTransform(distance, [0, 200], [45, 0]);

    return (
        <motion.div ref={ref} style={{ scale, opacity, rotate }} className="text-2xl select-none transition-colors duration-500 drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]">
            {emoji}
        </motion.div>
    );
}
