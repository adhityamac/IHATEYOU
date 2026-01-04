'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, Play, Check, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { useSignals } from '@/hooks/useSignals';
import TicTacToe from './TicTacToe';
import MemoryGame from './MemoryGame';
import ReactionGame from './ReactionGame';
import AlchemyGame from './AlchemyGame';
import VoidPopperGame from './VoidPopperGame';
import TriviaGame from './TriviaGame';
import ChessGame from './ChessGame';
import PacmanGame from './PacmanGame';

// Massive Movie Database
const MOVIE_DB = [
    { emoji: "👻🚫", title: "Ghostbusters" }, { emoji: "🦁👑", title: "The Lion King" }, { emoji: "🕷️🕸️🦸", title: "Spider-Man" },
    { emoji: "🦖🦕🏝️", title: "Jurassic Park" }, { emoji: "🚢🧊🥶", title: "Titanic" }, { emoji: "👽🚲🌕", title: "E.T." },
    { emoji: "🤡🎈😱", title: "It" }, { emoji: "🍫🏭🎫", title: "Charlie and the Chocolate Factory" }, { emoji: "🐀👨‍🍳🍲", title: "Ratatouille" },
    { emoji: "🐼👊🥋", title: "Kung Fu Panda" }, { emoji: "🚗💨🏁", title: "Cars" }, { emoji: "🧸🤠🚀", title: "Toy Story" },
    { emoji: "🧙‍♂️💍🌋", title: "Lord of the Rings" }, { emoji: "⚡👓🦉", title: "Harry Potter" }, { emoji: "🦇🦸‍♂️🌑", title: "Batman" },
    { emoji: "🐢🍕👊", title: "Teenage Mutant Ninja Turtles" }, { emoji: "🐟🔍🌊", title: "Finding Nemo" }, { emoji: "❄️👸☃️", title: "Frozen" },
    { emoji: "🐜🦸‍♂️🔬", title: "Ant-Man" }, { emoji: "👊😠🤫", title: "Fight Club" }, { emoji: "🕶️💊🐇", title: "The Matrix" },
    { emoji: "🦈🌪️😱", title: "Sharknado" }, { emoji: "🐍✈️🤬", title: "Snakes on a Plane" }, { emoji: "🐺💰📉", title: "The Wolf of Wall Street" },
    { emoji: "🏃🍫🦐", title: "Forrest Gump" }, { emoji: "🚀🌌⚔️", title: "Star Wars" }, { emoji: "🏴‍☠️💎💀", title: "Pirates of the Caribbean" },
    { emoji: "🧛‍♂️❤️🐺", title: "Twilight" }, { emoji: "🧟‍♂️🚆🇰🇷", title: "Train to Busan" }, { emoji: "🏠😱👦", title: "Home Alone" },
    { emoji: "👴🎈🏠", title: "Up" }, { emoji: "🧠💭😊", title: "Inside Out" }, { emoji: "🎸💀🕯️", title: "Coco" },
    { emoji: "😈👗👠", title: "The Devil Wears Prada" }, { emoji: "👠🐶⚖️", title: "Legally Blonde" }, { emoji: "🎤🦁🐨", title: "Sing" },
    { emoji: "👶💼🍼", title: "The Boss Baby" }, { emoji: "🧊🐿️🌰", title: "Ice Age" }, { emoji: "👹🟢🐴", title: "Shrek" },
    { emoji: "🐉🐲 Viking", title: "How to Train Your Dragon" }, { emoji: "👮‍♂️🍩🤪", title: "Police Academy" }, { emoji: "🕵️‍♂️🔍🎻", title: "Sherlock Holmes" },
    { emoji: "👨‍🚀🌑🚀", title: "Apollo 13" }, { emoji: "🥊🐅👁️", title: "Rocky" }, { emoji: "🩸🦈🏖️", title: "Jaws" },
    { emoji: "👻🏠🕯️", title: "Haunted Mansion" }, { emoji: "👽📞📡", title: "Arrival" }, { emoji: "🤖❤️🌱", title: "Wall-E" },
    { emoji: "🕰️🔙🚗", title: "Back to the Future" }, { emoji: "🦍🏙️✈️", title: "King Kong" }, { emoji: "🧛‍♂️🏰🦇", title: "Dracula" },
    { emoji: "🧟‍♂️🧟‍♀️🎢", title: "Zombieland" }, { emoji: "🤠🔫💰", title: "The Good, the Bad and the Ugly" }, { emoji: "🗡️🛡️🏟️", title: "Gladiator" },
    { emoji: "🚢🏴‍☠️👀", title: "Captain Phillips" }, { emoji: "✈️🕶️🏐", title: "Top Gun" }, { emoji: "🏎️🏁🇺🇸", title: "Ford v Ferrari" },
    { emoji: "🏀🐰👽", title: "Space Jam" }, { emoji: "🧜‍♀️🦀🔱", title: "The Little Mermaid" }, { emoji: "🧞‍♂️✨🕌", title: "Aladdin" },
    { emoji: "🦁🦓🦒", title: "Madagascar" }, { emoji: "🐘👂🎪", title: "Dumbo" }, { emoji: "🦌❄️🔥", title: "Bambi" },
    { emoji: "🐕🍝🕯️", title: "Lady and the Tramp" }, { emoji: "🐈🎷🗼", title: "The Aristocats" }, { emoji: "🦊🐰🚔", title: "Zootopia" },
    { emoji: "🐔🏃🥧", title: "Chicken Run" }, { emoji: "🐷🕸️🕷️", title: "Charlotte's Web" }, { emoji: "🐝🍯⚖️", title: "Bee Movie" },
    { emoji: "🐜🦗🎪", title: "A Bug's Life" }, { emoji: "🐠🐡🚿", title: "Shark Tale" }, { emoji: "🐧💃❄️", title: "Happy Feet" },
    { emoji: "🐉🥋🐼", title: "Kung Fu Panda 2" }, { emoji: "👻💍👦", title: "The Sixth Sense" }, { emoji: "🔪🚿🏨", title: "Psycho" },
    { emoji: "🪓🚪🤪", title: "The Shining" }, { emoji: "📼📺📞", title: "The Ring" }, { emoji: "😴🔪🧤", title: "A Nightmare on Elm Street" },
    { emoji: "🎭👻🎼", title: "Phantom of the Opera" }, { emoji: "🎹🕶️🎶", title: "Ray" }, { emoji: "🎤🎸👑", title: "Bohemian Rhapsody" },
    { emoji: "🚀👨‍🚀🌽", title: "Interstellar" }, { emoji: "🥔🚀🔴", title: "The Martian" }, { emoji: "👩‍🚀🌌🛰️", title: "Gravity" },
    { emoji: "🌍🔥🌊", title: "2012" }, { emoji: "🌪️🐄🚜", title: "Twister" }, { emoji: "🌋🦖🦕", title: "The Land Before Time" },
    { emoji: "🐯🚣🌊", title: "Life of Pi" }, { emoji: "🐻🍯🎈", title: "Winnie the Pooh" }, { emoji: "🐯🐻🐍", title: "The Jungle Book" },
    { emoji: "🐒🍌🧢", title: "Curious George" }, { emoji: "🐕1️⃣0️⃣1️⃣", title: "101 Dalmatians" }, { emoji: "👠👠🌪️", title: "The Wizard of Oz" },
    { emoji: "🦁🌬️🚪", title: "The Lion, the Witch and the Wardrobe" }, { emoji: "🍫🎫🎩", title: "Willy Wonka" }, { emoji: "🏭🏭🚪", title: "Monsters Inc" },
    { emoji: "👢🐍⚔️", title: "Puss in Boots" }, { emoji: "🧚‍♀️✨🔨", title: "Tinker Bell" }, { emoji: "👸🍎☠️", title: "Snow White" },
    { emoji: "👸👠🕛", title: "Cinderella" }, { emoji: "👸🌹🦁", title: "Beauty and the Beast" }, { emoji: "👸💤🏰", title: "Sleeping Beauty" },
    { emoji: "👸💇‍♀️🦎", title: "Tangled" }, { emoji: "👸🏹🐻", title: "Brave" }, { emoji: "👸🌊🐔", title: "Moana" },
    { emoji: "👸🏾🐸🎺", title: "The Princess and the Frog" }, { emoji: "👸🐯🧞‍♂️", title: "Jasmine" }, { emoji: "👸🐉🗡️", title: "Mulan" },
    { emoji: "👸🍂🛶", title: "Pocahontas" }
];

const GAMES = [
    { id: 'movie', name: 'Emoji Movie', icon: '🎬', color: 'from-purple-500 to-blue-500', desc: 'Guess the film' },
    { id: 'chess', name: 'Quantum Chess', icon: '♟️', color: 'from-orange-500 to-amber-500', desc: 'Strategic warfare' },
    { id: 'pacman', name: 'Neon Pac-Man', icon: '👻', color: 'from-yellow-400 to-orange-500', desc: 'Arcade classic' },
    { id: 'alchemy', name: 'Mood Alchemy', icon: '⚗️', color: 'from-pink-500 to-rose-500', desc: 'Mix emotions' },
    { id: 'popper', name: 'Void Popper', icon: '👻', color: 'from-gray-500 to-slate-500', desc: 'Clear thoughts' },
    { id: 'trivia', name: 'Cosmic Trivia', icon: '🧠', color: 'from-emerald-500 to-teal-500', desc: 'Test knowledge' },
    { id: 'rhythm', name: 'Neon Rhythm', icon: '🎵', color: 'from-orange-500 to-red-500', desc: 'Tap to beat' },
    { id: 'memory', name: 'Mind Match', icon: '🧩', color: 'from-cyan-500 to-blue-500', desc: 'Memory training' },
    { id: 'word', name: 'Word Vortex', icon: '🌪️', color: 'from-violet-500 to-purple-500', desc: 'Unscramble' },
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: '🎲', color: 'from-yellow-500 to-orange-500', desc: 'Classic game' },
];

interface FunZoneProps {
    onClose: () => void;
}

export default function FunZone({ onClose }: FunZoneProps) {
    const [gameMode, setGameMode] = useState<string | null>(null);
    const { trackTool, trackInteraction } = useSignals('user-1'); // Fixed ID for demo
    const [score, setScore] = useState(0);

    // Movie Game State
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const checkGuess = () => {
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = normalize(MOVIE_DB[currentMovieIndex].title);
        const userGuess = normalize(guess);

        if (userGuess && (target.includes(userGuess) || userGuess.includes(target)) && userGuess.length > 3) {
            setScore(s => s + 10);
            setFeedback('correct');
            setTimeout(() => {
                setFeedback(null);
                setGuess('');
                setCurrentMovieIndex(prev => (prev + 1) % MOVIE_DB.length);
            }, 1000);
        } else {
            setFeedback('wrong');
            setShowAnswer(true);
            setTimeout(() => {
                setFeedback(null);
                setShowAnswer(false);
                setGuess('');
                setCurrentMovieIndex(prev => (prev + 1) % MOVIE_DB.length);
            }, 2500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-3xl flex flex-col"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                        <Gamepad2 size={24} />
                    </div>
                    <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Fun Zone</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 font-mono font-bold text-white">
                        SCORE: {score}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-40">
                {!gameMode ? (
                    <div className="p-6">
                        <h2 className="text-white/40 font-bold uppercase tracking-widest mb-6">Select a Game</h2>

                        {/* Vertical Stack Container */}
                        <div className="flex flex-col gap-4">
                            {GAMES.map(game => (
                                <button
                                    key={game.id}
                                    onClick={() => {
                                        setGameMode(game.id);
                                        trackTool(`game_${game.id}`, 0);
                                    }}
                                    className="w-full relative group flex items-center gap-6 p-4 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all text-left overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                    <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform`}>
                                        {game.icon}
                                    </div>

                                    <div className="relative z-10 flex-1">
                                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">{game.name}</h3>
                                        <p className="text-white/50 font-bold text-xs uppercase tracking-widest">{game.desc}</p>
                                    </div>

                                    <div className="relative z-10 pr-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <ChevronRight size={24} className="text-white" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-8 rounded-[40px] bg-white/[0.03] border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-2">Daily Challenge</h3>
                            <p className="text-white/50 mb-6">Complete 3 games to unlock the "Arcade Master" badge.</p>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-yellow-500" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col relative">
                        {/* Swipe Back Handler Container */}
                        <AnimatePresence>
                            <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={{ right: 0.2 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    // Swipe Right Threshold
                                    if (offset.x > 100 || (offset.x > 50 && velocity.x > 500)) {
                                        setGameMode(null);
                                    }
                                }}
                                className="flex-1 flex flex-col h-full bg-black"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                {/* Visual Handle for 'Swipe Back' hint (optional, or just rely on standard UX) */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-32 bg-gradient-to-r from-white/10 to-transparent z-50 pointer-events-none opacity-0 transition-opacity" />

                                <div className="p-6 max-w-2xl mx-auto w-full h-full flex flex-col relative overflow-y-auto">
                                    <button onClick={() => setGameMode(null)} className="self-start mb-6 text-white/40 hover:text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                        <ChevronRight className="rotate-180" size={14} /> Back
                                    </button>

                                    {/* --- Game Rendering --- */}

                                    {gameMode === 'movie' && (
                                        <div className="flex-1 flex flex-col items-center justify-center">
                                            <div className="w-full aspect-square max-w-[300px] bg-white/[0.03] rounded-[40px] border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden">
                                                <div className="text-8xl select-none animate-bounce-slow">
                                                    {MOVIE_DB[currentMovieIndex].emoji}
                                                </div>

                                                <AnimatePresence>
                                                    {feedback && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                                                        >
                                                            {feedback === 'correct' ? (
                                                                <Check size={80} className="text-green-400 mb-4" />
                                                            ) : (
                                                                <X size={80} className="text-red-400 mb-4" />
                                                            )}
                                                            {showAnswer && (
                                                                <motion.div
                                                                    initial={{ y: 20, opacity: 0 }}
                                                                    animate={{ y: 0, opacity: 1 }}
                                                                    className="text-center px-4"
                                                                >
                                                                    <div className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">The answer was</div>
                                                                    <div className="text-2xl font-black text-white italic">{MOVIE_DB[currentMovieIndex].title}</div>
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className="w-full max-w-xs relative">
                                                <input
                                                    value={guess}
                                                    onChange={(e) => setGuess(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                                                    placeholder="Guess the movie..."
                                                    disabled={feedback !== null}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:border-white/40 focus:bg-black/40 transition-all disabled:opacity-50"
                                                />
                                                <button
                                                    onClick={checkGuess}
                                                    disabled={feedback !== null}
                                                    className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-xl flex items-center justify-center hover:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                                >
                                                    <Play size={20} fill="currentColor" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {gameMode === 'chess' && (
                                        <div className="flex-1 flex flex-col h-full" onPointerDown={(e) => e.stopPropagation()}>
                                            {/* Stop propagation so board interactions don't trigger swipe easily? 
                                                Actually, vertical scroll or board moves are distinct. 
                                                Horizontal board moves MIGHT conflict. 
                                                We'll leave simple drag wrapper for now. 
                                            */}
                                            <ChessGame
                                                onBack={() => setGameMode(null)}
                                            />
                                        </div>
                                    )}

                                    {gameMode === 'pacman' && (
                                        <div className="flex-1 flex flex-col h-full" onPointerDown={(e) => e.stopPropagation()}>
                                            {/* Pacman needs swipes. Let's rely on the Back button there or very distinct edge swipe if we can.
                                                For now, let's stop propagation on the game container so dragging PACMAN doesn't drag the SCREEN.
                                            */}
                                            <PacmanGame
                                                onBack={() => setGameMode(null)}
                                                tokens={score}
                                                onUpdateTokens={(amount) => setScore(s => s + amount)}
                                            />
                                        </div>
                                    )}

                                    {gameMode === 'tictactoe' && (
                                        <TicTacToe />
                                    )}

                                    {gameMode === 'memory' && (
                                        <MemoryGame />
                                    )}

                                    {gameMode === 'rhythm' && (
                                        <ReactionGame />
                                    )}

                                    {gameMode === 'alchemy' && (
                                        <AlchemyGame />
                                    )}

                                    {gameMode === 'popper' && (
                                        <VoidPopperGame />
                                    )}

                                    {gameMode === 'trivia' && (
                                        <TriviaGame />
                                    )}

                                    {/* Placeholder for other games */}
                                    {gameMode !== 'movie' && gameMode !== 'chess' && gameMode !== 'pacman' && gameMode !== 'tictactoe' && gameMode !== 'memory' && gameMode !== 'rhythm' && gameMode !== 'alchemy' && gameMode !== 'popper' && gameMode !== 'trivia' && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <div className="text-6xl mb-6">🚧</div>
                                            <h2 className="text-3xl font-black text-white italic mb-2">Under Construction</h2>
                                            <p className="text-white/50">This zone is being built by the digital architects.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
