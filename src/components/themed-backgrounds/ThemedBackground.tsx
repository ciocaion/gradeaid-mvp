import React from 'react';
import { motion } from 'framer-motion';
import MinecraftBackground from './MinecraftBackground';
import RobloxBackground from './RobloxBackground';
import FortniteBackground from './FortniteBackground';
import DefaultBackground from './DefaultBackground';
import { Theme } from '@/types/UserPreferences';

export interface ThemedBackgroundProps {
  theme: Theme;
  className?: string;
}

const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ theme, className = '' }) => {
  // Render the appropriate background component based on theme
  const renderBackground = () => {
    switch (theme) {
      case 'minecraft':
        return <MinecraftBackground />;
      case 'roblox':
        return <RobloxBackground />;
      case 'fortnite':
        return <FortniteBackground />;
      default:
        return <DefaultBackground />;
    }
  };
  
  return (
    <div className={className}>
      {renderBackground()}
    </div>
  );
};

export default ThemedBackground; 