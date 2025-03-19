
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Balloon3D from './Balloon3D';
import Sandbag3D from './Sandbag3D';
import Basket3D from './Basket3D';

interface ThreeSceneProps {
  balloons: number;
  sandbags: number;
  value: number;
  handleRemoveBalloon: () => void;
  handleRemoveSandbag: () => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  balloons, 
  sandbags, 
  value, 
  handleRemoveBalloon, 
  handleRemoveSandbag 
}) => {
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
      <directionalLight position={[5, 5, 5]} intensity={1} />
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

export default ThreeScene;
