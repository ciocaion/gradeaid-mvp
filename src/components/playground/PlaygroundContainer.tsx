
import React, { useState, useEffect, useRef } from 'react';
import PlaygroundScene from './PlaygroundScene';
import Controls from '../Controls';
import Guidance from '../Guidance';
import { 
  calculateValue, 
  generateHint, 
  addBalloons, 
  addSandbags, 
  removeBalloons, 
  removeSandbags
} from '@/utils/mathUtils';
import { toast } from 'sonner';

const PlaygroundContainer: React.FC = () => {
  const [balloons, setBalloons] = useState(0);
  const [sandbags, setSandbags] = useState(0);
  const [hint, setHint] = useState("");
  const [playgroundHeight, setPlaygroundHeight] = useState(400);
  const [lastAction, setLastAction] = useState<'add-balloon' | 'add-sandbag' | 'remove-balloon' | 'remove-sandbag' | null>(null);
  
  const playgroundRef = useRef<HTMLDivElement>(null);
  
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
  
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      <div 
        className="flex-1 relative overflow-hidden rounded-xl glass bg-gradient-to-b from-sky-200/60 to-sky/60 shadow-lg" 
        ref={playgroundRef}
      >
        <PlaygroundScene 
          balloons={balloons}
          sandbags={sandbags}
          value={value}
          playgroundHeight={playgroundHeight}
          handleRemoveBalloon={handleRemoveBalloon}
          handleRemoveSandbag={handleRemoveSandbag}
        />
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

export default PlaygroundContainer;
