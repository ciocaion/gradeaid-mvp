
import React from 'react';
import { motion } from 'framer-motion';

interface NumberLineProps {
  min?: number;
  max?: number;
  value: number;
  height: number;
}

const NumberLine: React.FC<NumberLineProps> = ({ min = -5, max = 5, value, height }) => {
  // Always center the current value and show a range around it
  const rangeSize = 5; // How many numbers to show above and below the current value
  const adjustedMin = value - rangeSize;
  const adjustedMax = value + rangeSize;
  
  // Generate numbers for the number line
  const numbers = [];
  for (let i = adjustedMin; i <= adjustedMax; i++) {
    // Position calculation: middle of the height is for the current value
    // Values above the current are positioned above the middle, values below are positioned below
    const middlePosition = height / 2;
    const stepSize = height / (2 * rangeSize + 1); // Height divided by total visible numbers
    const position = middlePosition - (i - value) * stepSize;
    
    const isCurrentValue = i === value;
    
    numbers.push(
      <div 
        key={i} 
        className="absolute flex items-center"
        style={{ top: position }}
      >
        {/* Line */}
        <div 
          className={`h-px ${isCurrentValue ? 'w-5 bg-primary' : 'w-4 bg-gray-400'}`}
        />
        
        {/* Number label */}
        <div className={`ml-2 font-medium ${isCurrentValue ? 'text-lg text-primary font-bold' : 'text-sm text-gray-700'}`}>
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
        
        {/* Current Value Indicator - always positioned at the middle */}
        <motion.div 
          className="absolute -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white"
          style={{ top: height / 2 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        />
      </div>
    </div>
  );
};

export default NumberLine;
