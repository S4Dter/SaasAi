"use client";

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Register and preload the model to ensure it's ready when needed
useGLTF.preload('/model/model.gltf');

// GLTF Model component with error handling
function Model({ scale = 1.5 }) {
  const gltfRef = useRef<THREE.Group>(null);
  const [hasError, setHasError] = React.useState(false);
  
  // Load the model with error handling
  const { scene, nodes } = useGLTF('/model/model.gltf');

  // Add error handling
  useEffect(() => {
    const handleSuccess = () => console.log('Model loaded successfully');
    const handleError = (error: any) => {
      console.error('Error loading model:', error);
      setHasError(true);
    };

    // We can't pass callbacks to useGLTF directly, so we handle it with listeners
    window.addEventListener('model-loaded', handleSuccess);
    window.addEventListener('model-error', handleError);
    
    return () => {
      window.removeEventListener('model-loaded', handleSuccess);
      window.removeEventListener('model-error', handleError);
    };
  }, []);
  
  // Add a subtle animation to the model
  useFrame(({ clock }) => {
    if (gltfRef.current) {
      gltfRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      gltfRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  // If there's an error, show a fallback sphere
  if (hasError) {
    return (
      <mesh scale={scale} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4285F4" roughness={0.3} metalness={0.7} />
      </mesh>
    );
  }

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
  // Global error boundary for the 3D scene
  const [hasGlobalError, setHasGlobalError] = React.useState(false);
  
  // Use effect to handle errors and load issues
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error in 3D scene:', event.message);
      setHasGlobalError(true);
    };
    
    window.addEventListener('error', handleError);
    
    // Timeout to detect if the model takes too long to load
    const timeoutId = setTimeout(() => {
      // Only set timeout error if we haven't already set an error
      const canvas = document.querySelector('canvas');
      if (canvas && !hasGlobalError) {
        console.warn('Model may be taking too long to load, but continuing render');
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(timeoutId);
    };
  }, [hasGlobalError]);

  // If we have a global error, show a simplified scene
  if (hasGlobalError) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-blue-50">
        <div className="w-32 h-32 relative">
          <div className="absolute animate-ping w-full h-full rounded-full bg-blue-400 opacity-75"></div>
          <div className="relative w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white">
            AI Agent
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
        onError={(e) => {
          console.error('Canvas error:', e);
          setHasGlobalError(true);
        }}
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
