// Local storage functions for guest mode data management
// These functions ONLY interact with localStorage and are used exclusively in guest mode

// Workout data types for guest mode
export interface GuestWorkout {
  id: string
  date: string
  exercises: {
    name: string
    sets: {
      weight: number
      reps: number
      rir: number // Reps in Reserve
    }[]
  }[]
  duration?: number
  notes?: string
}

// Nutrition data types for guest mode  
export interface GuestMeal {
  id: string
  date: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodItem: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

// Progress data types for guest mode
export interface GuestProgress {
  id: string
  date: string
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  notes?: string
}

// Storage keys for guest data
const GUEST_WORKOUTS_KEY = 'guest_workouts'
const GUEST_MEALS_KEY = 'guest_meals'
const GUEST_PROGRESS_KEY = 'guest_progress'
const GUEST_PREFERENCES_KEY = 'guest_preferences'
const GUEST_PROFILE_KEY = 'guest_profile'
const GUEST_GOALS_KEY = 'guest_goals'

// Utility function to safely parse JSON from localStorage
function parseStorageData<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.warn(`Failed to parse ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Utility function to safely save data to localStorage
function saveStorageData<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error)
    return false
  }
}

// ===== WORKOUT FUNCTIONS =====

export function saveWorkoutLocally(workout: Omit<GuestWorkout, 'id'>): string {
  const workouts = getWorkoutsLocally()
  const newWorkout: GuestWorkout = {
    ...workout,
    id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  workouts.push(newWorkout)
  saveStorageData(GUEST_WORKOUTS_KEY, workouts)
  return newWorkout.id
}

export function getWorkoutsLocally(): GuestWorkout[] {
  return parseStorageData<GuestWorkout[]>(GUEST_WORKOUTS_KEY, [])
}

export function getWorkoutLocally(id: string): GuestWorkout | null {
  const workouts = getWorkoutsLocally()
  return workouts.find(workout => workout.id === id) || null
}

export function updateWorkoutLocally(id: string, updates: Partial<GuestWorkout>): boolean {
  const workouts = getWorkoutsLocally()
  const index = workouts.findIndex(workout => workout.id === id)
  
  if (index === -1) return false
  
  workouts[index] = { ...workouts[index], ...updates, id }
  return saveStorageData(GUEST_WORKOUTS_KEY, workouts)
}

export function deleteWorkoutLocally(id: string): boolean {
  const workouts = getWorkoutsLocally()
  const filteredWorkouts = workouts.filter(workout => workout.id !== id)
  return saveStorageData(GUEST_WORKOUTS_KEY, filteredWorkouts)
}

// ===== NUTRITION FUNCTIONS =====

export function saveMealLocally(meal: Omit<GuestMeal, 'id'>): string {
  const meals = getMealsLocally()
  const newMeal: GuestMeal = {
    ...meal,
    id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  meals.push(newMeal)
  saveStorageData(GUEST_MEALS_KEY, meals)
  return newMeal.id
}

export function getMealsLocally(): GuestMeal[] {
  return parseStorageData<GuestMeal[]>(GUEST_MEALS_KEY, [])
}

export function getMealsByDateLocally(date: string): GuestMeal[] {
  const meals = getMealsLocally()
  return meals.filter(meal => meal.date === date)
}

export function updateMealLocally(id: string, updates: Partial<GuestMeal>): boolean {
  const meals = getMealsLocally()
  const index = meals.findIndex(meal => meal.id === id)
  
  if (index === -1) return false
  
  meals[index] = { ...meals[index], ...updates, id }
  return saveStorageData(GUEST_MEALS_KEY, meals)
}

export function deleteMealLocally(id: string): boolean {
  const meals = getMealsLocally()
  const filteredMeals = meals.filter(meal => meal.id !== id)
  return saveStorageData(GUEST_MEALS_KEY, filteredMeals)
}

// ===== PROGRESS FUNCTIONS =====

export function saveProgressLocally(progress: Omit<GuestProgress, 'id'>): string {
  const progressData = getProgressLocally()
  const newProgress: GuestProgress = {
    ...progress,
    id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  progressData.push(newProgress)
  saveStorageData(GUEST_PROGRESS_KEY, progressData)
  return newProgress.id
}

export function getProgressLocally(): GuestProgress[] {
  return parseStorageData<GuestProgress[]>(GUEST_PROGRESS_KEY, [])
}

export function getLatestProgressLocally(): GuestProgress | null {
  const progressData = getProgressLocally()
  if (progressData.length === 0) return null
  
  return progressData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

export function updateProgressLocally(id: string, updates: Partial<GuestProgress>): boolean {
  const progressData = getProgressLocally()
  const index = progressData.findIndex(progress => progress.id === id)
  
  if (index === -1) return false
  
  progressData[index] = { ...progressData[index], ...updates, id }
  return saveStorageData(GUEST_PROGRESS_KEY, progressData)
}

export function deleteProgressLocally(id: string): boolean {
  const progressData = getProgressLocally()
  const filteredProgress = progressData.filter(progress => progress.id !== id)
  return saveStorageData(GUEST_PROGRESS_KEY, filteredProgress)
}

// ===== PROFILE DATA FUNCTIONS =====

export interface ProfileData {
  profilePicture?: string // base64 image data
  displayName?: string
  email?: string
  bio?: string
}

export interface PersonalGoals {
  targetWeight?: number // stored in lbs, converted for display
  dailyCalories?: number
  weeklyWorkouts?: number
  dailySteps?: number
  currentWeight?: number // for progress tracking
}

export interface PersonalRecord {
  exerciseName: string
  maxWeight: number // stored in lbs
  reps: number
  date: string
  workoutId: string
}

export function saveProfileDataLocally(profileData: Partial<ProfileData>): boolean {
  const currentProfile = getProfileDataLocally()
  const updatedProfile = { ...currentProfile, ...profileData }
  return saveStorageData(GUEST_PROFILE_KEY, updatedProfile)
}

export function getProfileDataLocally(): ProfileData {
  return parseStorageData<ProfileData>(GUEST_PROFILE_KEY, {})
}

export function savePersonalGoalsLocally(goals: Partial<PersonalGoals>): boolean {
  const currentGoals = getPersonalGoalsLocally()
  const updatedGoals = { ...currentGoals, ...goals }
  return saveStorageData(GUEST_GOALS_KEY, updatedGoals)
}

export function getPersonalGoalsLocally(): PersonalGoals {
  return parseStorageData<PersonalGoals>(GUEST_GOALS_KEY, {})
}

export function calculatePersonalRecords(): PersonalRecord[] {
  const workouts = getWorkoutsLocally()
  const prMap = new Map<string, PersonalRecord>()
  
  // Iterate through all workouts to find maximum weights
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exerciseName = exercise.name.toLowerCase().trim()
      
      exercise.sets.forEach(set => {
        if (set.weight && set.reps > 0) {
          const currentPR = prMap.get(exerciseName)
          
          if (!currentPR || set.weight > currentPR.maxWeight) {
            prMap.set(exerciseName, {
              exerciseName: exercise.name,
              maxWeight: set.weight,
              reps: set.reps,
              date: workout.date,
              workoutId: workout.id
            })
          }
        }
      })
    })
  })
  
  return Array.from(prMap.values()).sort((a, b) => b.maxWeight - a.maxWeight)
}

export function getPersonalRecordFor(exerciseName: string): PersonalRecord | null {
  const prs = calculatePersonalRecords()
  return prs.find(pr => pr.exerciseName.toLowerCase().includes(exerciseName.toLowerCase())) || null
}

// Major compound exercises to highlight
export const MAJOR_EXERCISES = ['bench press', 'squat', 'deadlift', 'overhead press', 'pull up', 'row']

export function getMajorExercisePRs(): PersonalRecord[] {
  const allPRs = calculatePersonalRecords()
  return MAJOR_EXERCISES.map(exerciseName => {
    return allPRs.find(pr => 
      pr.exerciseName.toLowerCase().includes(exerciseName) ||
      exerciseName.includes(pr.exerciseName.toLowerCase())
    )
  }).filter(Boolean) as PersonalRecord[]
}

// ===== PREFERENCES FUNCTIONS =====

export interface GuestPreferences {
  measurementUnit: 'lbs' | 'kg'
  theme: 'light' | 'dark' | 'system'
  defaultRIR: number
}

export function savePreferencesLocally(preferences: Partial<GuestPreferences>): boolean {
  const currentPrefs = getPreferencesLocally()
  const updatedPrefs = { ...currentPrefs, ...preferences }
  return saveStorageData(GUEST_PREFERENCES_KEY, updatedPrefs)
}

export function getPreferencesLocally(): GuestPreferences {
  return parseStorageData<GuestPreferences>(GUEST_PREFERENCES_KEY, {
    measurementUnit: 'lbs',
    theme: 'dark',
    defaultRIR: 2
  })
}

// ===== SMART PRE-FILLING FUNCTIONS =====

export function getExerciseHistory(exerciseName: string): {
  lastWeight?: number
  lastReps?: number
  lastRir?: number
  totalSets?: number
  lastWorkoutDate?: string
} | null {
  const workouts = getWorkoutsLocally()
  
  // Find the most recent workout containing this exercise
  const workoutsWithExercise = workouts
    .filter(workout => 
      workout.exercises.some(exercise => 
        exercise.name.toLowerCase() === exerciseName.toLowerCase()
      )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  if (workoutsWithExercise.length === 0) return null
  
  const lastWorkout = workoutsWithExercise[0]
  const exercise = lastWorkout.exercises.find(ex => 
    ex.name.toLowerCase() === exerciseName.toLowerCase()
  )
  
  if (!exercise || exercise.sets.length === 0) return null
  
  // Get the last set from the most recent workout
  const lastSet = exercise.sets[exercise.sets.length - 1]
  
  return {
    lastWeight: lastSet.weight,
    lastReps: lastSet.reps,
    lastRir: lastSet.rir,
    totalSets: exercise.sets.length,
    lastWorkoutDate: lastWorkout.date
  }
}

export function getUniqueExerciseNames(): string[] {
  const workouts = getWorkoutsLocally()
  const exerciseNames = new Set<string>()
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exerciseNames.add(exercise.name)
    })
  })
  
  return Array.from(exerciseNames).sort()
}

export function getSmartDefaults(exerciseName?: string): {
  weight: string
  reps: string
  rir: string
} {
  const preferences = getPreferencesLocally()
  
  if (exerciseName) {
    const history = getExerciseHistory(exerciseName)
    if (history) {
      return {
        weight: history.lastWeight?.toString() || '',
        reps: history.lastReps?.toString() || '8',
        rir: history.lastRir?.toString() || preferences.defaultRIR.toString()
      }
    }
  }
  
  return {
    weight: '',
    reps: '8',
    rir: preferences.defaultRIR.toString()
  }
}

// ===== CURRENT WORKOUT SESSION FUNCTIONS =====

export interface CurrentWorkoutSession {
  id: string
  startTime: string
  exercises: {
    name: string
    sets: {
      weight: number
      reps: number
      rir: number
      timestamp: string
    }[]
  }[]
  isActive: boolean
}

const CURRENT_SESSION_KEY = 'current_workout_session'

export function startWorkoutSession(): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const session: CurrentWorkoutSession = {
    id: sessionId,
    startTime: new Date().toISOString(),
    exercises: [],
    isActive: true
  }
  
  saveStorageData(CURRENT_SESSION_KEY, session)
  return sessionId
}

export function getCurrentWorkoutSession(): CurrentWorkoutSession | null {
  const session = parseStorageData<CurrentWorkoutSession | null>(CURRENT_SESSION_KEY, null)
  return session?.isActive ? session : null
}

export function addSetToCurrentSession(exerciseName: string, weight: number, reps: number, rir: number): boolean {
  const session = getCurrentWorkoutSession()
  if (!session) return false
  
  const exerciseIndex = session.exercises.findIndex(ex => ex.name === exerciseName)
  
  const newSet = {
    weight,
    reps,
    rir,
    timestamp: new Date().toISOString()
  }
  
  if (exerciseIndex >= 0) {
    // Add set to existing exercise
    session.exercises[exerciseIndex].sets.push(newSet)
  } else {
    // Create new exercise
    session.exercises.push({
      name: exerciseName,
      sets: [newSet]
    })
  }
  
  return saveStorageData(CURRENT_SESSION_KEY, session)
}

export function finishWorkoutSession(duration?: number, notes?: string): string | null {
  const session = getCurrentWorkoutSession()
  if (!session) return null
  
  // Convert session to GuestWorkout format
  const workout: Omit<GuestWorkout, 'id'> = {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    exercises: session.exercises.map(exercise => ({
      name: exercise.name,
      sets: exercise.sets.map(set => ({
        weight: set.weight,
        reps: set.reps,
        rir: set.rir
      }))
    })),
    duration,
    notes
  }
  
  // Save as completed workout
  const workoutId = saveWorkoutLocally(workout)
  
  // Clear current session
  localStorage.removeItem(CURRENT_SESSION_KEY)
  
  return workoutId
}

export function cancelWorkoutSession(): boolean {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY)
    return true
  } catch {
    return false
  }
}

// ===== UTILITY FUNCTIONS =====

export function clearAllGuestDataLocally(): boolean {
  try {
    localStorage.removeItem(GUEST_WORKOUTS_KEY)
    localStorage.removeItem(GUEST_MEALS_KEY)
    localStorage.removeItem(GUEST_PROGRESS_KEY)
    localStorage.removeItem(GUEST_PREFERENCES_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear guest data:', error)
    return false
  }
}

export function exportGuestDataLocally(): {
  workouts: GuestWorkout[]
  meals: GuestMeal[]
  progress: GuestProgress[]
  preferences: GuestPreferences
} {
  return {
    workouts: getWorkoutsLocally(),
    meals: getMealsLocally(),
    progress: getProgressLocally(),
    preferences: getPreferencesLocally()
  }
}

export function getGuestDataSummaryLocally() {
  return {
    totalWorkouts: getWorkoutsLocally().length,
    totalMeals: getMealsLocally().length,
    totalProgressEntries: getProgressLocally().length,
    lastActivity: (() => {
      const workouts = getWorkoutsLocally()
      const meals = getMealsLocally()
      const progress = getProgressLocally()
      
      const allDates = [
        ...workouts.map(w => w.date),
        ...meals.map(m => m.date),
        ...progress.map(p => p.date)
      ].sort().reverse()
      
      return allDates[0] || null
    })()
  }
}