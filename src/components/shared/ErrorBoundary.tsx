'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center w-full p-6 text-center bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm my-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle className="text-red-500" size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Content Unavailable</h3>
                    <p className="text-white/40 text-xs mb-4 max-w-[200px] mx-auto">
                        {this.state.error?.message || 'Something went wrong while loading this content.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors"
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}