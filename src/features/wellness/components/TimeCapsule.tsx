'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock } from 'lucide-react';

interface Capsule {
    id: string;
    content: string;
    createdAt: string;
    unlockDate: string;
    isLocked: boolean;
}

export default function TimeCapsule() {
    const [capsules, setCapsules] = useState<Capsule[]>([]);
    const [message, setMessage] = useState('');
    const [unlockDays, setUnlockDays] = useState(7);
    const [viewingCapsule, setViewingCapsule] = useState<Capsule | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('timeCapsules');
        if (saved) {
            setCapsules(JSON.parse(saved));
        }
    }, []);

    const createCapsule = () => {
        if (!message.trim()) return;

        const unlockDate = new Date();
        unlockDate.setDate(unlockDate.getDate() + unlockDays);

        const newCapsule: Capsule = {
            id: Date.now().toString(),
            content: message,
            createdAt: new Date().toISOString(),
            unlockDate: unlockDate.toISOString(),
            isLocked: true
        };

        const updated = [newCapsule, ...capsules];
        setCapsules(updated);
        localStorage.setItem('timeCapsules', JSON.stringify(updated));
        setMessage('');
    };

    const checkLockStatus = (capsule: Capsule) => {
        if (!capsule.isLocked) return false;
        return new Date() < new Date(capsule.unlockDate);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Creation Form */}
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                        <Clock size={20} />
                    </div>
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Create Capsule</h3>
                </div>

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message to your future self..."
                    className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-purple-500/50 transition-colors mb-4 font-mono text-sm"
                />

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-xs text-white/40 uppercase font-bold">Unlock in:</span>
                        <select
                            value={unlockDays}
                            onChange={(e) => setUnlockDays(Number(e.target.value))}
                            className="bg-transparent text-white font-bold text-sm focus:outline-none"
                        >
                            <option value={1} className="bg-zinc-900">1 Day</option>
                            <option value={7} className="bg-zinc-900">1 Week</option>
                            <option value={30} className="bg-zinc-900">1 Month</option>
                            <option value={365} className="bg-zinc-900">1 Year</option>
                        </select>
                    </div>

                    <button
                        onClick={createCapsule}
                        disabled={!message.trim()}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Lock size={14} /> Seal
                    </button>
                </div>
            </div>

            {/* Capsule Vault */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Vault Inventory</h3>
                {capsules.length === 0 && (
                    <div className="text-white/20 text-center py-8 italic">No capsules found in the void.</div>
                )}
                {capsules.map(capsule => {
                    const isLocked = checkLockStatus(capsule);
                    return (
                        <motion.div
                            key={capsule.id}
                            layout
                            onClick={() => !isLocked && setViewingCapsule(capsule)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isLocked
                                    ? 'bg-white/[0.02] border-white/5 opacity-70'
                                    : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isLocked ? <Lock size={16} className="text-white/40" /> : <Unlock size={16} className="text-purple-400" />}
                                    <div>
                                        <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                                            {new Date(capsule.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-[10px] text-white/30 font-mono mt-1">
                                            {isLocked ? `Unlocks: ${new Date(capsule.unlockDate).toLocaleDateString()}` : 'UNLOCKED'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Viewing Modal */}
            <AnimatePresence>
                {viewingCapsule && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setViewingCapsule(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900 border border-purple-500/30 p-8 rounded-3xl max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Message from the Past</div>
                            <p className="text-white text-lg leading-relaxed font-medium">{viewingCapsule.content}</p>
                            <div className="mt-6 text-right text-[10px] text-white/30 font-mono">Sealed on {new Date(viewingCapsule.createdAt).toLocaleDateString()}</div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}