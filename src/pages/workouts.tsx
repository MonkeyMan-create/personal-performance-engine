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
    color: template.difficulty === 'beginner' ? 'from-green-500 to-emerald-500' :
           template.difficulty === 'intermediate' ? 'from-orange-500 to-yellow-500' :
           'from-red-500 to-red-600'
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
    switch (difficulty) {
      case 'Beginner':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-700',
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-600 dark:text-green-400'
        }
      case 'Intermediate':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-700 dark:text-orange-300',
          border: 'border-orange-200 dark:border-orange-700',
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-600 dark:text-orange-400'
        }
      case 'Advanced':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-700',
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-600 dark:text-red-400'
        }
      default:
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200 dark:border-purple-700',
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-600 dark:text-purple-400'
        }
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
                                className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded"
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
                            <div key={index} className="border-l-2 border-purple-400 pl-3">
                              <p className="font-medium text-slate-900 dark:text-white">{exercise.name}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {exercise.sets.map((set, setIndex) => (
                                  <span 
                                    key={setIndex}
                                    className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-slate-700 dark:text-slate-300"
                                  >
                                    {formatWeight(set.weight, 'lbs')} × {set.reps} (RIR {set.rir})
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
            {/* Header */}
            <div className="flex items-center justify-between pt-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Workouts</h1>
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
              <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-400/50 dark:border-purple-600/50">
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
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      data-testid="button-continue-workout"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discovery-Focused Header Section */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex-1 h-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:shadow-teal-500/25"
                  data-testid="button-find-workout"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find a Workout
                </Button>
                <Button
                  onClick={handleStartWorkout}
                  variant="outline"
                  className="flex-1 h-12 border-purple-400/50 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:border-purple-600"
                  data-testid="button-create-custom"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Custom
                </Button>
              </div>
            </div>

            {/* Your Next Workout - Most Prominent Element */}
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 border-0 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between text-white mb-4">
                  <div>
                    <p className="text-sm font-medium text-teal-100 mb-1">YOUR NEXT WORKOUT</p>
                    <h2 className="text-2xl font-bold mb-2">{recommendedWorkout.title}</h2>
                    <p className="text-teal-100 mb-3">{recommendedWorkout.description}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <recommendedWorkout.icon className="w-8 h-8" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-teal-100" />
                      <span className="text-sm text-teal-100">Duration</span>
                    </div>
                    <p className="text-lg font-semibold">{recommendedWorkout.duration} min</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-teal-100" />
                      <span className="text-sm text-teal-100">Exercises</span>
                    </div>
                    <p className="text-lg font-semibold">{recommendedWorkout.exercises} exercises</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-teal-100">Difficulty</p>
                      <p className="text-sm font-medium">{recommendedWorkout.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-xs text-teal-100">Type</p>
                      <p className="text-sm font-medium">{recommendedWorkout.type}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleStartWorkout}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8"
                    data-testid="button-start-session"
                  >
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Discover Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  onClick={() => setShowTemplateSelector(true)}
                  data-testid="button-view-all-templates"
                >
                  View All
                </Button>
              </div>

              {/* Horizontally Scrollable Template Cards */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4 min-w-max">
                  {workoutTemplates.map((template) => {
                    const IconComponent = template.icon
                    const colors = getDifficultyColors(template.difficulty)
                    return (
                      <Card
                        key={template.id}
                        className="min-w-[280px] bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        onClick={() => handleSelectTemplateFromCard(template)}
                        data-testid={`template-card-${template.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                              <IconComponent className={`w-5 h-5 ${colors.iconColor}`} />
                            </div>
                            <span className={`text-xs ${colors.bg} ${colors.text} ${colors.border} px-2 py-1 rounded-full border`}>
                              {template.difficulty}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{template.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{template.description}</p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3" />
                              {template.duration} min
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <Target className="w-3 h-3" />
                              {template.exercises} exercises
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
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{workouts.length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Total Workouts</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
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