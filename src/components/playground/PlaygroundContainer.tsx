import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaygroundScene from './PlaygroundScene';
import Controls from '../Controls';
import Guidance from '../Guidance';
import { 
  calculateValue, 
  generateHint, 
  addBalloons, 
  addSandbags, 
  removeBalloons, 
  removeSandbags,
  OperationType
} from '@/utils/mathUtils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface OperationInteractions {
  addition: number;
  subtraction: number;
  multiplication: number;
  division: number;
}

const PlaygroundContainer: React.FC = () => {
  const navigate = useNavigate();
  const [balloons, setBalloons] = useState(0);
  const [sandbags, setSandbags] = useState(0);
  const [operation, setOperation] = useState<OperationType>('subtraction');
  const [hint, setHint] = useState("");
  const [playgroundHeight, setPlaygroundHeight] = useState(400);
  const [lastAction, setLastAction] = useState<'add-balloon' | 'add-sandbag' | 'remove-balloon' | 'remove-sandbag' | null>(null);
  
  // Replace single counter with tracking for all operations
  const [interactions, setInteractions] = useState<OperationInteractions>({
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0
  });
  
  // Track whether both types have been used
  const [hasBalloons, setHasBalloons] = useState(false);
  const [hasSandbags, setHasSandbags] = useState(false);
  
  const [showPrompt, setShowPrompt] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const playgroundRef = useRef<HTMLDivElement>(null);
  
  const value = calculateValue(balloons, sandbags, operation);
  
  useEffect(() => {
    setHint(generateHint(balloons, sandbags, operation));
  }, [balloons, sandbags, operation]);
  
  useEffect(() => {
    if (playgroundRef.current) {
      setPlaygroundHeight(playgroundRef.current.clientHeight);
    }
    
    const handleResize = () => {
      if (playgroundRef.current) {
        setPlaygroundHeight(playgroundRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update has balloons/sandbags flags
  useEffect(() => {
    if (balloons > 0 && !hasBalloons) {
      setHasBalloons(true);
    } else if (balloons === 0) {
      setHasBalloons(false);
    }
    
    if (sandbags > 0 && !hasSandbags) {
      setHasSandbags(true);
    } else if (sandbags === 0) {
      setHasSandbags(false);
    }
  }, [balloons, sandbags]);

  // Check for interactions with current operation when both types are used
  useEffect(() => {
    const currentInteractions = interactions[operation];
    
    // Only trigger prompt when both balloons and sandbags have been used
    if (hasBalloons && hasSandbags && currentInteractions >= 5 && !showPrompt) {
      setShowPrompt(true);
    }
  }, [interactions, operation, hasBalloons, hasSandbags]);

  // Generate quiz questions based on current operation, balloon and sandbag count
  const generateQuizQuestions = (): QuizQuestion[] => {
    // Create operation-specific questions
    let questions: QuizQuestion[] = [];
    
    switch (operation) {
      case 'addition':
        questions = [
          {
            question: `🎈 If you have ${balloons} balloons and get ${sandbags} more, how many balloons do you have now?`,
            options: [
              `${balloons + sandbags - 1}`,
              `${balloons + sandbags}`,
              `${balloons + sandbags + 1}`,
              `${balloons - sandbags}`
            ],
            answer: `${balloons + sandbags}`
          },
          {
            question: `🍦 You have ${balloons} ice cream scoops. Your friend gives you 3 more. How many scoops do you have?`,
            options: [
              `${balloons + 2}`,
              `${balloons + 3}`,
              `${balloons + 4}`,
              `${balloons + 1}`
            ],
            answer: `${balloons + 3}`
          },
          {
            question: "🧩 Which shows adding things together?",
            options: [
              "Sharing toys with friends",
              "Counting all the cookies in two jars",
              "Cutting a pizza into slices",
              "Figuring out how many more points you need"
            ],
            answer: "Counting all the cookies in two jars"
          }
        ];
        break;
        
      case 'subtraction':
        questions = [
          {
            question: `🎈 You have ${balloons} balloons. ${Math.min(balloons, 2)} pop! How many balloons are left?`,
            options: [
              `${balloons - Math.min(balloons, 2) - 1}`,
              `${balloons - Math.min(balloons, 2)}`,
              `${balloons - Math.min(balloons, 2) + 1}`,
              `${balloons * 2}`
            ],
            answer: `${balloons - Math.min(balloons, 2)}`
          },
          {
            question: `⚖️ The basket has ${balloons} balloons (going up) and ${sandbags} sandbags (going down). Where does it end up?`,
            options: [
              `${balloons - sandbags - 1}`,
              `${balloons - sandbags}`,
              `${balloons - sandbags + 1}`,
              `${balloons + sandbags}`
            ],
            answer: `${balloons - sandbags}`
          },
          {
            question: "🏄 What happens when you add more sandbags to your basket?",
            options: [
              "It floats higher in the sky",
              "The number gets bigger",
              "The number gets smaller",
              "Nothing changes"
            ],
            answer: "The number gets smaller"
          }
        ];
        break;
        
      case 'multiplication':
        questions = [
          {
            question: `🍪 You have ${balloons} plates with ${sandbags} cookies on each plate. How many cookies in total?`,
            options: [
              `${balloons * sandbags - 1}`,
              `${balloons * sandbags}`,
              `${balloons * sandbags + 1}`,
              `${balloons + sandbags}`
            ],
            answer: `${balloons * sandbags}`
          },
          {
            question: `🚗 There are ${sandbags} toy cars. Each car has ${balloons} wheels. How many wheels altogether?`,
            options: [
              `${balloons * sandbags - 2}`,
              `${balloons * sandbags - 1}`,
              `${balloons * sandbags}`,
              `${balloons * sandbags + 2}`
            ],
            answer: `${balloons * sandbags}`
          },
          {
            question: "🍭 Which is like multiplication?",
            options: [
              "Adding the same number over and over",
              "Taking some away from a group",
              "Sharing candy equally",
              "Putting two numbers together"
            ],
            answer: "Adding the same number over and over"
          }
        ];
        break;
        
      case 'division':
        questions = [
          {
            question: `🍕 You have ${balloons * sandbags} pizza slices to share with ${sandbags} friends. How many slices does each friend get?`,
            options: [
              `${balloons - 1}`,
              `${balloons}`,
              `${balloons + 1}`,
              `${balloons * 2}`
            ],
            answer: `${balloons}`
          },
          {
            question: `🧸 You need to put ${balloons * sandbags} teddy bears in ${balloons} equal rows. How many bears in each row?`,
            options: [
              `${sandbags - 1}`,
              `${sandbags}`,
              `${sandbags + 1}`,
              `${balloons + sandbags}`
            ],
            answer: `${sandbags}`
          },
          {
            question: "🍦 What happens when you divide an ice cream by 1?",
            options: [
              "You get no ice cream",
              "You get the same amount of ice cream",
              "You always get 1 ice cream",
              "You can't divide by 1"
            ],
            answer: "You get the same amount of ice cream"
          }
        ];
        break;
    }
    
    return questions;
  };

  // Handle operation change
  const handleOperationChange = (newOperation: OperationType) => {
    // Reset balloon/sandbag flags if switching operations
    if (operation !== newOperation) {
      setHasBalloons(balloons > 0);
      setHasSandbags(sandbags > 0);
    }
    
    setOperation(newOperation);
    
    // Show toast with operation change
    const operationNames = {
      'addition': 'Addition',
      'subtraction': 'Subtraction',
      'multiplication': 'Multiplication',
      'division': 'Division'
    };
    
    toast.info(`Switched to ${operationNames[newOperation]} mode!`, {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  // Update interaction counter based on current operation
  const incrementInteraction = () => {
    if (hasBalloons && hasSandbags) {
      setInteractions(prev => ({
        ...prev,
        [operation]: prev[operation] + 1
      }));
    }
  };
  
  const handleAddBalloon = () => {
    setBalloons(prev => addBalloons(prev, 1));
    setLastAction('add-balloon');
    incrementInteraction();
    
    toast.success('Balloon added! Your basket rises higher.', {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  const handleRemoveBalloon = () => {
    if (balloons > 0) {
      setBalloons(prev => removeBalloons(prev, 1));
      setLastAction('remove-balloon');
      incrementInteraction();
      
      toast.info('Balloon removed! The basket feels a bit heavier now.', {
        position: 'bottom-center',
        duration: 2000,
      });
    }
  };
  
  const handleAddSandbag = () => {
    setSandbags(prev => addSandbags(prev, 1));
    setLastAction('add-sandbag');
    incrementInteraction();
    
    toast.success('Sandbag added! Your basket sinks lower.', {
      position: 'bottom-center',
      duration: 2000,
    });
  };
  
  const handleRemoveSandbag = () => {
    if (sandbags > 0) {
      setSandbags(prev => removeSandbags(prev, 1));
      setLastAction('remove-sandbag');
      incrementInteraction();
      
      toast.info('Sandbag removed! The basket feels a bit lighter now.', {
        position: 'bottom-center',
        duration: 2000,
      });
    }
  };

  // Handle quiz selection
  const handleTakeQuiz = () => {
    setShowPrompt(false);
    const questions = generateQuizQuestions();
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setIsCorrect(null);
    setQuizCompleted(false);
    setScore(0);
    setShowQuiz(true);
  };

  // Handle operation change from prompt
  const handleChangeOperation = (newOperation: OperationType) => {
    setShowPrompt(false);
    handleOperationChange(newOperation);
    
    // Reset the interaction counter for the previous operation
    setInteractions(prev => ({
      ...prev,
      [operation]: 0
    }));
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Handle checking the answer
  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    const isAnswerCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].answer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setIsCorrect(null);
    } else {
      setQuizCompleted(true);
    }
  };

  // Handle finishing the quiz
  const handleFinishQuiz = () => {
    setShowQuiz(false);
    
    // Reset the interaction counter for the current operation
    setInteractions(prev => ({
      ...prev,
      [operation]: 0
    }));
    
    // Show congratulatory message based on score
    if (score === quizQuestions.length) {
      toast.success('🌟 Perfect score! You\'re a math superstar! 🌟', {
        position: 'bottom-center',
        duration: 3000,
      });
    } else if (score >= quizQuestions.length / 2) {
      toast.success('✨ Great job! You\'re really good at math! ✨', {
        position: 'bottom-center',
        duration: 3000,
      });
    } else {
      toast.info('💪 Awesome try! Let\'s keep playing to get even better! 💪', {
        position: 'bottom-center',
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-col md:flex-row gap-6 w-full h-full">
        <div 
          className="flex-1 relative overflow-hidden rounded-xl glass bg-gradient-to-b from-sky-200/60 to-sky/60 shadow-lg" 
          ref={playgroundRef}
        >
          <PlaygroundScene 
            balloons={balloons}
            sandbags={sandbags}
            value={value}
            playgroundHeight={playgroundHeight}
            operation={operation}
            setOperation={handleOperationChange}
            handleRemoveBalloon={handleRemoveBalloon}
            handleRemoveSandbag={handleRemoveSandbag}
          />
        </div>
        
        <div className="md:w-72 flex flex-col space-y-6">
          <Controls 
            onAddBalloon={handleAddBalloon}
            onRemoveBalloon={handleRemoveBalloon}
            onAddSandbag={handleAddSandbag}
            onRemoveSandbag={handleRemoveSandbag}
            balloons={balloons}
            sandbags={sandbags}
            operation={operation}
          />
          
          <Guidance message={hint} />
        </div>
      </div>

      {/* Prompt Dialog after 5 meaningful interactions */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>🎉 Wow! You're amazing at {operation}!</DialogTitle>
            <DialogDescription>
              Would you like to play a fun {operation} game or try a different math adventure?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="default" onClick={handleTakeQuiz} className="bg-primary hover:bg-primary/90">
              ✨ Play Quiz Game
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              {operation !== 'subtraction' && (
                <Button variant="outline" onClick={() => handleChangeOperation('subtraction')}>
                  ➖ Try Subtraction
                </Button>
              )}
              {operation !== 'addition' && (
                <Button variant="outline" onClick={() => handleChangeOperation('addition')}>
                  ➕ Try Addition
                </Button>
              )}
              {operation !== 'multiplication' && (
                <Button variant="outline" onClick={() => handleChangeOperation('multiplication')}>
                  ✖️ Try Multiplication
                </Button>
              )}
              {operation !== 'division' && (
                <Button variant="outline" onClick={() => handleChangeOperation('division')}>
                  ➗ Try Division
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="sm:max-w-[500px]">
          {!quizCompleted ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {operation === 'addition' && '➕ Fun Addition Quiz!'}
                  {operation === 'subtraction' && '➖ Fun Subtraction Quiz!'}
                  {operation === 'multiplication' && '✖️ Fun Multiplication Quiz!'}
                  {operation === 'division' && '➗ Fun Division Quiz!'}
                </DialogTitle>
                <DialogDescription>
                  Question {currentQuestionIndex + 1} of {quizQuestions.length} - You can do this! 💪
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuestionIndex]?.question}</h3>
                
                <RadioGroup value={selectedAnswer} className="space-y-3">
                  {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 ${
                        selectedAnswer === option ? 'border-primary bg-primary/10' : 'border-gray-200'
                      } hover:border-primary/50 transition-colors cursor-pointer`}
                      onClick={() => isCorrect === null && handleAnswerSelect(option)}
                    >
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`}
                        disabled={isCorrect !== null}
                      />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer w-full">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {isCorrect !== null && (
                  <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCorrect ? 
                      '🎯 Yay! You got it right! You\'re so smart! 🌟' : 
                      `❓ Oops! The answer is: ${quizQuestions[currentQuestionIndex]?.answer} - Let's try another! 💫`
                    }
                  </div>
                )}
              </div>
              
              <DialogFooter>
                {isCorrect === null ? (
                  <Button onClick={handleCheckAnswer} disabled={!selectedAnswer} className="bg-primary hover:bg-primary/90">
                    Check My Answer 🔍
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} className="bg-primary hover:bg-primary/90">
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question ➡️' : 'Finish Game 🏁'}
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>🎊 Quiz Completed! 🎊</DialogTitle>
                <DialogDescription>
                  You scored {score} out of {quizQuestions.length} - Awesome job!
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6 flex flex-col items-center">
                <div className="flex gap-1 mb-4">
                  {[...Array(quizQuestions.length)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-8 w-8 ${i < score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-center text-lg">
                  {score === quizQuestions.length ? 
                    '🌟 Perfect score! You\'re a math superstar! 🌟' :
                    score >= quizQuestions.length / 2 ? 
                      '✨ Great job! You\'re really good at math! ✨' :
                      '💪 Awesome try! Let\'s keep playing to get even better! 💪'
                  }
                </p>
              </div>
              
              <DialogFooter>
                <Button onClick={handleFinishQuiz} className="bg-primary hover:bg-primary/90">
                  Keep Playing 🎮
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaygroundContainer;
