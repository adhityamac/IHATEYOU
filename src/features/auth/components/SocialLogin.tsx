import { Chrome, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialLoginProps {
    onGoogleClick: () => void;
    onPhoneClick?: () => void;
}

export const SocialLogin = ({ onGoogleClick, onPhoneClick }: SocialLoginProps) => {
    return (
        <div className="w-full pt-8 border-t border-white/5 flex flex-col items-center gap-5">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
                Or connect via
            </p>
            <div className="flex gap-4">
                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onGoogleClick}
                    className="p-3 bg-white/5 rounded-2xl border border-white/10 transition-colors group relative overflow-hidden"
                    title="Google Login"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                    <Chrome className="w-5 h-5 text-white/60 group-hover:text-white relative z-10" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPhoneClick}
                    className="p-3 bg-white/5 rounded-2xl border border-white/10 transition-colors group opacity-40 cursor-not-allowed"
                    title="Phone Login (Coming Soon)"
                >
                    <Smartphone className="w-5 h-5 text-white/60 group-hover:text-white" />
                </motion.button>
            </div>
        </div>
    );
};
