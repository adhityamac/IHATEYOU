'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, Zap, X, Check, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    avatar?: string;
    timestamp: Date;
    isRead: boolean;
    actionUrl?: string;
}

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
    onClick?: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onRead, onDelete, onClick }: NotificationItemProps) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'like':
                return <Heart size={20} className="text-red-500" />;
            case 'comment':
                return <MessageCircle size={20} className="text-blue-500" />;
            case 'follow':
                return <UserPlus size={20} className="text-green-500" />;
            case 'mention':
                return <Zap size={20} className="text-yellow-500" />;
            case 'system':
                return <Bell size={20} className="text-purple-500" />;
        }
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${notification.isRead
                    ? 'bg-white/5 border-white/5'
                    : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20'
                }`}
            onClick={() => onClick?.(notification)}
        >
            <div className="flex items-start gap-4">
                {/* Avatar or Icon */}
                <div className="relative shrink-0">
                    {notification.avatar ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                            <img src={notification.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            {getIcon()}
                        </div>
                    )}
                    {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm mb-1">{notification.title}</h4>
                    <p className="text-white/60 text-sm line-clamp-2">{notification.message}</p>
                    <span className="text-white/40 text-xs mt-2 inline-block">
                        {getTimeAgo(notification.timestamp)}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRead(notification.id);
                            }}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Mark as read"
                        >
                            <Check size={16} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(notification.id);
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'like',
            title: 'New Like',
            message: 'Luna liked your emotional check-in post',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
            timestamp: new Date(Date.now() - 300000),
            isRead: false,
        },
        {
            id: '2',
            type: 'comment',
            title: 'New Comment',
            message: 'Echo replied to your post: "I feel this deeply..."',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=echo',
            timestamp: new Date(Date.now() - 600000),
            isRead: false,
        },
        {
            id: '3',
            type: 'follow',
            title: 'New Follower',
            message: 'Pixel started following you',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel',
            timestamp: new Date(Date.now() - 3600000),
            isRead: true,
        },
        {
            id: '4',
            type: 'system',
            title: 'Daily Streak!',
            message: 'You\'ve maintained your check-in streak for 7 days! 🔥',
            timestamp: new Date(Date.now() - 7200000),
            isRead: true,
        },
    ]);

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Notification Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/10 z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Bell size={24} className="text-white" />
                                        {unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                {unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-black text-white">Notifications</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${filter === 'all'
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                                        }`}
                                >
                                    All ({notifications.length})
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${filter === 'unread'
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                                        }`}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        {notifications.length > 0 && (
                            <div className="px-6 py-3 flex gap-2 border-b border-white/10">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                                <button
                                    onClick={clearAll}
                                    className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors ml-auto"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            <AnimatePresence mode="popLayout">
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map(notification => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onRead={markAsRead}
                                            onDelete={deleteNotification}
                                            onClick={(n) => {
                                                if (!n.isRead) markAsRead(n.id);
                                                if (n.actionUrl) {
                                                    // Navigate to action URL
                                                    console.log('Navigate to:', n.actionUrl);
                                                }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center py-20"
                                    >
                                        <Bell size={64} className="text-white/20 mb-4" />
                                        <h3 className="text-xl font-bold text-white/40 mb-2">
                                            {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                                        </h3>
                                        <p className="text-white/30 text-sm">
                                            {filter === 'unread'
                                                ? 'You\'ve read all your notifications'
                                                : 'You don\'t have any notifications yet'}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Notification Hook for easy usage
export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const showNotification = (title: string, message: string, type: NotificationType = 'system') => {
        addNotification({ title, message, type });
    };

    return {
        notifications,
        addNotification,
        showNotification,
        unreadCount: notifications.filter(n => !n.isRead).length,
    };
}
