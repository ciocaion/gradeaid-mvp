import React, { MutableRefObject } from 'react';
import { Camera, Mic, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { InputMethod } from '@/types/realLifePractice';

interface InputSelectorProps {
  selectedMethod?: InputMethod;
  onSelectMethod?: (method: InputMethod) => void;
  inputMethod?: string;
  onChange?: (value: any) => void;
  onDrawingComplete?: (dataUrl: any) => void;
  onImageSelected?: (dataUrl: any) => void;
  onVoiceRecorded?: (text: any) => void;
  canvasRef?: MutableRefObject<any>;
}

const InputSelector: React.FC<InputSelectorProps> = ({
  selectedMethod,
  onSelectMethod
}) => {
  const inputOptions = [
    {
      id: 'upload' as InputMethod,
      icon: <Camera className="h-5 w-5" />,
      label: 'Take Photo',
      description: 'Show a photo of your solution'
    },
    {
      id: 'voice' as InputMethod,
      icon: <Mic className="h-5 w-5" />,
      label: 'Voice Explain',
      description: 'Tell me how you solved it'
    },
    {
      id: 'drawing' as InputMethod,
      icon: <PenTool className="h-5 w-5" />,
      label: 'Draw Solution',
      description: 'Draw your answer on screen'
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-amber-800 mb-3">How would you like to share your solution?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {inputOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedMethod === option.id
                ? 'bg-amber-100 border-amber-500 shadow-sm'
                : 'bg-white border-gray-200 hover:border-amber-300'
            }`}
            onClick={() => onSelectMethod(option.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                selectedMethod === option.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {option.icon}
              </div>
              <h4 className="font-medium">{option.label}</h4>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InputSelector; 