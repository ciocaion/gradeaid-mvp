
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
import { toast } from 'sonner';

const Playground: React.FC = () => {
  const [balloons, setBalloons] = useState(0);
  const [sandbags, setSandbags] = useState(0);
  const [hint, setHint] = useState("");
  const [playgroundHeight, setPlaygroundHeight] = useState(400);
  const [lastAction, setLastAction] = useState<'add-balloon' | 'add-sandbag' | 'remove-balloon' | 'remove-sandbag' | null>(null);
  
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
  const handleAddBalloon = () => {
    setBalloons(prev => addBalloons(prev, 1));
    setLastAction('add-balloon');
    toast.success('Balloon added! Your basket rises higher.');
  };
  
  const handleRemoveBalloon = () => {
    setBalloons(prev => removeBalloons(prev, 1));
    setLastAction('remove-balloon');
    if (balloons > 0) toast.info('Balloon removed! The basket feels a bit heavier now.');
  };
  
  const handleAddSandbag = () => {
    setSandbags(prev => addSandbags(prev, 1));
    setLastAction('add-sandbag');
    toast.success('Sandbag added! Your basket sinks lower.');
  };
  
  const handleRemoveSandbag = () => {
    setSandbags(prev => removeSandbags(prev, 1));
    setLastAction('remove-sandbag');
    if (sandbags > 0) toast.info('Sandbag removed! The basket feels a bit lighter now.');
  };
  
  // Calculate the vertical position of the basket
  const basketPosition = getBasketPosition(value, playgroundHeight * 0.7, playgroundHeight * 0.2);
  
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* Visualization Area */}
      <div className="flex-1 relative overflow-hidden rounded-xl glass bg-gradient-to-b from-sky-200/60 to-sky/60 shadow-lg" ref={playgroundRef}>
        {/* Sky Background with Clouds */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Top clouds layer */}
          <motion.div 
            className="absolute top-[5%] left-[10%] w-28 h-14 bg-white rounded-full opacity-90 blur-sm"
            animate={{ x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[12%] right-[15%] w-36 h-16 bg-white rounded-full opacity-90 blur-sm"
            animate={{ x: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[8%] left-[30%] w-40 h-12 bg-white rounded-full opacity-80 blur-sm"
            animate={{ x: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 27, ease: "easeInOut" }}
          />
          
          {/* Middle clouds layer */}
          <motion.div 
            className="absolute top-[25%] right-[25%] w-32 h-10 bg-white rounded-full opacity-70 blur-sm"
            animate={{ x: [0, -25, 0] }}
            transition={{ repeat: Infinity, duration: 35, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-[35%] left-[15%] w-24 h-8 bg-white rounded-full opacity-60 blur-sm"
            animate={{ x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}
          />
          
          {/* Add new cloud when a balloon is added - animated */}
          <AnimatePresence>
            {lastAction === 'add-balloon' && (
              <motion.div 
                key="new-cloud"
                className="absolute w-20 h-10 bg-white rounded-full opacity-70 blur-sm"
                initial={{ y: 300, x: '50%', opacity: 0 }}
                animate={{ y: 50, opacity: 0.8 }}
                exit={{ y: 0, opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom "ground" decorative element for sandbags */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/30 to-transparent" />
        
        {/* Number Line */}
        <div className="absolute left-6 top-0 bottom-0 h-full">
          <NumberLine min={-10} max={13} value={value} height={playgroundHeight} />
        </div>
        
        {/* Basket with Strings */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{ top: basketPosition }}
          animate={{ 
            top: basketPosition,
            transition: { 
              type: "spring", 
              stiffness: 60, 
              damping: 12,
              mass: balloons > 0 ? 0.8 : 1.2 
            }
          }}
        >
          <Basket balloons={balloons} sandbags={sandbags} />
        </motion.div>
        
        {/* Balloons */}
        <div className="absolute top-10 left-0 right-0 h-20">
          <AnimatePresence mode="popLayout">
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
          <AnimatePresence mode="popLayout">
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
