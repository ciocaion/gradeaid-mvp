
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useOnboardingRedirect = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    // If they haven't completed onboarding and aren't on the onboarding page, 
    // redirect to onboarding
    if (!preferences.hasCompletedOnboarding && window.location.pathname !== '/') {
      navigate('/');
    }
    
    // If they have completed onboarding and are on the onboarding page, 
    // redirect to app
    if (preferences.hasCompletedOnboarding && window.location.pathname === '/') {
      navigate('/app');
    }
  }, [preferences.hasCompletedOnboarding, navigate]);
};
