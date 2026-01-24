'use client';

import YouLoader from './YouLoader';

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0D0D0F] flex flex-col items-center justify-center">
            {/* YOU Loader */}
            <div className="flex items-center mb-8">
                <YouLoader />
                {/* <div className="text-white">Loading...</div> */}
            </div>

            {/* Message */}
            <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold animate-pulse">
                {message}
            </p>
        </div>
    );
}
