
import React from 'react';
import { motion } from 'framer-motion';

interface NumberLineProps {
  min?: number;
  max?: number;
  value: number;
  height: number;
}

const NumberLine: React.FC<NumberLineProps> = ({ min = -5, max = 5, value, height }) => {
  // Dynamically adjust the range based on the current value, but limit the expansion
  const adjustedMin = Math.max(-5, Math.min(min, value - 2));
  const adjustedMax = Math.min(5, Math.max(max, value + 2));
  
  // Generate numbers for the number line
  const numbers = [];
  for (let i = adjustedMin; i <= adjustedMax; i++) {
    const position = height - ((i - adjustedMin) / (adjustedMax - adjustedMin)) * height;
    
    numbers.push(
      <div 
        key={i} 
        className="absolute flex items-center"
        style={{ top: position }}
      >
        {/* Line */}
        <div 
          className="h-px bg-gray-400 w-4"
        />
        
        {/* Number label */}
        <div className="ml-2 text-sm font-medium text-gray-700">
          {i}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex items-center">
      {/* Vertical Line */}
      <div className="h-full w-px bg-gray-400 relative">
        {numbers}
        
        {/* Current Value Indicator */}
        <motion.div 
          className="absolute -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white"
          style={{ 
            top: height - ((value - adjustedMin) / (adjustedMax - adjustedMin)) * height 
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
