import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import AudioText from './AudioText';
import { useTranslation } from 'react-i18next';

export interface ExerciseIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  learningGoal: string;
  emoji?: string;
  theme?: string;
}

const ExerciseIntroModal: React.FC<ExerciseIntroModalProps> = ({
  isOpen,
  onClose,
  activityName,
  learningGoal,
  emoji = "🧠",
  theme
}) => {
  const { preferences } = useUserPreferences();
  const { t } = useTranslation();
  const activeTheme = theme || preferences.theme || 'default';

  // Theme-specific styling
  const getThemeStyles = () => {
    switch (activeTheme) {
      case 'minecraft':
        return {
          border: 'border-green-800 border-4 border-dashed',
          bg: 'bg-green-100',
          button: 'bg-green-700 hover:bg-green-800 text-white',
          text: 'text-green-900'
        };
      case 'roblox':
        return {
          border: 'border-red-500 border-4',
          bg: 'bg-red-50',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          text: 'text-red-900'
        };
      case 'fortnite':
        return {
          border: 'border-blue-600 border-4',
          bg: 'bg-blue-50',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          text: 'text-blue-900'
        };
      case 'princess':
        return {
          border: 'border-pink-400 border-4',
          bg: 'bg-pink-50',
          button: 'bg-pink-500 hover:bg-pink-600 text-white',
          text: 'text-pink-900'
        };
      case 'pirate':
        return {
          border: 'border-amber-700 border-4',
          bg: 'bg-amber-50',
          button: 'bg-amber-700 hover:bg-amber-800 text-white',
          text: 'text-amber-900'
        };
      case 'space':
        return {
          border: 'border-purple-600 border-4',
          bg: 'bg-indigo-50',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
          text: 'text-purple-900'
        };
      default:
        return {
          border: 'border-primary border-2',
          bg: 'bg-white',
          button: 'bg-primary hover:bg-primary/90 text-white',
          text: 'text-primary'
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative max-w-md w-full ${themeStyles.bg} ${themeStyles.border} rounded-xl shadow-xl overflow-hidden`}
          >
            <div className="p-6">
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t('common.close')}</span>
                </Button>
              </div>

              <div className="flex flex-col items-center text-center pt-2">
                <div className="text-4xl mb-4">{emoji}</div>
                <h2 className={`text-xl font-bold mb-2 ${themeStyles.text}`}>
                  {activityName}
                  <AudioText text={activityName} className="ml-2" />
                </h2>
                <p className="text-gray-700 mb-6 text-center leading-relaxed">
                  {learningGoal}
                </p>
                <Button 
                  onClick={onClose} 
                  className={`${themeStyles.button} px-8 py-6 font-medium text-lg rounded-lg shadow-md`}
                >
                  {t('exerciseIntro.startButton')} 🚀
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export function useExerciseIntroModal(activityName: string, learningGoal: string, emoji?: string) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Open modal on initial render
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // Create a toggle function that can be used with the help icon
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  // Create the help icon component
  const HelpIcon = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleModal}
      className="rounded-full w-8 h-8 absolute top-4 right-4 z-30 bg-white/80 hover:bg-white/90 shadow-sm"
    >
      <HelpCircle className="h-5 w-5" />
      <span className="sr-only">Help</span>
    </Button>
  );

  // Create the modal component with the necessary props
  const IntroModal = (props: Omit<ExerciseIntroModalProps, 'isOpen' | 'onClose' | 'activityName' | 'learningGoal' | 'emoji'>) => (
    <ExerciseIntroModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      activityName={activityName}
      learningGoal={learningGoal}
      emoji={emoji}
      {...props}
    />
  );

  return { isModalOpen, toggleModal, HelpIcon, IntroModal };
}

export default ExerciseIntroModal; 