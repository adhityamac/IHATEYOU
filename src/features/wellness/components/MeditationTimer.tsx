'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Sparkles, Music } from 'lucide-react';

interface GuidedSession {
    id: string;
    title: string;
    duration: number; // in minutes
    description: string;
    category: 'breathing' | 'body-scan' | 'mindfulness' | 'sleep' | 'stress';
    steps: string[];
}

const GUIDED_SESSIONS: GuidedSession[] = [
    {
        id: '1',
        title: 'Quick Calm',
        duration: 5,
        description: 'A brief breathing exercise to center yourself',
        category: 'breathing',
        steps: [
            'Find a comfortable position and close your eyes',
            'Take a deep breath in through your nose for 4 counts',
            'Hold your breath for 4 counts',
            'Exhale slowly through your mouth for 6 counts',
            'Notice the sensation of your breath',
            'Continue this rhythm at your own pace'
        ]
    },
    {
        id: '2',
        title: 'Body Scan',
        duration: 10,
        description: 'Release tension from head to toe',
        category: 'body-scan',
        steps: [
            'Lie down or sit comfortably',
            'Bring awareness to the top of your head',
            'Notice any tension in your forehead and jaw',
            'Relax your shoulders and let them drop',
            'Feel your chest rise and fall with each breath',
            'Release tension from your stomach',
            'Relax your hips and legs',
            'Feel your feet grounded and relaxed',
            'Take a moment to feel your whole body at peace'
        ]
    },
    {
        id: '3',
        title: 'Mindful Moment',
        duration: 7,
        description: 'Present moment awareness practice',
        category: 'mindfulness',
        steps: [
            'Sit comfortably with your spine straight',
            'Notice five things you can see',
            'Notice four things you can touch',
            'Notice three things you can hear',
            'Notice two things you can smell',
            'Notice one thing you can taste',
            'Return to your breath and the present moment'
        ]
    },
    {
        id: '4',
        title: 'Stress Release',
        duration: 8,
        description: 'Let go of tension and worry',
        category: 'stress',
        steps: [
            'Acknowledge what is causing you stress',
            'Take a deep breath and imagine breathing in calm',
            'As you exhale, visualize releasing the stress',
            'Tense your shoulders, then release',
            'Clench your fists, then release',
            'Notice how your body feels lighter',
            'Repeat: "I release what I cannot control"',
            'Return to natural breathing'
        ]
    },
    {
        id: '5',
        title: 'Sleep Preparation',
        duration: 15,
        description: 'Wind down for restful sleep',
        category: 'sleep',
        steps: [
            'Lie down in a comfortable position',
            'Close your eyes and take three deep breaths',
            'Imagine a warm, golden light above your head',
            'Feel it slowly moving down your body',
            'It relaxes every muscle as it passes',
            'Your body becomes heavy and relaxed',
            'Your mind becomes quiet and peaceful',
            'Allow yourself to drift into sleep'
        ]
    }
];

const AMBIENT_SOUNDS = [
    { id: 'rain', name: 'Rain', emoji: '🌧️' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊' },
    { id: 'forest', name: 'Forest', emoji: '🌲' },
    { id: 'fire', name: 'Fireplace', emoji: '🔥' },
    { id: 'wind', name: 'Wind Chimes', emoji: '🎐' },
];

export default function MeditationTimer() {
    const [mode, setMode] = useState<'timer' | 'guided'>('timer');
    const [duration, setDuration] = useState(10); // minutes
    const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
    const [isActive, setIsActive] = useState(false);
    const [selectedSession, setSelectedSession] = useState<GuidedSession | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [selectedSound, setSelectedSound] = useState(AMBIENT_SOUNDS[0].id);
    const [completedSessions, setCompletedSessions] = useState<string[]>([]);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load completed sessions
    useEffect(() => {
        const saved = localStorage.getItem('completedMeditations');
        if (saved) {
            setCompletedSessions(JSON.parse(saved));
        }
    }, []);

    // Timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft]);

    // Guided session step progression
    useEffect(() => {
        if (mode === 'guided' && isActive && selectedSession) {
            const stepDuration = (selectedSession.duration * 60) / selectedSession.steps.length;
            const stepInterval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < selectedSession.steps.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, stepDuration * 1000);

            return () => clearInterval(stepInterval);
        }
    }, [mode, isActive, selectedSession]);

    const handleComplete = () => {
        setIsActive(false);
        
        if (mode === 'guided' && selectedSession) {
            const newCompleted = [...completedSessions, selectedSession.id];
            setCompletedSessions(newCompleted);
            localStorage.setItem('completedMeditations', JSON.stringify(newCompleted));
        }

        // Play completion sound (if enabled)
        if (soundEnabled) {
            // In a real app, play a bell sound here
            console.log('🔔 Meditation complete!');
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration * 60);
        setCurrentStep(0);
    };

    const startGuidedSession = (session: GuidedSession) => {
        setSelectedSession(session);
        setDuration(session.duration);
        setTimeLeft(session.duration * 60);
        setCurrentStep(0);
        setMode('guided');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="px-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Meditation</h2>
                <p className="text-white/40 text-xs mt-1">Find your center, one breath at a time</p>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 px-6">
                <button
                    onClick={() => { setMode('timer'); resetTimer(); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                        mode === 'timer'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                    <Clock className="w-4 h-4 inline mr-2" />
                    Timer
                </button>
                <button
                    onClick={() => { setMode('guided'); resetTimer(); setSelectedSession(null); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                        mode === 'guided'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Guided
                </button>
            </div>

            {/* Timer Mode */}
            {mode === 'timer' && (
                <div className="px-6 space-y-6">
                    {/* Timer Display */}
                    <div className="relative">
                        <svg className="w-full max-w-xs mx-auto" viewBox="0 0 200 200">
                            {/* Background Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                            />
                            {/* Progress Circle */}
                            <motion.circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 90}`}
                                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                                transform="rotate(-90 100 100)"
                                initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl font-black text-white">{formatTime(timeLeft)}</div>
                                <div className="text-xs text-white/40 mt-2 uppercase tracking-wider">
                                    {isActive ? 'Breathing...' : 'Ready'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Duration Selector */}
                    {!isActive && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-white/60 block">Duration</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[5, 10, 15, 20].map(mins => (
                                    <button
                                        key={mins}
                                        onClick={() => { setDuration(mins); setTimeLeft(mins * 60); }}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all ${
                                            duration === mins
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                        }`}
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={toggleTimer}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold uppercase tracking-wider hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="w-16 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Guided Mode */}
            {mode === 'guided' && (
                <div className="space-y-4">
                    {!selectedSession ? (
                        <div className="px-6 space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Choose a Session</h3>
                            {GUIDED_SESSIONS.map((session, i) => (
                                <motion.button
                                    key={session.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => startGuidedSession(session)}
                                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-white font-bold">{session.title}</h4>
                                            <p className="text-white/60 text-xs mt-1">{session.description}</p>
                                        </div>
                                        {completedSessions.includes(session.id) && (
                                            <div className="text-green-400 text-xl">✓</div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-white/40">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {session.duration} min
                                        </span>
                                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 capitalize">
                                            {session.category}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 space-y-6">
                            {/* Session Info */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                <h3 className="text-xl font-black text-white mb-2">{selectedSession.title}</h3>
                                <p className="text-white/60 text-sm">{selectedSession.description}</p>
                                <div className="mt-4 text-2xl font-black text-white">{formatTime(timeLeft)}</div>
                            </div>

                            {/* Current Step */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 min-h-[120px] flex items-center justify-center"
                                >
                                    <p className="text-white text-center text-lg leading-relaxed">
                                        {selectedSession.steps[currentStep]}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Dots */}
                            <div className="flex justify-center gap-2">
                                {selectedSession.steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            i === currentStep ? 'bg-purple-500 w-8' : i < currentStep ? 'bg-purple-500/50' : 'bg-white/20'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="flex gap-3">
                                <button
                                    onClick={toggleTimer}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold uppercase tracking-wider hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                >
                                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    {isActive ? 'Pause' : 'Start'}
                                </button>
                                <button
                                    onClick={() => { setSelectedSession(null); resetTimer(); }}
                                    className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-bold uppercase"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Ambient Sound Selector */}
            <div className="px-6 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60">Ambient Sound</label>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                    >
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-white/60" /> : <VolumeX className="w-4 h-4 text-white/40" />}
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {AMBIENT_SOUNDS.map(sound => (
                        <button
                            key={sound.id}
                            onClick={() => setSelectedSound(sound.id)}
                            disabled={!soundEnabled}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                                soundEnabled && selectedSound === sound.id
                                    ? 'bg-purple-500/30 border-2 border-purple-500'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            } ${!soundEnabled ? 'opacity-40' : ''}`}
                        >
                            <span className="text-2xl mb-1">{sound.emoji}</span>
                            <span className="text-[10px] text-white/60">{sound.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="mx-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-black text-white">{completedSessions.length}</div>
                        <div className="text-xs text-white/40 mt-1">Sessions Completed</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">
                            {GUIDED_SESSIONS.filter(s => completedSessions.includes(s.id)).reduce((sum, s) => sum + s.duration, 0)}
                        </div>
                        <div className="text-xs text-white/40 mt-1">Minutes Meditated</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
