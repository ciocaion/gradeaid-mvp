import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioText from './AudioText';

interface EnhancedFeedbackProps {
  mainFeedback: string;
  learningTip?: string;
  nextStep?: string;
  supportLevel?: 'low' | 'medium' | 'high';
  onNextStepClick?: () => void;
  className?: string;
}

/**
 * A component for displaying structured feedback to neurodivergent children
 * Using a consistent format of main feedback, learning tip, and suggested next step
 */
const EnhancedFeedback: React.FC<EnhancedFeedbackProps> = ({
  mainFeedback,
  learningTip,
  nextStep,
  supportLevel = 'medium',
  onNextStepClick,
  className = '',
}) => {
  // Determine supportive emoji based on support level
  const getSupportEmoji = () => {
    switch (supportLevel) {
      case 'low':
        return '👏';
      case 'high':
        return '🌟';
      case 'medium':
      default:
        return '😊';
    }
  };
  
  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Feedback */}
      <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
        <div className="flex-shrink-0 mt-1">
          <div className="bg-green-100 p-2 rounded-full">
            <Bot className="h-5 w-5 text-green-700" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-green-800">Feedback</h3>
            <span aria-hidden="true">{getSupportEmoji()}</span>
            <AudioText 
              text={mainFeedback} 
              className="ml-auto"
              label=""
              rate={0.9}
            />
          </div>
          
          <div className="text-gray-700">
            {mainFeedback.split('\n').map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      </div>
      
      {/* Learning Tip */}
      {learningTip && (
        <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex-shrink-0 mt-1">
            <div className="bg-amber-100 p-2 rounded-full">
              <Lightbulb className="h-5 w-5 text-amber-700" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-md font-medium text-amber-800">Learning Tip</h3>
              <AudioText 
                text={learningTip} 
                className="ml-auto"
                label=""
                rate={0.9}
              />
            </div>
            <p className="text-sm text-gray-700">
              {learningTip}
            </p>
          </div>
        </div>
      )}
      
      {/* Next Step */}
      {nextStep && (
        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex-shrink-0 mt-1">
            <div className="bg-blue-100 p-2 rounded-full">
              <ArrowRight className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-md font-medium text-blue-800">Try This Next</h3>
              <AudioText 
                text={nextStep} 
                className="ml-auto"
                label=""
                rate={0.9}
              />
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {nextStep}
            </p>
            
            {onNextStepClick && (
              <Button 
                size="sm" 
                onClick={onNextStepClick}
                className="mt-1"
              >
                Let's do it!
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedFeedback; 