'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingStep } from './Tooltip';
import { useHapticFeedback } from '@/hooks/useMobileUtils';

interface OnboardingFlowProps {
    steps: {
        title: string;
        description: string;
        target?: string; // CSS selector for highlighting
    }[];
    onComplete: () => void;
    onSkip?: () => void;
    storageKey?: string; // LocalStorage key to remember completion
}

export function OnboardingFlow({
    steps,
    onComplete,
    onSkip,
    storageKey = 'onboarding_completed',
}: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const { triggerHaptic } = useHapticFeedback();

    useEffect(() => {
        // Check if onboarding was already completed
        if (typeof window !== 'undefined') {
            const completed = localStorage.getItem(storageKey);
            if (!completed) {
                setIsVisible(true);
            }
        }
    }, [storageKey]);

    const handleNext = () => {
        triggerHaptic('light');
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        triggerHaptic('light');
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        triggerHaptic('medium');
        if (onSkip) {
            onSkip();
        }
        handleComplete();
    };

    const handleComplete = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, 'true');
        }
        setIsVisible(false);
        onComplete();
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={handleSkip}
                />

                {/* Onboarding Card */}
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <OnboardingStep
                            key={currentStep}
                            step={currentStep + 1}
                            totalSteps={steps.length}
                            title={steps[currentStep].title}
                            description={steps[currentStep].description}
                            onNext={handleNext}
                            onPrevious={currentStep > 0 ? handlePrevious : undefined}
                            onSkip={handleSkip}
                        />
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Hook to manage onboarding state
export function useOnboarding(key: string) {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const completed = localStorage.getItem(key);
            setHasCompletedOnboarding(!!completed);
        }
    }, [key]);

    const resetOnboarding = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
            setHasCompletedOnboarding(false);
        }
    };

    return {
        hasCompletedOnboarding,
        resetOnboarding,
    };
}
