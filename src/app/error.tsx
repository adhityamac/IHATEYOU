'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('APP CRASHED:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8 font-mono">
            <h2 className="text-3xl text-red-500 font-bold mb-4">CRITICAL SYSTEM FAILURE</h2>
            <p className="text-zinc-500 mb-8">The Neural Core has encountered a fatal exception.</p>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg max-w-2xl w-full overflow-auto mb-8">
                <h3 className="text-sm font-bold text-zinc-400 mb-2">ERROR DIGEST</h3>
                <code className="text-xs text-red-400 block whitespace-pre-wrap font-mono">
                    {error.message}
                    {error.stack && `\n\nSTACK TRACE:\n${error.stack}`}
                </code>
            </div>

            <button
                onClick={reset}
                className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors"
            >
                ATTEMPT SYSTEM REBOOT
            </button>

            <p className="mt-8 text-xs text-zinc-700">ErrorCode: 500_INTERNAL_SERVER_ERROR</p>
        </div>
    );
}
