'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Camera, Type, Smile, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface Story {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    type: 'image' | 'text' | 'emoji';
    content: string;
    backgroundColor?: string;
    timestamp: Date;
    views: number;
    isViewed: boolean;
}

interface StoryRingProps {
    story: Story;
    onClick: () => void;
    isOwn?: boolean;
}

const StoryRing = ({ story, onClick, isOwn }: StoryRingProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center gap-2 relative"
        >
            <div className={`relative w-20 h-20 rounded-full p-1 ${story.isViewed ? 'bg-white/20' : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500'
                }`}>
                <div className="relative w-full h-full rounded-full bg-black overflow-hidden border-2 border-black">
                    <Image
                        src={story.avatar}
                        alt={story.username}
                        fill
                        className="object-cover"
                    />
                </div>
                {isOwn && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-black">
                        <Plus size={14} className="text-white" />
                    </div>
                )}
            </div>
            <span className="text-xs text-white/80 font-medium max-w-[80px] truncate">
                {isOwn ? 'Your Story' : story.username}
            </span>
        </motion.button>
    );
};

interface StoryViewerProps {
    stories: Story[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

const StoryViewer = ({ stories, currentIndex, onClose, onNext, onPrevious }: StoryViewerProps) => {
    const [progress, setProgress] = useState(0);
    const story = stories[currentIndex];

    // Auto-progress timer
    useState(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    onNext();
                    return 0;
                }
                return prev + 2;
            });
        }, 100);
        return () => clearInterval(timer);
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
                {stories.map((_, i) => (
                    <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <Image
                        src={story.avatar}
                        alt={story.username}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white object-cover"
                    />
                    <div>
                        <div className="text-white font-bold">{story.username}</div>
                        <div className="text-white/60 text-xs">
                            {new Date(story.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Story Content */}
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
                {story.type === 'image' ? (
                    <Image
                        src={story.content}
                        alt="Story"
                        fill
                        className="object-contain"
                    />
                ) : story.type === 'text' ? (
                    <div
                        className="w-full h-full flex items-center justify-center p-8"
                        style={{ backgroundColor: story.backgroundColor || '#000' }}
                    >
                        <p className="text-white text-4xl font-bold text-center leading-tight">
                            {story.content}
                        </p>
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: story.backgroundColor || '#000' }}
                    >
                        <span className="text-[200px]">{story.content}</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            {currentIndex > 0 && (
                <button
                    onClick={onPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
            )}
            {currentIndex < stories.length - 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {/* Views count */}
            <div className="absolute bottom-8 left-4 right-4 text-center">
                <div className="text-white/60 text-sm">
                    👁️ {story.views} {story.views === 1 ? 'view' : 'views'}
                </div>
            </div>
        </motion.div>
    );
};

interface StoryCreatorProps {
    onClose: () => void;
    onPost: (story: Omit<Story, 'id' | 'userId' | 'username' | 'avatar' | 'timestamp' | 'views' | 'isViewed'>) => void;
}

const StoryCreator = ({ onClose, onPost }: StoryCreatorProps) => {
    const [mode, setMode] = useState<'select' | 'text' | 'emoji' | 'image'>('select');
    const [content, setContent] = useState('');
    const [backgroundColor, setBackground] = useState('#6366f1');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const backgrounds = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b',
        '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'
    ];

    const emojis = ['😊', '❤️', '🔥', '✨', '🎉', '💪', '🌟', '💯', '🚀', '🎨', '🌈', '⚡', '💫', '🌸', '🎭'];

    const handlePost = () => {
        if (content) {
            onPost({
                type: mode as 'text' | 'emoji' | 'image',
                content,
                backgroundColor: mode !== 'image' ? backgroundColor : undefined,
            });
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-50"
            >
                <X size={20} />
            </button>

            <div className="w-full max-w-md h-full flex flex-col">
                {mode === 'select' ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                        <h2 className="text-3xl font-black text-white mb-8">Create Story</h2>

                        <button
                            onClick={() => setMode('text')}
                            className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                        >
                            <Type size={24} />
                            Text Story
                        </button>

                        <button
                            onClick={() => setMode('emoji')}
                            className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                        >
                            <Smile size={24} />
                            Emoji Story
                        </button>

                        <button
                            onClick={() => {
                                setMode('image');
                                fileInputRef.current?.click();
                            }}
                            className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                        >
                            <Camera size={24} />
                            Photo Story
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        setContent(e.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                ) : mode === 'text' ? (
                    <div className="flex-1 flex flex-col p-8" style={{ backgroundColor }}>
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                            {backgrounds.map(bg => (
                                <button
                                    key={bg}
                                    onClick={() => setBackground(bg)}
                                    className={`w-10 h-10 rounded-full shrink-0 ${backgroundColor === bg ? 'ring-4 ring-white' : ''}`}
                                    style={{ backgroundColor: bg }}
                                />
                            ))}
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="flex-1 bg-transparent text-white text-4xl font-bold text-center resize-none focus:outline-none placeholder:text-white/40"
                            maxLength={150}
                            autoFocus
                        />

                        <button
                            onClick={handlePost}
                            disabled={!content.trim()}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            <Send size={20} />
                            Post Story
                        </button>
                    </div>
                ) : mode === 'emoji' ? (
                    <div className="flex-1 flex flex-col p-8" style={{ backgroundColor }}>
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                            {backgrounds.map(bg => (
                                <button
                                    key={bg}
                                    onClick={() => setBackground(bg)}
                                    className={`w-10 h-10 rounded-full shrink-0 ${backgroundColor === bg ? 'ring-4 ring-white' : ''}`}
                                    style={{ backgroundColor: bg }}
                                />
                            ))}
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            {content ? (
                                <span className="text-[200px]">{content}</span>
                            ) : (
                                <p className="text-white/40 text-xl">Select an emoji</p>
                            )}
                        </div>

                        <div className="grid grid-cols-5 gap-3 mb-6">
                            {emojis.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => setContent(emoji)}
                                    className={`aspect-square text-5xl rounded-2xl ${content === emoji ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20 transition-colors`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={!content}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            <Send size={20} />
                            Post Story
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {content && (
                            <>
                                <div className="flex-1 flex items-center justify-center bg-black relative w-full h-full">
                                    <Image 
                                        src={content} 
                                        alt="Story preview" 
                                        fill 
                                        className="object-contain" 
                                    />
                                </div>
                                <div className="p-8">
                                    <button
                                        onClick={handlePost}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <Send size={20} />
                                        Post Story
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default function Stories() {
    const [stories, setStories] = useState<Story[]>([
        {
            id: '1',
            userId: 'user-1',
            username: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
            type: 'text',
            content: 'Feeling amazing today! ✨',
            backgroundColor: '#8b5cf6',
            timestamp: new Date(),
            views: 12,
            isViewed: false,
        },
        {
            id: '2',
            userId: 'user-2',
            username: 'Luna',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
            type: 'emoji',
            content: '🔥',
            backgroundColor: '#f43f5e',
            timestamp: new Date(Date.now() - 3600000),
            views: 45,
            isViewed: false,
        },
    ]);

    const [viewingStory, setViewingStory] = useState<number | null>(null);
    const [showCreator, setShowCreator] = useState(false);

    const handlePostStory = (storyData: Omit<Story, 'id' | 'userId' | 'username' | 'avatar' | 'timestamp' | 'views' | 'isViewed'>) => {
        const newStory: Story = {
            ...storyData,
            id: Date.now().toString(),
            userId: 'user-1',
            username: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
            timestamp: new Date(),
            views: 0,
            isViewed: false,
        };
        setStories([newStory, ...stories]);
    };

    return (
        <div className="w-full">
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 no-scrollbar">
                <StoryRing
                    story={stories[0]}
                    onClick={() => setShowCreator(true)}
                    isOwn
                />
                {stories.slice(1).map((story, index) => (
                    <StoryRing
                        key={story.id}
                        story={story}
                        onClick={() => setViewingStory(index + 1)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {viewingStory !== null && (
                    <StoryViewer
                        stories={stories}
                        currentIndex={viewingStory}
                        onClose={() => setViewingStory(null)}
                        onNext={() => setViewingStory(prev => prev !== null && prev < stories.length - 1 ? prev + 1 : prev)}
                        onPrevious={() => setViewingStory(prev => prev !== null && prev > 0 ? prev - 1 : prev)}
                    />
                )}

                {showCreator && (
                    <StoryCreator
                        onClose={() => setShowCreator(false)}
                        onPost={handlePostStory}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
