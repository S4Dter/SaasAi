"use client";

import React, { useRef, RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';

// Model that will be animated
interface AIAgentProps {
  position?: [number, number, number];
  scale?: number;
}

function AIAgent({ position = [0, 0, 0], scale = 1 }: AIAgentProps) {
  // Use a simple mesh as placeholder for an actual 3D model
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a subtle animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1 + position[1];
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4285F4" roughness={0.3} metalness={0.7} />
      </mesh>
    </Float>
  );
}

// Glowing spheres representing data or AI concepts
interface DataPointsProps {
  count?: number;
}

function DataPoints({ count = 12 }: DataPointsProps) {
  const points = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    points.current.forEach((point, i) => {
      if (point) {
        const t = state.clock.getElapsedTime() + i * 100;
        point.position.y = Math.sin(t * 0.2) * 0.2;
        point.position.x = Math.sin(t * 0.1) * 0.1;
        point.position.z = Math.cos(t * 0.1) * 0.1;
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2 + Math.random() * 0.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.5;
        const scale = 0.05 + Math.random() * 0.05;
        
        return (
          <mesh 
            key={i} 
            position={[x, y, z]} 
            scale={scale}
            ref={(el: THREE.Mesh) => { if (el) points.current[i] = el; }}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#42C0FB" : "#9C42FB"} 
              emissive={i % 2 === 0 ? "#42C0FB" : "#9C42FB"} 
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Central light beam effect
function LightBeam() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 3, 32, 1, true]} />
      <meshBasicMaterial color="#9C42FB" transparent opacity={0.1} side={2} />
    </mesh>
  );
}

// Main scene component
const Scene = () => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <AIAgent position={[0, 0, 0]} scale={0.8} />
      <DataPoints count={20} />
      <LightBeam />
    </group>
  );
};

// Export the main 3D component
const ThreeDScene: React.FC = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Environment preset="city" />
        <Scene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;
