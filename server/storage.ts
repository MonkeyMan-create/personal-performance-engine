import { 
  type User, 
  type InsertUser, 
  type Exercise, 
  type InsertExercise,
  type Workout,
  type InsertWorkout,
  type WorkoutSet,
  type InsertWorkoutSet,
  type BodyMetric,
  type InsertBodyMetric,
  type Meal,
  type InsertMeal,
  type NutritionGoal,
  type InsertNutritionGoal,
  type AiConversation,
  type InsertAiConversation,
  type WorkoutTemplate,
  type InsertWorkoutTemplate
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Exercise methods
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Workout Template methods
  getWorkoutTemplates(userId: string): Promise<WorkoutTemplate[]>;
  getWorkoutTemplate(id: string): Promise<WorkoutTemplate | undefined>;
  createWorkoutTemplate(template: InsertWorkoutTemplate): Promise<WorkoutTemplate>;
  
  // Workout methods
  getWorkouts(userId: string): Promise<Workout[]>;
  getActiveWorkout(userId: string): Promise<Workout | undefined>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout>;
  
  // Workout Set methods
  getWorkoutSets(workoutId: string): Promise<WorkoutSet[]>;
  createWorkoutSet(set: InsertWorkoutSet): Promise<WorkoutSet>;
  updateWorkoutSet(id: string, set: Partial<WorkoutSet>): Promise<WorkoutSet>;
  deleteWorkoutSet(id: string): Promise<void>;
  
  // Body Metrics methods
  getBodyMetrics(userId: string): Promise<BodyMetric[]>;
  getLatestBodyMetric(userId: string): Promise<BodyMetric | undefined>;
  createBodyMetric(metric: InsertBodyMetric): Promise<BodyMetric>;
  
  // Nutrition methods
  getMeals(userId: string, date?: Date): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: string, meal: Partial<Meal>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;
  
  getNutritionGoal(userId: string): Promise<NutritionGoal | undefined>;
  createNutritionGoal(goal: InsertNutritionGoal): Promise<NutritionGoal>;
  updateNutritionGoal(userId: string, goal: Partial<NutritionGoal>): Promise<NutritionGoal>;
  
  // AI Conversation methods
  getAiConversations(userId: string): Promise<AiConversation[]>;
  getAiConversation(id: string): Promise<AiConversation | undefined>;
  createAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  updateAiConversation(id: string, conversation: Partial<AiConversation>): Promise<AiConversation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private workoutTemplates: Map<string, WorkoutTemplate> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private workoutSets: Map<string, WorkoutSet> = new Map();
  private bodyMetrics: Map<string, BodyMetric> = new Map();
  private meals: Map<string, Meal> = new Map();
  private nutritionGoals: Map<string, NutritionGoal> = new Map();
  private aiConversations: Map<string, AiConversation> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default exercises
    const defaultExercises: InsertExercise[] = [
      {
        name: "Bench Press",
        category: "chest",
        muscleGroups: ["chest", "triceps", "shoulders"],
        equipment: "barbell",
        instructions: "Lie on bench, grip bar with hands slightly wider than shoulder-width, lower to chest, press up.",
        difficulty: "intermediate"
      },
      {
        name: "Incline Dumbbell Press",
        category: "chest",
        muscleGroups: ["chest", "triceps", "shoulders"],
        equipment: "dumbbell",
        instructions: "Set bench to 30-45 degrees, press dumbbells from chest level upward.",
        difficulty: "intermediate"
      },
      {
        name: "Deadlift",
        category: "back",
        muscleGroups: ["back", "glutes", "hamstrings", "core"],
        equipment: "barbell",
        instructions: "Stand with feet hip-width apart, grip bar, keep back straight, lift by extending hips and knees.",
        difficulty: "advanced"
      },
      {
        name: "Pull-ups",
        category: "back",
        muscleGroups: ["back", "biceps"],
        equipment: "bodyweight",
        instructions: "Hang from bar with overhand grip, pull body up until chin clears bar.",
        difficulty: "intermediate"
      },
      {
        name: "Squats",
        category: "legs",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: "barbell",
        instructions: "Stand with feet shoulder-width apart, lower hips as if sitting back, keep chest up.",
        difficulty: "intermediate"
      },
      {
        name: "Overhead Press",
        category: "shoulders",
        muscleGroups: ["shoulders", "triceps", "core"],
        equipment: "barbell",
        instructions: "Stand tall, press bar from shoulder height overhead, keep core tight.",
        difficulty: "intermediate"
      }
    ];

    defaultExercises.forEach(exercise => {
      const id = randomUUID();
      this.exercises.set(id, { 
        ...exercise, 
        id,
        equipment: exercise.equipment || null,
        instructions: exercise.instructions || null,
        videoUrl: null,
        difficulty: exercise.difficulty || null
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Exercise methods
  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(exercise => exercise.category === category);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  // Workout Template methods
  async getWorkoutTemplates(userId: string): Promise<WorkoutTemplate[]> {
    return Array.from(this.workoutTemplates.values()).filter(template => 
      template.userId === userId || template.isDefault
    );
  }

  async getWorkoutTemplate(id: string): Promise<WorkoutTemplate | undefined> {
    return this.workoutTemplates.get(id);
  }

  async createWorkoutTemplate(insertTemplate: InsertWorkoutTemplate): Promise<WorkoutTemplate> {
    const id = randomUUID();
    const template: WorkoutTemplate = { ...insertTemplate, id, createdAt: new Date() };
    this.workoutTemplates.set(id, template);
    return template;
  }

  // Workout methods
  async getWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getActiveWorkout(userId: string): Promise<Workout | undefined> {
    return Array.from(this.workouts.values()).find(workout => 
      workout.userId === userId && !workout.isCompleted
    );
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = { ...insertWorkout, id, createdAt: new Date() };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: string, workoutUpdate: Partial<Workout>): Promise<Workout> {
    const workout = this.workouts.get(id);
    if (!workout) throw new Error('Workout not found');
    
    const updated = { ...workout, ...workoutUpdate };
    this.workouts.set(id, updated);
    return updated;
  }

  // Workout Set methods
  async getWorkoutSets(workoutId: string): Promise<WorkoutSet[]> {
    return Array.from(this.workoutSets.values())
      .filter(set => set.workoutId === workoutId)
      .sort((a, b) => a.setNumber - b.setNumber);
  }

  async createWorkoutSet(insertSet: InsertWorkoutSet): Promise<WorkoutSet> {
    const id = randomUUID();
    const set: WorkoutSet = { ...insertSet, id, createdAt: new Date() };
    this.workoutSets.set(id, set);
    return set;
  }

  async updateWorkoutSet(id: string, setUpdate: Partial<WorkoutSet>): Promise<WorkoutSet> {
    const set = this.workoutSets.get(id);
    if (!set) throw new Error('Workout set not found');
    
    const updated = { ...set, ...setUpdate };
    this.workoutSets.set(id, updated);
    return updated;
  }

  async deleteWorkoutSet(id: string): Promise<void> {
    this.workoutSets.delete(id);
  }

  // Body Metrics methods
  async getBodyMetrics(userId: string): Promise<BodyMetric[]> {
    return Array.from(this.bodyMetrics.values())
      .filter(metric => metric.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getLatestBodyMetric(userId: string): Promise<BodyMetric | undefined> {
    const metrics = await this.getBodyMetrics(userId);
    return metrics[0];
  }

  async createBodyMetric(insertMetric: InsertBodyMetric): Promise<BodyMetric> {
    const id = randomUUID();
    const metric: BodyMetric = { ...insertMetric, id };
    this.bodyMetrics.set(id, metric);
    return metric;
  }

  // Nutrition methods
  async getMeals(userId: string, date?: Date): Promise<Meal[]> {
    const meals = Array.from(this.meals.values()).filter(meal => meal.userId === userId);
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return meals.filter(meal => 
        meal.date >= startOfDay && meal.date <= endOfDay
      ).sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    
    return meals.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = randomUUID();
    const meal: Meal = { ...insertMeal, id, createdAt: new Date() };
    this.meals.set(id, meal);
    return meal;
  }

  async updateMeal(id: string, mealUpdate: Partial<Meal>): Promise<Meal> {
    const meal = this.meals.get(id);
    if (!meal) throw new Error('Meal not found');
    
    const updated = { ...meal, ...mealUpdate };
    this.meals.set(id, updated);
    return updated;
  }

  async deleteMeal(id: string): Promise<void> {
    this.meals.delete(id);
  }

  async getNutritionGoal(userId: string): Promise<NutritionGoal | undefined> {
    return Array.from(this.nutritionGoals.values()).find(goal => goal.userId === userId);
  }

  async createNutritionGoal(insertGoal: InsertNutritionGoal): Promise<NutritionGoal> {
    const id = randomUUID();
    const goal: NutritionGoal = { ...insertGoal, id, createdAt: new Date() };
    this.nutritionGoals.set(id, goal);
    return goal;
  }

  async updateNutritionGoal(userId: string, goalUpdate: Partial<NutritionGoal>): Promise<NutritionGoal> {
    const existingGoal = await this.getNutritionGoal(userId);
    if (!existingGoal) throw new Error('Nutrition goal not found');
    
    const updated = { ...existingGoal, ...goalUpdate };
    this.nutritionGoals.set(existingGoal.id, updated);
    return updated;
  }

  // AI Conversation methods
  async getAiConversations(userId: string): Promise<AiConversation[]> {
    return Array.from(this.aiConversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getAiConversation(id: string): Promise<AiConversation | undefined> {
    return this.aiConversations.get(id);
  }

  async createAiConversation(insertConversation: InsertAiConversation): Promise<AiConversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: AiConversation = { 
      ...insertConversation, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.aiConversations.set(id, conversation);
    return conversation;
  }

  async updateAiConversation(id: string, conversationUpdate: Partial<AiConversation>): Promise<AiConversation> {
    const conversation = this.aiConversations.get(id);
    if (!conversation) throw new Error('AI conversation not found');
    
    const updated = { ...conversation, ...conversationUpdate, updatedAt: new Date() };
    this.aiConversations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
