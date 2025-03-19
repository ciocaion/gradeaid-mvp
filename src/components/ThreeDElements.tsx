
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Cylinder, Sphere, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// 3D Balloon Component
const Balloon3D = ({ index, total, onClick = () => {} }: { index: number, total: number, onClick?: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  
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
          <meshStandardMaterial color={new THREE.Color(balloonColor).darken(0.5).getHexString()} />
        </Sphere>
        
        {/* Balloon highlight/reflection */}
        <Sphere args={[0.1, 8, 8]} position={[0.08, 0.08, 0.12]}>
          <meshBasicMaterial color="white" transparent opacity={0.3} />
        </Sphere>
      </mesh>
    </group>
  );
};

// 3D Sandbag Component
const Sandbag3D = ({ index, total, onClick = () => {} }: { index: number, total: number, onClick?: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  
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

// 3D Basket Component
const Basket3D = () => {
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

// Main Scene Component
const ThreeScene: React.FC<{
  balloons: number;
  sandbags: number;
  value: number;
  handleRemoveBalloon: () => void;
  handleRemoveSandbag: () => void;
}> = ({ balloons, sandbags, value, handleRemoveBalloon, handleRemoveSandbag }) => {
  const { camera } = useThree();
  
  // Adjust camera position based on value (balloon minus sandbag count)
  useEffect(() => {
    if (camera) {
      // Smoothly transition the camera's y position based on the current value
      const targetY = value * 0.15; // Scale factor for vertical movement
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    }
  }, [camera, value]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} />
      
      {/* Sky backdrop */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
      
      {/* Ground/horizon */}
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#8FBC8F" />
      </mesh>
      
      {/* Basket at the center */}
      <Basket3D />
      
      {/* Balloons */}
      {Array.from({ length: balloons }).map((_, index) => (
        <Balloon3D 
          key={`balloon-${index}`} 
          index={index} 
          total={Math.max(1, balloons)} 
          onClick={handleRemoveBalloon}
        />
      ))}
      
      {/* Sandbags */}
      {Array.from({ length: sandbags }).map((_, index) => (
        <Sandbag3D 
          key={`sandbag-${index}`} 
          index={index} 
          total={Math.max(1, sandbags)}
          onClick={handleRemoveSandbag}
        />
      ))}
    </>
  );
};

// Main Export Component
const ThreeDElements: React.FC<{
  balloons: number;
  sandbags: number;
  value: number;
  handleRemoveBalloon: () => void;
  handleRemoveSandbag: () => void;
}> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ThreeScene {...props} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDElements;
