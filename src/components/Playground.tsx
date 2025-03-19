import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Balloon, Sandbag, Basket } from './BalloonSandbag';
import NumberLine from './NumberLine';
import Controls from './Controls';
import Guidance from './Guidance';
import CloudScene from './CloudScene';
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
  
  const playgroundRef = React.useRef<HTMLDivElement>(null);
  
  const value = calculateValue(balloons, sandbags);
  
  useEffect(() => {
    setHint(generateHint(balloons, sandbags));
  }, [balloons, sandbags]);
  
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
  
  const handleAddBalloon = () => {
    setBalloons(prev => addBalloons(prev, 1));
    setLastAction('add-balloon');
    toast.success('Balloon added! Your basket rises higher.', {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  const handleRemoveBalloon = () => {
    setBalloons(prev => removeBalloons(prev, 1));
    setLastAction('remove-balloon');
    if (balloons > 0) toast.info('Balloon removed! The basket feels a bit heavier now.', {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  const handleAddSandbag = () => {
    setSandbags(prev => addSandbags(prev, 1));
    setLastAction('add-sandbag');
    toast.success('Sandbag added! Your basket sinks lower.', {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  const handleRemoveSandbag = () => {
    setSandbags(prev => removeSandbags(prev, 1));
    setLastAction('remove-sandbag');
    if (sandbags > 0) toast.info('Sandbag removed! The basket feels a bit lighter now.', {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  const basketPosition = getBasketPosition(value, playgroundHeight * 0.7, playgroundHeight * 0.2);
  
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      <div className="flex-1 relative overflow-hidden rounded-xl glass bg-gradient-to-b from-sky-200/60 to-sky/60 shadow-lg" ref={playgroundRef}>
        <CloudScene height={playgroundHeight} animate={true} />
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/30 to-transparent" />
        
        <div className="absolute left-6 top-0 bottom-0 h-full">
          <NumberLine min={-10} max={13} value={value} height={playgroundHeight} />
        </div>
        
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
