'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Gift } from 'lucide-react';
import { Challenge } from '../data/mockEngagementData';

interface DailyChallengesProps {
    challenges: Challenge[];
    onClaim: (id: string) => void;
}

export default function DailyChallenges({ challenges, onClaim }: DailyChallengesProps) {
    return (
        <div className="flex flex-col gap-4">
            {challenges.map((challenge, i) => (
                <ChallengeCard key={challenge.id} challenge={challenge} index={i} onClaim={onClaim} />
            ))}
        </div>
    );
}

function ChallengeCard({ challenge, index, onClaim }: { challenge: Challenge; index: number; onClaim: (id: string) => void }) {
    const isCompleted = challenge.progress >= challenge.maxProgress;
    const progressPercent = Math.min((challenge.progress / challenge.maxProgress) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
                group relative p-4 rounded-2xl border transition-all overflow-hidden flex items-center gap-4
                ${isCompleted && !challenge.claimed
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }
            `}
        >
            {/* Icon */}
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-xl shrink-0 border border-white/5">
                {challenge.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-white">{challenge.title}</h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${challenge.type === 'daily'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                        {challenge.type}
                    </span>
                </div>

                <p className="text-xs text-white/50 mb-3">{challenge.description}</p>

                {/* Progress */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`}
                        />
                    </div>
                    <span className="text-xs font-mono text-white/40 min-w-[60px] text-right">
                        {challenge.progress}/{challenge.maxProgress}
                    </span>
                </div>
            </div>

            {/* Action / Status */}
            <div className="shrink-0 flex flex-col items-end gap-2 min-w-[80px]">
                <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                    <Gift size={12} />
                    {challenge.reward}
                </div>

                {challenge.claimed ? (
                    <span className="text-xs font-bold text-white/20 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Claimed
                    </span>
                ) : isCompleted ? (
                    <button
                        onClick={() => onClaim(challenge.id)}
                        className="bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors animate-pulse"
                    >
                        Claim
                    </button>
                ) : (
                    <span className="text-xs font-bold text-white/20 flex items-center gap-1">
                        <Clock size={12} /> {challenge.expiresIn}
                    </span>
                )}
            </div>
        </motion.div>
    )
}
