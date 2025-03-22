import React from 'react';
import { motion } from 'framer-motion';

const RobloxBackground: React.FC = () => {
  // Generate floating Roblox elements
  const generateElements = () => {
    const elements = [];
    
    // Create floating Roblox characters (simplified as shapes)
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.floor(Math.random() * 20) + 30;
      const headSize = size * 0.6;
      const bodySize = size;
      const armSize = size * 0.3;
      const legSize = size * 0.4;
      const duration = Math.floor(Math.random() * 20) + 15;
      const delay = Math.random() * 5;
      const colorIndex = Math.floor(Math.random() * 5);
      const colors = ['bg-yellow-500', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500'];
      const color = colors[colorIndex];
      
      elements.push(
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.8,
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            y: [0, Math.random() * -80, Math.random() * 80, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{ 
            duration: duration, 
            repeat: Infinity, 
            delay: delay,
            ease: "linear"
          }}
        >
          {/* Roblox character */}
          <div className="relative">
            {/* Head */}
            <div 
              className={`rounded-sm ${color}`} 
              style={{ 
                width: headSize, 
                height: headSize, 
                boxShadow: '3px 3px 0 rgba(0,0,0,0.2)'
              }}
            >
              {/* Eyes */}
              <div className="absolute bg-black rounded-full" style={{ width: headSize/5, height: headSize/5, top: headSize/4, left: headSize/4 }} />
              <div className="absolute bg-black rounded-full" style={{ width: headSize/5, height: headSize/5, top: headSize/4, right: headSize/4 }} />
              {/* Mouth */}
              <div className="absolute bg-white rounded-sm" style={{ width: headSize/2, height: headSize/10, bottom: headSize/5, left: headSize/4 }} />
            </div>
            
            {/* Body */}
            <div 
              className={`mt-1 rounded-sm ${color}`} 
              style={{ 
                width: bodySize * 0.8, 
                height: bodySize, 
                marginLeft: (headSize - bodySize * 0.8) / 2,
                boxShadow: '3px 3px 0 rgba(0,0,0,0.2)'
              }}
            />
            
            {/* Arms */}
            <div 
              className={`absolute rounded-sm ${color}`} 
              style={{ 
                width: armSize, 
                height: bodySize * 0.7, 
                top: headSize + 1, 
                left: (headSize - bodySize * 0.8) / 2 - armSize,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            />
            <div 
              className={`absolute rounded-sm ${color}`} 
              style={{ 
                width: armSize, 
                height: bodySize * 0.7, 
                top: headSize + 1, 
                right: (headSize - bodySize * 0.8) / 2 - armSize,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            />
            
            {/* Legs */}
            <div 
              className={`absolute rounded-sm ${color}`} 
              style={{ 
                width: legSize, 
                height: legSize, 
                bottom: -legSize, 
                left: headSize/2 - legSize,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            />
            <div 
              className={`absolute rounded-sm ${color}`} 
              style={{ 
                width: legSize, 
                height: legSize, 
                bottom: -legSize, 
                right: headSize/2 - legSize,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </motion.div>
      );
    }
    
    // Create some random Roblox objects (simplified as colorful geometric shapes)
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.floor(Math.random() * 25) + 20;
      const duration = Math.floor(Math.random() * 25) + 20;
      const delay = Math.random() * 8;
      
      // Random shape - 0: circle, 1: square, 2: triangle
      const shape = Math.floor(Math.random() * 3);
      const colorIndex = Math.floor(Math.random() * 5);
      const colors = ['bg-pink-400', 'bg-blue-400', 'bg-purple-400', 'bg-yellow-400', 'bg-green-400'];
      const color = colors[colorIndex];
      
      let className = `absolute ${color}`;
      let style: React.CSSProperties = {
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
      };
      
      if (shape === 0) {
        className += ' rounded-full'; // Circle
      } else if (shape === 2) {
        // Triangle (using clip-path)
        style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      }
      
      elements.push(
        <motion.div
          key={`obj-${i}`}
          className={className}
          style={style}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.7,
            scale: 1,
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            y: [0, Math.random() * -100, Math.random() * 100, 0],
            rotate: [0, 360],
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
    
    return elements;
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600 z-0">
      {/* Platform-like floor */}
      <div className="absolute bottom-0 w-full h-1/6 bg-red-500 z-0" />
      
      {/* Floating Roblox elements */}
      {generateElements()}
      
      {/* Logo-like element */}
      <motion.div 
        className="absolute top-5 left-5 z-0"
        animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className="w-16 h-16 bg-white rounded-sm grid grid-cols-2 grid-rows-2 gap-1 p-1">
          <div className="bg-red-500"></div>
          <div className="bg-green-500"></div>
          <div className="bg-blue-500"></div>
          <div className="bg-yellow-500"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default RobloxBackground; 