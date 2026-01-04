"use client";

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/shared/GradientThemeProvider';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import {
    MessageSquare,
    Settings,
    LogOut,
    Grid,
    Waves,
    Zap,
    Home,
    Search,
    Gamepad2,
    Palette
} from 'lucide-react';

export const CommandMenu = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();
    const { setMode } = useThemeMode();
    // @ts-ignore - Assuming setTheme is available in your context
    const { setTheme } = useTheme();

    // Toggle the menu when ⌘K or Ctrl+K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Helper to run a command and close the menu
    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-md transition-all font-vt323"
            onClick={(e) => {
                // Close when clicking the backdrop
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="w-full max-w-lg bg-[#0f380f] border-4 border-[#8bac0f] rounded-none shadow-[0_0_0_4px_#306230] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#8bac0f] border-b-4 border-[#306230] px-4 py-2 flex items-center justify-between">
                    <span className="text-[#0f380f] font-press-start text-xs">SYSTEM MENU</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-[#0f380f] opacity-20" />
                        <div className="w-3 h-3 rounded-full bg-[#0f380f] opacity-20" />
                    </div>
                </div>

                <Command.Input
                    placeholder="SELECT VISUAL MODE..."
                    className="w-full px-4 py-4 bg-[#0f380f] text-[#9bbc0f] outline-none placeholder:text-[#306230] text-xl font-vt323 tracking-wider uppercase"
                />

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-[#306230]">
                    <Command.Empty className="py-6 text-center text-[#9bbc0f] text-sm font-vt323">
                        NO MATCHES FOUND.
                    </Command.Empty>

                    <Command.Group heading="VISUALS" className="text-xs font-medium text-[#306230] px-2 py-1.5 mb-1 uppercase tracking-wider mt-2 font-press-start">
                        <Command.Item
                            onSelect={() => runCommand(() => setMode('retro-soul'))}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <Grid className="mr-2 w-5 h-5 text-[#9bbc0f]" />
                            Retro Soul Mode
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => setMode('retro'))}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <Zap className="mr-2 w-5 h-5 text-[#9bbc0f]" />
                            Retro 90s
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => setMode('dark'))}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <Waves className="mr-2 w-5 h-5 text-[#9bbc0f]" />
                            Dark Mode
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="NAVIGATION" className="text-xs font-medium text-[#306230] px-2 py-1.5 mb-1 uppercase tracking-wider mt-4 font-press-start">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push('/'))}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <Home className="mr-2 w-4 h-4" />
                            Home
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push('/#messages'))}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <MessageSquare className="mr-2 w-4 h-4" />
                            Messages
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push('/#settings'))}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <Settings className="mr-2 w-4 h-4" />
                            Settings
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="ACCOUNT" className="text-xs font-medium text-[#306230] px-2 py-1.5 mb-1 uppercase tracking-wider mt-4 font-press-start">
                        <Command.Item
                            onSelect={() => runCommand(() => logout())}
                            className="flex items-center px-2 py-2.5 text-lg text-[#9bbc0f] rounded-md cursor-pointer aria-selected:bg-[#306230] aria-selected:text-[#9bbc0f] transition-colors font-vt323 uppercase tracking-widest"
                        >
                            <LogOut className="mr-2 w-4 h-4" />
                            Log Out
                        </Command.Item>
                    </Command.Group>
                </Command.List>

                <div className="border-t-4 border-[#306230] px-4 py-2 flex items-center justify-between text-[10px] text-[#306230] font-press-start bg-[#8bac0f]">
                    <div className="flex gap-2">
                        <span>↑↓ SELECT</span>
                    </div>
                    <span>↵ ENTER</span>
                </div>
            </div>
        </Command.Dialog>
    );
};