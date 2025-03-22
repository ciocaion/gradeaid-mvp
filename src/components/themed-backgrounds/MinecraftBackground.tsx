import React from 'react';
import { motion } from 'framer-motion';

const MinecraftBackground: React.FC = () => {
  // Generate floating blocks
  const generateBlocks = () => {
    const blocks = [];
    const blockTypes = [
      'bg-green-800', // Grass block
      'bg-amber-800', // Dirt block
      'bg-gray-600', // Stone block
      'bg-gray-800', // Coal block
      'bg-yellow-600', // Oak plank
      'bg-blue-500', // Diamond block
    ];
    
    // Create 20 random blocks
    for (let i = 0; i < 20; i++) {
      const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
      const size = Math.floor(Math.random() * 30) + 20; // 20-50px
      const x = Math.random() * 100; // 0-100% of screen width
      const y = Math.random() * 100; // 0-100% of screen height
      const duration = Math.floor(Math.random() * 20) + 10; // 10-30s
      const delay = Math.random() * 5;
      
      blocks.push(
        <motion.div
          key={i}
          className={`absolute border border-black ${blockType}`}
          style={{
            width: size,
            height: size,
            left: `${x}%`,
            top: `${y}%`,
            boxShadow: 'inset 5px 5px rgba(255,255,255,0.2), inset -5px -5px rgba(0,0,0,0.2)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.7,
            scale: 1,
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            y: [0, Math.random() * -100, Math.random() * 100, 0],
            rotate: Math.random() * 360,
          }}
          transition={{ 
            duration: duration, 
            repeat: Infinity, 
            delay: delay,
            ease: "linear"
          }}
        />
      );
    }
    
    return blocks;
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-blue-500 z-0">
      {/* Distant mountains */}
      <div className="absolute bottom-0 w-full h-1/4 bg-green-700 z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/4 bg-gray-600 z-0" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/5 bg-gray-700 z-0" style={{ clipPath: 'polygon(0% 100%, 60% 0%, 100% 100%)' }} />
      
      {/* Sun */}
      <motion.div 
        className="absolute w-16 h-16 bg-yellow-300 z-0"
        style={{ top: '10%', right: '20%' }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      {/* Clouds */}
      <motion.div 
        className="absolute flex gap-2 z-0"
        style={{ top: '15%', left: '-100px' }}
        animate={{ x: ['calc(-100px)', 'calc(100vw)'] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-20 h-8 bg-white opacity-80" />
        <div className="w-12 h-8 bg-white opacity-80" />
        <div className="w-16 h-8 bg-white opacity-80" />
      </motion.div>
      
      <motion.div 
        className="absolute flex gap-2 z-0"
        style={{ top: '25%', left: '-150px' }}
        animate={{ x: ['calc(-150px)', 'calc(100vw)'] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 5 }}
      >
        <div className="w-16 h-8 bg-white opacity-80" />
        <div className="w-24 h-8 bg-white opacity-80" />
        <div className="w-12 h-8 bg-white opacity-80" />
      </motion.div>
      
      {/* Floating blocks */}
      {generateBlocks()}
    </div>
  );
};

export default MinecraftBackground; 