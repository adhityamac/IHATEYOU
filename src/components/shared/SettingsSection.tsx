'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
    X,
    Check,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Briefcase,
    Heart,
    Trash2,
    Download,
    Upload,
} from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useTheme, Theme } from './GradientThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserPreferences, getUserPreferences, updateUserBio, UserPreferences } from '@/lib/firebase/preferences';

interface SettingsSectionProps {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function SettingsSection({ onScroll }: SettingsSectionProps) {
    const { theme, setTheme } = useTheme();
    const { user, logout, updateUserGhostName, updateTheme } = useAuth();

    // Modals
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showDataModal, setShowDataModal] = useState(false);

    // Profile data
    const [tempGhostName, setTempGhostName] = useState('');
    const [tempBio, setTempBio] = useState('');
    const [tempLocation, setTempLocation] = useState('');
    const [tempOccupation, setTempOccupation] = useState('');
    const [saving, setSaving] = useState(false);

    // Privacy settings state
    const [preferences, setPreferences] = useState<UserPreferences>({
        readReceipts: true,
        onlineStatus: true,
        typingIndicators: true,
        profileVisibility: true,
        notifications: true,
        soundEnabled: true,
    });

    // Load user data and preferences
    useEffect(() => {
        if (user?.id) {
            setTempGhostName(user.ghostName || user.name);
            setTempBio('Living authentically, feeling deeply');
            setTempLocation('The Void');
            setTempOccupation('Soul Explorer');

            getUserPreferences(user.id).then(prefs => {
                if (prefs) {
                    setPreferences(prefs);
                }
            }).catch(err => {
                console.error('Error loading preferences:', err);
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user?.id) return;

        setSaving(true);
        try {
            if (tempGhostName !== user.ghostName) {
                await updateUserGhostName(tempGhostName);
            }

            await updateUserBio(user.id, tempBio);

            setShowProfileEdit(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePreference = async (key: keyof UserPreferences) => {
        if (!user?.id) return;

        const newPreferences = {
            ...preferences,
            [key]: !preferences[key],
        };

        setPreferences(newPreferences);

        try {
            await updateUserPreferences(user.id, newPreferences);
        } catch (error) {
            console.error('Error updating preferences:', error);
            setPreferences(preferences);
        }
    };

    const handleThemeChange = async (newTheme: Theme) => {
        setTheme(newTheme);
        if (user?.id) {
            try {
                await updateTheme(newTheme);
            } catch (error) {
                console.error('Error saving theme:', error);
            }
        }
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            try {
                await logout();
            } catch (error) {
                console.error('Error logging out:', error);
                alert('Failed to logout. Please try again.');
            }
        }
    };

    if (!user) return null;

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent p-6" onScroll={onScroll}>
            <div className="max-w-2xl mx-auto space-y-12 pb-32">

                {/* Profile Edit Modal */}
                <AnimatePresence>
                    {showProfileEdit && (
                        <DetailModal
                            title="Edit Profile"
                            onClose={() => setShowProfileEdit(false)}
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
                                        Ghost Name
                                    </label>
                                    <input
                                        type="text"
                                        value={tempGhostName}
                                        onChange={(e) => setTempGhostName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="Your ghost name"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
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

                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={tempLocation}
                                        onChange={(e) => setTempLocation(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="Where are you from?"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
                                        Occupation
                                    </label>
                                    <input
                                        type="text"
                                        value={tempOccupation}
                                        onChange={(e) => setTempOccupation(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="What do you do?"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowProfileEdit(false)}
                                        disabled={saving}
                                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-xl text-white font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving || !tempGhostName.trim()}
                                        className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </DetailModal>
                    )}
                </AnimatePresence>

                {/* Privacy Modal */}
                <AnimatePresence>
                    {showPrivacyModal && (
                        <DetailModal
                            title="Privacy & Safety"
                            subtitle="Control your visibility and data"
                            onClose={() => setShowPrivacyModal(false)}
                        >
                            <div className="space-y-4">
                                <PrivacyToggle
                                    label="Read Receipts"
                                    description="Let others know when you've read their messages"
                                    isEnabled={preferences.readReceipts}
                                    onToggle={() => handleTogglePreference('readReceipts')}
                                />
                                <PrivacyToggle
                                    label="Online Status"
                                    description="Show when you're active"
                                    isEnabled={preferences.onlineStatus}
                                    onToggle={() => handleTogglePreference('onlineStatus')}
                                />
                                <PrivacyToggle
                                    label="Typing Indicators"
                                    description="Show when you're typing"
                                    isEnabled={preferences.typingIndicators}
                                    onToggle={() => handleTogglePreference('typingIndicators')}
                                />
                                <PrivacyToggle
                                    label="Profile Visibility"
                                    description="Allow others to view your profile"
                                    isEnabled={preferences.profileVisibility}
                                    onToggle={() => handleTogglePreference('profileVisibility')}
                                />
                            </div>
                        </DetailModal>
                    )}
                </AnimatePresence>

                {/* Account Details Modal */}
                <AnimatePresence>
                    {showAccountModal && (
                        <DetailModal
                            title="Account Details"
                            subtitle="Your personal information"
                            onClose={() => setShowAccountModal(false)}
                        >
                            <div className="space-y-4">
                                <InfoRow icon={User} label="Ghost Name" value={user.ghostName || user.name} />
                                <InfoRow icon={Mail} label="Email" value={user.email || 'Not provided'} />
                                <InfoRow icon={Phone} label="Phone" value={user.phone || 'Not provided'} />
                                <InfoRow icon={Calendar} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
                                <InfoRow icon={MapPin} label="Location" value={tempLocation} />
                                <InfoRow icon={Briefcase} label="Occupation" value={tempOccupation} />

                                <div className="pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => {
                                            setShowAccountModal(false);
                                            setShowProfileEdit(true);
                                        }}
                                        className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-bold transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </DetailModal>
                    )}
                </AnimatePresence>

                {/* Notifications Modal */}
                <AnimatePresence>
                    {showNotificationsModal && (
                        <DetailModal
                            title="Notifications"
                            subtitle="Manage your alerts"
                            onClose={() => setShowNotificationsModal(false)}
                        >
                            <div className="space-y-4">
                                <PrivacyToggle
                                    label="Push Notifications"
                                    description="Receive notifications on your device"
                                    isEnabled={preferences.notifications}
                                    onToggle={() => handleTogglePreference('notifications')}
                                />
                                <PrivacyToggle
                                    label="Sound Effects"
                                    description="Play sounds for new messages"
                                    isEnabled={preferences.soundEnabled}
                                    onToggle={() => handleTogglePreference('soundEnabled')}
                                />

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs text-white/40 text-center">
                                        More notification options coming soon
                                    </p>
                                </div>
                            </div>
                        </DetailModal>
                    )}
                </AnimatePresence>

                {/* Data & Storage Modal */}
                <AnimatePresence>
                    {showDataModal && (
                        <DetailModal
                            title="Data & Storage"
                            subtitle="Manage your data"
                            onClose={() => setShowDataModal(false)}
                        >
                            <div className="space-y-4">
                                <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-between transition-all">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-5 h-5 text-blue-400" />
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-white">Download Your Data</div>
                                            <div className="text-xs text-white/40">Export all your information</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/20" />
                                </button>

                                <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-between transition-all">
                                    <div className="flex items-center gap-3">
                                        <Upload className="w-5 h-5 text-green-400" />
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-white">Storage Usage</div>
                                            <div className="text-xs text-white/40">View your storage details</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-white/40">2.3 MB</span>
                                </button>

                                <button className="w-full p-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl flex items-center justify-between transition-all">
                                    <div className="flex items-center gap-3">
                                        <Trash2 className="w-5 h-5 text-rose-400" />
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-rose-400">Delete Account</div>
                                            <div className="text-xs text-rose-400/60">Permanently remove your account</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-rose-400/40" />
                                </button>
                            </div>
                        </DetailModal>
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
                            {(user.ghostName || user.name)[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-4xl font-black italic text-black tracking-widest uppercase leading-none">{user.ghostName || user.name}</h2>
                            <p className="text-sm text-black/60 font-medium mt-2">{tempBio}</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowProfileEdit(true)}
                                    className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black/80 transition-all"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setShowAccountModal(true)}
                                    className="px-4 py-2 bg-black/10 text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black/20 transition-all"
                                >
                                    View Details
                                </button>
                            </div>
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
                    <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
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
                            <SettingItem
                                icon={User}
                                label="Account Details"
                                subLabel="Manage your profile info"
                                onClick={() => setShowAccountModal(true)}
                            />
                            <SettingItem
                                icon={Palette}
                                label="App Appearance"
                                subLabel="Customize your interface"
                            />
                            <SettingItem
                                icon={Bell}
                                label="Notifications"
                                subLabel="Manage message alerts"
                                onClick={() => setShowNotificationsModal(true)}
                            />
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
                            <SettingItem
                                icon={Shield}
                                label="Privacy Controls"
                                subLabel="Manage visibility and status"
                                onClick={() => setShowPrivacyModal(true)}
                            />
                            <SettingItem
                                icon={Globe}
                                label="Data & Storage"
                                subLabel="Manage your data"
                                onClick={() => setShowDataModal(true)}
                            />
                            <SettingItem
                                icon={Terminal}
                                label="Developer Mode"
                                subLabel="Advanced system tools"
                            />
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
                            <SettingItem icon={Info} label="About IHATEYOU" subLabel="Version 1.0.0-BETA" />
                        </div>
                    </motion.div>

                    {/* Log Out */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleLogout}
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

// Detail Modal Component
function DetailModal({
    title,
    subtitle,
    children,
    onClose
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </motion.div>
        </motion.div>
    );
}

// Info Row Component
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
                <div className="text-sm font-bold text-white mt-0.5">{value}</div>
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
function PrivacyToggle({
    label,
    description,
    isEnabled,
    onToggle
}: {
    label: string;
    description: string;
    isEnabled: boolean;
    onToggle: () => void;
}) {
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
                    onClick={onToggle}
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
