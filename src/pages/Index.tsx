import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Playground from '@/components/Playground';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import { toast } from 'sonner';
import AudioText from '@/components/AudioText';

const Index = () => {
  const { preferences, addPoints } = useUserPreferences();
  const navigate = useNavigate();
  
  // Learning path state
  const [isInLearningJourney, setIsInLearningJourney] = useState<boolean>(false);
  const [learningTopic, setLearningTopic] = useState<string>('');
  const [currentPathIndex, setCurrentPathIndex] = useState<number>(0);
  const [learningPath, setLearningPath] = useState<string[]>([]);
  
  // Check if we're in a learning journey
  useEffect(() => {
    const storedTopic = sessionStorage.getItem('currentLearningTopic');
    const storedPathIndex = sessionStorage.getItem('currentLearningPathIndex');
    const storedPath = sessionStorage.getItem('currentLearningPath');
    
    if (storedTopic && storedPathIndex && storedPath) {
      setLearningTopic(storedTopic);
      setCurrentPathIndex(parseInt(storedPathIndex, 10));
      setLearningPath(JSON.parse(storedPath));
      setIsInLearningJourney(true);
    }
  }, []);
  
  const continueToNextActivity = () => {
    // Update the current path index in sessionStorage
    const nextIndex = currentPathIndex + 1;
    
    if (nextIndex < learningPath.length) {
      sessionStorage.setItem('currentLearningPathIndex', nextIndex.toString());
      navigate(learningPath[nextIndex]);
    } else {
      // We've completed the learning journey
      sessionStorage.removeItem('currentLearningTopic');
      sessionStorage.removeItem('currentLearningPath');
      sessionStorage.removeItem('currentLearningPathIndex');
      
      // Add extra points for completing a full learning journey
      addPoints(25);
      toast.success('Learning journey complete! +25 bonus points', {
        description: 'You\'ve completed all activities in your learning path!'
      });
      
      // Navigate back to home
      navigate('/home');
    }
  };
  
  const getNextActivityName = () => {
    if (currentPathIndex + 1 >= learningPath.length) {
      return 'Complete Journey';
    }
    
    const nextPath = learningPath[currentPathIndex + 1];
    switch(nextPath) {
      case '/exercises/balloons': return '🎈 Balloon Math Exercise';
      case '/image-to-learning': return '📸 Image Learning';
      case '/real-life-practice': return '✏️ Real Life Practice';
      case '/video-learning': return '🎥 Video Learning';
      default: return 'Next Activity';
    }
  };
  
  const goBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative">
      {/* Themed animated background */}
      <ThemedBackground theme={preferences.theme} />
      
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>
      
      <motion.header 
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/80 hover:bg-white/90 shadow-sm flex items-center"
              onClick={goBackToHome}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight inline-block">
              {isInLearningJourney ? `🎈 Balloon Math: ${learningTopic}` : 'Balloon & Sandbag Math'}
            </h1>
          </div>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Visualize integer addition and subtraction using balloons and sandbags.
            Explore our interactive 3D environment with draggable elements!
          </motion.p>
        </motion.div>

        {preferences.hasCompletedOnboarding && (
          <PreferencesButton />
        )}
      </motion.header>
      
      {/* Learning Journey Progress - show only if in a learning journey */}
      {isInLearningJourney && (
        <motion.div 
          className="mb-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">Learning Journey: {learningTopic}</h2>
            <AudioText text={`Learning Journey: ${learningTopic}. You are on step ${currentPathIndex + 1} of ${learningPath.length}.`} className="ml-1" />
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.round(((currentPathIndex + 1) / learningPath.length) * 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Step {currentPathIndex + 1} of {learningPath.length}
            </span>
            
            <Button 
              size="sm"
              variant="outline"
              className="bg-white shadow-sm hover:shadow-md"
              onClick={continueToNextActivity}
            >
              Continue to {getNextActivityName()} →
            </Button>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="flex-1 rounded-xl overflow-hidden shadow-2xl max-w-6xl mx-auto w-full bg-white/90 backdrop-blur-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Playground />
      </motion.div>
      
      <motion.footer 
        className="mt-8 text-center text-white/90 text-sm drop-shadow-lg"
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
