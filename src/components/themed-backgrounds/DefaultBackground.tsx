import React from 'react';
import { motion } from 'framer-motion';

const DefaultBackground: React.FC = () => {
  // Generate floating math elements
  const generateMathElements = () => {
    const elements = [];
    const symbols = ['+', '-', '×', '÷', '=', '%'];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const colors = [
      'text-blue-500', 'text-pink-500', 'text-amber-500', 
      'text-green-500', 'text-violet-500', 'text-sky-500'
    ];
    
    // Create floating symbols
    for (let i = 0; i < 25; i++) {
      const isSymbol = Math.random() > 0.5;
      const char = isSymbol 
        ? symbols[Math.floor(Math.random() * symbols.length)]
        : numbers[Math.floor(Math.random() * numbers.length)];
      
      const size = Math.floor(Math.random() * 30) + 16; // 16-46px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 100; // 0-100% of screen width
      const y = Math.random() * 100; // 0-100% of screen height
      const duration = Math.floor(Math.random() * 30) + 20; // 20-50s
      const delay = Math.random() * 10;
      
      elements.push(
        <motion.div
          key={i}
          className={`absolute font-bold ${color}`}
          style={{
            fontSize: size,
            left: `${x}%`,
            top: `${y}%`,
            textShadow: '2px 2px 0 rgba(0,0,0,0.1)',
            fontFamily: 'math, serif'
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
        >
          {char}
        </motion.div>
      );
    }
    
    // Add some basic shapes
    const shapes = ['circle', 'square', 'triangle'];
    for (let i = 0; i < 15; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.floor(Math.random() * 40) + 10; // 10-50px
      const color = colors[Math.floor(Math.random() * colors.length)].replace('text-', 'bg-');
      const x = Math.random() * 100; // 0-100% of screen width
      const y = Math.random() * 100; // 0-100% of screen height
      const duration = Math.floor(Math.random() * 30) + 20; // 20-50s
      const delay = Math.random() * 10;
      
      let className = `absolute ${color} opacity-40`;
      let style: React.CSSProperties = {
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      };
      
      if (shape === 'circle') {
        className += ' rounded-full';
      } else if (shape === 'triangle') {
        style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      }
      
      elements.push(
        <motion.div
          key={`shape-${i}`}
          className={className}
          style={style}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.4,
            scale: 1,
            x: [0, Math.random() * 50 - 25, Math.random() * -50 + 25, 0],
            y: [0, Math.random() * -50, Math.random() * 50, 0],
            rotate: [0, 180, 360],
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
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-amber-100/30 to-amber-300/30">
      {/* Floating math elements */}
      {generateMathElements()}
      
      {/* Light beams */}
      <motion.div 
        className="absolute top-0 left-1/4 w-40 h-screen bg-pink-200/10"
        initial={{ opacity: 0, rotate: 15 }}
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-0 right-1/3 w-32 h-screen bg-blue-200/10"
        initial={{ opacity: 0, rotate: -15 }}
        animate={{ opacity: [0.2, 0.4, 0.2], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Create a few bubbles/circles */}
      <motion.div 
        className="absolute w-48 h-48 rounded-full bg-amber-100 z-0"
        style={{ bottom: '10%', left: '20%' }}
        animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute w-32 h-32 rounded-full bg-amber-100 z-0"
        style={{ top: '20%', right: '15%' }}
        animate={{ scale: [1, 1.2, 1], y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute w-24 h-24 rounded-full bg-amber-100 z-0"
        style={{ bottom: '30%', right: '25%' }}
        animate={{ scale: [1, 1.15, 1], y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
};

export default DefaultBackground; 