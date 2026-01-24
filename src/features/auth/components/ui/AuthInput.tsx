import { motion } from 'framer-motion';
import { ComponentProps } from 'react';

interface AuthInputProps extends ComponentProps<typeof motion.input> {
    label?: string;
}


export const AuthInput = ({ label, className, ...props }: AuthInputProps) => {
    return (
        <div className="relative group">
            <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full bg-[#151518]/50 border border-white/5 rounded-2xl px-6 py-4 text-center text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-[#1A1A1D] transition-all duration-300 font-medium 
                hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] focus:shadow-[0_0_40px_rgba(255,255,255,0.1)]
                ${className}`}
                {...props}
            />

            {/* Focus Glow Line */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent w-0 group-focus-within:w-2/3 transition-all duration-500"
            />
            {label && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 bg-[#0A0A0C] text-[10px] uppercase tracking-widest text-white/40 font-bold opacity-0 group-focus-within:opacity-100 transition-opacity">
                    {label}
                </span>
            )}
        </div>
    );
};
