export interface LayoutConfig {
    id: string;
    name: string;
    poses: number;
    type: 'strip' | 'grid';
    width: number;
    height: number;
    gap: number;
    padding: number;
    bgColor: string;
    textColor: string;
    description: string;
    previewColor: string;
}

export const PHOTOBOOTH_LAYOUTS: LayoutConfig[] = [
    {
        id: 'classic-strip',
        name: 'Classic Strip',
        poses: 4,
        type: 'strip',
        width: 300,
        height: 1200, // 4 * 250px photos + gaps + header/footer
        gap: 20,
        padding: 20,
        bgColor: '#ffffff',
        textColor: '#000000',
        description: 'Timeless 4-pose vertical strip.',
        previewColor: 'bg-white'
    },
    {
        id: 'hearts-strip',
        name: 'With Love',
        poses: 3,
        type: 'strip',
        width: 300,
        height: 1000,
        gap: 30,
        padding: 25,
        bgColor: '#fce7f3', // Pink-100
        textColor: '#db2777', // Pink-600
        description: 'Romantic layout with heart spacing.',
        previewColor: 'bg-pink-100'
    },
    {
        id: 'vintage-grid',
        name: 'Vintage Grid',
        poses: 4,
        type: 'grid',
        width: 600,
        height: 800,
        gap: 20,
        padding: 30,
        bgColor: '#fafaf9', // Stone-50
        textColor: '#44403c', // Stone-700
        description: '2x2 grid for a poster vibe.',
        previewColor: 'bg-stone-50'
    }
];
