import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActivityProgressProps {
  completedCount: number;
  streak: number;
}

const ActivityProgress: React.FC<ActivityProgressProps> = ({ 
  completedCount, 
  streak 
}) => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        {t('activityProgress.title')}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <Star className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('activityProgress.activitiesCompleted')}</p>
            <p className="text-xl font-bold text-purple-700">{completedCount}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('activityProgress.currentStreak')}</p>
            <p className="text-xl font-bold text-indigo-700">{streak} {t('activityProgress.days')}</p>
          </div>
        </div>
      </div>
      
      {streak >= 3 && (
        <motion.div 
          className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-amber-800 font-medium">
            🔥 {t('activityProgress.streakMessage', { streak: streak })}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActivityProgress; 