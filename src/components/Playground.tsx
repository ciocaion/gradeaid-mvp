
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Balloon, Sandbag, Basket } from './BalloonSandbag';
import NumberLine from './NumberLine';
import Controls from './Controls';
import Guidance from './Guidance';
import { 
  calculateValue, 
  generateHint, 
  addBalloons, 
  addSandbags, 
  removeBalloons, 
  removeSandbags,
  getBasketPosition
} from '@/utils/mathUtils';

const Playground: React.FC = () => {
  const [balloons, setBalloons] = useState(0);
  const [sandbags, setSandbags] = useState(0);
  const [hint, setHint] = useState("");
  const [playgroundHeight, setPlaygroundHeight] = useState(400);
  
  // Reference for the height measurement
  const playgroundRef = React.useRef<HTMLDivElement>(null);
  
  // Calculate the value
  const value = calculateValue(balloons, sandbags);
  
  // Update hint when balloons or sandbags change
  useEffect(() => {
    setHint(generateHint(balloons, sandbags));
  }, [balloons, sandbags]);
  
  // Measure the height of the playground
  useEffect(() => {
    if (playgroundRef.current) {
      setPlaygroundHeight(playgroundRef.current.clientHeight);
    }
    
    const handleResize = () => {
      if (playgroundRef.current) {
        setPlaygroundHeight(playgroundRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle adding and removing balloons and sandbags
  const handleAddBalloon = () => setBalloons(prev => addBalloons(prev, 1));
  const handleRemoveBalloon = () => setBalloons(prev => removeBalloons(prev, 1));
  const handleAddSandbag = () => setSandbags(prev => addSandbags(prev, 1));
  const handleRemoveSandbag = () => setSandbags(prev => removeSandbags(prev, 1));
  
  // Calculate the vertical position of the basket
  const basketPosition = getBasketPosition(value, playgroundHeight * 0.7, playgroundHeight * 0.2);
  
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* Visualization Area */}
      <div className="flex-1 relative overflow-hidden rounded-xl glass bg-sky/60 shadow-lg" ref={playgroundRef}>
        {/* Sky Background with Clouds */}
        <div className="absolute inset-0 z-0">
          {/* Clouds */}
          <motion.div 
            className="absolute top-[10%] left-[10%] w-24 h-12 bg-white rounded-full opacity-80 blur-sm"
            animate={{ x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[15%] right-[20%] w-32 h-16 bg-white rounded-full opacity-80 blur-sm"
            animate={{ x: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[30%] left-[30%] w-20 h-10 bg-white rounded-full opacity-70 blur-sm"
            animate={{ x: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 17, ease: "easeInOut" }}
          />
        </div>
        
        {/* Number Line */}
        <div className="absolute left-6 top-0 bottom-0 h-full">
          <NumberLine min={-10} max={13} value={value} height={playgroundHeight} />
        </div>
        
        {/* Basket with Strings */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: basketPosition }}
          animate={{ top: basketPosition }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <Basket balloons={balloons} sandbags={sandbags} />
        </motion.div>
        
        {/* Balloons */}
        <div className="absolute top-10 left-0 right-0 h-20">
          <AnimatePresence>
            {Array.from({ length: balloons }).map((_, index) => (
              <Balloon 
                key={`balloon-${index}`} 
                index={index} 
                total={Math.max(1, balloons)}
                onClick={() => handleRemoveBalloon()}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Sandbags */}
        <div className="absolute bottom-10 left-0 right-0 h-20">
          <AnimatePresence>
            {Array.from({ length: sandbags }).map((_, index) => (
              <Sandbag 
                key={`sandbag-${index}`} 
                index={index} 
                total={Math.max(1, sandbags)}
                onClick={() => handleRemoveSandbag()}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Controls and Guidance */}
      <div className="md:w-72 flex flex-col space-y-6">
        <Controls 
          onAddBalloon={handleAddBalloon}
          onRemoveBalloon={handleRemoveBalloon}
          onAddSandbag={handleAddSandbag}
          onRemoveSandbag={handleRemoveSandbag}
          balloons={balloons}
          sandbags={sandbags}
        />
        
        <Guidance message={hint} />
      </div>
    </div>
  );
};

export default Playground;
