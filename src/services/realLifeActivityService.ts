import { v4 as uuidv4 } from 'uuid';
import { Activity, AIDrawingFeedback, ImageAnalysisRequest, VoiceAnalysisRequest, DifficultyLevel } from '@/types/realLifePractice';
import i18n from '@/i18n';

// Cache for storing information about which models are available/unavailable
// This helps avoid repeating failed requests to unavailable models
const modelAvailabilityCache: Record<string, { available: boolean, timestamp: number }> = {};

// Model preference order - will try in this order if previous models fail
const VISION_MODELS = ['gpt-4o', 'gpt-4'];
const TEXT_MODELS = ['gpt-3.5-turbo-0125', 'gpt-3.5-turbo'];

// Helper function to check if a model is known to be unavailable
function isModelAvailable(model: string): boolean {
  const cacheEntry = modelAvailabilityCache[model];
  
  // If no cache entry exists, assume model is available
  if (!cacheEntry) return true;
  
  // If cache entry is older than 1 hour, consider it expired
  const oneHourMs = 60 * 60 * 1000;
  if (Date.now() - cacheEntry.timestamp > oneHourMs) {
    delete modelAvailabilityCache[model];
    return true;
  }
  
  // Return cached availability
  return cacheEntry.available;
}

// Helper function to mark a model as available/unavailable
function updateModelAvailability(model: string, available: boolean): void {
  modelAvailabilityCache[model] = { 
    available, 
    timestamp: Date.now() 
  };
}

// Helper function to get the best available model for vision tasks
async function getBestAvailableModel(): Promise<string> {
  // Return the first model in our list that isn't known to be unavailable
  for (const model of VISION_MODELS) {
    if (isModelAvailable(model)) {
      return model;
    }
  }
  
  // If all models are known to be unavailable, reset cache and try again with the preferred model
  // This ensures we don't permanently lock ourselves out of all models
  for (const model of VISION_MODELS) {
    delete modelAvailabilityCache[model];
  }
  
  return VISION_MODELS[0];
}

// Helper function to get the OpenAI API key
function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return apiKey;
}

// Get current language from i18n
function getCurrentLanguage(): string {
  return i18n.language || 'en';
}

/**
 * Generates a math activity using the OpenAI API
 * @param childAge The age of the child
 * @param difficulty The difficulty level (easy, medium, hard)
 * @param mathConcept Optional specific math concept to focus on
 * @param theme Optional theme (minecraft, roblox, fortnite, default)
 * @returns A Promise resolving to an Activity object
 */
export const generateMathActivity = async (
  childAge: number, 
  difficulty: DifficultyLevel = 'medium',
  mathConcept?: string,
  theme?: string
): Promise<Activity> => {
  try {
    // Get the API key from environment variables
    const apiKey = getApiKey();
    
    // Get current language
    const language = getCurrentLanguage();
    
    // Enhance prompt with specific difficulty level guidance based on language
    const difficultyGuidance = language === 'da' ? {
      easy: "Hold aktiviteten enkel med grundlæggende koncepter, der passer til børn, som måske har svært ved matematik. Brug mindre tal og giv klare trin.",
      medium: "Skab en moderat udfordrende aktivitet, der anvender matematiske koncepter i en virkelig situation. Brug en sværhedsgrad, der passer til barnets alder.",
      hard: "Design en mere udfordrende aktivitet, der strækker barnets evner og opmuntrer til kritisk tænkning. Aktiviteten skal være kompleks, men stadig opnåelig."
    } : {
      easy: "Keep the activity simple with basic concepts appropriate for children who might be struggling with math. Use smaller numbers and provide clear steps.",
      medium: "Create a moderately challenging activity that applies math concepts in a real-world scenario. Use age-appropriate complexity.",
      hard: "Design a more challenging activity that stretches the child's abilities and encourages critical thinking. The activity should be complex but still achievable."
    };
    
    // Add theme-specific context if a theme is provided
    let themeContext = '';
    if (theme) {
      if (language === 'da') {
        switch (theme) {
          case 'minecraft':
            themeContext = 'Skab en aktivitet med Minecraft-tema. Inkluder elementer som blokke 🧱, minedrift ⛏️, crafting, bygning af strukturer eller eventyr i Minecraft-verdenen. Brug Minecraft-terminologi, genstande og koncepter i aktiviteten.';
            break;
          case 'roblox':
            themeContext = 'Skab en aktivitet med Roblox-tema. Inkorporer koncepter som spilgenstande, platforme, forhindringer, karakterer eller bygning og tilpasning af verdener fra Roblox-spil. Brug en sjov emoji, når du refererer til Roblox-genstande.';
            break;
          case 'fortnite':
            themeContext = 'Skab en aktivitet med Fortnite-tema. Inkluder elementer som bygning af strukturer 🏗️, indsamling af ressourcer eller planlægning af strategiske bevægelser. Brug Fortnite-terminologi, lokationer og spilkoncepter i aktiviteten.';
            break;
          default:
            themeContext = 'Skab en generel matematikaktivitet med hverdagsgenstande som legetøj 🧸, snacks 🍎 eller klodser 🧱, som børn kan relatere til.';
        }
      } else {
        switch (theme) {
          case 'minecraft':
            themeContext = 'Create an activity themed around Minecraft. Include elements like blocks 🧱, mining ⛏️, crafting, building structures, or adventures in the Minecraft world. Use Minecraft terminology, items, and concepts in the activity.';
            break;
          case 'roblox':
            themeContext = 'Create an activity themed around Roblox. Incorporate concepts like in-game items, platforms, obstacles, characters, or building and customizing worlds from Roblox games. Use one fun emoji when referring to Roblox items.';
            break;
          case 'fortnite':
            themeContext = 'Create an activity themed around Fortnite. Include elements like building structures 🏗️, gathering resources, or planning strategic movements. Use Fortnite terminology, locations, and game concepts in the activity.';
            break;
          default:
            themeContext = 'Create a general math activity using everyday objects like toys 🧸, snacks 🍎, or blocks 🧱 that children can relate to.';
        }
      }
    }

    const prompt = language === 'da' 
      ? `
Du er en venlig og legesyg matematiklærer for et ${childAge}-årigt barn.
Skab en kort, enkel matematikudfordring fra det virkelige liv med almindelige genstande (klodser 🧱, æbler 🍎, legetøj 🧸 osv.).
Brug kun små tal (1 til 10) og inkluder én sjov emoji, når du refererer til genstanden.
Hold sproget meget enkelt (maks. 2 korte sætninger pr. felt).
Undgå lange forklaringer eller instruktioner med flere trin.

${difficultyGuidance[difficulty]}
${mathConcept ? `Fokuser på det matematiske koncept: ${mathConcept}.` : ''}
${themeContext}

Aktiviteten skal præsenteres som et JSON-objekt med følgende struktur:
{
  "challenge": "En meget kort og klar beskrivelse af aktiviteten med én emoji (1-2 korte sætninger)",
  "goal": "Den specifikke matematiske færdighed med enkle ord (1 kort sætning)",
  "emoji": "Den enkelte emoji, der repræsenterer hovedgenstanden i aktiviteten",
  "variation": "En enkel måde at ændre aktiviteten let på (1 kort sætning)"
}

Retningslinjer for neurodivergent-venligt indhold:
- Brug instruktioner på én linje hvor det er muligt
- Inkluder én emoji for at understøtte visuel forståelse
- Undgå tidspres eller logik med flere trin
- Brug relaterbare kontekster som snacks, legetøj og tegning
`
      : `
You are a kind and playful math teacher for a ${childAge}-year-old child.
Create a short, simple real-life math challenge using common items (blocks 🧱, apples 🍎, toys 🧸, etc.).
Use small numbers only (1 to 10) and include one fun emoji when referring to the item.
Keep the language very simple (max 2 short sentences per field).
Avoid long explanations or multi-step instructions.

${difficultyGuidance[difficulty]}
${mathConcept ? `Focus on the math concept: ${mathConcept}.` : ''}
${themeContext}

The activity should be presented as a JSON object with the following structure:
{
  "challenge": "A very brief and clear description of the activity with one emoji (1-2 short sentences)",
  "goal": "The specific math skill in simple words (1 short sentence)",
  "emoji": "The single emoji that represents the main item in the activity",
  "variation": "A simple way to change the activity slightly (1 short sentence)"
}

Guidelines for neurodivergent-friendly content:
- Use one-line instructions where possible
- Include one emoji to support visual comprehension
- Avoid time pressure or multi-step logic
- Use relatable contexts like snacks, toys, and drawing
`;

    const systemPrompt = language === 'da'
      ? 'Du er en venlig matematiklærer for små børn. Skab enkle, klare aktiviteter med emojis, der er lette at forstå. SVAR ALTID PÅ DANSK.'
      : 'You are a friendly math teacher for young children. Create simple, clear activities with emojis that are easy to understand.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const activityText = data.choices[0]?.message?.content;
    
    if (!activityText) {
      throw new Error('No activity generated from the API');
    }

    // Extract the JSON object from the response
    const activityJson = extractJsonFromString(activityText);
    
    // Parse the response into an Activity object
    let activity: Activity = {
      id: `act-${Date.now()}`,
      ...activityJson
    };
    
    // Add the theme to the activity object
    if (theme) {
      activity.theme = theme;
    }
    
    return activity;
  } catch (error) {
    console.error('Error generating math activity:', error);
    throw error;
  }
};

// Helper function to safely call OpenAI vision API
async function callVisionAPI(base64Image: string, prompt: string, language?: string): Promise<any> {
  // Get API key from environment variables
  const apiKey = getApiKey();
  
  if (!base64Image) {
    throw new Error('Invalid image data provided');
  }
  
  console.log("Image data length:", base64Image.length);
  
  // Determine language to use
  const currentLanguage = language || getCurrentLanguage();
  
  // Add language instruction if Danish
  let enhancedPrompt = prompt;
  if (currentLanguage === 'da' && !prompt.includes('dansk')) {
    enhancedPrompt = `${prompt} Besvar venligst på dansk.`;
  }
  
  // First try with gpt-4o
  try {
    console.log("Trying Vision API with gpt-4o...");
    
    // Make sure the image data is valid
    let imageUrl;
    if (base64Image.startsWith('data:image/')) {
      // Already a data URL, use as is
      imageUrl = base64Image;
    } else {
      // Not a data URL, add prefix
      imageUrl = `data:image/png;base64,${base64Image}`;
    }
    
    console.log("Sending image URL to API (first 50 chars):", imageUrl.substring(0, 50) + "...");
    
    // Create system message based on language
    const systemMessage = currentLanguage === 'da'
      ? 'Du er en hjælpsom og venlig lærer, der analyserer billeder for at give feedback. Responder altid på dansk med klar og enkel sprog, der er passende for børn med neurodivergenser.'
      : 'You are a helpful and friendly teacher analyzing images to provide feedback. Always respond in clear, simple language appropriate for children with neurodivergence.';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
              { type: 'text', text: enhancedPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    // Log full response details for debugging
    console.log(`Vision API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Unknown API error';
      console.error("Error from OpenAI:", errorMessage);
      
      // If the API returns an error specifically about this model, mark it as unavailable and try fallback
      if (errorData.error?.code === 'model_not_available' || errorMessage.includes('not available')) {
        console.log(`Model gpt-4o unavailable, will try fallback. Error: ${errorMessage}`);
        updateModelAvailability('gpt-4o', false);
        throw new Error(`Model unavailable: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Vision API response success");
    
    // Mark this model as available since the request succeeded
    updateModelAvailability('gpt-4o', true);
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error with gpt-4o:`, error);
    
    // Try fallback to gpt-4
    if (isModelAvailable('gpt-4')) {
      try {
        console.log("Trying fallback to gpt-4...");
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: currentLanguage === 'da' 
                  ? 'Du er en hjælpsom lærer, der analyserer billeder. Svar på dansk.'
                  : 'You are a helpful teacher analyzing images.'
              },
              {
                role: 'user',
                content: [
                  { type: 'text', text: enhancedPrompt },
                  {
                    type: 'image_url',
                    image_url: {
                      url: base64Image.startsWith('data:image/')
                        ? base64Image
                        : `data:image/png;base64,${base64Image}`
                    }
                  }
                ]
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          updateModelAvailability('gpt-4', false);
          throw new Error(errorData.error?.message || 'Unknown API error');
        }
        
        const data = await response.json();
        updateModelAvailability('gpt-4', true);
        return data.choices[0].message.content;
      } catch (fallbackError) {
        console.error("Fallback to gpt-4 also failed:", fallbackError);
        throw new Error("All vision models unavailable. Please try again later.");
      }
    } else {
      throw new Error("No vision models available. Please try again later.");
    }
  }
}

/**
 * Analyzes an image using the OpenAI API
 * @param request The analysis request
 * @returns A Promise resolving to an AIDrawingFeedback object
 */
export async function analyzeImage(
  request: ImageAnalysisRequest
): Promise<AIDrawingFeedback> {
  try {
    const language = getCurrentLanguage();
    
    // Create the appropriate prompt based on language
    const prompt = language === 'da'
      ? `Jeg har taget et billede af et matematisk problem. Kan du venligst hjælpe mig ved at:
1. Forklare, hvad billedet viser
2. Identificere, hvilket matematisk koncept det handler om
3. Give trin-for-trin vejledning til at løse det (meget enkelt sprog)
4. Tilføje en opmuntrende bemærkning

Husk, dette er til et barn på omkring 8-12 år med neurodivergenser, så hold sproget enkelt og direkte. Brug korte, klare sætninger og undgå lange forklaringer.`
      : `I've taken a picture of a math problem. Can you please help me by:
1. Explaining what the image shows
2. Identifying which math concept it involves
3. Providing step-by-step guidance to solve it (very simple language)
4. Adding an encouraging note

Remember, this is for a child around 8-12 years old with neurodivergence, so keep the language simple and direct. Use short, clear sentences and avoid lengthy explanations.`;

    const result = await callVisionAPI(request.imageData, prompt, language);
    
    // Process the result and return a structured response
    const feedback: AIDrawingFeedback = {
      timestamp: new Date().toISOString(),
      feedback: result
    };
    
    return feedback;
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Return an error message based on language
    const language = getCurrentLanguage();
    
    return {
      timestamp: new Date().toISOString(),
      feedback: language === 'da'
        ? 'Beklager, jeg kunne ikke analysere billedet lige nu. Prøv venligst igen senere eller tjek din internetforbindelse.'
        : 'Sorry, I could not analyze the image right now. Please try again later or check your internet connection.'
    };
  }
}

/**
 * Analyzes voice text using the OpenAI API
 * @param request The analysis request
 * @returns A Promise resolving to an AIDrawingFeedback object
 */
export async function analyzeVoiceText(
  request: VoiceAnalysisRequest
): Promise<AIDrawingFeedback> {
  try {
    const apiKey = getApiKey();
    const language = getCurrentLanguage();
    
    // Create the appropriate system message based on language
    const systemPrompt = language === 'da'
      ? "Du er en venlig og opmuntrende matematiklærer for børn med indlæringsvanskeligheder. Du giver positiv og konstruktiv feedback på en måde, der er let at forstå. Brug enkle ord, korte sætninger og et positivt sprog. Svar kun på dansk."
      : "You are a friendly and encouraging math teacher for children with learning differences. You provide positive and constructive feedback in a way that's easy to understand. Use simple words, short sentences, and positive language.";
    
    // Look for the best available model for text tasks
    let model = 'gpt-4o';
    for (const modelOption of TEXT_MODELS) {
      if (isModelAvailable(modelOption)) {
        model = modelOption;
        break;
      }
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: language === 'da'
              ? `En elev har indtalt en forklaring på et matematisk problem. Her er transskriptionen: "${request.prompt}". Giv venlig og konstruktiv feedback (på dansk) der fremhæver styrker og foreslår forbedringer. Brug enkelt sprog og positive udtryk.`
              : `A student has recorded an explanation of a math problem. Here's the transcription: "${request.prompt}". Please provide kind and constructive feedback highlighting strengths and suggesting improvements. Use simple language and positive expressions.`
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const feedbackText = data.choices[0]?.message?.content;
    
    return {
      timestamp: new Date().toISOString(),
      feedback: feedbackText || (language === 'da' 
        ? 'Jeg kunne ikke generere feedback. Prøv igen senere.'
        : 'I could not generate feedback. Please try again later.')
    };
  } catch (error) {
    console.error('Error analyzing voice text:', error);
    
    const language = getCurrentLanguage();
    return {
      timestamp: new Date().toISOString(),
      feedback: language === 'da'
        ? 'Beklager, jeg kunne ikke analysere din lydforklaring. Kontroller din internetforbindelse og prøv igen.'
        : 'Sorry, I could not analyze your voice explanation. Check your internet connection and try again.'
    };
  }
}

/**
 * Analyzes a drawing related to a math activity
 * @param drawingDataUrl Base64 encoded drawing image
 * @param activity The activity the drawing is related to
 * @param childAge The age of the child
 * @returns A Promise resolving to an AIDrawingFeedback object
 */
export async function analyzeDrawing(
  drawingDataUrl: string,
  activity: Activity,
  childAge: number
): Promise<AIDrawingFeedback> {
  try {
    const language = getCurrentLanguage();
    
    // Create prompt based on language
    const prompt = language === 'da'
      ? `Dette er en tegning lavet af et ${childAge}-årigt barn som svar på denne matematikopgave: "${activity.challenge}"

Målet med aktiviteten var: "${activity.goal}"

Kan du analysere tegningen og give venlig og konstruktiv feedback? Fokuser på:
1. Hvad du ser på tegningen
2. Hvordan det relaterer til den matematiske aktivitet
3. Positive aspekter af barnets indsats
4. Foreslå en enkel måde at videreudvikle aktiviteten med tegningen

Husk, barnet kan have neurodivergenser, så hold feedback:
- Positiv og opmuntrende
- Kort og enkel (brug korte sætninger)
- Specifik og konkret
- Med fokus på barnets styrker og indsats

SVAR VENLIGST PÅ DANSK med enkelt sprog.`
      : `This is a drawing made by a ${childAge}-year-old child in response to this math activity: "${activity.challenge}"

The goal of the activity was: "${activity.goal}"

Can you analyze the drawing and provide friendly, constructive feedback? Focus on:
1. What you see in the drawing
2. How it relates to the math activity
3. Positive aspects of the child's effort
4. Suggest a simple way to extend the activity with the drawing

Remember, the child may have neurodivergence, so keep feedback:
- Positive and encouraging
- Short and simple (use short sentences)
- Specific and concrete
- Focused on the child's strengths and effort`;

    const result = await callVisionAPI(drawingDataUrl, prompt, language);
    
    return {
      timestamp: new Date().toISOString(),
      feedback: result
    };
  } catch (error) {
    console.error('Error analyzing drawing:', error);
    
    const language = getCurrentLanguage();
    
    return {
      timestamp: new Date().toISOString(),
      feedback: language === 'da'
        ? 'Beklager, jeg kunne ikke analysere tegningen lige nu. Prøv venligst igen senere eller tjek din internetforbindelse.'
        : 'Sorry, I could not analyze the drawing right now. Please try again later or check your internet connection.'
    };
  }
}

/**
 * Transcribes audio using the OpenAI Whisper API
 * @param audioBlob The audio blob to transcribe
 * @returns A Promise resolving to the transcribed text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const apiKey = getApiKey();
    const language = getCurrentLanguage();
    
    // Create form data with the audio file
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    
    // Specify language if Danish
    if (language === 'da') {
      formData.append('language', 'da');
    }
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Transcription API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    const language = getCurrentLanguage();
    return language === 'da'
      ? 'Kunne ikke transskribere lyd. Kontroller din internetforbindelse og prøv igen.'
      : 'Could not transcribe audio. Check your internet connection and try again.';
  }
}

/**
 * Extracts a specific field from a text
 */
function extractField(text: string, fieldName: string): string | null {
  const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 'i');
  const match = text.match(regex);
  return match ? match[1] : null;
}

/**
 * Extracts a JSON object from a string that might contain additional text
 */
function extractJsonFromString(text: string): { challenge: string, goal: string, emoji: string, variation: string } {
  let jsonStr = text;
  
  // If the text contains JSON-like content, extract it
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }
  
  try {
    // Try to parse as JSON
    const jsonData = JSON.parse(jsonStr);
    return {
      challenge: jsonData.challenge || '',
      goal: jsonData.goal || '',
      emoji: jsonData.emoji || '',
      variation: jsonData.variation || ''
    };
  } catch (e) {
    console.error('Error parsing JSON from string:', e);
    console.log('Attempting fallback extraction...');
    
    // Fallback to regex extraction if JSON parsing fails
    const language = getCurrentLanguage();
    
    return {
      challenge: extractField(text, 'challenge') || (language === 'da' ? 'Leg med matemagiske tal! 🔢' : 'Play with math-magical numbers! 🔢'),
      goal: extractField(text, 'goal') || (language === 'da' ? 'Lær at tælle og lægge tal sammen' : 'Learn to count and add numbers'),
      emoji: extractField(text, 'emoji') || '🔢',
      variation: extractField(text, 'variation') || (language === 'da' ? 'Prøv med større tal' : 'Try with bigger numbers')
    };
  }
} 