import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, Heart } from 'lucide-react';

interface AffirmationsProps {
    onClose: () => void;
}

const AFFIRMATIONS = [
    "I am worthy of all the good things life has to offer.",
    "I choose to be happy and love myself today.",
    "My potential is limitless.",
    "I am in charge of how I feel and today I am choosing happiness.",
    "I am growing and learning every day.",
    "I trust the process of life.",
    "I radiate positivity and good vibes.",
    "I am surrounded by love and support.",
    "I am strong, capable, and resilient.",
    "I invite abundance and joy into my life."
];

export default function Affirmations({ onClose }: AffirmationsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [liked, setLiked] = useState<boolean[]>(new Array(AFFIRMATIONS.length).fill(false));

    useEffect(() => {
        // Random start
        setCurrentIndex(Math.floor(Math.random() * AFFIRMATIONS.length));
    }, []);

    const nextAffirmation = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
            setIsAnimating(false);
        }, 500);
    };

    const toggleLike = () => {
        const newLiked = [...liked];
        newLiked[currentIndex] = !newLiked[currentIndex];
        setLiked(newLiked);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 text-[#1a1a1c] p-8 rounded-[40px] max-w-lg w-full relative overflow-hidden shadow-2xl flex flex-col items-center justify-between min-h-[400px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="w-full flex justify-center pt-8">
                    <div className="bg-amber-100/50 p-4 rounded-full">
                        <Sparkles size={32} className="text-amber-500" />
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 w-full">
                    <AnimatePresence mode="wait">
                        {!isAnimating && (
                            <motion.p
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="text-3xl font-serif text-center font-medium leading-relaxed italic text-[#1a1a1c]"
                            >
                                "{AFFIRMATIONS[currentIndex]}"
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex gap-4 mb-4 z-10">
                    <button
                        onClick={toggleLike}
                        className={`p-4 rounded-full transition-all ${liked[currentIndex]
                                ? 'bg-red-50 text-red-500 scale-110 shadow-lg'
                                : 'bg-white/50 text-[#1a1a1c]/40 hover:bg-white hover:scale-105 hover:text-red-400 shadow-sm'
                            }`}
                    >
                        <Heart size={24} fill={liked[currentIndex] ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={nextAffirmation}
                        className="bg-[#1a1a1c] text-white px-8 py-4 rounded-full hover:bg-black hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                    >
                        <RefreshCw size={20} />
                        New Affirmation
                    </button>
                </div>

            </motion.div>
        </motion.div>
    );
}
