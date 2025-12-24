'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import EmojiDoodleBackground from '@/components/backgrounds/EmojiDoodleBackground';
import { MOOD_OPTIONS, INTENT_OPTIONS } from '@/data/mockData';

interface OnboardingData {
    name: string;
    moodBaseline: string;
    intent: string[];
}

interface OnboardingFlowProps {
    onComplete: (data: OnboardingData) => void;
    userName?: string;
}

export default function OnboardingFlow({ onComplete, userName = '' }: OnboardingFlowProps) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>({
        name: userName,
        moodBaseline: '',
        intent: [],
    });

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            onComplete(data);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 0: return true; // Welcome screen
            case 1: return data.name.trim().length > 0;
            case 2: return data.moodBaseline.length > 0;
            case 3: return data.intent.length > 0;
            case 4: return true; // Privacy screen
            default: return false;
        }
    };

    const toggleIntent = (value: string) => {
        setData(prev => ({
            ...prev,
            intent: prev.intent.includes(value)
                ? prev.intent.filter(i => i !== value)
                : [...prev.intent, value]
        }));
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Emoji Doodle Background */}
                <EmojiDoodleBackground />

                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-rose-900/30" />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.3) 0%, transparent 50%)',
                        backgroundSize: '200% 200%',
                        animation: 'backgroundMove 20s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-8 left-0 right-0 px-8 z-20">
                <div className="max-w-md mx-auto">
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: i <= step ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
                            >
                                <div className="h-full bg-gradient-to-r from-purple-500 to-rose-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-6">
                <AnimatePresence mode="wait">
                    {/* Step 0: Welcome */}
                    {step === 0 && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-8xl"
                            >
                                👋
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold text-white">Welcome!</h1>
                                <p className="text-white/70 text-lg">
                                    Let's get to know you a bit.
                                </p>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <span>Continue</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 1: Name */}
                    {step === 1 && (
                        <motion.div
                            key="name"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-white">What should we call you?</h2>
                                <p className="text-white/60">Choose any name you're comfortable with</p>
                            </div>

                            <input
                                type="text"
                                placeholder="Your name..."
                                value={data.name}
                                onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 py-4 px-6 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors text-lg"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="flex-1 bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Mood Baseline */}
                    {step === 2 && (
                        <motion.div
                            key="mood"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-white">How are you feeling today?</h2>
                                <p className="text-white/60">Pick what resonates with you right now</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {MOOD_OPTIONS.map((mood) => (
                                    <motion.button
                                        key={mood.value}
                                        onClick={() => setData(prev => ({ ...prev, moodBaseline: mood.value }))}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${data.moodBaseline === mood.value
                                            ? 'bg-white/20 border-white/40 backdrop-blur-xl'
                                            : 'bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-4xl mb-2">{mood.emoji}</div>
                                        <div className="text-white font-medium">{mood.label}</div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="flex-1 bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Intent */}
                    {step === 3 && (
                        <motion.div
                            key="intent"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-white">What are you here for?</h2>
                                <p className="text-white/60">Select all that apply</p>
                            </div>

                            <div className="space-y-3">
                                {INTENT_OPTIONS.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        onClick={() => toggleIntent(option.value)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${data.intent.includes(option.value)
                                            ? 'bg-white/20 border-white/40 backdrop-blur-xl'
                                            : 'bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-3xl">{option.icon}</div>
                                        <div className="text-white font-medium text-left">{option.label}</div>
                                        {data.intent.includes(option.value) && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="ml-auto w-6 h-6 bg-white rounded-full flex items-center justify-center"
                                            >
                                                <div className="w-3 h-3 bg-black rounded-full" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="flex-1 bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Privacy Promise */}
                    {step === 4 && (
                        <motion.div
                            key="privacy"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-6">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="inline-block"
                                >
                                    <Shield className="w-20 h-20 text-white mx-auto" />
                                </motion.div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-white">Your Privacy Matters</h2>
                                    <div className="space-y-3 text-white/70 text-lg">
                                        <p>Your feelings aren't content.</p>
                                        <p>You control what's shared.</p>
                                        <p>Your data stays yours.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                    <p className="text-white/80 text-sm">End-to-end encryption for all messages</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                                    <p className="text-white/80 text-sm">No ads, no tracking, no selling your data</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                    <p className="text-white/80 text-sm">You can delete everything anytime</p>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <span>Enter IHATEYOU</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


        </div>
    );
}
