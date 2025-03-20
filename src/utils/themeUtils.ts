
import { Theme } from '@/contexts/UserPreferencesContext';

export const getThemeBackgroundImage = (theme: Theme): string => {
  switch (theme) {
    case 'minecraft':
      return '/lovable-uploads/37c25a3b-dbe7-493b-901d-2425230f5719.png';
    case 'roblox':
      return '/lovable-uploads/8cee8ce2-abb5-4b6f-aff4-6a5ba6e07d4b.png';
    case 'fortnite':
      return '/lovable-uploads/8b725ba7-fdb9-44ca-a050-8b61617aaf8d.png';
    default:
      return '';
  }
};

export const getThemeBackgroundStyle = (theme: Theme): React.CSSProperties => {
  const backgroundImage = getThemeBackgroundImage(theme);
  
  if (backgroundImage) {
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100%',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    };
  }
  
  // Return gradient background for default theme
  return {};
};
