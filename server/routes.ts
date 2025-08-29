import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWorkoutSchema, 
  insertWorkoutSetSchema, 
  insertMealSchema, 
  insertBodyMetricSchema,
  insertAiConversationSchema 
} from "@shared/schema";
import { 
  generateWorkoutAnalysis, 
  generateNutritionAdvice, 
  generateHighProteinRecipe, 
  generateChatResponse 
} from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const { category } = req.query;
      const exercises = category 
        ? await storage.getExercisesByCategory(category as string)
        : await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exercise = await storage.getExercise(req.params.id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const workouts = await storage.getWorkouts(userId as string);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/active", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const workout = await storage.getActiveWorkout(userId as string);
      res.json(workout || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active workout" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout data" });
    }
  });

  app.patch("/api/workouts/:id", async (req, res) => {
    try {
      const workout = await storage.updateWorkout(req.params.id, req.body);
      res.json(workout);
    } catch (error) {
      res.status(404).json({ message: "Workout not found" });
    }
  });

  // Workout Sets routes
  app.get("/api/workouts/:workoutId/sets", async (req, res) => {
    try {
      const sets = await storage.getWorkoutSets(req.params.workoutId);
      res.json(sets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout sets" });
    }
  });

  app.post("/api/workout-sets", async (req, res) => {
    try {
      const setData = insertWorkoutSetSchema.parse(req.body);
      const set = await storage.createWorkoutSet(setData);
      res.json(set);
    } catch (error) {
      res.status(400).json({ message: "Invalid set data" });
    }
  });

  app.patch("/api/workout-sets/:id", async (req, res) => {
    try {
      const set = await storage.updateWorkoutSet(req.params.id, req.body);
      res.json(set);
    } catch (error) {
      res.status(404).json({ message: "Workout set not found" });
    }
  });

  // Body Metrics routes
  app.get("/api/body-metrics", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const metrics = await storage.getBodyMetrics(userId as string);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch body metrics" });
    }
  });

  app.get("/api/body-metrics/latest", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const metric = await storage.getLatestBodyMetric(userId as string);
      res.json(metric || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest body metric" });
    }
  });

  app.post("/api/body-metrics", async (req, res) => {
    try {
      const metricData = insertBodyMetricSchema.parse(req.body);
      const metric = await storage.createBodyMetric(metricData);
      res.json(metric);
    } catch (error) {
      res.status(400).json({ message: "Invalid body metric data" });
    }
  });

  // Nutrition routes
  app.get("/api/meals", async (req, res) => {
    try {
      const { userId, date } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const parseDate = date ? new Date(date as string) : undefined;
      const meals = await storage.getMeals(userId as string, parseDate);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.post("/api/meals", async (req, res) => {
    try {
      const mealData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(mealData);
      res.json(meal);
    } catch (error) {
      res.status(400).json({ message: "Invalid meal data" });
    }
  });

  app.patch("/api/meals/:id", async (req, res) => {
    try {
      const meal = await storage.updateMeal(req.params.id, req.body);
      res.json(meal);
    } catch (error) {
      res.status(404).json({ message: "Meal not found" });
    }
  });

  app.delete("/api/meals/:id", async (req, res) => {
    try {
      await storage.deleteMeal(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ message: "Meal not found" });
    }
  });

  app.get("/api/nutrition-goals", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const goal = await storage.getNutritionGoal(userId as string);
      res.json(goal || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition goal" });
    }
  });

  // AI Coach routes
  app.post("/api/ai/workout-analysis", async (req, res) => {
    try {
      const { exerciseName, sets, previousPerformance } = req.body;
      const analysis = await generateWorkoutAnalysis({
        exerciseName,
        sets,
        previousPerformance
      });
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate workout analysis" });
    }
  });

  app.post("/api/ai/nutrition-advice", async (req, res) => {
    try {
      const { currentMacros, goals, fitnessGoal, activityLevel } = req.body;
      const advice = await generateNutritionAdvice({
        currentMacros,
        goals,
        fitnessGoal,
        activityLevel
      });
      res.json(advice);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate nutrition advice" });
    }
  });

  app.post("/api/ai/recipe", async (req, res) => {
    try {
      const { dietaryRestrictions, proteinTarget, mealType, cookingTime } = req.body;
      const recipe = await generateHighProteinRecipe({
        dietaryRestrictions,
        proteinTarget,
        mealType,
        cookingTime
      });
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const response = await generateChatResponse(message, context);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate chat response" });
    }
  });

  app.get("/api/ai/conversations", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const conversations = await storage.getAiConversations(userId as string);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post("/api/ai/conversations", async (req, res) => {
    try {
      const conversationData = insertAiConversationSchema.parse(req.body);
      const conversation = await storage.createAiConversation(conversationData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Invalid conversation data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
