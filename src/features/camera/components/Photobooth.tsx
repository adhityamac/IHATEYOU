'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
// import Webcam from 'react-webcam'; // Removed
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Save, X, Mic, Play, Trash2, Lock, Unlock, Image as ImageIcon, ChevronRight, ChevronLeft, Download, Wand2, Sticker as StickerIcon, Palette } from 'lucide-react';
import { Interactive } from '@/components/ui/Interactive';
import { PhotogradientBackground } from '@/components/backgrounds/PhotogradientBackground';
import { LayoutConfig, PHOTOBOOTH_LAYOUTS } from '@/features/camera/utils/layoutConfig';
import { generatePhotoStrip, Sticker, PhotoFilter } from '@/features/camera/utils/canvasGenerator';
import { nanoid } from 'nanoid';

type BoothStep = 'SELECTION' | 'CAPTURE' | 'REVIEW';

const FILTERS: { id: PhotoFilter; name: string; css: string }[] = [
    { id: 'none', name: 'Normal', css: '' },
    { id: 'solace', name: 'Solace', css: 'grayscale(100%) contrast(120%) brightness(90%)' },
    { id: 'dreamy', name: 'Dreamy', css: 'brightness(110%) saturate(80%) sepia(20%) blur(0.5px)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(80%) contrast(90%) brightness(90%)' },
];

const STICKER_PACK = [
    { emoji: '🎀', name: 'Bow' },
    { emoji: '✨', name: 'Sparkle' },
    { emoji: '💖', name: 'Heart' },
    { emoji: '🧸', name: 'Bear' },
    { emoji: '🍯', name: 'Honey' },
    { emoji: '👑', name: 'Crown' },
];

export default function Photobooth() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State Machine
    const [step, setStep] = useState<BoothStep>('CAPTURE'); // Default to CAPTURE (Immersive)
    const [selectedLayout, setSelectedLayout] = useState<LayoutConfig>(PHOTOBOOTH_LAYOUTS[0]);
    const [sessionPhotos, setSessionPhotos] = useState<string[]>([]);
    const [showStartButton, setShowStartButton] = useState(true);

    // ... device state ...

    // ... capture loop ...

    // --- RENDER STEPS ---

    // 1. CAPTURE SCREEN (Main Interface)
    const renderCapture = () => (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden"
        >
            {permissionDenied ? (
                // Error State UI
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center space-y-4 z-50">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                        <Camera size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-serif">Camera Error</h3>
                    <p className="opacity-70 max-w-xs text-sm">
                        {typeof permissionDenied === 'string' ? permissionDenied : 'Camera access denied.'}
                    </p>

                    {devices.length > 0 && (
                        <select
                            className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm border border-white/20"
                            value={activeDeviceId}
                            onChange={(e) => {
                                const id = e.target.value;
                                setActiveDeviceId(id);
                                addLog(`Switched device in error screen: ${id}`);
                                setPermissionDenied(false);
                            }}
                        >
                            <option value="">-- Switch Camera --</option>
                            {devices.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 4)}...`}</option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={() => {
                            setPermissionDenied(false);
                            // No selection screen to go back to, so just retry
                            window.location.reload();
                        }}
                        className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        Reload App
                    </button>

                    <div className="w-full max-w-xs h-32 bg-gray-900 text-red-400 text-[10px] p-2 rounded overflow-y-auto font-mono text-left mt-4 border border-red-900/50">
                        {debugLogs.map((log, i) => <div key={i}>{log}</div>)}
                    </div>
                </div>
            ) : (
                <>
                    {/* Main Video Feed - Full Screen (Native WebRTC) */}
                    <video
                        ref={(el) => {
                            // Assign ref for React
                            videoRef.current = el;
                            // Also assign to internal ref if needed, but we use videoRef for screenshots too?
                            // validation: create a canvas for screenshots if we remove Webcam component
                        }}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover absolute inset-0 transform scale-x-[-1]"
                        style={{
                            transform: 'scaleX(-1)',
                            filter: FILTERS.find(f => f.id === activeFilter)?.css || 'none',
                            transition: 'filter 0.5s ease'
                        }}
                        onCanPlay={() => {
                            addLog('Video can play');
                            setShowStartButton(false);
                        }}
                        onLoadedMetadata={() => addLog('Video metadata loaded')}
                        onError={(e) => addLog(`Video error: ${e.currentTarget.error?.message || 'unknown'}`)}
                    />

                    {/* Start Camera Button (shown when camera hasn't started) */}
                    {showStartButton && !permissionDenied && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black z-40"
                        >
                            <button
                                onClick={requestCamera}
                                className="flex flex-col items-center gap-4 p-8 bg-black/80 backdrop-blur-md rounded-3xl border border-white/20"
                            >
                                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                                    <Camera size={40} className="text-white" />
                                </div>
                                <div className="text-white text-center">
                                    <h3 className="text-xl font-bold mb-2">Start Camera</h3>
                                    <p className="text-sm opacity-70">Click to enable your camera</p>
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* Overlays */}
                    <div className="absolute top-0 right-0 p-8 z-10 pointer-events-none">
                        {/* Layout Selector (Small Gear/Toggle) */}
                        <div className="pointer-events-auto bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold font-serif flex items-center gap-2 cursor-pointer hover:bg-black/50 transition-colors"
                            onClick={() => {
                                // Cycle layouts
                                const currentIndex = PHOTOBOOTH_LAYOUTS.findIndex(l => l.id === selectedLayout.id);
                                const nextIndex = (currentIndex + 1) % PHOTOBOOTH_LAYOUTS.length;
                                setSelectedLayout(PHOTOBOOTH_LAYOUTS[nextIndex]);
                            }}
                        >
                            <span className="text-xs uppercase opacity-70">Layout</span>
                            <span>{selectedLayout.name}</span>
                        </div>
                    </div>

                    {/* Pose Counter (Only during active sequence) */}
                    {sessionPhotos.length > 0 && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg z-20 animate-pulse">
                            Pose {sessionPhotos.length + 1} / {selectedLayout.poses}
                        </div>
                    )}

                    {/* Countdown Overlay */}
                    <AnimatePresence>
                        {countdown !== null && countdown > 0 && (
                            <motion.div
                                key={countdown}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                className={`absolute inset-0 flex items-center justify-center text-[12rem] font-black text-white drop-shadow-2xl z-30 pointer-events-none`}
                            >
                                {countdown}
                            </motion.div>
                        )}
                        {countdown === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white z-40"
                            />
                        )}
                    </AnimatePresence>

                    {/* Floating Bottom Dock */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-end z-20 pointer-events-none">
                        <div className="flex flex-col items-center gap-6 pointer-events-auto bg-black/20 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl mb-4">

                            {/* Live Filter Scroller */}
                            <div className="flex items-center gap-2 overflow-x-auto max-w-[80vw] pb-2 custom-scrollbar">
                                {FILTERS.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`flex flex-col items-center gap-1 min-w-[50px] transition-all ${activeFilter === f.id ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'}`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full border-2 ${activeFilter === f.id ? 'border-pink-500' : 'border-white'} bg-gray-500`}
                                            style={{ filter: f.css }}
                                        />
                                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">{f.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-8">
                                {/* Device Selector */}

                                {/* Device Selector (Small Text) */}
                                {devices.length > 1 && (
                                    <select
                                        className="bg-black/30 text-white/50 text-[10px] px-2 py-1 rounded-full outline-none backdrop-blur-md border border-white/5 hover:bg-black/50 cursor-pointer"
                                        value={activeDeviceId}
                                        onChange={(e) => setActiveDeviceId(e.target.value)}
                                    >
                                        <option value="">Switch Camera</option>
                                        {devices.map(d => (
                                            <option key={d.deviceId} value={d.deviceId}>{d.label || `Cam ${d.deviceId.slice(0, 4)}`}</option>
                                        ))}
                                    </select>
                                )}

                                {/* Capture Button */}
                                <Interactive className="scale-110">
                                    <button
                                        onClick={startCaptureSequence}
                                        disabled={countdown !== null}
                                        className={`w-20 h-20 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center transition-all 
                                    ${countdown !== null ? 'bg-gray-400 scale-90' : 'bg-red-500 hover:scale-105 hover:bg-red-600'}
                                `}
                                    >
                                        <Camera size={32} className="text-white drop-shadow-md" />
                                    </button>
                                </Interactive>

                            </div>
                        </div>
                    </div>

                </>
            )}
        </motion.div>
    );

    const [permissionDenied, setPermissionDenied] = useState<boolean | string>(false);

    // Editor State
    const [finalStrip, setFinalStrip] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<PhotoFilter>('none');
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [editorTab, setEditorTab] = useState<'filter' | 'sticker'>('filter');

    // Capture Logic
    const [countdown, setCountdown] = useState<number | null>(null);
    const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);

    // Legacy/Hidden Features
    const [isGoofyMode, setIsGoofyMode] = useState(false);
    const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

    // --- THEME ENGINE ---
    const theme = isGoofyMode ? {
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        accent: 'bg-purple-200',
        button: 'bg-purple-500 text-white',
        card: 'bg-white/80 backdrop-blur-md shadow-soft-xl border border-purple-200',
    } : {
        bg: 'bg-pink-50',
        text: 'text-pink-900',
        accent: 'bg-pink-200',
        button: 'bg-pink-500 text-white',
        card: 'bg-white shadow-soft-xl',
    };

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);

    // Debug State
    const [debugLogs, setDebugLogs] = useState<string[]>([]);
    const [showDebug, setShowDebug] = useState(false);

    // Manual camera start function (for user-initiated camera)
    const requestCamera = useCallback(async () => {
        try {
            addLog('User requested camera access');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

            // Get devices after permission granted
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = deviceList.filter(d => d.kind === 'videoinput');
            setDevices(videoInputs);

            if (videoInputs.length > 0) {
                setActiveDeviceId(videoInputs[0].deviceId);
                // The stream effect will pick up the deviceId and set up the video
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }
            stream.getTracks().forEach(t => t.stop()); // Clean up, will be re-created by effect
        } catch (err: any) {
            addLog(`Manual camera request failed: ${err.message}`);
            setPermissionDenied(err.message);
        }
    }, []);

    const addLog = (msg: string) => {
        setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
        console.log(msg);
    };

    useEffect(() => {
        const checkDevices = async () => {
            addLog(`URL: ${window.location.href}`);
            addLog(`Secure Context: ${window.isSecureContext}`);

            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                const msg = "Camera API missing. Not supported or non-secure context.";
                setPermissionDenied(msg);
                addLog(msg);
                return;
            }

            try {
                // First, try to get permission to enumerate with labels
                // Some browsers require permission before returning labels
                try {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                } catch (e) {
                    // Permission denied, but we can still enumerate
                    addLog('Initial permission request for labels failed, continuing anyway');
                }

                const deviceList = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = deviceList.filter(d => d.kind === 'videoinput');

                addLog(`Found ${videoInputs.length} camera devices`);
                setDevices(videoInputs);

                if (videoInputs.length > 0) {
                    // Select first available camera
                    if (!activeDeviceId) {
                        const preferredDevice = videoInputs.find(d => d.label.toLowerCase().includes('front'))
                            || videoInputs[0];
                        setActiveDeviceId(preferredDevice.deviceId);
                        addLog(`Selected device: ${preferredDevice.label || preferredDevice.deviceId}`);
                    }
                } else {
                    setPermissionDenied("No camera devices found.");
                }
            } catch (err: any) {
                const msg = "Error enumerating: " + err.message;
                setPermissionDenied(msg);
                addLog(msg);
            }
        };

        // Small delay to ensure page is ready
        const timer = setTimeout(checkDevices, 100);
        return () => clearTimeout(timer);
    }, []);

    // --- NATIVE WEBRTC STREAM HANDLING ---
    useEffect(() => {
        let isMounted = true;
        let stream: MediaStream | null = null;

        const startStream = async () => {
            // Wait for device to be selected (ignore empty string, that's just a trigger)
            if (!activeDeviceId || activeDeviceId === '') {
                addLog('Waiting for valid device ID...');
                return;
            }

            // Stop previous stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            // Clear video element to prevent stale frames
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            try {
                addLog(`Requesting stream for device: ${activeDeviceId}`);

                try {
                    // Try specific device first
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            deviceId: activeDeviceId ? { exact: activeDeviceId } : undefined,
                            width: { ideal: 1920 },
                            height: { ideal: 1080 }
                        },
                        audio: false
                    });
                } catch (specificErr) {
                    addLog(`Specific device failed, trying generic request... (${specificErr})`);
                    // Fallback: Try ANY camera
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });
                }

                if (!isMounted) {
                    if (stream) stream.getTracks().forEach(t => t.stop());
                    return;
                }

                if (stream) {
                    streamRef.current = stream;

                    // Important: Set video srcObject after stream is ready
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        // Ensure video plays
                        await videoRef.current.play().catch(e =>
                            addLog(`Video play error: ${e.message}`)
                        );
                    }

                    setPermissionDenied(false);
                    addLog(`Stream started successfully: ${stream.id}, active: ${stream.active}`);
                }

                // Refresh device list to get labels now that we have permission
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoInputs = devices.filter(d => d.kind === 'videoinput');
                    setDevices(videoInputs);
                    addLog(`Refresh Devices: Found ${videoInputs.length} (Labels: ${videoInputs.map(d => d.label).join(', ')})`);
                } catch (e) {
                    addLog(`Failed to refresh devices: ${e}`);
                }

            } catch (err: any) {
                const errorName = err.name;
                const errorMsg = err.message;
                addLog(`Stream Fatal Error: ${errorName} - ${errorMsg}`);

                let userMessage = "Camera access failed.";

                if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
                    userMessage = "Permission denied. Check browser settings.";
                } else if (errorName === 'NotFoundError') {
                    userMessage = "No camera found.";
                } else if (errorName === 'NotReadableError') {
                    userMessage = "Camera is busy (Zoom/Teams?).";
                } else {
                    userMessage = `${errorName}: ${errorMsg}`;
                }
                setPermissionDenied(userMessage);
            }
        };

        startStream();

        return () => {
            isMounted = false;
            // Properly stop all tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [activeDeviceId]);

    // --- CAPTURE LOOP ---
    const startCaptureSequence = () => {
        setStep('CAPTURE');
        setSessionPhotos([]);
        setCurrentPoseIndex(0);
        // Reset Editor State
        setActiveFilter('none');
        setStickers([]);
        setFinalStrip(null);
        startCountdown();
    };

    const startCountdown = () => {
        setCountdown(3);
    };

    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            capturePhoto();
        }
    }, [countdown]);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current) return;

        // Manual Capture via Canvas
        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Mirror the capture (since we mirror the preview)
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0);

                const imageSrc = canvas.toDataURL('image/jpeg');

                // Trigger Flash
                setIsFlashing(true);
                setTimeout(() => setIsFlashing(false), 150);

                setSessionPhotos(prev => {
                    const updated = [...prev, imageSrc];
                    if (updated.length < selectedLayout.poses) {
                        setCurrentPoseIndex(updated.length);
                        setTimeout(() => startCountdown(), 1000);
                    } else {
                        setTimeout(() => setStep('REVIEW'), 500);
                    }
                    return updated;
                });
            }
        } catch (e) {
            console.error("Capture failed", e);
        }
        setCountdown(null);
    }, [selectedLayout]);

    // --- CANVAS GENERATION ---
    useEffect(() => {
        if (step === 'REVIEW' && sessionPhotos.length === selectedLayout.poses) {
            // Generate initial strip without edits to show something
            // Then re-generate when edits change
            generatePhotoStrip(sessionPhotos, selectedLayout, activeFilter, stickers).then(setFinalStrip);
        }
    }, [step, sessionPhotos, selectedLayout, activeFilter, stickers]); // React to edits

    // --- STICKER LOGIC ---
    const addSticker = (emoji: string) => {
        const newSticker: Sticker = {
            id: nanoid(),
            emoji,
            x: 0.5, // Center
            y: 0.5,
            scale: 1,
            rotation: 0
        };
        setStickers([...stickers, newSticker]);
    };

    const removeSticker = (id: string) => {
        setStickers(stickers.filter(s => s.id !== id));
    };

    const handleDragEnd = (id: string, info: any) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // info.point is client coordinates. We need relative to container.
        const x = (info.point.x - rect.left) / rect.width;
        const y = (info.point.y - rect.top) / rect.height;

        setStickers(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
    };


    // --- HELPERS ---
    const handleTouchStart = () => {
        const timer = setTimeout(() => setIsGoofyMode(!isGoofyMode), 1000);
        setPressTimer(timer);
    };
    const handleTouchEnd = () => {
        if (pressTimer) clearTimeout(pressTimer);
    };


    const renderReview = () => (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center h-full w-full p-6 bg-transparent overflow-hidden"
        >
            {/* Main Preview Area */}
            <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
                <div
                    ref={containerRef}
                    className="relative shadow-2xl rounded-sm overflow-hidden max-h-full max-w-full"
                    style={{ aspectRatio: selectedLayout.width / selectedLayout.height }}
                >
                    {finalStrip ? (
                        <img src={finalStrip} alt="Photo Strip" className="w-full h-full object-contain pointer-events-none select-none" />
                    ) : (
                        <div className="w-64 h-96 flex items-center justify-center bg-white">
                            <RefreshCw className="animate-spin text-pink-300" />
                        </div>
                    )}

                    {/* Draggable Stickers Layer - Positioned absolutely over the image container */}
                    {/* To do this right, we need the containerRef bounds to be exactly the image bounds. 
                     The style={{ aspectRatio }} helps.
                     We render stickers relative to this container.
                  */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="relative" style={{
                            aspectRatio: selectedLayout.width / selectedLayout.height,
                            height: '100%',
                            maxHeight: '70vh', // Match image constraints
                        }}>
                            {stickers.map(sticker => (
                                <motion.div
                                    key={sticker.id}
                                    drag
                                    dragMomentum={false}
                                    dragConstraints={containerRef} // Constraints to parent
                                    onDragEnd={(e, info) => handleDragEnd(sticker.id, info)}
                                    initial={{ x: 0, y: 0 }} // We'd need to map % back to px if re-mounting. 
                                    // Simplified: Just use drag and don't reset position on re-render.
                                    // Actually, for the Pilot, let's just use simple centralized positioning.
                                    className="absolute cursor-move pointer-events-auto text-4xl select-none"
                                    style={{
                                        left: `${sticker.x * 100}%`,
                                        top: `${sticker.y * 100}%`,
                                        marginLeft: '-1rem', // Center pivot
                                        marginTop: '-1rem'
                                    }}
                                >
                                    {sticker.emoji}
                                    <button
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 opacity-0 hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); removeSticker(sticker.id); }}
                                    >
                                        <X size={8} className="text-white" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Toolbar */}
            <div className="w-full max-w-md mt-4 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                <div className="flex gap-4 mb-4 border-b border-black/5 pb-2">
                    <button
                        onClick={() => setEditorTab('filter')}
                        className={`flex-1 pb-2 text-sm font-bold uppercase tracking-wider ${editorTab === 'filter' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400'}`}
                    >
                        Filters
                    </button>
                    <button
                        onClick={() => setEditorTab('sticker')}
                        className={`flex-1 pb-2 text-sm font-bold uppercase tracking-wider ${editorTab === 'sticker' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400'}`}
                    >
                        Stickers
                    </button>
                </div>

                <div className="h-16 flex items-center gap-2 overflow-x-auto custom-scrollbar">
                    {editorTab === 'filter' && FILTERS.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`flex flex-col items-center gap-1 min-w-[60px] ${activeFilter === f.id ? 'opacity-100 scale-105' : 'opacity-60 grayscale'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                                style={{ backgroundImage: `url(${sessionPhotos[0]})`, filter: f.css }} // Preview first photo
                            />
                            <span className="text-[10px] font-bold">{f.name}</span>
                        </button>
                    ))}

                    {editorTab === 'sticker' && STICKER_PACK.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => addSticker(s.emoji)}
                            className="text-3xl hover:scale-125 transition-transform p-2"
                        >
                            {s.emoji}
                        </button>
                    ))}
                </div>
            </div>

            {/* Post-Capture Actions */}
            <div className="w-full max-w-md mt-4 flex gap-4 justify-center">
                <button
                    onClick={() => {
                        setStep('CAPTURE'); // Go back to immersive mode
                        setSessionPhotos([]);
                    }}
                    className="px-8 py-4 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 flex items-center gap-2"
                >
                    <RefreshCw size={20} />
                    New Photo
                </button>

                <a
                    href={finalStrip || '#'}
                    download={`photobooth-${Date.now()}.png`}
                    className={`px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 ${theme.button} ${!finalStrip ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                        if (!finalStrip) e.preventDefault();
                    }}
                >
                    <Download size={20} />
                    Save Strip
                </a>
            </div>
        </motion.div>
    );

    return (
        <PhotogradientBackground className="w-full h-full font-serif" showLiquid={true} intensity={1.5}>
            {/* Goofy Mode Toggle (Hidden) */}
            <button
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="absolute top-4 left-4 z-50 text-white/10 hover:text-white/30 transition-colors"
                aria-label="Toggle Goofy Mode"
            >
                {isGoofyMode ? <Unlock size={24} /> : <Lock size={24} />}
            </button>

            <AnimatePresence mode="wait">
                {step === 'CAPTURE' && renderCapture()}
                {step === 'REVIEW' && renderReview()}
            </AnimatePresence>
        </PhotogradientBackground>
    );
}
