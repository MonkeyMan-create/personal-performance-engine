import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface WorkoutAnalysis {
  formFeedback: string;
  progressionSuggestions: string[];
  recoveryTips: string[];
  intensity: "low" | "moderate" | "high";
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Credentials', "true");
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workoutData } = request.body;

    if (!workoutData || !workoutData.exerciseName || !workoutData.sets) {
      return response.status(400).json({ error: 'Invalid workout data' });
    }

    const prompt = `Analyze this workout performance and provide coaching feedback:

Exercise: ${workoutData.exerciseName}
Today's Sets: ${JSON.stringify(workoutData.sets)}
${workoutData.previousPerformance ? `Previous Performance: ${JSON.stringify(workoutData.previousPerformance)}` : ''}

Provide analysis in JSON format with:
- formFeedback: specific form tips for this exercise
- progressionSuggestions: array of 2-3 progression strategies
- recoveryTips: array of 2-3 recovery recommendations
- intensity: "low", "moderate", or "high" based on RIR values

Focus on practical, actionable advice for gym performance.`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            formFeedback: { type: "string" },
            progressionSuggestions: {
              type: "array",
              items: { type: "string" }
            },
            recoveryTips: {
              type: "array",
              items: { type: "string" }
            },
            intensity: {
              type: "string",
              enum: ["low", "moderate", "high"]
            }
          },
          required: ["formFeedback", "progressionSuggestions", "recoveryTips", "intensity"]
        }
      }
    });

    const analysis: WorkoutAnalysis = JSON.parse(result.text || '{}');
    
    return response.status(200).json(analysis);
  } catch (error) {
    console.error('Error generating workout analysis:', error);
    return response.status(500).json({ error: 'Failed to generate workout analysis' });
  }
}