'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Check } from 'lucide-react';
import EmojiGrid from '@/components/EmojiGrid';
import LiquidImage from '@/components/backgrounds/LiquidImage';
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

// Extracted Card Component to prevent re-renders
const OnboardingCard = ({
    children,
    title,
    subtitle,
    step,
    onNext,
    onBack,
    canProceed
}: {
    children: React.ReactNode,
    title?: string,
    subtitle?: string,
    step: number,
    onNext: () => void,
    onBack: () => void,
    canProceed: boolean
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="relative z-10 w-[90%] max-w-[420px] aspect-[4/5] bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/5 rounded-[48px] p-8 flex flex-col items-center text-center shadow-2xl"
        style={{
            boxShadow: '0 0 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)'
        } as React.CSSProperties}
    >
        {/* Header Badge */}
        <div className="mt-4 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                Setup Phase {step + 1}/6
            </span>
        </div>

        {title && (
            <div className="mb-2">
                <h2 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {title}
                </h2>
            </div>
        )}

        {subtitle && (
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-8">
                {subtitle}
            </p>
        )}

        <div className="w-full flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
            {children}
        </div>

        {/* Footer Navigation */}
        <div className="w-full pt-6 mt-4 border-t border-white/5 flex gap-4">
            {step > 0 && (
                <button
                    onClick={onBack}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-full font-bold text-xs tracking-widest uppercase transition-colors"
                >
                    Back
                </button>
            )}
            <button
                onClick={onNext}
                disabled={!canProceed}
                className="flex-1 bg-white text-black py-4 rounded-full font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {step === 5 ? "Complete" : "Next"} <ArrowRight className="w-3 h-3" strokeWidth={3} />
            </button>
        </div>
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0F] font-sans overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0 opacity-40">
                <LiquidImage strength={0.02} speed={0.15} />
            </div>
            <EmojiGrid />

            <AnimatePresence mode="wait">
                {/* Step 0: Welcome */}
                {step === 0 && (
                    <OnboardingCard
                        key="step0"
                        title="INITIALIZE SOUL"
                        subtitle="Connection Established"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="space-y-6 text-center">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-purple-500/20 to-rose-500/20 flex items-center justify-center border border-white/10"
                            >
                                <span className="text-4xl">✨</span>
                            </motion.div>
                            <p className="text-white/60 text-sm leading-relaxed px-4">
                                Welcome to IHATEYOU. <br />
                                Before we permit entry to the void, we must calibrate your digital frequency.
                            </p>
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 1: Name */}
                {step === 1 && (
                    <OnboardingCard
                        key="step1"
                        title="IDENTITY"
                        subtitle="What do they call you?"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="w-full space-y-4">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Display Name"
                                className="w-full bg-[#151518] border border-white/5 rounded-2xl px-6 py-4 text-center text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-[#1A1A1D] transition-all font-medium"
                                autoFocus
                            />
                            <p className="text-[10px] text-white/20 uppercase tracking-wider text-center">
                                This echo will represent you.
                            </p>
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 2: Avatar Creator */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="relative z-10 w-full max-w-lg"
                    >
                        <PixelAvatarCreator
                            initialConfig={data.avatarConfig}
                            onComplete={(config) => {
                                setData(prev => ({ ...prev, avatarConfig: config }));
                                handleNext();
                            }}
                        />
                        <div className="absolute -bottom-16 w-full flex justify-center">
                            <button onClick={() => setStep(step - 1)} className="text-white/40 hover:text-white uppercase tracking-widest text-xs font-bold py-2">
                                Back
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Mood */}
                {step === 3 && (
                    <OnboardingCard
                        key="step3"
                        title="RESONANCE"
                        subtitle="Current Emotional State"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {MOOD_OPTIONS.map((mood) => (
                                <motion.button
                                    key={mood.value}
                                    onClick={() => setData(prev => ({ ...prev, moodBaseline: mood.value }))}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${data.moodBaseline === mood.value
                                        ? 'bg-white text-black border-white'
                                        : 'bg-[#151518] text-white/40 border-white/5 hover:bg-[#1A1A1D] hover:text-white'
                                        }`}
                                >
                                    <span className="text-2xl filter grayscale-[0.5]">{mood.emoji}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wide">{mood.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 4: Intent */}
                {step === 4 && (
                    <OnboardingCard
                        key="step4"
                        title="OBJECTIVE"
                        subtitle="Why are you here?"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="space-y-2 w-full">
                            {INTENT_OPTIONS.map((option) => (
                                <motion.button
                                    key={option.value}
                                    onClick={() => toggleIntent(option.value)}
                                    whileTap={{ scale: 0.99 }}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${data.intent.includes(option.value)
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'bg-transparent border-white/5 text-white/40 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg opacity-80">{option.icon}</span>
                                        <span className="text-xs font-bold uppercase tracking-wide">{option.label}</span>
                                    </div>
                                    {data.intent.includes(option.value) && (
                                        <Check className="w-4 h-4 text-white" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </OnboardingCard>
                )}

                {/* Step 5: Privacy */}
                {step === 5 && (
                    <OnboardingCard
                        key="step5"
                        title="PROTOCOL"
                        subtitle="Privacy Agreement"
                        step={step}
                        onNext={handleNext}
                        onBack={() => setStep(step - 1)}
                        canProceed={canProceed()}
                    >
                        <div className="space-y-6 w-full text-left">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <Shield className="w-8 h-8 text-white/80" strokeWidth={1.5} />
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Encrypted Soul</h4>
                                    <p className="text-[10px] text-white/50 leading-relaxed">
                                        Your data is encrypted end-to-end. We cannot see your shadows.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="flex items-center gap-3 text-xs text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>No tracking pixels detected.</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Zero-knowledge storage active.</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Right to vanish (Delete all) enabled.</span>
                                </div>
                            </div>
                        </div>
                    </OnboardingCard>
                )}
            </AnimatePresence>
        </div>
    );
}
