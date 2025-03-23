import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Settings, ArrowLeft, RotateCw, Zap, Brain, RefreshCw, BookOpen, Home, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import { useTranslation } from 'react-i18next';
import { useExerciseIntroModal } from '@/components/ExerciseIntroModal';

import ImageUploader from '@/components/image-to-learning/ImageUploader';
import Quiz from '@/components/image-to-learning/Quiz';
import Flashcards from '@/components/image-to-learning/Flashcards';
import Explanation from '@/components/image-to-learning/Explanation';
import { analyzeImage, regenerateQuiz, type AnalysisResult } from '@/services/imageAnalysisService';
import TaskAnalysis from '@/components/TaskAnalysis';
import AudioText from '@/components/AudioText';
import { generateStructuredExplanation, generateTaskBreakdown } from '@/services/structuredLearningService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useLearningJourney } from '@/contexts/LearningJourneyContext';

// Default empty data for when no analysis is available yet
const emptyQuiz = [{ question: "No questions yet", options: ["Please analyze an image"], answer: "Please analyze an image" }];
const emptyFlashcards = [{ term: "No flashcards yet", definition: "Please analyze an image" }];
const emptyExplanation = "No explanation yet. Please analyze an image to generate content.";

const ImageToLearning: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, addPoints } = useUserPreferences();
  const { t } = useTranslation();
  const { 
    isInLearningJourney, 
    learningTopic, 
    currentPathIndex, 
    learningPath,
    completeCurrentActivity 
  } = useLearningJourney();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('quiz');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isRegeneratingQuiz, setIsRegeneratingQuiz] = useState<boolean>(false);
  const [usingDemoContent, setUsingDemoContent] = useState<boolean>(false);
  const [taskSteps, setTaskSteps] = useState<{ step: number; text: string; icon: string; complete: boolean; hint?: string }[]>([
    { step: 1, text: t('imageToLearning.taskSteps.step1'), icon: "📷", complete: false, hint: t('imageToLearning.taskSteps.hint1') },
    { step: 2, text: t('imageToLearning.taskSteps.step2'), icon: "🔍", complete: false, hint: t('imageToLearning.taskSteps.hint2') },
    { step: 3, text: t('imageToLearning.taskSteps.step3'), icon: "🧠", complete: false, hint: t('imageToLearning.taskSteps.hint3') },
    { step: 4, text: t('imageToLearning.taskSteps.step4'), icon: "✅", complete: false, hint: t('imageToLearning.taskSteps.hint4') }
  ]);
  const [currentTaskStep, setCurrentTaskStep] = useState<number>(1);
  const [conceptBreakdown, setConceptBreakdown] = useState<any>(null);
  
  // Exercise intro modal setup
  const { IntroModal, HelpIcon } = useExerciseIntroModal(
    t('exerciseIntro.activities.imageToLearning.title'),
    t('exerciseIntro.activities.imageToLearning.description'),
    '📸'
  );
  
  const themeStyles = {
    default: "",
    space: "bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-700",
    ocean: "bg-gradient-to-b from-blue-600 via-blue-800 to-blue-900",
    forest: "bg-gradient-to-b from-green-400 via-green-600 to-green-800",
    sunset: "bg-gradient-to-b from-orange-400 via-red-500 to-purple-700",
    candy: "bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-500",
  };
  
  const overlayClass = preferences.theme !== 'default' ? 'bg-black/20' : '';
  const themeClass = themeStyles[preferences.theme] || themeStyles.default;
  
  const handleImageSelected = (imageData: File | null) => {
    setSelectedImage(imageData);
    completeTaskStep(1);
  };
  
  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Create a more structured and detailed prompt
      const imagePrompt = `Analyze this image showing math problems, equations, or concepts.

IMPORTANT: You MUST generate ALL of the following in a properly structured JSON format:

1. QUIZ: Minimum 3 multiple-choice questions directly based on the image content
   - Each question must have 4 options and specify the correct answer
   - Questions should test understanding of concepts shown in the image

2. FLASHCARDS: Minimum 3 flashcards covering key concepts from the image
   - Each flashcard should have a "front" (term/concept) and "back" (explanation)
   - IMPORTANT FOR FLASHCARDS:
     * Front: Short term (1-3 words) with a relevant emoji (e.g., "Addition ➕")
     * Back: Very simple explanation (5-10 words max) a child could understand
     * Make explanations concrete, not abstract (e.g., "Putting numbers together to find the total")
     * Focus on one idea per flashcard
     * Design for children with neurodivergence (ADHD, autism, etc.)

3. EXPLANATION: A simple explanation of the math concepts shown
   - Use 4-6 short, simple sentences (10-15 words each)
   - Each sentence should focus on ONE clear idea
   - Use everyday language a 7-year-old could understand
   - Avoid complex terminology - explain concepts simply
   - Make it concrete and practical (not abstract)

4. TOPIC: A single string containing the main math concept shown in the image (e.g., "addition", "fractions", "geometry")

Your response MUST follow this exact JSON structure:
{
  "quiz": [
    {
      "question": "Clear question text based on image content",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "The correct option exactly as written in options array"
    },
    // minimum 2 more questions
  ],
  "flashcards": [
    {
      "front": "Concept ➕",
      "back": "Simple explanation a child can understand"
    },
    // minimum 2 more flashcards
  ],
  "explanation": "Simple explanation using short sentences a child can understand.",
  "topic": "main math concept"
}`;
      
      // Read the image file and convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      const result = await new Promise<string>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64Image = reader.result as string;
            const response = await analyzeImage({
              prompt: imagePrompt,
              imageData: base64Image
            });
            resolve(response);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
      });
      
      // Parse result and validate all components are present
      try {
        const parsedResult = JSON.parse(result);
        
        // Ensure we have valid quiz data
        if (!parsedResult.quiz || !Array.isArray(parsedResult.quiz) || parsedResult.quiz.length < 2) {
          console.warn('Missing or invalid quiz data, using fallback');
          parsedResult.quiz = [
            {
              question: "What is 2+2?",
              options: ["3", "4", "5", "6"],
              answer: "4"
            },
            {
              question: "What is 5-2?",
              options: ["1", "2", "3", "4"],
              answer: "3"
            },
            {
              question: "What is 3×3?",
              options: ["6", "8", "9", "12"],
              answer: "9"
            }
          ];
          setUsingDemoContent(true);
        }
        
        // Ensure we have valid flashcard data
        if (!parsedResult.flashcards || !Array.isArray(parsedResult.flashcards) || parsedResult.flashcards.length < 3) {
          console.warn('Missing or invalid flashcard data, using fallback');
          parsedResult.flashcards = [
            {
              front: "Addition ➕",
              back: "Putting numbers together to find the total"
            },
            {
              front: "Subtraction ➖",
              back: "Finding what's left when you take away"
            },
            {
              front: "Multiplication ✖️",
              back: "Adding the same number many times"
            }
          ];
          setUsingDemoContent(true);
        } else {
          // Map the flashcards to ensure consistent structure
          parsedResult.flashcards = parsedResult.flashcards.map(card => {
            // Handle possible different API response structures
            const front = card.front || card.term || '';
            const back = card.back || card.definition || '';
            
            // Add emoji if not present
            const frontWithEmoji = front.includes('️') ? front : addEmojiForConcept(front);
            
            // Simplify explanation for neurodivergent children
            const simplifiedBack = simplifyForNeurodivergence(back);
            
            return {
              front: frontWithEmoji,
              back: simplifiedBack
            };
          });
        }
        
        // Ensure we have a valid explanation
        if (!parsedResult.explanation || typeof parsedResult.explanation !== 'string' || parsedResult.explanation.length < 50) {
          console.warn('Missing or too short explanation, using fallback');
          parsedResult.explanation = "Numbers help us count things. Addition means putting numbers together. The plus sign looks like a cross. When we add numbers, we get a bigger number. Subtraction means taking away. The minus sign is a small line.";
          setUsingDemoContent(true);
        }
        
        // Extract topic if available or default to 'math'
        const topic = parsedResult.topic || 'math';
        
        setAnalysisResult(parsedResult);
        
        // Generate a structured explanation for the detected concept
        try {
          const structuredExplanation = await generateStructuredExplanation(
            topic,
            preferences.childAge || 8,
            preferences.theme
          );
          setConceptBreakdown(structuredExplanation);
        } catch (explanationError) {
          console.error('Error generating structured explanation:', explanationError);
        }
        
      } catch (parseError) {
        console.error('Error parsing analysis result:', parseError);
        // Use more comprehensive fallback data if parsing fails
        setAnalysisResult({
          quiz: [
            {
              question: "What is 2+2?",
              options: ["3", "4", "5", "6"],
              answer: "4"
            },
            {
              question: "What is 5-2?",
              options: ["1", "2", "3", "4"],
              answer: "3"
            },
            {
              question: "What is 3×3?",
              options: ["6", "8", "9", "12"],
              answer: "9"
            }
          ],
          flashcards: [
            {
              front: "Addition ➕",
              back: "Putting numbers together to find the total"
            },
            {
              front: "Subtraction ➖",
              back: "Finding what's left when you take away"
            },
            {
              front: "Multiplication ✖️",
              back: "Adding the same number many times"
            }
          ],
          explanation: "Numbers help us count things. Addition means putting numbers together. The plus sign looks like a cross. When we add numbers, we get a bigger number. Subtraction means taking away. The minus sign is a small line."
        });
        setUsingDemoContent(true);
      }
      
      // Add points for analyzing an image
      addPoints(10);
      toast.success('Analysis complete! You earned 10 points', {
        description: 'Explore the different learning materials generated from your image.',
      });
      
      completeTaskStep(2);
    } catch (error) {
      console.error('Error during image analysis:', error);
      toast.error('Something went wrong during analysis', {
        description: 'Please try again with a clearer image of math problems.',
      });
      
      // Use fallback data in case of API failure
      setAnalysisResult({
        quiz: [
          {
            question: "What is 2+2?",
            options: ["3", "4", "5", "6"],
            answer: "4"
          },
          {
            question: "What is 5-2?",
            options: ["1", "2", "3", "4"],
            answer: "3"
          },
          {
            question: "What is 3×3?",
            options: ["6", "8", "9", "12"],
            answer: "9"
          }
        ],
        flashcards: [
          {
            front: "Addition ➕",
            back: "Putting numbers together to find the total"
          },
          {
            front: "Subtraction ➖",
            back: "Finding what's left when you take away"
          },
          {
            front: "Multiplication ✖️",
            back: "Adding the same number many times"
          }
        ],
        explanation: "Numbers help us count things. Addition means putting numbers together. The plus sign looks like a cross. When we add numbers, we get a bigger number. Subtraction means taking away. The minus sign is a small line."
      });
      setUsingDemoContent(true);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleRegenerateQuiz = async () => {
    if (!analysisResult || isRegeneratingQuiz || !selectedImage) return;
    
    setIsRegeneratingQuiz(true);
    
    try {
      // Call regenerateQuiz with the image file and difficulty
      const newQuiz = await regenerateQuiz(selectedImage, difficulty);
      
      // Update the analysis result with the new quiz
      setAnalysisResult({
        ...analysisResult,
        quiz: newQuiz
      });
      
      toast.success('Quiz regenerated successfully!');
    } catch (error) {
      console.error('Failed to regenerate quiz:', error);
      toast.error('Failed to regenerate quiz. Please try again.');
    } finally {
      setIsRegeneratingQuiz(false);
    }
  };
  
  const goBack = () => {
    navigate('/home');
  };
  
  // Helper to add emoji to concept name if missing
  const addEmojiForConcept = (text: string): string => {
    if (!text) return 'Concept 📚';
    
    const conceptToEmoji: Record<string, string> = {
      'addition': '➕',
      'subtraction': '➖',
      'multiplication': '✖️',
      'division': '➗',
      'fraction': '🧩',
      'decimal': '🔢',
      'geometry': '📐',
      'algebra': '🔤',
      'equation': '🟰',
      'measurement': '📏',
      'time': '⏰',
      'money': '💰',
      'percentage': '💯',
      'graph': '📊',
      'probability': '🎲',
      'shapes': '⬛',
      'angle': '📐'
    };
    
    // Check if the text already has an emoji
    const hasEmoji = /\p{Emoji}/u.test(text);
    if (hasEmoji) return text;
    
    // Find a matching emoji or use a default
    let emoji = '📚';
    for (const [concept, conceptEmoji] of Object.entries(conceptToEmoji)) {
      if (text.toLowerCase().includes(concept)) {
        emoji = conceptEmoji;
        break;
      }
    }
    
    return `${text} ${emoji}`;
  };
  
  // Helper to simplify language for neurodivergent children
  const simplifyForNeurodivergence = (text: string): string => {
    if (!text) return '';
    
    // If already short enough, return as is
    if (text.split(' ').length <= 10) return text;
    
    // Extract first sentence or limit to 10 words
    const firstSentence = text.split(/[.!?]/) [0];
    const words = firstSentence.split(' ');
    
    if (words.length <= 10) return firstSentence;
    return words.slice(0, 10).join(' ');
  };
  
  // Handle quiz tab exploration
  const handleExploreQuiz = () => {
    completeTaskStep(3);
  };
  
  // Handle quiz completion
  const handleQuizComplete = (score: number, total: number) => {
    completeTaskStep(4);
    const earnedPoints = Math.ceil((score / total) * 15) + 5;
    
    addPoints(earnedPoints);
    toast.success(`Quiz complete! You earned ${earnedPoints} points`, {
      description: `You got ${score} out of ${total} questions right.`,
    });
  };
  
  // Complete a task step
  const completeTaskStep = (step: number) => {
    setTaskSteps(prev => prev.map(s => 
      s.step === step ? { ...s, complete: true } : s
    ));
    setCurrentTaskStep(step + 1);
  };
  
  const continueToNextActivity = () => {
    completeCurrentActivity();
  };
  
  const getNextActivityName = () => {
    if (currentPathIndex + 1 >= learningPath.length) {
      return t('learning.completeJourney');
    }
    
    const nextPath = learningPath[currentPathIndex + 1];
    switch(nextPath) {
      case '/exercises/balloons': return t('learning.tools.balloonExercise');
      case '/image-to-learning': return t('learning.tools.imageLearning');
      case '/real-life-practice': return t('learning.tools.realLifePractice');
      case '/video-learning': return t('learning.tools.videoLearning');
      default: return t('learning.tools.nextActivity');
    }
  };
  
  return (
    <div className="relative min-h-screen max-w-7xl mx-auto p-4 md:p-6">
      <ThemedBackground theme={preferences.theme} className="fixed inset-0 z-[-1]" />
      
      {/* Help Icon for re-opening the modal */}
      <HelpIcon />
      
      {/* Intro Modal */}
      <IntroModal theme={preferences.theme} />
      
      <div className="flex flex-col space-y-6">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 hover:bg-white/90 shadow-sm flex items-center" 
                onClick={goBack}
              >
                <Home className="h-4 w-4 mr-1.5" /> {t('imageToLearning.backToHome')}
              </Button>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Camera className="h-6 w-6 text-blue-600" />
                {isInLearningJourney ? `📸 ${t('imageToLearning.title')}: ${learningTopic}` : t('imageToLearning.imageLearning')}
              </h1>
            </div>
            
            <PreferencesButton />
          </div>
          
          {/* Learning Journey Progress - show only if in a learning journey */}
          {isInLearningJourney && (
            <div className="mb-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold">{t('imageToLearning.learningJourney')}: {learningTopic}</h2>
                <AudioText text={`${t('imageToLearning.learningJourney')}: ${learningTopic}. ${t('imageToLearning.step')} ${currentPathIndex + 1} ${t('imageToLearning.of')} ${learningPath.length}.`} className="ml-1" />
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${Math.round(((currentPathIndex + 1) / learningPath.length) * 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t('imageToLearning.step')} {currentPathIndex + 1} {t('imageToLearning.of')} {learningPath.length}
                </span>
                
                <Button 
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-sm hover:shadow-md"
                  onClick={continueToNextActivity}
                >
                  {t('imageToLearning.continueTo')} {getNextActivityName()} →
                </Button>
              </div>
            </div>
          )}
        </header>
        
        {/* Task Analysis Component */}
        <div className="mb-6">
          <TaskAnalysis 
            steps={taskSteps}
            currentStep={currentTaskStep}
            onStepComplete={completeTaskStep}
            vertical={false}
          />
        </div>
        
        {/* Grid layout for content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Left side - Image upload */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {t('imageToLearning.uploadImage')}
                <AudioText 
                  text={t('imageToLearning.uploadInstructions')}
                  className="ml-2"
                />
              </h2>
              <ImageUploader onImageSelected={handleImageSelected} />
              
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={handleAnalyzeImage}
                  disabled={!selectedImage || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      {t('imageToLearning.analyzing')}
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      {t('imageToLearning.analyzeImage')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right side - Content display */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg h-full">
              {/* Demo content alert */}
              {usingDemoContent && analysisResult && (
                <Alert variant="info" className="mb-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>{t('imageToLearning.demoContentAlert')}</AlertTitle>
                  <AlertDescription>
                    {t('imageToLearning.demoContentDescription')}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Introduction message - only show when no analysis and not analyzing */}
              {!analysisResult && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="bg-primary/10 p-6 rounded-full mb-6">
                    <Zap className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{t('imageToLearning.uploadAndAnalyze')}</h2>
                  <p className="text-gray-600 max-w-md">
                    {t('imageToLearning.uploadInstructions')}
                  </p>
                </div>
              )}
              
              {/* Loading skeleton - only show when analyzing */}
              {isAnalyzing && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              )}
              
              {/* Results Content - hide this section entirely if no analysis and not analyzing */}
              <div className={(!analysisResult && !isAnalyzing) ? 'hidden' : 'block'}>
                {/* Only show tabs and content when analysis is complete */}
                <div className={isAnalyzing ? 'hidden' : 'block'}>
                  <Tabs 
                    defaultValue="quiz" 
                    value={activeTab}
                    onValueChange={(value) => {
                      setActiveTab(value);
                      if (value === 'quiz' && currentTaskStep === 3) {
                        handleExploreQuiz();
                      }
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="quiz">{t('imageToLearning.tabs.quiz')}</TabsTrigger>
                      <TabsTrigger value="flashcards">{t('imageToLearning.tabs.flashcards')}</TabsTrigger>
                      <TabsTrigger value="explanation">{t('imageToLearning.tabs.explanation')}</TabsTrigger>
                      <TabsTrigger value="breakdown">{t('imageToLearning.tabs.breakdown')}</TabsTrigger>
                    </TabsList>
                    
                    {/* Quiz difficulty and regenerate controls */}
                    <TabsContent value="quiz" className="flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{t('imageToLearning.difficulty.label')}:</span>
                          <Select
                            value={difficulty}
                            onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder={t('imageToLearning.difficulty.label')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">{t('imageToLearning.difficulty.easy')}</SelectItem>
                              <SelectItem value="medium">{t('imageToLearning.difficulty.medium')}</SelectItem>
                              <SelectItem value="hard">{t('imageToLearning.difficulty.hard')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerateQuiz}
                          disabled={isRegeneratingQuiz || !analysisResult}
                        >
                          {isRegeneratingQuiz ? (
                            <>
                              <RotateCw className="mr-2 h-3 w-3 animate-spin" />
                              {t('imageToLearning.regenerating')}
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3" />
                              {t('imageToLearning.newQuestions')}
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {isRegeneratingQuiz && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md h-full flex flex-col justify-center items-center">
                          <div className="flex flex-col items-center justify-center">
                            <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
                            <h3 className="text-xl font-medium mb-2">{t('imageToLearning.regeneratingQuiz')}</h3>
                            <p className="text-gray-600 text-center max-w-md">
                              {t('imageToLearning.regeneratingQuiz')}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {!isRegeneratingQuiz && analysisResult && (
                        <Quiz 
                          questions={analysisResult.quiz || emptyQuiz} 
                          title={t('imageToLearning.quizTitle')}
                          onComplete={(score, total) => {
                            completeTaskStep(3);
                            // Award points based on score
                            const earnedPoints = Math.max(5, Math.round((score / total) * 20));
                            addPoints(earnedPoints);
                            toast.success(`Quiz completed! +${earnedPoints} points`, {
                              description: `You got ${score} out of ${total} questions correct.`
                            });
                          }}
                        />
                      )}
                      
                      {!analysisResult && !isAnalyzing && (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Brain className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">{t('imageToLearning.noQuizAvailable')}</h3>
                          <p className="text-gray-500">
                            {t('imageToLearning.noQuizInstructions')}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="flashcards" className="mt-4">
                      {analysisResult && <Flashcards flashcards={analysisResult.flashcards} />}
                    </TabsContent>
                    
                    <TabsContent value="explanation" className="mt-4">
                      {analysisResult && <Explanation explanation={analysisResult.explanation} />}
                    </TabsContent>
                    
                    <TabsContent value="breakdown" className="mt-4">
                      {conceptBreakdown ? (
                        <div className="space-y-6">
                          <h2 className="text-xl font-semibold">{conceptBreakdown.concept}</h2>
                          
                          <div className="space-y-4">
                            {conceptBreakdown.steps.map((step: any) => (
                              <div key={step.number} className="bg-white rounded-lg border p-4">
                                <h3 className="text-lg font-medium mb-2">
                                  Step {step.number}: {step.title}
                                </h3>
                                <p className="mb-2">{step.content}</p>
                                
                                {step.example && (
                                  <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-md">
                                    <p className="text-amber-800">
                                      <strong>Example:</strong> {step.example}
                                    </p>
                                  </div>
                                )}
                                
                                {step.visualCue && (
                                  <div className="mt-2 flex items-center gap-2 text-blue-600">
                                    <Brain className="h-4 w-4" />
                                    <p className="text-sm italic">{step.visualCue}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                            <h3 className="font-semibold text-green-800 mb-2">{t('imageToLearning.checkForUnderstanding')}</h3>
                            <ul className="list-disc list-inside space-y-2">
                              {conceptBreakdown.checkForUnderstanding.map((item: string, i: number) => (
                                <li key={i} className="text-green-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Brain className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">{t('imageToLearning.noBreakdownAvailable')}</h3>
                          <p className="text-gray-500">
                            {t('imageToLearning.noBreakdownInstructions')}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToLearning; 