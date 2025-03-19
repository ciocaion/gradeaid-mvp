
import React from 'react';
import { motion } from 'framer-motion';

interface NumberLineProps {
  min: number;
  max: number;
  value: number;
  height: number;
}

const NumberLine: React.FC<NumberLineProps> = ({ min, max, value, height }) => {
  // Generate the tick marks
  const ticks = [];
  for (let i = min; i <= max; i++) {
    const position = height - ((i - min) / (max - min)) * height;
    const isMajor = i % 5 === 0 || i === min || i === max;
    
    ticks.push(
      <div 
        key={i} 
        className="absolute flex items-center"
        style={{ top: position }}
      >
        {/* Line */}
        <div 
          className={`h-px bg-gray-400 ${isMajor ? 'w-6' : 'w-3'}`}
        />
        
        {/* Label (only for major ticks) */}
        {isMajor && (
          <div className="ml-2 text-sm font-medium text-gray-600">
            {i}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full flex items-center">
      {/* Vertical Line */}
      <div className="h-full w-px bg-gray-400 relative">
        {ticks}
        
        {/* Current Value Indicator */}
        <motion.div 
          className="absolute -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white"
          style={{ 
            top: height - ((value - min) / (max - min)) * height 
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        />
      </div>
    </div>
  );
};

export default NumberLine;
