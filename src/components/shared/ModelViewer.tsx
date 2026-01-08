'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls } from '@react-three/drei';

interface ModelViewerProps {
    path: string;
    scale?: number;
    autoRotate?: boolean;
}

function Model({ path, scale = 1 }: { path: string, scale: number }) {
    const { scene } = useGLTF(path);
    return <primitive object={scene} scale={scale} />;
}

export default function ModelViewer({ path, scale = 1 }: ModelViewerProps) {

    return (
        <div className="w-full h-full relative">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }} gl={{ alpha: true }}>
                <Suspense fallback={null}>
                    {/* PresentationControls allow snapping back to original position */}
                    <PresentationControls
                        speed={1.5}
                        global
                        zoom={0.5}
                        polar={[-0.1, Math.PI / 4]}
                    >
                        <Stage environment="city" intensity={0.6}>
                            <Model path={path} scale={scale} />
                        </Stage>
                    </PresentationControls>
                </Suspense>

                {/* Fallback OrbitControls if user insists on full control */}
                {/* <OrbitControls autoRotate={autoRotate} enableZoom={false} /> */}
            </Canvas>
        </div>
    );
}
