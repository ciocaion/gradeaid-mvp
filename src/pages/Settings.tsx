import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUserPreferences, LearningStyle, Theme } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Star, Brain, 
  Gamepad2, PaintBucket, Book, 
  Headphones, Award, RotateCcw,
  AlertTriangle, Home, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Guidance from '@/components/Guidance';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    preferences, 
    toggleLearningStyle, 
    setTheme, 
    addPoints,
    addBadge,
    resetPreferences,
    isDevMode
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
      toast.success(t('notifications.settingsUpdated'), {
        icon: '🎉',
      });
    } else {
      toast.info(t('notifications.settingsSaved'));
    }
    
    // Navigate back to the home page
    navigate('/home');
  };

  // Handle reset app
  const handleResetApp = () => {
    resetPreferences();
    toast.success(t('notifications.appReset'), {
      icon: '🔄',
    });
    // Redirect to onboarding
    setTimeout(() => {
      navigate('/onboarding');
    }, 1500);
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
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 relative">
      {/* Themed animated background */}
      <ThemedBackground theme={preferences.theme} />
      
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild className="bg-white/80 hover:bg-white/90">
            <Link to="/home">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">{t('settings.title')}</h1>
          
          <PreferencesButton variant="dark" />
        </div>
        
        <div className="space-y-8">
          {/* Language Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t('settings.languageSection')}</h2>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <LanguageSelector />
              </CardContent>
            </Card>
          </section>

          {/* Learning Style Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t('settings.learningStyleSection')}</h2>
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
              <h2 className="text-xl font-semibold">{t('settings.themeSection')}</h2>
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
                    <div className={`h-16 ${theme.bgClass}`}></div>
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
              <h2 className="text-xl font-semibold">{t('settings.badgesSection')}</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                {preferences.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {preferences.badges.map((badge, index) => (
                      <div key={index} className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        <span className="text-sm">{t(`badges.${badge.toLowerCase()}`)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-2">{t('settings.noBadges')}</p>
                )}
              </CardContent>
            </Card>
          </section>
          
          {/* Stats Section */}
          <section>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('settings.points')}</span>
                  <span className="font-bold text-primary">{preferences.points}</span>
                </div>
                {preferences.streak && preferences.streak > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">{t('settings.streak')}</span>
                    <span className="font-bold text-amber-500">{preferences.streak} {t('settings.days')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          
          {/* Reset App */}
          <section>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center gap-2 mt-4">
                  <RotateCcw className="h-4 w-4" />
                  {t('settings.resetApp')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.resetWarningTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.resetWarningDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetApp}>{t('common.continue')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
          
          {/* Save Button */}
          <Button 
            className="w-full mt-8"
            onClick={handleSaveChanges}
          >
            {t('common.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
