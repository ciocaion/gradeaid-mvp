
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

interface ThreeDProps {
  count: number;
  type: 'balloon' | 'sandbag';
  onRemove: () => void;
  offsetY?: number;
  connectionToBasket?: boolean;
}

// Component to create ropes connecting to the basket
const ConnectionRopes = ({ type, count }: { type: 'balloon' | 'sandbag'; count: number }) => {
  const maxRopes = Math.min(count, 5); // Limit the number of visible ropes
  
  return (
    <>
      {Array.from({ length: maxRopes }).map((_, index) => {
        const angle = (index / Math.max(1, maxRopes - 1)) * Math.PI - Math.PI/2;
        const xEnd = Math.cos(angle) * 1.2;
        const zEnd = Math.sin(angle) * 1.2;
        
        // For balloons, ropes go down to connect to basket
        // For sandbags, ropes go up to connect to basket
        const yStart = type === 'balloon' ? -0.8 : 0.8;
        const yEnd = 0;
        
        return (
          <mesh key={`rope-${index}`}>
            <cylinderGeometry args={[0.01, 0.01, 2, 6]} />
            <meshStandardMaterial color="#AAAAAA" />
            <primitive 
              object={new THREE.Object3D()} 
              position={[0, 0, 0]} 
              rotation={[0, 0, 0]}
              onUpdate={(self) => {
                self.position.set(xEnd/2, (yStart + yEnd)/2, zEnd/2);
                self.lookAt(xEnd, yEnd, zEnd);
                // Rotate to align cylinder with direction
                self.rotateX(Math.PI/2);
              }}
            />
          </mesh>
        );
      })}
    </>
  );
};

// 3D Balloon component
const Balloon3D = ({ index, total, onRemove }: { index: number; total: number; onRemove: () => void }) => {
  const mesh = useRef<THREE.Group>(null);
  
  // Calculate position based on index and total to create a nice cluster
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 1.2 + (index % 3) * 0.3; // Reduced radius for tighter cluster
  const xPos = Math.sin(angle) * radius;
  const yPos = 0.8 + (index % 3) * 0.2; // Higher position to be above basket
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
      mesh.current.position.y = Math.sin(clock.getElapsedTime() * 0.5 + index) * 0.1 + yPos;
      mesh.current.rotation.y += 0.003;
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3 + index) * 0.03;
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
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={balloonColor} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Balloon highlight */}
      <mesh position={[-0.12, 0.12, 0.18]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.7} />
      </mesh>
      
      {/* Balloon string going down to basket */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8, 6]} />
        <meshStandardMaterial color="#AAAAAA" />
      </mesh>
      
      {/* Balloon knot */}
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  );
};

// 3D Sandbag component
const Sandbag3D = ({ index, total, onRemove }: { index: number; total: number; onRemove: () => void }) => {
  const mesh = useRef<THREE.Group>(null);
  
  // Calculate position based on index and total for cluster arrangement
  const angle = (index / Math.max(1, total)) * 2 * Math.PI;
  const radius = 1.0 + (index % 2) * 0.3; // Reduced radius for tighter cluster
  const xPos = Math.sin(angle) * radius;
  const yPos = -0.8 - (index % 2) * 0.2; // Lower position to be below basket
  const zPos = Math.cos(angle) * radius;
  
  // Sandbag colors
  const sandbagColors = ['#AA7942', '#8B6B42', '#A89A68', '#7D6C46'];
  const colorIndex = (index % sandbagColors.length);
  const sandbagColor = sandbagColors[colorIndex];
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      // Gentle swinging motion
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5 + index) * 0.08;
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3 + index) * 0.03;
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
        <boxGeometry args={[0.5, 0.6, 0.4]} />
        <meshStandardMaterial color={sandbagColor} roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Sandbag texture details */}
      <mesh position={[0, 0, 0.201]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.45, 0.55]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.1} />
      </mesh>
      
      {/* Rope going up to basket */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#AAAAAA" />
      </mesh>
    </group>
  );
};

// Camera controls component with better handling
const CameraController = () => {
  const { camera, gl } = useThree();
  return (
    <OrbitControls 
      enableZoom={false} 
      enablePan={false} 
      enableRotate={true}
      makeDefault
      args={[camera, gl.domElement]} 
    />
  );
};

// Main 3D scene for balloons or sandbags
const ThreeDItems: React.FC<ThreeDProps> = ({ 
  count, 
  type, 
  onRemove, 
  offsetY = 0,
  connectionToBasket = false
}) => {
  if (count === 0) return null;
  
  const ItemComponent = type === 'balloon' ? Balloon3D : Sandbag3D;
  
  return (
    <div className="absolute inset-0" style={{ transform: `translateY(${offsetY}px)` }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <CameraController />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        
        {connectionToBasket && (
          <ConnectionRopes type={type} count={count} />
        )}
        
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
