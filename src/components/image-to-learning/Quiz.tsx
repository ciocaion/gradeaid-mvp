import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  type?: 'multiple-choice' | 'true-false' | 'fill-in-blank';
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, title = 'Quiz', onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Safety check for empty or undefined questions array
  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Questions Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">There are no quiz questions available. Please try regenerating the quiz or upload a new image.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (value: string) => {
    if (answered) return;
    setSelectedOption(value);
  };
  
  const checkAnswer = () => {
    if (!selectedOption) {
      toast.error('Please select an answer');
      return;
    }
    
    setAnswered(true);
    
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect. Try again!');
    }
    
    // Mark question as completed
    if (!completedQuestions.includes(currentQuestionIndex)) {
      setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
    }
  };
  
  const finishQuiz = () => {
    if (onComplete) {
      onComplete(score, questions.length);
    }
    
    toast.success(`Quiz completed with score: ${score}/${questions.length}`, {
      description: `You got ${Math.round((score / questions.length) * 100)}% correct!`
    });
    
    // Show results
    setShowResults(true);
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Call finish quiz when all questions are answered
      finishQuiz();
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };
  
  const progressPercentage = (completedQuestions.length / questions.length) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <span className="text-sm font-normal">
            Score: {score}/{questions.length}
          </span>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <p className="text-gray-700">{currentQuestion.question}</p>
        </div>
        
        <RadioGroup
          value={selectedOption || ''}
          className="space-y-3"
          onValueChange={handleOptionSelect}
        >
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 border rounded-lg p-3 transition-colors ${
                answered && option === currentQuestion.answer
                  ? 'border-green-500 bg-green-50'
                  : answered && option === selectedOption
                  ? 'border-red-500 bg-red-50'
                  : option === selectedOption
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <RadioGroupItem
                value={option}
                id={`option-${index}`}
                disabled={answered}
                className="relative"
              />
              <Label
                htmlFor={`option-${index}`}
                className="flex-grow cursor-pointer font-normal"
              >
                {option}
              </Label>
              {answered && option === currentQuestion.answer && (
                <Check className="text-green-500 h-5 w-5" />
              )}
              {answered && option === selectedOption && option !== currentQuestion.answer && (
                <X className="text-red-500 h-5 w-5" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div>
          {!answered ? (
            <Button onClick={checkAnswer}>Check Answer</Button>
          ) : currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={finishQuiz} variant="default" className="bg-green-600 hover:bg-green-700">
              Complete Quiz
              <Check className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next Question
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Quiz; 