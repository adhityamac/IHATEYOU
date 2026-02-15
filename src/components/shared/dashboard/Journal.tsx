import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Save, Calendar } from 'lucide-react';

interface JournalProps {
    onClose: () => void;
}

export default function Journal({ onClose }: JournalProps) {
    const [entry, setEntry] = useState('');
    const [entries, setEntries] = useState([
        { id: 1, date: 'Today, 9:00 AM', text: 'Feeling grateful for the new beginnings.' },
        { id: 2, date: 'Yesterday, 8:30 PM', text: 'Had a challenging day but learned a lot.' }
    ]);

    const handleSave = () => {
        if (!entry.trim()) return;
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            text: entry
        };
        setEntries([newEntry, ...entries]);
        setEntry('');
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
                className="bg-[#fffbeb] text-[#1a1a1c] p-8 rounded-[40px] max-w-2xl w-full relative overflow-hidden shadow-2xl flex flex-col h-[70vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-3xl font-serif font-medium mb-6 flex items-center gap-3">
                    <span className="text-4xl">📓</span>
                    Journal
                </h2>

                <div className="flex-1 flex gap-8 overflow-hidden">
                    {/* Write Section */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => {
                                    const prompts = [
                                        "What made you smile today?",
                                        "What is one thing you learned recently?",
                                        "How did you take care of yourself today?",
                                        "What are you looking forward to?",
                                        "Describe a moment where you felt at peace."
                                    ];
                                    setEntry(prompts[Math.floor(Math.random() * prompts.length)] + "\n\n");
                                }}
                                className="text-xs text-[#1a1a1c]/40 hover:text-[#1a1a1c] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                                <span>✨</span> Shuffle Prompt
                            </button>
                        </div>
                        <textarea
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                            placeholder="What's on your mind?..."
                            className="flex-1 w-full bg-white/50 rounded-2xl p-6 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a1a1c]/10 custom-scrollbar font-serif text-lg leading-relaxed shadow-inner"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={!entry.trim()}
                                className="bg-[#1a1a1c] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                Save Entry
                            </button>
                        </div>
                    </div>

                    {/* History Section - Hidden on small screens */}
                    <div className="w-1/3 border-l border-[#1a1a1c]/10 pl-8 hidden md:flex flex-col overflow-y-auto custom-scrollbar">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-[#1a1a1c]/40 mb-4">Recent Entries</h3>
                        <div className="space-y-4">
                            {entries.map((item) => (
                                <div key={item.id} className="bg-white/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default">
                                    <div className="flex items-center gap-2 text-[10px] text-[#1a1a1c]/40 font-bold uppercase tracking-wider mb-2">
                                        <Calendar size={10} />
                                        {item.date}
                                    </div>
                                    <p className="text-sm font-serif line-clamp-3 text-[#1a1a1c]/80">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
