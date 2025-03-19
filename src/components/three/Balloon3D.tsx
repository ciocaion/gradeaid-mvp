
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Balloon3DProps {
  index: number;
  total: number;
  onClick?: () => void;
}

const Balloon3D: React.FC<Balloon3DProps> = ({ index, total, onClick = () => {} }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Use any type to avoid TypeScript errors with Three.js objects
  const lineRef = useRef<any>(null);
  
  // Calculate position based on index and total
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 1.5 + (index % 3) * 0.3;
  const xOffset = Math.sin(angle) * radius;
  const zOffset = Math.cos(angle) * radius * 0.8;
  
  // Random balloon colors
  const balloonColors = [
    'red', 'dodgerblue', 'limegreen', 
    'gold', 'mediumpurple', 'hotpink'
  ];
  const colorIndex = (index % balloonColors.length);
  const balloonColor = balloonColors[colorIndex];
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.001;
      meshRef.current.rotation.y += 0.002;
      
      // Update string position
      if (lineRef.current) {
        const points = lineRef.current.geometry.attributes.position.array;
        // Start point (balloon bottom)
        points[0] = meshRef.current.position.x;
        points[1] = meshRef.current.position.y - 0.25;
        points[2] = meshRef.current.position.z;
        lineRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });
  
  return (
    <group position={[xOffset, 2.5, zOffset]}>
      {/* Balloon string */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            itemSize={3}
            array={new Float32Array([
              xOffset, 2.25, zOffset, // Balloon bottom
              xOffset, 0, zOffset     // Basket top
            ])}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#888888" />
      </line>
      
      {/* Balloon */}
      <mesh 
        ref={meshRef} 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Sphere args={[0.25, 24, 24]}>
          <meshStandardMaterial color={balloonColor} />
        </Sphere>
        
        {/* Balloon knot */}
        <Sphere args={[0.05, 8, 8]} position={[0, -0.25, 0]}>
          <meshStandardMaterial color={new THREE.Color(balloonColor).multiplyScalar(0.7).getStyle()} />
        </Sphere>
        
        {/* Balloon highlight/reflection */}
        <Sphere args={[0.1, 8, 8]} position={[0.08, 0.08, 0.12]}>
          <meshBasicMaterial color="white" transparent opacity={0.3} />
        </Sphere>
      </mesh>
    </group>
  );
};

export default Balloon3D;
