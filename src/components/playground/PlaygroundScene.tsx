
import React from 'react';
import { motion } from 'framer-motion';
import { Basket } from '../BalloonSandbag';
import NumberLine from '../NumberLine';
import CloudScene from '../CloudScene';
import ThreeDItems from './ThreeDItems';
import { getBasketPosition, OperationType } from '@/utils/mathUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlaygroundSceneProps {
  balloons: number;
  sandbags: number;
  value: number;
  playgroundHeight: number;
  operation: OperationType;
  setOperation: (operation: OperationType) => void;
  handleRemoveBalloon: () => void;
  handleRemoveSandbag: () => void;
}

const PlaygroundScene: React.FC<PlaygroundSceneProps> = ({ 
  balloons, 
  sandbags, 
  value, 
  playgroundHeight,
  operation,
  setOperation,
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
      
      {/* Operation Selector */}
      <div className="absolute top-4 right-4 z-50">
        <Select value={operation} onValueChange={(val) => setOperation(val as OperationType)}>
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Operation" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-sm">
            <SelectItem value="addition">Addition (+)</SelectItem>
            <SelectItem value="subtraction">Subtraction (-)</SelectItem>
            <SelectItem value="multiplication">Multiplication (×)</SelectItem>
            <SelectItem value="division">Division (÷)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* 3D Balloons and Sandbags */}
      <div className="absolute inset-0 pointer-events-none">
        {balloons > 0 && (
          <div className="absolute inset-0 h-1/2 pointer-events-auto">
            <ThreeDItems 
              count={balloons} 
              type="balloon" 
              onRemove={handleRemoveBalloon} 
            />
          </div>
        )}
        
        {sandbags > 0 && (
          <div className="absolute inset-0 top-1/2 pointer-events-auto">
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
