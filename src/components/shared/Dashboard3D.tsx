'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Section } from '@/types/types';
import {
    Activity,
    MessageCircle,
    Heart,
    Brain,
    BookOpen,
    Flame,
    Music,
    Camera,
    Search,
    Settings,
    Sparkles
} from 'lucide-react';

interface Dashboard3DProps {
    onSectionChange: (section: Section) => void;
}

interface Hotspot {
    id: string;
    position: [number, number, number];
    label: string;
    icon: React.ElementType;
    color: string;
    section: Section;
    description: string;
}

function AtticRoom() {
    const { scene } = useGLTF('/attic-room.glb');

    // Clone the scene to avoid issues with multiple instances
    const clonedScene = scene.clone();

    return (
        <primitive
            object={clonedScene}
            scale={2.5}
            position={[0, -1.5, 0]}
            rotation={[0, Math.PI * 0.25, 0]}
        />
    );
}

function InteractiveHotspot({
    hotspot,
    onClick,
    isHovered,
    onHover
}: {
    hotspot: Hotspot;
    onClick: () => void;
    isHovered: boolean;
    onHover: (id: string | null) => void;
}) {
    return (
        <group position={hotspot.position}>
            {/* Glowing sphere */}
            <mesh
                onClick={onClick}
                onPointerEnter={() => onHover(hotspot.id)}
                onPointerLeave={() => onHover(null)}
            >
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial
                    color={hotspot.color}
                    emissive={hotspot.color}
                    emissiveIntensity={isHovered ? 2 : 1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Pulsing ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.25, 32]} />
                <meshBasicMaterial
                    color={hotspot.color}
                    transparent
                    opacity={isHovered ? 0.6 : 0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* HTML Label */}
            {isHovered && (
                <Html
                    position={[0, 0.4, 0]}
                    center
                    distanceFactor={6}
                    style={{ pointerEvents: 'none' }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            {(() => {
                                const Icon = hotspot.icon as any;
                                return <Icon {...{ size: 16, className: "text-white" }} />;
                            })()}
                            <span className="text-white font-bold text-sm">{hotspot.label}</span>
                        </div>
                        <p className="text-white/60 text-xs mt-1">{hotspot.description}</p>
                    </motion.div>
                </Html>
            )}
        </group>
    );
}

function Scene({ onSectionChange }: { onSectionChange: (section: Section) => void }) {
    const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

    // Define interactive hotspots positioned around the room
    const hotspots: Hotspot[] = [
        {
            id: 'bed',
            position: [0, 0.5, 0],
            label: 'Daily Check-In',
            icon: Activity,
            color: '#c4b5fd',
            section: 'home',
            description: 'Track your mood & emotions'
        },
        {
            id: 'computer',
            position: [1.5, 0.8, -0.5],
            label: 'Messages',
            icon: MessageCircle,
            color: '#fde047',
            section: 'messages',
            description: 'Neural Link conversations'
        },
        {
            id: 'shelf-left',
            position: [-1.2, 1, 0.3],
            label: 'Wellness Hub',
            icon: Heart,
            color: '#fda4af',
            section: 'dashboard',
            description: 'Self-care tools'
        },
        {
            id: 'books',
            position: [-0.8, 0.3, 0.8],
            label: 'Journal',
            icon: BookOpen,
            color: '#a78bfa',
            section: 'dashboard',
            description: 'Guided reflection'
        },
        {
            id: 'lights',
            position: [0, 2, 0],
            label: 'Streak Tracker',
            icon: Flame,
            color: '#bef264',
            section: 'dashboard',
            description: '12 days strong!'
        },
        {
            id: 'plant-right',
            position: [1.2, 0.5, 0.5],
            label: 'Soul Guide',
            icon: Brain,
            color: '#93c5fd',
            section: 'guide',
            description: 'AI Companion'
        },
        {
            id: 'window',
            position: [0, 1.5, -1],
            label: 'Vision Board',
            icon: Camera,
            color: '#5eead4',
            section: 'vision',
            description: 'Dream Pixels'
        },
        {
            id: 'floor-center',
            position: [0.5, 0.1, 1],
            label: 'Discovery',
            icon: Search,
            color: '#fdba74',
            section: 'search',
            description: 'Find resonance'
        }
    ];

    const handleHotspotClick = (section: Section) => {
        onSectionChange(section);
    };

    return (
        <>
            {/* Camera */}
            <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
            <pointLight position={[0, 3, 0]} intensity={0.8} color="#fff4e6" />
            <pointLight position={[-2, 1, 2]} intensity={0.4} color="#fda4af" />
            <pointLight position={[2, 1, 2]} intensity={0.4} color="#93c5fd" />

            {/* Environment */}
            <Environment preset="night" />

            {/* The Attic Room Model */}
            <Suspense fallback={null}>
                <AtticRoom />
            </Suspense>

            {/* Interactive Hotspots */}
            {hotspots.map((hotspot) => (
                <InteractiveHotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    onClick={() => handleHotspotClick(hotspot.section)}
                    isHovered={hoveredHotspot === hotspot.id}
                    onHover={setHoveredHotspot}
                />
            ))}

            {/* Camera Controls */}
            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={3}
                maxDistance={8}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 6}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </>
    );
}

export default function Dashboard3D({ onSectionChange }: Dashboard3DProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black"
                    >
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                            />
                            <h2 className="text-2xl font-black text-white mb-2">Loading Your Sanctuary</h2>
                            <p className="text-white/60 text-sm">Preparing your personal space...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 mb-2">
                        Your Sanctuary
                    </h1>
                    <p className="text-white/60 text-sm font-medium">
                        Click on the glowing orbs to explore different areas
                    </p>
                </motion.div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-black/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20"
                >
                    <div className="flex items-center gap-6 text-white/80 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span>Drag to rotate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                            <span>Scroll to zoom</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                            <span>Click orbs to navigate</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Legend */}
            <div className="absolute top-24 right-8 z-10">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/50 backdrop-blur-xl p-4 rounded-2xl border border-white/20 max-w-xs"
                >
                    <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-400" />
                        Interactive Areas
                    </h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-400" />
                            <span className="text-white/80">Bed = Daily Check-In</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="text-white/80">Computer = Messages</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-400" />
                            <span className="text-white/80">Shelf = Wellness Hub</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="text-white/80">Lights = Streak</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 3D Canvas */}
            <Canvas
                shadows
                onCreated={() => {
                    setTimeout(() => setIsLoading(false), 1500);
                }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
                }}
            >
                <Scene onSectionChange={onSectionChange} />
            </Canvas>
        </div>
    );
}

// Preload the model
useGLTF.preload('/attic-room.glb');
