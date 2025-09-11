import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, X, Minus, Save, Trash2 } from 'lucide-react'
import { saveWorkoutLocally, getWorkoutsLocally, GuestWorkout } from '../utils/guestStorage'

interface ExerciseForm {
  name: string
  sets: {
    weight: string
    reps: string
    rir: string
  }[]
}

interface WorkoutForm {
  exercises: ExerciseForm[]
  duration: string
  notes: string
}

export default function WorkoutsPage() {
  const { user, isGuestMode } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [workouts, setWorkouts] = useState<GuestWorkout[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>({
    exercises: [{ name: '', sets: [{ weight: '', reps: '', rir: '2' }] }],
    duration: '',
    notes: ''
  })

  // Load workouts on component mount
  useEffect(() => {
    const loadWorkouts = async () => {
      setIsLoading(true)
      try {
        if (isGuestMode) {
          // Load workouts from localStorage for guest users
          const guestWorkouts = getWorkoutsLocally()
          // Sort by date (most recent first)
          const sortedWorkouts = guestWorkouts.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setWorkouts(sortedWorkouts)
        } else if (user) {
          // TODO: Load workouts from Firebase/cloud for authenticated users
          // This would be implemented when connecting to the backend
          setWorkouts([])
        }
      } catch (error) {
        console.error('Failed to load workouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user || isGuestMode) {
      loadWorkouts()
    }
  }, [user, isGuestMode])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Workouts"
        description="Track your exercises with RIR (Reps in Reserve) for optimal progressive overload and muscle growth."
      />
    )
  }

  const addExercise = () => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: [{ weight: '', reps: '', rir: '2' }] }]
    }))
  }

  const removeExercise = (exerciseIndex: number) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex)
    }))
  }

  const addSet = (exerciseIndex: number) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex 
          ? { ...exercise, sets: [...exercise.sets, { weight: '', reps: '', rir: '2' }] }
          : exercise
      )
    }))
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex 
          ? { ...exercise, sets: exercise.sets.filter((_, sIndex) => sIndex !== setIndex) }
          : exercise
      )
    }))
  }

  const updateExerciseName = (exerciseIndex: number, name: string) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex ? { ...exercise, name } : exercise
      )
    }))
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps' | 'rir', value: string) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex 
          ? {
              ...exercise, 
              sets: exercise.sets.map((set, sIndex) => 
                sIndex === setIndex ? { ...set, [field]: value } : set
              )
            }
          : exercise
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate form
      const validExercises = workoutForm.exercises.filter(exercise => 
        exercise.name.trim() && exercise.sets.some(set => 
          set.weight.trim() && set.reps.trim() && set.rir.trim()
        )
      )

      if (validExercises.length === 0) {
        throw new Error('Please add at least one exercise with complete set information')
      }

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      
      const workoutToSave = {
        date: today,
        exercises: validExercises.map(exercise => ({
          name: exercise.name.trim(),
          sets: exercise.sets
            .filter(set => set.weight.trim() && set.reps.trim() && set.rir.trim())
            .map(set => ({
              weight: parseFloat(set.weight),
              reps: parseInt(set.reps),
              rir: parseInt(set.rir)
            }))
        })),
        duration: workoutForm.duration ? parseInt(workoutForm.duration) : undefined,
        notes: workoutForm.notes.trim() || undefined
      }

      if (isGuestMode) {
        // Save to localStorage for guest users
        const savedId = saveWorkoutLocally(workoutToSave)
        // Reload workouts from localStorage
        const updatedWorkouts = getWorkoutsLocally().sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setWorkouts(updatedWorkouts)
      } else if (user) {
        // TODO: Save to Firebase/cloud for authenticated users
        console.log('Would save to cloud:', workoutToSave)
      }

      // Reset form
      setShowForm(false)
      setWorkoutForm({
        exercises: [{ name: '', sets: [{ weight: '', reps: '', rir: '2' }] }],
        duration: '',
        notes: ''
      })
    } catch (error) {
      console.error('Failed to save workout:', error)
      alert(error instanceof Error ? error.message : 'Failed to save workout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Workouts</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20"
            data-testid="button-add-workout"
          >
            <Plus className="w-4 h-4 mr-2" />
            + Add Workout
          </Button>
        </div>

        {showForm && (
          <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Log Workout</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  data-testid="button-close-form"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Track your exercises with RIR (Reps in Reserve)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Exercises */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Exercises</h3>
                    <Button
                      type="button"
                      onClick={addExercise}
                      size="sm"
                      variant="outline"
                      className="border-cyan-400/50 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
                      data-testid="button-add-exercise"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Exercise
                    </Button>
                  </div>

                  {workoutForm.exercises.map((exercise, exerciseIndex) => (
                    <Card key={exerciseIndex} className="bg-slate-50/50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Exercise name (e.g., Bench Press)"
                            value={exercise.name}
                            onChange={(e) => updateExerciseName(exerciseIndex, e.target.value)}
                            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            data-testid={`input-exercise-name-${exerciseIndex}`}
                            required
                          />
                          {workoutForm.exercises.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeExercise(exerciseIndex)}
                              size="icon"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                              data-testid={`button-remove-exercise-${exerciseIndex}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Sets */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sets</span>
                            <Button
                              type="button"
                              onClick={() => addSet(exerciseIndex)}
                              size="sm"
                              variant="ghost"
                              className="text-xs text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
                              data-testid={`button-add-set-${exerciseIndex}`}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Set
                            </Button>
                          </div>

                          {/* Set Headers */}
                          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 px-2">
                            <span>Weight</span>
                            <span>Reps</span>
                            <span>RIR</span>
                            <span></span>
                          </div>

                          {exercise.sets.map((set, setIndex) => (
                            <div key={setIndex} className="grid grid-cols-4 gap-2">
                              <input
                                type="number"
                                placeholder="135"
                                value={set.weight}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                                className="p-1.5 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500"
                                data-testid={`input-weight-${exerciseIndex}-${setIndex}`}
                                min="0"
                                step="0.5"
                              />
                              <input
                                type="number"
                                placeholder="8"
                                value={set.reps}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                                className="p-1.5 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500"
                                data-testid={`input-reps-${exerciseIndex}-${setIndex}`}
                                min="1"
                              />
                              <input
                                type="number"
                                placeholder="2"
                                value={set.rir}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'rir', e.target.value)}
                                className="p-1.5 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500"
                                data-testid={`input-rir-${exerciseIndex}-${setIndex}`}
                                min="0"
                                max="10"
                              />
                              {exercise.sets.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeSet(exerciseIndex, setIndex)}
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  data-testid={`button-remove-set-${exerciseIndex}-${setIndex}`}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Duration and Notes */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      value={workoutForm.duration}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="45"
                      min="1"
                      data-testid="input-duration"
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      id="notes"
                      value={workoutForm.notes}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Great workout today!"
                      data-testid="input-notes"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 disabled:opacity-50"
                    data-testid="button-submit-workout"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Workout'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    data-testid="button-cancel-workout"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Workouts List */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Recent Workouts</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Your logged workouts and exercise sessions {isGuestMode && '(Guest Mode - stored locally)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-slate-600 dark:text-slate-300">Loading workouts...</p>
            ) : workouts.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-300">No workouts logged yet. Start by adding your first workout!</p>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div 
                    key={workout.id} 
                    className="p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-lg"
                    data-testid={`workout-item-${workout.id}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {new Date(workout.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        {workout.duration && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">{workout.duration} minutes</p>
                        )}
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="border-l-2 border-cyan-400 pl-3">
                          <p className="font-medium text-slate-900 dark:text-white">{exercise.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {exercise.sets.map((set, setIndex) => (
                              <span 
                                key={setIndex}
                                className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-slate-700 dark:text-slate-300"
                              >
                                {set.weight}lbs × {set.reps} (RIR {set.rir})
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {workout.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{workout.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}