// Component-specific type definitions

import { LucideIcon } from 'lucide-react';

// Auth types
export interface AuthUser {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar: string;
    authMethod: 'google' | 'phone' | 'email';
    onboardingComplete?: boolean;
    createdAt: Date;
}

// Emotion types for components
export interface EmotionOption {
    id: string;
    label: string;
    emoji: string;
    color?: string;
    gradient?: string;
}

// Settings types
export interface SettingsOption {
    id: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    value?: unknown;
}

// Widget types
export interface Widget {
    id: string;
    type: string;
    title: string;
    data?: unknown;
}

// Framer Motion types
export interface MotionValue<T = number> {
    get(): T;
    set(value: T): void;
}
