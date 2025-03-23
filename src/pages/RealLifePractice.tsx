import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home, 
  Send, 
  Loader2, 
  PenTool, 
  Camera,
  Mic,
  PenLine,
  MessageSquare, 
  RefreshCw, 
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLearningJourney } from '@/contexts/LearningJourneyContext';
import { useTranslation } from 'react-i18next';
import { generateMathActivity, analyzeDrawing, analyzeImage, analyzeVoiceText } from '@/services/realLifeActivityService';
import DrawingCanvas, { DrawingCanvasRef } from '@/components/real-life-practice/DrawingCanvas';
import ActivityPrompt from '@/components/real-life-practice/ActivityPrompt';
import AIFeedback from '@/components/real-life-practice/AIFeedback';
import Guidance from '@/components/Guidance';
import InputSelector from '@/components/real-life-practice/InputSelector';
import ImageUploader from '@/components/real-life-practice/ImageUploader';
import VoiceRecorder from '@/components/real-life-practice/VoiceRecorder';
import ActivityProgress from '@/components/real-life-practice/ActivityProgress';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import TaskAnalysis from '@/components/TaskAnalysis';
import EnhancedFeedback from '@/components/EnhancedFeedback';
import GuidedTutorial from '@/components/GuidedTutorial';
import AudioText from '@/components/AudioText';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useExerciseIntroModal } from '@/components/ExerciseIntroModal';

const RealLifePractice: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { preferences, addPoints, addBadge } = useUserPreferences();
  const { t } = useTranslation();
  const { isInLearningJourney, learningTopic } = useLearningJourney();
  
  // Exercise intro modal setup
  const { HelpIcon, IntroModal } = useExerciseIntroModal(
    t('exerciseIntro.activities.realLifePractice.title'),
    t('exerciseIntro.activities.realLifePractice.description'),
    '🏠'
  );

  const [activity, setActivity] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");
  const canvasRef = useRef<DrawingCanvasRef>(null);
  const [inputMethod, setInputMethod] = useState('upload');
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [drawingDataUrl, setDrawingDataUrl] = useState(null);
  const [voiceText, setVoiceText] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const [taskSteps, setTaskSteps] = useState([
    { step: 1, text: t('realLifePractice.activitySteps.step1'), icon: "📖", complete: false },
    { step: 2, text: t('realLifePractice.activitySteps.step2'), icon: "🔍", complete: false },
    { step: 3, text: t('realLifePractice.activitySteps.step3'), icon: "✏️", complete: false },
    { step: 4, text: t('realLifePractice.activitySteps.step4'), icon: "📤", complete: false },
    { step: 5, text: t('realLifePractice.activitySteps.step5'), icon: "🎯", complete: false }
  ]);

  const [currentTaskStep, setCurrentTaskStep] = useState(1);
  const [nextStepAction, setNextStepAction] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Add a state to track if the canvas has content
  const [hasCanvasContent, setHasCanvasContent] = useState(false);
  
  const completeTaskStep = (step: number) => {
    setTaskSteps(prev => prev.map(s => s.step === step ? { ...s, complete: true } : s));
    setCurrentTaskStep(step + 1);
  };
  
  const canSubmit = () => {
    if (!activity) return false;
    
    if (inputMethod === 'voice' && voiceText) {
      return true;
    } else if (inputMethod === 'upload' && imageDataUrl) {
      return true;
    } else if (inputMethod === 'drawing' && (hasCanvasContent || (canvasRef.current && !canvasRef.current.isEmpty()))) {
      return true;
    }
    
    return false;
  };
  
  const generateNewActivity = async () => {
    setFeedback(null);
    setImageDataUrl(null);
    setDrawingDataUrl(null);
    setVoiceText(null);
    setResponseImage(null);
    setHasCanvasContent(false);
    if (canvasRef.current) canvasRef.current.clearCanvas();
    setActiveTab("activity");
    try {
      setIsGenerating(true);
      const newActivity = await generateMathActivity(preferences.childAge || 7, 'medium', undefined, preferences.theme);
      setActivity(newActivity);
      setTaskSteps(taskSteps.map(step => ({ ...step, complete: false })));
      setCurrentTaskStep(1);
    } catch (error) {
      toast({ title: "Error generating activity", description: "Using a sample instead.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!activity || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let aiResponse = null;
      
      if (inputMethod === 'voice' && voiceText) {
        aiResponse = await analyzeVoiceText({ audioText: voiceText, activity, childAge: preferences.childAge || 7 });
      } 
      else if (inputMethod === 'upload' && imageDataUrl) {
        try {
          aiResponse = await analyzeImage({ 
            imageDataUrl, 
            activity, 
            childAge: preferences.childAge || 7 
          });
          setResponseImage(imageDataUrl);
        } catch (imageError) {
          throw new Error(`Image analysis failed: ${imageError.message}`);
        }
      } 
      else if (inputMethod === 'drawing' && canvasRef.current) {
        // First check if canvas is empty
        try {
          if (canvasRef.current.isEmpty && canvasRef.current.isEmpty()) {
            toast({ 
              title: "Empty Drawing", 
              description: "Please draw something before submitting.", 
              variant: "destructive" 
            });
            setIsSubmitting(false);
            return;
          }
          
          // Get the data URL from the canvas
          const dataUrl = canvasRef.current.toDataURL();
          
          if (!dataUrl || dataUrl === 'data:,') {
            throw new Error("Failed to get drawing data");
          }
          
          // Store the drawing and set it as the response image
          setDrawingDataUrl(dataUrl);
          setResponseImage(dataUrl);
          
          // Try to analyze the drawing with robust error handling
          try {
            aiResponse = await analyzeDrawing(dataUrl, activity, preferences.childAge || 7);
          } catch (drawingApiError) {
            // Provide a fallback response if the API fails
            aiResponse = {
              feedback: "Thank you for your drawing! I can see you worked hard on this solution.",
              learningTip: "Keep practicing your math skills by drawing out the problems."
            };
          }
        } catch (drawingError) {
          throw new Error(`Drawing submission failed: ${drawingError.message}`);
        }
      }
      
      if (aiResponse) {
        setFeedback(aiResponse);
        setNextStepAction(aiResponse.nextStep);
        completeTaskStep(4);
        addPoints(15);
        // Switch to the feedback tab to show results
        setActiveTab("feedback");
      } else {
        throw new Error("No response received from analysis");
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast({ 
        title: "AI Analysis Error", 
        description: error.message || "Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goBack = () => navigate('/home');

  // Effect to check canvas content when input method changes
  useEffect(() => {
    if (inputMethod === 'drawing' && canvasRef.current) {
      setHasCanvasContent(!canvasRef.current.isEmpty());
    }
  }, [inputMethod]);

  return (
    <div className="min-h-screen flex flex-col p-4 bg-slate-50 relative">
      <ThemedBackground theme={preferences.theme} className="fixed inset-0 z-[-1]" />
      
      {/* Help Icon for re-opening the modal */}
      <HelpIcon />
      
      {/* Intro Modal */}
      <IntroModal theme={preferences.theme} />
      
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={goBack}>
              <Home className="h-4 w-4 mr-1.5" /> {t('common.backToHome')}
            </Button>
            <h1 className="text-3xl font-bold text-primary">{t('realLifePractice.title')}</h1>
          </div>
          <PreferencesButton />
        </div>
        <Card className="mb-6 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/10 pb-2">
            <CardTitle className="text-xl font-bold">{activity?.title || 'Real-World Activity'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <TaskAnalysis 
              steps={taskSteps}
              currentStep={currentTaskStep}
              onStepComplete={completeTaskStep}
              vertical={true}
            />
            
            <ActivityProgress completedCount={completedCount} streak={streak} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-container">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="activity" disabled={isSubmitting}><PenLine className="h-4 w-4 mr-2" /> {t('realLifePractice.tabs.activity')}</TabsTrigger>
                <TabsTrigger value="feedback" disabled={!feedback || isSubmitting}><MessageSquare className="h-4 w-4 mr-2" /> {t('realLifePractice.tabs.feedback')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-4">
                <div className="space-y-4">
                  {activity ? (
                    <div className="activity-card">
                      <ActivityPrompt 
                        activity={activity} 
                        difficultyLevel={activity.difficulty || 'medium'} 
                        theme={preferences.theme}
                        onCompleteReading={() => completeTaskStep(1)}
                      />
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                        <p className="text-center text-gray-500 mb-4">
                          {t('realLifePractice.generateNewActivity')}
                        </p>
                        <Button onClick={generateNewActivity} disabled={isGenerating}>
                          {isGenerating ? t('realLifePractice.generating') : t('realLifePractice.generateActivity')}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {activity && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {t('realLifePractice.howWouldYouLikeToRespond')}
                        <AudioText 
                          text={t('realLifePractice.howWouldYouLikeToRespondDescription')}
                          className="ml-2"
                        />
                      </h3>
                      <RadioGroup
                        value={inputMethod}
                        onValueChange={(value) => {
                          setInputMethod(value);
                          completeTaskStep(2);
                        }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                      >
                        <div>
                          <RadioGroupItem 
                            value="drawing" 
                            id="drawing" 
                            className="peer sr-only" 
                            aria-label={t('realLifePractice.drawYourSolution')}
                          />
                          <Label
                            htmlFor="drawing"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <PenTool className="h-6 w-6 mb-2" />
                            <span>{t('realLifePractice.drawIt')}</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem 
                            value="upload" 
                            id="upload" 
                            className="peer sr-only"
                            aria-label={t('realLifePractice.uploadAPhotoSolution')} 
                          />
                          <Label
                            htmlFor="upload"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Camera className="h-6 w-6 mb-2" />
                            <span>{t('realLifePractice.takeAPhoto')}</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem 
                            value="voice" 
                            id="voice" 
                            className="peer sr-only"
                            aria-label={t('realLifePractice.explainYourSolutionWithVoice')} 
                          />
                          <Label
                            htmlFor="voice"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Mic className="h-6 w-6 mb-2" />
                            <span>{t('realLifePractice.explainIt')}</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Response input */}
                    {inputMethod === 'drawing' && (
                      <div className="mb-4">
                        <Card>
                          <CardContent className="p-4">
                            <DrawingCanvas
                              ref={canvasRef}
                              onDrawingComplete={(dataUrl) => {
                                setDrawingDataUrl(dataUrl);
                                setResponseImage(dataUrl);
                                setHasCanvasContent(true);
                                completeTaskStep(3);
                              }}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    {inputMethod === 'upload' && (
                      <div className="mb-4">
                        <Card>
                          <CardContent className="p-4">
                            <ImageUploader 
                              onImageSelected={(dataUrl) => {
                                setImageDataUrl(dataUrl);
                                setResponseImage(dataUrl);
                                completeTaskStep(3);
                              }}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    {inputMethod === 'voice' && (
                      <div className="mb-4">
                        <Card>
                          <CardContent className="p-4">
                            <VoiceRecorder 
                              onRecordingComplete={(text) => {
                                setVoiceText(text);
                                completeTaskStep(3);
                              }}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canSubmit()}
                        className="submit-button"
                        aria-label={t('realLifePractice.submitYourSolution')}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('realLifePractice.submitting')}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t('realLifePractice.submit')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="feedback" className="mt-4">
                {feedback ? (
                  <EnhancedFeedback 
                    mainFeedback={feedback.feedback} 
                    learningTip={feedback.learningTip || "Keep practicing with different math problems like this one!"}
                    nextStep={nextStepAction || "Try another activity to keep practicing your math skills."}
                    onNextStepClick={generateNewActivity} 
                    supportLevel="medium"
                  />
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 mb-4">{t('realLifePractice.submitSolutionToSeeFeedback')}</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("activity")}
                    >
                      {t('realLifePractice.goBackToSubmitSolution')}
                    </Button>
                  </div>
                )}
                
                {/* Show the submitted image/drawing if available */}
                {responseImage && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">{t('realLifePractice.yourSubmission')}</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <img 
                        src={responseImage} 
                        alt="Your submission" 
                        className="max-h-[300px] mx-auto object-contain"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <GuidedTutorial steps={[]} isOpen={showTutorial} onClose={() => setShowTutorial(false)} onComplete={() => {}} storageKey="hasSeenRealLifePracticeTutorial" />
    </div>
  );
};

export default RealLifePractice; 