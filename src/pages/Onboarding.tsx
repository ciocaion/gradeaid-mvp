
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Guidance from '@/components/Guidance';

const WelcomeStep: React.FC<{onNext: () => void}> = ({ onNext }) => {
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
      
      <h1 className="text-3xl font-bold text-primary">Welcome to Learning App!</h1>
      <p className="text-lg text-gray-600">Let's get to know each other! What's your name?</p>
      
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Your name"
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
            Please tell us your name so we can continue
          </motion.p>
        )}
        
        <Button
          onClick={() => {
            if (!name.trim()) {
              setShowError(true);
              return;
            }
            updateName(name);
            toast.success(`Nice to meet you, ${name}!`, {
              icon: '👋',
            });
            onNext();
          }}
          className="w-full text-lg py-6"
        >
          Next <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message="This is a safe space where we'll personalize learning just for you. Take your time!" />
    </motion.div>
  );
};

const LearningStyleStep: React.FC<{onNext: () => void, onBack: () => void}> = ({ onNext, onBack }) => {
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
      toast.success("You earned 20 points for sharing your preferences!", {
        icon: '🎉',
      });
    }
    onNext();
  };
  
  const learningStyles: {value: LearningStyle, label: string, icon: React.ReactNode, description: string}[] = [
    {
      value: 'visual',
      label: 'Visual',
      icon: <PaintBucket className="h-6 w-6" />,
      description: 'I like pictures, videos, and seeing things'
    },
    {
      value: 'auditory',
      label: 'Listening',
      icon: <Headphones className="h-6 w-6" />,
      description: 'I like listening to stories and podcasts'
    },
    {
      value: 'kinesthetic',
      label: 'Hands-on',
      icon: <Gamepad2 className="h-6 w-6" />,
      description: 'I like building and doing activities'
    },
    {
      value: 'reading',
      label: 'Reading',
      icon: <Book className="h-6 w-6" />,
      description: 'I like reading and writing things'
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
      
      <h1 className="text-3xl font-bold text-primary">How do you like to learn?</h1>
      <p className="text-lg text-gray-600">Choose all the ways you enjoy learning the most</p>
      
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
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex-1 text-lg py-6"
          disabled={selectedStyles.length === 0}
        >
          Next <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message="There's no wrong answer here! We'll use your choices to make learning work best for you." />
    </motion.div>
  );
};

const ThemeSelectionStep: React.FC<{onNext: () => void, onBack: () => void}> = ({ onNext, onBack }) => {
  const { setTheme, preferences, addPoints, addBadge } = useUserPreferences();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(preferences.theme);
  
  const themes: {value: Theme, label: string, description: string, bgClass: string}[] = [
    {
      value: 'minecraft',
      label: 'Minecraft',
      description: 'Blocks, mining, and crafting adventures',
      bgClass: 'bg-gradient-to-r from-green-600 to-emerald-700'
    },
    {
      value: 'roblox',
      label: 'Roblox',
      description: 'Creative building and fun games',
      bgClass: 'bg-gradient-to-r from-red-500 to-rose-600'
    },
    {
      value: 'fortnite',
      label: 'Fortnite',
      description: 'Battle royale and adventure',
      bgClass: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      value: 'default',
      label: 'Classic',
      description: 'Clean and simple design',
      bgClass: 'bg-gradient-to-r from-sky-500 to-indigo-600'
    }
  ];
  
  const handleNext = () => {
    setTheme(selectedTheme);
    addPoints(30);
    addBadge('Theme Explorer');
    toast.success("You earned 30 points and a badge!", {
      icon: '🏆',
      description: "Theme Explorer badge unlocked!"
    });
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
        className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto flex items-center justify-center"
      >
        <Gamepad2 className="w-12 h-12 text-white" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-primary">Choose Your Theme</h1>
      <p className="text-lg text-gray-600">Pick a theme for your learning adventure</p>
      
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
                  ? 'border-primary shadow-lg' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedTheme(theme.value)}
            >
              <div className={`h-16 ${theme.bgClass}`}>
                <div className="h-full w-full flex items-center justify-center">
                  {selectedTheme === theme.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white rounded-full p-1"
                    >
                      <Star className="h-6 w-6 text-yellow-500" />
                    </motion.div>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{theme.label}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>
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
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex-1 text-lg py-6"
        >
          Next <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message="Your theme will make your learning space look cool! You can always change it later." />
    </motion.div>
  );
};

const FeaturesStep: React.FC<{onNext: () => void, onBack: () => void}> = ({ onNext, onBack }) => {
  const { preferences, addPoints } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("math");
  
  const handleNext = () => {
    addPoints(50);
    toast.success(`Amazing, ${preferences.name}! You earned 50 points!`, {
      icon: '🎉',
    });
    onNext();
  };
  
  const features = [
    {
      id: "math",
      title: "Math Visualizer",
      icon: <PaintBucket className="h-5 w-5" />,
      description: "See math come to life with our balloon and sandbag visualizer! Add and subtract with fun animations.",
      gifUrl: "/placeholder.svg"
    },
    {
      id: "listen",
      title: "Learning Podcasts",
      icon: <Headphones className="h-5 w-5" />,
      description: "Listen to fun stories about what you're learning, created just for you!",
      gifUrl: "/placeholder.svg"
    },
    {
      id: "scan",
      title: "Homework Helper",
      icon: <Camera className="h-5 w-5" />,
      description: "Take a picture of your homework and get help right away.",
      gifUrl: "/placeholder.svg"
    },
    {
      id: "practice",
      title: "Fun Practice",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "Practice what you've learned with games and get helpful feedback.",
      gifUrl: "/placeholder.svg"
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
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center"
      >
        <Award className="w-12 h-12 text-white" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-primary">Awesome Features</h1>
      <p className="text-lg text-gray-600">Check out all the cool things you can do!</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          {features.map(feature => (
            <TabsTrigger 
              key={feature.id} 
              value={feature.id}
              className="flex-col py-2 gap-1"
            >
              {feature.icon}
              <span className="text-xs">{feature.title.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {features.map(feature => (
          <TabsContent key={feature.id} value={feature.id} className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <img 
                    src={feature.gifUrl} 
                    alt={feature.title} 
                    className="max-h-full rounded-md"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex gap-4 mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 text-lg py-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex-1 text-lg py-6"
        >
          Next <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <Guidance message="These are just some of the features you'll be able to use. We'll be adding more based on what you like!" />
    </motion.div>
  );
};

const FinalStep: React.FC<{onComplete: () => void, onBack: () => void}> = ({ onComplete, onBack }) => {
  const { preferences, completeOnboarding } = useUserPreferences();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      completeOnboarding();
      onComplete();
    }, 1500);
  };
  
  return (
    <motion.div 
      className="max-w-md w-full text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
          onClick={onBack}
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
  );
};

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  useEffect(() => {
    if (preferences.hasCompletedOnboarding) {
      navigate('/app');
    }
  }, [preferences.hasCompletedOnboarding, navigate]);
  
  const steps = [
    <WelcomeStep onNext={() => setCurrentStep(1)} key="welcome" />,
    <LearningStyleStep onNext={() => setCurrentStep(2)} onBack={goToPreviousStep} key="learning" />,
    <ThemeSelectionStep onNext={() => setCurrentStep(3)} onBack={goToPreviousStep} key="theme" />,
    <FeaturesStep onNext={() => setCurrentStep(4)} onBack={goToPreviousStep} key="features" />,
    <FinalStep onComplete={() => navigate('/app')} onBack={goToPreviousStep} key="final" />
  ];
  
  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background/90 to-background relative overflow-hidden`}
    >
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        {preferences.theme === 'minecraft' && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-green-600 rounded-sm"
                initial={{ 
                  width: Math.random() * 50 + 20,
                  height: Math.random() * 50 + 20,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0.3 + Math.random() * 0.4
                }}
                animate={{
                  y: [null, Math.random() * 100 - 50],
                  rotate: [0, Math.random() * 180 - 90]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: Math.random() * 10
                }}
              />
            ))}
          </>
        )}
        
        {preferences.theme === 'roblox' && (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-red-500 rounded-full"
                initial={{ 
                  width: Math.random() * 60 + 20,
                  height: Math.random() * 60 + 20,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0.3 + Math.random() * 0.4
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  x: [null, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: Math.random() * 10
                }}
              />
            ))}
          </>
        )}
        
        {preferences.theme === 'fortnite' && (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-blue-500"
                style={{
                  clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
                }}
                initial={{ 
                  width: Math.random() * 70 + 30,
                  height: Math.random() * 70 + 30,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0.3 + Math.random() * 0.4
                }}
                animate={{
                  rotate: [0, 360],
                  y: [null, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear',
                  delay: Math.random() * 10
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <div className="fixed top-6 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full ${
                index === currentStep 
                  ? 'bg-primary w-8' 
                  : index < currentStep 
                    ? 'bg-primary/70 w-6' 
                    : 'bg-gray-300 w-6'
              }`}
              initial={false}
              animate={{
                width: index === currentStep ? 32 : 24,
                opacity: index === currentStep ? 1 : index < currentStep ? 0.7 : 0.4
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
      
      <AnimatePresence mode="wait">
        <div className="flex items-center justify-center">
          {steps[currentStep]}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
