
import React from 'react';
import { motion } from 'framer-motion';

interface NumberLineProps {
  min: number;
  max: number;
  value: number;
  height: number;
}

const NumberLine: React.FC<NumberLineProps> = ({ min, max, value, height }) => {
  // Generate numbers for the number line
  const numbers = [];
  for (let i = min; i <= max; i++) {
    const position = height - ((i - min) / (max - min)) * height;
    
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
