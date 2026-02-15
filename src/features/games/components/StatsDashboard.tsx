'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Target, Zap, Activity } from 'lucide-react';
import { UserStats } from '../data/mockEngagementData';

interface StatsDashboardProps {
    stats: UserStats;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
    const maxActivity = Math.max(...stats.weeklyActivity);
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="w-full h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            {/* 1. Top Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total XP"
                    value={stats.totalXp.toLocaleString()}
                    icon={<Zap className="text-yellow-400" />}
                    gradient="from-yellow-500/20 to-orange-500/20"
                />
                <StatCard
                    label="Games Played"
                    value={stats.gamesPlayed}
                    icon={<GamepadIcon className="text-purple-400" />}
                    gradient="from-purple-500/20 to-pink-500/20"
                />
                <StatCard
                    label="Win Rate"
                    value={`${stats.winRate}%`}
                    icon={<TrendingUp className="text-green-400" />}
                    gradient="from-green-500/20 to-emerald-500/20"
                />
                <StatCard
                    label="Day Streak"
                    value={stats.streakDays}
                    icon={<Target className="text-red-400" />}
                    gradient="from-red-500/20 to-rose-500/20"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 2. Activity Chart */}
                <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <Activity className="text-blue-400" size={18} />
                            Weekly Activity
                        </h3>
                        <span className="text-xs text-white/40 uppercase tracking-wider">Last 7 Days</span>
                    </div>

                    <div className="flex items-end justify-between h-40 gap-2">
                        {stats.weeklyActivity.map((count, i) => {
                            const heightPercent = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full relative h-full flex items-end justify-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${heightPercent}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="w-full max-w-[30px] bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity relative"
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                                                {count} Games
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-xs font-bold text-white/30">{days[i]}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 3. Category Breakdown */}
                <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                    <h3 className="font-bold flex items-center gap-2 mb-6">
                        <Trophy className="text-orange-400" size={18} />
                        Mastery
                    </h3>

                    <div className="flex-1 flex flex-col justify-center gap-4">
                        <SkillBar label="Brain" value={stats.categoryBreakdown.brain} color="bg-purple-500" />
                        <SkillBar label="Action" value={stats.categoryBreakdown.action} color="bg-rose-500" />
                        <SkillBar label="Creative" value={stats.categoryBreakdown.creative} color="bg-cyan-500" />
                        <SkillBar label="Quick" value={stats.categoryBreakdown.quick} color="bg-green-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    gradient: string;
}

function StatCard({ label, value, icon, gradient }: StatCardProps) {
    return (
        <div className={`bg-gradient-to-br ${gradient} border border-white/10 p-4 rounded-xl flex flex-col`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{label}</span>
                {icon}
            </div>
            <span className="text-2xl font-black">{value}</span>
        </div>
    )
}

function GamepadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  {...props}><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" /></svg>
    )
}

interface SkillBarProps {
    label: string;
    value: number;
    color: string;
}

function SkillBar({ label, value, color }: SkillBarProps) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{label}</span>
                <span className="font-bold">{value}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, type: "spring" }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    )
}
