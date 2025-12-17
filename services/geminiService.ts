import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlatformId, ToneSettings, GeneratedContentResponse as AppGeneratedContentResponse, VoiceProfile, ViralAnalysis, ContentDNAReport, AudiencePersona, IdeaMatrix, TrendReport, TrendIdea } from "../types";

const GEMINI_MODEL = "gemini-2.5-flash";
const ANALYSIS_MODEL = "gemini-3-pro-preview";

// Helper for exponential backoff
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error.status === 429 || error.code === 429 || error.message?.includes('429') || error.message?.includes('quota');
    
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await wait(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const analyzeVoiceStyle = async (sampleText: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
        You are an expert linguistic analyst. 
        Analyze the provided text samples to determine the author's unique writing voice.
        Focus on:
        1. Sentence structure (short/punchy vs long/flowing)
        2. Tone (formal, casual, witty, serious, aggressive, empathetic)
        3. Vocabulary choice (simple, academic, slang, industry jargon)
        4. Recurring patterns (starts with questions, uses bullet points, specific transition words)
        
        Output a concise description (max 60 words) starting with "Voice Style: ..." that can be used as an instruction for an AI to mimic this style.
    `;

    try {
        const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: ANALYSIS_MODEL,
            contents: sampleText,
            config: {
                systemInstruction: systemInstruction,
            }
        }));

        return response.text || "Could not analyze voice style.";
    } catch (error) {
        console.error("Voice Analysis Error:", error);
        throw new Error("Failed to analyze voice. Please try again later.");
    }
};

export const generateContentDNAReport = async (contentHistory: string): Promise<ContentDNAReport> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are a forensic content analyst. Your job is to perform a "DNA Test" on the provided content history.
    
    Analyze the writing style, themes, and patterns to generate a strategic report card.
    Identify:
    1. The Creator Archetype (e.g., The Teacher, The Entertainer, The Contrarian, The Storyteller).
    2. A distinct Voice Fingerprint description.
    3. Key Strengths (what makes this writing good).
    4. Blind Spots (what is missing or weak).
    5. A Growth Roadmap (3 specific actions to improve).

    Return ONLY JSON matching the schema.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: contentHistory,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            voiceFingerprint: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["archetype", "voiceFingerprint", "strengths", "blindSpots", "growthRoadmap"]
        }
      }
    }));

    if (!response.text) throw new Error("No report generated");
    return JSON.parse(response.text) as ContentDNAReport;
  } catch (error) {
    console.error("DNA Report Error:", error);
    throw new Error("Failed to generate Content DNA Report. Please try again later.");
  }
};

export const generateAudiencePersona = async (description: string): Promise<AudiencePersona> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an expert audience profiler. 
    Based on the user's rough description of their target audience, create a specific "Ghost Persona" - a fictional character that represents their ideal reader.
    
    Give them a name, a role, specific deep fears/pain points, specific desires, and a psychological description.
    This persona will be used to target content specifically to them.
    
    Return ONLY JSON.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: description,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING }, // Just generate a random string ID
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            desires: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING }
          },
          required: ["name", "role", "painPoints", "desires", "description"]
        }
      }
    }));

    if (!response.text) throw new Error("No persona generated");
    const result = JSON.parse(response.text) as AudiencePersona;
    result.id = Date.now().toString(); // Ensure ID exists
    return result;
  } catch (error) {
    console.error("Persona Error:", error);
    throw new Error("Failed to generate Audience Persona. Please try again later.");
  }
};

export const compoundIdea = async (topic: string): Promise<IdeaMatrix> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an "Idea Compounder". Your goal is to take a single topic and explode it into distinct, usable content angles.
    
    For the topic provided, generate 20 unique content ideas across different angles:
    - Contrarian/Polarizing
    - Actionable/How-To
    - Personal Story/Vulnerability
    - Data/Analytical
    - Future Prediction
    
    Return a list of content snippets (headlines or one-liners) for these angles.
    
    Return ONLY JSON.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: topic,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  angle: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["angle", "content"]
              }
            }
          },
          required: ["topic", "results"]
        }
      }
    }));

    if (!response.text) throw new Error("No ideas generated");
    const result = JSON.parse(response.text) as IdeaMatrix;
    result.topic = topic;
    return result;
  } catch (error) {
    console.error("Compounding Error:", error);
    throw new Error("Failed to compound idea. Please try again later.");
  }
};

export const generateTrendIdeas = async (niche: string): Promise<TrendReport> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are a trend hunter and content strategist. 
    Your goal is to search for the latest news, events, and viral discussions in the user's provided NICHE.
    
    1.  Perform a Google Search to find what is happening RIGHT NOW in this niche.
    2.  Identify 3 distinct "content angles" based on these real-time events.
        - Angle 1: A "Hot Take" or Contrarian view on a recent event.
        - Angle 2: An "Educational" or "How-To" angle related to a current problem.
        - Angle 3: A "Future Prediction" based on a new development.
    3.  Format your response strictly as a JSON object.
    
    The JSON structure must be:
    {
      "niche": "${niche}",
      "trends": [
        { "headline": "Catchy Headline", "description": "Short explanation of the trend/news.", "angle": "Hot Take" },
        ...
      ]
    }
    
    Do not use markdown formatting like \`\`\`json. Just return the valid JSON string.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: ANALYSIS_MODEL, // Using 3.0 Pro for better search reasoning
      contents: `Find trends for: ${niche}`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding
      }
    }));

    if (!response.text) throw new Error("No trends found");

    // Clean up potential markdown formatting if the model adds it
    let cleanText = response.text.trim();
    if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const report = JSON.parse(cleanText) as TrendReport;
    
    // Extract sources from grounding metadata
    const sources: { title: string; url: string }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                sources.push({ title: chunk.web.title, url: chunk.web.uri });
            }
        });
    }
    
    // De-duplicate sources
    report.sources = sources.filter((v,i,a)=>a.findIndex(t=>(t.url===v.url))===i).slice(0, 5);
    
    return report;

  } catch (error) {
    console.error("Trend Hunter Error:", error);
    throw new Error("Failed to hunt trends. Please try again later.");
  }
};

export const reverseEngineerViralPost = async (viralText: string): Promise<ViralAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are a viral content scientist. Your job is to deconstruct why a specific piece of content went viral.
    
    Analyze the provided text and extract:
    1. The type of hook used (e.g., Contrarian, Story, Statistic, Negative Visualization).
    2. The psychological triggers (e.g., FOMO, Status, Curiosity, Anger).
    3. The structural template - convert the specific content into a reusable mad-libs style template.
    4. A quick example of how to repurpose this template for a different niche (e.g., if input is fitness, output example for business).

    Return ONLY JSON.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: ANALYSIS_MODEL,
        contents: viralText,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    originalText: { type: Type.STRING },
                    hookType: { type: Type.STRING },
                    psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    structureTemplate: { type: Type.STRING },
                    repurposedExample: { type: Type.STRING },
                },
                required: ["hookType", "psychologicalTriggers", "structureTemplate", "repurposedExample"]
            }
        }
    }));
    
    if (!response.text) throw new Error("No analysis returned");
    const result = JSON.parse(response.text) as ViralAnalysis;
    result.originalText = viralText;
    return result;
  } catch (error) {
      console.error(error);
      throw new Error("Failed to analyze viral post. Please try again later.");
  }
};

export const generatePlatformContent = async (
  sourceText: string,
  platformIds: PlatformId[],
  toneSettings: ToneSettings,
  voiceProfile?: VoiceProfile,
  surpriseMode?: boolean,
  audiencePersona?: AudiencePersona
): Promise<AppGeneratedContentResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Map comprehension level to descriptive text
  const getComprehensionDesc = (level: number) => {
    if (level < 25) return "Very Simple (6th Grade Level) - Use simple words, short sentences, avoid jargon. Explain everything simply.";
    if (level < 50) return "General Public (High School Level) - Clear, accessible, standard vocabulary. Easy to read.";
    if (level < 75) return "Professional (College Level) - Sophisticated, industry terms allowed, nuanced but clear.";
    return "Expert (PhD/Masters Level) - Complex sentence structures, advanced vocabulary, deep technical analysis, assumes high prior knowledge.";
  };

  const comprehensionDesc = getComprehensionDesc(toneSettings.comprehensionLevel);

  // Construct the prompt based on selections
  const platformsPromptPart = platformIds.map((id) => {
    switch (id) {
      case PlatformId.TWITTER:
        return "- Twitter/X: Create a thread. First tweet must be a strong hook. Number the tweets (e.g., 1/5). Keep under 280 chars per tweet.";
      case PlatformId.LINKEDIN:
        return "- LinkedIn: Professional but personal tone. Short paragraphs (1-2 sentences) for readability. Strong opening hook. Call to action at the end.";
      case PlatformId.INSTAGRAM:
        return "- Instagram: engaging caption. Include a mix of relevant hashtags at the bottom. Suggest a visual idea if applicable.";
      case PlatformId.TIKTOK:
        return "- TikTok: A script format. Columns: [Time] | [Visual/Action] | [Audio/Speech]. Include 'On-screen text' suggestions.";
      case PlatformId.YOUTUBE_SHORTS:
        return "- YouTube Shorts: Fast-paced video script structure. Duration target: under 60s.";
      case PlatformId.FACEBOOK:
        return "- Facebook: Community-focused, conversational post. Encourage comments/sharing.";
      case PlatformId.EMAIL:
        return "- Email: Subject line + Body snippet. Focus on getting the click-through.";
      case PlatformId.QUOTES:
        return "- Quotes: Extract 3-5 punchy, stand-alone quotes from the content suitable for image overlays.";
      default:
        return `- ${id}: Standard social media post format.`;
    }
  }).join("\n");

  const surpriseInstructions = surpriseMode 
    ? `
      SURPRISE ME MODE ACTIVATED:
      Ignore the standard tone settings.
      Instead, randomly select one of the following high-performing creative personas and rewrite the content entirely in that style:
      1. The "Ruthless Contrarian" (Challenge the status quo, be polarizing)
      2. The "Street-Smart Poet" (Use rhythm, rhyme, and clever wordplay)
      3. The "Gen Z Intern" (Heavy slang, lowercase, effortless vibe)
      4. The "Data Scientist" (Focus purely on logic, numbers, and facts)
      5. The "Motivational Speaker" (High energy, inspiration, call to greatness)
      
      Explicitly state which persona you chose in the content output (e.g., "STYLE: RUTHLESS CONTRARIAN").
    ` 
    : `
      TONE SETTINGS:
      - Formality (0-100): ${toneSettings.formality}
      - Emoji Usage (0-100): ${toneSettings.emojiUsage}
      - Humor (0-100): ${toneSettings.humor}
      - Perspective: ${toneSettings.perspective} person
    `;

  const systemInstruction = `
    You are an expert social media strategist and copywriter.
    Your task is to repurpose the user's provided SOURCE CONTENT into optimized posts for specific platforms.
    
    ${audiencePersona ? `
    CRITICAL - GHOST AUDIENCE TARGETING:
    You are writing specifically for this persona:
    Name: ${audiencePersona.name}
    Role: ${audiencePersona.role}
    Pain Points: ${audiencePersona.painPoints.join(", ")}
    Desires: ${audiencePersona.desires.join(", ")}
    
    Speak directly to their fears and dreams. Use language that resonates with them.
    ` : ''}

    ${voiceProfile && !surpriseMode ? `
    CRITICAL - VOICE CLONING ACTIVE:
    You must strictly emulate the following voice style:
    "${voiceProfile.description}"
    Write EXACTLY as this person would write. Match their rhythm, vocabulary, and sentence structure.
    ` : ''}
    
    ${surpriseInstructions}
    
    COMPREHENSION LEVEL:
    - Level (0-100): ${toneSettings.comprehensionLevel}
    - Instruction: ${comprehensionDesc}

    PLATFORM REQUIREMENTS:
    ${platformsPromptPart}

    SCORING INSTRUCTION:
    For each generated result, you must act as a harsh critic and provide scores (0-100):
    - Hook Score: How curiosity-inducing and scroll-stopping is the first line?
    - Virality Score: How likely is this to get shared based on emotional triggers?
    - Total Score: An average of quality and potential.
    - Reasoning: A 1-sentence explanation of why you gave this score.
    
    QUOTABLES INSTRUCTION:
    Identify 2-4 stand-alone "one-liners" from the generated content.
    These must be punchy, impactful sentences (max 150 chars) that would look great on a quote graphic (Instagram/LinkedIn/Twitter image).
    
    CRITICAL INSTRUCTION:
    Return the response as a valid JSON object strictly matching the schema provided.
    Ensure 'content' strings properly preserve newlines (use \\n) for formatting.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: sourceText,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platformId: { type: Type.STRING },
                  content: { type: Type.STRING },
                  scores: {
                      type: Type.OBJECT,
                      properties: {
                          hook: { type: Type.NUMBER },
                          virality: { type: Type.NUMBER },
                          total: { type: Type.NUMBER },
                          reasoning: { type: Type.STRING }
                      },
                      required: ["hook", "virality", "total", "reasoning"]
                  }
                },
                required: ["platformId", "content", "scores"],
              },
            },
            quotables: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
          },
          required: ["results", "quotables"],
        },
      },
    }));

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsedData = JSON.parse(text) as AppGeneratedContentResponse;
    return parsedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please try again later.");
  }
};