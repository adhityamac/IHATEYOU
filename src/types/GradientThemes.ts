export type GradientTheme =
    | 'purple-pink'
    | 'blue-cyan'
    | 'green-yellow'
    | 'red-orange'
    | 'sunset'
    | 'ocean'
    | 'forest';

export interface ThemeColors {
    name: string;
    gradient: {
        from: string;
        via: string;
        to: string;
    };
    accent: string;
    preview: string; // CSS gradient for preview
}

export const GRADIENT_THEMES: Record<GradientTheme, ThemeColors> = {
    'purple-pink': {
        name: 'Purple Pink',
        gradient: {
            from: '#6b21a8',
            via: '#a855f7',
            to: '#ec4899',
        },
        accent: '#a855f7',
        preview: 'linear-gradient(135deg, #6b21a8 0%, #a855f7 50%, #ec4899 100%)',
    },
    'blue-cyan': {
        name: 'Blue Cyan',
        gradient: {
            from: '#1e3a8a',
            via: '#3b82f6',
            to: '#06b6d4',
        },
        accent: '#3b82f6',
        preview: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
    },
    'green-yellow': {
        name: 'Green Yellow',
        gradient: {
            from: '#065f46',
            via: '#10b981',
            to: '#fbbf24',
        },
        accent: '#10b981',
        preview: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #fbbf24 100%)',
    },
    'red-orange': {
        name: 'Red Orange',
        gradient: {
            from: '#991b1b',
            via: '#ef4444',
            to: '#f97316',
        },
        accent: '#ef4444',
        preview: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #f97316 100%)',
    },
    'sunset': {
        name: 'Sunset',
        gradient: {
            from: '#7c2d12',
            via: '#f97316',
            to: '#fbbf24',
        },
        accent: '#f97316',
        preview: 'linear-gradient(135deg, #7c2d12 0%, #f97316 50%, #fbbf24 100%)',
    },
    'ocean': {
        name: 'Ocean',
        gradient: {
            from: '#0c4a6e',
            via: '#0ea5e9',
            to: '#67e8f9',
        },
        accent: '#0ea5e9',
        preview: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #67e8f9 100%)',
    },
    'forest': {
        name: 'Forest',
        gradient: {
            from: '#14532d',
            via: '#22c55e',
            to: '#84cc16',
        },
        accent: '#22c55e',
        preview: 'linear-gradient(135deg, #14532d 0%, #22c55e 50%, #84cc16 100%)',
    },
};
