import React, { useState, useEffect } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface AudioTextProps {
  text: string;
  label?: string;
  autoPlay?: boolean;
  className?: string;
  volume?: number;
  rate?: number;
  pitch?: number;
  voiceURI?: string;
}

/**
 * A component that adds text-to-speech capability to any text
 * Designed for neurodivergent children who may prefer auditory learning
 */
const AudioText: React.FC<AudioTextProps> = ({
  text,
  label = 'Read aloud',
  autoPlay = false,
  className = '',
  volume = 1,
  rate = 1,
  pitch = 1,
  voiceURI,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const { preferences } = useUserPreferences();
  
  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeechSupported(true);
    }
  }, []);
  
  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && isSpeechSupported && text) {
      handleSpeak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, isSpeechSupported, text]);
  
  // Make sure speech is canceled when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeechSupported]);
  
  const handleSpeak = () => {
    if (!isSpeechSupported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set utterance properties
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Try to find the preferred voice if specified
    if (voiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.voiceURI === voiceURI);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    // Add event listeners
    utterance.onstart = () => {
      setIsPlaying(true);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    
    // Speak the utterance
    window.speechSynthesis.speak(utterance);
  };
  
  const handleStop = () => {
    if (!isSpeechSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };
  
  // Don't render anything if speech synthesis is not supported
  if (!isSpeechSupported) {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`text-xs flex items-center gap-1 ${className}`}
      onClick={isPlaying ? handleStop : handleSpeak}
      title={isPlaying ? 'Stop reading' : label}
      aria-label={isPlaying ? 'Stop reading' : label}
      data-testid="audio-text-button"
    >
      {isPlaying ? (
        <>
          <VolumeX className="h-3 w-3" />
          <span className="sr-only">Stop reading</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3 w-3" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};

export default AudioText; 