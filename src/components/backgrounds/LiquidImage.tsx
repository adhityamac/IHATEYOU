'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

const defaultImage = "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg";

interface LiquidImageProps {
    src?: string;
    strength?: number;
    speed?: number;
    opacity?: number;
}

export default function LiquidImage({
    src = defaultImage,
    strength = 0.02, // Reduced for subtle effect
    speed = 0.2,
    opacity = 1
}: LiquidImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const mouseRef = useRef({ x: -1, y: -1 });
    const wakeRef = useRef<{ x: number, y: number, t: number }[]>([]);

    // Resize observer
    useEffect(() => {
        const updateSize = () => {
            if (canvasRef.current) {
                const parent = canvasRef.current.parentElement;
                if (parent) {
                    setSize({
                        width: parent.clientWidth,
                        height: parent.clientHeight
                    });
                }
            }
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Mouse tracking
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for WebGL

        mouseRef.current = { x, y };

        // Add wake point
        const now = Date.now() / 1000;
        wakeRef.current.push({ x, y, t: now });
        if (wakeRef.current.length > 20) wakeRef.current.shift();
    }, []);

    const handleMouseLeave = () => {
        mouseRef.current = { x: -1, y: -1 };
    };

    // WebGL Initialization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || size.width === 0) return;

        canvas.width = size.width;
        canvas.height = size.height;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Vertex Shader
        const vsSource = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0, 1);
            }
        `;

        // Fragment Shader (Adapted from Framer code)
        const fsSource = `
            precision highp float;
            varying vec2 v_uv;
            uniform sampler2D u_image;
            uniform vec2 u_mouse;
            uniform float u_time;
            uniform float u_strength;
            uniform float u_speed;
            uniform vec2 u_resolution;
            
            #define MAX_WAKE 20
            uniform int u_wakeCount;
            uniform vec3 u_wake[MAX_WAKE]; // x, y, t

            void main() {
                vec2 uv = v_uv;
                
                // Wake ripples
                for (int i = 0; i < MAX_WAKE; ++i) {
                    if (i >= u_wakeCount) break;
                    vec2 w = u_wake[i].xy;
                    float t = u_time - u_wake[i].z;
                    if (t > 2.0) continue; // Expire old wakes
                    
                    float dist = distance(uv, w);
                    float amp = exp(-dist * 10.0) * exp(-t * 2.0);
                    float ripple = sin(40.0 * dist - t * 10.0 * u_speed) * 0.02;
                    uv += normalize(uv - w) * ripple * u_strength * amp;
                }

                // Live mouse ripple
                if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0) {
                    float dist = distance(uv, u_mouse);
                    float ripple = sin(40.0 * dist - u_time * 5.0 * u_speed) * 0.02;
                    float effect = exp(-dist * 8.0);
                    uv += normalize(uv - u_mouse) * ripple * u_strength * effect;
                }

                uv = clamp(uv, 0.0, 1.0);
                vec4 color = texture2D(u_image, uv);
                
                // We keep it full color for this implementation, or we can add the grayscale reveal logic back if requested.
                // The user asked for the "Liquid Effect", usually implying the distortion.
                // But the framer code had grayscale reveal. Let's keep color for now as we want a vibrant background.
                
                gl_FragColor = color;
            }
        `;

        // Compile shaders
        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vs = compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Buffer
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Load image
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = src;
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Important for coordinates match
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            render();
        };

        // Uniform locations
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uMouse = gl.getUniformLocation(program, 'u_mouse');
        const uStrength = gl.getUniformLocation(program, 'u_strength');
        const uSpeed = gl.getUniformLocation(program, 'u_speed');
        const uWake = gl.getUniformLocation(program, 'u_wake');
        const uWakeCount = gl.getUniformLocation(program, 'u_wakeCount');

        let animationFrameId: number;
        const startTime = Date.now();

        const render = () => {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const now = (Date.now() - startTime) / 1000;
            gl.uniform1f(uTime, now);
            gl.uniform1f(uStrength, strength);
            gl.uniform1f(uSpeed, speed);
            gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);

            // Clean up old wakes
            const currentTime = Date.now() / 1000;
            wakeRef.current = wakeRef.current.filter(w => currentTime - w.t < 2.0);

            // Update wake uniform array
            const wakeData = new Float32Array(60); // 20 * 3
            wakeRef.current.forEach((w, i) => {
                wakeData[i * 3] = w.x;
                wakeData[i * 3 + 1] = w.y;
                wakeData[i * 3 + 2] = now - (currentTime - w.t); // adjust t relative to u_time
            });
            gl.uniform3fv(uWake, wakeData);
            gl.uniform1i(uWakeCount, wakeRef.current.length);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        };

        return () => {
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteTexture(texture);
        };
    }, [src, size, strength, speed]);

    return (
        <div style={{ width: '100%', height: '100%', opacity }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    );
}
