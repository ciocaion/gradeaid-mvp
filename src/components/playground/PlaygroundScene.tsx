
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberLine from '../NumberLine';
import CloudScene from '../CloudScene';
import ThreeDElements from '../ThreeDElements';
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
  // We still calculate basketPosition for the number line reference
  const basketPosition = getBasketPosition(value, playgroundHeight * 0.7, playgroundHeight * 0.2);
  
  return (
    <>
      {/* Background Clouds */}
      <CloudScene height={playgroundHeight} animate={true} />
      
      {/* Ground effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/30 to-transparent" />
      
      {/* Number Line on left side */}
      <div className="absolute left-6 top-0 bottom-0 h-full z-20">
        <NumberLine value={value} height={playgroundHeight} />
      </div>
      
      {/* Position indicator for number line */}
      <motion.div 
        className="absolute left-6 -translate-x-1/2 w-3 h-3 bg-primary rounded-full z-10"
        style={{ top: basketPosition }}
        animate={{ 
          top: basketPosition,
          scale: [1, 1.2, 1],
          transition: { 
            top: { type: "spring", stiffness: 60, damping: 12 },
            scale: { repeat: Infinity, duration: 2 }
          }
        }}
      />
      
      {/* 3D Scene with balloons, sandbags and basket */}
      <div className="absolute inset-0">
        <ThreeDElements
          balloons={balloons}
          sandbags={sandbags}
          value={value}
          handleRemoveBalloon={handleRemoveBalloon}
          handleRemoveSandbag={handleRemoveSandbag}
        />
      </div>
    </>
  );
};

export default PlaygroundScene;
