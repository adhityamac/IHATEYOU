'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Users, Target, Calendar, Check, Plus, Flame, Star, Award, TrendingUp } from 'lucide-react';

interface Challenge {
    id: string;
    title: string;
    description: string;
    category: 'mindfulness' | 'fitness' | 'social' | 'creativity' | 'learning';
    duration: number; // days
    goal: number;
    participants: number;
    reward: string;
    icon: string;
    color: string;
    startDate: string;
    endDate: string;
}

interface UserChallenge extends Challenge {
    progress: number;
    joined: boolean;
    completedDays: string[];
}

const CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: '7-Day Meditation Streak',
        description: 'Meditate for at least 5 minutes every day for a week',
        category: 'mindfulness',
        duration: 7,
        goal: 7,
        participants: 1247,
        reward: '🏆 Zen Master Badge',
        icon: '🧘',
        color: '#a78bfa',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '2',
        title: '30-Day Gratitude Journal',
        description: 'Write down 3 things you\'re grateful for each day',
        category: 'mindfulness',
        duration: 30,
        goal: 30,
        participants: 892,
        reward: '✨ Gratitude Guru Badge',
        icon: '📝',
        color: '#f472b6',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '3',
        title: '10K Steps Daily',
        description: 'Walk at least 10,000 steps every day for 2 weeks',
        category: 'fitness',
        duration: 14,
        goal: 14,
        participants: 2341,
        reward: '👟 Step Champion Badge',
        icon: '🚶',
        color: '#4ade80',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '4',
        title: 'Connect with 5 Friends',
        description: 'Have meaningful conversations with 5 different people',
        category: 'social',
        duration: 7,
        goal: 5,
        participants: 567,
        reward: '💬 Social Butterfly Badge',
        icon: '👥',
        color: '#60a5fa',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '5',
        title: 'Creative Expression Week',
        description: 'Create something artistic every day for a week',
        category: 'creativity',
        duration: 7,
        goal: 7,
        participants: 423,
        reward: '🎨 Creative Soul Badge',
        icon: '🎨',
        color: '#fb923c',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '6',
        title: 'Learn Something New',
        description: 'Spend 30 minutes learning a new skill for 21 days',
        category: 'learning',
        duration: 21,
        goal: 21,
        participants: 1089,
        reward: '📚 Knowledge Seeker Badge',
        icon: '🧠',
        color: '#facc15',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export default function WellnessChallenges() {
    const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'available'>('all');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Load user challenges from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('userChallenges');
        if (saved) {
            setUserChallenges(JSON.parse(saved));
        } else {
            // Initialize with all challenges as not joined
            const initialized = CHALLENGES.map(c => ({
                ...c,
                progress: 0,
                joined: false,
                completedDays: []
            }));
            setUserChallenges(initialized);
        }
    }, []);

    // Save user challenges to localStorage
    useEffect(() => {
        if (userChallenges.length > 0) {
            localStorage.setItem('userChallenges', JSON.stringify(userChallenges));
        }
    }, [userChallenges]);

    const joinChallenge = (challengeId: string) => {
        setUserChallenges(prev => prev.map(c => 
            c.id === challengeId ? { ...c, joined: true } : c
        ));
    };

    const leaveChallenge = (challengeId: string) => {
        setUserChallenges(prev => prev.map(c => 
            c.id === challengeId ? { ...c, joined: false, progress: 0, completedDays: [] } : c
        ));
    };

    const markDayComplete = (challengeId: string) => {
        const today = new Date().toISOString().split('T')[0];
        
        setUserChallenges(prev => prev.map(challenge => {
            if (challenge.id !== challengeId) return challenge;

            const alreadyCompleted = challenge.completedDays.includes(today);
            if (alreadyCompleted) return challenge;

            const newCompletedDays = [...challenge.completedDays, today];
            const newProgress = Math.min((newCompletedDays.length / challenge.goal) * 100, 100);

            return {
                ...challenge,
                completedDays: newCompletedDays,
                progress: newProgress
            };
        }));
    };

    const filteredChallenges = userChallenges.filter(c => {
        if (filter === 'active') return c.joined;
        if (filter === 'available') return !c.joined;
        return true;
    });

    const activeChallenges = userChallenges.filter(c => c.joined);
    const completedChallenges = userChallenges.filter(c => c.progress === 100);

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="px-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Wellness Challenges</h2>
                <p className="text-white/40 text-xs mt-1">Join the community, grow together</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 px-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-black text-white">{activeChallenges.length}</div>
                    <div className="text-xs text-white/40 mt-1">Active</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-black text-white">{completedChallenges.length}</div>
                    <div className="text-xs text-white/40 mt-1">Completed</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-black text-white">
                        {activeChallenges.reduce((sum, c) => sum + Math.round(c.progress), 0)}
                    </div>
                    <div className="text-xs text-white/40 mt-1">Total XP</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 px-6">
                {(['all', 'active', 'available'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            filter === f
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Challenges List */}
            <div className="space-y-3 px-6">
                {filteredChallenges.map((challenge, i) => {
                    const today = new Date().toISOString().split('T')[0];
                    const completedToday = challenge.completedDays.includes(today);
                    const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                    return (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: `${challenge.color}20`, border: `2px solid ${challenge.color}40` }}
                                >
                                    {challenge.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{challenge.title}</h3>
                                    <p className="text-white/60 text-xs mt-1">{challenge.description}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-xs text-white/60">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{challenge.participants.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{challenge.duration} days</span>
                                </div>
                                {challenge.joined && (
                                    <div className="flex items-center gap-1 text-orange-400">
                                        <Flame className="w-3 h-3" />
                                        <span>{daysLeft} days left</span>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar (if joined) */}
                            {challenge.joined && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-white/60">Progress</span>
                                        <span className="text-xs font-bold text-white">{Math.round(challenge.progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${challenge.progress}%` }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: challenge.color }}
                                        />
                                    </div>
                                    <div className="text-xs text-white/40 mt-1">
                                        {challenge.completedDays.length} / {challenge.goal} completed
                                    </div>
                                </div>
                            )}

                            {/* Reward */}
                            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-bold text-yellow-300">{challenge.reward}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {!challenge.joined ? (
                                    <button
                                        onClick={() => joinChallenge(challenge.id)}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
                                    >
                                        <Plus className="w-4 h-4 inline mr-2" />
                                        Join Challenge
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => markDayComplete(challenge.id)}
                                            disabled={completedToday}
                                            className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                                                completedToday
                                                    ? 'bg-green-500/20 border border-green-500/30 text-green-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105'
                                            }`}
                                        >
                                            {completedToday ? (
                                                <>
                                                    <Check className="w-4 h-4 inline mr-2" />
                                                    Completed Today
                                                </>
                                            ) : (
                                                'Mark Complete'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => leaveChallenge(challenge.id)}
                                            className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-sm uppercase hover:bg-red-500/30 transition-all"
                                        >
                                            Leave
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Leaderboard Button */}
            <div className="px-6">
                <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-white font-bold uppercase tracking-wider hover:from-yellow-500/30 hover:to-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    View Leaderboard
                </button>
            </div>

            {/* Leaderboard Modal */}
            <AnimatePresence>
                {showLeaderboard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setShowLeaderboard(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-white/10 max-h-[80vh] overflow-y-auto"
                        >
                            <h3 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                                Leaderboard
                            </h3>

                            <div className="space-y-3">
                                {[
                                    { rank: 1, name: 'MindfulSoul', points: 2847, avatar: '🧘' },
                                    { rank: 2, name: 'ZenMaster', points: 2654, avatar: '🌟' },
                                    { rank: 3, name: 'PeacefulHeart', points: 2431, avatar: '💫' },
                                    { rank: 4, name: 'CalmVibes', points: 2198, avatar: '🌊' },
                                    { rank: 5, name: 'InnerLight', points: 2087, avatar: '✨' },
                                    { rank: 6, name: 'You', points: 1856, avatar: '👤', isUser: true },
                                    { rank: 7, name: 'HappyPath', points: 1743, avatar: '🌈' },
                                    { rank: 8, name: 'SoulSeeker', points: 1621, avatar: '🔮' },
                                ].map((user, i) => (
                                    <motion.div
                                        key={user.rank}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`flex items-center gap-4 p-4 rounded-xl ${
                                            user.isUser
                                                ? 'bg-purple-500/20 border-2 border-purple-500'
                                                : 'bg-white/5 border border-white/10'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                                            user.rank === 1 ? 'bg-yellow-500 text-black' :
                                            user.rank === 2 ? 'bg-gray-400 text-black' :
                                            user.rank === 3 ? 'bg-orange-600 text-white' :
                                            'bg-white/10 text-white/60'
                                        }`}>
                                            {user.rank}
                                        </div>
                                        <div className="text-2xl">{user.avatar}</div>
                                        <div className="flex-1">
                                            <div className="text-white font-bold">{user.name}</div>
                                            <div className="text-white/40 text-xs">{user.points.toLocaleString()} XP</div>
                                        </div>
                                        {user.rank <= 3 && (
                                            <Trophy className={`w-5 h-5 ${
                                                user.rank === 1 ? 'text-yellow-400' :
                                                user.rank === 2 ? 'text-gray-400' :
                                                'text-orange-600'
                                            }`} />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
