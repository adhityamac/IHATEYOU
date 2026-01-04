'use client';

import { motion } from 'framer-motion';
import { Check, CheckCheck, Eye } from 'lucide-react';

type ReadStatus = 'sent' | 'delivered' | 'read' | 'seen';

interface ReadReceiptProps {
    status: ReadStatus;
    timestamp?: string;
    readers?: string[];
    showDetails?: boolean;
}

export default function ReadReceipt({
    status,
    timestamp,
    readers = [],
    showDetails = false
}: ReadReceiptProps) {
    const getIcon = () => {
        switch (status) {
            case 'sent':
                return <Check size={14} className="text-white/40" />;
            case 'delivered':
                return <CheckCheck size={14} className="text-white/40" />;
            case 'read':
            case 'seen':
                return <CheckCheck size={14} className="text-blue-400" />;
            default:
                return null;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'sent': return 'Sent';
            case 'delivered': return 'Delivered';
            case 'read': return 'Read';
            case 'seen': return 'Seen';
            default: return '';
        }
    };

    return (
        <div className="flex items-center gap-2" title={getStatusText()}>
            {/* Status Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {getIcon()}
            </motion.div>

            {/* Timestamp */}
            {timestamp && (
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {timestamp}
                </span>
            )}

            {/* Read by details */}
            {showDetails && readers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1"
                >
                    <Eye size={12} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        {readers.length === 1
                            ? readers[0]
                            : `${readers.length} people`}
                    </span>
                </motion.div>
            )}
        </div>
    );
}

// Message with Read Receipt
export function MessageWithReceipt({
    content,
    status,
    timestamp,
    isOwn = false
}: {
    content: string;
    status: ReadStatus;
    timestamp: string;
    isOwn?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col gap-2 ${isOwn ? 'items-end' : 'items-start'}`}
        >
            <div className={`max-w-md p-4 rounded-[20px] ${isOwn
                    ? 'bg-white text-black rounded-br-sm'
                    : 'bg-white/10 text-white rounded-bl-sm'
                }`}>
                <p className="font-medium">{content}</p>
            </div>

            {isOwn && (
                <ReadReceipt status={status} timestamp={timestamp} />
            )}
        </motion.div>
    );
}
