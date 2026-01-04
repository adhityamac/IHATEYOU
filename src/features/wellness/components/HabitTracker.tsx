'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, Check, Flame, Trophy, Target, Edit3, Trash2, X, Calendar } from 'lucide-react';

interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    frequency: 'daily' | 'weekly';
    completedDates: string[];
    createdAt: string;
    streak: number;
    bestStreak: number;
}

const HABIT_ICONS = ['💪', '📚', '🧘', '💧', '🏃', '🎨', '🎵', '🌱', '✍️', '🧠', '❤️', '🌟'];
const HABIT_COLORS = ['#f472b6', '#4ade80', '#a78bfa', '#fb7185', '#facc15', '#fb923c', '#60a5fa', '#34d399'];

export default function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [newHabitName, setNewHabitName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
    const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
    const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>('daily');

    // Load habits from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('habits');
        if (saved) {
            const loadedHabits = JSON.parse(saved);
            // Calculate streaks
            const habitsWithStreaks = loadedHabits.map((h: Habit) => ({
                ...h,
                streak: calculateStreak(h.completedDates),
            }));
            setHabits(habitsWithStreaks);
        }
    }, []);

    // Save habits to localStorage
    useEffect(() => {
        if (habits.length > 0) {
            localStorage.setItem('habits', JSON.stringify(habits));
        }
    }, [habits]);

    const calculateStreak = (completedDates: string[]): number => {
        if (completedDates.length === 0) return 0;
        
        const sortedDates = completedDates.sort().reverse();
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            const expected = expectedDate.toISOString().split('T')[0];
            
            if (sortedDates[i] === expected) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const addHabit = () => {
        if (!newHabitName.trim()) return;

        const newHabit: Habit = {
            id: Date.now().toString(),
            name: newHabitName,
            icon: selectedIcon,
            color: selectedColor,
            frequency: selectedFrequency,
            completedDates: [],
            createdAt: new Date().toISOString(),
            streak: 0,
            bestStreak: 0,
        };

        setHabits([...habits, newHabit]);
        resetModal();
    };

    const updateHabit = () => {
        if (!editingHabit || !newHabitName.trim()) return;

        setHabits(habits.map(h => 
            h.id === editingHabit.id 
                ? { ...h, name: newHabitName, icon: selectedIcon, color: selectedColor, frequency: selectedFrequency }
                : h
        ));
        resetModal();
    };

    const deleteHabit = (id: string) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const toggleHabitCompletion = (habitId: string) => {
        const today = new Date().toISOString().split('T')[0];
        
        setHabits(habits.map(habit => {
            if (habit.id !== habitId) return habit;

            const isCompleted = habit.completedDates.includes(today);
            const newCompletedDates = isCompleted
                ? habit.completedDates.filter(d => d !== today)
                : [...habit.completedDates, today];

            const newStreak = calculateStreak(newCompletedDates);
            const newBestStreak = Math.max(habit.bestStreak, newStreak);

            return {
                ...habit,
                completedDates: newCompletedDates,
                streak: newStreak,
                bestStreak: newBestStreak,
            };
        }));
    };

    const resetModal = () => {
        setShowAddModal(false);
        setEditingHabit(null);
        setNewHabitName('');
        setSelectedIcon(HABIT_ICONS[0]);
        setSelectedColor(HABIT_COLORS[0]);
        setSelectedFrequency('daily');
    };

    const openEditModal = (habit: Habit) => {
        setEditingHabit(habit);
        setNewHabitName(habit.name);
        setSelectedIcon(habit.icon);
        setSelectedColor(habit.color);
        setSelectedFrequency(habit.frequency);
        setShowAddModal(true);
    };

    const getTodayCompletion = () => {
        const today = new Date().toISOString().split('T')[0];
        const completed = habits.filter(h => h.completedDates.includes(today)).length;
        return { completed, total: habits.length };
    };

    const todayStats = getTodayCompletion();

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Habit Tracker</h2>
                    <p className="text-white/40 text-xs mt-1">Build consistency, one day at a time</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Today's Progress */}
            <div className="mx-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Today's Progress</h3>
                        <p className="text-2xl font-black text-white mt-1">
                            {todayStats.completed} / {todayStats.total}
                        </p>
                    </div>
                    <div className="text-4xl">{todayStats.completed === todayStats.total && todayStats.total > 0 ? '🎉' : '🎯'}</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${todayStats.total > 0 ? (todayStats.completed / todayStats.total) * 100 : 0}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                </div>
            </div>

            {/* Habits List */}
            <div className="space-y-3 px-6">
                {habits.length === 0 ? (
                    <div className="text-center py-12">
                        <Target className="w-16 h-16 mx-auto mb-4 text-white/20" />
                        <p className="text-white/40 text-sm">No habits yet. Create your first one!</p>
                    </div>
                ) : (
                    habits.map((habit, index) => {
                        const today = new Date().toISOString().split('T')[0];
                        const isCompletedToday = habit.completedDates.includes(today);

                        return (
                            <motion.div
                                key={habit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Completion Button */}
                                    <button
                                        onClick={() => toggleHabitCompletion(habit.id)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                            isCompletedToday
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 scale-110'
                                                : 'bg-white/10 border-2 border-white/20 hover:border-white/40'
                                        }`}
                                    >
                                        {isCompletedToday ? (
                                            <Check className="w-6 h-6 text-white" />
                                        ) : (
                                            <span className="text-2xl">{habit.icon}</span>
                                        )}
                                    </button>

                                    {/* Habit Info */}
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold">{habit.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1 text-xs text-white/60">
                                                <Flame className="w-3 h-3 text-orange-400" />
                                                <span>{habit.streak} day streak</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-white/60">
                                                <Trophy className="w-3 h-3 text-yellow-400" />
                                                <span>Best: {habit.bestStreak}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(habit)}
                                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                                        >
                                            <Edit3 className="w-4 h-4 text-white/60" />
                                        </button>
                                        <button
                                            onClick={() => deleteHabit(habit.id)}
                                            className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500/30 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Mini Calendar (Last 7 days) */}
                                <div className="flex gap-1 mt-4">
                                    {Array.from({ length: 7 }).map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() - (6 - i));
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isCompleted = habit.completedDates.includes(dateStr);

                                        return (
                                            <div
                                                key={i}
                                                className={`flex-1 h-2 rounded-full transition-all ${
                                                    isCompleted ? 'bg-green-500' : 'bg-white/10'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={resetModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black uppercase text-white">
                                    {editingHabit ? 'Edit Habit' : 'New Habit'}
                                </h3>
                                <button onClick={resetModal} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
                                    <X className="w-4 h-4 text-white/60" />
                                </button>
                            </div>

                            {/* Habit Name */}
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                placeholder="Habit name..."
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 mb-4"
                            />

                            {/* Icon Selector */}
                            <div className="mb-4">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2 block">Icon</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {HABIT_ICONS.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setSelectedIcon(icon)}
                                            className={`w-full aspect-square rounded-lg flex items-center justify-center text-2xl transition-all ${
                                                selectedIcon === icon
                                                    ? 'bg-purple-500/30 border-2 border-purple-500 scale-110'
                                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div className="mb-4">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2 block">Color</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {HABIT_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-full aspect-square rounded-lg transition-all ${
                                                selectedColor === color ? 'scale-110 ring-2 ring-white' : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Frequency */}
                            <div className="mb-6">
                                <label className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2 block">Frequency</label>
                                <div className="flex gap-2">
                                    {(['daily', 'weekly'] as const).map(freq => (
                                        <button
                                            key={freq}
                                            onClick={() => setSelectedFrequency(freq)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                                selectedFrequency === freq
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                        >
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={editingHabit ? updateHabit : addHabit}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                            >
                                {editingHabit ? 'Update Habit' : 'Create Habit'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
