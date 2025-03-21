import { QuizQuestion } from '@/components/image-to-learning/Quiz';
import { Flashcard } from '@/components/image-to-learning/Flashcards';

// Get API key from environment variables or localStorage
const getApiKey = (): string | null => {
  // Check environment variables first
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  // Fall back to localStorage
  return localStorage.getItem('openai_api_key');
};

// Set API key to localStorage
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('openai_api_key', apiKey);
};

export interface AnalysisResult {
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  explanation: string;
}

/**
 * Converts an image file to a base64 encoded string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // We need the full data URL for OpenAI
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Analyzes an image using OpenAI's Vision API
 */
export const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  try {
    const base64Image = await fileToBase64(imageFile);
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not set. Please set your API key in settings.');
    }
    
    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI educator. Given an image, analyze it and generate educational content about the objects, concepts, or themes present in the image."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and generate learning materials including multiple-choice quiz questions, flashcards with key terms, and a short explanation about what's in the image. Return the response as JSON with these sections: quiz (array of questions with options and answers), flashcards (array of terms and definitions), and explanation (text)."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      response_format: { type: "json_object" }
    };
    
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    let result;
    
    try {
      // The content should already be JSON since we specified response_format
      if (typeof data.choices[0].message.content === 'string') {
        result = JSON.parse(data.choices[0].message.content);
      } else {
        result = data.choices[0].message.content;
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Failed to parse the response from OpenAI. Please try again.');
    }
    
    // Validate and ensure proper structure
    if (!result.quiz || !result.flashcards || !result.explanation) {
      throw new Error('Response from OpenAI is missing required fields. Please try again.');
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

/**
 * Generates new quiz questions based on the same image with different difficulty
 */
export const regenerateQuiz = async (imageFile: File, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<QuizQuestion[]> => {
  try {
    const base64Image = await fileToBase64(imageFile);
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not set. Please set your API key in settings.');
    }
    
    const prompt = `Generate ${difficulty} difficulty quiz questions based on this image. Create multiple-choice questions with one correct answer and several plausible but incorrect options. Return as JSON array of question objects with 'question', 'options', and 'answer' fields.`;
    
    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an educational content creator specializing in creating appropriate difficulty quiz questions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    };
    
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    let result;
    
    try {
      if (typeof data.choices[0].message.content === 'string') {
        result = JSON.parse(data.choices[0].message.content);
      } else {
        result = data.choices[0].message.content;
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Failed to parse the response from OpenAI. Please try again.');
    }
    
    // Make sure we have an array of questions
    const questions = Array.isArray(result.questions) ? result.questions : 
                      Array.isArray(result) ? result : [];
    
    if (questions.length === 0) {
      throw new Error('No quiz questions were generated. Please try again.');
    }
    
    return questions;
  } catch (error) {
    console.error('Error regenerating quiz:', error);
    throw error;
  }
}; 