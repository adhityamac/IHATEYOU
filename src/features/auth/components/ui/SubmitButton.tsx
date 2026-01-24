import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ComponentProps } from 'react';

interface SubmitButtonProps extends ComponentProps<typeof motion.button> {
    isLoading?: boolean;
    label: string;
}


export const SubmitButton = ({ isLoading, label, disabled, className, ...props }: SubmitButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || disabled}
            className={`w-full bg-white text-black py-4 rounded-full font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#E0E0E0] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] duration-300 ${className}`}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <>
                        Connecting <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                ) : (
                    <>
                        {label}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                    </>
                )}
            </span>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0" />
        </motion.button>
    );
};
