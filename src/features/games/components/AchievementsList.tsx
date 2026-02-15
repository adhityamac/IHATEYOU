'use client';

import { motion } from 'framer-motion';
import { Lock, Check, Medal } from 'lucide-react';
import { Achievement } from '../data/mockEngagementData';

interface AchievementsListProps {
    achievements: Achievement[];
}

export default function AchievementsList({ achievements }: AchievementsListProps) {
    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                    <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                ))}
            </div>
        </div>
    );
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
    const isUnlocked = achievement.progress >= achievement.maxProgress;
    const progressPercent = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-4 rounded-2xl border transition-all overflow-hidden group ${isUnlocked
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                    : 'bg-black/40 border-white/5 grayscale opacity-70'
                }`}
        >
            {/* Background Glow for Rare Items */}
            {isUnlocked && achievement.rarity !== 'common' && (
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none
                ${achievement.rarity === 'legendary' ? 'bg-yellow-500' :
                        achievement.rarity === 'epic' ? 'bg-purple-500' : 'bg-blue-500'
                    }
            `} />
            )}

            <div className="flex gap-4 relative z-10">
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg border relative shrink-0
                ${isUnlocked
                        ? 'bg-gray-800 border-white/10 text-white'
                        : 'bg-black/50 border-white/5 text-white/20'
                    }
            `}>
                    {achievement.icon}
                    {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-[1px]">
                            <Lock size={16} className="text-white/40" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className={`font-bold text-sm truncate ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                            {achievement.title}
                        </h4>
                        {isUnlocked && <Check size={14} className="text-green-500" />}
                    </div>

                    <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
                        {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-white/30 mb-1">
                            <span>{Math.floor(progressPercent)}%</span>
                            <span>{achievement.xpReward} XP</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className={`h-full ${isUnlocked ? 'bg-green-500' : 'bg-white/20'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
