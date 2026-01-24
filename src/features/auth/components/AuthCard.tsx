import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthCardProps {
    children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.2 }}
            className="relative z-10 w-[90%] max-w-[420px] bg-[#0A0A0C]/80 backdrop-blur-3xl border border-white/10 rounded-[48px] p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden"
            style={{
                boxShadow: '0 0 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)'
            }}
        >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-center h-full">
                {children}
            </div>
        </motion.div>
    );
};
