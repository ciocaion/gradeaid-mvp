
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, PaintBucket, Headphones, Camera, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Guidance from '@/components/Guidance';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Features: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, addPoints } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("math");
  
  const handleBack = () => {
    navigate('/onboarding/theme');
  };
  
  const handleNext = () => {
    addPoints(50);
    toast.success(`Amazing, ${preferences.name}! You earned 50 points!`, {
      icon: '🎉',
    });
    navigate('/onboarding/final');
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
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background/90 to-background relative overflow-hidden`}
    >
      <div className="fixed top-6 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full ${
                index === 3 
                  ? 'bg-primary w-8' 
                  : index < 3 
                    ? 'bg-primary/70 w-6' 
                    : 'bg-gray-300 w-6'
              }`}
              initial={false}
              animate={{
                width: index === 3 ? 32 : 24,
                opacity: index === 3 ? 1 : index < 3 ? 0.7 : 0.4
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
          <span className="font-bold">{preferences.points}</span>
        </motion.div>
      )}
      
      <motion.div 
        className="max-w-md w-full text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
                  
                  {feature.id === "math" && (
                    <Button 
                      onClick={() => navigate('/app')} 
                      className="mt-4 w-full"
                    >
                      Try Math Visualizer
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 text-lg py-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex-1 text-lg py-6"
          >
            Next
          </Button>
        </div>
        
        <Guidance message="These are just some of the features you'll be able to use. We'll be adding more based on what you like!" />
      </motion.div>
    </div>
  );
};

export default Features;
