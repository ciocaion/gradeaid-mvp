
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ThreeScene from './three/ThreeScene';

interface ThreeDElementsProps {
  balloons: number;
  sandbags: number;
  value: number;
  handleRemoveBalloon: () => void;
  handleRemoveSandbag: () => void;
}

const ThreeDElements: React.FC<ThreeDElementsProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
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
