'use client';

import { motion } from 'framer-motion';
import { CloudRain, Wind, Droplets } from 'lucide-react';

export default function WeatherWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                            <CloudRain size={20} />
                        </div>
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Local Atmosphere</h3>
                    </div>
                    <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
                        Sector 7 • Neon District
                    </p>
                </div>

                <div className="flex items-center gap-12">
                    <div className="text-center">
                        <div className="text-5xl font-black text-white italic tracking-tighter">18°</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Heavy Mist</div>
                    </div>

                    <div className="flex gap-8 border-l border-white/10 pl-8">
                        <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                                <Wind size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Wind</span>
                            </div>
                            <div className="text-lg font-bold text-white">12 <span className="text-xs text-white/40">km/h</span></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                                <Droplets size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Humidity</span>
                            </div>
                            <div className="text-lg font-bold text-white">84 <span className="text-xs text-white/40">%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}