import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  Brain, 
  Headphones, 
  Camera, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  ChevronRight,
  Gamepad2,
  ScrollText,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import Guidance from '@/components/Guidance';

const Features = () => {
  const navigate = useNavigate();
  const { preferences, completeOnboarding, addPoints } = useUserPreferences();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  const handleFeatureSelect = (feature: string) => {
    setSelectedFeature(feature);
    
    setTimeout(() => {
      if (feature === 'balloonSandbag') {
        navigate('/app');
      } else if (feature === 'funZone') {
        navigate('/funzone');
      } else if (feature === 'imageToContent') {
        navigate('/image-to-learning');
      } else {
        toast.info('This feature is coming soon!', {
          description: "We're working hard to bring this to you soon.",
          icon: <HelpCircle className="h-4 w-4" />,
        });
        setSelectedFeature(null);
      }
    }, 400);
  };
  
  const handleContinue = () => {
    if (!preferences.hasCompletedOnboarding) {
      completeOnboarding();
      addPoints(50);
      
      toast.success('Onboarding completed! You earned 50 points!', {
        icon: '🎉',
      });
    }
    
    navigate('/onboarding/final');
  };
  
  const themeStyles = {
    minecraft: "bg-[url('/images/minecraft-bg.jpg')] bg-cover bg-center",
    roblox: "bg-[url('/images/roblox-bg.jpg')] bg-cover bg-center",
    fortnite: "bg-[url('/images/fortnite-bg.jpg')] bg-cover bg-center",
    default: "bg-gradient-to-b from-sky-500/30 to-sky-200/30",
  };

  const overlayClass = preferences.theme !== 'default' ? 'bg-black/20' : '';
  const themeClass = themeStyles[preferences.theme] || themeStyles.default;
  
  const features = [
    {
      id: 'balloonSandbag',
      title: 'Balloon & Sandbag Math',
      description: 'Visualize integer addition and subtraction with interactive 3D objects',
      icon: <Brain className="h-8 w-8 text-violet-600" />,
      color: 'bg-violet-100 text-violet-600 border-violet-200'
    },
    {
      id: 'funZone',
      title: 'Fun Zone',
      description: 'Play games and earn rewards while practicing math skills',
      icon: <Gamepad2 className="h-8 w-8 text-emerald-600" />,
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      new: true
    },
    {
      id: 'aiPodcast',
      title: 'AI Learning Podcast',
      description: 'Listen to personalized mini-lessons based on your interests',
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
      id: 'imageToContent',
      title: 'Image to Learning',
      description: 'Take a picture of schoolwork and get interactive learning content',
      icon: <Camera className="h-8 w-8 text-rose-600" />,
      color: 'bg-rose-100 text-rose-600 border-rose-200'
    },
    {
      id: 'realLifeExercise',
      title: 'Real-Life Practice',
      description: 'Complete activities and get AI feedback on your progress',
      icon: <MessageSquare className="h-8 w-8 text-amber-600" />,
      color: 'bg-amber-100 text-amber-600 border-amber-200'
    },
    {
      id: 'flashcards',
      title: 'Smart Flashcards',
      description: 'Interactive flashcards that adapt to how you learn',
      icon: <ScrollText className="h-8 w-8 text-cyan-600" />,
      color: 'bg-cyan-100 text-cyan-600 border-cyan-200'
    }
  ];

  return (
    <div className={`min-h-screen ${themeClass} ${overlayClass} flex flex-col p-4 md:p-8`}>
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
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight">
            Awesome Features
          </h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Choose how you want to learn today! Each feature is designed to help you learn in a way that works best for you.
          </motion.p>
        </motion.div>

        {preferences.hasCompletedOnboarding && (
          <motion.div 
            className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Star className="h-5 w-5 mr-1.5 text-yellow-400" />
            <span className="font-bold text-white">{preferences.points}</span>
          </motion.div>
        )}
      </motion.header>
      
      <motion.div 
        className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (index * 0.1) }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer h-full transition-all backdrop-blur-sm bg-white/90 ${
                selectedFeature === feature.id 
                  ? 'border-primary shadow-lg' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleFeatureSelect(feature.id)}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className={`rounded-full p-3 w-fit mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  {feature.new && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 flex-grow">
                  {feature.description}
                </p>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group text-primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeatureSelect(feature.id);
                    }}
                  >
                    Try it
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center mt-auto"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg">
          <Guidance message="Choose any feature that looks fun to you! You can always come back to try the others later." />
        </div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button onClick={handleContinue} className="px-8 bg-white/90 hover:bg-white/95" size="lg">
          Continue 
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Features;
