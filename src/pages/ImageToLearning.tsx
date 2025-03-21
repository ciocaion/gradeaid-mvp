import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Settings, ArrowLeft, RotateCw, Zap, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import ImageUploader from '@/components/image-to-learning/ImageUploader';
import Quiz from '@/components/image-to-learning/Quiz';
import Flashcards from '@/components/image-to-learning/Flashcards';
import Explanation from '@/components/image-to-learning/Explanation';
import { analyzeImage, regenerateQuiz, type AnalysisResult } from '@/services/imageAnalysisService';

// Default empty data for when no analysis is available yet
const emptyQuiz = [{ question: "No questions yet", options: ["Please analyze an image"], answer: "Please analyze an image" }];
const emptyFlashcards = [{ term: "No flashcards yet", definition: "Please analyze an image" }];
const emptyExplanation = "No explanation yet. Please analyze an image to generate content.";

const ImageToLearning: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, addPoints } = useUserPreferences();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('quiz');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isRegeneratingQuiz, setIsRegeneratingQuiz] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the user has set their OpenAI API key in env or localStorage
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const localApiKey = localStorage.getItem('openai_api_key');
    setHasApiKey(!!(envApiKey || localApiKey));
  }, []);
  
  const themeStyles = {
    minecraft: "bg-[url('/images/minecraft-bg.jpg')] bg-cover bg-center",
    roblox: "bg-[url('/images/roblox-bg.jpg')] bg-cover bg-center",
    fortnite: "bg-[url('/images/fortnite-bg.jpg')] bg-cover bg-center",
    default: "bg-gradient-to-b from-sky-500/30 to-sky-200/30",
  };
  
  const overlayClass = preferences.theme !== 'default' ? 'bg-black/20' : '';
  const themeClass = themeStyles[preferences.theme] || themeStyles.default;
  
  const handleImageSelected = (imageData: File | null) => {
    setSelectedImage(imageData);
    setAnalysisResult(null);
  };
  
  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (!hasApiKey) {
      toast.error('Please add your OpenAI API key in settings');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      const result = await analyzeImage(selectedImage);
      setAnalysisResult(result);
      
      // Add points for analyzing an image
      addPoints(10);
      toast.success('Analysis complete! You earned 10 points', {
        description: 'Explore the different learning materials generated from your image.',
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleRegenerateQuiz = async () => {
    if (!selectedImage) return;
    
    if (!hasApiKey) {
      toast.error('Please add your OpenAI API key in settings');
      return;
    }
    
    try {
      setIsRegeneratingQuiz(true);
      const newQuizQuestions = await regenerateQuiz(selectedImage, difficulty);
      
      if (analysisResult) {
        setAnalysisResult({
          ...analysisResult,
          quiz: newQuizQuestions,
        });
      }
      
      toast.success(`Generated new ${difficulty} level questions!`);
    } catch (error) {
      console.error('Error regenerating quiz:', error);
      toast.error('Failed to regenerate quiz. Please try again.');
    } finally {
      setIsRegeneratingQuiz(false);
    }
  };
  
  const goBackToFeatures = () => {
    navigate('/features');
  };
  
  return (
    <div className={`min-h-screen ${themeClass} ${overlayClass} flex flex-col p-4 md:p-8`}>
      <motion.header 
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white/80 hover:bg-white/90"
              onClick={goBackToFeatures}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight inline-block">
              Image to Learning
            </h1>
          </div>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Upload an image and get AI-generated learning materials based on what's in it!
          </motion.p>
        </motion.div>

        {preferences.hasCompletedOnboarding && (
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
              <Star className="h-5 w-5 mr-1.5 text-yellow-400" />
              <span className="font-bold text-white">{preferences.points}</span>
            </div>
            
            <Button variant="outline" size="sm" asChild className="bg-white/80 hover:bg-white/90">
              <Link to="/settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.header>
      
      <motion.div 
        className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {/* Left side - Image upload */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            {!hasApiKey && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <Key className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">OpenAI API Key Required</AlertTitle>
                <AlertDescription className="text-amber-700">
                  You need to add your OpenAI API key to use this feature.{' '}
                  <Link to="/settings" className="font-medium underline underline-offset-4 hover:text-amber-900">
                    Add your API key in Settings
                  </Link>
                </AlertDescription>
              </Alert>
            )}
            
            <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
            <ImageUploader onImageSelected={handleImageSelected} />
            
            <div className="mt-6">
              <Button 
                className="w-full" 
                onClick={handleAnalyzeImage}
                disabled={!selectedImage || isAnalyzing || !hasApiKey}
              >
                {isAnalyzing ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side - Content display */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg h-full">
            {/* Introduction message - only show when no analysis and not analyzing */}
            {!analysisResult && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                  <Zap className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Upload & Analyze an Image</h2>
                <p className="text-gray-600 max-w-md">
                  Select an image on the left, then click "Analyze Image" to generate interactive learning content based on what's in your image.
                </p>
                {!hasApiKey && (
                  <Link to="/settings" className="mt-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Add OpenAI API Key
                    </Button>
                  </Link>
                )}
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
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="explanation">Explanation</TabsTrigger>
                  </TabsList>
                  
                  {/* Quiz difficulty and regenerate controls */}
                  {activeTab === 'quiz' && (
                    <div className="flex gap-3 items-center mt-6">
                      <Select 
                        value={difficulty}
                        onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRegenerateQuiz}
                        disabled={isRegeneratingQuiz || !hasApiKey}
                      >
                        {isRegeneratingQuiz ? (
                          <RotateCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCw className="h-4 w-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">Regenerate</span>
                      </Button>
                    </div>
                  )}
                  
                  <TabsContent value="quiz" className="mt-4">
                    {analysisResult && <Quiz questions={analysisResult.quiz} />}
                  </TabsContent>
                  
                  <TabsContent value="flashcards" className="mt-4">
                    {analysisResult && <Flashcards cards={analysisResult.flashcards} />}
                  </TabsContent>
                  
                  <TabsContent value="explanation" className="mt-4">
                    {analysisResult && <Explanation explanation={analysisResult.explanation} />}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageToLearning; 