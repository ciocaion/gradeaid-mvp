export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type InputMethod = 'upload' | 'voice' | 'drawing';

export interface Activity {
  id: string;
  challenge: string;
  goal: string;
  variation: string;
  difficulty?: DifficultyLevel;
  mathConcept?: string;
  theme?: string;
}

export interface AIDrawingFeedback {
  feedback: string;
  learningTip?: string;
  score?: number;
}

export interface AnalysisRequest {
  activity: Activity;
  childAge: number;
}

export interface ImageAnalysisRequest extends AnalysisRequest {
  imageDataUrl: string;
}

export interface VoiceAnalysisRequest extends AnalysisRequest {
  audioText: string;
}

export interface DrawingAnalysisRequest extends AnalysisRequest {
  drawingDataUrl: string;
}

export interface ProgressStats {
  completedCount: number;
  streak: number;
  lastActivityDate?: string;
} 