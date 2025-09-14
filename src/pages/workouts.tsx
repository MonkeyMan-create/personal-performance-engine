import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import ExerciseSearch from '../components/ExerciseSearch'
import LazyActiveSetView from '../components/LazyActiveSetView'
import LazyWorkoutTemplateSelector from '../components/LazyWorkoutTemplateSelector'
import { convertTemplateToWorkoutForm, WORKOUT_TEMPLATES, getTemplateById } from '../utils/workoutTemplates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Play, History, Zap, Plus, CheckCircle, Timer, Target, ArrowLeft, Dumbbell, Heart, Flame, Activity, Search, Clock, Calendar } from 'lucide-react'
import { 
  getWorkoutsLocally, 
  getCurrentWorkoutSession, 
  startWorkoutSession, 
  finishWorkoutSession, 
  cancelWorkoutSession,
  GuestWorkout 
} from '../utils/guestStorage'
import { useMeasurement } from '../contexts/MeasurementContext'
import { useToast } from '../hooks/use-toast'

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
  const { formatWeight } = useMeasurement()
  const { toast } = useToast()
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

  // Workout templates data - display summaries mapped from actual templates
  const workoutTemplates = WORKOUT_TEMPLATES.map(template => ({
    id: template.id,
    title: template.name,
    description: template.description,
    duration: parseInt(template.duration),
    exercises: template.exercises.length,
    difficulty: template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1),
    type: template.category.charAt(0).toUpperCase() + template.category.slice(1),
    icon: template.category === 'strength' ? Dumbbell : 
          template.category === 'cardio' ? Heart : 
          template.category === 'hybrid' ? Activity : Target,
    color: template.difficulty === 'beginner' ? 'from-[var(--color-activity)] to-[var(--color-activity)]/80' :
           template.difficulty === 'intermediate' ? 'from-[var(--color-activity)] to-[var(--color-activity)]/80' :
           'from-[var(--color-activity)] to-[var(--color-activity)]/80'
  }))

  // Recommended workout (featured)
  const recommendedWorkout = workoutTemplates[0]

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
        // Show success toast
        const sessionSummary = getSessionSummary()
        toast({
          title: "Workout Completed! 🏆",
          description: `Great job! You completed ${sessionSummary?.uniqueExercises || 0} exercises with ${sessionSummary?.totalSets || 0} total sets.`,
        })
        
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
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      })
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
    setShowTemplateSelector(false)
    // Start a workout with the template data
    handleStartWorkout()
  }

  const handleSelectTemplateFromCard = (template: any) => {
    // Get the actual template from the templates database using the ID
    const actualTemplate = getTemplateById(template.id)
    if (!actualTemplate) {
      console.error('Template not found:', template.id)
      return
    }
    
    const templateForm = convertTemplateToWorkoutForm(actualTemplate)
    handleTemplateSelection(templateForm)
  }

  const getSessionSummary = () => {
    if (!currentSession) return null
    
    const totalSets = currentSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    const uniqueExercises = currentSession.exercises.length
    
    return { totalSets, uniqueExercises }
  }

  const getDifficultyColors = (difficulty: string) => {
    // Use activity theme colors for all difficulty levels to ensure consistency with theme system
    return {
      bg: 'bg-[var(--color-activity)]/10',
      text: 'text-[var(--color-activity)]',
      border: 'border-[var(--color-activity)]/20',
      iconBg: 'bg-[var(--color-activity)]/20',
      iconColor: 'text-[var(--color-activity)]'
    }
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
        <div className="min-h-screen bg-[var(--color-background)]">
          <div className="container mx-auto p-4 space-y-6 pb-24">
            {/* Header with session info */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[var(--color-activity)] to-[var(--color-activity)]/80 rounded-xl shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    Active Workout
                    <span className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                  </h1>
                  {currentSession && (
                    <p className="text-[var(--color-text-secondary)] font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets || 0} sets logged
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleFinishWorkout}
                  className="bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white shadow-lg hover:shadow-xl font-semibold px-6"
                  data-testid="button-finish-workout"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finish Workout
                </Button>
                <Button
                  onClick={handleCancelWorkout}
                  variant="outline"
                  className="border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 shadow-sm font-medium"
                  data-testid="button-cancel-workout"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Current session summary */}
            {currentSession && currentSession.exercises.length > 0 && (
              <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-lg backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-activity)]/20 rounded-lg">
                      <Timer className="w-5 h-5 text-[var(--color-activity)]" />
                    </div>
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentSession.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-activity)]/5 to-[var(--color-activity)]/10 rounded-xl border border-[var(--color-activity)]/10">
                        <div className="flex-1">
                          <p className="font-bold text-[var(--color-text-primary)] mb-2">{exercise.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {exercise.sets.map((set, setIndex) => (
                              <span 
                                key={setIndex}
                                className="text-xs bg-[var(--color-activity)]/15 text-[var(--color-activity)] border border-[var(--color-activity)]/20 px-3 py-1 rounded-full font-medium"
                              >
                                {set.weight}lbs × {set.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectExercise(exercise.name)}
                          size="sm"
                          className="bg-[var(--color-activity)] hover:bg-[var(--color-activity-hover)] text-white shadow-md font-medium ml-4"
                          data-testid={`button-continue-exercise-${exercise.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exercise search overlay */}
            <ExerciseSearch
              isOpen={true}
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
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-2xl backdrop-blur-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success)]/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                Great Workout! 🎉
              </CardTitle>
              <CardDescription className="text-[var(--color-text-secondary)] text-lg flex items-center justify-center gap-2">
                <Timer className="w-4 h-4 text-[var(--color-activity)]" />
                Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets} sets • {getSessionSummary()?.uniqueExercises} exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workout Summary */}
              {currentSession && (
                <div className="bg-gradient-to-r from-[var(--color-activity)]/10 to-[var(--color-activity)]/5 border border-[var(--color-activity)]/20 p-4 rounded-xl space-y-3">
                  <p className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                    Exercises Completed:
                  </p>
                  {currentSession.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-[var(--color-surface)] rounded-lg">
                      <span className="text-[var(--color-text-primary)] font-medium">{exercise.name}</span>
                      <span className="text-[var(--color-activity)] font-bold bg-[var(--color-activity)]/10 px-2 py-1 rounded">{exercise.sets.length} sets</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="workout-duration" className="block text-sm font-bold mb-2 text-[var(--color-text-primary)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-activity)]" />
                    Duration (minutes) - optional
                  </label>
                  <Input
                    id="workout-duration"
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    placeholder="45"
                    min="1"
                    className="bg-[var(--color-surface)] border-[var(--color-border)] focus:border-[var(--color-activity)] transition-colors"
                    data-testid="input-finish-workout-duration"
                  />
                </div>
                <div>
                  <label htmlFor="workout-notes" className="block text-sm font-bold mb-2 text-[var(--color-text-primary)] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[var(--color-activity)]" />
                    Notes - optional
                  </label>
                  <Input
                    id="workout-notes"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="Great workout today!"
                    className="bg-[var(--color-surface)] border-[var(--color-border)] focus:border-[var(--color-activity)] transition-colors"
                    data-testid="input-finish-workout-notes"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  onClick={handleCompleteWorkout}
                  disabled={isLoading}
                  className="flex-1 bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white shadow-lg hover:shadow-xl font-bold text-lg py-3"
                  data-testid="button-complete-workout"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Save Workout
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setViewMode('exercise-selection')}
                  variant="outline"
                  className="flex-1 border-[var(--color-border)] hover:bg-[var(--color-surface)] font-medium py-3"
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
        <div className="min-h-screen bg-[var(--color-background)]">
          <div className="container mx-auto p-4 space-y-6 pb-24">
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[var(--color-activity)] to-[var(--color-activity)]/80 rounded-xl shadow-lg">
                  <History className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Workout History</h1>
                  <p className="text-[var(--color-text-secondary)]">Your training journey and achievements</p>
                </div>
              </div>
              <Button
                onClick={() => setViewMode('overview')}
                variant="outline"
                className="border-[var(--color-activity)]/30 text-[var(--color-activity)] hover:bg-[var(--color-activity)]/10 shadow-sm font-medium"
                data-testid="button-back-to-overview"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-lg backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-[var(--color-text-primary)] flex items-center gap-3">
                  <div className="p-2 bg-[var(--color-activity)]/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-[var(--color-activity)]" />
                  </div>
                  Recent Workouts
                </CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Your logged workouts and exercise sessions {isGuestMode && '(Guest Mode - stored locally)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-[var(--color-activity)]/30 border-t-[var(--color-activity)] rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-[var(--color-text-secondary)]">Loading workouts...</p>
                  </div>
                ) : workouts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-[var(--color-activity)]/10 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Dumbbell className="w-8 h-8 text-[var(--color-activity)]" />
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-lg">No workouts logged yet. Start your first workout!</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {workouts.map((workout) => (
                      <div 
                        key={workout.id} 
                        className="p-5 bg-gradient-to-r from-[var(--color-activity)]/5 to-[var(--color-activity)]/10 rounded-xl border border-[var(--color-activity)]/15 hover:shadow-lg transition-all duration-200"
                        data-testid={`workout-item-${workout.id}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-activity)] rounded-lg">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-[var(--color-text-primary)]">
                                {new Date(workout.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              {workout.duration && (
                                <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {workout.duration} minutes
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm bg-[var(--color-activity)]/15 text-[var(--color-activity)] px-3 py-1 rounded-full font-medium">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {workout.exercises.map((exercise, index) => (
                            <div key={index} className="border-l-4 border-[var(--color-activity)] bg-[var(--color-surface)] rounded-r-lg pl-4 py-3">
                              <p className="font-bold text-[var(--color-text-primary)] mb-2">{exercise.name}</p>
                              <div className="flex flex-wrap gap-2">
                                {exercise.sets.map((set, setIndex) => (
                                  <span 
                                    key={setIndex}
                                    className="text-xs bg-[var(--color-activity)]/15 border border-[var(--color-activity)]/20 text-[var(--color-activity)] px-3 py-1 rounded-full font-medium"
                                  >
                                    {formatWeight(set.weight, 'lbs')} × {set.reps} (RIR {set.rir})
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {workout.notes && (
                          <div className="mt-4 pt-4 border-t border-[var(--color-activity)]/20">
                            <div className="flex items-start gap-2">
                              <Heart className="w-4 h-4 text-[var(--color-activity)] mt-0.5" />
                              <p className="text-sm text-[var(--color-text-secondary)] italic">{workout.notes}</p>
                            </div>
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
        <div className="min-h-screen bg-[var(--color-background)]">
          <div className="container mx-auto p-4 space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between pt-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[var(--color-activity)] to-[var(--color-activity)]/80 rounded-xl">
                    <Dumbbell className="w-7 h-7 text-white" />
                  </div>
                  My Workouts
                </h1>
                <p className="text-[var(--color-text-secondary)] ml-[52px]">Track your strength training with precision</p>
              </div>
              <Button
                onClick={() => setViewMode('history')}
                variant="outline"
                className="border-[var(--color-activity)]/30 text-[var(--color-activity)] hover:bg-[var(--color-activity)]/10 dark:text-[var(--color-activity)] dark:hover:bg-[var(--color-activity)]/15 dark:border-[var(--color-activity)]/40 shadow-sm"
                data-testid="button-view-history"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>

            {/* Active Session Banner */}
            {currentSession && (
              <Card className="bg-gradient-to-r from-[var(--color-activity)]/15 via-[var(--color-activity)]/10 to-[var(--color-activity)]/15 border-[var(--color-activity)]/30 shadow-lg ring-1 ring-[var(--color-activity)]/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[var(--color-activity)] rounded-xl shadow-md">
                        <Timer className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                          Active Workout In Progress
                          <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                          {formatSessionDuration()} • {getSessionSummary()?.totalSets} sets logged
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setViewMode('exercise-selection')}
                      className="bg-[var(--color-activity)] hover:bg-[var(--color-activity-hover)] text-white shadow-lg hover:shadow-xl font-semibold px-6"
                      data-testid="button-continue-workout"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discovery-Focused Header Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowTemplateSelector(true)}
                  className="h-14 bg-gradient-to-r from-[var(--color-action)] to-[var(--color-action)]/90 hover:from-[var(--color-action-hover)] hover:to-[var(--color-action-hover)]/90 text-white shadow-lg hover:shadow-xl hover:shadow-[var(--color-action)]/30 transition-all duration-200 font-semibold"
                  data-testid="button-find-workout"
                >
                  <Search className="w-5 h-5 mr-3" />
                  Find a Workout
                </Button>
                <Button
                  onClick={handleStartWorkout}
                  variant="outline"
                  className="h-14 border-2 border-[var(--color-activity)]/50 text-[var(--color-activity)] hover:bg-[var(--color-activity)]/10 dark:text-[var(--color-activity)] dark:hover:bg-[var(--color-activity)]/15 dark:border-[var(--color-activity)]/60 shadow-sm hover:shadow-md font-semibold transition-all duration-200"
                  data-testid="button-create-custom"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Create Custom
                </Button>
              </div>
            </div>

            {/* Your Next Workout - Most Prominent Element */}
            <Card className="bg-gradient-to-br from-[var(--color-activity)] via-[var(--color-activity)]/95 to-[var(--color-activity)]/90 border-0 shadow-2xl shadow-[var(--color-activity)]/30 hover:shadow-[var(--color-activity)]/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none"></div>
              <CardContent className="p-7 relative">
                <div className="flex items-start justify-between text-white mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4" />
                      <p className="text-xs font-bold tracking-wider text-white/90 uppercase">Featured Workout</p>
                    </div>
                    <h2 className="text-3xl font-bold mb-3 leading-tight">{recommendedWorkout.title}</h2>
                    <p className="text-white/90 mb-4 text-lg leading-relaxed">{recommendedWorkout.description}</p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-lg border border-white/20 shadow-lg">
                    <recommendedWorkout.icon className="w-9 h-9" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="bg-white/15 rounded-xl p-4 backdrop-blur-lg border border-white/20 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-white/90" />
                      <span className="text-sm text-white/90 font-medium">Duration</span>
                    </div>
                    <p className="text-xl font-bold">{recommendedWorkout.duration} min</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-4 backdrop-blur-lg border border-white/20 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-white/90" />
                      <span className="text-sm text-white/90 font-medium">Exercises</span>
                    </div>
                    <p className="text-xl font-bold">{recommendedWorkout.exercises} exercises</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <div className="bg-white/10 rounded-lg px-3 py-2">
                      <p className="text-xs text-white/80 font-medium mb-1">Difficulty</p>
                      <p className="text-sm font-bold">{recommendedWorkout.difficulty}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg px-3 py-2">
                      <p className="text-xs text-white/80 font-medium mb-1">Type</p>
                      <p className="text-sm font-bold">{recommendedWorkout.type}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleStartWorkout}
                    size="lg"
                    className="bg-white text-[var(--color-activity)] hover:bg-white/95 font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="button-start-session"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workout Template Selector Modal */}
            {showTemplateSelector && (
              <LazyWorkoutTemplateSelector
                isOpen={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                onSelectTemplate={handleTemplateSelection}
              />
            )}

            {/* Discover Templates Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[var(--color-action)] to-[var(--color-action)]/80 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Discover Templates</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--color-action)] hover:text-[var(--color-action-hover)] hover:bg-[var(--color-action)]/10 font-medium"
                  onClick={() => setShowTemplateSelector(true)}
                  data-testid="button-view-all-templates"
                >
                  View All
                  <Target className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Horizontally Scrollable Template Cards */}
              <div className="overflow-x-auto pb-3">
                <div className="flex gap-5 min-w-max">
                  {workoutTemplates.map((template) => {
                    const IconComponent = template.icon
                    const colors = getDifficultyColors(template.difficulty)
                    return (
                      <Card
                        key={template.id}
                        className="min-w-[300px] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-lg hover:shadow-xl hover:shadow-[var(--color-activity)]/20 transition-all duration-300 hover:scale-[1.03] cursor-pointer hover:-translate-y-1 backdrop-blur-xl overflow-hidden relative"
                        onClick={() => handleSelectTemplateFromCard(template)}
                        data-testid={`template-card-${template.id}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-activity)]/5 via-transparent to-[var(--color-activity)]/5 pointer-events-none"></div>
                        <CardContent className="p-5 relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-[var(--color-activity)] to-[var(--color-activity)]/80 rounded-xl shadow-md">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs bg-[var(--color-activity)]/10 text-[var(--color-activity)] border border-[var(--color-activity)]/20 px-3 py-1 rounded-full font-medium">
                              {template.difficulty}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-[var(--color-text-primary)] mb-2 text-lg">{template.title}</h3>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">{template.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-3 py-2 rounded-lg">
                              <Clock className="w-4 h-4 text-[var(--color-activity)]" />
                              <span className="font-medium">{template.duration} min</span>
                            </div>
                            <div className="flex items-center gap-1 text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-3 py-2 rounded-lg">
                              <Target className="w-4 h-4 text-[var(--color-activity)]" />
                              <span className="font-medium">{template.exercises} exercises</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {workouts.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-activity)] dark:text-[var(--color-activity)]">{workouts.length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Total Workouts</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-activity)] dark:text-[var(--color-activity)]">
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