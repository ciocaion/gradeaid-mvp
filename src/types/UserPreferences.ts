export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type Theme = 'minecraft' | 'roblox' | 'fortnite' | 'default';
export type Language = 'en' | 'da';

export interface UserPreferences {
  name: string;
  learningStyles: LearningStyle[];
  theme: Theme;
  language: Language;
  hasCompletedOnboarding: boolean;
  points: number;
  badges: string[];
  // Extended properties
  streak?: number;
  completedActivities?: Array<{id: string; date: string}>;
  lastActivityDate?: string;
  childAge?: number;
} 