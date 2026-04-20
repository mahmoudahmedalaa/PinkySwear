'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function PinkyModel() {
    const group = useRef<THREE.Group>(null);
    const { scene } = useGLTF('/Pinky_Animated.glb');

    // Track mouse globally across the whole window, not just the canvas box
    const mouse = useRef(new THREE.Vector2());

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouse.current.set(x, y);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child: any) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                if (child.material.color) {
                    child.material.color.multiplyScalar(1.5);
                }
                child.material.emissive = new THREE.Color('#225500');
                child.material.emissiveIntensity = 0.3;
                child.material.needsUpdate = true;
            }
        });
        return clone;
    }, [scene]);

    useFrame(() => {
        if (group.current) {
            // Much more aggressive rotation
            const targetRotY = mouse.current.x * 1.5; // Up to ~85 degrees tracking left/right
            const targetRotX = mouse.current.y * 1.0;  // Up to ~60 degrees tracking up/down

            group.current.rotation.y = THREE.MathUtils.lerp(
                group.current.rotation.y,
                targetRotY,
                0.1 // Fast responsive snap
            );
            group.current.rotation.x = THREE.MathUtils.lerp(
                group.current.rotation.x,
                targetRotX,
                0.1
            );
        }
    });

    return (
        <group ref={group} dispose={null} position={[0, -0.5, 0]}>
            {/* Massive scale so he's huge on screen */}
            <primitive object={clonedScene} scale={8.0} position={[0, -1.0, 0]} />
        </group>
    );
}

useGLTF.preload('/Pinky_Animated.glb');
