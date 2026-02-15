'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Trophy, RotateCcw } from 'lucide-react';
import GameShell, { GameContextType } from './GameShell';

// --- Types ---
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Position { x: number; y: number; }
interface GhostEntity {
    id: number;
    color: string;
    pos: Position;
    startPos: Position;
    dir: Direction;
    state: 'CHASE' | 'SCATTER' | 'FLEE' | 'EATEN';
}

// --- Config ---
const COLS = 19;
const ROWS = 21;
const SPEED_MS = 150;

// 1=Wall, 0=Dot, 2=Power, 3=Empty/Door
const MAZE_LAYOUT = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 2, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1],
    [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
    [1, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export default function PacmanGame({ onBack }: { onBack: () => void }) {
    return (
        <GameShell title="Classic Pac-Man" icon="👻" color="#ecc94b" onClose={onBack}>
            {(gameCtx) => <PacmanBoard gameCtx={gameCtx} />}
        </GameShell>
    );
}

function PacmanBoard({ gameCtx }: { gameCtx: GameContextType }) {
    // --- State ---
    const [pacman, setPacman] = useState<Position>({ x: 9, y: 13 });
    const [dir, setDir] = useState<Direction>('RIGHT');
    const [nextDir, setNextDir] = useState<Direction>('RIGHT');

    const [ghosts, setGhosts] = useState<GhostEntity[]>([
        { id: 1, color: '#ff0000', pos: { x: 9, y: 7 }, startPos: { x: 9, y: 7 }, dir: 'LEFT', state: 'CHASE' },
        { id: 2, color: '#ffb8ff', pos: { x: 8, y: 9 }, startPos: { x: 8, y: 9 }, dir: 'UP', state: 'SCATTER' },
        { id: 3, color: '#00ffff', pos: { x: 10, y: 9 }, startPos: { x: 10, y: 9 }, dir: 'DOWN', state: 'CHASE' },
        { id: 4, color: '#ffb852', pos: { x: 9, y: 9 }, startPos: { x: 9, y: 9 }, dir: 'RIGHT', state: 'SCATTER' }
    ]);

    // Level
    const [dots, setDots] = useState<Position[]>([]);
    const [powerPellets, setPowerPellets] = useState<Position[]>([]);

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const stateRef = useRef({ pacman, dir, nextDir, ghosts, dots, powerPellets, lives, score });
    useEffect(() => { stateRef.current = { pacman, dir, nextDir, ghosts, dots, powerPellets, lives, score }; });

    // --- Init ---
    useEffect(() => {
        const d: Position[] = [];
        const p: Position[] = [];
        MAZE_LAYOUT.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) d.push({ x, y });
                if (cell === 2) p.push({ x, y });
            });
        });
        setDots(d);
        setPowerPellets(p);
    }, []);

    // --- Loop ---
    useEffect(() => {
        if (gameCtx.gameState !== 'PLAYING') return;
        const interval = setInterval(tick, SPEED_MS);
        return () => clearInterval(interval);
    }, [gameCtx.gameState]);

    const tick = () => {
        updatePacman();
        updateGhosts();
    };

    // --- Logic ---
    const isWall = (x: number, y: number) => {
        if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return false;
        return MAZE_LAYOUT[y][x] === 1;
    };

    const updatePacman = () => {
        const { pacman: curr, dir: currDir, nextDir: wantedDir } = stateRef.current;

        let nextPos = getNextPos(curr, wantedDir);
        let finalDir = currDir;

        // Try turn
        if (!isWall(nextPos.x, nextPos.y)) {
            finalDir = wantedDir;
        } else {
            // Keep going
            nextPos = getNextPos(curr, currDir);
            if (isWall(nextPos.x, nextPos.y)) nextPos = curr;
        }

        // Portal
        if (nextPos.x < 0) nextPos.x = COLS - 1;
        if (nextPos.x >= COLS) nextPos.x = 0;

        setDir(finalDir);
        setPacman(nextPos);
        checkCollisions(nextPos);
    };

    const updateGhosts = () => {
        setGhosts(prev => prev.map(g => {
            // Simple Random AI
            let nextG = getNextPos(g.pos, g.dir);
            let nextD = g.dir;

            if (isWall(nextG.x, nextG.y) || Math.random() > 0.8) {
                const choices: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
                const valid = choices.filter(d => !isWall(getNextPos(g.pos, d).x, getNextPos(g.pos, d).y));
                if (valid.length > 0) {
                    nextD = valid[Math.floor(Math.random() * valid.length)];
                    nextG = getNextPos(g.pos, nextD);
                } else {
                    nextG = g.pos;
                }
            }

            if (nextG.x < 0) nextG.x = COLS - 1;
            if (nextG.x >= COLS) nextG.x = 0;

            return { ...g, pos: nextG, dir: nextD };
        }));
    };

    const getNextPos = (p: Position, d: Direction) => {
        if (d === 'UP') return { x: p.x, y: p.y - 1 };
        if (d === 'DOWN') return { x: p.x, y: p.y + 1 };
        if (d === 'LEFT') return { x: p.x - 1, y: p.y };
        if (d === 'RIGHT') return { x: p.x + 1, y: p.y };
        return p;
    };

    const checkCollisions = (pos: Position) => {
        // Dots
        const dIdx = stateRef.current.dots.findIndex(d => d.x === pos.x && d.y === pos.y);
        if (dIdx !== -1) {
            const newDots = [...stateRef.current.dots];
            newDots.splice(dIdx, 1);
            setDots(newDots);
            setScore(s => s + 10);
            gameCtx.setScore(s => s + 10);
            gameCtx.playSound('click');
        }

        // Ghosts
        const hit = stateRef.current.ghosts.find(g => g.pos.x === pos.x && g.pos.y === pos.y);
        if (hit) {
            gameCtx.playSound('error');
            if (stateRef.current.lives > 1) {
                setLives(l => l - 1);
                setPacman({ x: 9, y: 13 });
            } else {
                gameCtx.endGame(false, stateRef.current.score);
            }
        }
    };

    // --- Input ---
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (['ArrowUp', 'w'].includes(e.key)) setNextDir('UP');
            if (['ArrowDown', 's'].includes(e.key)) setNextDir('DOWN');
            if (['ArrowLeft', 'a'].includes(e.key)) setNextDir('LEFT');
            if (['ArrowRight', 'd'].includes(e.key)) setNextDir('RIGHT');
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, []);

    // --- Render ---
    return (
        <div className="w-full max-w-md mx-auto aspect-[19/21] bg-black border-4 border-blue-800 rounded-lg relative shadow-2xl p-2">

            {/* HUD */}
            <div className="absolute top-2 left-2 text-white font-mono text-xs z-10">SCORE: {score}</div>
            <div className="absolute top-2 right-2 flex gap-1 z-10">
                {Array(lives).fill(0).map((_, i) => <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full" />)}
            </div>

            {/* Grid */}
            <div
                className="w-full h-full relative"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`
                }}
            >
                {/* Walls */}
                {MAZE_LAYOUT.map((row, y) => row.map((cell, x) => (
                    <div key={`${x}-${y}`} className={`${cell === 1 ? 'bg-blue-900 border-[0.5px] border-blue-700' : ''}`} />
                )))}

                {/* Dots */}
                {dots.map((d, i) => (
                    <div key={`d-${i}`} className="absolute w-1 h-1 bg-pink-300 rounded-full"
                        style={{ left: `calc(${(d.x / COLS) * 100}% + 50% - 2px)`, top: `calc(${(d.y / ROWS) * 100}% + 50% - 2px)` }}
                    />
                ))}

                {/* Ghosts */}
                {ghosts.map(g => (
                    <div key={g.id} className="absolute w-[4%] h-[4%] transition-all duration-150 ease-linear flex items-center justify-center"
                        style={{ left: `${(g.pos.x / COLS) * 100}%`, top: `${(g.pos.y / ROWS) * 100}%`, color: g.color }}
                    >
                        <Ghost size={16} fill="currentColor" />
                    </div>
                ))}

                {/* Pacman */}
                <div className="absolute w-[4%] h-[4%] bg-yellow-400 rounded-full transition-all duration-150 ease-linear flex items-center justify-center z-20"
                    style={{ left: `${(pacman.x / COLS) * 100}%`, top: `${(pacman.y / ROWS) * 100}%` }}
                >
                    <div className="w-1/2 h-1/2 bg-black rounded-full" /> {/* Eye */}
                </div>

            </div>

            {gameCtx.gameState === 'IDLE' && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50">
                    <h1 className="text-3xl font-bold mb-4 text-yellow-400">PAC-MAN</h1>
                    <p className="text-xs blink">INSERT COIN</p>
                </div>
            )}
        </div>
    );
}