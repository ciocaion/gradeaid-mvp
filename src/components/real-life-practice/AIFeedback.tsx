import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Lightbulb, Camera, Mic, PenTool } from 'lucide-react';
import { AIDrawingFeedback } from '@/types/realLifePractice';

interface AIFeedbackProps {
  feedback: AIDrawingFeedback;
  drawingDataUrl?: string;
  inputType?: 'image' | 'voice' | 'drawing';
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ 
  feedback, 
  drawingDataUrl,
  inputType = 'drawing'
}) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {drawingDataUrl && (
        <div className="bg-white rounded-lg overflow-hidden border border-amber-200 mb-4">
          <div className="p-2 bg-amber-50 flex items-center gap-2 border-b border-amber-200">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              {inputType === 'image' ? (
                <Camera className="h-4 w-4 text-amber-700" />
              ) : inputType === 'voice' ? (
                <Mic className="h-4 w-4 text-amber-700" />
              ) : (
                <PenTool className="h-4 w-4 text-amber-700" />
              )}
            </div>
            <span className="text-sm font-medium text-amber-800">
              {inputType === 'image' 
                ? 'Your Photo Solution' 
                : inputType === 'voice' 
                ? 'Your Voice Explanation'
                : 'Your Drawing Solution'}
            </span>
          </div>
          <img 
            src={drawingDataUrl} 
            alt="Your solution" 
            className="w-full object-contain max-h-[200px]"
          />
        </div>
      )}
      
      <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
        <div className="flex-shrink-0 mt-1">
          <div className="bg-green-100 p-2 rounded-full">
            <Bot className="h-5 w-5 text-green-700" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-green-800">AI Assessment</h3>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="text-gray-700">
            {feedback.feedback.split('\n').map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      </div>
      
      {feedback.learningTip && (
        <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex-shrink-0 mt-1">
            <div className="bg-amber-100 p-2 rounded-full">
              <Lightbulb className="h-5 w-5 text-amber-700" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-md font-medium text-amber-800 mb-2">Learning Tip</h3>
            <p className="text-sm text-gray-700">
              {feedback.learningTip}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIFeedback; 