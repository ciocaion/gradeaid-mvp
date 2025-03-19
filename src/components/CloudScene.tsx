
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Cloud particle component
const CloudParticle = ({ position, speed, size }: { position: [number, number, number], speed: number, size: number }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      // Gentle floating motion
      mesh.current.position.y += Math.sin(Date.now() * 0.001 * speed) * 0.003;
      mesh.current.rotation.z += 0.001 * speed;
    }
  });
  
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color="#79B4FF" transparent opacity={0.8} />
    </mesh>
  );
};

// Cloud cluster component
const CloudCluster = ({ position, particleCount = 5 }: { position: [number, number, number], particleCount?: number }) => {
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const offset: [number, number, number] = [
      (Math.random() - 0.5) * 2, 
      (Math.random() - 0.5) * 0.5, 
      (Math.random() - 0.5) * 2
    ];
    
    particles.push(
      <CloudParticle 
        key={i}
        position={[
          position[0] + offset[0],
          position[1] + offset[1],
          position[2] + offset[2]
        ]}
        speed={0.5 + Math.random()} 
        size={0.5 + Math.random() * 0.5}
      />
    );
  }
  
  return <>{particles}</>;
};

// Main cloud scene component
const CloudScene: React.FC<{ height?: number, animate?: boolean }> = ({ height = 400, animate = true }) => {
  return (
    <div className="absolute inset-0 z-0" style={{ height }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Multiple cloud clusters */}
        <CloudCluster position={[-4, 2, -5]} particleCount={7} />
        <CloudCluster position={[4, 3, -6]} particleCount={8} />
        <CloudCluster position={[0, 4, -7]} particleCount={10} />
        <CloudCluster position={[-5, -2, -5]} particleCount={6} />
        <CloudCluster position={[5, -3, -6]} particleCount={5} />
        
        {animate && <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          rotateSpeed={0.5} 
        />}
      </Canvas>
    </div>
  );
};

export default CloudScene;
