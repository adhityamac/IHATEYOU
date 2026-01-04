'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Calendar } from 'lucide-react';

export interface ScoreEntry {
    id: string;
    player: string;
    score: number;
    date: string;
    game: string;
}

interface LeaderboardProps {
    gameId: string;
    refreshTrigger?: number;
    onClose?: () => void;
}

export default function Leaderboard({ gameId, refreshTrigger, onClose }: LeaderboardProps) {
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        const loadScores = () => {
            try {
                const saved = localStorage.getItem('arcade-leaderboard');
                if (saved) {
                    const allScores: ScoreEntry[] = JSON.parse(saved);
                    const gameScores = allScores
                        .filter(s => s.game === gameId)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 10); // Top 10
                    setScores(gameScores);
                }
            } catch {
                console.error('Failed to load scores');
            }
        };

        loadScores();
    }, [gameId, refreshTrigger]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (onClose) onClose();
        };

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic text-white uppercase tracking-wider">Legends</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Top Players</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-wider transition-colors"
                    >
                        Back
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                <AnimatePresence>
                    {scores.length > 0 ? (
                        scores.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl border ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/20' :
                                        index === 1 ? 'bg-white/5 border-white/10' :
                                            index === 2 ? 'bg-orange-500/5 border-orange-500/10' :
                                                'bg-white/[0.02] border-white/5'
                                    }`}
                            >
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${index === 0 ? 'text-yellow-500 bg-yellow-500/20' :
                                        index === 1 ? 'text-gray-300 bg-white/10' :
                                            index === 2 ? 'text-orange-400 bg-orange-500/20' :
                                                'text-white/20 bg-white/5'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${index === 0 ? 'text-yellow-500' : 'text-white'}`}>
                                            {entry.player}
                                        </span>
                                        {index === 0 && <Crown size={12} className="text-yellow-500" />}
                                    </div>
                                    <div className="text-[10px] text-white/30 font-medium flex items-center gap-2">
                                        <Calendar size={10} />
                                        {new Date(entry.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="font-black text-lg text-white tabular-nums tracking-tight">
                                    {entry.score}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Medal className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">No legends yet</p>
                            <p className="text-white/20 text-[10px] mt-1">Be the first to claim victory</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}