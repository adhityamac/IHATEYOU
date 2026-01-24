'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import LiquidImage from '@/components/backgrounds/LiquidImage';
import EmojiGrid from '@/components/EmojiGrid';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { AuthCard } from './AuthCard';
import { AuthInput } from './ui/AuthInput';
import { SubmitButton } from './ui/SubmitButton';
import { SocialLogin } from './SocialLogin';
import YouLoader from './YouLoader';

interface AuthScreenProps {
    onAuthSuccess: (user: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const { state, actions } = useAuthFlow({ onAuthSuccess });
    const { mode, isLoading, error, ghostName, email, password } = state;

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#0D0D0F] flex items-center justify-center font-sans selection:bg-rose-500/30">
            {/* 1. Liquid Background Layer */}
            <div className="absolute inset-0 z-0 opacity-40">
                <LiquidImage strength={0.02} speed={0.15} />
            </div>

            {/* 2. Interactive Emoji Grid */}
            <EmojiGrid />

            {/* 3. Main Auth Card */}
            <AuthCard>
                {/* Header Badge */}
                <div className="mt-xs mb-lg px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                        Digital Soul 2.0
                    </span>
                </div>

                {/* Animated Logo */}
                <div className="mb-8 relative group cursor-default flex justify-center">
                    <YouLoader />
                    {/* <div className="text-white">IHATEYOU</div> */}
                </div>

                <p className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mb-lg">
                    The Emotional Playground
                </p>

                {/* Mode Toggle Tabs */}
                <div className="flex gap-2 mb-lg w-full bg-black/20 p-1 rounded-2xl border border-white/5">
                    {(['signin', 'signup'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => actions.setMode(m)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative ${mode === m ? 'text-black' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {mode === m && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{m === 'signin' ? 'Sign In' : 'Join'}</span>
                        </button>
                    ))}
                </div>

                {/* Form Fields */}
                <div className="w-full space-y-md mb-auto">
                    <AnimatePresence mode="popLayout">
                        {mode === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AuthInput
                                    type="email"
                                    value={email}
                                    onChange={(e) => actions.setEmail(e.target.value)}
                                    placeholder="Your email"
                                    label="Email"
                                />
                                <div className="h-md" /> {/* Spacer */}
                                <AuthInput
                                    type="password"
                                    value={password}
                                    onChange={(e) => actions.setPassword(e.target.value)}
                                    placeholder="Create password"
                                    label="Password"
                                    onKeyDown={(e) => e.key === 'Enter' && actions.handleEmailSignUp()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AuthInput
                        type="text"
                        value={ghostName}
                        onChange={(e) => actions.setGhostName(e.target.value)}
                        placeholder={mode === 'signup' ? "Choose your alias" : "Enter your ghost name"}
                        label="Identity"
                        onKeyDown={(e) => e.key === 'Enter' && (mode === 'signup' ? actions.handleEmailSignUp() : actions.handleEnterVoid())}
                        autoFocus
                    />

                    <div className="pt-md">
                        <SubmitButton
                            onClick={mode === 'signup' ? actions.handleEmailSignUp : actions.handleEnterVoid}
                            isLoading={isLoading}
                            disabled={!ghostName.trim()}
                            label={mode === 'signup' ? 'Create Account' : 'Enter The Void'}
                        />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center justify-center gap-2 text-rose-500 text-[10px] uppercase tracking-wider font-bold bg-rose-500/10 py-sm rounded-xl border border-rose-500/20"
                            >
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <SocialLogin onGoogleClick={actions.handleGoogleLogin} />

                <div className="mt-8 text-[9px] font-medium text-white/20 tracking-[0.3em] uppercase max-w-[200px] leading-relaxed opacity-60 hover:opacity-100 transition-opacity">
                    A minimalist space for authentic souls.
                </div>
            </AuthCard>

            {/* Version Tag */}
            <div className="absolute bottom-6 left-6 text-[9px] font-mono text-white/10 uppercase tracking-widest pointer-events-none">
                v2.0.4 // DARK MATTER
            </div>
        </div>
    );
}
