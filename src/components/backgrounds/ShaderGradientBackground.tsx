'use client';

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { useState, useEffect } from 'react';
import { Settings2, X, RotateCcw, Save, Play, Trash2, Shuffle, Battery, Zap } from 'lucide-react';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { getPerformanceSettings } from '@/lib/utils/performance';

export default function ShaderGradientBackground() {
    const { mode } = useThemeMode();
    const [mounted, setMounted] = useState(false);
    const [showControls, setShowControls] = useState(false);

    // Get performance settings based on device capabilities
    const perfSettings = getPerformanceSettings();

    const initialParams = {
        color1: "#7530ff",
        color2: "#af35db",
        color3: "#d0bce1",
        uSpeed: 0.4,
        uStrength: perfSettings.enableShadows ? 4 : 2, // Reduce strength on low-end
        uDensity: 1.3,
        uFrequency: 5.5,
        uAmplitude: 1,
        brightness: 1.2,
        reflection: perfSettings.enableBlur ? 0.1 : 0, // Disable reflection on low-end
        grain: perfSettings.enableShaderGrain ? "on" as "on" | "off" : "off" as "on" | "off",
        cAzimuthAngle: 180,
        cPolarAngle: 90,
        cDistance: 3.6,
        rotationX: 0,
        rotationY: 10,
        rotationZ: 50,
        pixelDensity: perfSettings.shaderPixelDensity, // Device-optimized
        frameRate: perfSettings.shaderFrameRate // Device-optimized
    };

    const [params, setParams] = useState(initialParams);
    const [presets, setPresets] = useState<{ name: string, params: typeof initialParams }[]>([]);
    const [newPresetName, setNewPresetName] = useState('');

    // Update colors when theme changes
    useEffect(() => {
        if (mode === 'retro-soul') {
            setParams(prev => ({
                ...prev,
                color1: '#422006',
                color2: '#eab308',
                color3: '#fef9c3',
                grain: 'on'
            }));
        }
    }, [mode]);

    useEffect(() => {
        const saved = localStorage.getItem('shader-presets');
        if (saved) {
            try {
                setPresets(JSON.parse(saved));
            } catch (e) {
                setPresets([{ name: 'Default', params: initialParams }]);
            }
        } else {
            setPresets([{ name: 'Default', params: initialParams }]);
        }
    }, []);

    const handleSavePreset = () => {
        if (!newPresetName.trim()) return;
        const newPreset = { name: newPresetName, params: { ...params } };
        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        localStorage.setItem('shader-presets', JSON.stringify(updatedPresets));
        setNewPresetName('');
    };

    const handleLoadPreset = (presetParams: typeof initialParams) => {
        setParams(presetParams);
    };

    const handleDeletePreset = (name: string) => {
        const updatedPresets = presets.filter(p => p.name !== name);
        setPresets(updatedPresets);
        localStorage.setItem('shader-presets', JSON.stringify(updatedPresets));
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (key: keyof typeof params, value: any) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setParams(initialParams);
    };

    const handleRandomize = () => {
        const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

        setParams(prev => ({
            ...prev,
            color1: getRandomColor(),
            color2: getRandomColor(),
            color3: getRandomColor(),
            uSpeed: getRandom(0.1, 1.5),
            uStrength: getRandom(1, 8),
            uDensity: getRandom(0.5, 4),
            uFrequency: getRandom(0, 10),
            brightness: getRandom(0.8, 2),
            reflection: getRandom(0, 0.5),
            rotationX: getRandom(-180, 180),
            rotationY: getRandom(-180, 180),
            rotationZ: getRandom(-180, 180),
        }));
    };

    const togglePerformance = () => {
        setParams(prev => ({
            ...prev,
            pixelDensity: prev.pixelDensity < 1 ? 1 : 0.6,
            frameRate: prev.frameRate < 30 ? 60 : 24,
            grain: prev.grain === "on" ? "off" : "on",
            reflection: prev.reflection > 0 ? 0 : 0.1
        }));
    };

    return (
        <>
            <div className="fixed inset-0 -z-10">
                <ShaderGradientCanvas
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
                    pixelDensity={params.pixelDensity}
                    fov={45}
                >
                    <ShaderGradient
                        animate="on"
                        brightness={params.brightness}
                        cAzimuthAngle={params.cAzimuthAngle}
                        cDistance={params.cDistance}
                        cPolarAngle={params.cPolarAngle}
                        cameraZoom={1}
                        color1={params.color1}
                        color2={params.color2}
                        color3={params.color3}
                        envPreset="city"
                        grain={params.grain}
                        lightType="3d"
                        positionX={-1.4}
                        positionY={0}
                        positionZ={0}
                        range="disabled"
                        rangeEnd={40}
                        rangeStart={0}
                        reflection={params.reflection}
                        rotationX={params.rotationX}
                        rotationY={params.rotationY}
                        rotationZ={params.rotationZ}
                        shader="defaults"
                        type="plane"
                        uAmplitude={params.uAmplitude}
                        uDensity={params.uDensity}
                        uFrequency={params.uFrequency}
                        uSpeed={params.uSpeed}
                        uStrength={params.uStrength}
                        uTime={0}
                        wireframe={false}
                    />
                </ShaderGradientCanvas>
            </div>

            {mounted && createPortal(
                <>
                    {/* Control Toggle */}
                    <div className="fixed bottom-8 right-8 z-[9999] pointer-events-auto">
                        <button
                            onClick={() => setShowControls(!showControls)}
                            className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all shadow-2xl group"
                        >
                            {showControls ? <X size={20} /> : <Settings2 size={20} className="group-hover:rotate-90 transition-transform duration-500" />}
                        </button>
                    </div>

                    {/* Control Panel */}
                    <AnimatePresence>
                        {showControls && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                className="fixed bottom-24 right-8 z-[9999] w-80 max-h-[70vh] overflow-y-auto custom-scrollbar bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl pointer-events-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Shader Controls</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">v2.0 Active</span>
                                        <button onClick={togglePerformance} className={`p-2 rounded-lg transition-colors ${params.pixelDensity < 1 ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 text-white/40 hover:text-white'}`} title="Performance Mode">
                                            {params.pixelDensity < 1 ? <Battery size={14} /> : <Zap size={14} />}
                                        </button>
                                        <button onClick={handleRandomize} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Randomize">
                                            <Shuffle size={14} />
                                        </button>
                                        <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Reset">
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Presets</h3>
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                value={newPresetName}
                                                onChange={(e) => setNewPresetName(e.target.value)}
                                                placeholder="New Preset Name"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 placeholder:text-white/20"
                                                onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                                            />
                                            <button
                                                onClick={handleSavePreset}
                                                disabled={!newPresetName.trim()}
                                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Save Preset"
                                            >
                                                <Save size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                            {presets.map((preset, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 group transition-colors">
                                                    <span className="text-xs text-white/80 truncate font-medium">{preset.name}</span>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleLoadPreset(preset.params)} className="p-1.5 rounded-md hover:bg-green-500/20 text-white/60 hover:text-green-400 transition-colors" title="Load">
                                                            <Play size={12} />
                                                        </button>
                                                        <button onClick={() => handleDeletePreset(preset.name)} className="p-1.5 rounded-md hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors" title="Delete">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Colors</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <ColorInput value={params.color1} onChange={v => handleChange('color1', v)} />
                                            <ColorInput value={params.color2} onChange={v => handleChange('color2', v)} />
                                            <ColorInput value={params.color3} onChange={v => handleChange('color3', v)} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Motion</h3>
                                        <div className="space-y-5">
                                            <ControlSlider label="Speed" value={params.uSpeed} min={0} max={2} step={0.1} onChange={v => handleChange('uSpeed', v)} />
                                            <ControlSlider label="Strength" value={params.uStrength} min={0} max={10} step={0.1} onChange={v => handleChange('uStrength', v)} />
                                            <ControlSlider label="Density" value={params.uDensity} min={0} max={5} step={0.1} onChange={v => handleChange('uDensity', v)} />
                                            <ControlSlider label="Frequency" value={params.uFrequency} min={0} max={10} step={0.1} onChange={v => handleChange('uFrequency', v)} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Camera & Light</h3>
                                        <div className="space-y-5">
                                            <ControlSlider label="Brightness" value={params.brightness} min={0} max={3} step={0.1} onChange={v => handleChange('brightness', v)} />
                                            <ControlSlider label="Reflection" value={params.reflection} min={0} max={1} step={0.01} onChange={v => handleChange('reflection', v)} />
                                            <ControlSlider label="Distance" value={params.cDistance} min={0} max={20} step={0.1} onChange={v => handleChange('cDistance', v)} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Rotation</h3>
                                        <div className="space-y-5">
                                            <ControlSlider label="X" value={params.rotationX} min={-180} max={180} step={1} onChange={v => handleChange('rotationX', v)} />
                                            <ControlSlider label="Y" value={params.rotationY} min={-180} max={180} step={1} onChange={v => handleChange('rotationY', v)} />
                                            <ControlSlider label="Z" value={params.rotationZ} min={-180} max={180} step={1} onChange={v => handleChange('rotationZ', v)} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Performance</h3>
                                        <div className="space-y-5">
                                            <ControlSlider label="Resolution" value={params.pixelDensity} min={0.1} max={2} step={0.1} onChange={v => handleChange('pixelDensity', v)} />
                                            <ControlSlider label="FPS Limit" value={params.frameRate} min={1} max={60} step={1} onChange={v => handleChange('frameRate', v)} />
                                            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-white/60"><span className="flex-1">Grain Effect</span><button onClick={() => handleChange('grain', params.grain === 'on' ? 'off' : 'on')} className={`px-3 py-1 rounded-full ${params.grain === 'on' ? 'bg-white text-black' : 'bg-white/10'}`}>{params.grain}</button></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}
        </>
    );
}

function ColorInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    return (
        <div className="relative h-10 rounded-xl overflow-hidden border border-white/10 group">
            <input
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
            />
        </div>
    );
}

function ControlSlider({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (val: number) => void }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-white/60 font-bold">{label}</span>
                <span className="text-white/40 font-mono">{value.toFixed(1)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
            />
        </div>
    );
}
