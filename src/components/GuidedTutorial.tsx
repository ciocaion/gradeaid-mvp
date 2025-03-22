import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface TutorialStep {
  title: string;
  content: string;
  targetElement?: string; // CSS selector for the element to highlight
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  emoji?: string;
}

interface GuidedTutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  storageKey?: string; // Local storage key to remember that the tutorial has been seen
}

/**
 * A component that provides a step-by-step guided tutorial
 * Designed for neurodivergent children with clear instructions and visual cues
 */
const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  storageKey,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Calculate the position for the tooltip based on the target element
  useEffect(() => {
    if (!isOpen) return;
    
    const step = steps[currentStep];
    if (!step.targetElement) {
      // Center the tooltip if there's no target element
      setTargetPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        width: 0,
        height: 0,
      });
      return;
    }
    
    const targetElement = document.querySelector(step.targetElement);
    if (!targetElement) return;
    
    const rect = targetElement.getBoundingClientRect();
    setTargetPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    });
    
    // Add a temporary highlight to the target element
    targetElement.classList.add('tutorial-highlight');
    
    // Clean up the highlight when the step changes
    return () => {
      targetElement.classList.remove('tutorial-highlight');
    };
  }, [currentStep, isOpen, steps]);
  
  // Save to local storage when the tutorial is completed
  useEffect(() => {
    if (storageKey && currentStep === steps.length) {
      localStorage.setItem(storageKey, 'true');
      if (onComplete) onComplete();
    }
  }, [currentStep, onComplete, steps.length, storageKey]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };
  
  const handleRestart = () => {
    setCurrentStep(0);
  };
  
  if (!isOpen) return null;
  
  // Calculate the position of the tooltip
  const step = steps[currentStep];
  let tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 1000 };
  
  // Position the tooltip based on the step position
  if (step.targetElement) {
    switch (step.position) {
      case 'top':
        tooltipStyle = {
          ...tooltipStyle,
          top: targetPosition.top - 80,
          left: targetPosition.left + targetPosition.width / 2 - 150,
        };
        break;
      case 'right':
        tooltipStyle = {
          ...tooltipStyle,
          top: targetPosition.top + targetPosition.height / 2 - 80,
          left: targetPosition.left + targetPosition.width + 20,
        };
        break;
      case 'bottom':
        tooltipStyle = {
          ...tooltipStyle,
          top: targetPosition.top + targetPosition.height + 20,
          left: targetPosition.left + targetPosition.width / 2 - 150,
        };
        break;
      case 'left':
        tooltipStyle = {
          ...tooltipStyle,
          top: targetPosition.top + targetPosition.height / 2 - 80,
          left: targetPosition.left - 320,
        };
        break;
      default:
        tooltipStyle = {
          ...tooltipStyle,
          top: targetPosition.top + targetPosition.height + 20,
          left: targetPosition.left + targetPosition.width / 2 - 150,
        };
    }
  } else {
    // Center the tooltip if there's no target element
    tooltipStyle = {
      ...tooltipStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Tutorial tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="fixed z-[1000] bg-white rounded-lg shadow-lg w-[300px] p-4"
          style={tooltipStyle}
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleClose}
            aria-label="Close tutorial"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl" aria-hidden="true">
                {step.emoji || '🔍'}
              </span>
              <h3 className="font-bold text-lg">{step.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{step.content}</p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                aria-label="Previous step"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                aria-label="Restart tutorial"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
              
              <Button size="sm" onClick={handleNext}>
                {currentStep < steps.length - 1 ? (
                  <ArrowRight className="h-4 w-4" />
                ) : (
                  'Finish'
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default GuidedTutorial; 