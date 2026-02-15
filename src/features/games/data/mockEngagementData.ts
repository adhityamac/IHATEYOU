import { LucideIcon, Trophy, Zap, Target, Brain, Star, Flame, Crown, Medal } from 'lucide-react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Emoji or Lucide icon name mapping
    category: 'brain' | 'action' | 'social' | 'collection';
    unlockedAt?: Date;
    progress: number;
    maxProgress: number;
    xpReward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
    totalXp: number;
    level: number;
    rank: string;
    gamesPlayed: number;
    winRate: number;
    streakDays: number;
    weeklyActivity: number[]; // Array of 7 numbers (games played per day)
    categoryBreakdown: {
        brain: number;
        action: number;
        creative: number;
        quick: number;
    };
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: 'daily' | 'weekly';
    progress: number;
    maxProgress: number;
    reward: string; // e.g., "500 XP"
    icon: string;
    expiresIn: string; // "12h 30m"
    completed: boolean;
    claimed: boolean;
}

// --- MOCK DATA ---

export const MOCK_USER_STATS: UserStats = {
    totalXp: 15420,
    level: 42,
    rank: "Void Walker",
    gamesPlayed: 342,
    winRate: 68,
    streakDays: 12,
    weeklyActivity: [4, 8, 2, 10, 15, 5, 12], // Mon-Sun
    categoryBreakdown: {
        brain: 45,
        action: 30,
        creative: 15,
        quick: 10,
    },
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'a1',
        title: 'Neon Brain',
        description: 'Win 5 Chess games in a row.',
        icon: '🧠',
        category: 'brain',
        unlockedAt: new Date(),
        progress: 5,
        maxProgress: 5,
        xpReward: 1000,
        rarity: 'rare',
    },
    {
        id: 'a2',
        title: 'Speed Demon',
        description: 'Complete a Quick Play game in under 30s.',
        icon: '⚡',
        category: 'action',
        progress: 25, // seconds (example logic)
        maxProgress: 30,
        xpReward: 500,
        rarity: 'epic',
    },
    {
        id: 'a3',
        title: 'Social Butterfly',
        description: 'Challenge a friend to a duel.',
        icon: '🦋',
        category: 'social',
        progress: 0,
        maxProgress: 1,
        xpReward: 200,
        rarity: 'common',
    },
    {
        id: 'a4',
        title: 'Grandmaster',
        description: 'Reach Level 50.',
        icon: '👑',
        category: 'collection',
        progress: 42,
        maxProgress: 50,
        xpReward: 5000,
        rarity: 'legendary',
    },
    {
        id: 'a5',
        title: 'Void Gazer',
        description: 'Play "Void Popper" for 1 hour total.',
        icon: '👁️',
        category: 'action',
        progress: 45,
        maxProgress: 60,
        xpReward: 750,
        rarity: 'rare',
    },
];

export const MOCK_CHALLENGES: Challenge[] = [
    {
        id: 'c1',
        title: 'Checkmate Master',
        description: 'Win 3 games of Pixel Chess today.',
        type: 'daily',
        progress: 2,
        maxProgress: 3,
        reward: '300 XP',
        icon: '♟️',
        expiresIn: '4h 12m',
        completed: false,
        claimed: false,
    },
    {
        id: 'c2',
        title: 'Ghost Hunter',
        description: 'Eat 100 ghosts in Neon Pac-Man.',
        type: 'daily',
        progress: 100,
        maxProgress: 100,
        reward: 'Token Booster',
        icon: '👻',
        expiresIn: '8h 00m',
        completed: true,
        claimed: false,
    },
    {
        id: 'c3',
        title: 'Trivia God',
        description: 'Answer 50 questions correctly this week.',
        type: 'weekly',
        progress: 12,
        maxProgress: 50,
        reward: 'Rare Avatar',
        icon: '🎓',
        expiresIn: '4d 12h',
        completed: false,
        claimed: false,
    },
];
