// Offline-first data persistence using localStorage

export interface UserData {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fitnessGoal?: string;
  activityLevel?: string;
}

export interface WorkoutData {
  id: string;
  userId: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  exercises: ExerciseData[];
}

export interface ExerciseData {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: SetData[];
  notes?: string;
}

export interface SetData {
  id: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  rir?: number;
  setType: 'work' | 'warm' | 'drop' | 'failure';
  isCompleted: boolean;
}

export interface BodyMetricData {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  notes?: string;
}

export interface MealData {
  id: string;
  userId: string;
  name: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface NutritionGoalData {
  userId: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

const STORAGE_KEYS = {
  USER: 'fittracker_user',
  WORKOUTS: 'fittracker_workouts',
  BODY_METRICS: 'fittracker_body_metrics',
  MEALS: 'fittracker_meals',
  NUTRITION_GOALS: 'fittracker_nutrition_goals',
  AI_CONVERSATIONS: 'fittracker_ai_conversations',
} as const;

export class LocalStorageService {
  // User data
  static getUser(): UserData | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  static setUser(user: UserData): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Workouts
  static getWorkouts(): WorkoutData[] {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (!data) return [];
    
    const workouts = JSON.parse(data);
    return workouts.map((w: any) => ({
      ...w,
      startTime: new Date(w.startTime),
      endTime: w.endTime ? new Date(w.endTime) : undefined,
    }));
  }

  static saveWorkout(workout: WorkoutData): void {
    const workouts = this.getWorkouts();
    const existingIndex = workouts.findIndex(w => w.id === workout.id);
    
    if (existingIndex >= 0) {
      workouts[existingIndex] = workout;
    } else {
      workouts.push(workout);
    }
    
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }

  static getActiveWorkout(): WorkoutData | null {
    const workouts = this.getWorkouts();
    return workouts.find(w => !w.isCompleted) || null;
  }

  // Body metrics
  static getBodyMetrics(): BodyMetricData[] {
    const data = localStorage.getItem(STORAGE_KEYS.BODY_METRICS);
    if (!data) return [];
    
    const metrics = JSON.parse(data);
    return metrics.map((m: any) => ({
      ...m,
      date: new Date(m.date),
    }));
  }

  static saveBodyMetric(metric: BodyMetricData): void {
    const metrics = this.getBodyMetrics();
    const existingIndex = metrics.findIndex(m => m.id === metric.id);
    
    if (existingIndex >= 0) {
      metrics[existingIndex] = metric;
    } else {
      metrics.push(metric);
    }
    
    localStorage.setItem(STORAGE_KEYS.BODY_METRICS, JSON.stringify(metrics));
  }

  static getLatestBodyMetric(): BodyMetricData | null {
    const metrics = this.getBodyMetrics();
    if (metrics.length === 0) return null;
    
    return metrics.reduce((latest, current) => 
      current.date > latest.date ? current : latest
    );
  }

  // Meals
  static getMeals(date?: Date): MealData[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!data) return [];
    
    const meals = JSON.parse(data).map((m: any) => ({
      ...m,
      date: new Date(m.date),
    }));

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return meals.filter((m: MealData) => 
        m.date >= startOfDay && m.date <= endOfDay
      );
    }
    
    return meals;
  }

  static saveMeal(meal: MealData): void {
    const meals = this.getMeals();
    const existingIndex = meals.findIndex(m => m.id === meal.id);
    
    if (existingIndex >= 0) {
      meals[existingIndex] = meal;
    } else {
      meals.push(meal);
    }
    
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }

  static deleteMeal(mealId: string): void {
    const meals = this.getMeals();
    const filtered = meals.filter(m => m.id !== mealId);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(filtered));
  }

  // Nutrition goals
  static getNutritionGoals(): NutritionGoalData | null {
    const data = localStorage.getItem(STORAGE_KEYS.NUTRITION_GOALS);
    return data ? JSON.parse(data) : null;
  }

  static setNutritionGoals(goals: NutritionGoalData): void {
    localStorage.setItem(STORAGE_KEYS.NUTRITION_GOALS, JSON.stringify(goals));
  }

  // AI conversations
  static getAiConversations(): any[] {
    const data = localStorage.getItem(STORAGE_KEYS.AI_CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveAiConversation(conversation: any): void {
    const conversations = this.getAiConversations();
    const existingIndex = conversations.findIndex(c => c.id === conversation.id);
    
    if (existingIndex >= 0) {
      conversations[existingIndex] = conversation;
    } else {
      conversations.push(conversation);
    }
    
    localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(conversations));
  }

  // Utility methods
  static exportData(): string {
    const allData = {
      user: this.getUser(),
      workouts: this.getWorkouts(),
      bodyMetrics: this.getBodyMetrics(),
      meals: this.getMeals(),
      nutritionGoals: this.getNutritionGoals(),
      aiConversations: this.getAiConversations(),
      exportDate: new Date().toISOString(),
    };
    
    return JSON.stringify(allData, null, 2);
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
