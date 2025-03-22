import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Sparkles, BarChart, Gamepad2 } from 'lucide-react';
import { Activity } from '@/types/realLifePractice';

interface ActivityPromptProps {
  activity: Activity;
  difficultyLevel?: 'easy' | 'medium' | 'hard';
  theme?: string;
  onCompleteReading?: () => void;
}

const ActivityPrompt: React.FC<ActivityPromptProps> = ({ 
  activity,
  difficultyLevel = 'medium'
}) => {
  // Determine badge color based on difficulty
  const difficultyColorMap = {
    easy: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    medium: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    hard: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200'
    }
  };
  
  // Theme badge colors
  const themeColorMap = {
    minecraft: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    roblox: {
      bg: 'bg-blue-100', 
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    fortnite: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200'
    },
    default: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200'
    }
  };
  
  const difficultyColors = difficultyColorMap[difficultyLevel];
  const theme = activity.theme || 'default';
  const themeColors = themeColorMap[theme as keyof typeof themeColorMap] || themeColorMap.default;
  
  // Format theme name for display
  const formattedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-700" />
            Math Activity
          </h3>
          
          <div className="flex gap-2">
            {theme !== 'default' && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${themeColors.bg} ${themeColors.text} border ${themeColors.border}`}>
                <Gamepad2 className="h-3 w-3" />
                {formattedTheme}
              </div>
            )}
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${difficultyColors.bg} ${difficultyColors.text} border ${difficultyColors.border}`}>
              <BarChart className="h-3 w-3" />
              {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Challenge</h4>
          <p className="text-gray-800">{activity.challenge}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 bg-blue-50 p-3 rounded-md"
        >
          <div className="flex-shrink-0 mt-1">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Target className="h-4 w-4 text-blue-700" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Math Goal</h4>
            <p className="text-sm text-gray-700">{activity.goal}</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 bg-purple-50 p-3 rounded-md"
        >
          <div className="flex-shrink-0 mt-1">
            <div className="bg-purple-100 p-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-700" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-purple-800 mb-1">Variation</h4>
            <p className="text-sm text-gray-700">{activity.variation}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActivityPrompt; 