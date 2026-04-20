'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import PinkyModel from './PinkyModel';

export default function ThreeCanvas() {
    return (
        // Height is big, pointer-events-none ensures we don't block interaction underneath, 
        // Pinky will track everywhere anyway because of global event listener.
        <div className="w-full h-[600px] md:h-[800px] relative pointer-events-none">
            <div className="absolute top-10 right-10 z-10 px-4 py-2 bg-black text-[#00FF66] font-black text-sm uppercase -rotate-6 border-2 border-[#00FF66] animate-pulse shadow-[4px_4px_0px_0px_#00FF66]">
                [ Pinky Is Watching ]
            </div>
            <Canvas
                shadows
                // Moved camera closer (z from 6 back to 4) to make him render HUGE
                camera={{ position: [0, 0, 4], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
                    <Environment preset="city" />
                    <PinkyModel />
                </Suspense>
            </Canvas>
        </div>
    );
}
