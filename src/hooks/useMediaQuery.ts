import { useState, useEffect } from 'react';

/**
 * A hook that returns whether a media query matches
 * Used for accessibility features like detecting reduced motion preferences
 * 
 * @param query The media query to match
 * @returns True if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Create a media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQuery.matches);
    
    // Define a listener to update the state
    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add the listener
    mediaQuery.addEventListener('change', updateMatches);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
} 