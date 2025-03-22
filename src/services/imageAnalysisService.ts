import { QuizQuestion } from '@/components/image-to-learning/Quiz';
import { Flashcard } from '@/components/image-to-learning/Flashcards';
import i18n from '@/i18n';

export interface ImageAnalysisRequest {
  imageData: string;
  prompt: string;
  theme?: string;
  language?: string;
}

export interface VoiceAnalysisRequest {
  prompt: string;
  theme?: string;
  language?: string;
}

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return apiKey;
};

// Get current language from i18n
const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
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

// Function to extract JSON from a text response that might have other content
const extractJsonFromText = (text: string): any => {
  try {
    // Try to parse as pure JSON first
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to extract JSON from the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // If JSON extraction fails, return null
        return null;
      }
    }
    return null;
  }
};

/**
 * Analyzes an image using OpenAI's Vision API
 */
export const analyzeImage = async (payload: ImageAnalysisRequest): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const language = payload.language || getCurrentLanguage();
    
    // Define the system message based on language
    let systemMessage = '';
    
    if (language === 'da') {
      systemMessage = 'Du er en ekspert i undervisningsindhold, der specialiserer sig i at analysere billeder og skabe strukturerede læringsmaterialer for børn med neurodivergenser. Du giver ALTID komplette svar med ALLE anmodede komponenter, der følger de nøjagtige formatkrav. Til flashcards skal du oprette korte, klare termer med enkle forklaringer (maks. 10-15 ord), der inkluderer hjælpsomme emojis. Til forklaringer skal du bruge 4-6 korte, enkle sætninger (10-15 ord hver) fokuseret på én idé pr. sætning. Skriv som om du taler til et 7-årigt barn ved hjælp af konkrete eksempler. Brug konkret sprog, undgå abstrakte begreber, og fokuser på visuelle elementer. SVAR ALTID PÅ DANSK. Aldrig afkort eller udelad krævede elementer.';
    } else {
      systemMessage = 'You are an expert educational content creator that specializes in analyzing images and creating structured learning materials for children with neurodivergence. You ALWAYS provide complete responses with ALL requested components following the exact format requirements. For flashcards, create short, clear terms with simple explanations (max 10-15 words) that include helpful emojis. For explanations, use 4-6 short simple sentences (10-15 words each) focused on one idea per sentence. Write as if speaking to a 7-year-old using concrete examples. Use concrete language, avoid abstract concepts, and focus on visual elements. ALWAYS RESPOND IN ENGLISH. Never truncate or omit required elements.';
    }
    
    // Adjust prompt based on language if needed
    let userPrompt = payload.prompt;
    if (language === 'da' && !userPrompt.includes('dansk')) {
      userPrompt += ' Svar venligst på dansk.';
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: payload.imageData.startsWith('data:') 
                      ? payload.imageData
                      : `data:image/jpeg;base64,${payload.imageData}`
                }
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      // Create a fallback analysis result with error info based on language
      const fallbackResult: AnalysisResult = language === 'da' 
        ? {
            quiz: [
              {
                question: "Hvad er 2+2?",
                options: ["3", "4", "5", "6"],
                answer: "4"
              },
              {
                question: "Hvad er 5-2?",
                options: ["1", "2", "3", "4"],
                answer: "3"
              }
            ],
            flashcards: [
              {
                front: "Addition ➕",
                back: "At lægge tal sammen for at finde den samlede sum"
              },
              {
                front: "Subtraktion ➖",
                back: "At finde ud af hvad der er tilbage, når man tager noget væk"
              },
              {
                front: "Tal 🔢",
                back: "Symboler vi bruger til at tælle ting"
              }
            ],
            explanation: `Tal hjælper os med at tælle ting. Addition betyder at lægge tal sammen. Plus-tegnet ligner et kors. Når vi lægger tal sammen, får vi et større tal. Subtraktion betyder at trække fra. Minus-tegnet er en lille streg.`
          }
        : {
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
                front: "Numbers 🔢",
                back: "Symbols we use for counting things"
              }
            ],
            explanation: `Numbers help us count things. Addition means putting numbers together. The plus sign looks like a cross. When we add numbers, we get a bigger number. Subtraction means taking away. The minus sign is a small line.`
          };
      
      return JSON.stringify(fallbackResult);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }
    
    // Try to parse the content as JSON
    const extractedJson = extractJsonFromText(content);
    
    if (extractedJson) {
      return JSON.stringify(extractedJson);
    }
    
    // If not JSON, create a structured response based on language
    const fallbackResult: AnalysisResult = language === 'da'
      ? {
          quiz: [
            {
              question: "Hvad er 2+2?",
              options: ["3", "4", "5", "6"],
              answer: "4"
            },
            {
              question: "Hvad er 5-2?",
              options: ["1", "2", "3", "4"],
              answer: "3"
            }
          ],
          flashcards: [
            {
              front: "Addition ➕",
              back: "At lægge tal sammen for at finde den samlede sum"
            },
            {
              front: "Subtraktion ➖",
              back: "At finde ud af hvad der er tilbage, når man tager noget væk"
            },
            {
              front: "Matematik Sjov 🧮",
              back: "At løse gåder med tal"
            }
          ],
          explanation: "Tal hjælper os med at tælle ting. Addition betyder at lægge tal sammen. Plus-tegnet ligner et kors. Når vi lægger tal sammen, får vi et større tal. Subtraktion betyder at trække fra. Minus-tegnet er en lille streg."
        }
      : {
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
              front: "Math Fun 🧮",
              back: "Solving puzzles with numbers"
            }
          ],
          explanation: "Numbers help us count things. Addition means putting numbers together. The plus sign looks like a cross. When we add numbers, we get a bigger number. Subtraction means taking away. The minus sign is a small line."
        };
    
    return JSON.stringify(fallbackResult);
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Create a fallback analysis result based on language
    const language = payload.language || getCurrentLanguage();
    const fallbackResult: AnalysisResult = language === 'da'
      ? {
          quiz: [
            {
              question: "Hvad er 2+2?",
              options: ["3", "4", "5", "6"],
              answer: "4"
            },
            {
              question: "Hvad er 5-2?",
              options: ["1", "2", "3", "4"],
              answer: "3"
            }
          ],
          flashcards: [
            {
              front: "Addition ➕",
              back: "At lægge tal sammen for at finde den samlede sum"
            },
            {
              front: "Subtraktion ➖",
              back: "At finde ud af hvad der er tilbage, når man tager noget væk"
            },
            {
              front: "Lighedstegn =",
              back: "Viser når ting er det samme"
            }
          ],
          explanation: "Tal hjælper os med at tælle ting. Addition betyder at lægge tal sammen. Plus-tegnet ligner et kors. Når vi lægger tal sammen, får vi et større tal. Subtraktion betyder at trække fra. Minus-tegnet er en lille streg."
        }
      : {
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
              front: "Equals Sign =",
              back: "Shows when things are the same"
            }
          ],
          explanation: "Numbers help us count things. Addition means putting numbers together. The plus sign looks like a cross. When we add numbers, we get a bigger number. Subtraction means taking away. The minus sign is a small line."
        };
    
    return JSON.stringify(fallbackResult);
  }
};

/**
 * Generates new quiz questions based on the same image with different difficulty
 */
export const regenerateQuiz = async (imageFile: File, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<QuizQuestion[]> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    // Convert image to Base64
    const imageBase64 = await fileToBase64(imageFile);
    
    // Get current language
    const language = getCurrentLanguage();

    // Adjust prompt based on difficulty and language
    let difficultyGuidance = '';
    if (language === 'da') {
      switch (difficulty) {
        case 'easy':
          difficultyGuidance = 'Hold spørgsmålene meget enkle og egnede til små børn. Fokuser på grundlæggende begreber og brug enkelt sprog. Spørgsmål skal være ligetil med klare svar.';
          break;
        case 'hard':
          difficultyGuidance = 'Skab mere udfordrende spørgsmål, der kræver dybere forståelse. Inkluder spørgsmål, der kræver analyse eller anvendelse af begreber vist på billedet. Opfordr til kritisk tænkning.';
          break;
        default: // medium
          difficultyGuidance = 'Skab moderat udfordrende spørgsmål, der tester forståelse af begreberne vist på billedet. Balancer mellem grundlæggende hukommelse og anvendelsesspørgsmål.';
      }
    } else {
      switch (difficulty) {
        case 'easy':
          difficultyGuidance = 'Keep the questions very simple and suitable for young children. Focus on basic concepts and use simple language. Questions should be straightforward with clear answers.';
          break;
        case 'hard':
          difficultyGuidance = 'Create more challenging questions that require deeper understanding. Include questions that require analysis or application of concepts shown in the image. Encourage critical thinking.';
          break;
        default: // medium
          difficultyGuidance = 'Create moderately challenging questions that test understanding of the concepts shown in the image. Balance between basic recall and application questions.';
      }
    }

    // Create system message based on language
    let systemMessage = '';
    if (language === 'da') {
      systemMessage = 'Du er en undervisnings-AI-assistent. Du skal analysere dette billede, der viser matematikproblemer, ligninger eller begreber. Generer 5 multiple-choice spørgsmål baseret på billedet. Hvert spørgsmål skal have 4 mulige svar, hvor kun 1 er korrekt. Formater dit svar som et JSON-array med spørgsmålsobjekter. VIGTIGT: Svar KUN på dansk og RETURNÉR KUN JSON-ARRAYET.';
    } else {
      systemMessage = 'You are an educational AI assistant. Please analyze this image showing math problems, equations, or concepts. Generate 5 multiple-choice questions based on the image. Each question should have 4 possible answers, with only 1 being correct. Format your response as a JSON array of question objects. IMPORTANT: ONLY respond in English and ONLY return the JSON array.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: language === 'da'
                  ? `${difficultyGuidance} Lav 5 spørgsmål, der tester forståelsen af de matematiske koncepter på billedet. Formater som JSON-array med spørgsmålsobjekter: [{"question": "spørgsmålstekst", "options": ["mulighed1", "mulighed2", "mulighed3", "mulighed4"], "answer": "korrekt svar (skal være et af valgmulighederne)"}].`
                  : `${difficultyGuidance} Create 5 questions that test understanding of the mathematical concepts in the image. Format as a JSON array of question objects: [{"question": "question text", "options": ["option1", "option2", "option3", "option4"], "answer": "correct answer (must be one of the options)"}].`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ],
          }
        ],
        max_tokens: 2000,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      // Return fallback questions if the API call fails
      return getFallbackQuestions(difficulty, language);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return getFallbackQuestions(difficulty, language);
    }
    
    try {
      // Try to extract JSON
      const extractedJson = extractJsonFromText(content);
      if (extractedJson && Array.isArray(extractedJson)) {
        return extractedJson;
      }
      
      // If JSON extraction fails, check if content is an array
      try {
        const jsonArray = JSON.parse(content);
        if (Array.isArray(jsonArray)) {
          return jsonArray;
        }
      } catch (err) {
        // Not a JSON array
      }
      
      // If all parsing fails, return fallback questions
      return getFallbackQuestions(difficulty, language);
    } catch (error) {
      console.error('Error parsing quiz questions:', error);
      return getFallbackQuestions(difficulty, language);
    }
  } catch (error) {
    console.error('Error regenerating quiz:', error);
    return getFallbackQuestions(difficulty, getCurrentLanguage());
  }
};

function getFallbackQuestions(difficulty: 'easy' | 'medium' | 'hard', language: string = 'en'): QuizQuestion[] {
  if (language === 'da') {
    // Danish fallback questions based on difficulty
    switch (difficulty) {
      case 'easy':
        return [
          {
            question: "Hvad er 2+2?",
            options: ["3", "4", "5", "6"],
            answer: "4"
          },
          {
            question: "Hvad er 5-2?",
            options: ["1", "2", "3", "4"],
            answer: "3"
          },
          {
            question: "Hvad er 1+1?",
            options: ["0", "1", "2", "3"],
            answer: "2"
          },
          {
            question: "Hvilket tal er størst?",
            options: ["3", "5", "2", "1"],
            answer: "5"
          },
          {
            question: "Hvor mange er 3+1?",
            options: ["2", "3", "4", "5"],
            answer: "4"
          }
        ];
      case 'hard':
        return [
          {
            question: "Hvad er 12×3?",
            options: ["24", "30", "36", "42"],
            answer: "36"
          },
          {
            question: "50÷5 er lig med?",
            options: ["5", "10", "15", "20"],
            answer: "10"
          },
          {
            question: "Hvad er 24+39?",
            options: ["54", "63", "72", "81"],
            answer: "63"
          },
          {
            question: "Hvis 2x+5=15, hvad er x?",
            options: ["3", "5", "7", "10"],
            answer: "5"
          },
          {
            question: "Hvad er 3² + 4²?",
            options: ["9", "16", "25", "49"],
            answer: "25"
          }
        ];
      default: // medium
        return [
          {
            question: "Hvad er 5×4?",
            options: ["12", "16", "20", "24"],
            answer: "20"
          },
          {
            question: "15÷3 er lig med?",
            options: ["3", "5", "8", "12"],
            answer: "5"
          },
          {
            question: "Hvad er 7+9?",
            options: ["14", "15", "16", "17"],
            answer: "16"
          },
          {
            question: "Hvilket regnestykke giver 12?",
            options: ["3+8", "9+3", "4+6", "5+5"],
            answer: "9+3"
          },
          {
            question: "18-9 er lig med?",
            options: ["6", "8", "9", "10"],
            answer: "9"
          }
        ];
    }
  } else {
    // English fallback questions based on difficulty
    switch (difficulty) {
      case 'easy':
        return [
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
            question: "What is 1+1?",
            options: ["0", "1", "2", "3"],
            answer: "2"
          },
          {
            question: "Which number is largest?",
            options: ["3", "5", "2", "1"],
            answer: "5"
          },
          {
            question: "How many is 3+1?",
            options: ["2", "3", "4", "5"],
            answer: "4"
          }
        ];
      case 'hard':
        return [
          {
            question: "What is 12×3?",
            options: ["24", "30", "36", "42"],
            answer: "36"
          },
          {
            question: "50÷5 equals?",
            options: ["5", "10", "15", "20"],
            answer: "10"
          },
          {
            question: "What is 24+39?",
            options: ["54", "63", "72", "81"],
            answer: "63"
          },
          {
            question: "If 2x+5=15, what is x?",
            options: ["3", "5", "7", "10"],
            answer: "5"
          },
          {
            question: "What is 3² + 4²?",
            options: ["9", "16", "25", "49"],
            answer: "25"
          }
        ];
      default: // medium
        return [
          {
            question: "What is 5×4?",
            options: ["12", "16", "20", "24"],
            answer: "20"
          },
          {
            question: "15÷3 equals?",
            options: ["3", "5", "8", "12"],
            answer: "5"
          },
          {
            question: "What is 7+9?",
            options: ["14", "15", "16", "17"],
            answer: "16"
          },
          {
            question: "Which equation equals 12?",
            options: ["3+8", "9+3", "4+6", "5+5"],
            answer: "9+3"
          },
          {
            question: "18-9 equals?",
            options: ["6", "8", "9", "10"],
            answer: "9"
          }
        ];
    }
  }
}

export const analyzeDrawing = async (payload: ImageAnalysisRequest): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const language = payload.language || getCurrentLanguage();
    
    // Define system message based on language
    let systemMessage = '';
    if (language === 'da') {
      systemMessage = 'Du er en hjælpsom matematiklærer. Analysér venligst dette billede af et matematisk problem, der er tegnet af et barn. Giv konstruktiv feedback på dansk om deres løsning.';
    } else {
      systemMessage = 'You are a helpful math teacher. Please analyze this image of a math problem drawn by a child. Provide constructive feedback in English about their solution.';
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: payload.prompt },
              {
                type: 'image_url',
                image_url: {
                  url: payload.imageData
                }
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        success: false,
        message: 'OpenAI API key not configured. Please set it in your environment variables.',
      });
    }

    const data = await response.json();
    return JSON.stringify({
      success: true,
      feedback: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error analyzing drawing:', error);
    return JSON.stringify({
      success: false,
      message: 'Failed to analyze drawing. Please check your OpenAI API key and try again.',
    });
  }
};

export const analyzeVoiceText = async (payload: VoiceAnalysisRequest): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const language = payload.language || getCurrentLanguage();
    
    // Define system message based on language
    let systemMessage = '';
    if (language === 'da') {
      systemMessage = 'Du er en hjælpsom matematiklærer. En elev har forklaret deres løsning på et matematisk problem gennem tale. Giv konstruktiv feedback på dansk om deres forklaring.';
    } else {
      systemMessage = 'You are a helpful math teacher. A student has explained their solution to a math problem through voice. Provide constructive feedback in English about their explanation.';
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: payload.prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        success: false,
        message: 'OpenAI API key not configured. Please set it in your environment variables.',
      });
    }

    const data = await response.json();
    return JSON.stringify({
      success: true,
      feedback: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error analyzing voice text:', error);
    return JSON.stringify({
      success: false,
      message: 'Failed to analyze voice text. Please check your OpenAI API key and try again.',
    });
  }
}; 