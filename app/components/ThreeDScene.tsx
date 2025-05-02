"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Register and preload the model to ensure it's ready when needed
useGLTF.preload('/model/model.gltf');

// GLTF Model component with error handling
function Model({ scale = 1.5 }) {
  const gltfRef = useRef<THREE.Group>(null);
  const [hasError, setHasError] = React.useState(false);
  
  // Load the model with error handling including animations
  const { scene, nodes, materials, animations } = useGLTF('/model/model.gltf');
  
  // Set up animation system
  const { actions, mixer } = useAnimations(animations, gltfRef);

  // Start playing the animation when model is loaded
  useEffect(() => {
    if (actions && actions["Scene"]) {
      // Get the "Scene" animation and play it
      const sceneAction = actions["Scene"];
      sceneAction.reset().fadeIn(0.5).play();
      
      console.log('Animation "Scene" started playing');
    } else {
      console.warn('Animation "Scene" not found in model or not yet loaded');
    }
    
    // Clean up on unmount
    return () => {
      if (actions && actions["Scene"]) {
        actions["Scene"].fadeOut(0.5);
      }
    };
  }, [actions]);
  
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
    
    // Ensure textures are properly loaded from the textures folder
    if (materials) {
      Object.values(materials).forEach(material => {
        // Type cast to MeshStandardMaterial which has map property
        const stdMaterial = material as THREE.MeshStandardMaterial;
        
        if (stdMaterial.map && stdMaterial.map.source && stdMaterial.map.source.data) {
          // Fix texture paths if needed
          const src = stdMaterial.map.source.data.src;
          if (src && !src.includes('/model/textures/')) {
            const textureName = src.split('/').pop();
            // Update the texture path to point to our textures folder
            if (textureName) {
              stdMaterial.map.source.data.src = `/model/textures/${textureName}`;
            }
          }
        }
      });
    }
    
    return () => {
      window.removeEventListener('model-loaded', handleSuccess);
      window.removeEventListener('model-error', handleError);
    };
  }, [materials]);
  
  // Update animation mixer on each frame
  useFrame((state, delta) => {
    // Update the animation mixer (required for animations to play)
    if (mixer) {
      mixer.update(delta);
    }
    
    // Only apply the default rotation animation if no Scene animation is available/playing
    if (gltfRef.current && (!mixer || !actions["Scene"] || !actions["Scene"].isRunning())) {
      gltfRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      gltfRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 1;
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

  // Apply modifications to the model before rendering
  useEffect(() => {
    if (scene) {
      // Hide any axis helpers or debug elements that might be in the model
      scene.traverse((child) => {
        // Check if it's a mesh
        if (child instanceof THREE.Mesh) {
          // Look for helpers by name pattern
          if (child.name && (
            child.name.toLowerCase().includes('helper') || 
            child.name.toLowerCase().includes('axis') ||
            child.name.toLowerCase().includes('debug')
          )) {
            child.visible = false;
          }
          
          // Check for typical axes/helper materials (usually bright green, red, or blue solid colors)
          const material = child.material as THREE.MeshStandardMaterial;
          if (material && material.color) {
            // Check for bright green (common for axes)
            const color = material.color;
            if (
              (color.r < 0.2 && color.g > 0.8 && color.b < 0.2) || // Bright green
              (color.r > 0.8 && color.g < 0.2 && color.b < 0.2) || // Bright red (x-axis)
              (color.r < 0.2 && color.g < 0.2 && color.b > 0.8)    // Bright blue (z-axis)
            ) {
              child.visible = false;
            }
          }
        }
        
        // Check for Line objects (often used for helpers)
        if (child instanceof THREE.Line) {
          child.visible = false;
        }
        
        // Check for AxesHelper or GridHelper specific objects
        if (child instanceof THREE.AxesHelper || 
            child instanceof THREE.GridHelper || 
            child.type === 'AxesHelper' || 
            child.type === 'GridHelper') {
          child.visible = false;
        }
      });
    }
  }, [scene]);

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
  
  // Handle filename remapping for model.bin vs scene.bin
  useEffect(() => {
    // Patch for binary filename issue - model is looking for scene.bin but we have model.bin
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      if (typeof input === 'string' && input.includes('/model/scene.bin')) {
        console.log('Redirecting scene.bin request to model.bin');
        const newUrl = input.replace('scene.bin', 'model.bin');
        return originalFetch(newUrl, init);
      }
      return originalFetch(input, init);
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
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
