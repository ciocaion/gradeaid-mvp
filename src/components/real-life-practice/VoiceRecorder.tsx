import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Save, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { transcribeAudio } from '@/services/realLifeActivityService';
import { useTranslation } from 'react-i18next';

interface VoiceRecorderProps {
  onRecordingComplete: (audioText: string) => void;
  isSubmitting?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isSubmitting = false
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Clean up timer when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up audio URL if it exists
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setRecordingTime(0);
      setAudioURL(null);
      setTranscriptionText('');
      setRecordingComplete(false);
      setError(null);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new media recorder with audio/webm MIME type for better compatibility
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      
      // Event handlers
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        // Create audio blob and set URL
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Stop all audio tracks from the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Set state to recording complete
        setRecordingComplete(true);
        
        // Automatically start transcription
        transcribeRecording(audioBlob);
      };
      
      // Start recording
      recorder.start(1000); // Collect data in 1-second chunks
      setIsRecording(true);
      setIsPaused(false);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(t('learning.voiceRecorder.microphoneError'));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    stopRecording();
    setRecordingTime(0);
    setAudioURL(null);
    setTranscriptionText('');
    setRecordingComplete(false);
    setError(null);
    audioChunksRef.current = [];
  };

  const transcribeRecording = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Use the imported transcribeAudio function from realLifeActivityService
      const text = await transcribeAudio(audioBlob);
      
      // Check if the transcription was successful
      if (text && !text.includes('Could not transcribe')) {
        setTranscriptionText(text);
        onRecordingComplete(text);
      } else {
        // Handle transcription error
        setError(t('learning.voiceRecorder.transcriptionError'));
        setTranscriptionText('');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setError(t('learning.voiceRecorder.transcriptionError'));
      setTranscriptionText('');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
        {isRecording || audioURL ? (
          <div className="w-full flex flex-col items-center">
            {/* Waveform visualization - simple version */}
            <div className="w-full h-24 my-4 flex items-center justify-center">
              {isRecording ? (
                <div className="w-full max-w-md h-12 flex items-center justify-center space-x-1">
                  {/* Simple animation for recording */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 bg-primary rounded-full",
                        isPaused ? "h-1" : "animate-soundwave"
                      )}
                      style={{
                        height: isPaused ? '4px' : `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full max-w-md">
                  {audioURL && (
                    <audio controls src={audioURL} className="w-full">
                      {t('learning.voiceRecorder.audioNotSupported')}
                    </audio>
                  )}
                </div>
              )}
            </div>

            {/* Recording time */}
            <div className="text-xl font-mono mb-4">
              {formatTime(recordingTime)}
            </div>

            {/* Recording controls */}
            <div className="flex space-x-2 mb-4">
              {isRecording ? (
                <>
                  {isPaused ? (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={resumeRecording}
                      className="h-12 w-12 rounded-full"
                    >
                      <Play className="h-6 w-6" />
                      <span className="sr-only">{t('learning.voiceRecorder.resume')}</span>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={pauseRecording}
                      className="h-12 w-12 rounded-full"
                    >
                      <Pause className="h-6 w-6" />
                      <span className="sr-only">{t('learning.voiceRecorder.pause')}</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={stopRecording}
                    className="h-12 w-12 bg-red-500 hover:bg-red-600 rounded-full"
                  >
                    <Square className="h-6 w-6" />
                    <span className="sr-only">{t('learning.voiceRecorder.stop')}</span>
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={resetRecording}
                  className="h-12 w-12 rounded-full"
                >
                  <Trash2 className="h-6 w-6" />
                  <span className="sr-only">{t('learning.voiceRecorder.reset')}</span>
                </Button>
              )}
            </div>
            
            {/* Transcription results */}
            {(isTranscribing || transcriptionText || error) && (
              <div className="w-full max-w-md mt-4">
                <h3 className="text-sm font-medium mb-2">{t('learning.voiceRecorder.transcription')}</h3>
                <div className="bg-white p-3 rounded border">
                  {isTranscribing ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <p>{t('learning.voiceRecorder.transcribing')}</p>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <p className="whitespace-pre-wrap">{transcriptionText}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={startRecording}
            className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-transform hover:scale-105"
            disabled={isSubmitting}
          >
            <Mic className="h-8 w-8" />
            <span className="sr-only">{t('learning.voiceRecorder.startRecording')}</span>
          </Button>
        )}
      </div>
      
      {!isRecording && !audioURL && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          {t('learning.voiceRecorder.tapToRecord')}
        </p>
      )}
      
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <p>{t('learning.voiceRecorder.processing')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder; 