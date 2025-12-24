'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiGrid from '@/components/EmojiGrid';
import { signInAnonymously, signInWithGoogle } from '@/lib/firebase/auth';
import { ArrowRight, Smartphone, Mail, Chrome, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { updateProfile } from 'firebase/auth';
import LiquidImage from '@/components/backgrounds/LiquidImage';

interface AuthScreenProps {
    onAuthSuccess: (user: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const [ghostName, setGhostName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ghost Login (Anonymous)
    const handleEnterVoid = async () => {
        if (!ghostName.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInAnonymously();
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: ghostName });
            }
            // Pass user data to parent
            onAuthSuccess({
                id: result.user.uid,
                name: ghostName,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ghostName}`,
                authMethod: 'ghost'
            });
        } catch (e: any) {
            console.error("Login Failed:", e);

            // FALLBACK: If API key is missing/invalid, allow mock login for Dev UX
            if (e.code === 'auth/api-key-not-valid' || e.message?.includes('valid-api-key') || e.message?.includes('configuration')) {
                console.warn("Using Mock/Offline Login due to missing Firebase Config");
                setTimeout(() => {
                    onAuthSuccess({
                        id: 'offline-ghost-' + Date.now(),
                        name: ghostName,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ghostName}`,
                        authMethod: 'ghost'
                    });
                }, 1000); // Fake delay
                return;
            }

            setError(e.message || "Failed to enter the void.");
            setIsLoading(false);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithGoogle();
            onAuthSuccess({
                id: result.user.uid,
                name: result.user.displayName || 'Soul',
                email: result.user.email,
                avatar: result.user.photoURL,
                authMethod: 'google'
            });
        } catch (e: any) {
            console.error(e);
            // Can't mock Google login easily, so show error
            if (e.code === 'auth/api-key-not-valid' || e.message?.includes('valid-api-key')) {
                setError("Setup Required: Valid Firebase API Key missing in .env.local");
            } else {
                setError("Connection Refused: " + (e.message || "Unknown Error"));
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#0D0D0F] flex items-center justify-center font-sans">

            {/* 1. Liquid Effect Layer */}
            <div className="absolute inset-0 z-0 opacity-40">
                <LiquidImage strength={0.02} speed={0.15} />
            </div>

            {/* 2. Emoji Grid Layer */}
            <EmojiGrid />

            {/* 3. The Digital Soul Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-[90%] max-w-[420px] aspect-[4/5] bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/5 rounded-[48px] p-8 flex flex-col items-center text-center shadow-2xl"
                style={{
                    boxShadow: '0 0 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)'
                } as React.CSSProperties}
            >
                {/* Badge */}
                <div className="mt-8 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                        Digital Soul 0.1
                    </span>
                </div>

                {/* Logo */}
                <div className="mb-2 relative group cursor-default">
                    <h1 className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                        IHATEYOU
                    </h1>
                    <div className="absolute inset-0 text-6xl font-black italic tracking-tighter text-rose-500 opacity-0 group-hover:opacity-40 blur-[2px] transition-opacity duration-300" aria-hidden="true">
                        IHATEYOU
                    </div>
                </div>

                <p className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mb-10">
                    The Emotional Playground
                </p>

                {/* Input Area */}
                <div className="w-full space-y-4 mb-auto">
                    <input
                        type="text"
                        value={ghostName}
                        onChange={(e) => setGhostName(e.target.value)}
                        placeholder="Your ghost name"
                        className="w-full bg-[#151518] border border-white/5 rounded-2xl px-6 py-4 text-center text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-[#1A1A1D] transition-all font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleEnterVoid()}
                    />

                    <button
                        onClick={handleEnterVoid}
                        disabled={isLoading || !ghostName.trim()}
                        className="w-full bg-white text-black py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? 'Connecting...' : <>Enter The Void <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} /></>}
                    </button>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center justify-center gap-2 text-rose-500 text-[10px] uppercase tracking-wider font-bold bg-rose-500/10 py-2 rounded-lg"
                            >
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer / Alt Login */}
                <div className="w-full pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                    <p className="text-[10px] font-bold tracking-wider text-white/20 uppercase">
                        Or connect via
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors group"
                            title="Google Login"
                        >
                            <Chrome className="w-5 h-5 text-white/60 group-hover:text-white" />
                        </button>
                        <button
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors group opacity-50 cursor-not-allowed"
                            title="Phone Login (Coming Soon)"
                        >
                            <Smartphone className="w-5 h-5 text-white/60 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-[9px] font-medium text-white/10 tracking-widest uppercase max-w-[200px] leading-relaxed">
                    A minimalist space for authentic souls.
                </div>
            </motion.div>
        </div>
    );
}
