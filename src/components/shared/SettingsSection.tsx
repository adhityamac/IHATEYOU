'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, Bell, Palette, Database, HelpCircle,
    ChevronRight, Moon, Sun, Sparkles, LogOut, Trash2,
    Download, Shield, Eye, EyeOff, Mail, Phone, Camera,
    Edit3, Check, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeMode } from '@/contexts/ThemeModeContext';

type SettingsView = 'main' | 'account' | 'privacy' | 'notifications' | 'appearance' | 'data' | 'help';

interface SettingsSectionProps {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function SettingsSection({ onScroll }: SettingsSectionProps) {
    const { user, logout } = useAuth();
    const { mode, setMode } = useThemeMode();
    const [activeView, setActiveView] = useState<SettingsView>('main');
    const [isEditing, setIsEditing] = useState(false);

    // Account settings state
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [ghostName, setGhostName] = useState(user?.ghostName || '');
    const [bio, setBio] = useState(user?.bio || '');

    // Privacy settings state
    const [showOnlineStatus, setShowOnlineStatus] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [allowMessages, setAllowMessages] = useState<'everyone' | 'connections' | 'none'>('everyone');

    // Notification settings state
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [emotionalCheckIns, setEmotionalCheckIns] = useState(true);

    const handleSaveAccount = () => {
        // TODO: Save to Firebase
        setIsEditing(false);
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            await logout();
        }
    };

    const handleDeleteAccount = () => {
        if (confirm('⚠️ This will permanently delete your account and all data. This cannot be undone. Are you sure?')) {
            // TODO: Implement account deletion
            alert('Account deletion will be implemented with backend');
        }
    };

    const handleDownloadData = () => {
        // TODO: Implement data export
        alert('Your data export will be ready shortly and sent to your email');
    };

    // Main settings menu
    const mainMenuItems = [
        {
            id: 'account',
            icon: User,
            label: 'Account',
            description: 'Manage your profile and personal info',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'privacy',
            icon: Lock,
            label: 'Privacy & Security',
            description: 'Control who sees what',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'notifications',
            icon: Bell,
            label: 'Notifications',
            description: 'Manage alerts and reminders',
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'appearance',
            icon: Palette,
            label: 'Appearance',
            description: 'Themes and visual preferences',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            id: 'data',
            icon: Database,
            label: 'Data & Storage',
            description: 'Download or delete your data',
            color: 'from-rose-500 to-pink-500'
        },
        {
            id: 'help',
            icon: HelpCircle,
            label: 'Help & Support',
            description: 'FAQs, contact, and feedback',
            color: 'from-violet-500 to-purple-500'
        }
    ];

    return (
        <div className="flex-1 h-full overflow-y-auto bg-theme-primary" onScroll={onScroll}>
            <div className="max-w-2xl mx-auto px-6 py-8 pb-32">
                <AnimatePresence mode="wait">
                    {activeView === 'main' && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-theme-primary mb-2">Settings</h1>
                                <p className="text-theme-tertiary">Manage your account and preferences</p>
                            </div>

                            {/* User Card */}
                            <div className="mb-8 p-6 rounded-3xl bg-theme-secondary border border-theme-primary">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-theme-primary text-lg">{user?.name || 'User'}</h3>
                                        <p className="text-theme-tertiary text-sm">{user?.email || user?.phone || 'No contact info'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Settings Menu */}
                            <div className="space-y-3">
                                {mainMenuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveView(item.id as SettingsView)}
                                        className="w-full p-4 rounded-2xl bg-theme-secondary border border-theme-primary hover:border-theme-focus transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                                                <item.icon size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4 className="font-bold text-theme-primary">{item.label}</h4>
                                                <p className="text-sm text-theme-tertiary">{item.description}</p>
                                            </div>
                                            <ChevronRight size={20} className="text-theme-quaternary group-hover:text-theme-tertiary transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full mt-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 text-red-500 font-bold"
                            >
                                <LogOut size={20} />
                                Log Out
                            </button>
                        </motion.div>
                    )}

                    {/* Account Settings */}
                    {activeView === 'account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => setActiveView('main')}
                                className="mb-6 flex items-center gap-2 text-theme-tertiary hover:text-theme-primary transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                                Back
                            </button>

                            <h2 className="text-2xl font-black text-theme-primary mb-6">Account Settings</h2>

                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <label className="block text-sm font-bold text-theme-secondary mb-3">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-theme-tertiary border border-theme-primary hover:bg-theme-elevated transition-all flex items-center gap-2 text-theme-primary font-semibold">
                                            <Camera size={16} />
                                            Change Photo
                                        </button>
                                    </div>
                                </div>

                                {/* Display Name */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <label className="block text-sm font-bold text-theme-secondary mb-3">Display Name</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            disabled={!isEditing}
                                            className="flex-1 px-4 py-3 rounded-xl bg-theme-primary border border-theme-primary focus:border-theme-focus outline-none text-theme-primary disabled:opacity-50"
                                        />
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveAccount}
                                                    className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setDisplayName(user?.name || '');
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-10 h-10 rounded-xl bg-theme-tertiary border border-theme-primary hover:bg-theme-elevated flex items-center justify-center text-theme-primary transition-colors"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Ghost Name */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <label className="block text-sm font-bold text-theme-secondary mb-3">Ghost Name (Username)</label>
                                    <input
                                        type="text"
                                        value={ghostName}
                                        onChange={(e) => setGhostName(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-theme-primary border border-theme-primary focus:border-theme-focus outline-none text-theme-primary disabled:opacity-50"
                                        placeholder="@username"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <label className="block text-sm font-bold text-theme-secondary mb-3">Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        disabled={!isEditing}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-theme-primary border border-theme-primary focus:border-theme-focus outline-none text-theme-primary disabled:opacity-50 resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                {/* Contact Info */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <label className="block text-sm font-bold text-theme-secondary mb-3">Contact Information</label>
                                    <div className="space-y-3">
                                        {user?.email && (
                                            <div className="flex items-center gap-3 text-theme-tertiary">
                                                <Mail size={18} />
                                                <span>{user.email}</span>
                                            </div>
                                        )}
                                        {user?.phone && (
                                            <div className="flex items-center gap-3 text-theme-tertiary">
                                                <Phone size={18} />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Privacy Settings */}
                    {activeView === 'privacy' && (
                        <motion.div
                            key="privacy"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => setActiveView('main')}
                                className="mb-6 flex items-center gap-2 text-theme-tertiary hover:text-theme-primary transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                                Back
                            </button>

                            <h2 className="text-2xl font-black text-theme-primary mb-6">Privacy & Security</h2>

                            <div className="space-y-4">
                                {/* Online Status */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-theme-primary mb-1">Show Online Status</h4>
                                            <p className="text-sm text-theme-tertiary">Let others see when you're active</p>
                                        </div>
                                        <button
                                            onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                                            className={`w-14 h-8 rounded-full transition-colors ${showOnlineStatus ? 'bg-green-500' : 'bg-theme-tertiary'
                                                } relative`}
                                        >
                                            <div
                                                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${showOnlineStatus ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Read Receipts */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-theme-primary mb-1">Read Receipts</h4>
                                            <p className="text-sm text-theme-tertiary">Show when you've read messages</p>
                                        </div>
                                        <button
                                            onClick={() => setReadReceipts(!readReceipts)}
                                            className={`w-14 h-8 rounded-full transition-colors ${readReceipts ? 'bg-green-500' : 'bg-theme-tertiary'
                                                } relative`}
                                        >
                                            <div
                                                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${readReceipts ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Who Can Message */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <h4 className="font-bold text-theme-primary mb-3">Who Can Message You</h4>
                                    <div className="space-y-2">
                                        {['everyone', 'connections', 'none'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => setAllowMessages(option as typeof allowMessages)}
                                                className={`w-full p-3 rounded-xl border transition-all text-left ${allowMessages === option
                                                    ? 'bg-theme-primary border-accent-primary'
                                                    : 'bg-theme-tertiary border-theme-primary hover:border-theme-focus'
                                                    }`}
                                            >
                                                <span className="font-semibold text-theme-primary capitalize">{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Blocked Users */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <h4 className="font-bold text-theme-primary mb-2">Blocked Users</h4>
                                    <p className="text-sm text-theme-tertiary mb-4">Manage blocked accounts</p>
                                    <button className="px-4 py-2 rounded-xl bg-theme-tertiary border border-theme-primary hover:bg-theme-elevated transition-all text-theme-primary font-semibold">
                                        View Blocked List
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Appearance Settings */}
                    {activeView === 'appearance' && (
                        <motion.div
                            key="appearance"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => setActiveView('main')}
                                className="mb-6 flex items-center gap-2 text-theme-tertiary hover:text-theme-primary transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                                Back
                            </button>

                            <h2 className="text-2xl font-black text-theme-primary mb-6">Appearance</h2>

                            <div className="space-y-4">
                                {/* Theme Selection */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <h4 className="font-bold text-theme-primary mb-4">Theme</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setMode('dark')}
                                            className={`p-4 rounded-xl border-2 transition-all ${mode === 'dark'
                                                ? 'border-accent-primary bg-theme-primary'
                                                : 'border-theme-primary bg-theme-tertiary hover:border-theme-focus'
                                                }`}
                                        >
                                            <Moon size={24} className="mx-auto mb-2 text-theme-primary" />
                                            <span className="text-sm font-semibold text-theme-primary">Dark</span>
                                        </button>

                                        <button
                                            onClick={() => setMode('light')}
                                            className={`p-4 rounded-xl border-2 transition-all ${mode === 'light'
                                                ? 'border-accent-primary bg-theme-primary'
                                                : 'border-theme-primary bg-theme-tertiary hover:border-theme-focus'
                                                }`}
                                        >
                                            <Sun size={24} className="mx-auto mb-2 text-theme-primary" />
                                            <span className="text-sm font-semibold text-theme-primary">Light</span>
                                        </button>

                                        <button
                                            onClick={() => setMode('retro')}
                                            className={`p-4 rounded-xl border-2 transition-all ${mode === 'retro'
                                                ? 'border-accent-primary bg-theme-primary'
                                                : 'border-theme-primary bg-theme-tertiary hover:border-theme-focus'
                                                }`}
                                        >
                                            <Sparkles size={24} className="mx-auto mb-2 text-theme-primary" />
                                            <span className="text-sm font-semibold text-theme-primary">Retro</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Theme Preview */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <h4 className="font-bold text-theme-primary mb-3">Preview</h4>
                                    <div className="p-4 rounded-xl bg-theme-primary border border-theme-primary">
                                        <p className="text-theme-primary mb-2">Primary Text</p>
                                        <p className="text-theme-secondary mb-2">Secondary Text</p>
                                        <p className="text-theme-tertiary">Tertiary Text</p>
                                        <div className="mt-4 flex gap-2">
                                            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--accent-primary)' }} />
                                            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }} />
                                            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--accent-tertiary)' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Data & Storage */}
                    {activeView === 'data' && (
                        <motion.div
                            key="data"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => setActiveView('main')}
                                className="mb-6 flex items-center gap-2 text-theme-tertiary hover:text-theme-primary transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                                Back
                            </button>

                            <h2 className="text-2xl font-black text-theme-primary mb-6">Data & Storage</h2>

                            <div className="space-y-4">
                                {/* Download Data */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <h4 className="font-bold text-theme-primary mb-2">Download Your Data</h4>
                                    <p className="text-sm text-theme-tertiary mb-4">
                                        Get a copy of all your messages, profile info, and activity
                                    </p>
                                    <button
                                        onClick={handleDownloadData}
                                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <Download size={18} />
                                        Request Download
                                    </button>
                                </div>

                                {/* Clear Cache */}
                                <div className="p-6 rounded-2xl bg-theme-secondary border border-theme-primary">
                                    <h4 className="font-bold text-theme-primary mb-2">Clear Cache</h4>
                                    <p className="text-sm text-theme-tertiary mb-4">
                                        Free up space by clearing temporary files
                                    </p>
                                    <button className="px-4 py-2 rounded-xl bg-theme-tertiary border border-theme-primary hover:bg-theme-elevated text-theme-primary font-semibold transition-all">
                                        Clear Cache
                                    </button>
                                </div>

                                {/* Delete Account */}
                                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <h4 className="font-bold text-red-500 mb-2">Delete Account</h4>
                                    <p className="text-sm text-red-400 mb-4">
                                        ⚠️ This action is permanent and cannot be undone
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
