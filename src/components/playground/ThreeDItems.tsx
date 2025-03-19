
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeDProps {
  count: number;
  type: 'balloon' | 'sandbag';
  onRemove: () => void;
}

// 3D Balloon component
const Balloon3D = ({ index, total, onRemove }: { index: number; total: number; onRemove: () => void }) => {
  const mesh = useRef<THREE.Group>(null);
  
  // Calculate position based on index and total
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 3 + (index % 3);
  const xPos = Math.sin(angle) * radius;
  const yPos = index % 2 === 0 ? 0.5 : 0;
  const zPos = Math.cos(angle) * radius;
  
  // Random balloon color variants
  const balloonColors = [
    '#FF5E5E', '#5E8FFF', '#5EFF8F', 
    '#FFFF5E', '#C45EFF', '#FF5EC4'
  ];
  const colorIndex = (index % balloonColors.length);
  const balloonColor = balloonColors[colorIndex];
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      // Gentle floating motion
      mesh.current.position.y = Math.sin(clock.getElapsedTime() * 0.5 + index) * 0.2 + 2;
      mesh.current.rotation.y += 0.003;
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3 + index) * 0.05;
    }
  });
  
  return (
    <group 
      ref={mesh} 
      position={[xPos, yPos, zPos]} 
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      {/* Balloon main body */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={balloonColor} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Balloon highlight */}
      <mesh position={[-0.2, 0.2, 0.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.7} />
      </mesh>
      
      {/* Balloon string */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
        <meshStandardMaterial color="#AAAAAA" />
      </mesh>
      
      {/* Balloon knot */}
      <mesh position={[0, -0.7, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  );
};

// 3D Sandbag component
const Sandbag3D = ({ index, total, onRemove }: { index: number; total: number; onRemove: () => void }) => {
  const mesh = useRef<THREE.Group>(null);
  
  // Calculate position based on index and total
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 2.5 + (index % 2);
  const xPos = Math.sin(angle) * radius;
  const yPos = -2.5;
  const zPos = Math.cos(angle) * radius;
  
  // Sandbag colors
  const sandbagColors = ['#AA7942', '#8B6B42', '#A89A68', '#7D6C46'];
  const colorIndex = (index % sandbagColors.length);
  const sandbagColor = sandbagColors[colorIndex];
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      // Gentle swinging motion
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5 + index) * 0.1;
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3 + index) * 0.05;
    }
  });
  
  return (
    <group 
      ref={mesh} 
      position={[xPos, yPos, zPos]} 
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      {/* Sandbag main body */}
      <mesh>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial color={sandbagColor} roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Sandbag texture details */}
      <mesh position={[0, 0, 0.305]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.1} />
      </mesh>
      
      {/* Rope */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#AAAAAA" />
      </mesh>
    </group>
  );
};

// Main 3D scene for balloons or sandbags
const ThreeDItems: React.FC<ThreeDProps> = ({ count, type, onRemove }) => {
  if (count === 0) return null;
  
  const ItemComponent = type === 'balloon' ? Balloon3D : Sandbag3D;
  
  return (
    <div className="absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        
        {Array.from({ length: count }).map((_, index) => (
          <ItemComponent
            key={`${type}-${index}`}
            index={index}
            total={count}
            onRemove={onRemove}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default ThreeDItems;
