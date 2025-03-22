import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  Brain, 
  Home as HomeIcon,
  BookOpen,
  PenLine,
  Camera,
  Youtube,
  Gamepad2,
  ChevronRight,
  Star,
  Sparkles,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import LearningProgress from '@/components/LearningProgress';
import AudioText from '@/components/AudioText';
import { Input } from '@/components/ui/input';
import TaskAnalysis from '@/components/TaskAnalysis';
import { useTranslation } from 'react-i18next';

const Learning = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { t, i18n } = useTranslation();
  const [learningTopic, setLearningTopic] = useState('');
  const [learningOverview, setLearningOverview] = useState('');
  const [isGeneratingOverview, setIsGeneratingOverview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Learning path based on user preferences
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [learningPathIndex, setLearningPathIndex] = useState(0);

  // Map learning styles to tools
  const toolPaths = {
    visual: ['/video-learning', '/exercises/balloons', '/image-to-learning', '/real-life-practice'],
    kinesthetic: ['/real-life-practice', '/exercises/balloons', '/image-to-learning', '/video-learning'],
    auditory: ['/video-learning', '/real-life-practice', '/exercises/balloons', '/image-to-learning'],
    reading: ['/image-to-learning', '/video-learning', '/real-life-practice', '/exercises/balloons']
  };

  // Generate learning path based on user's primary learning style
  useEffect(() => {
    if (preferences && preferences.learningStyles && preferences.learningStyles.length > 0) {
      // Use the first learning style preference
      const primaryStyle = preferences.learningStyles[0];
      // @ts-ignore - We know these keys exist
      setLearningPath(toolPaths[primaryStyle] || toolPaths.visual);
    } else {
      // Default to visual learning if no preferences
      setLearningPath(toolPaths.visual);
    }
  }, [preferences]);

  // Redirect to onboarding if no preferences are set
  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      navigate('/onboarding');
    }
  }, [preferences.hasCompletedOnboarding, navigate]);

  // Generate learning overview
  const generateLearningOverview = async () => {
    if (!learningTopic.trim()) return;
    
    setIsGeneratingOverview(true);

    // Simulate API call with a mock response
    // In a real implementation, this would use the OpenAI API with the .env key
    setTimeout(() => {
      // Generate content based on the current language
      if (i18n.language === 'da') {
        // Danish mock responses
        const danishOverviews = [
          `✨ Lad os lære om ${learningTopic}! Vi vil udforske nøglekoncepter med sjove aktiviteter. 🧠 Din læringsrejse er tilpasset den måde, du lærer bedst på!`,
          `🌟 ${learningTopic} er et fascinerende emne! Vi har planlagt en spændende læringsvej specielt til dig. 🚀 Lad os gøre læring sjovt og interaktivt!`,
          `🔍 Klar til at opdage ${learningTopic}? Vi vil bruge flere tilgange til at hjælpe dig med at forstå det grundigt. 💡 Lad os starte dette eventyr sammen!`
        ];
        setLearningOverview(danishOverviews[Math.floor(Math.random() * danishOverviews.length)]);
      } else {
        // English mock responses
        const englishOverviews = [
          `✨ Let's learn about ${learningTopic}! We'll explore key concepts with fun activities. 🧠 Your learning journey is customized for the way you learn best!`,
          `🌟 ${learningTopic} is a fascinating topic! We've planned an exciting learning path just for you. 🚀 Let's make learning fun and interactive!`,
          `🔍 Ready to discover ${learningTopic}? We'll use multiple approaches to help you understand it thoroughly. 💡 Let's start this adventure together!`
        ];
        setLearningOverview(englishOverviews[Math.floor(Math.random() * englishOverviews.length)]);
      }
      
      setIsGeneratingOverview(false);
      setCurrentStep(2);
    }, 1500);
  };

  const startLearningJourney = () => {
    // Save learning topic and current path to sessionStorage
    sessionStorage.setItem('currentLearningTopic', learningTopic);
    sessionStorage.setItem('currentLearningPath', JSON.stringify(learningPath));
    sessionStorage.setItem('currentLearningPathIndex', '0');
    
    // Navigate to the first tool in the learning path
    navigate(learningPath[0]);
  };

  const getNextToolName = (path: string) => {
    switch(path) {
      case '/video-learning': return t('learning.tools.videoLearning');
      case '/exercises/balloons': return t('learning.tools.balloonExercise');
      case '/image-to-learning': return t('learning.tools.imageLearning');
      case '/real-life-practice': return t('learning.tools.realLifePractice');
      default: return t('learning.tools.nextActivity');
    }
  };

  // Task steps for visual progress
  const taskSteps = [
    { step: 1, text: t('learning.steps.step1'), icon: "🤔", complete: currentStep > 1 },
    { step: 2, text: t('learning.steps.step2'), icon: "📝", complete: currentStep > 2 },
    { step: 3, text: t('learning.steps.step3'), icon: "🚀", complete: currentStep > 3 }
  ];

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto p-6">
      <ThemedBackground theme={preferences.theme} className="fixed inset-0 z-[-1]" />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 hover:bg-white/90 shadow-md hover:shadow-lg transition-all"
            onClick={() => navigate('/home')}
          >
            <HomeIcon className="h-4 w-4 mr-1.5" /> {t('common.backToHome')}
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {t('learning.title')}
            <AudioText 
              text={t('learning.audioText')}
              className="ml-2"
            />
          </h1>
        </div>
        
        <PreferencesButton />
      </div>
      
      {/* Task progress */}
      <div className="mb-8">
        <TaskAnalysis 
          steps={taskSteps}
          currentStep={currentStep}
          onStepComplete={() => {}}
        />
      </div>
      
      {/* Learning input card */}
      {currentStep === 1 && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                {t('learning.whatWouldYouLikeToLearn')}
                <AudioText 
                  text={t('learning.whatWouldYouLikeToLearnAudio')}
                  className="ml-2"
                />
              </h2>
              
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder={t('learning.topicPlaceholder')}
                  value={learningTopic}
                  onChange={(e) => setLearningTopic(e.target.value)}
                  className="text-lg py-6"
                />
                
                <Button 
                  onClick={generateLearningOverview}
                  disabled={isGeneratingOverview || !learningTopic.trim()}
                  className="px-6 py-6 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90"
                >
                  {isGeneratingOverview ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-opacity-40 border-t-white rounded-full"></div>
                      {t('learning.thinking')}
                    </>
                  ) : (
                    <>
                      {t('learning.letsLearn')} <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Learning overview card */}
      {currentStep === 2 && learningOverview && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-green-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    {t('learning.yourLearningOverview')}: {learningTopic}
                    <AudioText 
                      text={`${t('learning.yourLearningOverview')}: ${learningTopic}`}
                      className="ml-2"
                    />
                  </h2>
                  
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {learningOverview}
                  </p>
                  
                  <h3 className="font-semibold text-lg mb-4">{t('learning.yourPersonalizedLearningPath')}</h3>
                  
                  <div className="space-y-3 mb-6">
                    {learningPath.map((path, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                      >
                        <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{getNextToolName(path)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => {
                      startLearningJourney();
                      setCurrentStep(3);
                    }}
                    className="w-full py-6 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90"
                  >
                    {t('learning.startJourney')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Learning journey started message */}
      {currentStep === 3 && (
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-purple-100 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Star className="h-10 w-10 text-purple-600" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-2">
                  {t('learning.journeyStarted')}
                </h2>
                
                <p className="text-gray-700 mb-6 text-lg text-center">
                  {t('learning.journeyStartedDescription', { topic: learningTopic })}
                </p>
                
                <Button 
                  onClick={() => navigate(learningPath[0])}
                  className="px-6 py-6 text-lg shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90"
                >
                  {t('learning.continueToFirstActivity')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Learning; 