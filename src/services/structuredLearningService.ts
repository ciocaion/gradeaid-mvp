import { DifficultyLevel } from '@/types/ActivityTypes';
import i18n from '@/i18n';

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

// Types for structured learning content
export interface TaskBreakdown {
  title: string;
  steps: {
    number: number;
    instruction: string;
    hint?: string;
  }[];
  successCriteria: string[];
}

export interface StructuredExplanation {
  concept: string;
  steps: {
    number: number;
    title: string;
    content: string;
    example?: string;
    visualCue?: string;
  }[];
  checkForUnderstanding: string[];
}

export interface AdaptivePrompt {
  prompt: string;
  supportLevel: 'high' | 'medium' | 'low';
  visualSupport?: string; // Description of visual support like "Draw a picture" or "Use a number line"
  hint?: string;
}

export interface LearningFeedback {
  mainFeedback: string;
  learningTip: string;
  nextStep: string;
  supportLevel: 'high' | 'medium' | 'low';
  successPoints: string[];
  growthAreas?: string[];
}

/**
 * Generates a structured task breakdown with clear steps for completing an activity
 * Optimized for neurodivergent learners with explicit steps and success criteria
 */
export const generateTaskBreakdown = async (
  topic: string,
  difficulty: DifficultyLevel = 'medium',
  age: number = 8,
  preferenceTags: string[] = []
): Promise<TaskBreakdown> => {
  try {
    const apiKey = getApiKey();
    const language = getCurrentLanguage();
    
    const userPreferences = preferenceTags.length > 0 
      ? language === 'da'
        ? `Barnet har følgende præferencer: ${preferenceTags.join(', ')}.`
        : `The child has the following preferences: ${preferenceTags.join(', ')}.`
      : '';
    
    const prompt = language === 'da'
      ? `
Opret en struktureret opgavenedbrydning for et ${age}-årigt barn med indlæringsvanskeligheder, der lærer om ${topic}.
Dette er for sværhedsgrad: ${difficulty}.
${userPreferences}

Formater svaret som et JSON-objekt med følgende struktur:
{
  "title": "En klar, engagerende titel for opgaven, der inkluderer en emoji",
  "steps": [
    {
      "number": 1,
      "instruction": "Klar, konkret instruktion med én handling ved brug af simple ord",
      "hint": "Valgfrit tip der giver ekstra støtte"
    },
    {
      "number": 2,
      "instruction": "...",
      "hint": "..."
    }
    ...
  ],
  "successCriteria": [
    "Observerbar adfærd, der viser opgavens fuldførelse",
    "Klar indikation af, hvordan 'færdig' ser ud"
  ]
}

Retningslinjer:
- Opdel opgaven i 3-5 eksplicitte, sekventielle trin
- Hvert trin skal involvere ÉN konkret handling
- Brug enkelt, direkte sprog med 10 ord eller mindre per instruktion
- Inkluder et tip til trin, der kan være udfordrende
- Succeskriterier skal være observerbare og målbare
- Brug nutid og aktiv stemme
- Undgå abstrakte begreber eller metaforer
`
      : `
Create a structured task breakdown for a ${age}-year-old child with learning differences who is learning about ${topic}. 
This is for difficulty level: ${difficulty}.
${userPreferences}

Format the response as a JSON object with the following structure:
{
  "title": "A clear, engaging title for the task that includes an emoji",
  "steps": [
    {
      "number": 1,
      "instruction": "Clear, concrete, single-action instruction using simple words",
      "hint": "Optional hint that provides additional support"
    },
    {
      "number": 2,
      "instruction": "...",
      "hint": "..."
    }
    ...
  ],
  "successCriteria": [
    "Observable behavior that shows task completion",
    "Clear indication of what 'done' looks like"
  ]
}

Guidelines:
- Break the task into 3-5 explicit, sequential steps
- Each step should involve ONE concrete action
- Use simple, direct language with 10 words or less per instruction
- Include a hint for steps that might be challenging
- Success criteria should be observable and measurable
- Use present tense and active voice
- Avoid abstract concepts or metaphors
`;

    const systemContent = language === 'da'
      ? 'Du er ekspert i at skabe strukturerede læringsmaterialer for neurodivergente børn. Du skaber klare, eksplicitte instruktioner med visuel støtte og konkrete trin. Svar KUN på dansk.'
      : 'You are an expert in creating structured learning materials for neurodivergent children. You create clear, explicit instructions with visual supports and concrete steps.';

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
            content: systemContent
          },
          {
            role: 'user',
            content: prompt
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating task breakdown:', error);
    // Return fallback content if API fails
    const language = getCurrentLanguage();
    
    return language === 'da' 
      ? {
          title: `${topic} Opgave 📝`,
          steps: [
            {
              number: 1,
              instruction: "Læs instruktionerne omhyggeligt",
              hint: "Tag dig tid til at forstå, hvad du skal gøre"
            },
            {
              number: 2,
              instruction: "Saml dine materialer",
              hint: "Sørg for at du har alt, hvad du behøver"
            },
            {
              number: 3,
              instruction: "Følg hvert trin i rækkefølge",
              hint: "Afkryds trin, når du har gennemført dem"
            },
            {
              number: 4,
              instruction: "Bed om hjælp, hvis du har brug for det",
              hint: "Det er okay at have brug for assistance"
            }
          ],
          successCriteria: [
            "Du har gennemført alle trin",
            "Du forstår, hvad du har lært"
          ]
        }
      : {
          title: `${topic} Task 📝`,
          steps: [
            {
              number: 1,
              instruction: "Read the instructions carefully",
              hint: "Take your time to understand what to do"
            },
            {
              number: 2,
              instruction: "Gather your materials",
              hint: "Make sure you have everything you need"
            },
            {
              number: 3,
              instruction: "Follow each step in order",
              hint: "Check off steps as you complete them"
            },
            {
              number: 4,
              instruction: "Ask for help if needed",
              hint: "It's okay to need assistance"
            }
          ],
          successCriteria: [
            "You completed all the steps",
            "You understand what you learned"
          ]
        };
  }
};

/**
 * Generates a structured, step-by-step explanation of a concept
 * Designed for neurodivergent learners with visual cues and concrete examples
 */
export const generateStructuredExplanation = async (
  concept: string,
  age: number = 8,
  interestArea: string = ""
): Promise<StructuredExplanation> => {
  try {
    const apiKey = getApiKey();
    const language = getCurrentLanguage();
    
    const interestContext = interestArea 
      ? language === 'da'
        ? `Brug eksempler relateret til ${interestArea}, når det er muligt, da dette er et interesseområde for barnet.`
        : `Use examples related to ${interestArea} when possible, as this is an interest area for the child.`
      : '';
    
    const prompt = language === 'da'
      ? `
Opret en struktureret forklaring af "${concept}" til et ${age}-årigt barn med indlæringsvanskeligheder.
${interestContext}

Formater svaret som et JSON-objekt med følgende struktur:
{
  "concept": "Hovedkonceptet, der forklares, med en venlig emoji",
  "steps": [
    {
      "number": 1,
      "title": "Kort, klar titel for dette trin/del af forklaringen",
      "content": "Enkel forklaring med konkret sprog",
      "example": "Et eksempel fra den virkelige verden, som barnet kan relatere til",
      "visualCue": "Kort beskrivelse af en tegning eller et visuelt hjælpemiddel"
    },
    {
      "number": 2,
      "title": "...",
      "content": "...",
      "example": "...",
      "visualCue": "..."
    }
    ...
  ],
  "checkForUnderstanding": [
    "Enkelt spørgsmål til at verificere forståelse",
    "Aktivitet eller prompt til at demonstrere forståelse"
  ]
}

Retningslinjer:
- Opdel forklaringen i 3-4 sekventielle, logiske trin
- Hvert trin skal fokusere på KUN ÉN idé
- Brug konkret sprog med korte sætninger (max 10-12 ord)
- Eksempler skal være håndgribelige situationer fra den virkelige verden
- Visuelle hjælpemidler skal være simple tegninger, som barnet kunne forestille sig
- Undgå abstrakte begreber, metaforer eller kompleks terminologi
- Inkluder 2-3 tjek-for-forståelse spørgsmål/aktiviteter
`
      : `
Create a structured explanation of "${concept}" for a ${age}-year-old child with learning differences.
${interestContext}

Format the response as a JSON object with the following structure:
{
  "concept": "The main concept being explained with a friendly emoji",
  "steps": [
    {
      "number": 1,
      "title": "Short, clear title for this step/part of the explanation",
      "content": "Simple explanation using concrete language",
      "example": "A real-world example the child can relate to",
      "visualCue": "Brief description of a drawing or visual that would help"
    },
    {
      "number": 2,
      "title": "...",
      "content": "...",
      "example": "...",
      "visualCue": "..."
    }
    ...
  ],
  "checkForUnderstanding": [
    "Simple question to verify understanding",
    "Activity or prompt to demonstrate comprehension"
  ]
}

Guidelines:
- Break the explanation into 3-4 sequential, logical steps
- Each step should focus on ONE idea only
- Use concrete language with short sentences (max 10-12 words)
- Examples must be tangible, real-world situations
- Visual cues should be simple drawings the child could imagine
- Avoid abstract concepts, metaphors, or complex terminology
- Include 2-3 check-for-understanding questions/activities
`;

    const systemContent = language === 'da'
      ? 'Du er ekspert i at skabe klare forklaringer for neurodivergente børn. Du opdeler koncepter i konkrete trin med visuel støtte og eksempler fra den virkelige verden. Svar KUN på dansk.'
      : 'You are an expert in creating clear explanations for neurodivergent children. You break concepts into concrete steps with visual supports and real-world examples.';

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
            content: systemContent
          },
          {
            role: 'user',
            content: prompt
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating structured explanation:', error);
    // Return fallback content if API fails
    const language = getCurrentLanguage();
    
    return language === 'da'
      ? {
          concept: `${concept} 📚`,
          steps: [
            {
              number: 1,
              title: "Hvad det er",
              content: "Dette er en grundlæggende introduktion til konceptet.",
              example: "Det er ligesom når du skal lære nye regler i et spil.",
              visualCue: "Tegn en simpel cirkel med ordet i midten."
            },
            {
              number: 2,
              title: "Hvordan det virker",
              content: "Dette er sådan konceptet fungerer i praksis.",
              example: "Det er ligesom at følge en opskrift trin for trin.",
              visualCue: "Tegn pile fra et trin til det næste."
            },
            {
              number: 3,
              title: "Hvorfor det er vigtigt",
              content: "Dette er hvorfor vi har brug for at lære dette.",
              example: "Det hjælper dig med at forstå ting omkring dig hver dag.",
              visualCue: "Tegn en stjerne ved siden af et eksempel fra hverdagen."
            }
          ],
          checkForUnderstanding: [
            "Kan du forklare konceptet med dine egne ord?",
            "Kan du tegne et billede, der viser, hvordan dette fungerer?"
          ]
        }
      : {
          concept: `${concept} 📚`,
          steps: [
            {
              number: 1,
              title: "What it is",
              content: "This is a basic introduction to the concept.",
              example: "It's like when you learn new rules for a game.",
              visualCue: "Draw a simple circle with the word in the middle."
            },
            {
              number: 2,
              title: "How it works",
              content: "This is how the concept works in practice.",
              example: "It's like following a recipe step by step.",
              visualCue: "Draw arrows from one step to the next."
            },
            {
              number: 3,
              title: "Why it matters",
              content: "This is why we need to learn this.",
              example: "It helps you understand things around you every day.",
              visualCue: "Draw a star next to an everyday example."
            }
          ],
          checkForUnderstanding: [
            "Can you explain the concept in your own words?",
            "Can you draw a picture showing how this works?"
          ]
        };
  }
};

/**
 * Generates a set of adaptive prompts with varying levels of support
 * Provides scaffolded prompts for different levels of independence
 */
export const generateAdaptivePrompts = async (
  concept: string,
  difficulty: DifficultyLevel = 'medium',
  age: number = 8
): Promise<AdaptivePrompt[]> => {
  try {
    const apiKey = getApiKey();
    const language = getCurrentLanguage();
    
    const prompt = language === 'da'
      ? `
Opret et sæt af tre adaptive opgaveprompts for et ${age}-årigt barn med indlæringsvanskeligheder, der lærer om ${concept}.
Disse opgaver skal være på sværhedsgraden "${difficulty}".

Opret tre forskellige prompts med varierende støtteniveauer:
1. "high" - For børn, der har brug for betydelig støtte og vejledning
2. "medium" - For børn, der kan arbejde med moderate støtteniveauer
3. "low" - For børn, der er klar til mere selvstændigt arbejde

Formater svaret som et JSON-array med følgende struktur:
[
  {
    "prompt": "Den faktiske opgaveprompt skrevet direkte til barnet",
    "supportLevel": "high/medium/low",
    "visualSupport": "Beskrivelse af visuelt hjælpemiddel, der kan hjælpe (valgfri)",
    "hint": "Et hjælpsomt tip, hvis barnet har brug for ekstra vejledning (valgfri)"
  },
  {...},
  {...}
]

Retningslinjer:
- "high" støtteniveau skal bryde konceptet ned i meget små, konkrete trin
- "medium" støtteniveau giver nogen vejledning, men færre eksplicitte trin
- "low" støtteniveau giver minimal vejledning til at fremme selvstændighed
- Alle prompts skal bruge konkret, direkte sprog med korte sætninger
- Inkluder visuel støtte, når det er muligt (tegninger, figurer, skemaer osv.)
- Tilføj valgfri tips til at adressere almindelige udfordringer
- Hold prompts på højst 2-3 sætninger for hver støtteniveau
`
      : `
Create a set of three adaptive task prompts for a ${age}-year-old child with learning differences who is learning about ${concept}.
These tasks should be at the "${difficulty}" difficulty level.

Create three different prompts with varying levels of support:
1. "high" - For children who need significant support and guidance
2. "medium" - For children who can work with moderate support levels
3. "low" - For children who are ready for more independent work

Format the response as a JSON array with the following structure:
[
  {
    "prompt": "The actual task prompt written directly to the child",
    "supportLevel": "high/medium/low",
    "visualSupport": "Description of visual aid that could help (optional)",
    "hint": "A helpful tip if the child needs extra guidance (optional)"
  },
  {...},
  {...}
]

Guidelines:
- "high" support level should break the concept down into very small, concrete steps
- "medium" support level provides some guidance but fewer explicit steps
- "low" support level provides minimal guidance to promote independence
- All prompts should use concrete, direct language with short sentences
- Include visual support when possible (drawings, figures, charts, etc.)
- Add optional hints to address common challenges
- Keep prompts to a maximum of 2-3 sentences for each support level
`;

    const systemContent = language === 'da'
      ? 'Du er ekspert i at skabe differentierede læringsaktiviteter for neurodivergente børn. Du skaber opgaver med varierende støtteniveauer, der tilgodeser forskellige læringsbehov. Svar KUN på dansk.'
      : 'You are an expert in creating differentiated learning activities for neurodivergent children. You create tasks with varying support levels that accommodate different learning needs.';

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
            content: systemContent
          },
          {
            role: 'user',
            content: prompt
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating adaptive prompts:', error);
    // Return fallback content if API fails
    const language = getCurrentLanguage();
    
    return language === 'da'
      ? [
          {
            prompt: `Lad os øve os på ${concept} sammen. Følg disse trin et ad gangen.`,
            supportLevel: 'high',
            visualSupport: 'Tegn en simpel tegning, der viser hvert trin af processen.',
            hint: 'Start med at se på eksemplet vi lavede sammen.'
          },
          {
            prompt: `Prøv at bruge hvad du har lært om ${concept}. Du kan se på dine noter.`,
            supportLevel: 'medium',
            visualSupport: 'Brug et diagram til at organisere dine ideer først.',
            hint: 'Tænk på et lignende eksempel, vi har arbejdet med.'
          },
          {
            prompt: `Vis din forståelse af ${concept} på din egen måde.`,
            supportLevel: 'low',
            visualSupport: 'Du kan vælge at inkludere en tegning eller et diagram.',
            hint: 'Forbind dette med noget, du allerede ved.'
          }
        ]
      : [
          {
            prompt: `Let's practice ${concept} together. Follow these steps one at a time.`,
            supportLevel: 'high',
            visualSupport: 'Draw a simple picture showing each step of the process.',
            hint: 'Start by looking at the example we did together.'
          },
          {
            prompt: `Try using what you've learned about ${concept}. You can look at your notes.`,
            supportLevel: 'medium',
            visualSupport: 'Use a diagram to organize your ideas first.',
            hint: 'Think about a similar example we worked on.'
          },
          {
            prompt: `Show your understanding of ${concept} in your own way.`,
            supportLevel: 'low',
            visualSupport: 'You may choose to include a drawing or diagram.',
            hint: 'Connect this to something you already know.'
          }
        ];
  }
};

/**
 * Generates personalized feedback for a student's work
 * Focuses on strengths first, then areas for growth
 */
export const generateLearningFeedback = async (
  studentWork: string,
  activityGoal: string,
  age: number = 8
): Promise<LearningFeedback> => {
  try {
    const apiKey = getApiKey();
    const language = getCurrentLanguage();
    
    const prompt = language === 'da'
      ? `
Generer konstruktiv, styrkefokuseret feedback til et ${age}-årigt barn med neurodivergenser baseret på deres arbejde.

Barnets arbejde: "${studentWork}"

Målet med aktiviteten var: "${activityGoal}"

Formater svaret som et JSON-objekt med følgende struktur:
{
  "mainFeedback": "Primære positiv feedback på barnets indsats (2-3 korte, enkle sætninger)",
  "learningTip": "En specifik, handlingsorienteret vejledning til forbedring (1 kort sætning)",
  "nextStep": "En konkret næste handling for barnet at tage (1 kort sætning)",
  "supportLevel": "high/medium/low",
  "successPoints": ["Specifik styrke 1", "Specifik styrke 2", "Specifik styrke 3"],
  "growthAreas": ["Vækstområde 1", "Vækstområde 2"]
}

Retningslinjer:
- Begynd med SPECIFIK positiv feedback om hvad barnet gjorde godt (styrker først)
- Hold alt sprog enkelt, konkret og direkte (max 10-12 ord pr. sætning)
- "successPoints" skal være 2-3 specifikke styrker i barnets arbejde
- "growthAreas" er valgfrie og skal kun inkluderes, hvis de er nødvendige (max 2)
- Gør næste trin meget konkret og handlingsorienteret
- Vurder det passende støtteniveau (high/medium/low) baseret på barnets arbejde
- Brug positivt, opmuntrende sprog og undgå negativ terminologi
- Inkluder mindst én emoji i mainFeedback
`
      : `
Generate constructive, strength-focused feedback for a ${age}-year-old child with neurodivergence based on their work.

Child's work: "${studentWork}"

The goal of the activity was: "${activityGoal}"

Format the response as a JSON object with the following structure:
{
  "mainFeedback": "Primary positive feedback on the child's effort (2-3 short, simple sentences)",
  "learningTip": "A specific, actionable guidance for improvement (1 short sentence)",
  "nextStep": "A concrete next action for the child to take (1 short sentence)",
  "supportLevel": "high/medium/low",
  "successPoints": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "growthAreas": ["Growth area 1", "Growth area 2"]
}

Guidelines:
- Start with SPECIFIC positive feedback about what the child did well (strengths first)
- Keep all language simple, concrete, and direct (max 10-12 words per sentence)
- "successPoints" should be 2-3 specific strengths in the child's work
- "growthAreas" are optional and should only be included if necessary (max 2)
- Make the next step very concrete and actionable
- Assess the appropriate support level (high/medium/low) based on the child's work
- Use positive, encouraging language and avoid negative terminology
- Include at least one emoji in the mainFeedback
`;

    const systemContent = language === 'da'
      ? 'Du er en støttende og opmuntrende læringsassistent for børn med neurodivergenser. Du giver positiv, konstruktiv feedback, der fokuserer på styrker først og derefter tilbyder konkrete næste trin. Svar KUN på dansk.'
      : 'You are a supportive and encouraging learning assistant for children with neurodivergence. You provide positive, constructive feedback that focuses on strengths first and then offers concrete next steps.';

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
            content: systemContent
          },
          {
            role: 'user',
            content: prompt
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating learning feedback:', error);
    // Return fallback content if API fails
    const language = getCurrentLanguage();
    
    return language === 'da'
      ? {
          mainFeedback: "Godt arbejde! 🌟 Du gjorde en god indsats og viste rigtig god tænkning.",
          learningTip: "Prøv at tilføje flere detaljer til din forklaring.",
          nextStep: "Prøv at lave et eksempel mere med en anden metode.",
          supportLevel: "medium",
          successPoints: [
            "Du demonstrerede god forståelse af konceptet",
            "Du følger instruktionerne omhyggeligt",
            "Du afsluttede opgaven selvstændigt"
          ],
          growthAreas: [
            "Inkluder flere detaljer i dine svar",
            "Prøv forskellige metoder til at løse problemer"
          ]
        }
      : {
          mainFeedback: "Great work! 🌟 You made a good effort and showed really good thinking.",
          learningTip: "Try adding more details to your explanation.",
          nextStep: "Try creating one more example using a different method.",
          supportLevel: "medium",
          successPoints: [
            "You demonstrated good understanding of the concept",
            "You followed the instructions carefully",
            "You completed the task independently"
          ],
          growthAreas: [
            "Include more details in your answers",
            "Try different methods to solve problems"
          ]
        };
  }
};

// Helper function to generate demo content when API is unavailable
export const getDemoTaskBreakdown = (topic: string): TaskBreakdown => {
  return {
    title: `${topic} Task 📝`,
    steps: [
      {
        number: 1,
        instruction: "Read the problem carefully",
        hint: "Look for important numbers and what the question is asking"
      },
      {
        number: 2,
        instruction: "Draw a picture to help you understand",
        hint: "Simple drawings can make math problems easier to solve"
      },
      {
        number: 3,
        instruction: "Write down the math equation",
        hint: "Which operation do you need? Addition? Subtraction?"
      },
      {
        number: 4,
        instruction: "Solve the problem step by step",
        hint: "Take your time and work carefully"
      },
      {
        number: 5,
        instruction: "Check your answer",
        hint: "Does your answer make sense for the problem?"
      }
    ],
    successCriteria: [
      "Your answer matches what the problem is asking for",
      "You can explain how you solved the problem",
      "You checked your work for mistakes"
    ]
  };
}; 