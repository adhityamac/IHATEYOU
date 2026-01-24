'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Smile } from 'lucide-react';
import PixelAvatarCreator from '@/features/auth/components/PixelAvatarCreator';
import { MOOD_OPTIONS, INTENT_OPTIONS } from '@/data/mockData';

interface OnboardingData {
    name: string;
    moodBaseline: string;
    intent: string[];
    avatarConfig?: any;
}

interface OnboardingFlowProps {
    onComplete: (data: OnboardingData) => void;
    userName?: string;
}

// Minimal Card Component matching "My Mind" aesthetic
const OnboardingCard = ({
    children,
    step,
    onNext,
    onBack,
    canProceed,
    showNextButton = true
}: {
    children: React.ReactNode,
    step: number,
    onNext: () => void,
    onBack?: () => void,
    canProceed: boolean,
    showNextButton?: boolean
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[400px] aspect-[4/5] bg-white rounded-[60px] p-10 flex flex-col items-center text-center shadow-2xl shadow-orange-500/20"
    >
        {/* Logo Mark */}
        <div className="mb-8 flex items-center gap-2 opacity-80">
            <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black/20" />
            </div>
            <span className="font-serif italic text-lg text-black tracking-tight">my mind</span>
        </div>

        {/* Content Area */}
        <div className="w-full flex-1 flex flex-col justify-center items-center">
            {children}
        </div>

        {/* Footer Navigation */}
        {showNextButton && (
            <div className="w-full mt-8">
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className="group relative w-full bg-[#FFF5F0] hover:bg-[#FFE5D6] text-black py-4 rounded-full font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {step === 0 ? "Let's Get Started" : step === 5 ? "Enter My Mind" : "Continue"}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                </button>
                {onBack && step > 0 && (
                    <button
                        onClick={onBack}
                        className="mt-4 text-[10px] text-black/40 hover:text-black uppercase tracking-widest transition-colors font-medium cursor-pointer"
                    >
                        Back
                    </button>
                )}
            </div>
        )}
    </motion.div>
);

export default function OnboardingFlow({ onComplete, userName = '' }: OnboardingFlowProps) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>({
        name: userName,
        moodBaseline: '',
        intent: [],
        avatarConfig: null
    });

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            onComplete(data);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 0: return true;
            case 1: return data.name.trim().length > 0;
            case 2: return !!data.avatarConfig;
            case 3: return data.moodBaseline.length > 0;
            case 4: return data.intent.length > 0;
            case 5: return true;
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#FFD6A5] via-[#FFD6A5] to-[#FF9E9E] font-serif overflow-hidden">

            <AnimatePresence mode="wait">
                {/* Step 0: Welcome */}
                {step === 0 && (
                    <OnboardingCard
                        key="step0"
                        step={step}
                        onNext={handleNext}
                        canProceed={true}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-6xl font-serif text-black leading-[0.9] tracking-tight">
                                Welcome.<br />
                                <span className="font-normal italic text-black/80">Your fresh, new<br />mind is ready.</span>
                            </h1>
                        </motion.div>
                    </OnboardingCard>
                )}

                {/* Step 1: Name */}
                {step === 1 && (
                    <OnboardingCard
                        key="step1"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="w-full space-y-6">
                            <div>
                                <h2 className="text-3xl font-serif text-black mb-2">First,</h2>
                                <p className="text-sm font-sans text-black/50 uppercase tracking-widest">What should we call you?</p>
                            </div>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Type your name..."
                                className="w-full bg-transparent border-b-2 border-black/10 px-2 py-4 text-center text-3xl font-serif text-black placeholder-black/20 focus:outline-none focus:border-black/40 transition-all"
                                autoFocus
                            />
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 2: Avatar */}
                {step === 2 && (
                    <OnboardingCard
                        key="step2"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                        showNextButton={false} // PixelAvatar has its own flow controls usually, but let's wrap it nicely
                    >
                        <div className="w-full h-full flex flex-col">
                            <h2 className="text-2xl font-serif text-black mb-6">Visual Identity</h2>
                            <div className="flex-1 overflow-hidden rounded-3xl bg-gray-50 border border-black/5">
                                {/* We need to style PixelAvatarCreator to fit light theme if possible, or wrap it */}
                                <PixelAvatarCreator
                                    initialConfig={data.avatarConfig}
                                    onComplete={(config) => {
                                        setData(prev => ({ ...prev, avatarConfig: config }));
                                        handleNext();
                                    }}
                                />
                            </div>
                            <button onClick={() => setStep(step - 1)} className="mt-4 text-[10px] text-black/40 hover:text-black uppercase tracking-widest">
                                Back
                            </button>
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 3: Mood */}
                {step === 3 && (
                    <OnboardingCard
                        key="step3"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="w-full h-full flex flex-col justify-center">
                            <h2 className="text-3xl font-serif text-black mb-8">Current State</h2>
                            <div className="grid grid-cols-2 gap-3 w-full">
                                {MOOD_OPTIONS.map((mood) => (
                                    <button
                                        key={mood.value}
                                        onClick={() => setData(prev => ({ ...prev, moodBaseline: mood.value }))}
                                        className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${data.moodBaseline === mood.value
                                            ? 'bg-black text-white border-black shadow-lg scale-105'
                                            : 'bg-white text-black/60 border-black/5 hover:border-black/20 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-2xl">{mood.emoji}</span>
                                        <span className="text-[10px] font-sans font-bold uppercase tracking-wide">{mood.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 4: Intent */}
                {step === 4 && (
                    <OnboardingCard
                        key="step4"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="w-full h-full flex flex-col justify-center">
                            <h2 className="text-3xl font-serif text-black mb-2">Intentions</h2>
                            <p className="text-xs font-sans text-black/40 uppercase tracking-widest mb-8">Select all that apply</p>

                            <div className="space-y-2 w-full font-sans">
                                {INTENT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => toggleIntent(option.value)}
                                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center justify-between ${data.intent.includes(option.value)
                                            ? 'bg-orange-50 text-orange-900 border-l-4 border-orange-500'
                                            : 'bg-white hover:bg-gray-50 text-black/60 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg opacity-80">{option.icon}</span>
                                            <span className="text-xs font-bold uppercase tracking-wide">{option.label}</span>
                                        </div>
                                        {data.intent.includes(option.value) && (
                                            <Check className="w-4 h-4 text-orange-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 5: Final */}
                {step === 5 && (
                    <OnboardingCard
                        key="step5"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="space-y-6 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 mx-auto rounded-full bg-[#FFF5F0] flex items-center justify-center"
                            >
                                <Smile className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl font-serif text-black mb-4">All Set.</h1>
                                <p className="text-black/60 text-sm font-sans px-8 leading-relaxed">
                                    Your digital sanctuary has been prepared. <br />
                                    Enter with kindness.
                                </p>
                            </div>
                        </div>
                    </OnboardingCard>
                )}

            </AnimatePresence>
        </div>
    );
}
