import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Star, Lightbulb, Zap, Brain } from 'lucide-react';

interface ExplanationProps {
  explanation: string;
  title?: string;
}

const Explanation: React.FC<ExplanationProps> = ({ 
  explanation, 
  title = 'Explanation'
}) => {
  // Split the explanation into sentences for better visual chunking
  const sentences = explanation
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .filter(sentence => sentence.trim().length > 0);
  
  // Choose appropriate icons for each chunk
  const icons = [
    <Lightbulb className="h-6 w-6 text-yellow-500" />,
    <Zap className="h-6 w-6 text-purple-500" />,
    <Star className="h-6 w-6 text-blue-500" />,
    <Brain className="h-6 w-6 text-green-500" />,
    <BookOpen className="h-6 w-6 text-red-500" />
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        <div className="space-y-6">
          {sentences.map((sentence, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-3 rounded-lg bg-primary/5 animate-in fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mt-1 flex-shrink-0">
                {icons[index % icons.length]}
              </div>
              <p className="text-lg leading-relaxed m-0 font-medium">
                {sentence}
              </p>
            </div>
          ))}
        </div>
        
        {/* Visual summary with emojis */}
        <div className="mt-6 flex justify-center gap-4 text-3xl">
          {getRelevantEmojis(explanation).map((emoji, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-1">{emoji}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to extract relevant emojis based on content
const getRelevantEmojis = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  const emojis: string[] = [];
  
  if (lowerText.includes('add') || lowerText.includes('plus') || lowerText.includes('sum')) {
    emojis.push('➕');
  }
  
  if (lowerText.includes('subtract') || lowerText.includes('minus') || lowerText.includes('difference')) {
    emojis.push('➖');
  }
  
  if (lowerText.includes('multiply') || lowerText.includes('product') || lowerText.includes('times')) {
    emojis.push('✖️');
  }
  
  if (lowerText.includes('divide') || lowerText.includes('quotient') || lowerText.includes('division')) {
    emojis.push('➗');
  }
  
  if (lowerText.includes('equal') || lowerText.includes('same')) {
    emojis.push('=');
  }
  
  if (lowerText.includes('fraction') || lowerText.includes('part')) {
    emojis.push('🔢');
  }
  
  if (lowerText.includes('shape') || lowerText.includes('triangle') || lowerText.includes('circle') || lowerText.includes('rectangle')) {
    emojis.push('📐');
  }
  
  // Always include these common math emojis if we don't have enough specific ones
  if (emojis.length < 3) {
    if (!emojis.includes('🧮')) emojis.push('🧮');
    if (!emojis.includes('📝') && emojis.length < 3) emojis.push('📝');
    if (!emojis.includes('🔍') && emojis.length < 3) emojis.push('🔍');
  }
  
  return emojis;
};

export default Explanation; 