// Workout template system for guided workouts - Lazy Loaded Module
// Provides pre-built workout routines that users can select and customize
// This module is lazy loaded to reduce main bundle size

export interface TemplateSet {
  reps: string
  weight?: string // Optional suggested weight range like "bodyweight" or "50-75"
  rir: string
}

export interface TemplateExercise {
  name: string
  sets: TemplateSet[]
  category: 'compound' | 'isolation' | 'cardio' | 'core'
  muscleGroups: string[]
  instructions?: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string // estimated duration in minutes
  category: 'strength' | 'cardio' | 'hybrid'
  targetMuscles: string[]
  exercises: TemplateExercise[]
  notes?: string
}

// Predefined workout templates
export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'full-body-beginner',
    name: 'Full Body Beginner',
    description: 'Perfect starter workout hitting all major muscle groups with compound movements',
    difficulty: 'beginner',
    duration: '45',
    category: 'strength',
    targetMuscles: ['Full Body'],
    exercises: [
      {
        name: 'Bodyweight Squats',
        sets: [
          { reps: '8-12', weight: 'bodyweight', rir: '3' },
          { reps: '8-12', weight: 'bodyweight', rir: '3' },
          { reps: '8-12', weight: 'bodyweight', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        instructions: 'Keep chest up, knees track over toes'
      },
      {
        name: 'Push-ups (Modified if needed)',
        sets: [
          { reps: '5-10', weight: 'bodyweight', rir: '3' },
          { reps: '5-10', weight: 'bodyweight', rir: '3' },
          { reps: '5-10', weight: 'bodyweight', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        instructions: 'Use knees if needed, maintain straight line'
      },
      {
        name: 'Bent-over Rows (Dumbbells)',
        sets: [
          { reps: '8-12', weight: '10-20 lbs', rir: '3' },
          { reps: '8-12', weight: '10-20 lbs', rir: '3' },
          { reps: '8-12', weight: '10-20 lbs', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Lats', 'Rhomboids', 'Biceps'],
        instructions: 'Hinge at hips, squeeze shoulder blades'
      },
      {
        name: 'Plank Hold',
        sets: [
          { reps: '20-30 sec', weight: 'bodyweight', rir: '3' },
          { reps: '20-30 sec', weight: 'bodyweight', rir: '3' },
          { reps: '20-30 sec', weight: 'bodyweight', rir: '2' }
        ],
        category: 'core',
        muscleGroups: ['Core', 'Abs'],
        instructions: 'Maintain straight line from head to heels'
      }
    ],
    notes: 'Rest 60-90 seconds between sets. Focus on form over speed.'
  },
  {
    id: 'upper-push',
    name: 'Upper Body Push Day',
    description: 'Target chest, shoulders, and triceps with pushing movements',
    difficulty: 'intermediate',
    duration: '50',
    category: 'strength',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: '6-8', weight: '60-70% 1RM', rir: '3' },
          { reps: '6-8', weight: '60-70% 1RM', rir: '2' },
          { reps: '6-8', weight: '60-70% 1RM', rir: '2' },
          { reps: '6-8', weight: '60-70% 1RM', rir: '1' }
        ],
        category: 'compound',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        instructions: 'Control the descent, pause briefly on chest'
      },
      {
        name: 'Overhead Press',
        sets: [
          { reps: '6-8', weight: '50-60% bench', rir: '3' },
          { reps: '6-8', weight: '50-60% bench', rir: '2' },
          { reps: '6-8', weight: '50-60% bench', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Shoulders', 'Triceps', 'Core'],
        instructions: 'Press straight up, engage core'
      },
      {
        name: 'Incline Dumbbell Press',
        sets: [
          { reps: '8-10', weight: '30-40 lbs', rir: '3' },
          { reps: '8-10', weight: '30-40 lbs', rir: '2' },
          { reps: '8-10', weight: '30-40 lbs', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Upper Chest', 'Shoulders'],
        instructions: '30-45 degree incline, control the weight'
      },
      {
        name: 'Dips',
        sets: [
          { reps: '6-12', weight: 'bodyweight', rir: '3' },
          { reps: '6-12', weight: 'bodyweight', rir: '2' },
          { reps: '6-12', weight: 'bodyweight', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
        instructions: 'Use assist if needed, lean slightly forward'
      },
      {
        name: 'Lateral Raises',
        sets: [
          { reps: '12-15', weight: '10-15 lbs', rir: '3' },
          { reps: '12-15', weight: '10-15 lbs', rir: '2' },
          { reps: '12-15', weight: '10-15 lbs', rir: '2' }
        ],
        category: 'isolation',
        muscleGroups: ['Side Delts'],
        instructions: 'Raise to shoulder height, control the descent'
      }
    ],
    notes: 'Rest 2-3 minutes between compound sets, 90 seconds for isolation.'
  },
  {
    id: 'upper-pull',
    name: 'Upper Body Pull Day',
    description: 'Strengthen your back and biceps with pulling movements',
    difficulty: 'intermediate',
    duration: '50',
    category: 'strength',
    targetMuscles: ['Back', 'Biceps', 'Rear Delts'],
    exercises: [
      {
        name: 'Pull-ups/Lat Pulldowns',
        sets: [
          { reps: '6-8', weight: 'bodyweight/70%', rir: '3' },
          { reps: '6-8', weight: 'bodyweight/70%', rir: '2' },
          { reps: '6-8', weight: 'bodyweight/70%', rir: '2' },
          { reps: '6-8', weight: 'bodyweight/70%', rir: '1' }
        ],
        category: 'compound',
        muscleGroups: ['Lats', 'Rhomboids', 'Biceps'],
        instructions: 'Pull chin over bar or to upper chest'
      },
      {
        name: 'Barbell Rows',
        sets: [
          { reps: '6-8', weight: '70-80% bench', rir: '3' },
          { reps: '6-8', weight: '70-80% bench', rir: '2' },
          { reps: '6-8', weight: '70-80% bench', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Lats', 'Rhomboids', 'Rear Delts'],
        instructions: 'Pull to lower chest, squeeze shoulder blades'
      },
      {
        name: 'Seated Cable Rows',
        sets: [
          { reps: '8-10', weight: '80-100 lbs', rir: '3' },
          { reps: '8-10', weight: '80-100 lbs', rir: '2' },
          { reps: '8-10', weight: '80-100 lbs', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Mid Traps', 'Rhomboids', 'Biceps'],
        instructions: 'Chest up, pull to lower ribs'
      },
      {
        name: 'Barbell Bicep Curls',
        sets: [
          { reps: '8-12', weight: '40-60 lbs', rir: '3' },
          { reps: '8-12', weight: '40-60 lbs', rir: '2' },
          { reps: '8-12', weight: '40-60 lbs', rir: '2' }
        ],
        category: 'isolation',
        muscleGroups: ['Biceps'],
        instructions: 'Control the weight, squeeze at the top'
      },
      {
        name: 'Face Pulls',
        sets: [
          { reps: '12-15', weight: '30-50 lbs', rir: '3' },
          { reps: '12-15', weight: '30-50 lbs', rir: '2' },
          { reps: '12-15', weight: '30-50 lbs', rir: '2' }
        ],
        category: 'isolation',
        muscleGroups: ['Rear Delts', 'Mid Traps'],
        instructions: 'Pull to face level, external rotation'
      }
    ],
    notes: 'Focus on mind-muscle connection. Use proper form over heavy weight.'
  },
  {
    id: 'leg-day',
    name: 'Lower Body Power',
    description: 'Comprehensive leg workout targeting all major lower body muscles',
    difficulty: 'intermediate',
    duration: '55',
    category: 'strength',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    exercises: [
      {
        name: 'Squats',
        sets: [
          { reps: '6-8', weight: '70-80% 1RM', rir: '3' },
          { reps: '6-8', weight: '70-80% 1RM', rir: '2' },
          { reps: '6-8', weight: '70-80% 1RM', rir: '2' },
          { reps: '6-8', weight: '70-80% 1RM', rir: '1' }
        ],
        category: 'compound',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        instructions: 'Depth below parallel, chest up'
      },
      {
        name: 'Romanian Deadlifts',
        sets: [
          { reps: '8-10', weight: '60-70% deadlift', rir: '3' },
          { reps: '8-10', weight: '60-70% deadlift', rir: '2' },
          { reps: '8-10', weight: '60-70% deadlift', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
        instructions: 'Hinge at hips, feel stretch in hamstrings'
      },
      {
        name: 'Bulgarian Split Squats',
        sets: [
          { reps: '8-12 each leg', weight: '20-30 lbs', rir: '3' },
          { reps: '8-12 each leg', weight: '20-30 lbs', rir: '2' },
          { reps: '8-12 each leg', weight: '20-30 lbs', rir: '2' }
        ],
        category: 'compound',
        muscleGroups: ['Quadriceps', 'Glutes'],
        instructions: 'Most weight on front leg, control the descent'
      },
      {
        name: 'Leg Curls',
        sets: [
          { reps: '10-12', weight: '60-80 lbs', rir: '3' },
          { reps: '10-12', weight: '60-80 lbs', rir: '2' },
          { reps: '10-12', weight: '60-80 lbs', rir: '2' }
        ],
        category: 'isolation',
        muscleGroups: ['Hamstrings'],
        instructions: 'Control the negative, squeeze at the top'
      },
      {
        name: 'Calf Raises',
        sets: [
          { reps: '15-20', weight: '80-120 lbs', rir: '3' },
          { reps: '15-20', weight: '80-120 lbs', rir: '2' },
          { reps: '15-20', weight: '80-120 lbs', rir: '2' }
        ],
        category: 'isolation',
        muscleGroups: ['Calves'],
        instructions: 'Full range of motion, pause at the top'
      }
    ],
    notes: 'Take longer rest periods (3-4 minutes) for compound movements.'
  },
  {
    id: 'cardio-core',
    name: 'Cardio + Core Blast',
    description: 'High-energy workout combining cardio intervals with core strengthening',
    difficulty: 'beginner',
    duration: '35',
    category: 'hybrid',
    targetMuscles: ['Cardiovascular', 'Core', 'Full Body'],
    exercises: [
      {
        name: 'Jumping Jacks',
        sets: [
          { reps: '30 seconds', weight: 'bodyweight', rir: '3' },
          { reps: '30 seconds', weight: 'bodyweight', rir: '3' },
          { reps: '30 seconds', weight: 'bodyweight', rir: '2' }
        ],
        category: 'cardio',
        muscleGroups: ['Full Body', 'Cardiovascular'],
        instructions: 'Land softly, maintain rhythm'
      },
      {
        name: 'Mountain Climbers',
        sets: [
          { reps: '30 seconds', weight: 'bodyweight', rir: '3' },
          { reps: '30 seconds', weight: 'bodyweight', rir: '3' },
          { reps: '30 seconds', weight: 'bodyweight', rir: '2' }
        ],
        category: 'cardio',
        muscleGroups: ['Core', 'Shoulders', 'Cardiovascular'],
        instructions: 'Keep hips level, drive knees to chest'
      },
      {
        name: 'Bicycle Crunches',
        sets: [
          { reps: '20 each side', weight: 'bodyweight', rir: '3' },
          { reps: '20 each side', weight: 'bodyweight', rir: '3' },
          { reps: '20 each side', weight: 'bodyweight', rir: '2' }
        ],
        category: 'core',
        muscleGroups: ['Abs', 'Obliques'],
        instructions: 'Control the movement, don\'t rush'
      },
      {
        name: 'High Knees',
        sets: [
          { reps: '30 seconds', weight: 'bodyweight', rir: '3' },
          { reps: '30 seconds', weight: 'bodyweight', rir: '3' },
          { reps: '30 seconds', weight: 'bodyweight', rir: '2' }
        ],
        category: 'cardio',
        muscleGroups: ['Hip Flexors', 'Cardiovascular'],
        instructions: 'Drive knees up, pump arms'
      },
      {
        name: 'Russian Twists',
        sets: [
          { reps: '15 each side', weight: 'bodyweight', rir: '3' },
          { reps: '15 each side', weight: 'bodyweight', rir: '3' },
          { reps: '15 each side', weight: 'bodyweight', rir: '2' }
        ],
        category: 'core',
        muscleGroups: ['Obliques', 'Core'],
        instructions: 'Lean back slightly, rotate through core'
      },
      {
        name: 'Burpees',
        sets: [
          { reps: '5-8', weight: 'bodyweight', rir: '3' },
          { reps: '5-8', weight: 'bodyweight', rir: '3' },
          { reps: '5-8', weight: 'bodyweight', rir: '2' }
        ],
        category: 'cardio',
        muscleGroups: ['Full Body', 'Cardiovascular'],
        instructions: 'Step back if needed, maintain form'
      }
    ],
    notes: 'Rest 30-60 seconds between exercises. Modify intensity as needed.'
  }
]

// Utility functions for working with templates
export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return WORKOUT_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): WorkoutTemplate[] {
  return WORKOUT_TEMPLATES.filter(template => template.difficulty === difficulty)
}

export function getTemplatesByCategory(category: 'strength' | 'cardio' | 'hybrid'): WorkoutTemplate[] {
  return WORKOUT_TEMPLATES.filter(template => template.category === category)
}

// Convert template to workout form format
export function convertTemplateToWorkoutForm(template: WorkoutTemplate) {
  // Defensive programming: ensure template has valid structure
  if (!template) {
    throw new Error('Template is required')
  }
  
  if (!template.exercises || !Array.isArray(template.exercises)) {
    console.error('Invalid template structure - exercises must be an array:', template)
    throw new Error('Template must have valid exercises array')
  }
  
  return {
    exercises: template.exercises.map(exercise => {
      if (!exercise || !exercise.name) {
        console.warn('Invalid exercise in template:', exercise)
        return { name: 'Unknown Exercise', sets: [] }
      }
      
      if (!exercise.sets || !Array.isArray(exercise.sets)) {
        console.warn('Invalid sets for exercise:', exercise.name)
        return { name: exercise.name, sets: [] }
      }
      
      return {
        name: exercise.name,
        sets: exercise.sets.map(set => ({
          weight: set.weight || '',
          reps: set.reps || '8-12',
          rir: set.rir || '2'
        }))
      }
    }),
    duration: template.duration || '30',
    notes: template.notes || ''
  }
}