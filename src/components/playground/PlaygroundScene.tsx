
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Balloon, Sandbag, Basket } from '../BalloonSandbag';
import NumberLine from '../NumberLine';
import CloudScene from '../CloudScene';
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
        <NumberLine min={-5} max={5} value={value} height={playgroundHeight} />
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
      
      <div className="absolute top-10 left-0 right-0 h-20">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: balloons }).map((_, index) => (
            <Balloon 
              key={`balloon-${index}`} 
              index={index} 
              total={Math.max(1, balloons)}
              onClick={() => handleRemoveBalloon()}
            />
          ))}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 h-20">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: sandbags }).map((_, index) => (
            <Sandbag 
              key={`sandbag-${index}`} 
              index={index} 
              total={Math.max(1, sandbags)}
              onClick={() => handleRemoveSandbag()}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PlaygroundScene;
