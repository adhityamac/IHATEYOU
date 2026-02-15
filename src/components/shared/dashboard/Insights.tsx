import { motion } from 'framer-motion';
import { X, TrendingUp, Calendar, Activity, Brain } from 'lucide-react';

interface InsightsProps {
    onClose: () => void;
}

export default function Insights({ onClose }: InsightsProps) {
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
                className="bg-[#1a1a1c] text-white p-8 rounded-[40px] max-w-4xl w-full relative overflow-hidden shadow-2xl flex flex-col h-[80vh] md:h-[70vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <h2 className="text-3xl font-serif font-medium mb-8 flex items-center gap-3">
                    <Activity className="text-emerald-400" />
                    Wellness Insights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-8">

                    {/* Mood Tracker */}
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl">Mood Trends</h3>
                            <div className="flex gap-2">
                                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Weekly</span>
                            </div>
                        </div>
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                            {[40, 60, 45, 80, 70, 85, 90].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 rounded-t-lg transition-all group-hover:opacity-80"
                                        style={{ height: `${h}%` }}
                                    />
                                    <span className="text-[10px] text-white/40 font-bold uppercase">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">12</h4>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Mindful Sessions</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">85%</h4>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Goal Completion</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">5</h4>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Day Streak</p>
                            </div>
                        </div>
                    </div>

                    {/* Focus Distribution */}
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 col-span-1 md:col-span-2 lg:col-span-3">
                        <h3 className="font-serif text-xl mb-4">Activity Distribution</h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Meditation', val: 75, color: 'bg-cyan-400' },
                                { label: 'Journaling', val: 45, color: 'bg-purple-400' },
                                { label: 'Breathing', val: 60, color: 'bg-emerald-400' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/60">
                                        <span>{item.label}</span>
                                        <span>{item.val} min</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.val}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
}
