'use client';

import { motion } from 'framer-motion';

interface OnboardingStepProps {
    step: number;
    totalSteps: number;
    title: string;
    description: string;
    onNext?: () => void;
    onSkip?: () => void;
    onPrevious?: () => void;
    showSkip?: boolean;
}

export function OnboardingStep({
    step,
    totalSteps,
    title,
    description,
    onNext,
    onSkip,
    onPrevious,
    showSkip = true,
}: OnboardingStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-2xl max-w-md"
        >
            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
                    <span>Step {step} of {totalSteps}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="h-1 bg-purple-900/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
                <p className="text-purple-200">{description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                    {step > 1 && onPrevious && (
                        <button
                            onClick={onPrevious}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                        >
                            Back
                        </button>
                    )}
                    {showSkip && onSkip && (
                        <button
                            onClick={onSkip}
                            className="px-4 py-2 rounded-xl text-purple-300 hover:text-white font-semibold transition-colors"
                        >
                            Skip
                        </button>
                    )}
                </div>
                {onNext && (
                    <button
                        onClick={onNext}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                        {step === totalSteps ? 'Get Started' : 'Next'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
