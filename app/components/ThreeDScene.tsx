"use client";

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the model to ensure it's ready when needed
useGLTF.preload('/model/model.gltf');

// GLTF Model component
function Model({ scale = 1.5 }) {
  const gltfRef = useRef<THREE.Group>(null);
  
  // Load the model
  const { scene } = useGLTF('/model/model.gltf');
  
  // Add a subtle animation to the model
  useFrame(({ clock }) => {
    if (gltfRef.current) {
      gltfRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      gltfRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <primitive 
      ref={gltfRef}
      object={scene} 
      scale={scale} 
      position={[0, 0, 0]} 
    />
  );
}

// A loading placeholder for the 3D model
function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

// Main component that exports the 3D scene
export default function ThreeDScene() {
  // Use effect to handle binary file name remapping
  useEffect(() => {
    // Patch to handle binary file naming
    // Model may be looking for "scene.bin" but we have "model.bin"
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      // If this is a request for scene.bin, redirect to model.bin
      if (typeof input === 'string' && input.includes('scene.bin')) {
        const newUrl = input.replace('scene.bin', 'model.bin');
        return originalFetch(newUrl, init);
      }
      return originalFetch(input, init);
    };
    
    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
      >
        {/* Environment lighting */}
        <Environment preset="city" />
        
        {/* General lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={1024} 
        />
        
        {/* The 3D model with Suspense for async loading */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <Model />
        </Suspense>
        
        {/* Controls to orbit around the model */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
