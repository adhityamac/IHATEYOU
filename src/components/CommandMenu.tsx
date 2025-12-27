"use client";

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const CommandMenu = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { logout, updateTheme, user } = useAuth();

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
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm transition-all"
            onClick={(e) => {
                // Close when clicking the backdrop
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full px-4 py-4 bg-transparent border-b border-white/10 text-white outline-none placeholder:text-gray-500 text-lg"
                />

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-gray-800">
                    <Command.Empty className="py-6 text-center text-gray-500 text-sm">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-xs font-medium text-gray-500 px-2 py-1.5 mb-1 uppercase tracking-wider">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push('/'))}
                            className="flex items-center px-2 py-2.5 text-sm text-gray-300 rounded-md cursor-pointer aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                        >
                            <span className="mr-2 text-lg">💬</span>
                            Messages
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push('/settings'))} // Assuming you have a route or modal trigger
                            className="flex items-center px-2 py-2.5 text-sm text-gray-300 rounded-md cursor-pointer aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                        >
                            <span className="mr-2 text-lg">⚙️</span>
                            Settings
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Appearance" className="text-xs font-medium text-gray-500 px-2 py-1.5 mb-1 uppercase tracking-wider mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => updateTheme('liquid'))}
                            className="flex items-center px-2 py-2.5 text-sm text-gray-300 rounded-md cursor-pointer aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                        >
                            <span className="mr-2 text-lg">💧</span>
                            Theme: Vivid Liquid
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => updateTheme('spiral'))}
                            className="flex items-center px-2 py-2.5 text-sm text-gray-300 rounded-md cursor-pointer aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                        >
                            <span className="mr-2 text-lg">🌀</span>
                            Theme: Twisted Void
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => updateTheme('grid'))}
                            className="flex items-center px-2 py-2.5 text-sm text-gray-300 rounded-md cursor-pointer aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                        >
                            <span className="mr-2 text-lg">🕸️</span>
                            Theme: Interactive Grid
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Account" className="text-xs font-medium text-gray-500 px-2 py-1.5 mb-1 uppercase tracking-wider mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => logout())}
                            className="flex items-center px-2 py-2.5 text-sm text-red-400 rounded-md cursor-pointer aria-selected:bg-red-500/10 aria-selected:text-red-300 transition-colors"
                        >
                            <span className="mr-2 text-lg">🚪</span>
                            Log Out
                        </Command.Item>
                    </Command.Group>
                </Command.List>

                <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500">
                    <span>Search for commands...</span>
                    <div className="flex gap-2">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded">↑↓ to navigate</span>
                        <span className="bg-white/5 px-1.5 py-0.5 rounded">↵ to select</span>
                    </div>
                </div>
            </div>
        </Command.Dialog>
    );
};