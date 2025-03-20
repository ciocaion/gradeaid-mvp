
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useOnboardingRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = useUserPreferences();
  
  useEffect(() => {
    // Store the current path in session storage if it's not part of the onboarding flow
    if (!location.pathname.includes('/onboarding') && 
        location.pathname !== '/' && 
        location.pathname !== '/settings' &&
        location.pathname !== '/features') {
      sessionStorage.setItem('lastVisitedPath', location.pathname);
    }
    
    // If they haven't completed onboarding and aren't on an onboarding page, 
    // redirect to onboarding
    if (!preferences.hasCompletedOnboarding && 
        !location.pathname.includes('/onboarding') &&
        location.pathname !== '/' && 
        location.pathname !== '/settings' &&
        location.pathname !== '/features') {
      navigate('/');
    }
    
    // If they have completed onboarding and are on the onboarding page, 
    // redirect to app or the last visited path
    if (preferences.hasCompletedOnboarding && 
        (location.pathname === '/' || 
         location.pathname.includes('/onboarding') ||
         location.pathname === '/features')) {
      const lastPath = sessionStorage.getItem('lastVisitedPath');
      navigate(lastPath || '/app');
    }
  }, [preferences.hasCompletedOnboarding, navigate, location.pathname]);
};
