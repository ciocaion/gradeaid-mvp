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
  ArrowRight,
  Youtube,
  Lightbulb,
  LineChart,
  BookOpen,
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import Guidance from '@/components/Guidance';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import LearningProgress from '@/components/LearningProgress';
import AudioText from '@/components/AudioText';
import { Badge } from '@/components/ui/badge';

const Features = () => {
  const navigate = useNavigate();
  const { preferences, completeOnboarding, addPoints } = useUserPreferences();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  const handleFeatureSelect = (feature: string) => {
    setSelectedFeature(feature);
    
    setTimeout(() => {
      if (feature === 'balloonSandbag') {
        navigate('/exercises/balloons');
      } else if (feature === 'funZone') {
        navigate('/funzone');
      } else if (feature === 'imageToContent') {
        navigate('/image-to-learning');
      } else if (feature === 'realLifeExercise') {
        navigate('/real-life-practice');
      } else if (feature === 'videoLearning') {
        navigate('/video-learning');
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
      id: 'structuredLearning',
      title: 'Structured Learning',
      description: 'Learn step-by-step with visual cues, clear tasks, and feedback designed for different learning styles',
      icon: <Lightbulb className="h-8 w-8 text-amber-600" />,
      color: 'bg-amber-100 text-amber-600 border-amber-200',
      new: true
    },
    {
      id: 'funZone',
      title: 'Fun Zone',
      description: 'Play games and earn rewards while practicing math skills',
      icon: <Gamepad2 className="h-8 w-8 text-emerald-600" />,
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200'
    },
    {
      id: 'videoLearning',
      title: 'Video Learning',
      description: 'Watch educational videos and YouTube Shorts based on what you want to learn',
      icon: <Youtube className="h-8 w-8 text-red-600" />,
      color: 'bg-red-100 text-red-600 border-red-200'
    },
    {
      id: 'learningPath',
      title: 'Learning Path',
      description: 'Follow a personalized learning journey with clear goals and visual progress tracking',
      icon: <LineChart className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      new: true
    },
    {
      id: 'imageToContent',
      title: 'Image to Learning',
      description: 'Take a picture of schoolwork and get interactive learning content with step-by-step explanations',
      icon: <Camera className="h-8 w-8 text-rose-600" />,
      color: 'bg-rose-100 text-rose-600 border-rose-200',
      enhanced: true
    },
    {
      id: 'realLifeExercise',
      title: 'Real-Life Practice',
      description: 'Complete real-world activities with structured guidance and supportive feedback',
      icon: <MessageSquare className="h-8 w-8 text-amber-600" />,
      color: 'bg-amber-100 text-amber-600 border-amber-200',
      enhanced: true
    },
    {
      id: 'aiPodcast',
      title: 'AI Learning Podcast',
      description: 'Listen to personalized mini-lessons based on your interests with audio support for reading difficulties',
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
      id: 'flashcards',
      title: 'Smart Flashcards',
      description: 'Interactive flashcards that adapt to how you learn with visual and audio support',
      icon: <ScrollText className="h-8 w-8 text-cyan-600" />,
      color: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      enhanced: true
    }
  ];

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto p-6">
      <ThemedBackground theme={preferences.theme} className="fixed inset-0 z-[-1]" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Learning Features
          <AudioText 
            text="Learning Features. Choose how you want to learn today."
            className="ml-2"
          />
        </h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/80 hover:bg-white/90 shadow-sm" 
            onClick={() => navigate('/home')}
          >
            <Home className="h-4 w-4 mr-1.5" /> Home
          </Button>
          
          {preferences.hasCompletedOnboarding && (
            <PreferencesButton />
          )}
        </div>
      </div>
      
      {/* Personalized Learning Journey Card - NEW */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold mb-2">Try Our Personalized Learning Journey!</h2>
                <p className="mb-4 opacity-90">
                  Get a customized learning path based on your learning style preferences. Tell us what you want to learn!
                </p>
                <Button 
                  onClick={() => navigate('/learning')}
                  variant="neuro"
                  className="px-6 py-6 text-primary hover:bg-white/90"
                  size="lg"
                >
                  Start Personalized Learning <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
              <div className="hidden md:block">
                <Lightbulb className="h-24 w-24 opacity-80" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Progress Card */}
      <div className="mb-8">
        <LearningProgress 
          totalPoints={preferences.points}
          badges={preferences.badges}
          streak={preferences.streak || 0}
          completedActivities={preferences.completedActivities?.length || 0}
          lastActivity={preferences.lastActivityDate ? new Date(preferences.lastActivityDate) : undefined}
          showDetailedStats={true}
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Features for All Learning Styles
          <AudioText 
            text="Features for all learning styles. Choose the one that works best for you."
            className="ml-2"
          />
        </h2>
        <p className="text-gray-600">
          Our learning tools are designed to support different ways of learning, 
          with special focus on neurodivergent friendly approaches.
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.05) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer h-full transition-all bg-white/95 backdrop-blur-sm ${
                selectedFeature === feature.id 
                  ? 'border-primary shadow-lg' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleFeatureSelect(feature.id)}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className={`rounded-full p-3 w-fit ${feature.color}`}>
                    {feature.icon}
                  </div>
                  
                  <div className="flex gap-1.5">
                    {feature.new && (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        NEW
                      </Badge>
                    )}
                    {feature.enhanced && (
                      <Badge variant="outline" className="border-blue-500 text-blue-600">
                        ENHANCED
                      </Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                  <AudioText text={feature.title} className="ml-2" />
                </h3>
                
                <p className="text-gray-600 flex-grow">
                  {feature.description}
                </p>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="group shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90" 
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
      
      {!preferences.hasCompletedOnboarding && (
        <motion.div 
          className="mt-auto flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={handleContinue} 
            className="px-8 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90" 
            size="lg"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Features;
