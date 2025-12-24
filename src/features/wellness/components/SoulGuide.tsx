'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Brain } from 'lucide-react';
import { useSignals } from '@/hooks/useSignals';
import { useAlgorithm } from '@/hooks/useAlgorithm';

import PixelHoverGrid from '@/components/backgrounds/PixelHoverGrid';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'guide';
}

export default function SoulGuide() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello. I am Echo. What is on your mind today?', sender: 'guide' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { trackTool } = useSignals('user-1');
    const { state: emotionalState } = useAlgorithm('user-1');

    // Stable ID counter for messages - FIXED: moved outside function
    const INITIAL_ID = 2025122300000;
    const idCounter = useRef(INITIAL_ID);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        idCounter.current += 1;
        const userMsg: Message = { id: idCounter.current.toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        trackTool('echo_chat', 0);

        setIsTyping(true);
        setTimeout(() => {
            let responses = [
                "That sounds like a lot to carry. How does that make you feel in your body right now?",
                "It's okay to feel overwhelmed. Small steps are still progress.",
                "Have you tried taking a moment to just breathe into that feeling?",
                "I hear you. Sometimes silence is the best response to chaos. Tell me more when you're ready.",
                "Avoidance is also information. What do you think you're protecting yourself from?",
                "I'm listening. Take your time."
            ];

            // PUZZLE STEP 2: "The Beginning"
            if (input.toLowerCase().includes('the beginning')) {
                responses = [
                    "MEMORY UNLOCKED: 001",
                    "It started with a simple thought, didn't it?",
                    "You and I, we are just getting started.",
                    "The next key is hidden where you track your joy.",
                    "Look for the 'Golden' moment."
                ];
                // In a real app, we would unlock a database flag here.
                // For now, the response IS the reward.
            } else if (emotionalState?.primaryState === 'emotionally_overloaded') {
                responses = [
                    "Everything feels like a lot right now, doesn't it? Let's just focus on your breath for a second.",
                    "I can feel the weight of those thoughts. You don't have to figure it all out today.",
                    "Your system is signaling overwhelm. Would you like to try a grounding exercise with me?",
                    "It's okay to be loud, or quiet, or nothing at all right now."
                ];
            } else if (emotionalState?.primaryState === 'introspective') {
                responses = [
                    "You're looking deep today. What's the most unexpected thing you've found there?",
                    "There's a quiet power in your reflection. How does this connect to your past self?",
                    "I hear the depth in your words. What part of this story are you still writing?",
                    "That pensive energy suits you. What is the silence trying to tell you?"
                ];
            }

            idCounter.current += 1;
            const randomIdx = Math.floor(Math.random() * responses.length);
            const guideMsg: Message = {
                id: idCounter.current.toString(),
                text: responses[randomIdx],
                sender: 'guide'
            };
            setMessages(prev => [...prev, guideMsg]);
            setIsTyping(false);
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 5000);
        }, 2000);
    };

    // Full circle watermelon
    const R = 120; // Radius
    const redRadius = R * 0.72;
    const whiteOuter = R * 0.78;
    const greenOuter = R;

    return (
        <div className="fixed inset-0 z-[50] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
            {/* Interactive Grid Background */}
            <PixelHoverGrid
                gridSize={14}
                hoverColor="#ef4444"
                hoverColor2="#f87171"
                hoverColor3="#dc2626"
                hoverColor4="#b91c1c"
                backgroundColor="#050505"
                borderColor="rgba(239, 68, 68, 0.1)"
                borderWidth={1}
                animationDuration={0.6}
                maxOpacity={0.8}
                showCursor={false}
            />

            {/* Centerpiece: Full Circle Watermelon */}
            <div className="relative flex items-center justify-center mb-12 z-10">
                <AnimatePresence>
                    {(isTyping || isSpeaking) && (
                        <>
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: [1, 2.5],
                                        opacity: [0.15, 0]
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        delay: i * 1.2,
                                        ease: "easeOut"
                                    }}
                                    className="absolute rounded-full opacity-30"
                                    style={{
                                        width: `${R * 2.4}px`,
                                        height: `${R * 2.4}px`,
                                        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
                                        filter: 'blur(20px)'
                                    }}
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{
                        scale: isTyping ? [1, 1.08, 1] : [1, 1.04, 1],
                        rotate: [0, 360],
                        y: [0, -8, 0]
                    }}
                    transition={{
                        scale: { duration: isTyping ? 2 : 6, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                        y: { duration: isTyping ? 2 : 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                    style={{
                        width: `${R * 2}px`,
                        height: `${R * 2}px`,
                        filter: isSpeaking
                            ? 'drop-shadow(0 0 40px rgba(239,68,68,0.6))'
                            : 'drop-shadow(0 0 15px rgba(239,68,68,0.2))'
                    }}
                >
                    <svg viewBox={`0 0 ${R * 2} ${R * 2}`} className="w-full h-full">
                        <defs>
                            {/* Gradient for depth on red flesh */}
                            <radialGradient id="redGradient" cx="50%" cy="50%">
                                <stop offset="0%" stopColor="#ff4444" />
                                <stop offset="70%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#dc2626" />
                            </radialGradient>

                            {/* Glossy highlight gradient */}
                            <radialGradient id="glossHighlight" cx="30%" cy="30%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {/* Green outer rind */}
                        <circle
                            cx={R}
                            cy={R}
                            r={greenOuter}
                            fill="#22c55e"
                        />

                        {/* Light green/yellow inner rind */}
                        <circle
                            cx={R}
                            cy={R}
                            r={whiteOuter}
                            fill="#fef08a"
                        />

                        {/* Red flesh with gradient */}
                        <circle
                            cx={R}
                            cy={R}
                            r={redRadius}
                            fill="url(#redGradient)"
                        />

                        {/* Hand-drawn glossy highlight - pencil sketch style */}
                        <path
                            d={`M ${R * 0.4},${R * 0.7} 
                                Q ${R * 0.45},${R * 0.55} ${R * 0.6},${R * 0.52}
                                Q ${R * 0.75},${R * 0.5} ${R * 0.88},${R * 0.58}
                                Q ${R * 0.95},${R * 0.62} ${R * 0.92},${R * 0.72}
                                Q ${R * 0.88},${R * 0.82} ${R * 0.75},${R * 0.85}
                                Q ${R * 0.6},${R * 0.88} ${R * 0.45},${R * 0.82}
                                Q ${R * 0.35},${R * 0.78} ${R * 0.4},${R * 0.7} Z`}
                            fill="url(#glossHighlight)"
                            opacity="0.85"
                        />

                        {/* Seeds - scattered in circular pattern */}
                        <g>
                            {[
                                // Outer ring
                                { angle: 0, distance: 0.6 },
                                { angle: 45, distance: 0.62 },
                                { angle: 90, distance: 0.58 },
                                { angle: 135, distance: 0.61 },
                                { angle: 180, distance: 0.59 },
                                { angle: 225, distance: 0.63 },
                                { angle: 270, distance: 0.60 },
                                { angle: 315, distance: 0.62 },
                                // Middle ring
                                { angle: 22, distance: 0.45 },
                                { angle: 67, distance: 0.43 },
                                { angle: 112, distance: 0.47 },
                                { angle: 157, distance: 0.44 },
                                { angle: 202, distance: 0.46 },
                                { angle: 247, distance: 0.45 },
                                { angle: 292, distance: 0.43 },
                                { angle: 337, distance: 0.46 },
                                // Inner ring
                                { angle: 30, distance: 0.28 },
                                { angle: 90, distance: 0.25 },
                                { angle: 150, distance: 0.27 },
                                { angle: 210, distance: 0.26 },
                                { angle: 270, distance: 0.28 },
                                { angle: 330, distance: 0.25 }
                            ].map((seed, i) => {
                                const angleRad = (seed.angle * Math.PI) / 180;
                                const dist = seed.distance * redRadius;
                                const x = R + dist * Math.cos(angleRad);
                                const y = R + dist * Math.sin(angleRad);
                                const rotation = seed.angle + 90;

                                return (
                                    <ellipse
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        rx={R * 0.04}
                                        ry={R * 0.08}
                                        fill="#000000"
                                        transform={`rotate(${rotation} ${x} ${y})`}
                                    />
                                );
                            })}
                        </g>
                    </svg>
                </motion.div>
            </div>

            {/* Chat Container */}
            <div className="w-full max-w-2xl h-[60%] flex flex-col relative z-10 px-6">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto no-scrollbar py-8 space-y-12"
                >
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] px-10 py-7 rounded-[40px] text-xl leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-red-500/[0.08] text-white/90 border border-red-500/20 shadow-2xl'
                                    : 'text-white/50 italic font-light text-center w-full'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center"
                            >
                                <motion.div
                                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="px-10 py-7 text-white/20 italic font-light text-xl"
                                >
                                    Echo is reflecting on your words...
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="pb-24 pt-8 relative z-10">
                    <div className="relative group max-w-xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a feeling..."
                            className="w-full bg-white/[0.02] border border-red-500/20 rounded-[40px] px-10 py-8 text-white placeholder:text-white/10 focus:outline-none focus:bg-red-500/[0.05] focus:border-red-500/30 transition-all text-xl pr-24 shadow-inner"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20"
                        >
                            <Send size={24} />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-white/10 uppercase tracking-[0.3em] mt-6">Echo • A safe space for your internal frequency</p>
                </div>
            </div>

            {/* Subtle Brand */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-10 z-10">
                <Brain className="text-red-500 w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.8em] text-red-500">Echo</span>
            </div>
        </div>
    );
}
