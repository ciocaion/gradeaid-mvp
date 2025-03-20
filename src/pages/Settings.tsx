
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUserPreferences, LearningStyle, Theme } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Star, Brain, 
  Gamepad2, PaintBucket, Book, 
  Headphones, Award
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import Guidance from '@/components/Guidance';
import { getThemeBackgroundStyle } from '@/utils/themeUtils';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    preferences, 
    toggleLearningStyle, 
    setTheme, 
    addPoints,
    addBadge 
  } = useUserPreferences();
  
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(preferences.theme);
  const [selectedStyles, setSelectedStyles] = React.useState<LearningStyle[]>(preferences.learningStyles);
  
  // Handle learning style changes
  const handleStyleToggle = (style: LearningStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // Clear existing learning styles and set the new ones
    preferences.learningStyles.forEach(style => toggleLearningStyle(style));
    selectedStyles.forEach(style => toggleLearningStyle(style));
    
    // Set the theme
    setTheme(selectedTheme);
    
    // Award points for customization
    if (selectedTheme !== preferences.theme || 
        JSON.stringify(selectedStyles) !== JSON.stringify(preferences.learningStyles)) {
      addPoints(10);
      addBadge('Customizer');
      toast.success("Settings updated! You earned 10 points!", {
        icon: '🎉',
      });
    } else {
      toast.info("No changes were made to your settings.");
    }
    
    // Navigate back to the app
    navigate('/app');
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
  
  const themes: {value: Theme, label: string, description: string, bgClass: string, imagePath: string}[] = [
    {
      value: 'minecraft',
      label: 'Minecraft',
      description: 'Blocks, mining, and crafting adventures',
      bgClass: 'bg-gradient-to-r from-green-600 to-emerald-700',
      imagePath: '/lovable-uploads/37c25a3b-dbe7-493b-901d-2425230f5719.png'
    },
    {
      value: 'roblox',
      label: 'Roblox',
      description: 'Creative building and fun games',
      bgClass: 'bg-gradient-to-r from-red-500 to-rose-600',
      imagePath: '/lovable-uploads/8cee8ce2-abb5-4b6f-aff4-6a5ba6e07d4b.png'
    },
    {
      value: 'fortnite',
      label: 'Fortnite',
      description: 'Battle royale and adventure',
      bgClass: 'bg-gradient-to-r from-blue-500 to-purple-600',
      imagePath: '/lovable-uploads/8b725ba7-fdb9-44ca-a050-8b61617aaf8d.png'
    },
    {
      value: 'default',
      label: 'Classic',
      description: 'Clean and simple design',
      bgClass: 'bg-gradient-to-r from-sky-500 to-indigo-600',
      imagePath: ''
    }
  ];
  
  const themeBackground = preferences.theme !== 'default' 
    ? getThemeBackgroundStyle(preferences.theme)
    : {};
    
  return (
    <div 
      className={`min-h-screen ${
        preferences.theme === 'default' ? 'bg-gradient-to-b from-background/90 to-background' : ''
      } flex flex-col items-center p-4 md:p-8`}
      style={themeBackground}
    >
      <div className="w-full max-w-md glass bg-white/70 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Your Settings</h1>
          <div className="bg-primary/10 px-3 py-1.5 rounded-full flex items-center ml-auto">
            <Star className="h-5 w-5 mr-1.5 text-primary" />
            <span className="font-bold">{preferences.points}</span>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Learning Style Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Learning Style</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {learningStyles.map((style) => (
                <motion.div 
                  key={style.value}
                  whileHover={{ scale: 1.02 }}
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        selectedStyles.includes(style.value) 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100'
                      }`}>
                        {style.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{style.label}</h3>
                        <p className="text-sm text-gray-600">{style.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Theme Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Theme</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <motion.div 
                  key={theme.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all overflow-hidden ${
                      selectedTheme === theme.value 
                        ? 'border-primary shadow-lg' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTheme(theme.value)}
                  >
                    {theme.imagePath ? (
                      <div 
                        className="h-20 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${theme.imagePath})` }}
                      >
                        {selectedTheme === theme.value && (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`h-16 ${theme.bgClass}`}>
                        {selectedTheme === theme.value && (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-3 text-center">
                      <h3 className="font-semibold">{theme.label}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Badges Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Badges</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                {preferences.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {preferences.badges.map((badge, index) => (
                      <div 
                        key={index} 
                        className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-2">
                    Complete activities to earn badges!
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
          
          <Button 
            onClick={handleSaveChanges} 
            className="w-full py-6 text-lg"
          >
            Save Changes
          </Button>
          
          <Guidance message="You can update your preferences anytime. Your changes will be saved when you click 'Save Changes'." />
        </div>
      </div>
    </div>
  );
};

export default Settings;
