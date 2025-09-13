import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import LazyExerciseSelector from '../components/LazyExerciseSelector'
import LazyActiveSetView from '../components/LazyActiveSetView'
import LazyWorkoutTemplateSelector from '../components/LazyWorkoutTemplateSelector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Play, History, Zap, Plus, CheckCircle, Timer, Target, ArrowLeft } from 'lucide-react'
import { 
  getWorkoutsLocally, 
  getCurrentWorkoutSession, 
  startWorkoutSession, 
  finishWorkoutSession, 
  cancelWorkoutSession,
  GuestWorkout 
} from '../utils/guestStorage'

type ViewMode = 'overview' | 'exercise-selection' | 'active-set' | 'finish-workout' | 'history'

interface WorkoutForm {
  exercises: {
    name: string
    sets: { weight: string; reps: string; rir: string }[]
  }[]
  duration: string
  notes: string
}

export default function WorkoutsPage() {
  const { user, isGuestMode } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [workouts, setWorkouts] = useState<GuestWorkout[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState(getCurrentWorkoutSession())
  
  // Template selector state (for backward compatibility)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>({
    exercises: [{ name: '', sets: [{ weight: '', reps: '', rir: '2' }] }],
    duration: '',
    notes: ''
  })

  // Finish workout form state
  const [workoutDuration, setWorkoutDuration] = useState('')
  const [workoutNotes, setWorkoutNotes] = useState('')

  // Load workouts and current session on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (isGuestMode || user) {
          const guestWorkouts = getWorkoutsLocally()
          const sortedWorkouts = guestWorkouts.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setWorkouts(sortedWorkouts)
          
          // Check for active session
          const session = getCurrentWorkoutSession()
          setCurrentSession(session)
          if (session && session.exercises.length > 0) {
            // If there's an active session, show exercise selection
            setViewMode('exercise-selection')
          }
        }
      } catch (error) {
        console.error('Failed to load workouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user || isGuestMode) {
      loadData()
    }
  }, [user, isGuestMode])

  // Refresh current session periodically
  useEffect(() => {
    const refreshSession = () => {
      setCurrentSession(getCurrentWorkoutSession())
    }
    
    const interval = setInterval(refreshSession, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Workouts"
        description="Track your exercises with RIR (Reps in Reserve) for optimal progressive overload and muscle growth."
      />
    )
  }

  const handleStartWorkout = () => {
    startWorkoutSession()
    setCurrentSession(getCurrentWorkoutSession())
    setViewMode('exercise-selection')
  }

  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName)
    setViewMode('active-set')
  }

  const handleFinishExercise = () => {
    setViewMode('exercise-selection')
  }

  const handleBackToSelection = () => {
    setViewMode('exercise-selection')
  }

  const handleFinishWorkout = () => {
    setViewMode('finish-workout')
  }

  const handleCompleteWorkout = async () => {
    setIsLoading(true)
    try {
      const duration = workoutDuration ? parseInt(workoutDuration) : undefined
      const notes = workoutNotes.trim() || undefined
      
      const workoutId = finishWorkoutSession(duration, notes)
      
      if (workoutId) {
        // Reload workouts
        const updatedWorkouts = getWorkoutsLocally().sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setWorkouts(updatedWorkouts)
        
        // Reset state
        setCurrentSession(null)
        setWorkoutDuration('')
        setWorkoutNotes('')
        setViewMode('overview')
      } else {
        throw new Error('Failed to save workout')
      }
    } catch (error) {
      console.error('Failed to complete workout:', error)
      alert('Failed to save workout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelWorkout = () => {
    if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
      cancelWorkoutSession()
      setCurrentSession(null)
      setViewMode('overview')
    }
  }

  const handleTemplateSelection = (templateForm: WorkoutForm) => {
    setWorkoutForm(templateForm)
    // For now, just start a workout - could extend to pre-populate exercises
    handleStartWorkout()
  }

  const getSessionSummary = () => {
    if (!currentSession) return null
    
    const totalSets = currentSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    const uniqueExercises = currentSession.exercises.length
    
    return { totalSets, uniqueExercises }
  }

  const formatSessionDuration = () => {
    if (!currentSession) return '0:00'
    
    const start = new Date(currentSession.startTime)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)
    
    return `${diffMins}:${diffSecs.toString().padStart(2, '0')}`
  }

  // Render different views based on current state
  switch (viewMode) {
    case 'exercise-selection':
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto p-4 space-y-6 pb-24">
            {/* Header with session info */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active Workout</h1>
                {currentSession && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets || 0} sets logged
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleFinishWorkout}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-finish-workout"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finish Workout
                </Button>
                <Button
                  onClick={handleCancelWorkout}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                  data-testid="button-cancel-workout"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Current session summary */}
            {currentSession && currentSession.exercises.length > 0 && (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Timer className="w-5 h-5 mr-2" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSession.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{exercise.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {exercise.sets.map((set, setIndex) => (
                              <span 
                                key={setIndex}
                                className="text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded"
                              >
                                {set.weight}lbs × {set.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectExercise(exercise.name)}
                          size="sm"
                          className="bg-slate-600 hover:bg-slate-700 text-white"
                          data-testid={`button-continue-exercise-${exercise.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          Continue
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exercise selector overlay */}
            <LazyExerciseSelector
              onSelectExercise={handleSelectExercise}
              onClose={() => setViewMode('overview')}
            />
          </div>
        </div>
      )

    case 'active-set':
      return (
        <LazyActiveSetView
          exerciseName={selectedExercise}
          onFinishExercise={handleFinishExercise}
          onBackToSelection={handleBackToSelection}
        />
      )

    case 'finish-workout':
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Great Workout! 🎉
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets} sets • {getSessionSummary()?.uniqueExercises} exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workout Summary */}
              {currentSession && (
                <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Exercises Completed:</p>
                  {currentSession.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{exercise.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">{exercise.sets.length} sets</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Details */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="workout-duration" className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">
                    Duration (minutes) - optional
                  </label>
                  <Input
                    id="workout-duration"
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    placeholder="45"
                    min="1"
                    className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                    data-testid="input-finish-workout-duration"
                  />
                </div>
                <div>
                  <label htmlFor="workout-notes" className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">
                    Notes - optional
                  </label>
                  <Input
                    id="workout-notes"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="Great workout today!"
                    className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                    data-testid="input-finish-workout-notes"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCompleteWorkout}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-complete-workout"
                >
                  {isLoading ? 'Saving...' : 'Save Workout'}
                </Button>
                <Button
                  onClick={() => setViewMode('exercise-selection')}
                  variant="outline"
                  className="flex-1 border-slate-300 dark:border-slate-600"
                  data-testid="button-back-to-exercises"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    case 'history':
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto p-4 space-y-6 pb-24">
            <div className="flex items-center justify-between pt-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workout History</h1>
              <Button
                onClick={() => setViewMode('overview')}
                variant="outline"
                className="border-slate-300 dark:border-slate-600"
                data-testid="button-back-to-overview"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

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
                  <p className="text-slate-600 dark:text-slate-300">No workouts logged yet. Start your first workout!</p>
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

    default: // 'overview'
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto p-4 space-y-6 pb-24">
            <div className="flex items-center justify-between pt-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workouts</h1>
              <Button
                onClick={() => setViewMode('history')}
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                data-testid="button-view-history"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>

            {/* Active Session Banner */}
            {currentSession && (
              <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/50 dark:border-cyan-600/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Active Workout In Progress</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {formatSessionDuration()} • {getSessionSummary()?.totalSets} sets logged
                      </p>
                    </div>
                    <Button
                      onClick={() => setViewMode('exercise-selection')}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      data-testid="button-continue-workout"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Start Training
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Choose how you'd like to start your workout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleStartWorkout}
                  className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25"
                  data-testid="button-start-workout"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Custom Workout
                </Button>
                
                <Button
                  onClick={() => setShowTemplateSelector(true)}
                  variant="outline"
                  className="w-full h-12 border-cyan-400/50 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20 dark:border-cyan-600"
                  data-testid="button-use-template"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Use Workout Template
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {workouts.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{workouts.length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Total Workouts</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {workouts.reduce((total, workout) => 
                        total + workout.exercises.reduce((sets, ex) => sets + ex.sets.length, 0), 0
                      )}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Total Sets</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Template Selector */}
            <LazyWorkoutTemplateSelector
              isOpen={showTemplateSelector}
              onClose={() => setShowTemplateSelector(false)}
              onSelectTemplate={handleTemplateSelection}
            />
          </div>
        </div>
      )
  }
}