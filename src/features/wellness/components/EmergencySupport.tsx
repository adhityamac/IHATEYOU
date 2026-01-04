'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Phone, MessageCircle, Heart, AlertCircle, Wind, Brain, ExternalLink, X, Shield } from 'lucide-react';

interface Resource {
    id: string;
    name: string;
    description: string;
    phone?: string;
    website?: string;
    available: string;
    category: 'crisis' | 'mental-health' | 'support' | 'wellness';
    icon: any;
    color: string;
}

const RESOURCES: Resource[] = [
    {
        id: '1',
        name: '988 Suicide & Crisis Lifeline',
        description: 'Free, confidential support for people in distress',
        phone: '988',
        website: 'https://988lifeline.org',
        available: '24/7',
        category: 'crisis',
        icon: Phone,
        color: '#ef4444'
    },
    {
        id: '2',
        name: 'Crisis Text Line',
        description: 'Text HOME to 741741 for free crisis counseling',
        phone: '741741',
        website: 'https://www.crisistextline.org',
        available: '24/7',
        category: 'crisis',
        icon: MessageCircle,
        color: '#f59e0b'
    },
    {
        id: '3',
        name: 'SAMHSA National Helpline',
        description: 'Treatment referral and information service',
        phone: '1-800-662-4357',
        website: 'https://www.samhsa.gov/find-help/national-helpline',
        available: '24/7',
        category: 'mental-health',
        icon: Brain,
        color: '#8b5cf6'
    },
    {
        id: '4',
        name: 'NAMI Helpline',
        description: 'Information, referrals, and support',
        phone: '1-800-950-6264',
        website: 'https://www.nami.org/help',
        available: 'Mon-Fri 10am-10pm ET',
        category: 'support',
        icon: Heart,
        color: '#ec4899'
    },
    {
        id: '5',
        name: 'Veterans Crisis Line',
        description: 'Support for veterans and their families',
        phone: '988 (Press 1)',
        website: 'https://www.veteranscrisisline.net',
        available: '24/7',
        category: 'crisis',
        icon: Shield,
        color: '#3b82f6'
    },
    {
        id: '6',
        name: 'The Trevor Project',
        description: 'Crisis support for LGBTQ+ youth',
        phone: '1-866-488-7386',
        website: 'https://www.thetrevorproject.org',
        available: '24/7',
        category: 'crisis',
        icon: Heart,
        color: '#10b981'
    }
];

const QUICK_EXERCISES = [
    {
        id: '1',
        title: '5-4-3-2-1 Grounding',
        description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
        icon: '👁️',
        duration: '2 min'
    },
    {
        id: '2',
        title: 'Box Breathing',
        description: 'Breathe in for 4, hold for 4, out for 4, hold for 4',
        icon: '🫁',
        duration: '3 min'
    },
    {
        id: '3',
        title: 'Progressive Relaxation',
        description: 'Tense and release each muscle group from head to toe',
        icon: '💪',
        duration: '5 min'
    }
];

export default function EmergencySupport() {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'crisis' | 'mental-health' | 'support'>('all');
    const [showBreathingExercise, setShowBreathingExercise] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
    const [breathCount, setBreathCount] = useState(4);

    const filteredResources = selectedCategory === 'all' 
        ? RESOURCES 
        : RESOURCES.filter(r => r.category === selectedCategory);

    // Simple breathing exercise timer
    const startBreathingExercise = () => {
        setShowBreathingExercise(true);
        let phase: typeof breathPhase = 'inhale';
        let count = 4;

        const interval = setInterval(() => {
            count--;
            setBreathCount(count);

            if (count === 0) {
                // Move to next phase
                if (phase === 'inhale') {
                    phase = 'hold1';
                    count = 4;
                } else if (phase === 'hold1') {
                    phase = 'exhale';
                    count = 4;
                } else if (phase === 'exhale') {
                    phase = 'hold2';
                    count = 4;
                } else {
                    phase = 'inhale';
                    count = 4;
                }
                setBreathPhase(phase);
                setBreathCount(count);
            }
        }, 1000);

        // Auto-stop after 3 minutes
        setTimeout(() => {
            clearInterval(interval);
            setShowBreathingExercise(false);
        }, 180000);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="px-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Emergency Support</h2>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                    You're not alone. Help is available 24/7. If you're in crisis, please reach out.
                </p>
            </div>

            {/* Emergency Banner */}
            <div className="mx-6 p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">🆘</div>
                    <div className="flex-1">
                        <h3 className="text-white font-black text-lg mb-2">In Immediate Danger?</h3>
                        <p className="text-white/80 text-sm mb-4">
                            If you or someone else is in immediate danger, call 911 or go to the nearest emergency room.
                        </p>
                        <a
                            href="tel:911"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            Call 911
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Calm Exercises */}
            <div className="px-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-3">Quick Calm Exercises</h3>
                <div className="grid grid-cols-1 gap-3">
                    {QUICK_EXERCISES.map((exercise, i) => (
                        <motion.button
                            key={exercise.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => exercise.id === '2' && startBreathingExercise()}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{exercise.icon}</span>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm">{exercise.title}</h4>
                                    <p className="text-white/60 text-xs mt-1">{exercise.description}</p>
                                </div>
                                <span className="text-xs text-white/40">{exercise.duration}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 px-6 overflow-x-auto">
                {(['all', 'crisis', 'mental-health', 'support'] as const).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                            selectedCategory === cat
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                    >
                        {cat.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Resources List */}
            <div className="space-y-3 px-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Support Resources</h3>
                {filteredResources.map((resource, i) => {
                    const Icon = resource.icon;
                    return (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${resource.color}20`, border: `2px solid ${resource.color}40` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: resource.color }} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold">{resource.name}</h4>
                                    <p className="text-white/60 text-xs mt-1">{resource.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-[10px] font-bold uppercase">
                                            {resource.available}
                                        </span>
                                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                                            {resource.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {resource.phone && (
                                    <a
                                        href={`tel:${resource.phone}`}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call Now
                                    </a>
                                )}
                                {resource.website && (
                                    <a
                                        href={resource.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Safety Plan Reminder */}
            <div className="mx-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Create a Safety Plan
                </h3>
                <p className="text-white/60 text-sm mb-4">
                    Having a plan can help you stay safe during difficult times. Consider writing down:
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Warning signs that a crisis may be developing</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Coping strategies that have helped before</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>People you can reach out to for support</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Professional contacts and emergency numbers</span>
                    </li>
                </ul>
            </div>

            {/* Breathing Exercise Modal */}
            <AnimatePresence>
                {showBreathingExercise && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setShowBreathingExercise(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-white/10 text-center"
                        >
                            <button
                                onClick={() => setShowBreathingExercise(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                            >
                                <X className="w-4 h-4 text-white/60" />
                            </button>

                            <Wind className="w-12 h-12 mx-auto mb-6 text-blue-400" />
                            
                            <motion.div
                                animate={{
                                    scale: breathPhase === 'inhale' || breathPhase === 'exhale' ? [1, 1.2, 1] : 1
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-4 border-blue-500/50 flex items-center justify-center"
                            >
                                <div className="text-4xl font-black text-white">{breathCount}</div>
                            </motion.div>

                            <h3 className="text-2xl font-black uppercase text-white mb-2">
                                {breathPhase === 'inhale' && 'Breathe In'}
                                {breathPhase === 'hold1' && 'Hold'}
                                {breathPhase === 'exhale' && 'Breathe Out'}
                                {breathPhase === 'hold2' && 'Hold'}
                            </h3>
                            <p className="text-white/60 text-sm">
                                Follow the rhythm. Focus on your breath.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
