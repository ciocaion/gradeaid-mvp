import React, { createContext, useContext, useState, useEffect } from 'react';
import { LearningStyle, Theme, Language, UserPreferences } from '@/types/UserPreferences';
import i18n from '@/i18n';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateName: (name: string) => void;
  toggleLearningStyle: (style: LearningStyle) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  completeOnboarding: () => void;
  addPoints: (points: number) => void;
  addBadge: (badge: string) => void;
  updateChildAge: (age: number) => void;
  recordActivityCompletion: (activityId: string) => void;
  resetPreferences: () => void;
  isDevMode: boolean;
}

const defaultPreferences: UserPreferences = {
  name: '',
  learningStyles: [],
  theme: 'default',
  language: 'en',
  hasCompletedOnboarding: false,
  points: 0,
  badges: [],
  streak: 0,
  completedActivities: [],
  lastActivityDate: undefined,
  childAge: 8,
};

// Determine if we're in development mode
const isDevMode = process.env.NODE_ENV === 'development';

// Determine storage type based on URL parameter or default to localStorage
const useSessionStorage = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('useSessionStorage');
  }
  return false;
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Determine which storage to use
    const storageType = useSessionStorage() ? sessionStorage : localStorage;
    
    try {
      const savedPreferences = storageType.getItem('userPreferences');
      const parsedPreferences = savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
      
      // Set the i18n language based on user preference or browser settings
      if (parsedPreferences.language) {
        i18n.changeLanguage(parsedPreferences.language);
      } else if (typeof window !== 'undefined') {
        // If no language preference saved, use browser language (if supported) or default to English
        const browserLang = navigator.language.split('-')[0];
        const language = browserLang === 'da' ? 'da' : 'en';
        parsedPreferences.language = language;
        i18n.changeLanguage(language);
      }
      
      return parsedPreferences;
    } catch (error) {
      console.error('Error parsing preferences:', error);
      return defaultPreferences;
    }
  });

  useEffect(() => {
    // Save to the appropriate storage
    const storageType = useSessionStorage() ? sessionStorage : localStorage;
    storageType.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updateName = (name: string) => {
    setPreferences(prev => ({ ...prev, name }));
  };

  const toggleLearningStyle = (style: LearningStyle) => {
    setPreferences(prev => {
      const styles = prev.learningStyles.includes(style)
        ? prev.learningStyles.filter(s => s !== style)
        : [...prev.learningStyles, style];
      return { ...prev, learningStyles: styles };
    });
  };

  const setTheme = (theme: Theme) => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const setLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    setPreferences(prev => ({ ...prev, language }));
  };

  const completeOnboarding = () => {
    setPreferences(prev => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const addPoints = (points: number) => {
    setPreferences(prev => ({ ...prev, points: prev.points + points }));
  };

  const addBadge = (badge: string) => {
    setPreferences(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge]
    }));
  };
  
  const updateChildAge = (age: number) => {
    setPreferences(prev => ({ ...prev, childAge: age }));
  };
  
  const recordActivityCompletion = (activityId: string) => {
    const today = new Date();
    const todayStr = today.toISOString();
    
    setPreferences(prev => {
      // Add the activity to completed list
      const completedActivities = [...(prev.completedActivities || []), { id: activityId, date: todayStr }];
      
      // Update streak
      let streak = prev.streak || 0;
      const lastActivityDate = prev.lastActivityDate ? new Date(prev.lastActivityDate) : null;
      
      // If last activity was yesterday or today, maintain/increment streak
      if (lastActivityDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastDate = new Date(lastActivityDate);
        
        if (lastDate.toDateString() === yesterday.toDateString() || 
            lastDate.toDateString() === today.toDateString()) {
          // Only increment if today is different from last activity date
          if (lastDate.toDateString() !== today.toDateString()) {
            streak += 1;
          }
        } else {
          // Reset streak if more than a day has passed
          streak = 1;
        }
      } else {
        // First activity ever
        streak = 1;
      }
      
      return { 
        ...prev, 
        completedActivities, 
        streak,
        lastActivityDate: todayStr
      };
    });
  };

  // Reset all preferences to default
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    // Clear from both storage types to be safe
    localStorage.removeItem('userPreferences');
    sessionStorage.removeItem('userPreferences');
    // Reset language to default
    i18n.changeLanguage(defaultPreferences.language);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updateName,
        toggleLearningStyle,
        setTheme,
        setLanguage,
        completeOnboarding,
        addPoints,
        addBadge,
        updateChildAge,
        recordActivityCompletion,
        resetPreferences,
        isDevMode
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export type { LearningStyle, Theme, Language };
