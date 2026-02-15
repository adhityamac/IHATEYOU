import { LayoutConfig } from './layoutConfig';

export interface Sticker {
    id: string;
    emoji: string;
    x: number; // Percentage 0-1 relative to canvas width
    y: number; // Percentage 0-1 relative to canvas height
    scale: number;
    rotation: number;
}

export type PhotoFilter = 'none' | 'solace' | 'dreamy' | 'vintage';

export async function generatePhotoStrip(
    photos: string[],
    layout: LayoutConfig,
    filter: PhotoFilter = 'none',
    stickers: Sticker[] = []
): Promise<string> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = layout.width;
        canvas.height = layout.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
        }

        // 1. Draw Background
        ctx.fillStyle = layout.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Load Photos
        let loadedCount = 0;
        const imgElements: HTMLImageElement[] = [];

        if (photos.length === 0) {
            drawComposition(); // Handle empty case
            return;
        }

        photos.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === photos.length) {
                    drawComposition();
                }
            };
            img.onerror = () => {
                console.error('Failed to load image', src);
                loadedCount++; // Proceed anyway
                if (loadedCount === photos.length) drawComposition();
            }
            img.src = src;
            imgElements[index] = img;
        });

        function drawComposition() {
            if (!ctx) return;

            // Apply Global Filter to Context for Photos
            // Note: ctx.filter applies to drawing operations.
            // We'll apply it, draw photos, then likely reset for text/stickers unless we want them filtered too.
            // Usually stickers are "on top" of the print, so no filter on stickers.

            let filterString = 'none';
            switch (filter) {
                case 'solace':
                    filterString = 'grayscale(100%) contrast(120%) brightness(90%)';
                    break;
                case 'dreamy':
                    filterString = 'brightness(110%) saturate(80%) sepia(20%) blur(0.5px)'; // blur might be expensive/blurry
                    break;
                case 'vintage':
                    filterString = 'sepia(80%) contrast(90%) brightness(90%)';
                    break;
            }

            // Calculate Photo Dimensions
            let photoW = 0;
            let photoH = 0;
            const cols = layout.type === 'grid' ? 2 : 1;

            // Available width for photo content
            const netWidth = layout.width - (layout.padding * 2) - ((cols - 1) * layout.gap);
            photoW = netWidth / cols;

            // Maintain 4:3 or 1:1 aspect ratio roughly, but here we assume webcam 4:3
            // Let's force a crop or fit. For simplicity, we assume source is 4:3 and we fit width.
            photoH = photoW * 0.75; // 4:3 default

            // Start Y position
            let currentY = layout.padding + 60; // Extra top padding for title?
            let currentX = layout.padding;

            // Main Title
            ctx.filter = 'none'; // Ensure text is crisp
            ctx.fillStyle = layout.textColor;
            ctx.font = 'bold 32px serif';
            ctx.textAlign = 'center';
            ctx.fillText(layout.name.toUpperCase(), layout.width / 2, 50);

            // Draw Photos
            ctx.filter = filterString; // Apply filter for photos

            imgElements.forEach((img, i) => {
                if (!img) return;

                const col = i % cols;
                const row = Math.floor(i / cols);

                const x = layout.padding + (col * (photoW + layout.gap));
                const y = currentY + (row * (photoH + layout.gap));

                // Save context for clipping
                ctx.save();

                // Draw photo
                // Object-cover simulation
                const scale = Math.max(photoW / img.width, photoH / img.height);
                const xOffset = (photoW - img.width * scale) / 2;
                const yOffset = (photoH - img.height * scale) / 2;

                // Clip round rect usually looks nice, but keeping square for 'strip' vibe
                ctx.beginPath();
                ctx.rect(x, y, photoW, photoH);
                ctx.clip();

                ctx.drawImage(img, x + xOffset, y + yOffset, img.width * scale, img.height * scale);
                ctx.restore();

                // Add Frame/Border if needed
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 0; // borderless for now
                ctx.strokeRect(x, y, photoW, photoH);
            });

            ctx.filter = 'none'; // Reset for Footer & Stickers

            // Date Footer
            ctx.fillStyle = layout.textColor + '80'; // somewhat transparent
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            ctx.fillText(dateStr, layout.width / 2, layout.height - 20);

            // 3. Draw Stickers
            stickers.forEach(sticker => {
                ctx.save();
                // Position x/y are percentages of canvas width/height
                const x = sticker.x * canvas.width;
                const y = sticker.y * canvas.height;

                ctx.translate(x, y);
                ctx.rotate(sticker.rotation * Math.PI / 180);

                ctx.font = `${sticker.scale * 40}px sans-serif`; // Scale factor for emoji size
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(sticker.emoji, 0, 0);

                ctx.restore();
            });

            resolve(canvas.toDataURL('image/png'));
        }
    });
}
