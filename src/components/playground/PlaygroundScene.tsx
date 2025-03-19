
import React from 'react';
import { motion } from 'framer-motion';
import { Basket } from '../BalloonSandbag';
import NumberLine from '../NumberLine';
import CloudScene from '../CloudScene';
import ThreeDItems from './ThreeDItems';
import { getBasketPosition } from '@/utils/mathUtils';

interface PlaygroundSceneProps {
  balloons: number;
  sandbags: number;
  value: number;
  playgroundHeight: number;
  handleRemoveBalloon: () => void;
  handleRemoveSandbag: () => void;
}

const PlaygroundScene: React.FC<PlaygroundSceneProps> = ({ 
  balloons, 
  sandbags, 
  value, 
  playgroundHeight,
  handleRemoveBalloon,
  handleRemoveSandbag
}) => {
  const basketPosition = getBasketPosition(value, playgroundHeight * 0.7, playgroundHeight * 0.2);
  
  return (
    <>
      <CloudScene height={playgroundHeight} animate={true} />
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/30 to-transparent" />
      
      <div className="absolute left-6 top-0 bottom-0 h-full">
        <NumberLine value={value} height={playgroundHeight} />
      </div>
      
      {/* 3D Balloons and Sandbags */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {balloons > 0 && (
          <div style={{ pointerEvents: 'auto' }}>
            <ThreeDItems 
              count={balloons} 
              type="balloon" 
              onRemove={handleRemoveBalloon} 
            />
          </div>
        )}
        
        {sandbags > 0 && (
          <div style={{ pointerEvents: 'auto' }}>
            <ThreeDItems 
              count={sandbags} 
              type="sandbag" 
              onRemove={handleRemoveSandbag} 
            />
          </div>
        )}
      </div>
      
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ top: basketPosition }}
        animate={{ 
          top: basketPosition,
          transition: { 
            type: "spring", 
            stiffness: 60, 
            damping: 12,
            mass: balloons > 0 ? 0.8 : 1.2 
          }
        }}
      >
        <Basket balloons={balloons} sandbags={sandbags} />
      </motion.div>
    </>
  );
};

export default PlaygroundScene;
