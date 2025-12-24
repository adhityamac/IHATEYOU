'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import { X, MessageCircle, Heart, Activity, Zap } from 'lucide-react';

interface Node {
    id: number;
    username: string;
    content: string;
    emotion: any;
    x: number;
    y: number;
    connections: number[];
}

interface SynapseMapProps {
    posts: any[];
    EmotionFace: any;
    timeOffset?: number; // 0 is now, 100 is far past
}

export default function SynapseMap({ posts, EmotionFace, timeOffset = 0 }: SynapseMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        }
    }, []);

    useEffect(() => {
        if (dimensions.width === 0) return;

        const seed = timeOffset * 0.05;

        const newNodes = posts.map((post, i) => {
            const angle = ((i / posts.length) * Math.PI * 2) + seed;
            const radius = (120 + (Math.sin(i + seed) * 40)) * (1 - (timeOffset / 400));

            return {
                ...post,
                x: dimensions.width / 2 + Math.cos(angle) * radius,
                y: dimensions.height / 2 + Math.sin(angle) * radius,
                connections: posts
                    .map((p, idx) => p.emotion.id === post.emotion.id && idx !== i ? p.id : null)
                    .filter(id => id !== null) as number[]
            };
        });
        setNodes(newNodes);
    }, [posts, dimensions, timeOffset]);

    const sectors = [
        { name: 'High Joy Sector', x: '20%', y: '20%' },
        { name: 'Stability Zone', x: '80%', y: '30%' },
        { name: 'Growth Cluster', x: '15%', y: '75%' },
        { name: 'Deep Archive', x: '75%', y: '85%' },
    ];

    return (
        <div ref={containerRef} className="relative w-full h-[600px] bg-black/40 rounded-[48px] border border-white/5 overflow-hidden shadow-3xl group">
            {/* Background Scanner Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[length:40px_40px]" />
            </div>

            {/* Vertical Scanning Line */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none z-0"
            />

            {/* Trend Diagnostic Labels */}
            {sectors.map((s, i) => (
                <div key={i} className="absolute pointer-events-none select-none opacity-20" style={{ left: s.x, top: s.y }}>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Activity size={8} className="text-white" />
                            <span className="text-[6px] font-black uppercase tracking-[0.5em] text-white whitespace-nowrap">{s.name}</span>
                        </div>
                        <div className="w-12 h-px bg-white/20" />
                        <span className="text-[5px] text-white/40 font-bold uppercase">Sync Rate: 98.2%</span>
                    </div>
                </div>
            ))}

            {/* Ambient Energy Fog */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.01] pointer-events-none" />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {nodes.map(node =>
                    node.connections.map(targetId => {
                        const target = nodes.find(n => n.id === targetId);
                        if (!target) return null;
                        return (
                            <motion.line
                                key={`${node.id}-${target.id}`}
                                x1={node.x}
                                y1={node.y}
                                x2={target.x}
                                y2={target.y}
                                stroke={node.emotion.color}
                                strokeWidth="0.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.15 }}
                                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                            />
                        );
                    })
                )}
            </svg>

            {/* Mood Nodes */}
            <AnimatePresence>
                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            x: node.x - 20,
                            y: node.y - 20,
                            scale: 1,
                            opacity: Math.max(0.1, 1 - (timeOffset / 100)),
                        }}
                        whileHover={{ scale: 1.2, zIndex: 50 }}
                        onClick={() => setSelectedNode(node)}
                        className="absolute w-10 h-10 cursor-pointer z-10"
                    >
                        <div className="w-full h-full p-0.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl relative">
                            <EmotionFace emotion={node.emotion} isSelected={false} />

                            {/* Scanning Micro-Effect */}
                            <motion.div
                                animate={{ top: ['0%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-px bg-white/20 z-20 pointer-events-none"
                            />
                        </div>

                        <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: node.emotion.color }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Central Diagnostic HUD */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
                <motion.div
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-64 h-64 rounded-full border border-white/5 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full border border-white/[0.02]" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="text-[10px] text-white uppercase tracking-[1.5em] font-black whitespace-nowrap">
                            {timeOffset > 1 ? `ARCHIVE T-${Math.floor(timeOffset)}H` : 'COLLECTIVE RESONANCE'}
                        </div>
                        <div className="text-[6px] text-white/30 uppercase tracking-[0.5em] font-bold mt-4">
                            Scanning mood nodes...
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Popover */}
            <AnimatePresence mode="wait">
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-64px)] max-w-lg z-[100] p-10 rounded-[40px] bg-black/90 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* Scanning HUD Element */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <button
                            onClick={() => setSelectedNode(null)}
                            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 p-2 shadow-2xl">
                                <EmotionFace emotion={selectedNode.emotion} isSelected={false} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">@{selectedNode.username}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: selectedNode.emotion.color }} />
                                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black italic">
                                        Frequency: {selectedNode.emotion.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-2xl text-white font-bold italic leading-relaxed mb-10 tracking-tight">
                            "{selectedNode.content}"
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                <Zap size={14} /> Send Support
                            </button>
                            <button className="py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                                <MessageCircle size={14} /> View Chat
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
