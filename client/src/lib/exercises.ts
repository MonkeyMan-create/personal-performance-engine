export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  instructions: string;
  videoUrl?: string;
  difficulty: string;
}

// Default exercise database for offline use
export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "chest",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: "barbell",
    instructions: "Lie on bench, grip bar with hands slightly wider than shoulder-width, lower to chest, press up.",
    difficulty: "intermediate"
  },
  {
    id: "2",
    name: "Incline Dumbbell Press",
    category: "chest",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: "dumbbell",
    instructions: "Set bench to 30-45 degrees, press dumbbells from chest level upward.",
    difficulty: "intermediate"
  },
  {
    id: "3",
    name: "Dumbbell Flyes",
    category: "chest",
    muscleGroups: ["chest"],
    equipment: "dumbbell",
    instructions: "Lie on bench, hold dumbbells above chest, lower with slight bend in elbows in arc motion.",
    difficulty: "intermediate"
  },
  {
    id: "4",
    name: "Deadlift",
    category: "back",
    muscleGroups: ["back", "glutes", "hamstrings", "core"],
    equipment: "barbell",
    instructions: "Stand with feet hip-width apart, grip bar, keep back straight, lift by extending hips and knees.",
    difficulty: "advanced"
  },
  {
    id: "5",
    name: "Pull-ups",
    category: "back",
    muscleGroups: ["back", "biceps"],
    equipment: "bodyweight",
    instructions: "Hang from bar with overhand grip, pull body up until chin clears bar.",
    difficulty: "intermediate"
  },
  {
    id: "6",
    name: "Bent-Over Rows",
    category: "back",
    muscleGroups: ["back", "biceps"],
    equipment: "barbell",
    instructions: "Hinge at hips, keep back straight, pull bar to lower chest/upper abdomen.",
    difficulty: "intermediate"
  },
  {
    id: "7",
    name: "Squats",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: "barbell",
    instructions: "Stand with feet shoulder-width apart, lower hips as if sitting back, keep chest up.",
    difficulty: "intermediate"
  },
  {
    id: "8",
    name: "Romanian Deadlift",
    category: "legs",
    muscleGroups: ["hamstrings", "glutes", "back"],
    equipment: "barbell",
    instructions: "Keep legs straight, hinge at hips, lower bar along legs, return to standing.",
    difficulty: "intermediate"
  },
  {
    id: "9",
    name: "Leg Press",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes"],
    equipment: "machine",
    instructions: "Sit in machine, place feet on platform, lower weight to 90 degrees, press up.",
    difficulty: "beginner"
  },
  {
    id: "10",
    name: "Overhead Press",
    category: "shoulders",
    muscleGroups: ["shoulders", "triceps", "core"],
    equipment: "barbell",
    instructions: "Stand tall, press bar from shoulder height overhead, keep core tight.",
    difficulty: "intermediate"
  },
  {
    id: "11",
    name: "Lateral Raises",
    category: "shoulders",
    muscleGroups: ["shoulders"],
    equipment: "dumbbell",
    instructions: "Hold dumbbells at sides, raise arms out to shoulder height, lower slowly.",
    difficulty: "beginner"
  },
  {
    id: "12",
    name: "Face Pulls",
    category: "shoulders",
    muscleGroups: ["shoulders", "upper back"],
    equipment: "cable",
    instructions: "Set cable at face height, pull rope to face while separating hands.",
    difficulty: "beginner"
  }
];

// Default PPL (Push/Pull/Legs) workout template
export const DEFAULT_PPL_TEMPLATE = {
  push: [
    { exerciseId: "1", name: "Bench Press", sets: 4, reps: "6-8", restTime: 180 },
    { exerciseId: "2", name: "Incline Dumbbell Press", sets: 3, reps: "8-10", restTime: 120 },
    { exerciseId: "3", name: "Dumbbell Flyes", sets: 3, reps: "10-12", restTime: 90 },
    { exerciseId: "10", name: "Overhead Press", sets: 3, reps: "8-10", restTime: 120 },
    { exerciseId: "11", name: "Lateral Raises", sets: 4, reps: "12-15", restTime: 60 },
  ],
  pull: [
    { exerciseId: "4", name: "Deadlift", sets: 3, reps: "5-6", restTime: 180 },
    { exerciseId: "5", name: "Pull-ups", sets: 4, reps: "8-12", restTime: 120 },
    { exerciseId: "6", name: "Bent-Over Rows", sets: 4, reps: "8-10", restTime: 120 },
    { exerciseId: "12", name: "Face Pulls", sets: 3, reps: "15-20", restTime: 60 },
  ],
  legs: [
    { exerciseId: "7", name: "Squats", sets: 4, reps: "6-8", restTime: 180 },
    { exerciseId: "8", name: "Romanian Deadlift", sets: 3, reps: "8-10", restTime: 120 },
    { exerciseId: "9", name: "Leg Press", sets: 3, reps: "12-15", restTime: 90 },
  ]
};

export function getExerciseById(id: string): Exercise | undefined {
  return DEFAULT_EXERCISES.find(exercise => exercise.id === id);
}

export function getExercisesByCategory(category: string): Exercise[] {
  return DEFAULT_EXERCISES.filter(exercise => exercise.category === category);
}

export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  return DEFAULT_EXERCISES.filter(exercise => 
    exercise.muscleGroups.includes(muscleGroup)
  );
}
