/**
 * Sticker Data Configuration
 * Defines all available stickers with their positions and metadata
 */

export interface Sticker {
    id: string;
    name: string;
    category: 'happy' | 'love' | 'sad' | 'excited' | 'confused' | 'cool' | 'shy' | 'angry' | 'misc';
    emoji: string; // Fallback emoji
    sheet?: number; // Which sticker sheet (1 or 2)
    position?: { row: number; col: number }; // Position in grid
}

// Hand-drawn stickers from uploaded images
// Sheet 1: Black and white expressions (8x8 grid)
// Sheet 2: Colored expressions with hearts and details
export const STICKERS: Sticker[] = [
    // Text-based emoticons (always available)
    { id: 'happy-1', name: 'Happy Face', category: 'happy', emoji: '(◕‿◕)' },
    { id: 'happy-2', name: 'Cute Happy', category: 'happy', emoji: '(｡◕‿◕｡)' },
    { id: 'happy-3', name: 'Flower Happy', category: 'happy', emoji: '(◕ᴗ◕✿)' },
    { id: 'happy-4', name: 'Sparkle Happy', category: 'happy', emoji: '(◕‿◕✿)' },
    { id: 'happy-5', name: 'Round Happy', category: 'happy', emoji: '(◕ω◕)' },

    { id: 'love-1', name: 'Heart Eyes', category: 'love', emoji: '(♡‿♡)' },
    { id: 'love-2', name: 'Love Face', category: 'love', emoji: '(◕‿◕)♡' },
    { id: 'love-3', name: 'Double Love', category: 'love', emoji: '♡(◕‿◕)♡' },
    { id: 'love-4', name: 'Kiss Face', category: 'love', emoji: '(◕ε◕♡)' },
    { id: 'love-5', name: 'Cute Kiss', category: 'love', emoji: '(◕3◕)' },

    { id: 'sad-1', name: 'Crying', category: 'sad', emoji: '(╥﹏╥)' },
    { id: 'sad-2', name: 'Sad Face', category: 'sad', emoji: '(｡•́︿•̀｡)' },
    { id: 'sad-3', name: 'Tears', category: 'sad', emoji: '(｡T ω T｡)' },
    { id: 'sad-4', name: 'Very Sad', category: 'sad', emoji: '(ಥ﹏ಥ)' },
    { id: 'sad-5', name: 'Upset', category: 'sad', emoji: '(｡•́ - •̀｡)' },

    { id: 'excited-1', name: 'Super Excited', category: 'excited', emoji: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧' },
    { id: 'excited-2', name: 'Yay', category: 'excited', emoji: '(ﾉ≧∀≦)ﾉ' },
    { id: 'excited-3', name: 'Celebration', category: 'excited', emoji: '(ﾉ´ヮ`)ﾉ*: ･ﾟ' },
    { id: 'excited-4', name: 'Happy Dance', category: 'excited', emoji: '٩(◕‿◕｡)۶' },
    { id: 'excited-5', name: 'Woohoo', category: 'excited', emoji: '(ﾉ^ヮ^)ﾉ' },

    { id: 'confused-1', name: 'Confused', category: 'confused', emoji: '(・_・ヾ' },
    { id: 'confused-2', name: 'Question', category: 'confused', emoji: '(・・ ) ?' },
    { id: 'confused-3', name: 'Puzzled', category: 'confused', emoji: '(◔_◔)' },
    { id: 'confused-4', name: 'Unsure', category: 'confused', emoji: '(・・;)' },
    { id: 'confused-5', name: 'Thinking', category: 'confused', emoji: '(¯―¯٥)' },

    { id: 'cool-1', name: 'Sunglasses', category: 'cool', emoji: '(⌐■_■)' },
    { id: 'cool-2', name: 'Deal With It', category: 'cool', emoji: '(▀̿Ĺ̯▀̿ ̿)' },
    { id: 'cool-3', name: 'Chill', category: 'cool', emoji: '(•_•)' },
    { id: 'cool-4', name: 'Smirk', category: 'cool', emoji: '(¬‿¬)' },
    { id: 'cool-5', name: 'Wink Cool', category: 'cool', emoji: '(◕‿-)✧' },

    { id: 'shy-1', name: 'Blushing', category: 'shy', emoji: '(⁄ ⁄•⁄ω⁄•⁄ ⁄)' },
    { id: 'shy-2', name: 'Shy Smile', category: 'shy', emoji: '(//▽//)' },
    { id: 'shy-3', name: 'Very Shy', category: 'shy', emoji: '(///▽///)' },
    { id: 'shy-4', name: 'Embarrassed', category: 'shy', emoji: '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)' },
    { id: 'shy-5', name: 'Hiding', category: 'shy', emoji: '(*/ω＼*)' },

    { id: 'angry-1', name: 'Very Angry', category: 'angry', emoji: '(╬ಠ益ಠ)' },
    { id: 'angry-2', name: 'Disapprove', category: 'angry', emoji: '(ಠ_ಠ)' },
    { id: 'angry-3', name: 'Not Amused', category: 'angry', emoji: '(¬_¬)' },
    { id: 'angry-4', name: 'Frown', category: 'angry', emoji: '(︶︹︺)' },
    { id: 'angry-5', name: 'Mad', category: 'angry', emoji: '(ಠ益ಠ)' },

    // Misc/Special
    { id: 'misc-1', name: 'Shrug', category: 'misc', emoji: '¯\\_(ツ)_/¯' },
    { id: 'misc-2', name: 'Table Flip', category: 'misc', emoji: '(╯°□°）╯︵ ┻━┻' },
    { id: 'misc-3', name: 'Hug', category: 'misc', emoji: '(づ｡◕‿‿◕｡)づ' },
    { id: 'misc-4', name: 'Bear Hug', category: 'misc', emoji: 'ʕっ•ᴥ•ʔっ' },
    { id: 'misc-5', name: 'Wave', category: 'misc', emoji: '(^-^*)/' },
];

export const STICKER_CATEGORIES = {
    happy: { name: 'Happy', emoji: '😊', color: '#fde047' },
    love: { name: 'Love', emoji: '💕', color: '#fda4af' },
    sad: { name: 'Sad', emoji: '😢', color: '#93c5fd' },
    excited: { name: 'Excited', emoji: '🎉', color: '#c4b5fd' },
    confused: { name: 'Confused', emoji: '🤔', color: '#d1d5db' },
    cool: { name: 'Cool', emoji: '😎', color: '#5eead4' },
    shy: { name: 'Shy', emoji: '😳', color: '#fbbf24' },
    angry: { name: 'Angry', emoji: '😠', color: '#fb7185' },
    misc: { name: 'Misc', emoji: '✨', color: '#a78bfa' },
};

export const getStickersByCategory = (category: keyof typeof STICKER_CATEGORIES) => {
    return STICKERS.filter(s => s.category === category);
};

export const getStickerById = (id: string) => {
    return STICKERS.find(s => s.id === id);
};
