'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    User,
    Bell,
    Lock,
    Globe,
    HelpCircle,
    LogOut,
    ChevronRight,
    Info,
    Palette,
    Shield,
    Terminal,
} from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useTheme } from './GradientThemeProvider';


import { useAuth } from '@/contexts/AuthContext';

interface SettingsSectionProps {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function SettingsSection({ onScroll }: SettingsSectionProps) {
    const { theme, setTheme } = useTheme();
    const { logout } = useAuth();
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [username, setUsername] = useState('IHATEYOU');
    const [bio, setBio] = useState('Living authentically, feeling deeply');
    const [tempUsername, setTempUsername] = useState(username);
    const [tempBio, setTempBio] = useState(bio);

    const handleSaveProfile = () => {
        setUsername(tempUsername);
        setBio(tempBio);
        setShowProfileEdit(false);
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent p-6" onScroll={onScroll}>
            <div className="max-w-2xl mx-auto space-y-12 pb-32">
                {/* Profile Edit Modal */}
                <AnimatePresence>
                    {showProfileEdit && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                            onClick={() => setShowProfileEdit(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={tempUsername}
                                            onChange={(e) => setTempUsername(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                                            placeholder="Your username"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            value={tempBio}
                                            onChange={(e) => setTempBio(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                                            placeholder="Tell us about yourself"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowProfileEdit(false)}
                                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-bold transition-all"
                                    >
                                        Save
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 bg-white shadow-2xl rounded-[60px] relative overflow-hidden group hover:scale-[1.01] transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-[32px] bg-black flex items-center justify-center text-white text-4xl font-black italic shadow-[0_20px_40px_rgba(0,0,0,0.3)] rotate-3 group-hover:rotate-0 transition-all duration-500 border-2 border-white/10">
                            {username[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-4xl font-black italic text-black tracking-widest uppercase leading-none">{username}</h2>
                            <p className="text-sm text-black/60 font-medium mt-2">{bio}</p>
                            <button
                                onClick={() => {
                                    setTempUsername(username);
                                    setTempBio(bio);
                                    setShowProfileEdit(true);
                                }}
                                className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black/80 transition-all"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Theme Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="px-4">
                        <h3 className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.4em]">
                            Accent Color
                        </h3>
                        <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest mt-1">Select your primary color theme</p>
                    </div>
                    <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
                </motion.div>

                {/* Privacy Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-6"
                >
                    <div className="px-4">
                        <h3 className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.4em]">
                            Privacy & Safety
                        </h3>
                        <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest mt-1">Control who sees what</p>
                    </div>

                    <div className="space-y-3">
                        <PrivacyToggle
                            label="Read Receipts"
                            description="Let others know when you've read their messages"
                            defaultChecked={true}
                        />
                        <PrivacyToggle
                            label="Online Status"
                            description="Show when you're active"
                            defaultChecked={true}
                        />
                        <PrivacyToggle
                            label="Typing Indicators"
                            description="Show when you're typing"
                            defaultChecked={true}
                        />
                        <PrivacyToggle
                            label="Profile Visibility"
                            description="Allow others to view your profile"
                            defaultChecked={true}
                        />
                    </div>
                </motion.div>

                {/* Settings Groups */}
                <div className="space-y-16 px-2">
                    {/* Preferences */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-[10px] font-black italic text-white/20 uppercase tracking-[0.5em] px-4">Account Preferences</h3>
                        <div className="space-y-2">
                            <SettingItem icon={User} label="Account Details" subLabel="Manage your profile info" />
                            <SettingItem icon={Palette} label="App Appearance" subLabel="Customize your interface" />
                            <SettingItem icon={Bell} label="Notifications" subLabel="Manage message alerts" />
                        </div>
                    </motion.div>

                    {/* Security & System */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h3 className="text-[10px] font-black italic text-white/20 uppercase tracking-[0.5em] px-4">Privacy & System</h3>
                        <div className="space-y-2">
                            <SettingItem icon={Shield} label="Privacy Controls" subLabel="Manage visibility and status" />
                            <SettingItem icon={Globe} label="Region & Sync" subLabel="Manage language and local settings" />
                            <SettingItem icon={Terminal} label="Developer Mode" subLabel="Advanced system tools" />
                        </div>
                    </motion.div>

                    {/* Support & Legal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <h3 className="text-[10px] font-black italic text-white/20 uppercase tracking-[0.5em] px-4">Support & Info</h3>
                        <div className="space-y-2">
                            <SettingItem icon={HelpCircle} label="Help Center" subLabel="Get support and guidance" />
                            <SettingItem icon={Info} label="About IHATEYOU" subLabel="Version 0.1.0-BETA" />
                        </div>
                    </motion.div>

                    {/* Log Out */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => logout()}
                        className="w-full flex items-center justify-between p-8 bg-rose-500/5 border border-rose-500/10 rounded-[40px] group hover:bg-rose-500/10 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 flex items-center justify-center rounded-[24px] bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
                                <LogOut size={24} />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-black italic text-rose-500 uppercase tracking-widest">End Session</div>
                                <div className="text-[9px] text-rose-500/40 font-bold uppercase tracking-widest mt-1">Sign out of IHATEYOU</div>
                            </div>
                        </div>
                        <ChevronRight className="text-rose-500/20 group-hover:text-rose-500/40 transition-colors" size={24} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

// Setting Item Component
interface SettingItemProps {
    icon: any;
    label: string;
    subLabel: string;
    onClick?: () => void;
}

function SettingItem({ icon: Icon, label, subLabel, onClick }: SettingItemProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[32px] group hover:bg-white/[0.05] hover:border-white/10 transition-all active:scale-[0.98]"
        >
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-[24px] bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60 transition-all">
                    <Icon size={24} />
                </div>
                <div className="text-left">
                    <div className="text-base font-black italic text-white/80 uppercase tracking-widest">{label}</div>
                    <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">{subLabel}</div>
                </div>
            </div>
            <ChevronRight className="text-white/10 group-hover:text-white/20 group-hover:translate-x-1 transition-all" size={24} />
        </button>
    );
}

// Privacy Toggle Component
function PrivacyToggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked: boolean }) {
    const [isEnabled, setIsEnabled] = useState(defaultChecked);

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="text-sm font-bold text-white mb-1">{label}</div>
                    <div className="text-xs text-white/40">{description}</div>
                </div>
                <button
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={`relative w-14 h-8 rounded-full transition-all ${isEnabled ? 'bg-purple-500' : 'bg-white/10'
                        }`}
                >
                    <motion.div
                        animate={{
                            x: isEnabled ? 26 : 2
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                </button>
            </div>
        </motion.div>
    );
}
