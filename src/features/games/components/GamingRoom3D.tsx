'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GamingRoom3DProps {
    onSelectGame: (gameId: string) => void;
    onClose: () => void;
}

// Interactive Computer Monitor
function ComputerMonitor({ onClick }: { onClick: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={[0, 0.5, 0]}>
            {/* Monitor Base */}
            <mesh position={[0, -0.3, 0]}>
                <boxGeometry args={[0.6, 0.05, 0.4]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>

            {/* Monitor Stand */}
            <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Monitor Screen */}
            <mesh
                position={[0, 0.2, 0]}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[0.8, 0.6, 0.05]} />
                <meshStandardMaterial
                    color={hovered ? "#ff6b9d" : "#d946ef"}
                    emissive={hovered ? "#ff6b9d" : "#d946ef"}
                    emissiveIntensity={hovered ? 0.8 : 0.3}
                />
            </mesh>

            {/* Screen Glow */}
            {hovered && (
                <pointLight position={[0, 0.2, 0.1]} intensity={2} color="#ff6b9d" distance={2} />
            )}
        </group>
    );
}

// Arcade Cabinet
function ArcadeCabinet({ onClick }: { onClick: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={[-2, 0, -1]}>
            {/* Cabinet Body */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.6, 1.2, 0.5]} />
                <meshStandardMaterial color="#1a1a2e" />
            </mesh>

            {/* Screen */}
            <mesh
                position={[0, 0.7, 0.26]}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[0.4, 0.3, 0.02]} />
                <meshStandardMaterial
                    color={hovered ? "#00ff88" : "#00cc66"}
                    emissive={hovered ? "#00ff88" : "#00cc66"}
                    emissiveIntensity={hovered ? 1 : 0.5}
                />
            </mesh>

            {/* Control Panel */}
            <mesh position={[0, 0.3, 0.3]} rotation={[-0.3, 0, 0]}>
                <boxGeometry args={[0.5, 0.2, 0.1]} />
                <meshStandardMaterial color="#ff6b35" />
            </mesh>

            {/* Score Display "374" */}
            <mesh position={[0, 1.1, 0.26]}>
                <boxGeometry args={[0.2, 0.1, 0.02]} />
                <meshStandardMaterial
                    color="#ff9500"
                    emissive="#ff9500"
                    emissiveIntensity={0.8}
                />
            </mesh>
        </group>
    );
}

// Desk Lamp
function DeskLamp({ isOn, onClick }: { isOn: boolean; onClick: () => void }) {
    return (
        <group position={[-1.5, 0.8, 0.5]}>
            {/* Lamp Base */}
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 0.05]} />
                <meshStandardMaterial color="#8b7355" />
            </mesh>

            {/* Lamp Arm */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>

            {/* Lamp Shade */}
            <mesh
                position={[0.2, 0.3, 0]}
                onClick={onClick}
                rotation={[0, 0, 0.5]}
            >
                <coneGeometry args={[0.15, 0.2, 8]} />
                <meshStandardMaterial
                    color={isOn ? "#ffd700" : "#8b7355"}
                    emissive={isOn ? "#ffd700" : "#000000"}
                    emissiveIntensity={isOn ? 0.5 : 0}
                />
            </mesh>

            {/* Light Source */}
            {isOn && (
                <pointLight position={[0.2, 0.2, 0]} intensity={3} color="#ffd700" distance={4} />
            )}
        </group>
    );
}

// Game Boy
function GameBoy({ onClick }: { onClick: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={[1.2, 0.1, 0.3]} rotation={[0, -0.3, 0]}>
            <mesh
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[0.15, 0.25, 0.05]} />
                <meshStandardMaterial color={hovered ? "#ffeb3b" : "#fdd835"} />
            </mesh>

            {/* Screen */}
            <mesh position={[0, 0.05, 0.026]}>
                <boxGeometry args={[0.12, 0.1, 0.01]} />
                <meshStandardMaterial
                    color="#9ccc65"
                    emissive="#9ccc65"
                    emissiveIntensity={hovered ? 0.5 : 0.2}
                />
            </mesh>
        </group>
    );
}

// Bookshelf
function Bookshelf({ onClick }: { onClick: () => void }) {
    return (
        <group position={[2, 0.6, -1.5]} onClick={onClick}>
            {/* Shelf Frame */}
            <mesh>
                <boxGeometry args={[0.8, 1.2, 0.3]} />
                <meshStandardMaterial color="#6d4c41" />
            </mesh>

            {/* Books */}
            {[0, 1, 2].map((i) => (
                <mesh key={i} position={[-0.2 + i * 0.2, 0.3, 0.1]}>
                    <boxGeometry args={[0.15, 0.25, 0.05]} />
                    <meshStandardMaterial color={['#e91e63', '#2196f3', '#4caf50'][i]} />
                </mesh>
            ))}
        </group>
    );
}

// Room Floor
function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#1a1a2e" />
        </mesh>
    );
}

// Room Walls
function Walls() {
    return (
        <>
            {/* Back Wall */}
            <mesh position={[0, 1.5, -2]} receiveShadow>
                <planeGeometry args={[10, 4]} />
                <meshStandardMaterial color="#16213e" />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[10, 4]} />
                <meshStandardMaterial color="#16213e" />
            </mesh>

            {/* Right Wall */}
            <mesh position={[3, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[10, 4]} />
                <meshStandardMaterial color="#16213e" />
            </mesh>
        </>
    );
}

// Main Gaming Room Scene
function GamingRoomScene({
    onComputerClick,
    onArcadeClick,
    onGameBoyClick,
    onBookshelfClick,
    lampOn,
    onLampClick
}: {
    onComputerClick: () => void;
    onArcadeClick: () => void;
    onGameBoyClick: () => void;
    onBookshelfClick: () => void;
    lampOn: boolean;
    onLampClick: () => void;
}) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} />
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={3}
                maxDistance={8}
            />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 3, 0]} intensity={0.5} color="#4a5568" />

            {/* Neon Accent Lights */}
            <pointLight position={[-2, 2, -1]} intensity={1} color="#ff00ff" distance={3} />
            <pointLight position={[2, 2, -1]} intensity={1} color="#00ffff" distance={3} />

            {/* Environment */}
            <Environment preset="night" />

            {/* Room Structure */}
            <Floor />
            <Walls />

            {/* Interactive Objects */}
            <ComputerMonitor onClick={onComputerClick} />
            <ArcadeCabinet onClick={onArcadeClick} />
            <DeskLamp isOn={lampOn} onClick={onLampClick} />
            <GameBoy onClick={onGameBoyClick} />
            <Bookshelf onClick={onBookshelfClick} />
        </>
    );
}

// Main Component
export default function GamingRoom3D({ onSelectGame, onClose }: GamingRoom3DProps) {
    const [showGameMenu, setShowGameMenu] = useState(false);
    const [lampOn, setLampOn] = useState(true);
    const [notification, setNotification] = useState<string | null>(null);

    const handleComputerClick = () => {
        setShowGameMenu(true);
    };

    const handleArcadeClick = () => {
        setNotification('🕹️ Arcade games coming soon!');
        setTimeout(() => setNotification(null), 2000);
    };

    const handleGameBoyClick = () => {
        setNotification('🎮 Handheld games coming soon!');
        setTimeout(() => setNotification(null), 2000);
    };

    const handleBookshelfClick = () => {
        setNotification('📚 Achievements coming soon!');
        setTimeout(() => setNotification(null), 2000);
    };

    const handleLampClick = () => {
        setLampOn(!lampOn);
    };

    return (
        <div className="relative w-full h-full">
            {/* 3D Canvas */}
            <Canvas shadows>
                <GamingRoomScene
                    onComputerClick={handleComputerClick}
                    onArcadeClick={handleArcadeClick}
                    onGameBoyClick={handleGameBoyClick}
                    onBookshelfClick={handleBookshelfClick}
                    lampOn={lampOn}
                    onLampClick={handleLampClick}
                />
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={onClose}
                    className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg"
                    >
                        {notification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Selection Menu */}
            <AnimatePresence>
                {showGameMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <div className="bg-gray-900 border-4 border-purple-500 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                    SELECT GAME
                                </h2>
                                <button
                                    onClick={() => setShowGameMenu(false)}
                                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Game Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Chess', 'Pac-Man', 'Memory', 'Alchemy', 'Trivia', 'Tic Tac Toe'].map((game) => (
                                    <button
                                        key={game}
                                        onClick={() => {
                                            onSelectGame(game.toLowerCase().replace(/[- ]/g, ''));
                                            setShowGameMenu(false);
                                        }}
                                        className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105"
                                    >
                                        {game}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg text-sm">
                <p className="font-bold mb-2">🎮 Interactive Objects:</p>
                <ul className="space-y-1">
                    <li>🖥️ Computer → Select games</li>
                    <li>🕹️ Arcade → Arcade games</li>
                    <li>💡 Lamp → Toggle light</li>
                    <li>🎮 Game Boy → Handheld games</li>
                    <li>📚 Bookshelf → Achievements</li>
                </ul>
            </div>
        </div>
    );
}
