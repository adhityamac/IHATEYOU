'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
            <h2 className="text-4xl text-purple-500 font-bold mb-4">404 - LOST IN THE VOID</h2>
            <p className="text-zinc-500 mb-8">The signal you are looking for has faded.</p>
            <Link
                href="/"
                className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors"
            >
                RETURN TO CORE
            </Link>
        </div>
    );
}
