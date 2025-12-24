'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-black to-purple-900/30" />
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
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(244, 63, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                        backgroundSize: '200% 200%',
                        animation: 'backgroundMove 20s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <AlertCircle className="w-20 h-20 text-rose-500 mx-auto" />
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white">Oops!</h1>
                        <p className="text-white/70 text-lg">
                            Something went wrong. Don't worry, we can fix this.
                        </p>
                    </div>

                    <button
                        onClick={reset}
                        className="w-full bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span>Try Again</span>
                    </button>

                    <p className="text-white/40 text-xs">
                        If this keeps happening, try refreshing the page
                    </p>
                </motion.div>
            </div>

            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </div>
    );
}
