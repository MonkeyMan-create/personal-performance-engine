// Sample data generator for demonstration purposes - Lazy Loaded Module
// This helps new users see what the Year in Review feature looks like with realistic data
// This module is lazy loaded to reduce main bundle size and improve initial load performance

import { GuestWorkout, GuestMeal, GuestProgress, saveWorkoutLocally, saveMealLocally, saveProgressLocally, getWorkoutsLocally } from './guestStorage'

// Sample exercises with realistic weight progressions
const SAMPLE_EXERCISES = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Pull-ups',
  'Bent-over Row',
  'Dumbbell Curl',
  'Tricep Dips',
  'Lunges',
  'Plank'
]

// Sample meal items with realistic calorie counts
const SAMPLE_FOODS = [
  { name: 'Grilled Chicken Breast', calories: 450, protein: 35 },
  { name: 'Quinoa Bowl with Vegetables', calories: 380, protein: 12 },
  { name: 'Greek Yogurt with Berries', calories: 220, protein: 15 },
  { name: 'Salmon with Sweet Potato', calories: 520, protein: 40 },
  { name: 'Protein Smoothie', calories: 320, protein: 25 },
  { name: 'Oatmeal with Nuts', calories: 280, protein: 8 },
  { name: 'Turkey Sandwich', calories: 420, protein: 28 },
  { name: 'Avocado Toast', calories: 340, protein: 8 },
  { name: 'Egg White Scramble', calories: 180, protein: 20 },
  { name: 'Rice and Beans', calories: 310, protein: 14 }
]

const MEAL_TYPES: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = ['breakfast', 'lunch', 'dinner', 'snack']

// Generate random date within the current year
function getRandomDateThisYear(): string {
  const start = new Date(new Date().getFullYear(), 0, 1)
  const end = new Date()
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return randomDate.toISOString().split('T')[0]
}

// Generate realistic workout progression
function generateWorkoutProgression(exerciseName: string, weekNumber: number): { weight: number; reps: number; rir: number } {
  const baseWeights: Record<string, number> = {
    'Bench Press': 135,
    'Squat': 185,
    'Deadlift': 225,
    'Overhead Press': 95,
    'Pull-ups': 0, // bodyweight
    'Bent-over Row': 115,
    'Dumbbell Curl': 25,
    'Tricep Dips': 0,
    'Lunges': 25,
    'Plank': 0
  }

  const baseWeight = baseWeights[exerciseName] || 50
  
  // Progressive overload: add 2.5-5 lbs every few weeks
  const progressionRate = exerciseName.includes('Dumbbell') ? 2.5 : 5
  const weightIncrease = Math.floor(weekNumber / 3) * progressionRate
  
  const weight = baseWeight + weightIncrease + (Math.random() - 0.5) * 10 // Small variation
  const reps = Math.floor(8 + Math.random() * 5) // 8-12 reps
  const rir = Math.floor(1 + Math.random() * 3) // 1-3 RIR
  
  return {
    weight: Math.max(weight, baseWeight), // Never go below base weight
    reps,
    rir
  }
}

// Generate sample workouts
export function generateSampleWorkouts(count: number = 15): string[] {
  const workoutIds: string[] = []
  const currentWeek = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))
  
  for (let i = 0; i < count; i++) {
    const weekNumber = Math.max(1, currentWeek - count + i)
    const exerciseCount = Math.floor(3 + Math.random() * 4) // 3-6 exercises per workout
    const selectedExercises = SAMPLE_EXERCISES
      .sort(() => Math.random() - 0.5)
      .slice(0, exerciseCount)
    
    const workout: Omit<GuestWorkout, 'id'> = {
      date: getRandomDateThisYear(),
      exercises: selectedExercises.map(exerciseName => {
        const setCount = Math.floor(3 + Math.random() * 2) // 3-4 sets
        const sets = []
        
        for (let setIndex = 0; setIndex < setCount; setIndex++) {
          const progression = generateWorkoutProgression(exerciseName, weekNumber)
          // Slight variation in weight across sets (might drop weight for later sets)
          const weightVariation = setIndex > 0 ? Math.random() * 0.9 + 0.95 : 1
          sets.push({
            weight: Math.round(progression.weight * weightVariation),
            reps: Math.max(1, progression.reps - setIndex), // Slightly fewer reps in later sets
            rir: progression.rir
          })
        }
        
        return { name: exerciseName, sets }
      }),
      duration: Math.floor(45 + Math.random() * 30), // 45-75 minute workouts
      notes: Math.random() > 0.7 ? 'Great workout today! Felt strong.' : undefined
    }
    
    const workoutId = saveWorkoutLocally(workout)
    workoutIds.push(workoutId)
  }
  
  return workoutIds
}

// Generate sample meals
export function generateSampleMeals(count: number = 30): string[] {
  const mealIds: string[] = []
  
  for (let i = 0; i < count; i++) {
    const food = SAMPLE_FOODS[Math.floor(Math.random() * SAMPLE_FOODS.length)]
    const mealType = MEAL_TYPES[Math.floor(Math.random() * MEAL_TYPES.length)]
    
    // Add some variation to calories and macros
    const calorieVariation = 0.8 + Math.random() * 0.4 // ±20% variation
    const calories = Math.round(food.calories * calorieVariation)
    const protein = food.protein ? Math.round(food.protein * calorieVariation) : undefined
    
    const meal: Omit<GuestMeal, 'id'> = {
      date: getRandomDateThisYear(),
      mealType,
      foodItem: food.name,
      calories,
      protein,
      carbs: Math.round(calories * 0.4 / 4), // Rough carb estimate
      fat: Math.round(calories * 0.25 / 9) // Rough fat estimate
    }
    
    const mealId = saveMealLocally(meal)
    mealIds.push(mealId)
  }
  
  return mealIds
}

// Generate sample progress entries
export function generateSampleProgress(count: number = 8): string[] {
  const progressIds: string[] = []
  const startWeight = 180 + Math.random() * 40 // Random starting weight between 180-220 lbs
  
  for (let i = 0; i < count; i++) {
    // Simulate gradual weight change over time
    const progressFactor = i / (count - 1) // 0 to 1
    const weightChange = (Math.random() - 0.5) * 20 // ±10 lbs change over the year
    const currentWeight = startWeight + (weightChange * progressFactor)
    
    const progress: Omit<GuestProgress, 'id'> = {
      date: getRandomDateThisYear(),
      weight: Math.round(currentWeight * 10) / 10, // Round to 1 decimal
      bodyFat: Math.random() > 0.5 ? Math.round((12 + Math.random() * 8) * 10) / 10 : undefined, // 12-20% body fat
      measurements: Math.random() > 0.6 ? {
        chest: Math.round((38 + Math.random() * 6) * 10) / 10, // 38-44 inches
        waist: Math.round((30 + Math.random() * 6) * 10) / 10, // 30-36 inches
        arms: Math.round((13 + Math.random() * 3) * 10) / 10, // 13-16 inches
        thighs: Math.round((20 + Math.random() * 4) * 10) / 10 // 20-24 inches
      } : undefined,
      notes: Math.random() > 0.7 ? 'Feeling stronger this week!' : undefined
    }
    
    const progressId = saveProgressLocally(progress)
    progressIds.push(progressId)
  }
  
  return progressIds
}

// Check if user already has sufficient data
export function hasMinimumDataForDemo(): boolean {
  const workouts = getWorkoutsLocally()
  
  // Check if user has at least 5 workouts this year
  const currentYear = new Date().getFullYear()
  const thisYearWorkouts = workouts.filter(w => new Date(w.date).getFullYear() === currentYear)
  
  return thisYearWorkouts.length >= 5
}

// Generate a complete sample dataset
export function generateCompleteDataset(): { workouts: number; meals: number; progress: number } {
  const workoutIds = generateSampleWorkouts(20)
  const mealIds = generateSampleMeals(50)
  const progressIds = generateSampleProgress(12)
  
  return {
    workouts: workoutIds.length,
    meals: mealIds.length,
    progress: progressIds.length
  }
}

// Generate minimal sample data for quick demo
export function generateMinimalDataset(): { workouts: number; meals: number; progress: number } {
  const workoutIds = generateSampleWorkouts(8)
  const mealIds = generateSampleMeals(15)
  const progressIds = generateSampleProgress(4)
  
  return {
    workouts: workoutIds.length,
    meals: mealIds.length,
    progress: progressIds.length
  }
}