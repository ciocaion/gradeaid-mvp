
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface Sandbag3DProps {
  index: number;
  total: number;
  onClick?: () => void;
}

const Sandbag3D: React.FC<Sandbag3DProps> = ({ index, total, onClick = () => {} }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Use any type to avoid TypeScript errors with Three.js objects
  const lineRef = useRef<any>(null);
  
  // Calculate position based on index and total
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 1.2 + (index % 3) * 0.2;
  const xOffset = Math.sin(angle) * radius;
  const zOffset = Math.cos(angle) * radius;
  
  // Sandbag colors
  const sandbagColors = ['#8B4513', '#A0522D', '#8B5A2B', '#6B4226'];
  const colorIndex = (index % sandbagColors.length);
  const sandbagColor = sandbagColors[colorIndex];
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying motion
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.0005;
      meshRef.current.rotation.y += 0.001;
      
      // Update string position
      if (lineRef.current) {
        const points = lineRef.current.geometry.attributes.position.array;
        // End point (sandbag top)
        points[3] = meshRef.current.position.x;
        points[4] = meshRef.current.position.y + 0.15;
        points[5] = meshRef.current.position.z;
        lineRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });
  
  return (
    <group position={[xOffset, -1.5, zOffset]}>
      {/* Sandbag string */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            itemSize={3}
            array={new Float32Array([
              xOffset, -0.5, zOffset, // Basket bottom
              xOffset, -1.35, zOffset // Sandbag top
            ])}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666666" />
      </line>
      
      {/* Sandbag */}
      <mesh 
        ref={meshRef} 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <RoundedBox args={[0.2, 0.3, 0.15]} radius={0.03}>
          <meshStandardMaterial color={sandbagColor} />
        </RoundedBox>
        
        {/* Texture/detail on sandbag */}
        <Cylinder args={[0.01, 0.01, 0.25, 8]} position={[0, 0, 0.08]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#5D4037" />
        </Cylinder>
        <Cylinder args={[0.01, 0.01, 0.18, 8]} position={[0, 0.1, 0.08]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#5D4037" />
        </Cylinder>
      </mesh>
    </group>
  );
};

export default Sandbag3D;
