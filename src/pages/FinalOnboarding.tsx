
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, UserRound, Brain, Gamepad2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Guidance from '@/components/Guidance';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const FinalOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, completeOnboarding } = useUserPreferences();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleBack = () => {
    navigate('/features');
  };
  
  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      completeOnboarding();
      navigate('/app');
    }, 1500);
  };
  
  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background/90 to-background relative overflow-hidden`}
    >
      <div className="fixed top-6 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full ${
                index === 4 
                  ? 'bg-primary w-8' 
                  : index < 4 
                    ? 'bg-primary/70 w-6' 
                    : 'bg-gray-300 w-6'
              }`}
              initial={false}
              animate={{
                width: index === 4 ? 32 : 24,
                opacity: index === 4 ? 1 : index < 4 ? 0.7 : 0.4
              }}
            />
          ))}
        </div>
      </div>
      
      {preferences.points > 0 && (
        <motion.div 
          className="fixed top-6 right-6 bg-primary/90 text-white px-3 py-1.5 rounded-full flex items-center"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <Star className="h-5 w-5 mr-1.5" fill="white" />
          <span className="font-bold">{preferences.points}</span>
        </motion.div>
      )}
      
      <motion.div 
        className="max-w-md w-full text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ 
            y: isAnimating ? [0, -20, 0] : 0,
            scale: isAnimating ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 1.5, times: [0, 0.5, 1] }}
          className="w-32 h-32 bg-gradient-to-br from-primary to-primary-foreground rounded-full mx-auto flex items-center justify-center"
        >
          <Star className="w-16 h-16 text-white" />
        </motion.div>
        
        <motion.div
          animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1.5, times: [0, 0.5, 1] }}
        >
          <h1 className="text-3xl font-bold text-primary">You're All Set, {preferences.name}!</h1>
          <p className="text-lg text-gray-600 mt-2">
            You've earned <span className="font-bold text-primary">{preferences.points} points</span> and 
            <span className="font-bold text-primary"> {preferences.badges.length} badge</span> already!
          </p>
        </motion.div>
        
        <div className="bg-primary/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-2">Your learning profile:</h3>
          <ul className="space-y-2 text-left">
            <li className="flex items-center">
              <UserRound className="h-5 w-5 mr-2 text-primary" />
              <span>Name: <span className="font-medium">{preferences.name}</span></span>
            </li>
            <li className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              <span>Learning styles: <span className="font-medium">
                {preferences.learningStyles.length === 0 ? 'All styles' : preferences.learningStyles.join(', ')}
              </span></span>
            </li>
            <li className="flex items-center">
              <Gamepad2 className="h-5 w-5 mr-2 text-primary" />
              <span>Theme: <span className="font-medium">{preferences.theme}</span></span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 text-lg py-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          
          <Button
            onClick={handleComplete}
            className="flex-1 text-lg py-6"
            variant="default"
          >
            Start Learning!
          </Button>
        </div>
        
        <Guidance message="You can always update your preferences later. Now let's start your learning adventure!" />
      </motion.div>
    </div>
  );
};

export default FinalOnboarding;
