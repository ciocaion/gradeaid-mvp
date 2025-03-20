
import React, { createContext, useContext, useState, useEffect } from 'react';

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type Theme = 'minecraft' | 'roblox' | 'fortnite' | 'default';

interface UserPreferences {
  name: string;
  learningStyles: LearningStyle[];
  theme: Theme;
  hasCompletedOnboarding: boolean;
  points: number;
  badges: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateName: (name: string) => void;
  toggleLearningStyle: (style: LearningStyle) => void;
  setTheme: (theme: Theme) => void;
  completeOnboarding: () => void;
  addPoints: (points: number) => void;
  addBadge: (badge: string) => void;
}

const defaultPreferences: UserPreferences = {
  name: '',
  learningStyles: [],
  theme: 'default',
  hasCompletedOnboarding: false,
  points: 0,
  badges: [],
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
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

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updateName,
        toggleLearningStyle,
        setTheme,
        completeOnboarding,
        addPoints,
        addBadge,
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
