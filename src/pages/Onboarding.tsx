import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserPreferences, LearningStyle, Theme } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Book, Video, Headphones, PaintBucket, 
  Gamepad2, Brain, ArrowRight, Star, 
  Camera, MessageSquare, Award, UserRound,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Guidance from '@/components/Guidance';
import { useTranslation } from 'react-i18next';

interface OnboardingProps {
  step?: number;
}

const WelcomeStep: React.FC<{onNext: () => void}> = ({ onNext }) => {
  const { t } = useTranslation();
  const { updateName, preferences } = useUserPreferences();
  const [name, setName] = useState(preferences.name);
  const [showError, setShowError] = useState(false);

  return (
    <motion.div 
      className="max-w-md w-full text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="w-24 h-24 bg-gradient-to-br from-primary to-primary-foreground rounded-full mx-auto flex items-center justify-center"
      >
        <UserRound className="w-12 h-12 text-white" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-primary">{t('onboarding.title')}</h1>
      <p className="text-lg text-gray-600">{t('onboarding.steps.step1.nameLabel')}</p>
      
      <div className="space-y-4">
        <Input
          type="text"
          placeholder={t('onboarding.steps.step1.nameLabel')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setShowError(false);
          }}
          className={`text-center text-xl ${showError ? 'border-red-500 animate-shake' : ''}`}
          autoFocus
        />
        
        {showError && (
          <motion.p 
            className="text-red-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('onboarding.errors.nameRequired')}
          </motion.p>
        )}
        
        <Button
          onClick={() => {
            if (!name.trim()) {
              setShowError(true);
              return;
            }
            updateName(name);
            toast.success(t('onboarding.greetings.hello', { name }), {
              icon: '👋',
            });
            onNext();
          }}
          className="w-full text-lg py-6"
        >
          {t('common.next')} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message={t('onboarding.guidance.welcome')} />
    </motion.div>
  );
};

const LearningStyleStep: React.FC<{onNext: () => void, onBack: () => void}> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { toggleLearningStyle, preferences, addPoints } = useUserPreferences();
  const [selectedStyles, setSelectedStyles] = useState<LearningStyle[]>(preferences.learningStyles);
  
  const handleStyleToggle = (style: LearningStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  
  const handleNext = () => {
    selectedStyles.forEach(style => toggleLearningStyle(style));
    if (selectedStyles.length > 0) {
      addPoints(20);
      toast.success(t('notifications.pointsEarned', { points: 20 }), {
        icon: '🎉',
      });
    }
    onNext();
  };
  
  const learningStyles: {value: LearningStyle, label: string, icon: React.ReactNode, description: string}[] = [
    {
      value: 'visual',
      label: t('settings.learningStyles.visual.label'),
      icon: <PaintBucket className="h-6 w-6" />,
      description: t('settings.learningStyles.visual.description')
    },
    {
      value: 'auditory',
      label: t('settings.learningStyles.auditory.label'),
      icon: <Headphones className="h-6 w-6" />,
      description: t('settings.learningStyles.auditory.description')
    },
    {
      value: 'kinesthetic',
      label: t('settings.learningStyles.kinesthetic.label'),
      icon: <Gamepad2 className="h-6 w-6" />,
      description: t('settings.learningStyles.kinesthetic.description')
    },
    {
      value: 'reading',
      label: t('settings.learningStyles.reading.label'),
      icon: <Book className="h-6 w-6" />,
      description: t('settings.learningStyles.reading.description')
    }
  ];
  
  return (
    <motion.div 
      className="max-w-md w-full text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mx-auto flex items-center justify-center"
      >
        <Brain className="w-12 h-12 text-white" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-primary">{t('onboarding.steps.step2.title')}</h1>
      <p className="text-lg text-gray-600">{t('settings.learningStyleSection')}</p>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        {learningStyles.map((style) => (
          <motion.div 
            key={style.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                selectedStyles.includes(style.value) 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleStyleToggle(style.value)}
            >
              <CardContent className="flex items-center p-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  selectedStyles.includes(style.value) 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100'
                }`}>
                  {style.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{style.label}</h3>
                  <p className="text-sm text-gray-600">{style.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 text-lg py-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> {t('common.previous')}
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex-1 text-lg py-6"
          disabled={selectedStyles.length === 0}
        >
          {t('common.next')} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message={t('onboarding.guidance.learningStyle')} />
    </motion.div>
  );
};

const ThemeSelectionStep: React.FC<{onNext: () => void, onBack: () => void}> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setTheme, preferences, addPoints, addBadge } = useUserPreferences();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(preferences.theme);
  const navigate = useNavigate();
  
  const themes: {value: Theme, label: string, description: string, bgClass: string}[] = [
    {
      value: 'minecraft',
      label: t('settings.themes.minecraft.label'),
      description: t('settings.themes.minecraft.description'),
      bgClass: 'bg-gradient-to-r from-green-600 to-emerald-700'
    },
    {
      value: 'roblox',
      label: t('settings.themes.roblox.label'),
      description: t('settings.themes.roblox.description'),
      bgClass: 'bg-gradient-to-r from-red-500 to-rose-600'
    },
    {
      value: 'fortnite',
      label: t('settings.themes.fortnite.label'),
      description: t('settings.themes.fortnite.description'),
      bgClass: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      value: 'default',
      label: t('settings.themes.default.label'),
      description: t('settings.themes.default.description'),
      bgClass: 'bg-gradient-to-r from-sky-500 to-indigo-600'
    }
  ];
  
  const handleNext = () => {
    setTheme(selectedTheme);
    addPoints(30);
    addBadge('customizer');
    toast.success(t('notifications.badgeEarned', { badge: t('badges.customizer') }), {
      icon: '🏆',
    });
    
    // Move to home
    onNext();
  };
  
  return (
    <motion.div 
      className="max-w-md w-full text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full mx-auto flex items-center justify-center"
      >
        <PaintBucket className="w-12 h-12 text-white" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-primary">{t('onboarding.steps.step3.title')}</h1>
      <p className="text-lg text-gray-600">{t('settings.themeSection')}</p>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        {themes.map((theme) => (
          <motion.div 
            key={theme.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all overflow-hidden ${
                selectedTheme === theme.value 
                  ? 'border-primary shadow-md' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedTheme(theme.value)}
            >
              <div className={`h-20 ${theme.bgClass}`} />
              <CardContent className="flex items-center p-4">
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{theme.label}</h3>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>
                {selectedTheme === theme.value && (
                  <div className="ml-auto">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 text-lg py-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> {t('common.previous')}
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex-1 text-lg py-6"
        >
          {t('common.continue')} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message={t('onboarding.guidance.theme')} />
    </motion.div>
  );
};

const Onboarding: React.FC<OnboardingProps> = ({ step = 0 }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(step);
  const navigate = useNavigate();
  const { completeOnboarding } = useUserPreferences();
  
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const goToNextStep = () => {
    if (currentStep === 2) {
      // Last step, complete onboarding
      completeOnboarding();
      navigate('/home');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Map steps to components
  const steps = [
    <WelcomeStep key="welcome" onNext={goToNextStep} />,
    <LearningStyleStep key="learning-style" onNext={goToNextStep} onBack={goToPreviousStep} />,
    <ThemeSelectionStep key="theme" onNext={goToNextStep} onBack={goToPreviousStep} />
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {steps[currentStep]}
        </AnimatePresence>
      </div>
      
      <div className="py-6 px-6 flex justify-center gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentStep 
                ? 'w-8 bg-primary' 
                : index < currentStep 
                  ? 'w-4 bg-primary/60' 
                  : 'w-4 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
