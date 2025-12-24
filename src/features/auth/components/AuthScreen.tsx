'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Chrome, ArrowLeft, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import EmojiDoodleBackground from '@/components/backgrounds/EmojiDoodleBackground';

interface AuthScreenProps {
    onAuthSuccess: (user: { id: string; name: string; email?: string; phone?: string; avatar: string; authMethod: 'google' | 'phone' | 'email' }) => void;
}

type AuthMethod = 'select' | 'google' | 'phone' | 'email';

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('select');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithGoogle();
            onAuthSuccess({
                id: result.user.uid,
                name: result.user.displayName || 'User',
                email: result.user.email || undefined,
                avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.uid}`,
                authMethod: 'google'
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
            setLoading(false);
        }
    };

    const handlePhoneLogin = async () => {
        if (!phoneNumber) {
            setError('Please enter a phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Note: RecaptchaVerifier needs to be set up in production
            // For demo purposes, this is a placeholder
            setError('Phone authentication requires Firebase setup. Please use Google login for now.');
            setLoading(false);

            // Production code would be:
            // const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
            // const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            // setConfirmationResult(confirmation);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP');
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Phone auth not yet implemented
            setError('Phone authentication is not yet available. Please use Google login.');
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid OTP');
            setLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        if (!email) {
            setError('Please enter an email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // For demo purposes
            setError('Email magic link requires Firebase setup. Please use Google login for now.');
            setLoading(false);

            // Production code would be:
            // const actionCodeSettings = {
            //   url: window.location.href,
            //   handleCodeInApp: true,
            // };
            // await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            // setEmailSent(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send login link');
            setLoading(false);
        }
    };

    // TEMPORARY: Skip authentication for demo
    const handleSkipAuth = () => {
        onAuthSuccess({
            id: 'demo-user-' + Date.now(),
            name: 'Demo User',
            email: 'demo@ihateyou.app',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
            authMethod: 'email'
        });
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

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-6">
                <AnimatePresence mode="wait">
                    {authMethod === 'select' ? (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Logo & Tagline */}
                            <div className="text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                    className="inline-block"
                                >
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                            <div className="w-6 h-6 bg-white rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-black italic tracking-[0.2em] text-white uppercase"
                                >
                                    IHATEYOU
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-white/60 text-lg font-light"
                                >
                                    A place to feel, not perform.
                                </motion.p>
                            </div>

                            {/* Auth Options */}
                            <div className="space-y-4">
                                {/* Google Login */}
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Chrome className="w-5 h-5" />
                                            <span>Continue with Google</span>
                                        </>
                                    )}
                                </motion.button>

                                {/* Phone Login */}
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => setAuthMethod('phone')}
                                    className="w-full group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Phone className="w-5 h-5" />
                                    <span>Continue with Phone Number</span>
                                </motion.button>

                                {/* Email Login */}
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={() => setAuthMethod('email')}
                                    className="w-full group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Mail className="w-5 h-5" />
                                    <span>Continue with Email</span>
                                </motion.button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-rose-400 text-sm text-center bg-rose-500/10 border border-rose-500/20 rounded-xl p-3"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Privacy Note */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-white/40 text-xs text-center"
                            >
                                By continuing, you agree to our Terms & Privacy Policy
                            </motion.p>

                            {/* TEMPORARY: Skip Auth Button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                onClick={handleSkipAuth}
                                className="text-white/50 hover:text-white/80 text-xs text-center underline transition-colors"
                            >
                                Skip for now (Demo Mode)
                            </motion.button>
                        </motion.div>
                    ) : authMethod === 'phone' ? (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    setAuthMethod('select');
                                    setError('');
                                    setPhoneNumber('');
                                    setOtp('');
                                }}
                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">Phone Number</h2>
                                <p className="text-white/60">We'll send you a verification code</p>

                                <>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 py-4 px-6 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                    <div id="recaptcha-container"></div>
                                    <button
                                        onClick={handlePhoneLogin}
                                        disabled={loading}
                                        className="w-full bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Code'}
                                    </button>
                                </>

                                {error && (
                                    <div className="text-rose-400 text-sm text-center bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : authMethod === 'email' ? (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    setAuthMethod('select');
                                    setError('');
                                    setEmail('');
                                    setEmailSent(false);
                                }}
                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">Email Login</h2>
                                {!emailSent ? (
                                    <>
                                        <p className="text-white/60">We'll send you a magic link</p>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 py-4 px-6 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                        <button
                                            onClick={handleEmailLogin}
                                            disabled={loading}
                                            className="w-full bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Magic Link'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl">📧</div>
                                        <p className="text-white">Check your email!</p>
                                        <p className="text-white/60 text-sm">We sent a login link to {email}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="text-rose-400 text-sm text-center bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>


        </div>
    );
}
