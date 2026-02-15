'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Plus, Trash2 } from 'lucide-react';
import PixelAvatarCreator from '@/features/auth/components/PixelAvatarCreator';

// Initial Empty Slots
const TOTAL_SLOTS = 12;

interface Skill {
    id: string;
    label: string;
    icon: string;
    description: string;
}

interface CharacterBookProps {
    userName: string;
    onComplete: (data: any) => void;
    onClose?: () => void;
}

export default function CharacterBook({ userName, onComplete, onClose }: CharacterBookProps) {
    const [name, setName] = useState(userName);
    const [avatarConfig, setAvatarConfig] = useState<any>(null);

    // Custom Skills State
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editingSlot, setEditingSlot] = useState<number | null>(null); // Index of slot being edited
    const [editingAvatar, setEditingAvatar] = useState(false);
    const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

    // Form State for adding/editing skill
    const [skillForm, setSkillForm] = useState({ label: '', icon: '', description: '' });

    // Mock stats
    const stats = {
        level: 19,
        streak: 10,
        crystals: 2
    };

    const handleSlotClick = (index: number) => {
        const existingSkill = skills[index];
        if (existingSkill) {
            setSkillForm({
                label: existingSkill.label,
                icon: existingSkill.icon,
                description: existingSkill.description
            });
        } else {
            setSkillForm({ label: '', icon: '✨', description: '' });
        }
        setEditingSlot(index);
    };

    const saveSkill = () => {
        if (editingSlot === null) return;

        const newSkill: Skill = {
            id: `skill-${Date.now()}`,
            ...skillForm
        };

        setSkills(prev => {
            const newSkills = [...prev];
            newSkills[editingSlot] = newSkill;
            return newSkills;
        });

        setEditingSlot(null);
    };

    const deleteSkill = () => {
        if (editingSlot === null) return;
        setSkills(prev => {
            const newSkills = [...prev];
            delete newSkills[editingSlot];
            return newSkills.map((s, i) => i === editingSlot ? undefined : s) as Skill[];
        });
        setEditingSlot(null);
    }

    const handleSave = () => {
        onComplete({
            name,
            intent: skills.filter(Boolean).map(s => s.label), // sending labels as intent for now
            skills: skills.filter(Boolean), // saving full object
            avatarConfig
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">

            {/* Book Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-[1.6/1] bg-[#F7E7CE] rounded-xl shadow-[12px_12px_0px_rgba(0,0,0,0.2)] flex overflow-hidden border-[4px] border-black box-border"
                style={{
                    backgroundImage: `radial-gradient(#8B5A2B 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    borderRadius: '24px'
                }}
            >
                {/* Book Spine (Cartoon style) */}
                <div className="absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2 bg-[#5D4037] z-10 border-x-4 border-black" />

                {/* Close Button (Comic Style) */}
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 border-4 border-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                >
                    <X size={24} className="text-white stroke-[4]" />
                </button>

                {/* --- LEFT PAGE (Profile) --- */}
                <div className="flex-1 p-8 md:p-12 border-r border-[#8B5A2B]/20 relative flex flex-col items-center justify-center">

                    {/* Tape Effect */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 rotate-1 shadow-sm backdrop-blur-[1px] transformskew-x-12 z-0"
                        style={{ maskImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/tape.png")', maskSize: 'contain' }}
                    />

                    {/* Name Tag */}
                    <div className="relative z-10 bg-white px-6 py-3 border-4 border-black rotate-[-2deg] mb-8 w-full max-w-[280px] text-center transform shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#E0E0E0] opacity-50 rotate-1 border-2 border-black/20" /> {/* Tape */}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent text-center font-[Special_Elite,serif] text-3xl text-black font-bold focus:outline-none placeholder-black/30 uppercase tracking-widest"
                            placeholder="NAME HERE"
                            style={{ fontFamily: '"Special Elite", cursive, serif' }}
                        />
                    </div>

                    {/* Polaroids / Avatar Frame */}
                    <div
                        className="relative w-48 h-56 bg-white p-3 shadow-md rotate-1 mb-8 transform hover:scale-105 transition-transform duration-300 group cursor-pointer"
                        onClick={() => setEditingAvatar(true)}
                    >
                        {/* Tape on corners */}
                        <div className="absolute -top-3 -left-3 w-12 h-4 bg-yellow-100/80 rotate-[-45deg] shadow-sm opacity-80" />
                        <div className="absolute -bottom-3 -right-3 w-12 h-4 bg-yellow-100/80 rotate-[-45deg] shadow-sm opacity-80" />

                        <div className="w-full h-40 bg-blue-100 overflow-hidden relative border border-gray-100">
                            {/* Sunburst background effect */}
                            <div className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg,white_0deg_15deg,transparent_15deg_30deg,white_30deg_45deg,transparent_45deg_60deg,white_60deg_75deg,transparent_75deg_90deg,white_90deg_105deg,transparent_105deg_120deg,white_120deg_135deg,transparent_135deg_150deg,white_150deg_165deg,transparent_165deg_180deg,white_180deg_195deg,transparent_195deg_210deg,white_210deg_225deg,transparent_225deg_240deg,white_240deg_255deg,transparent_255deg_270deg,white_270deg_285deg,transparent_285deg_300deg,white_300deg_315deg,transparent_315deg_330deg,white_330deg_345deg,transparent_345deg_360deg)] animate-[spin_20s_linear_infinite]" />

                            <div className="relative w-full h-full flex items-center justify-center transform scale-150 pointer-events-none">
                                <PixelAvatarCreator
                                    initialConfig={avatarConfig}
                                    onComplete={(config) => setAvatarConfig(config)}
                                    compact={true}
                                />
                            </div>

                            {/* Edit Hint Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-black border border-black shadow-[2px_2px_0px_#000]">EDIT LOOK</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-3 w-full max-w-[320px]">
                        {[
                            { label: 'Level', val: stats.level, icon: '🛡️' },
                            { label: 'Streak', val: stats.streak, icon: '🔥' },
                            { label: 'Gems', val: stats.crystals, icon: '💎' }
                        ].map((stat, i) => (
                            <div key={i} className="flex-1 bg-[#FFF9F0] border-2 border-[#E5C1A5] rounded-lg p-2 flex flex-col items-center justify-center relative shadow-[2px_2px_0_#E5C1A5]">
                                {/* Corner Tape */}
                                <div className={`absolute w-3 h-3 border-t-2 border-l-2 border-[#E5C1A5] -top-1 -left-1 opacity-50`} />
                                <div className={`absolute w-3 h-3 border-b-2 border-r-2 border-[#E5C1A5] -bottom-1 -right-1 opacity-50`} />

                                <span className="text-xl mb-1">{stat.icon}</span>
                                <span className="font-bold text-[#5D4037] text-lg leading-none">{stat.val}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        className="mt-8 bg-[#FFB74D] border-4 border-black text-black font-black py-3 px-10 rounded-xl transform hover:scale-105 active:scale-95 transition-all font-[Special_Elite,serif] uppercase tracking-widest text-lg shadow-[6px_6px_0px_#000]"
                    >
                        S A V E
                    </button>

                </div>

                {/* --- RIGHT PAGE (Skills Inventory) --- */}
                <div className="flex-1 p-8 md:p-12 relative flex flex-col">
                    <h2 className="font-[Special_Elite,serif] text-2xl text-[#8B5A2B] text-center mb-6 underline decoration-wavy decoration-[#8B5A2B]/30 decoration-1 underline-offset-4">
                        Inventory (Skills)
                    </h2>

                    <div className="grid grid-cols-4 gap-4 auto-rows-fr">
                        {[...Array(TOTAL_SLOTS)].map((_, index) => {
                            const skill = skills[index];
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSlotClick(index)}
                                    onMouseEnter={() => skill && setHoveredSkill(skill)}
                                    onMouseLeave={() => setHoveredSkill(null)}
                                    className={`aspect-square rounded-xl border-4 flex items-center justify-center text-3xl transition-all relative group ${skill
                                            ? 'bg-white border-black shadow-[6px_6px_0px_#000] translate-x-[-2px] translate-y-[-2px] hover:scale-105'
                                            : 'bg-white/30 border-black/10 hover:border-black/30 hover:bg-white/50 border-dashed'
                                        }`}
                                >
                                    {skill ? (
                                        <span className="transform group-hover:scale-110 transition-transform">{skill.icon}</span>
                                    ) : (
                                        <Plus className="text-black/20 group-hover:text-black/40" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Description Box (Sticky Note) or Instructions */}
                    <div className="mt-auto relative">
                        <div className="bg-[#FFF8DC] p-6 shadow-md rotate-1 border border-[#E0D8B0] relative min-h-[100px]">
                            {/* Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-pink-200/50 opacity-80 rotate-[-2deg]" />

                            {hoveredSkill ? (
                                <>
                                    <h3 className="font-bold text-[#5D4037] mb-1 font-[Special_Elite,serif]">
                                        {hoveredSkill.label}
                                    </h3>
                                    <p className="text-sm text-[#5D4037]/80 font-serif italic leading-snug">
                                        {hoveredSkill.description || "No description provided."}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-[#5D4037]/60 font-serif italic text-center mt-2">
                                    Click an empty slot to add a skill, trait, or achievement.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Page Navigation Arrows (Decorative) */}
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-full">
                        <button
                            onClick={handleSave}
                            className="bg-[#FFB74D] p-3 rounded-l-none rounded-r-lg border-y-4 border-r-4 border-[#F57C00] shadow-lg hover:pl-5 transition-all active:translate-x-1 text-white font-bold"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* --- EDIT SKILL MODAL (Overlay) --- */}
                <AnimatePresence>
                    {editingSlot !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[50] flex items-center justify-center p-8"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#FFF9F0] w-full max-w-sm rounded-2xl border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,0.5)] p-6 relative"
                            >
                                <button
                                    onClick={() => setEditingSlot(null)}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 border-2 border-black shadow-sm z-50 hover:scale-110 active:scale-90 transition-transform"
                                >
                                    <X size={16} strokeWidth={3} />
                                </button>

                                <h3 className="font-[Special_Elite,serif] text-xl text-black font-bold mb-4 uppercase tracking-wider text-center">
                                    {skills[editingSlot] ? 'Edit Item' : 'New Item'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/50 mb-1 block">Icon (Emoji)</label>
                                        <input
                                            type="text"
                                            value={skillForm.icon}
                                            onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })}
                                            className="w-16 h-16 text-center text-3xl bg-white border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-shadow appearance-none"
                                            maxLength={2}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/50 mb-1 block">Name</label>
                                        <input
                                            type="text"
                                            value={skillForm.label}
                                            onChange={e => setSkillForm({ ...skillForm, label: e.target.value })}
                                            className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-shadow appearance-none"
                                            placeholder="e.g. Coding, Empathy..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/50 mb-1 block">Description</label>
                                        <textarea
                                            value={skillForm.description}
                                            onChange={e => setSkillForm({ ...skillForm, description: e.target.value })}
                                            className="w-full bg-white border-2 border-black rounded-lg p-3 font-medium h-20 resize-none focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-shadow appearance-none"
                                            placeholder="What does this mean to you?"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        {skills[editingSlot] && (
                                            <button
                                                onClick={deleteSkill}
                                                className="bg-red-100 text-red-600 border-2 border-red-200 rounded-lg p-3 hover:bg-red-200 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                        <button
                                            onClick={saveSkill}
                                            disabled={!skillForm.label}
                                            className="flex-1 bg-[#1a1a1c] text-white border-2 border-black rounded-lg p-3 font-bold uppercase tracking-wider hover:bg-black disabled:opacity-50 transition-colors"
                                        >
                                            Save Item
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- EDIT AVATAR MODAL --- */}
                <AnimatePresence>
                    {editingAvatar && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="relative bg-[#0f380f] p-1 rounded-lg shadow-2xl"
                            >
                                <button
                                    onClick={() => setEditingAvatar(false)}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 border-2 border-black shadow-[2px_2px_0px_#000] z-50 hover:scale-110 transition-transform"
                                >
                                    <X size={16} strokeWidth={3} />
                                </button>

                                <PixelAvatarCreator
                                    initialConfig={avatarConfig}
                                    onComplete={(config) => {
                                        setAvatarConfig(config);
                                        setEditingAvatar(false);
                                    }}
                                    compact={false}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
}
