'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
        <html>
            <body>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#000',
                    color: '#fff',
                    fontFamily: 'system-ui, sans-serif',
                    flexDirection: 'column',
                    gap: '2rem',
                    padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Something went wrong!</h1>
                    <p style={{ opacity: 0.7, fontSize: '1.25rem' }}>
                        We encountered an unexpected error.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            padding: '1rem 2rem',
                            borderRadius: '1rem',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
