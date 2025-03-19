
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const Basket3D: React.FC = () => {
  const basketRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (basketRef.current) {
      // Gentle floating motion
      basketRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.2) * 0.001;
      basketRef.current.rotation.y += 0.0005;
    }
  });
  
  return (
    <group ref={basketRef}>
      {/* Basket body */}
      <mesh position={[0, 0, 0]}>
        <RoundedBox args={[1, 0.5, 0.7]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#8B4513" />
        </RoundedBox>
        
        {/* Basket rim */}
        <Cylinder args={[0.52, 0.52, 0.05, 16]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#A0522D" />
        </Cylinder>
        
        {/* Basket weave lines */}
        <RoundedBox args={[1.02, 0.08, 0.72]} radius={0.02} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#6B4226" />
        </RoundedBox>
        <RoundedBox args={[1.02, 0.08, 0.72]} radius={0.02} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#6B4226" />
        </RoundedBox>
      </mesh>
    </group>
  );
};

export default Basket3D;
