import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  BrainCircuit,
  LightbulbIcon,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import AudioText from './AudioText';

export interface LearningStep {
  title: string;
  content: string;
  example?: string;
  visualPrompt?: string;
  checkpointQuestion?: string;
}

interface StructuredLearningProps {
  conceptTitle: string;
  steps: LearningStep[];
  onComplete?: () => void;
  showCheckpoints?: boolean;
  className?: string;
}

/**
 * StructuredLearning component - provides a step-by-step learning experience
 * designed specifically for neurodivergent children with clear structure,
 * visual cues, and accessible interactions
 */
const StructuredLearning: React.FC<StructuredLearningProps> = ({
  conceptTitle,
  steps,
  onComplete,
  showCheckpoints = true,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      if (!completedSteps.includes(currentStepIndex)) {
        setCompletedSteps([...completedSteps, currentStepIndex]);
      }
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Mark the last step as complete if it's not already
      if (!completedSteps.includes(currentStepIndex)) {
        const updatedCompleted = [...completedSteps, currentStepIndex];
        setCompletedSteps(updatedCompleted);
        
        // If all steps are complete, mark the entire learning as complete
        if (updatedCompleted.length === totalSteps) {
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      } else {
        // Already completed the last step
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCheckpointSubmit = (answer: string) => {
    setCheckpointAnswers({
      ...checkpointAnswers,
      [currentStepIndex]: answer
    });
    setShowFeedback(true);
  };

  const handleContinueAfterCheckpoint = () => {
    setShowFeedback(false);
    if (currentStepIndex < totalSteps - 1) {
      if (!completedSteps.includes(currentStepIndex)) {
        setCompletedSteps([...completedSteps, currentStepIndex]);
      }
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Mark the learning as complete
      if (!completedSteps.includes(currentStepIndex)) {
        const updatedCompleted = [...completedSteps, currentStepIndex];
        setCompletedSteps(updatedCompleted);
      }
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          {conceptTitle}
          <AudioText text={conceptTitle} className="ml-1" />
        </h2>
        <div className="text-sm font-medium text-gray-500">
          Step {currentStepIndex + 1} of {totalSteps}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((completedSteps.length) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${index === currentStepIndex ? 'bg-primary text-white' : 
                  completedSteps.includes(index) ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setCurrentStepIndex(index)}
              aria-label={`Go to step ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                {currentStep.title}
                <AudioText text={currentStep.title} className="ml-2" />
              </h3>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  {currentStep.content}
                  <AudioText text={currentStep.content} className="ml-2" />
                </p>
                
                {currentStep.example && (
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                    <div className="flex items-start gap-2">
                      <LightbulbIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800 mb-1">Example:</p>
                        <p className="text-amber-700">{currentStep.example}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep.visualPrompt && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <div className="flex items-start gap-2">
                      <BrainCircuit className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-800 mb-1">Picture This:</p>
                        <p className="text-blue-700">{currentStep.visualPrompt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Checkpoint question section */}
          {showCheckpoints && currentStep.checkpointQuestion && !showFeedback && !isComplete && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Check Your Understanding
                </h3>
                
                <p className="mb-4">{currentStep.checkpointQuestion}</p>
                
                <div className="space-y-2">
                  <textarea
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Type your answer here..."
                    value={checkpointAnswers[currentStepIndex] || ''}
                    onChange={(e) => setCheckpointAnswers({
                      ...checkpointAnswers,
                      [currentStepIndex]: e.target.value
                    })}
                  />
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleCheckpointSubmit(checkpointAnswers[currentStepIndex] || '')}
                    disabled={!checkpointAnswers[currentStepIndex]}
                  >
                    Submit Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback after checkpoint */}
          {showFeedback && (
            <Card className="mb-6 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                  Great Effort!
                </h3>
                
                <p className="mb-4 text-green-700">
                  Thank you for your answer! Thinking about this helps you understand the concept better.
                </p>
                
                <Button onClick={handleContinueAfterCheckpoint}>
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isComplete}
        >
          {isLastStep ? 'Finish' : 'Next'}
          {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Completion message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-green-800 mb-1">Learning Complete!</h3>
          <p className="text-green-700">
            Well done! You've completed this learning module.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StructuredLearning; 