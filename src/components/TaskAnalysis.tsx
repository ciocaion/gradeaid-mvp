import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import AudioText from './AudioText';

interface Step {
  step: number;
  text: string;
  icon: string;
  complete: boolean;
  hint?: string;
}

interface TaskAnalysisProps {
  steps: Step[];
  currentStep: number;
  onStepComplete: (step: number) => void;
  vertical?: boolean;
}

const TaskAnalysis: React.FC<TaskAnalysisProps> = ({
  steps,
  currentStep,
  onStepComplete,
  vertical = false
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold">Task Steps</h2>
        <AudioText text="Task Steps. Follow these steps to complete the activity." className="ml-1" />
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
        
        {/* Steps */}
        <div className="space-y-4 relative z-10">
          {steps.map((step) => (
            <motion.div
              key={step.step}
              className={`flex items-start gap-4 ${currentStep === step.step ? 'opacity-100' : 'opacity-80'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: currentStep === step.step ? 1 : 0.8, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Icon & Number */}
              <div className="relative">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                    step.complete 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.step 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  initial={false}
                  animate={{
                    scale: currentStep === step.step ? [1, 1.1, 1] : 1,
                    backgroundColor: step.complete ? '#10b981' : currentStep === step.step ? '#dbeafe' : '#f3f4f6'
                  }}
                  transition={{ duration: 0.5, times: [0, 0.5, 1] }}
                >
                  {step.complete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </motion.div>
              </div>
              
              {/* Step Text */}
              <div className="flex-1">
                <p className={`font-medium ${
                  step.complete 
                    ? 'text-green-700 line-through' 
                    : currentStep === step.step 
                      ? 'text-blue-900' 
                      : 'text-gray-500'
                }`}>
                  Step {step.step}: {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskAnalysis; 