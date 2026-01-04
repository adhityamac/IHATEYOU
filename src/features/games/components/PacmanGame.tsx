'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';

// --- Constants & Config ---

const TILE_SIZE = 20; // Size of each grid cell in pixels
const MAP_WIDTH = 19;
const MAP_HEIGHT = 21;
const GAME_SPEED = 120; // Milliseconds per move tick (lower is faster)

// 0: Empty, 1: Wall, 2: Pellet, 3: Power Pellet, 4: Ghost House
const LEVEL_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 4, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0], // Teleport tunnel row
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1], // Pacman spawn at 0
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Directions
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

interface Point {
    x: number;
    y: number;
}

interface Ghost {
    id: number;
    color: string;
    x: number;
    y: number;
    dir: Direction;
    state: 'SCATTER' | 'CHASE' | 'FRIGHTENED' | 'EATEN';
    speed: number;
}

// --- Helper Functions ---

const getDirVector = (dir: Direction): Point => {
    switch (dir) {
        case 'UP': return { x: 0, y: -1 };
        case 'DOWN': return { x: 0, y: 1 };
        case 'LEFT': return { x: -1, y: 0 };
        case 'RIGHT': return { x: 1, y: 0 };
        default: return { x: 0, y: 0 };
    }
};

// --- Game Component ---

interface PacmanGameProps {
    onBack: () => void;
    tokens: number;
    onUpdateTokens: (amount: number) => void;
}

export default function PacmanGame({ onBack, onUpdateTokens }: PacmanGameProps) {
    // --- State ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'WON'>('IDLE');
    const [lives, setLives] = useState(3);

    // Game Logic Refs (Mutable state for performance)
    const pacman = useRef({ x: 9, y: 16, dir: 'NONE' as Direction, nextDir: 'NONE' as Direction, mouthOpen: 0 });
    const ghosts = useRef<Ghost[]>([
        { id: 0, color: '#FF0000', x: 9, y: 8, dir: 'LEFT', state: 'SCATTER', speed: 1 }, // Blinky
        { id: 1, color: '#FFB8FF', x: 8, y: 10, dir: 'UP', state: 'SCATTER', speed: 0.9 }, // Pinky
        { id: 2, color: '#00FFFF', x: 10, y: 10, dir: 'UP', state: 'SCATTER', speed: 0.8 }, // Inky
        { id: 3, color: '#FFB852', x: 9, y: 10, dir: 'UP', state: 'SCATTER', speed: 0.8 }, // Clyde
    ]);
    const pellets = useRef<number[][]>([]);
    const animationFrameId = useRef<number>();
    const lastTime = useRef<number>(0);
    const moveTimer = useRef<number>(0);

    // --- Initialization ---

    const resetGhosts = useCallback(() => {
        ghosts.current = [
            { id: 0, color: '#FF0000', x: 9, y: 8, dir: 'LEFT', state: 'SCATTER', speed: 1 },
            { id: 1, color: '#FFB8FF', x: 8, y: 10, dir: 'UP', state: 'SCATTER', speed: 0.9 },
            { id: 2, color: '#00FFFF', x: 10, y: 10, dir: 'UP', state: 'SCATTER', speed: 0.8 },
            { id: 3, color: '#FFB852', x: 9, y: 10, dir: 'UP', state: 'SCATTER', speed: 0.8 },
        ];
    }, []);

    const resetLevel = useCallback(() => {
        // Deep copy map for pellets
        pellets.current = LEVEL_MAP.map(row => [...row]);
        pacman.current = { x: 9, y: 16, dir: 'NONE', nextDir: 'NONE', mouthOpen: 0 };
        resetGhosts();
    }, [resetGhosts]);

    useEffect(() => {
        const saved = localStorage.getItem('pacman_highscore');
        if (saved) setHighScore(parseInt(saved));
        resetLevel();
    }, [resetLevel]);

    const startGame = () => {
        setGameState('PLAYING');
        setScore(0);
        setLives(3);
        resetLevel();
    };

    // --- Helper Functions ---

    const isWall = (x: number, y: number) => {
        if (y < 0 || y >= MAP_HEIGHT || x < 0 || x >= MAP_WIDTH) return true;
        return pellets.current[y][x] === 1;
    };

    const checkWin = useCallback(() => {
        // Check if all pellets (2 and 3) are gone
        const hasPellets = pellets.current.some(row => row.some(cell => cell === 2 || cell === 3));
        if (!hasPellets) {
            setGameState('WON');
            onUpdateTokens(50); // Win bonus
        }
    }, [onUpdateTokens]);

    const handleDeath = useCallback(() => {
        if (lives > 1) {
            setLives(l => l - 1);
            pacman.current = { x: 9, y: 16, dir: 'NONE', nextDir: 'NONE', mouthOpen: 0 };
            resetGhosts();
            // Small pause?
        } else {
            setGameState('GAMEOVER');
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('pacman_highscore', score.toString());
            }
            onUpdateTokens(Math.floor(score / 100)); // Reward tokens based on score
        }
    }, [lives, resetGhosts, score, highScore, onUpdateTokens]);

    const checkEntityCollisions = useCallback(() => {
        const p = pacman.current;
        for (const g of ghosts.current) {
            if (g.x === p.x && g.y === p.y) {
                if (g.state === 'FRIGHTENED') {
                    // Eat Ghost
                    g.x = 9; g.y = 10; // Send home
                    g.state = 'EATEN'; // Respawn state
                    setScore(s => s + 200);
                    setTimeout(() => g.state = 'SCATTER', 3000);
                } else if (g.state !== 'EATEN') {
                    // Pacman Dies
                    handleDeath();
                }
            }
        }
    }, [handleDeath]);

    const frightenGhosts = useCallback(() => {
        ghosts.current.forEach(g => {
            g.state = 'FRIGHTENED';
        });
        setTimeout(() => {
            ghosts.current.forEach(g => {
                if (g.state === 'FRIGHTENED') g.state = 'SCATTER';
            });
        }, 8000); // 8 Seconds fear
    }, []);

    const movePacman = useCallback(() => {
        const p = pacman.current;

        // Try to change direction if queued
        if (p.nextDir !== 'NONE') {
            const vec = getDirVector(p.nextDir);
            if (!isWall(p.x + vec.x, p.y + vec.y)) {
                p.dir = p.nextDir;
                p.nextDir = 'NONE';
            }
        }

        // Move in current direction
        const vec = getDirVector(p.dir);
        let nextX = p.x + vec.x;
        const nextY = p.y + vec.y;

        // Teleport Tunnel
        if (nextX < 0) nextX = MAP_WIDTH - 1;
        if (nextX >= MAP_WIDTH) nextX = 0;

        if (!isWall(nextX, nextY)) {
            p.x = nextX;
            p.y = nextY;

            // Eat Pellet
            const cell = pellets.current[p.y][p.x];
            if (cell === 2) {
                pellets.current[p.y][p.x] = 0;
                setScore(s => s + 10);
                checkWin();
            } else if (cell === 3) {
                pellets.current[p.y][p.x] = 0;
                setScore(s => s + 50);
                frightenGhosts();
            }

            // Animate mouth
            p.mouthOpen = (p.mouthOpen + 1) % 4;
        }
    }, [checkWin, frightenGhosts]);

    const moveGhost = useCallback((ghost: Ghost) => {
        // Simple AI: Move randomly but prioritize legal moves, don't reverse immediately if possible
        const possibleDirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const legalDirs = possibleDirs.filter(d => {
            const v = getDirVector(d);
            // Prevent exact 180 reverse unless stuck (simple way to prevent jitter)
            const isReverse = (d === 'UP' && ghost.dir === 'DOWN') ||
                (d === 'DOWN' && ghost.dir === 'UP') ||
                (d === 'LEFT' && ghost.dir === 'RIGHT') ||
                (d === 'RIGHT' && ghost.dir === 'LEFT');
            return !isWall(ghost.x + v.x, ghost.y + v.y) && !isReverse;
        });

        if (legalDirs.length > 0) {
            // Pick a direction (Basic AI improvements could go here)
            // For now, random legal move to keep it chaotic but functional
            const pick = legalDirs[Math.floor(Math.random() * legalDirs.length)];
            ghost.dir = pick;

            const v = getDirVector(pick);
            ghost.x += v.x;
            ghost.y += v.y;
        } else {
            // Dead end (shouldn't happen often in valid map), just reverse
            const reverseMap: Record<string, Direction> = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
            ghost.dir = reverseMap[ghost.dir] || 'NONE';
        }
    }, []);

    // --- Game Loop ---

    const update = useCallback((dt: number) => {
        if (gameState !== 'PLAYING') return;

        moveTimer.current += dt;
        if (moveTimer.current < GAME_SPEED) return; // Control speed
        moveTimer.current = 0;

        // 1. Move Pacman
        movePacman();

        // 2. Move Ghosts
        ghosts.current.forEach(ghost => moveGhost(ghost));

        // 3. Check Collisions
        checkEntityCollisions();
    }, [gameState, movePacman, moveGhost, checkEntityCollisions]);
    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        // Clear Canvas
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw Map
        pellets.current.forEach((row, y) => {
            row.forEach((cell, x) => {
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;

                if (cell === 1) { // Wall
                    ctx.fillStyle = '#1e3a8a'; // Blue wall
                    ctx.strokeStyle = '#3b82f6'; // Neon border
                    ctx.lineWidth = 1;

                    // Simple wall drawing - could be optimized to draw connected lines
                    ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    ctx.strokeRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                } else if (cell === 2) { // Pellet
                    ctx.fillStyle = '#fbbf24';
                    ctx.beginPath();
                    ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (cell === 3) { // Power Pellet
                    ctx.fillStyle = '#fbbf24';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#fbbf24';
                    ctx.beginPath();
                    ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else if (cell === 4) { // Ghost House Door
                    ctx.fillStyle = 'pink';
                    ctx.fillRect(px, py + TILE_SIZE / 2 - 2, TILE_SIZE, 4);
                }
            });
        });

        // Draw Pacman
        const p = pacman.current;
        const px = p.x * TILE_SIZE + TILE_SIZE / 2;
        const py = p.y * TILE_SIZE + TILE_SIZE / 2;

        ctx.fillStyle = '#facc15'; // Yellow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#facc15';
        ctx.beginPath();

        // Mouth rotation
        let rot = 0;
        if (p.dir === 'DOWN') rot = Math.PI / 2;
        if (p.dir === 'LEFT') rot = Math.PI;
        if (p.dir === 'UP') rot = -Math.PI / 2;

        const mouthSize = 0.2 + Math.sin(Date.now() / 50) * 0.15; // Animation

        ctx.arc(px, py, TILE_SIZE / 2 - 2, rot + mouthSize, rot + (Math.PI * 2) - mouthSize);
        ctx.lineTo(px, py);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Ghosts
        ghosts.current.forEach(g => {
            const gx = g.x * TILE_SIZE + TILE_SIZE / 2;
            const gy = g.y * TILE_SIZE + TILE_SIZE / 2;

            ctx.fillStyle = g.state === 'FRIGHTENED' ? '#3b82f6' : g.color; // Blue if frightened

            // Ghost body (dome top, feet bottom)
            ctx.beginPath();
            ctx.arc(gx, gy - 2, TILE_SIZE / 2 - 2, Math.PI, 0); // Dome
            ctx.lineTo(gx + TILE_SIZE / 2 - 2, gy + TILE_SIZE / 2 - 2);
            // Feet
            ctx.lineTo(gx + TILE_SIZE / 4, gy + TILE_SIZE / 2 - 4);
            ctx.lineTo(gx, gy + TILE_SIZE / 2 - 2);
            ctx.lineTo(gx - TILE_SIZE / 4, gy + TILE_SIZE / 2 - 4);
            ctx.lineTo(gx - TILE_SIZE / 2 + 2, gy + TILE_SIZE / 2 - 2);
            ctx.fill();

            // Eyes
            if (g.state !== 'FRIGHTENED') {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(gx - 4, gy - 4, 3, 0, Math.PI * 2);
                ctx.arc(gx + 4, gy - 4, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(gx - 3, gy - 4, 1.5, 0, Math.PI * 2);
                ctx.arc(gx + 5, gy - 4, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loop = (timestamp: number) => {
            if (!lastTime.current) lastTime.current = timestamp;
            const dt = timestamp - lastTime.current;
            lastTime.current = timestamp;

            update(dt);
            draw(ctx);
            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameState, update]); // Restart loop if game state changes

    // --- Controls ---

    const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp': pacman.current.nextDir = 'UP'; break;
            case 'ArrowDown': pacman.current.nextDir = 'DOWN'; break;
            case 'ArrowLeft': pacman.current.nextDir = 'LEFT'; break;
            case 'ArrowRight': pacman.current.nextDir = 'RIGHT'; break;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Touch Swipe Logic
    const touchStart = useRef({ x: 0, y: 0 });

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal
            if (Math.abs(dx) > 30) pacman.current.nextDir = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
            // Vertical
            if (Math.abs(dy) > 30) pacman.current.nextDir = dy > 0 ? 'DOWN' : 'UP';
        }
    };

    // Manual D-Pad
    const setDir = (d: Direction) => pacman.current.nextDir = d;

    return (
        <div className="w-full h-full flex flex-col items-center bg-[#050505] relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-4 left-4 z-20 flex gap-4">
                <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
                <div className="text-yellow-400 font-bold text-xl font-mono">SCORE: {score}</div>
                <div className="text-white/40 text-xs font-mono">HIGH: {highScore}</div>
            </div>

            {/* Game Canvas container */}
            <div
                className="flex-1 w-full flex items-center justify-center p-4 relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {gameState === 'IDLE' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">PAC-MAN</h2>
                        <p className="text-white/50 mb-8 font-mono text-sm max-w-xs text-center">Navigate the maze. Dodge the ghosts. Eat pellets.</p>
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all active:scale-95"
                        >
                            INSERT COIN
                        </button>
                    </div>
                )}

                {gameState === 'GAMEOVER' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
                        <h2 className="text-5xl font-black text-red-500 mb-4 tracking-wider glitch-text-sm">GAME OVER</h2>
                        <div className="text-2xl text-white font-mono mb-8">SCORE: {score}</div>
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg transition-all"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}

                {gameState === 'WON' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
                        <h2 className="text-5xl font-black text-green-500 mb-4 tracking-wider">YOU WIN!</h2>
                        <div className="text-yellow-400 font-bold mb-8 flex items-center gap-2"><Trophy className="w-5 h-5" /> +50 Tokens</div>
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-all"
                        >
                            NEXT LEVEL
                        </button>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={MAP_WIDTH * TILE_SIZE}
                    height={MAP_HEIGHT * TILE_SIZE}
                    className="border-2 border-blue-900 shadow-[0_0_30px_rgba(30,58,138,0.3)] rounded-lg max-w-full max-h-full"
                    style={{
                        imageRendering: 'pixelated'
                    }}
                />
            </div>

            {/* Mobile Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 md:hidden">
                <button
                    onPointerDown={(e) => { e.preventDefault(); setDir('UP'); }}
                    className="aspect-square bg-white/5 active:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 p-4"
                >
                    <div className="w-8 h-8 text-white/50 flex items-center justify-center font-bold text-2xl">▲</div>
                </button>
                <div className="flex gap-2">
                    <button
                        onPointerDown={(e) => { e.preventDefault(); setDir('LEFT'); }}
                        className="aspect-square bg-white/5 active:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 p-4"
                    >
                        <div className="w-8 h-8 text-white/50 flex items-center justify-center font-bold text-2xl">◀</div>
                    </button>
                    <button
                        onPointerDown={(e) => { e.preventDefault(); setDir('DOWN'); }}
                        className="aspect-square bg-white/5 active:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 p-4"
                    >
                        <div className="w-8 h-8 text-white/50 flex items-center justify-center font-bold text-2xl">▼</div>
                    </button>
                    <button
                        onPointerDown={(e) => { e.preventDefault(); setDir('RIGHT'); }}
                        className="aspect-square bg-white/5 active:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 p-4"
                    >
                        <div className="w-8 h-8 text-white/50 flex items-center justify-center font-bold text-2xl">▶</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
