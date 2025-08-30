import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// User Profile
export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  height?: number; // in cm
  activityLevel?: string; // sedentary, lightly_active, moderately_active, very_active
  fitnessGoal?: string; // bulk, cut, maintain, strength
  createdAt: Date;
}

// Workout
export interface Workout {
  id: string;
  userId: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  notes?: string;
  createdAt: Date;
}

// Workout Set
export interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseName: string;
  setNumber: number;
  weight?: number; // in kg or lbs
  reps?: number;
  rir?: number; // reps in reserve
  setType: string; // work, warm, drop, failure
  duration?: number; // in seconds for time-based exercises
  distance?: number; // for cardio
  notes?: string;
  isCompleted: boolean;
  createdAt: Date;
}

// Body Metric
export interface BodyMetric {
  id: string;
  userId: string;
  date: Date;
  weight?: number; // in kg or lbs
  bodyFatPercentage?: number;
  muscleMass?: number;
  notes?: string;
  photoUrl?: string;
}

// Meal
export interface Meal {
  id: string;
  userId: string;
  name: string;
  date: Date;
  mealType?: string; // breakfast, lunch, dinner, snack
  calories?: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  ingredients?: Array<{name: string; amount: number; unit: string}>;
  photoUrl?: string;
  notes?: string;
  createdAt: Date;
}

// Nutrition Goal
export interface NutritionGoal {
  id: string;
  userId: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  createdAt: Date;
}

// Helper function to convert Firestore timestamps
const convertTimestamps = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// User Profile functions
export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'users'), {
    ...profile,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const q = query(collection(db, 'users'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return convertTimestamps({ id: doc.id, ...doc.data() }) as UserProfile;
};

export const updateUserProfile = async (profileId: string, updates: Partial<UserProfile>): Promise<void> => {
  const docRef = doc(db, 'users', profileId);
  await updateDoc(docRef, updates);
};

// Workout functions
export const createWorkout = async (workout: Omit<Workout, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'workouts'), {
    ...workout,
    startTime: Timestamp.fromDate(workout.startTime),
    endTime: workout.endTime ? Timestamp.fromDate(workout.endTime) : null,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
};

export const getWorkouts = async (userId: string): Promise<Workout[]> => {
  const q = query(
    collection(db, 'workouts'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => 
    convertTimestamps({ id: doc.id, ...doc.data() }) as Workout
  );
};

export const updateWorkout = async (workoutId: string, updates: Partial<Workout>): Promise<void> => {
  const docRef = doc(db, 'workouts', workoutId);
  const processedUpdates = { ...updates };
  
  if (updates.endTime) {
    processedUpdates.endTime = Timestamp.fromDate(updates.endTime);
  }
  
  await updateDoc(docRef, processedUpdates);
};

// Workout Set functions
export const createWorkoutSet = async (set: Omit<WorkoutSet, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'workoutSets'), {
    ...set,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
};

export const getWorkoutSets = async (workoutId: string): Promise<WorkoutSet[]> => {
  const q = query(
    collection(db, 'workoutSets'), 
    where('workoutId', '==', workoutId),
    orderBy('setNumber', 'asc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => 
    convertTimestamps({ id: doc.id, ...doc.data() }) as WorkoutSet
  );
};

export const updateWorkoutSet = async (setId: string, updates: Partial<WorkoutSet>): Promise<void> => {
  const docRef = doc(db, 'workoutSets', setId);
  await updateDoc(docRef, updates);
};

export const deleteWorkoutSet = async (setId: string): Promise<void> => {
  const docRef = doc(db, 'workoutSets', setId);
  await deleteDoc(docRef);
};

// Body Metrics functions
export const createBodyMetric = async (metric: Omit<BodyMetric, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'bodyMetrics'), {
    ...metric,
    date: Timestamp.fromDate(metric.date)
  });
  return docRef.id;
};

export const getBodyMetrics = async (userId: string): Promise<BodyMetric[]> => {
  const q = query(
    collection(db, 'bodyMetrics'), 
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => 
    convertTimestamps({ id: doc.id, ...doc.data() }) as BodyMetric
  );
};

// Meal functions
export const createMeal = async (meal: Omit<Meal, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'meals'), {
    ...meal,
    date: Timestamp.fromDate(meal.date),
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
};

export const getMeals = async (userId: string, date?: Date): Promise<Meal[]> => {
  let q = query(
    collection(db, 'meals'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    q = query(
      collection(db, 'meals'), 
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'asc')
    );
  }
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => 
    convertTimestamps({ id: doc.id, ...doc.data() }) as Meal
  );
};

export const updateMeal = async (mealId: string, updates: Partial<Meal>): Promise<void> => {
  const docRef = doc(db, 'meals', mealId);
  const processedUpdates = { ...updates };
  
  if (updates.date) {
    processedUpdates.date = Timestamp.fromDate(updates.date);
  }
  
  await updateDoc(docRef, processedUpdates);
};

export const deleteMeal = async (mealId: string): Promise<void> => {
  const docRef = doc(db, 'meals', mealId);
  await deleteDoc(docRef);
};

// Nutrition Goal functions
export const createNutritionGoal = async (goal: Omit<NutritionGoal, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'nutritionGoals'), {
    ...goal,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
};

export const getNutritionGoal = async (userId: string): Promise<NutritionGoal | null> => {
  const q = query(collection(db, 'nutritionGoals'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return convertTimestamps({ id: doc.id, ...doc.data() }) as NutritionGoal;
};

export const updateNutritionGoal = async (goalId: string, updates: Partial<NutritionGoal>): Promise<void> => {
  const docRef = doc(db, 'nutritionGoals', goalId);
  await updateDoc(docRef, updates);
};