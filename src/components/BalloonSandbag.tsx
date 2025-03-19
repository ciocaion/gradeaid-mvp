
import React from 'react';
import { motion } from 'framer-motion';

interface BalloonProps {
  index: number;
  total: number;
  onClick?: () => void;
}

interface SandbagProps {
  index: number;
  total: number;
  onClick?: () => void;
}

export const Balloon: React.FC<BalloonProps> = ({ index, total, onClick }) => {
  // Calculate position based on index and total
  const angle = (index / total) * 2 * Math.PI;
  const radius = 60 + (index % 3) * 20; // Varying distances from center
  const xOffset = Math.sin(angle) * radius;
  const yOffset = Math.cos(angle) * radius * 0.5; // Elliptical arrangement
  
  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      style={{
        left: `calc(50% + ${xOffset}px)`,
        top: 0
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -150, opacity: 0 }}
      transition={{ 
        type: 'spring', 
        damping: 8,
        stiffness: 50,
        duration: 0.8
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      {/* Balloon String */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 h-20 w-[2px] bg-gradient-to-b from-gray-400 to-gray-500"
        style={{ 
          top: '30px',
          transformOrigin: 'top',
          transform: `rotate(${xOffset > 0 ? 5 : -5}deg)`
        }}
      />
      
      {/* Balloon */}
      <motion.div
        className="w-16 h-20 rounded-full bg-balloon shadow-md flex items-center justify-center relative overflow-hidden"
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, xOffset > 0 ? 3 : -3, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3 + (index % 3), 
          ease: "easeInOut" 
        }}
      >
        <div className="absolute inset-0 bg-balloonDark rounded-full opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-8 h-8 blur-sm" />
        <div className="w-4 h-4 rounded-full bg-white opacity-40 absolute top-1/4 left-1/4" />
      </motion.div>
      
      {/* Balloon Knot */}
      <div className="w-3 h-4 bg-balloonDark rounded-b-full mx-auto" />
    </motion.div>
  );
};

export const Sandbag: React.FC<SandbagProps> = ({ index, total, onClick }) => {
  // Calculate position based on index and total
  const angle = (index / total) * 2 * Math.PI;
  const radius = 50 + (index % 3) * 15; // Varying distances from center
  const xOffset = Math.sin(angle) * radius;
  
  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      style={{
        left: `calc(50% + ${xOffset}px)`,
        bottom: 0
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 150, opacity: 0 }}
      transition={{ 
        type: 'spring', 
        damping: 8,
        stiffness: 80,
        duration: 0.6 
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      {/* Sandbag String */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 h-16 w-[2px] bg-gradient-to-b from-gray-500 to-gray-400"
        style={{ 
          bottom: '30px',
          transformOrigin: 'bottom',
          transform: `rotate(${xOffset > 0 ? 5 : -5}deg)`
        }}
      />
      
      {/* Sandbag */}
      <motion.div
        className="w-12 h-16 bg-sandbag rounded-md shadow-md flex items-center justify-center relative overflow-hidden"
        animate={{ 
          y: [0, 5, 0],
          rotate: [0, xOffset > 0 ? 3 : -3, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5 + (index % 2), 
          ease: "easeInOut" 
        }}
      >
        <div className="absolute inset-0 bg-sandbagDark opacity-30 bottom-0 h-1/2 rounded-b-md" />
        <div className="absolute top-0 left-0 w-full h-full grid grid-cols-2 gap-1 p-1 opacity-30">
          <div className="bg-sandbagDark rounded-sm"></div>
          <div className="bg-sandbagDark rounded-sm"></div>
          <div className="bg-sandbagDark rounded-sm"></div>
          <div className="bg-sandbagDark rounded-sm"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Basket: React.FC<{ balloons: number; sandbags: number }> = ({ balloons, sandbags }) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Ropes connecting to balloons */}
      <motion.div className="w-24 h-6 flex justify-between items-center mb-1">
        <div className="w-[2px] h-6 bg-gradient-to-b from-gray-500 to-gray-600 transform -rotate-12"></div>
        <div className="w-[2px] h-6 bg-gradient-to-b from-gray-500 to-gray-600"></div>
        <div className="w-[2px] h-6 bg-gradient-to-b from-gray-500 to-gray-600 transform rotate-12"></div>
      </motion.div>
      
      {/* Basket */}
      <motion.div 
        className="w-24 h-16 bg-gradient-to-b from-basket to-yellow-800 rounded-b-xl relative flex flex-col items-center overflow-hidden"
        initial={{ scale: 0.9 }}
        animate={{ 
          scale: [1, balloons > sandbags ? 1.03 : 0.97, 1],
          y: [0, balloons > sandbags ? -3 : 3, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        {/* Basket weaving details */}
        <div className="w-full h-3 border-t border-b border-yellow-800/60 mt-2"></div>
        <div className="w-full h-3 border-t border-b border-yellow-800/60 mt-2"></div>
        
        {/* Display values - only shown if there are any */}
        {(balloons > 0 || sandbags > 0) && (
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
            {balloons > 0 && (
              <div className="text-xs font-semibold mb-1 bg-balloon text-white px-2 py-0.5 rounded-full">
                +{balloons}
              </div>
            )}
            {sandbags > 0 && (
              <div className="text-xs font-semibold mb-1 bg-sandbag text-white px-2 py-0.5 rounded-full">
                -{sandbags}
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Sandbag attachment points */}
      <div className="w-20 flex justify-between mt-1">
        <div className="w-[2px] h-4 bg-gradient-to-b from-gray-600 to-gray-500 transform -rotate-12"></div>
        <div className="w-[2px] h-4 bg-gradient-to-b from-gray-600 to-gray-500 transform rotate-12"></div>
      </div>
    </div>
  );
};
