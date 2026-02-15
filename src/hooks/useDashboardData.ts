import { useState, useEffect } from 'react';

export interface Goal {
    id: number;
    text: string;
    done: boolean;
}

export interface JournalEntry {
    id: number;
    date: string;
    text: string;
}

const DEFAULT_GOALS: Goal[] = [
    { id: 1, text: "Meditate for 10m", done: false },
    { id: 2, text: "Journal thoughts", done: false },
    { id: 3, text: "Drink water", done: false },
];

export function useDashboardData() {
    // State
    const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [moodHistory, setMoodHistory] = useState<{ date: string, mood: string }[]>([]);
    const [hydration, setHydration] = useState(0);
    const [streak, setStreak] = useState(0);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedGoals = localStorage.getItem('mindbloom_goals');
        const savedMood = localStorage.getItem('mindbloom_mood');
        const savedJournal = localStorage.getItem('mindbloom_journal');
        const savedMoodHistory = localStorage.getItem('mindbloom_mood_history');
        const savedHydration = localStorage.getItem('mindbloom_hydration');
        const savedStreak = localStorage.getItem('mindbloom_streak');
        const lastVisit = localStorage.getItem('mindbloom_last_visit');

        if (savedGoals) setGoals(JSON.parse(savedGoals));
        if (savedMood) setCurrentMood(savedMood);
        if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
        if (savedMoodHistory) setMoodHistory(JSON.parse(savedMoodHistory));

        // Hydration Logic: Reset if new day
        const today = new Date().toDateString();
        if (lastVisit !== today) {
            setHydration(0); // Reset daily
            if (lastVisit) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastVisit === yesterday.toDateString()) {
                    setStreak(Number(savedStreak) || 0 + 1);
                } else {
                    setStreak(1); // Reset streak if missed a day
                }
            } else {
                setStreak(1); // First visit
            }
            localStorage.setItem('mindbloom_last_visit', today);
        } else {
            if (savedHydration) setHydration(Number(savedHydration));
            if (savedStreak) setStreak(Number(savedStreak));
        }

    }, []);

    // Save to LocalStorage effects
    useEffect(() => {
        localStorage.setItem('mindbloom_goals', JSON.stringify(goals));
    }, [goals]);

    useEffect(() => {
        if (currentMood) localStorage.setItem('mindbloom_mood', currentMood);
    }, [currentMood]);

    useEffect(() => {
        localStorage.setItem('mindbloom_journal', JSON.stringify(journalEntries));
    }, [journalEntries]);

    useEffect(() => {
        localStorage.setItem('mindbloom_mood_history', JSON.stringify(moodHistory));
    }, [moodHistory]);

    useEffect(() => {
        localStorage.setItem('mindbloom_hydration', String(hydration));
    }, [hydration]);

    useEffect(() => {
        localStorage.setItem('mindbloom_streak', String(streak));
    }, [streak]);

    // Actions
    const toggleGoal = (id: number) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
    };

    const addGoal = (text: string) => {
        const newGoal = { id: Date.now(), text, done: false };
        setGoals(prev => [...prev, newGoal]);
    };

    const deleteGoal = (id: number) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const updateMood = (mood: string) => {
        setCurrentMood(mood);
        const newHistoryItem = { date: new Date().toISOString(), mood };
        setMoodHistory(prev => [...prev, newHistoryItem]);
    };

    const addJournalEntry = (text: string) => {
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            text
        };
        setJournalEntries(prev => [newEntry, ...prev]);
    };

    const updateHydration = (amount: number) => {
        setHydration(prev => Math.max(0, prev + amount));
    };

    return {
        goals,
        currentMood,
        journalEntries,
        moodHistory,
        hydration,
        streak,
        toggleGoal,
        addGoal,
        deleteGoal,
        updateMood,
        addJournalEntry,
        updateHydration
    };
}
