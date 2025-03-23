import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Clock, 
  Calendar,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';

interface LearningProgressProps {
  totalPoints: number;
  badges: string[];
  streak: number;
  completedActivities: number;
  lastActivity?: Date;
  className?: string;
  showDetailedStats?: boolean;
}

/**
 * LearningProgress component - provides a visual representation of learning progress
 * designed to be motivating and accessible for neurodivergent children
 */
const LearningProgress: React.FC<LearningProgressProps> = ({
  totalPoints,
  badges,
  streak,
  completedActivities,
  lastActivity,
  className = '',
  showDetailedStats = false
}) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [animate, setAnimate] = useState(false);

  // Determine point milestone levels
  const milestones = [100, 250, 500, 1000, 2500, 5000];
  const currentMilestone = milestones.findIndex(m => totalPoints < m);
  const nextMilestone = currentMilestone >= 0 ? milestones[currentMilestone] : milestones[milestones.length - 1];
  const previousMilestone = currentMilestone > 0 ? milestones[currentMilestone - 1] : 0;
  
  // Calculate progress percentage toward next milestone
  const progressPercentage = Math.min(
    ((totalPoints - previousMilestone) / (nextMilestone - previousMilestone)) * 100,
    100
  );

  // Days since last activity
  const daysSinceLastActivity = lastActivity 
    ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Animate on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {t('learningProgress.title')}
            </h2>
            
            <div className="text-sm font-medium flex items-center gap-1 text-primary">
              <Star className="h-4 w-4" />
              {totalPoints} {t('learningProgress.points')}
            </div>
          </div>
          
          {/* Progress to next milestone */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{previousMilestone} {t('learningProgress.points')}</span>
              <span>{nextMilestone} {t('learningProgress.points')}</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: animate ? `${progressPercentage}%` : 0 }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 1.5, 
                  ease: "easeOut" 
                }}
              />
            </div>
            <div className="text-xs text-center mt-1 text-gray-500">
              {Math.round(progressPercentage)}% {t('learningProgress.toNextMilestone')}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">{t('learningProgress.streak')}</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{streak} {t('learningProgress.days')}</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{t('learningProgress.activities')}</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{completedActivities}</p>
            </div>
          </div>
          
          {/* Badges */}
          {badges.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('learningProgress.earnedBadges')}</h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-1.5 bg-green-50 py-1 px-2.5 rounded-full border border-green-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: prefersReducedMotion ? 0 : 0.1 * index,
                      duration: 0.3
                    }}
                  >
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-green-800">{t(`badges.${badge.toLowerCase()}`)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Detailed Stats */}
          {showDetailedStats && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                {t('learningProgress.detailedStatistics')}
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {daysSinceLastActivity === 0 
                      ? t('learningProgress.lastActivity.today') 
                      : daysSinceLastActivity === 1 
                      ? t('learningProgress.lastActivity.yesterday')
                      : t('learningProgress.lastActivity.daysAgo', { count: daysSinceLastActivity })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {t('learningProgress.avgTime', { count: Math.round(completedActivities > 0 ? (completedActivities * 5.3) / completedActivities : 0) })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {t('learningProgress.pointsPerActivity', { count: completedActivities > 0 ? Math.round(totalPoints / completedActivities) : 0 })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {t('learningProgress.badges', { count: badges.length })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningProgress; 