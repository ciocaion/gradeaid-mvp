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
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const Index = () => {
  const { t, i18n } = useTranslation();
  const { preferences, addPoints } = useUserPreferences();
  const navigate = useNavigate();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);
  
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
      toast.success(t('learning.journeyComplete'), {
        description: t('learning.journeyCompleteDescription')
      });
      
      // Navigate back to home
      navigate('/home');
    }
  };
  
  const getNextActivityName = () => {
    if (currentPathIndex + 1 >= learningPath.length) {
      return t('learning.completeJourney');
    }
    
    const nextPath = learningPath[currentPathIndex + 1];
    switch(nextPath) {
      case '/exercises/balloons': return t('learning.tools.balloonExercise');
      case '/image-to-learning': return t('learning.tools.imageLearning');
      case '/real-life-practice': return t('learning.tools.realLifePractice');
      case '/video-learning': return t('learning.tools.videoLearning');
      default: return t('learning.tools.nextActivity');
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
              <ArrowLeft className="h-4 w-4 mr-1" /> {t('common.backToHome')}
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight inline-block">
              {isInLearningJourney ? `🎈 ${t('home.menu.balloonSandbag.title')}: ${learningTopic}` : t('home.menu.balloonSandbag.title')}
            </h1>
          </div>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t('home.menu.balloonSandbag.description')}
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
            <h2 className="text-lg font-semibold">{t('learning.yourLearningJourney')}: {learningTopic}</h2>
            <AudioText text={`${t('learning.yourLearningJourney')}: ${learningTopic}. ${t('learning.step')} ${currentPathIndex + 1} ${t('learning.of')} ${learningPath.length}.`} className="ml-1" />
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.round(((currentPathIndex + 1) / learningPath.length) * 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {t('learning.step')} {currentPathIndex + 1} {t('learning.of')} {learningPath.length}
            </span>
            
            <Button 
              size="sm"
              variant="outline"
              className="bg-white shadow-sm hover:shadow-md"
              onClick={continueToNextActivity}
            >
              {t('learning.continueTo')} {getNextActivityName()} →
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
          {t('home.menu.balloonSandbag.instructions')}
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
