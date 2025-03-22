import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface PreferencesButtonProps {
  variant?: 'light' | 'dark';
}

const PreferencesButton: React.FC<PreferencesButtonProps> = ({ 
  variant = 'light' 
}) => {
  const { preferences } = useUserPreferences();
  
  // Determine styles based on variant
  const bgClass = variant === 'light' 
    ? 'bg-white/20 backdrop-blur-sm' 
    : 'bg-primary/10';
  
  const textClass = variant === 'light' 
    ? 'text-white' 
    : 'text-primary';
  
  const starClass = variant === 'light' 
    ? 'text-yellow-400' 
    : 'text-yellow-500';
  
  const buttonBgClass = variant === 'light' 
    ? 'bg-white/80 hover:bg-white/90' 
    : 'bg-background hover:bg-background/90';
  
  return (
    <motion.div 
      className="flex items-center space-x-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className={`${bgClass} px-3 py-1.5 rounded-full flex items-center`}>
        <Star className={`h-5 w-5 mr-1.5 ${starClass}`} />
        <span className={`font-bold ${textClass}`}>{preferences.points}</span>
      </div>
      
      <Button variant="outline" size="sm" asChild className={buttonBgClass}>
        <Link to="/settings" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>Preferences</span>
        </Link>
      </Button>
    </motion.div>
  );
};

export default PreferencesButton; 