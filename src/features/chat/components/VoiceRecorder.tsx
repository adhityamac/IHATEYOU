'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
    onSend: (audioBlob: Blob, duration: number) => void;
    onCancel?: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                timerRef.current = setInterval(() => {
                    setDuration(prev => prev + 1);
                }, 1000);
            } else {
                mediaRecorderRef.current.pause();
                if (timerRef.current) clearInterval(timerRef.current);
            }
            setIsPaused(!isPaused);
        }
    };

    const playAudio = () => {
        if (audioBlob) {
            if (!audioRef.current) {
                audioRef.current = new Audio(URL.createObjectURL(audioBlob));
                audioRef.current.onended = () => setIsPlaying(false);
            }

            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        setDuration(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
    };

    const sendVoiceMessage = () => {
        if (audioBlob) {
            onSend(audioBlob, duration);
            deleteRecording();
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full"
        >
            <AnimatePresence mode="wait">
                {!isRecording && !audioBlob ? (
                    // Start Recording Button
                    <motion.button
                        key="start"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        onClick={startRecording}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                    >
                        <Mic size={24} />
                        <span>Record Voice Message</span>
                    </motion.button>
                ) : isRecording ? (
                    // Recording Interface
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-4 h-4 rounded-full bg-red-500"
                                />
                                <span className="text-white font-mono text-2xl">{formatDuration(duration)}</span>
                            </div>
                            {isPaused && <span className="text-yellow-400 text-sm font-bold">PAUSED</span>}
                        </div>

                        {/* Waveform Visualization */}
                        <div className="flex items-center justify-center gap-1 h-16 mb-6">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: isPaused ? '20%' : ['20%', '80%', '20%'],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.8,
                                        delay: i * 0.05,
                                    }}
                                    className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={pauseRecording}
                                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                            >
                                {isPaused ? <Play size={20} /> : <Pause size={20} />}
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button
                                onClick={stopRecording}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Square size={20} />
                                Stop
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    // Preview Interface
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={playAudio}
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
                                >
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <div>
                                    <div className="text-white font-bold">Voice Message</div>
                                    <div className="text-white/40 text-sm">{formatDuration(duration)}</div>
                                </div>
                            </div>
                            <button
                                onClick={deleteRecording}
                                className="p-3 rounded-full bg-white/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    deleteRecording();
                                    onCancel?.();
                                }}
                                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendVoiceMessage}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Send
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
