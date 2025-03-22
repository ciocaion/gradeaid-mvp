import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Brain, Globe, Lightbulb, BookOpen, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Language } from '@/types/UserPreferences';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';

const Welcome = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { preferences, setLanguage } = useUserPreferences();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(preferences.language);
  
  // Check if user has already completed onboarding
  useEffect(() => {
    if (preferences.hasCompletedOnboarding) {
      navigate('/home');
    }
  }, [preferences.hasCompletedOnboarding, navigate]);
  
  const handleLanguageChange = (value: string) => {
    const language = value as Language;
    setSelectedLanguage(language);
    setLanguage(language);
    i18n.changeLanguage(language);
  };
  
  const handleContinue = () => {
    navigate('/onboarding');
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Welcome text */}
      <div className="flex-1 relative bg-gradient-to-br from-primary via-primary-foreground to-primary-dark p-6 md:p-8 text-[#9333ea]">
        <ThemedBackground theme="default" className="absolute inset-0 opacity-10 z-0" />
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center max-w-md mx-auto py-10 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="flex justify-center mb-6 md:mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#9333ea]/20 flex items-center justify-center"
              >
                <Brain className="w-12 h-12 md:w-14 md:h-14 text-[#9333ea]" />
              </motion.div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-[#9333ea]">{t('welcome.title')}</h1>
            <h2 className="text-lg md:text-2xl font-medium mb-4 md:mb-6 text-[#9333ea]">{t('welcome.subtitle')}</h2>
            <p className="text-base md:text-lg opacity-90 mb-6 md:mb-8 text-[#9333ea]">{t('welcome.description')}</p>
            
            <div className="mb-6 md:mb-8">
              <div className="bg-[#9333ea]/20 backdrop-blur-sm p-4 rounded-lg mb-4">
                <label className="block text-sm font-medium mb-2 flex items-center justify-center text-[#9333ea]">
                  <Globe className="mr-2 h-4 w-4 text-[#9333ea]" />
                  {t('welcome.chooseLanguage')}
                </label>
                <Select 
                  value={selectedLanguage} 
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="bg-[#9333ea]/10 border-[#9333ea]/30 text-[#9333ea] w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('settings.languages.english')}</SelectItem>
                    <SelectItem value="da">{t('settings.languages.danish')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:gap-4 mt-8 md:mt-12 hidden md:grid">
              {[
                { icon: <Calculator className="h-5 w-5 md:h-6 md:w-6 text-[#9333ea]" />, label: "Math" },
                { icon: <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-[#9333ea]" />, label: "Learning" },
                { icon: <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-[#9333ea]" />, label: "Interactive" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="bg-[#9333ea]/10 backdrop-blur-sm rounded-lg p-2 md:p-3 flex flex-col items-center justify-center"
                >
                  {item.icon}
                  <span className="text-xs md:text-sm mt-1 text-[#9333ea]">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Mobile-only continue button */}
        <div className="md:hidden mt-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              size="lg" 
              onClick={handleContinue}
              className="w-full py-5 text-base bg-white text-[#9333ea] hover:bg-white/90"
            >
              {t('welcome.startButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Starting button (only visible on desktop) */}
      <div className="flex-1 bg-gray-50 p-8 hidden md:flex items-center justify-center">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-xl border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-500 to-[#9333ea] h-40 flex items-center justify-center relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-white/30" />
                  <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/20" />
                  <div className="absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full bg-white/20" />
                  <div className="absolute top-1/2 right-1/3 w-14 h-14 rounded-full bg-white/20" />
                </motion.div>
                <div className="text-white font-bold text-3xl tracking-wider z-10">GradeAid</div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">{t('welcome.subtitle')}</h3>
                <p className="text-gray-600 mb-8">{t('welcome.description')}</p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    size="lg" 
                    onClick={handleContinue}
                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-[#9333ea] hover:from-blue-600 hover:to-[#7e22ce]"
                  >
                    {t('welcome.startButton')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                
                <div className="mt-8 grid grid-cols-1 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">Personalized Learning</h4>
                      <p className="text-sm text-gray-500">Adapts to your learning style</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Calculator className="h-5 w-5 text-[#9333ea]" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">Interactive Exercises</h4>
                      <p className="text-sm text-gray-500">Learn math through fun activities</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome; 