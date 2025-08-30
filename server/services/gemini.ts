import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenerativeAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" })

export interface WorkoutAnalysis {
  formFeedback: string;
  progressionSuggestions: string[];
  recoveryTips: string[];
  intensity: "low" | "moderate" | "high";
}

export interface NutritionAdvice {
  recommendations: string[];
  mealSuggestions: string[];
  macroAdjustments: string;
  hydrationTips: string;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: number;
  servings: number;
}

export async function generateWorkoutAnalysis(
  workoutData: {
    exerciseName: string;
    sets: Array<{ weight: number; reps: number; rir: number }>;
    previousPerformance?: Array<{ weight: number; reps: number; date: string }>;
  }
): Promise<WorkoutAnalysis> {
  try {
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

    const response = result.text;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating workout analysis:', error);
    throw new Error('Failed to generate workout analysis');
  }
}

export async function generateNutritionAdvice(
  nutritionData: {
    currentMacros: { calories: number; protein: number; carbs: number; fat: number };
    goals: { calories: number; protein: number; carbs: number; fat: number };
    fitnessGoal: string;
    activityLevel: string;
  }
): Promise<NutritionAdvice> {
  try {
    const prompt = `Provide nutrition coaching based on this data:

Current Intake: ${JSON.stringify(nutritionData.currentMacros)}
Target Goals: ${JSON.stringify(nutritionData.goals)}
Fitness Goal: ${nutritionData.fitnessGoal}
Activity Level: ${nutritionData.activityLevel}

Provide advice in JSON format with:
- recommendations: array of 3-4 specific nutrition tips
- mealSuggestions: array of 3-4 meal ideas that fit their goals
- macroAdjustments: specific advice on macro distribution
- hydrationTips: hydration recommendations

Focus on practical, evidence-based nutrition advice.`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            mealSuggestions: {
              type: "array",
              items: { type: "string" }
            },
            macroAdjustments: { type: "string" },
            hydrationTips: { type: "string" }
          },
          required: ["recommendations", "mealSuggestions", "macroAdjustments", "hydrationTips"]
        }
      }
    });

    const response = result.text;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating nutrition advice:', error);
    throw new Error('Failed to generate nutrition advice');
  }
}

export async function generateHighProteinRecipe(
  preferences: {
    dietaryRestrictions?: string[];
    proteinTarget: number;
    mealType: string;
    cookingTime?: number;
  }
): Promise<Recipe> {
  try {
    const prompt = `Create a high-protein recipe with these requirements:

Protein Target: ${preferences.proteinTarget}g minimum
Meal Type: ${preferences.mealType}
${preferences.dietaryRestrictions ? `Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
${preferences.cookingTime ? `Max Cooking Time: ${preferences.cookingTime} minutes` : ''}

Provide recipe in JSON format with:
- name: creative recipe name
- ingredients: array of ingredients with amounts
- instructions: array of step-by-step cooking instructions
- macros: object with calories, protein, carbs, fat per serving
- prepTime: total preparation time in minutes
- servings: number of servings

Focus on practical, delicious, high-protein meals that support fitness goals.`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            ingredients: {
              type: "array",
              items: { type: "string" }
            },
            instructions: {
              type: "array",
              items: { type: "string" }
            },
            macros: {
              type: "object",
              properties: {
                calories: { type: "number" },
                protein: { type: "number" },
                carbs: { type: "number" },
                fat: { type: "number" }
              },
              required: ["calories", "protein", "carbs", "fat"]
            },
            prepTime: { type: "number" },
            servings: { type: "number" }
          },
          required: ["name", "ingredients", "instructions", "macros", "prepTime", "servings"]
        }
      }
    });

    const response = result.text;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe');
  }
}

export async function generateChatResponse(
  message: string,
  context: {
    userId: string;
    recentWorkouts?: any[];
    nutritionData?: any;
    fitnessGoals?: string;
  }
): Promise<string> {
  try {
    const systemPrompt = `You are FitTracker Pro's AI fitness coach. You provide helpful, motivating, and evidence-based advice on:
- Workout programming and form
- Nutrition and meal planning
- Recovery and sleep
- Goal setting and progress tracking

User Context:
${context.fitnessGoals ? `Fitness Goals: ${context.fitnessGoals}` : ''}
${context.recentWorkouts ? `Recent Workouts: ${JSON.stringify(context.recentWorkouts)}` : ''}
${context.nutritionData ? `Nutrition Data: ${JSON.stringify(context.nutritionData)}` : ''}

Be encouraging, specific, and practical. Keep responses concise but informative.

User Message: ${message}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt
    });

    return result.text || "I'm here to help with your fitness journey! What would you like to know?";
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
}
