'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import LiquidImage from '@/components/backgrounds/LiquidImage';
import EmojiGrid from '@/components/EmojiGrid';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { resetPassword } from '@/lib/firebase/auth';
import { validateEmail } from '@/lib/validation';
import { AuthCard } from './AuthCard';
import { AuthInput } from './ui/AuthInput';
import { SubmitButton } from './ui/SubmitButton';
import { SocialLogin } from './SocialLogin';
import { Interactive } from '@/components/ui/Interactive';
import YouLoader from './YouLoader';

interface AuthScreenProps {
    onAuthSuccess: (user: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const { state, actions } = useAuthFlow({ onAuthSuccess });
    const { mode, isLoading, error, ghostName, email, password } = state;
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const handleForgotPassword = async () => {
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            actions.setError('Enter your email above first.');
            return;
        }
        setResetLoading(true);
        try {
            await resetPassword(email.trim());
            setResetSent(true);
            actions.setError(null);
        } catch {
            actions.setError('Could not send reset email. Try again.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#050505] flex items-center justify-center font-sans selection:bg-rose-500/30">
            {/* Photogradient Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[60%] rounded-full bg-fuchsia-600/15 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
                <div className="absolute bottom-[-20%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
            </div>

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Liquid Background Layer (Subtle) */}
            <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
                <LiquidImage strength={0.02} speed={0.15} />
            </div>

            {/* 2. Interactive Emoji Grid */}
            <EmojiGrid />

            {/* 3. Main Auth Card */}
            <AuthCard>
                {/* Header Badge */}
                <div className="mt-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[10px] font-serif-elegant font-bold tracking-[0.25em] text-white/40 uppercase">
                        Digital Soul 2.0
                    </span>
                </div>

                {/* Animated Logo */}
                <div className="mb-8 relative group cursor-default flex justify-center">
                    <YouLoader />
                    {/* <div className="text-white">IHATEYOU</div> */}
                </div>

                <p className="text-xs font-serif-elegant font-bold tracking-[0.4em] text-white/30 uppercase mb-8">
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
                        {/* Email + Password fields for both signin and signup */}
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
                            <div className="h-md" />
                            <AuthInput
                                type="password"
                                value={password}
                                onChange={(e) => actions.setPassword(e.target.value)}
                                placeholder={mode === 'signup' ? 'Create password' : 'Password'}
                                label="Password"
                                onKeyDown={(e) => e.key === 'Enter' && (mode === 'signup' ? actions.handleEmailSignUp() : actions.handleEmailSignIn())}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Forgot Password — sign-in only */}
                    {mode === 'signin' && (
                        <div className="flex-1 text-right">
                            <Interactive className="inline-block">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={resetLoading}
                                    className="text-[10px] font-bold tracking-wider text-white/30 hover:text-white/60 transition-colors uppercase disabled:opacity-30"
                                >
                                    {resetLoading ? 'Sending...' : 'Forgot Password?'}
                                </button>
                            </Interactive>
                        </div>
                    )}

                    {/* Reset email sent confirmation */}
                    <AnimatePresence>
                        {resetSent && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center justify-center gap-2 text-emerald-400 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 py-sm rounded-xl border border-emerald-500/20"
                            >
                                <CheckCircle2 className="w-3 h-3" />
                                Reset link sent. Check your inbox.
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AuthInput
                        type="text"
                        value={ghostName}
                        onChange={(e) => actions.setGhostName(e.target.value)}
                        placeholder={mode === 'signup' ? 'Choose your alias' : 'Enter your ghost name'}
                        label="Identity"
                        onKeyDown={(e) => e.key === 'Enter' && (mode === 'signup' ? actions.handleEmailSignUp() : actions.handleEmailSignIn())}
                        autoFocus
                    />

                    <div className="pt-md space-y-2">
                        <SubmitButton
                            onClick={mode === 'signup' ? actions.handleEmailSignUp : actions.handleEmailSignIn}
                            isLoading={isLoading}
                            disabled={!ghostName.trim()}
                            label={mode === 'signup' ? 'Create Account' : 'Sign In'}
                        />
                        {mode === 'signin' && (
                            <Interactive className="w-full">
                                <button
                                    onClick={actions.handleEnterVoid}
                                    disabled={isLoading || !ghostName.trim()}
                                    className="w-full py-2 text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-white/60 transition-colors disabled:opacity-30"
                                >
                                    Enter as Guest
                                </button>
                            </Interactive>
                        )}
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
