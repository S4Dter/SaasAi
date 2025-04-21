"use client";

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';

// The Model component using useGLTF to load the model
function Model() {
  const gltf = useGLTF('/model/model.gltf');
  const modelRef = useRef<THREE.Group>(null);

  // Add a subtle animation to the model
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={gltf.scene} 
      scale={1.5} 
      position={[0, 0, 0]} 
    />
  );
}

// A simple loading component for the Suspense fallback
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#4285F4" wireframe />
    </mesh>
  );
}

// Main component that exports the 3D scene
export default function ThreeDScene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Environment adds lighting and reflections */}
          <Environment preset="city" />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={1024} 
          />
          
          {/* The 3D model */}
          <Model />
          
          {/* Preload all assets to avoid flickering */}
          <Preload all />
        </Suspense>
        
        {/* Controls to orbit around the model */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate={false} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

// Preload the model to improve performance
useGLTF.preload('/model/model.gltf');
