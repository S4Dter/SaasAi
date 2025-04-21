"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Laptop model created with basic geometry
function LaptopModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Add a subtle animation to the model
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.3}
    >
      <group ref={groupRef}>
        {/* Base of laptop */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.1, 2]} />
          <meshStandardMaterial color="#d4d4d4" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Screen */}
        <group position={[0, 0.6, -0.9]} rotation={[Math.PI / 6, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3, 2, 0.1]} />
            <meshStandardMaterial color="#d4d4d4" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Screen display */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.8, 1.8]} />
            <meshStandardMaterial 
              color="#1a1a1a" 
              emissive="#3b82f6"
              emissiveIntensity={0.2}
              roughness={0.1} 
            />
          </mesh>
        </group>
        
        {/* Keyboard */}
        <mesh position={[0, 0.06, 0.3]} receiveShadow>
          <planeGeometry args={[2.8, 1.5]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
        </mesh>
        
        {/* Touchpad */}
        <mesh position={[0, 0.07, 1.1]} receiveShadow>
          <planeGeometry args={[1.2, 0.8]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating particles around the laptop
function Particles({ count = 20 }) {
  const particles = useRef<THREE.Mesh[]>([]);
  
  useFrame(({ clock }) => {
    particles.current.forEach((particle, i) => {
      if (particle) {
        const t = clock.getElapsedTime() * 0.5 + i * 100;
        particle.position.y = Math.sin(t * 0.1) * 0.5;
        particle.position.x = Math.sin(t * 0.2) * 0.3;
        particle.position.z = Math.cos(t * 0.1) * 0.3;
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 3 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 2;
        const size = 0.03 + Math.random() * 0.05;
        
        return (
          <mesh 
            key={i} 
            position={[x, y, z]} 
            scale={size}
            ref={(el: THREE.Mesh) => { if (el) particles.current[i] = el; }}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial 
              color={i % 3 === 0 ? "#4285F4" : i % 3 === 1 ? "#9C42FB" : "#42C0FB"} 
              emissive={i % 3 === 0 ? "#4285F4" : i % 3 === 1 ? "#9C42FB" : "#42C0FB"} 
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Main component that exports the 3D scene
export default function ThreeDScene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        shadows
      >
        {/* Environment adds lighting and reflections */}
        <Environment preset="city" />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 5]} 
          angle={0.3}
          penumbra={0.8}
          intensity={1} 
          castShadow
          shadow-mapSize={1024} 
        />
        
        {/* The 3D model */}
        <LaptopModel />
        
        {/* Particles */}
        <Particles count={30} />
        
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
