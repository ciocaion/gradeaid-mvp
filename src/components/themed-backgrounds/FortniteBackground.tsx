import React from 'react';
import { motion } from 'framer-motion';

const FortniteBackground: React.FC = () => {
  // Generate animated elements
  const generateElements = () => {
    const elements = [];
    
    // Generate floating llamas
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 60 + 10;
      const size = Math.floor(Math.random() * 20) + 30;
      const duration = Math.floor(Math.random() * 20) + 15;
      const delay = Math.random() * 5;
      
      elements.push(
        <motion.div
          key={`llama-${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.8,
            scale: 1,
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            y: [0, Math.random() * -40, Math.random() * 40, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{ 
            duration: duration, 
            repeat: Infinity, 
            delay: delay,
            ease: "linear"
          }}
        >
          {/* Simplified llama piñata */}
          <div 
            className="relative"
            style={{ width: size, height: size * 1.2 }}
          >
            <div 
              className="absolute bg-purple-400 rounded-lg transform rotate-45"
              style={{
                width: size * 0.8,
                height: size * 0.8,
                left: size * 0.1,
                top: size * 0.2,
                boxShadow: '3px 3px 0 rgba(0,0,0,0.2)'
              }}
            />
            <div 
              className="absolute bg-pink-300 rounded"
              style={{
                width: size * 0.4,
                height: size * 0.6,
                left: size * 0.3,
                top: 0,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            />
            {/* Eyes */}
            <div 
              className="absolute bg-white rounded-full"
              style={{
                width: size * 0.15,
                height: size * 0.15,
                left: size * 0.25,
                top: size * 0.3,
                boxShadow: 'inset 0 0 0 3px #000'
              }}
            />
            <div 
              className="absolute bg-white rounded-full"
              style={{
                width: size * 0.15,
                height: size * 0.15,
                right: size * 0.25,
                top: size * 0.3,
                boxShadow: 'inset 0 0 0 3px #000'
              }}
            />
          </div>
        </motion.div>
      );
    }
    
    // Supply drops
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * 80 + 10;
      const delay = Math.random() * 10 + i * 5;
      const size = Math.floor(Math.random() * 10) + 30;
      
      elements.push(
        <motion.div
          key={`drop-${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            top: '-5%',
          }}
          initial={{ opacity: 0, y: '-5%' }}
          animate={{ 
            opacity: [0, 1, 1, 1],
            y: ['-5%', '110%'],
            rotate: [0, 5, -5, 0, 5],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            delay: delay,
            ease: "easeIn"
          }}
        >
          {/* Supply drop with parachute */}
          <div className="relative">
            <div 
              className="absolute rounded-lg bg-blue-800"
              style={{
                width: size,
                height: size,
                bottom: 0,
                left: 0,
                boxShadow: '3px 3px 0 rgba(0,0,0,0.2)'
              }}
            >
              <div 
                className="absolute bg-blue-600"
                style={{
                  width: size * 0.6,
                  height: size * 0.1,
                  left: size * 0.2,
                  top: size * 0.45
                }}
              />
            </div>
            <div
              className="absolute rounded-t-full bg-sky-500 origin-bottom"
              style={{
                width: size * 2,
                height: size * 1.5,
                bottom: size,
                left: -size / 2
              }}
            >
              <div
                className="absolute bg-sky-600"
                style={{
                  width: 2,
                  height: size * 1.5,
                  left: size,
                  top: 0
                }}
              />
            </div>
          </div>
        </motion.div>
      );
    }
    
    return elements;
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-purple-500 to-blue-700 z-0">
      {/* Storm effect */}
      <motion.div 
        className="absolute inset-0 bg-purple-900 opacity-20 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.1, 0.3, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Storm circle */}
      <motion.div 
        className="absolute rounded-full border-4 border-purple-500 z-0"
        style={{ 
          boxShadow: '0 0 30px 10px rgba(137, 66, 226, 0.5) inset, 0 0 10px 5px rgba(137, 66, 226, 0.8)',
          width: '200vw',
          height: '200vw',
          left: '-50vw',
          top: '-50vh'
        }}
        initial={{ opacity: 0.6 }}
        animate={{ 
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 0.8, 0.6, 0.4, 0.3]
        }}
        transition={{ 
          duration: 60, 
          repeat: Infinity,
          repeatDelay: 5
        }}
      />
      
      {/* Distant mountains */}
      <div className="absolute bottom-0 w-full h-1/5 bg-green-800 z-0" />
      <div className="absolute bottom-1/5 left-1/6 w-1/3 h-1/5 bg-gray-800 z-0" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
      <div className="absolute bottom-1/5 right-1/6 w-1/4 h-1/6 bg-gray-700 z-0" style={{ clipPath: 'polygon(0% 100%, 60% 0%, 100% 100%)' }} />
      
      {/* Battle bus */}
      <motion.div 
        className="absolute z-0"
        style={{ top: '10%', left: '-10%' }}
        animate={{ x: ['calc(-10%)', 'calc(110%)'] }}
        transition={{ duration: 30, repeat: Infinity, delay: 10 }}
      >
        <div className="relative">
          <div className="w-24 h-10 bg-blue-500 rounded-lg relative">
            <div className="absolute top-10 w-28 h-16 bg-blue-600 rounded-xl -left-2"></div>
            <div className="absolute w-8 h-8 rounded-full bg-yellow-400 -top-10 left-8">
              <div className="w-1 h-10 bg-gray-800 absolute left-4 -top-10"></div>
            </div>
            
            {/* Bus windows */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-sm"></div>
            <div className="absolute top-2 left-8 w-4 h-4 bg-white rounded-sm"></div>
            <div className="absolute top-2 left-14 w-4 h-4 bg-white rounded-sm"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Animated elements */}
      {generateElements()}
    </div>
  );
};

export default FortniteBackground; 