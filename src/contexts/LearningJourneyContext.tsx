import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface LearningJourneyContextType {
  isInLearningJourney: boolean;
  learningTopic: string;
  currentPathIndex: number;
  learningPath: string[];
  setLearningJourney: (topic: string, path: string[]) => void;
  completeCurrentActivity: () => void;
  clearLearningJourney: () => void;
}

const LearningJourneyContext = createContext<LearningJourneyContextType | undefined>(undefined);

export const LearningJourneyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isInLearningJourney, setIsInLearningJourney] = useState<boolean>(false);
  const [learningTopic, setLearningTopic] = useState<string>('');
  const [currentPathIndex, setCurrentPathIndex] = useState<number>(0);
  const [learningPath, setLearningPath] = useState<string[]>([]);
  
  // Load learning journey from sessionStorage on initial render
  useEffect(() => {
    const storedTopic = sessionStorage.getItem('currentLearningTopic');
    const storedPathIndex = sessionStorage.getItem('currentLearningPathIndex');
    const storedPath = sessionStorage.getItem('currentLearningPath');
    
    if (storedTopic && storedPathIndex && storedPath) {
      setLearningTopic(storedTopic);
      setCurrentPathIndex(parseInt(storedPathIndex, 10));
      setLearningPath(JSON.parse(storedPath));
      setIsInLearningJourney(true);
    }
  }, []);
  
  // Set up a new learning journey
  const setLearningJourney = (topic: string, path: string[]) => {
    setLearningTopic(topic);
    setLearningPath(path);
    setCurrentPathIndex(0);
    setIsInLearningJourney(true);
    
    // Store in sessionStorage
    sessionStorage.setItem('currentLearningTopic', topic);
    sessionStorage.setItem('currentLearningPath', JSON.stringify(path));
    sessionStorage.setItem('currentLearningPathIndex', '0');
  };
  
  // Complete the current activity and navigate to the next one
  const completeCurrentActivity = () => {
    // Update the current path index in sessionStorage
    const nextIndex = currentPathIndex + 1;
    
    if (nextIndex < learningPath.length) {
      // Update state and sessionStorage
      setCurrentPathIndex(nextIndex);
      sessionStorage.setItem('currentLearningPathIndex', nextIndex.toString());
      
      // Navigate to the next activity
      navigate(learningPath[nextIndex]);
    } else {
      // We've completed the learning journey
      clearLearningJourney();
      
      // Navigate back to home
      navigate('/home');
    }
  };
  
  // Clear the learning journey
  const clearLearningJourney = () => {
    setIsInLearningJourney(false);
    setLearningTopic('');
    setCurrentPathIndex(0);
    setLearningPath([]);
    
    // Remove from sessionStorage
    sessionStorage.removeItem('currentLearningTopic');
    sessionStorage.removeItem('currentLearningPath');
    sessionStorage.removeItem('currentLearningPathIndex');
  };
  
  return (
    <LearningJourneyContext.Provider
      value={{
        isInLearningJourney,
        learningTopic,
        currentPathIndex,
        learningPath,
        setLearningJourney,
        completeCurrentActivity,
        clearLearningJourney
      }}
    >
      {children}
    </LearningJourneyContext.Provider>
  );
};

export const useLearningJourney = (): LearningJourneyContextType => {
  const context = useContext(LearningJourneyContext);
  if (context === undefined) {
    throw new Error('useLearningJourney must be used within a LearningJourneyProvider');
  }
  return context;
}; 