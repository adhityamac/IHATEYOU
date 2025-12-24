'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, Sprout, Shuffle, Zap, Activity, Cpu, Network, Share2, Globe, Database, Wifi, RefreshCw, Trophy, Flower, Leaf, TreeDeciduous, CloudRain, Sun, Trash2, Coins, Hash, User, Bot } from 'lucide-react';

// --- Game Components ---

interface GameProps {
    onBack: () => void;
    tokens: number;
    onUpdateTokens: (amount: number) => void;
}

const NeuralShuffler = ({ onBack, tokens, onUpdateTokens }: GameProps) => {
    const [cards, setCards] = useState<{ id: number; icon: any; isFlipped: boolean; isMatched: boolean }[]>([]);
    const [moves, setMoves] = useState(0);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [bestScore, setBestScore] = useState<number>(0);

    const ICONS = [BrainCircuit, Zap, Activity, Cpu, Network, Share2, Globe, Database];

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('neural_best');
        if (saved) setBestScore(parseInt(saved));
    }, []);

    const initializeGame = () => {
        const gameIcons = [...ICONS, ...ICONS];
        const shuffled = gameIcons
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({
                id: index,
                icon,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffled);
        setMoves(0);
        setFlippedIndices([]);
        setIsProcessing(false);
        setIsWon(false);
    };

    const handleCardClick = (index: number) => {
        if (isProcessing || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            setMoves((prev) => prev + 1);
            checkForMatch(newFlipped, newCards, moves + 1);
        }
    };

    const checkForMatch = (flipped: number[], currentCards: any[], currentMoves: number) => {
        const [first, second] = flipped;
        if (currentCards[first].icon === currentCards[second].icon) {
            currentCards[first].isMatched = true;
            currentCards[second].isMatched = true;
            setCards(currentCards);
            setFlippedIndices([]);
            setIsProcessing(false);

            if (currentCards.every((card: any) => card.isMatched)) {
                setIsWon(true);
                onUpdateTokens(50); // Reward for winning
                if (bestScore === 0 || currentMoves < bestScore) {
                    setBestScore(currentMoves);
                    localStorage.setItem('neural_best', currentMoves.toString());
                }
            }
        } else {
            setTimeout(() => {
                const resetCards = [...currentCards];
                resetCards[first].isFlipped = false;
                resetCards[second].isFlipped = false;
                setCards(resetCards);
                setFlippedIndices([]);
                setIsProcessing(false);
            }, 1000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-2xl p-8 relative">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-rose-300/60 uppercase tracking-widest font-bold">Moves</span>
                    <span className="text-2xl font-black text-white">{moves}</span>
                    {bestScore > 0 && <span className="text-[10px] text-white/40 uppercase tracking-widest">Best: {bestScore}</span>}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-yellow-400/60 uppercase tracking-widest font-bold flex items-center gap-1"><Coins className="w-3 h-3" /> Tokens</span>
                    <span className="text-2xl font-black text-yellow-400">{tokens}</span>
                </div>
                <button onClick={initializeGame} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                    <RefreshCw className="w-5 h-5 text-white/60" />
                </button>
            </div>

            {isWon ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center z-10"
                >
                    <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                    <h3 className="text-4xl font-black text-white mb-2">Neural Sync!</h3>
                    <p className="text-white/60 mb-8">Sequence matched in {moves} moves.</p>
                    <p className="text-yellow-400 font-bold mb-8 flex items-center gap-2"><Coins className="w-5 h-5" /> +50 Tokens Earned</p>
                    <div className="flex gap-4">
                        <button onClick={initializeGame} className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors">
                            Play Again
                        </button>
                        <button onClick={onBack} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                            Exit
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-4 gap-3 mt-8">
                    {cards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                className="relative w-20 h-20 cursor-pointer"
                                onClick={() => handleCardClick(i)}
                                initial={false}
                                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                                    <BrainCircuit className="w-6 h-6 text-white/10" />
                                </div>
                                <div
                                    className="absolute inset-0 bg-rose-500/20 rounded-xl border border-rose-500/50 flex items-center justify-center"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <Icon className={`w-8 h-8 ${card.isMatched ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'text-white'}`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {!isWon && (
                <button onClick={onBack} className="mt-8 text-sm text-white/40 hover:text-white transition-colors">
                    Back to Menu
                </button>
            )}
        </div>
    );
};

const EchoWeave = ({ onBack, tokens, onUpdateTokens }: GameProps) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [activePad, setActivePad] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerStep, setPlayerStep] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const pads = [
        { id: 0, color: 'cyan', activeClass: 'bg-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.6)]', baseClass: 'bg-cyan-500/20 border-cyan-500/30 hover:bg-cyan-500/30', rotate: 0 },
        { id: 1, color: 'purple', activeClass: 'bg-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.6)]', baseClass: 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30', rotate: 90 },
        { id: 2, color: 'emerald', activeClass: 'bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.6)]', baseClass: 'bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30', rotate: 180 },
        { id: 3, color: 'rose', activeClass: 'bg-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.6)]', baseClass: 'bg-rose-500/20 border-rose-500/30 hover:bg-rose-500/30', rotate: 270 },
    ];

    useEffect(() => {
        const saved = localStorage.getItem('echo_high');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const playSequence = async (seq: number[]) => {
        setIsPlayerTurn(false);
        await new Promise(r => setTimeout(r, 500));

        for (let i = 0; i < seq.length; i++) {
            setActivePad(seq[i]);
            await new Promise(r => setTimeout(r, 400));
            setActivePad(null);
            await new Promise(r => setTimeout(r, 200));
        }
        setIsPlayerTurn(true);
    };

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        const firstStep = Math.floor(Math.random() * 4);
        const newSeq = [firstStep];
        setSequence(newSeq);
        setPlayerStep(0);
        playSequence(newSeq);
    };

    const handlePadClick = (id: number) => {
        if (!isPlayerTurn || gameOver) return;

        setActivePad(id);
        setTimeout(() => setActivePad(null), 200);

        if (id === sequence[playerStep]) {
            if (playerStep === sequence.length - 1) {
                onUpdateTokens(5); // Reward for completing a sequence
                setScore(s => {
                    const newScore = s + 1;
                    if (newScore > highScore) {
                        setHighScore(newScore);
                        localStorage.setItem('echo_high', newScore.toString());
                    }
                    return newScore;
                });
                setPlayerStep(0);
                setIsPlayerTurn(false);
                setTimeout(() => {
                    const nextStep = Math.floor(Math.random() * 4);
                    const newSeq = [...sequence, nextStep];
                    setSequence(newSeq);
                    playSequence(newSeq);
                }, 800);
            } else {
                setPlayerStep(s => s + 1);
            }
        } else {
            setGameOver(true);
            setGameStarted(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-2xl p-8 relative">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-cyan-300/60 uppercase tracking-widest font-bold">Echoes</span>
                    <span className="text-2xl font-black text-white">{score}</span>
                    {highScore > 0 && <span className="text-[10px] text-white/40 uppercase tracking-widest">Best: {highScore}</span>}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-yellow-400/60 uppercase tracking-widest font-bold flex items-center gap-1"><Coins className="w-3 h-3" /> Tokens</span>
                    <span className="text-2xl font-black text-yellow-400">{tokens}</span>
                </div>
                {gameStarted && !gameOver && (
                    <div className="text-xs text-white/40 uppercase tracking-widest animate-pulse">
                        {isPlayerTurn ? "Your Turn" : "Listen..."}
                    </div>
                )}
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute z-10">
                    {!gameStarted && !gameOver && (
                        <button onClick={startGame} className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all group">
                            <Zap className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                    {gameOver && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <span className="text-rose-500 font-black text-xl mb-2">CRASH</span>
                            <button onClick={startGame} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                                Retry
                            </button>
                        </div>
                    )}
                </div>

                {pads.map((pad) => (
                    <button
                        key={pad.id}
                        onClick={() => handlePadClick(pad.id)}
                        className={`absolute w-24 h-24 rounded-2xl transition-all duration-200 border-2
                            ${activePad === pad.id ? pad.activeClass : pad.baseClass}
                        `}
                        style={{
                            transform: `rotate(${pad.rotate}deg) translate(80px) rotate(-${pad.rotate}deg)`,
                        }}
                    />
                ))}

                <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full opacity-20">
                        <circle cx="50%" cy="50%" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-500" />
                        <circle cx="50%" cy="50%" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-white" />
                    </svg>
                </div>
            </div>

            <button onClick={onBack} className="mt-12 text-sm text-white/40 hover:text-white transition-colors">
                Back to Menu
            </button>
        </div>
    );
};


const MindGarden = ({ onBack, tokens, onUpdateTokens }: GameProps) => {
    const [plants, setPlants] = useState<{ id: number; x: number; y: number; type: number; scale: number; rotation: number }[]>([]);
    const [weather, setWeather] = useState<'sunny' | 'rainy'>('sunny');
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const PLANT_ICONS = [Sprout, Flower, Leaf, TreeDeciduous];
    const PLANT_COST = 20;

    useEffect(() => {
        const saved = localStorage.getItem('mind_garden');
        if (saved) {
            try {
                setPlants(JSON.parse(saved));
            } catch (e) { console.error("Failed to load garden", e); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('mind_garden', JSON.stringify(plants));
    }, [plants, isLoaded]);

    const handlePlant = (e: React.MouseEvent) => {
        if (tokens < PLANT_COST) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newPlant = {
            id: Date.now(),
            x,
            y,
            type: Math.floor(Math.random() * PLANT_ICONS.length),
            scale: 0.5 + Math.random() * 1,
            rotation: Math.random() * 30 - 15,
        };

        setPlants([...plants, newPlant]);
        onUpdateTokens(-PLANT_COST);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-2xl p-8 relative overflow-hidden">
            {/* Weather Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {weather === 'rainy' && Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * 100 + '%' }}
                        animate={{ y: '120%' }}
                        transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
                        className="absolute top-0 w-0.5 h-4 bg-blue-400/50"
                    />
                ))}
                {weather === 'sunny' && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -right-20 text-yellow-500/20"
                    >
                        <Sun className="w-64 h-64" />
                    </motion.div>
                )}
            </div>

            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <div className="flex flex-col">
                    <span className="text-xs text-emerald-300/60 uppercase tracking-widest font-bold">Garden</span>
                    <span className="text-2xl font-black text-white">{plants.length} Plants</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-yellow-400/60 uppercase tracking-widest font-bold flex items-center gap-1"><Coins className="w-3 h-3" /> Tokens</span>
                    <span className="text-2xl font-black text-yellow-400">{tokens}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setWeather(prev => prev === 'sunny' ? 'rainy' : 'sunny')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        {weather === 'sunny' ? <CloudRain className="w-5 h-5 text-blue-300" /> : <Sun className="w-5 h-5 text-yellow-300" />}
                    </button>
                    <button onClick={() => setPlants([])} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <Trash2 className="w-5 h-5 text-rose-300" />
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                onClick={handlePlant}
                className="relative w-full max-w-2xl h-96 bg-gradient-to-b from-emerald-900/20 to-emerald-900/40 rounded-3xl border border-white/5 cursor-crosshair overflow-hidden shadow-inner group"
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className={`font-black uppercase tracking-widest text-sm ${tokens >= PLANT_COST ? 'text-white/20' : 'text-red-500/50'}`}>{tokens >= PLANT_COST ? `Click to Plant (-${PLANT_COST})` : 'Not Enough Tokens'}</span>
                </div>

                <AnimatePresence>
                    {plants.map((plant) => {
                        const Icon = PLANT_ICONS[plant.type];
                        return (
                            <motion.div
                                key={plant.id}
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: plant.scale, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute text-emerald-400 drop-shadow-lg"
                                style={{
                                    left: plant.x,
                                    top: plant.y,
                                    transform: `translate(-50%, -50%) rotate(${plant.rotation}deg)`,
                                }}
                            >
                                <Icon className="w-8 h-8" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            <button onClick={onBack} className="mt-8 text-sm text-white/40 hover:text-white transition-colors z-10">
                Back to Menu
            </button>
        </div>
    );
};

const TicTacToe = ({ onBack, tokens, onUpdateTokens }: GameProps) => {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (index: number) => {
        if (board[index] || winner || isDraw || (gameMode === 'ai' && !isXNext && !winner)) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);

        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            if (gameMode === 'ai' && win === 'X') onUpdateTokens(20); // Win vs AI reward
        } else if (!newBoard.includes(null)) {
            setIsDraw(true);
        } else {
            setIsXNext(!isXNext);
        }
    };

    // AI Logic
    useEffect(() => {
        if (gameMode === 'ai' && !isXNext && !winner && !isDraw) {
            setAiThinking(true);
            const timer = setTimeout(() => {
                const makeAiMove = () => {
                    const available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
                    let move = -1;

                    // 1. Try to win
                    for (let i of available) {
                        const temp = [...board];
                        temp[i] = 'O';
                        if (checkWinner(temp) === 'O') { move = i; break; }
                    }

                    // 2. Block player
                    if (move === -1) {
                        for (let i of available) {
                            const temp = [...board];
                            temp[i] = 'X';
                            if (checkWinner(temp) === 'X') { move = i; break; }
                        }
                    }

                    // 3. Take center or random
                    if (move === -1) {
                        if (board[4] === null) move = 4;
                        else move = available[Math.floor(Math.random() * available.length)];
                    }

                    const newBoard = [...board];
                    newBoard[move] = 'O';
                    setBoard(newBoard);

                    const win = checkWinner(newBoard);
                    if (win) setWinner(win);
                    else if (!newBoard.includes(null)) setIsDraw(true);
                    else setIsXNext(true);

                    setAiThinking(false);
                };
                makeAiMove();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, gameMode, winner, isDraw, board]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setIsDraw(false);
    };

    if (!gameMode) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-2xl p-8">
                <h3 className="text-3xl font-bold mb-8 text-violet-300">Select Mode</h3>
                <div className="flex gap-6">
                    <button onClick={() => setGameMode('pvp')} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 group">
                        <div className="p-4 rounded-full bg-violet-500/20 group-hover:bg-violet-500/40 transition-colors"><User className="w-8 h-8 text-violet-300" /></div>
                        <span className="font-bold text-white">Vs Friend</span>
                    </button>
                    <button onClick={() => setGameMode('ai')} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:scale-105 group">
                        <div className="p-4 rounded-full bg-rose-500/20 group-hover:bg-rose-500/40 transition-colors"><Bot className="w-8 h-8 text-rose-300" /></div>
                        <span className="font-bold text-white">Vs AI</span>
                    </button>
                </div>
                <button onClick={onBack} className="mt-12 text-sm text-white/40 hover:text-white transition-colors">Back to Menu</button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-2xl p-8 relative">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-violet-300/60 uppercase tracking-widest font-bold">Turn</span>
                    <span className="text-2xl font-black text-white flex items-center gap-2">
                        {winner ? 'GAME OVER' : (aiThinking ? 'AI Thinking...' : (isXNext ? 'Player X' : 'Player O'))}
                    </span>
                </div>
                <button onClick={() => setGameMode(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5 text-white/60" />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-white/5 p-2 rounded-xl">
                {board.map((cell, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: !cell && !winner ? 1.05 : 1 }}
                        whileTap={{ scale: !cell && !winner ? 0.95 : 1 }}
                        onClick={() => handleClick(i)}
                        className={`w-20 h-20 rounded-lg text-4xl font-black flex items-center justify-center transition-colors
                            ${cell === 'X' ? 'bg-violet-500/20 text-violet-300' : cell === 'O' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 hover:bg-white/10'}
                        `}
                    >
                        {cell && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>{cell}</motion.span>}
                    </motion.button>
                ))}
            </div>

            {(winner || isDraw) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col items-center">
                    <div className="text-xl font-bold text-white mb-4">{winner ? `${winner} Wins!` : "It's a Draw!"}</div>
                    {winner === 'X' && gameMode === 'ai' && <div className="text-yellow-400 text-sm font-bold mb-4 flex items-center gap-1"><Coins className="w-4 h-4" /> +20 Tokens</div>}
                    <button onClick={resetGame} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition-colors">Play Again</button>
                </motion.div>
            )}
        </div>
    );
};

// --- Game Data ---
const games = [
    { id: 'neural-shuffler', name: 'Neural Shuffler', description: 'A classic memory game with a neural twist.', icon: <Shuffle className="w-8 h-8" />, status: 'Play', component: NeuralShuffler, color: 'rose' },
    { id: 'echo-weave', name: 'Echo Weave', description: 'Repeat the sequence of light and sound.', icon: <BrainCircuit className="w-8 h-8" />, status: 'Play', component: EchoWeave, color: 'cyan' },
    { id: 'mind-garden', name: 'Mind Garden', description: 'A calm, generative space to relax.', icon: <Sprout className="w-8 h-8" />, status: 'Play', component: MindGarden, color: 'emerald' },
    { id: 'tic-tac-toe', name: 'Neon Tic-Tac-Toe', description: 'Classic strategy against AI or a friend.', icon: <Hash className="w-8 h-8" />, status: 'Play', component: TicTacToe, color: 'violet' },
];

type GameId = 'neural-shuffler' | 'echo-weave' | 'mind-garden' | null;

const FunZone = ({ onClose }: { onClose: () => void }) => {
    const [activeGame, setActiveGame] = useState<GameId>(null);
    const [tokens, setTokens] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('neural_tokens');
        if (saved) setTokens(parseInt(saved));
    }, []);

    const updateTokens = (amount: number) => {
        setTokens(prev => {
            const newValue = prev + amount;
            localStorage.setItem('neural_tokens', newValue.toString());
            return newValue;
        });
    };

    const renderContent = () => {
        if (activeGame) {
            const game = games.find(g => g.id === activeGame);
            if (game?.component) {
                const GameComponent = game.component;
                return <GameComponent onBack={() => setActiveGame(null)} tokens={tokens} onUpdateTokens={updateTokens} />;
            }
        }

        return (
            <>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-white">Playzone</h2>
                        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-2">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-bold text-yellow-400">{tokens}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-6 h-6 text-white/70" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <motion.div
                            key={game.id}
                            whileHover={{ scale: 1.05 }}
                            className="glass-premium p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer group"
                            onClick={() => game.status === 'Play' && setActiveGame(game.id as GameId)}
                        >
                            <div className={`mb-4 text-${game.color}-400 ${game.status !== 'Play' && 'opacity-30'}`}>{game.icon}</div>
                            <h3 className={`text-xl font-bold mb-2 ${game.status !== 'Play' && 'opacity-30'}`}>{game.name}</h3>
                            <p className={`text-sm text-white/60 mb-4 flex-grow ${game.status !== 'Play' && 'opacity-30'}`}>{game.description}</p>
                            <div
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all bg-${game.color}-500/80 text-white group-hover:bg-${game.color}-500`}
                            >
                                {game.status}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full max-w-4xl max-h-[90vh] p-8 rounded-3xl overflow-y-auto custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 glass-premium opacity-90 border-b border-white/5 pointer-events-auto" />
                <div className="noise-overlay opacity-[0.02] pointer-events-none" />
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeGame || 'menu'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FunZone;