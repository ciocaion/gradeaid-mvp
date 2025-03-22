import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useTranslation } from 'react-i18next';
import { 
  Brain, 
  Home as HomeIcon,
  Settings as SettingsIcon,
  BookOpen,
  Compass,
  Gamepad2,
  Trophy,
  Star,
  ChevronRight,
  Calendar,
  Clock
} from 'lucide-react';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import LearningProgress from '@/components/LearningProgress';
import AudioText from '@/components/AudioText';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  
  useEffect(() => {
    // If user hasn't completed onboarding, redirect to onboarding
    if (!preferences.hasCompletedOnboarding) {
      navigate('/onboarding');
    }
  }, [preferences.hasCompletedOnboarding, navigate]);

  const menuItems = [
    {
      id: 'features',
      title: t('home.menu.features.title'),
      description: t('home.menu.features.description'),
      icon: <BookOpen className="h-6 w-6 text-violet-600" />,
      color: 'bg-violet-100 text-violet-600',
      path: '/features'
    },
    {
      id: 'balloonSandbag',
      title: t('home.menu.balloonSandbag.title'),
      description: t('home.menu.balloonSandbag.description'),
      icon: <Brain className="h-6 w-6 text-emerald-600" />,
      color: 'bg-emerald-100 text-emerald-600',
      path: '/exercises/balloons'
    },
    {
      id: 'funZone',
      title: t('home.menu.funZone.title'),
      description: t('home.menu.funZone.description'),
      icon: <Gamepad2 className="h-6 w-6 text-amber-600" />,
      color: 'bg-amber-100 text-amber-600',
      path: '/funzone'
    },
    {
      id: 'profile',
      title: t('home.menu.profile.title'),
      description: t('home.menu.profile.description'),
      icon: <SettingsIcon className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100 text-blue-600',
      path: '/settings'
    }
  ];

  const todayDate = new Date().toLocaleDateString(preferences.language === 'da' ? 'da-DK' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto p-6">
      <ThemedBackground theme={preferences.theme} className="fixed inset-0 z-[-1]" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <HomeIcon className="h-6 w-6" />
          {t('home.title')}
          <AudioText 
            text={t('home.audioText')}
            className="ml-2"
          />
        </h1>
        
        <PreferencesButton />
      </div>
      
      {/* Welcome Card with Date */}
      <Card className="mb-6 bg-white/95 backdrop-blur-sm border-blue-100">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{t('home.welcomeBack', { name: preferences.name })}</h2>
              <div className="flex items-center text-gray-500 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{todayDate}</span>
                {preferences.streak > 0 && (
                  <div className="ml-4 flex items-center text-amber-600">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span>{t('home.streak', { count: preferences.streak })}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-primary/10 px-3 py-1.5 rounded-full flex items-center">
              <Star className="h-5 w-5 mr-1.5 text-amber-500" />
              <span className="font-bold">{t('home.points', { count: preferences.points })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Start Learning Card - NEW */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/90 to-primary-foreground/90 text-white shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold mb-2">{t('home.learningJourney.title')}</h2>
                <p className="mb-4 opacity-90">
                  {t('home.learningJourney.description')}
                </p>
                <Button 
                  onClick={() => navigate('/learning')}
                  variant="neuro"
                  className="px-6 py-6 text-primary hover:bg-white/90"
                  size="lg"
                >
                  {t('home.learningJourney.button')} <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
              <div className="hidden md:block">
                <Brain className="h-24 w-24 opacity-80" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Learning Progress */}
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
      
      {/* Quick Access Menu */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          {t('home.quickAccess')}
        </h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {menuItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer h-full transition-all bg-white/95 backdrop-blur-sm hover:border-gray-300"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-5 flex items-start">
                  <div className={`rounded-full p-3 mr-4 ${item.color}`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Recent Activity */}
      {preferences.completedActivities && preferences.completedActivities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('home.recentActivity')}
          </h2>
          
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-5">
              <ul className="space-y-3">
                {preferences.completedActivities.slice(-3).reverse().map((activity, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <span>{t(`activities.${activity.id.toLowerCase()}`)}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString(
                        preferences.language === 'da' ? 'da-DK' : 'en-US'
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home; 