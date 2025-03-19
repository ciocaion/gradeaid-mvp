
import React from 'react';
import { motion } from 'framer-motion';
import Playground from '@/components/Playground';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky/30 to-sky-200/30 flex flex-col p-4 md:p-8">
      <motion.header 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="inline-block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 tracking-tight inline-block">
            Balloon & Sandbag Math
          </h1>
        </motion.div>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 mt-3 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Visualize integer addition and subtraction using balloons and sandbags.
          Explore our interactive 3D environment with draggable elements!
        </motion.p>
      </motion.header>
      
      <motion.div 
        className="flex-1 rounded-xl overflow-hidden shadow-2xl max-w-6xl mx-auto w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Playground />
      </motion.div>
      
      <motion.footer 
        className="mt-8 text-center text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>
          Click on balloons or sandbags to remove them. Use the controls to add more.
          Try dragging the balloons and sandbags to see how they interact!
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
