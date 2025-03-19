
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
  const angle = (index / total) * Math.PI;
  const xOffset = Math.sin(angle) * 40;
  
  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      style={{
        left: `calc(50% + ${xOffset}px)`,
        top: 0
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      {/* Balloon String */}
      <div 
        className="balloon-string absolute left-1/2 -translate-x-1/2 h-10"
        style={{ top: '30px' }}
      />
      
      {/* Balloon */}
      <motion.div
        className="w-12 h-14 rounded-full bg-balloon shadow-md flex items-center justify-center relative overflow-hidden"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-balloonDark rounded-full opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-6 h-6 blur-sm" />
        <div className="w-3 h-3 rounded-full bg-white opacity-40 absolute top-1/4 left-1/4" />
      </motion.div>
      
      {/* Balloon Knot */}
      <div className="w-2 h-3 bg-balloonDark rounded-b-full mx-auto" />
    </motion.div>
  );
};

export const Sandbag: React.FC<SandbagProps> = ({ index, total, onClick }) => {
  // Calculate position based on index and total
  const angle = (index / total) * Math.PI;
  const xOffset = Math.sin(angle) * 40;
  
  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      style={{
        left: `calc(50% + ${xOffset}px)`,
        bottom: 0
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      {/* Sandbag String */}
      <div 
        className="sandbag-string absolute left-1/2 -translate-x-1/2 h-10"
        style={{ bottom: '30px' }}
      />
      
      {/* Sandbag */}
      <motion.div
        className="w-10 h-14 bg-sandbag rounded-md shadow-md flex items-center justify-center relative overflow-hidden"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
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
    <motion.div 
      className="w-20 h-14 bg-basket rounded-md relative flex flex-col items-center"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Basket details */}
      <div className="w-full h-3 bg-basket border-t border-yellow-800 absolute top-4"></div>
      <div className="w-full h-3 bg-basket border-t border-yellow-800 absolute top-8"></div>
      
      {/* Balloon attachment point */}
      <div className="w-16 h-2 bg-gray-400 rounded-full absolute -top-2"></div>
      
      {/* Display values - only shown if there are any */}
      {(balloons > 0 || sandbags > 0) && (
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
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
  );
};
