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
import { Play, History, Zap, Plus, CheckCircle, Timer, Target, ArrowLeft, Dumbbell, Heart, Flame, Activity, Search, Clock, Calendar, Trophy } from 'lucide-react'
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
    colorClass: 'card-activity'
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
        <div className="page-container">
          <div className="section-container space-y-6">
            {/* Header with session info */}
            <div className="flex-between pt-6">
              <div className="flex-start gap-4">
                <div className="icon-badge icon-badge-activity">
                  <Activity className="w-7 h-7 text-activity" />
                </div>
                <div>
                  <h1 className="page-title flex-center gap-2">
                    Active Workout
                    <span className="w-3 h-3 bg-success rounded-full animate-pulse"></span>
                  </h1>
                  {currentSession && (
                    <p className="text-secondary font-medium flex-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets || 0} sets logged
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleFinishWorkout}
                  className="button-base button-default bg-success hover:bg-success/90 shadow-lg hover:shadow-xl font-semibold px-6"
                  style={{ color: 'var(--color-text-on-success)' }}
                  data-testid="button-finish-workout"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finish Workout
                </Button>
                <Button
                  onClick={handleCancelWorkout}
                  variant="outline"
                  className="button-base button-outline border-error text-error hover:bg-error/10 shadow-sm font-medium"
                  data-testid="button-cancel-workout"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Current session summary */}
            {currentSession && currentSession.exercises.length > 0 && (
              <Card className="card-activity">
                <CardHeader>
                  <CardTitle className="text-primary flex-start gap-3">
                    <div className="icon-badge icon-badge-activity">
                      <Timer className="w-5 h-5 text-activity" />
                    </div>
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentSession.exercises.map((exercise, index) => (
                      <div key={index} className="action-item">
                        <div className="flex-1">
                          <p className="font-bold text-primary mb-2">{exercise.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {exercise.sets.map((set, setIndex) => (
                              <span 
                                key={setIndex}
                                className="badge-base badge-secondary text-xs font-medium"
                              >
                                {set.weight}lbs × {set.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectExercise(exercise.name)}
                          size="sm"
                          className="button-base button-default bg-activity hover:bg-activity/90 shadow-md font-medium ml-4"
                          style={{ color: 'var(--color-text-on-activity)' }}
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
        <div className="page-container flex-center">
          <Card className="w-full max-w-lg card-activity">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 card-success rounded-2xl flex-center mb-4 shadow-lg">
                <Trophy className="w-10 h-10" />
              </div>
              <CardTitle className="page-title mb-3">
                Great Workout! 🎉
              </CardTitle>
              <CardDescription className="text-secondary text-lg flex-center gap-2">
                <Timer className="w-4 h-4 text-activity" />
                Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets} sets • {getSessionSummary()?.uniqueExercises} exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workout Summary */}
              {currentSession && (
                <div className="card-base p-4 space-y-3">
                  <p className="text-sm font-bold text-primary flex-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Exercises Completed:
                  </p>
                  {currentSession.exercises.map((exercise, index) => (
                    <div key={index} className="flex-between p-2 bg-surface rounded-lg">
                      <span className="text-primary font-medium">{exercise.name}</span>
                      <span className="text-activity font-bold bg-activity/10 px-2 py-1 rounded">{exercise.sets.length} sets</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="workout-duration" className="block text-sm font-bold mb-2 text-primary flex-center gap-2">
                    <Clock className="w-4 h-4 text-activity" />
                    Duration (minutes) - optional
                  </label>
                  <Input
                    id="workout-duration"
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    placeholder="45"
                    min="1"
                    className="input-base"
                    data-testid="input-finish-workout-duration"
                  />
                </div>
                <div>
                  <label htmlFor="workout-notes" className="block text-sm font-bold mb-2 text-primary flex-center gap-2">
                    <Heart className="w-4 h-4 text-activity" />
                    Notes - optional
                  </label>
                  <Input
                    id="workout-notes"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="Great workout today!"
                    className="input-base"
                    data-testid="input-finish-workout-notes"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  onClick={handleCompleteWorkout}
                  disabled={isLoading}
                  className="flex-1 button-base button-default bg-success hover:bg-success/90 shadow-lg hover:shadow-xl font-bold text-lg py-3"
                  style={{ color: 'var(--color-text-on-success)' }}
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
                  className="flex-1 button-base button-outline font-medium py-3"
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
        <div className="page-container">
          <div className="section-container space-y-6">
            <div className="flex-between pt-6">
              <div className="flex-start gap-4">
                <div className="icon-badge icon-badge-activity">
                  <History className="w-7 h-7 text-activity" />
                </div>
                <div>
                  <h1 className="page-title">Workout History</h1>
                  <p className="text-secondary">Your training journey and achievements</p>
                </div>
              </div>
              <Button
                onClick={() => setViewMode('overview')}
                variant="outline"
                className="button-base button-outline border-activity/30 text-activity hover:bg-activity/10 shadow-sm font-medium"
                data-testid="button-back-to-overview"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <Card className="card-activity">
              <CardHeader>
                <CardTitle className="flex-start gap-3" style={{ color: 'var(--color-text-on-activity)' }}>
                  <div className="icon-badge bg-white/20 backdrop-blur-sm">
                    <Calendar className="w-5 h-5" style={{ color: 'var(--color-text-on-activity)' }} />
                  </div>
                  Recent Workouts
                </CardTitle>
                <CardDescription style={{ color: 'var(--color-text-on-activity)', opacity: 0.8 }}>
                  Your logged workouts and exercise sessions {isGuestMode && '(Guest Mode - stored locally)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-activity/30 border-t-activity rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-secondary">Loading workouts...</p>
                  </div>
                ) : workouts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="icon-badge icon-badge-activity w-16 h-16 mx-auto mb-4">
                      <Dumbbell className="w-8 h-8 text-activity" />
                    </div>
                    <p className="text-secondary text-lg">No workouts logged yet. Start your first workout!</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {workouts.map((workout) => (
                      <div 
                        key={workout.id} 
                        className="action-item"
                        data-testid={`workout-item-${workout.id}`}
                      >
                        <div className="flex-between mb-4">
                          <div className="flex-start gap-3">
                            <div className="icon-badge icon-badge-activity">
                              <Calendar className="w-4 h-4 text-activity" />
                            </div>
                            <div>
                              <p className="font-bold text-primary">
                                {new Date(workout.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-secondary text-sm">
                                {workout.exercises.length} exercises • {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} sets
                                {workout.duration && ` • ${workout.duration} min`}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {workout.exercises.map((exercise, exIndex) => (
                            <div key={exIndex} className="bg-surface/50 p-3 rounded-lg">
                              <div className="flex-between mb-2">
                                <p className="font-semibold text-primary">{exercise.name}</p>
                                <span className="badge-base badge-secondary">{exercise.sets.length} sets</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {exercise.sets.map((set, setIndex) => (
                                  <span 
                                    key={setIndex}
                                    className="text-xs bg-activity/10 text-activity px-2 py-1 rounded font-medium"
                                  >
                                    {formatWeight(set.weight || 0)} × {set.reps} (RIR {set.rir})
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {workout.notes && (
                          <div className="mt-3 p-3 bg-surface/30 rounded-lg border-l-4 border-activity">
                            <p className="text-sm text-secondary italic">"{workout.notes}"</p>
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

    // Default case: overview
    default:
      return (
        <div className="page-container">
          <div className="section-container space-y-6">
            {/* Header */}
            <div className="page-header">
              <div className="flex-center gap-3 mb-4">
                <div className="icon-badge icon-badge-activity">
                  <Dumbbell className="w-8 h-8 text-activity" />
                </div>
                <h1 className="page-title">Workouts</h1>
              </div>
              <p className="page-subtitle">
                Track your training with precision using RIR (Reps in Reserve) methodology
              </p>
            </div>

            {/* Active Session Alert */}
            {currentSession && (
              <Card className="card-activity cursor-pointer" onClick={() => setViewMode('exercise-selection')}>
                <CardContent className="p-4">
                  <div className="flex-between">
                    <div className="flex-start gap-3">
                      <Activity className="w-6 h-6" />
                      <div>
                        <h3 className="font-bold">Active Workout in Progress</h3>
                        <p className="opacity-90">Duration: {formatSessionDuration()} • {getSessionSummary()?.totalSets || 0} sets logged</p>
                      </div>
                    </div>
                    <Play className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Buttons */}
            <div className="grid-2 gap-4">
              <Button
                onClick={() => setShowTemplateSelector(true)}
                className="button-base bg-action hover:bg-action/90 shadow-lg hover:shadow-xl font-bold py-4 text-lg h-auto"
                style={{ color: 'var(--color-text-on-action)' }}
                data-testid="button-find-workout"
              >
                <Search className="w-6 h-6 mr-3" />
                Find a Workout
              </Button>
              
              <Button
                onClick={handleStartWorkout}
                variant="outline"
                className="button-base button-outline border-2 border-wellness text-wellness hover:bg-wellness/10 font-bold py-4 text-lg h-auto"
                data-testid="button-create-custom"
              >
                <Plus className="w-6 h-6 mr-3" />
                Create Custom
              </Button>
            </div>

            {/* Your Next Workout */}
            {recommendedWorkout && (
              <Card 
                className="card-action cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleSelectTemplateFromCard(recommendedWorkout)}
                data-testid={`your-next-workout`}
              >
                <CardContent className="p-6">
                  <div className="flex-between mb-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-on-action)', opacity: 0.8 }}>YOUR NEXT WORKOUT</p>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-on-action)' }}>{recommendedWorkout.title}</h3>
                      <p style={{ color: 'var(--color-text-on-action)', opacity: 0.9 }}>{recommendedWorkout.description}</p>
                    </div>
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <recommendedWorkout.icon className="w-8 h-8" style={{ color: 'var(--color-text-on-action)' }} />
                    </div>
                  </div>
                  
                  <div className="grid-2 gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-center">
                      <div className="flex-center gap-2 mb-1">
                        <Clock className="w-4 h-4" style={{ color: 'var(--color-text-on-action)' }} />
                        <span className="text-sm" style={{ color: 'var(--color-text-on-action)', opacity: 0.8 }}>Duration</span>
                      </div>
                      <p className="text-lg font-bold" style={{ color: 'var(--color-text-on-action)' }}>{recommendedWorkout.duration} min</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-center">
                      <div className="flex-center gap-2 mb-1">
                        <Target className="w-4 h-4" style={{ color: 'var(--color-text-on-action)' }} />
                        <span className="text-sm" style={{ color: 'var(--color-text-on-action)', opacity: 0.8 }}>Exercises</span>
                      </div>
                      <p className="text-lg font-bold" style={{ color: 'var(--color-text-on-action)' }}>{recommendedWorkout.exercises} exercises</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex-between">
                    <div className="flex-start gap-3">
                      <span className="badge-base bg-white/20 border-white/30" style={{ color: 'var(--color-text-on-action)' }}>
                        Difficulty: {recommendedWorkout.difficulty}
                      </span>
                      <span className="badge-base bg-white/20 border-white/30" style={{ color: 'var(--color-text-on-action)' }}>
                        Type: {recommendedWorkout.type}
                      </span>
                    </div>
                    <Button
                      className="bg-white text-action hover:bg-white/90 font-bold px-6"
                      data-testid="button-start-session"
                    >
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discover Templates */}
            <div className="space-y-4">
              <div className="flex-between">
                <h2 className="text-2xl font-bold text-primary">Discover Templates</h2>
                <Button
                  onClick={() => setViewMode('history')}
                  variant="outline"
                  className="button-base button-outline text-activity border-activity/30 hover:bg-activity/10"
                  data-testid="button-view-all"
                >
                  View All
                </Button>
              </div>
              
              <div className="grid-2 gap-4">
                {workoutTemplates.slice(1, 3).map((template) => (
                  <Card 
                    key={template.id}
                    className="card-base cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border/50"
                    onClick={() => handleSelectTemplateFromCard(template)}
                    data-testid={`template-${template.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex-start gap-3 mb-3">
                        <div className="icon-badge icon-badge-activity">
                          <template.icon className="w-5 h-5 text-activity" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-primary">{template.title}</h3>
                          <p className="text-sm text-secondary">{template.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex-start gap-4 text-xs text-tertiary">
                        <span className="flex-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.duration} min
                        </span>
                        <span className="flex-center gap-1">
                          <Target className="w-3 h-3" />
                          {template.exercises} exercises
                        </span>
                        <span className={`badge-base text-xs ${
                          template.difficulty === 'Intermediate' ? 'badge-warning' : 
                          template.difficulty === 'Advanced' ? 'badge-destructive' : 'badge-success'
                        }`}>
                          {template.difficulty}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Workouts Preview */}
            {workouts.length > 0 && (
              <Card className="card-activity">
                <CardHeader>
                  <CardTitle className="flex-start gap-3" style={{ color: 'var(--color-text-on-activity)' }}>
                    <div className="icon-badge bg-white/20 backdrop-blur-sm">
                      <Clock className="w-5 h-5" style={{ color: 'var(--color-text-on-activity)' }} />
                    </div>
                    Recent Activity
                  </CardTitle>
                  <CardDescription style={{ color: 'var(--color-text-on-activity)', opacity: 0.8 }}>
                    Your latest workout sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workouts.slice(0, 3).map((workout) => (
                      <div key={workout.id} className="action-item">
                        <div className="flex-start gap-3">
                          <div className="icon-badge icon-badge-success">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-primary">
                              {new Date(workout.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-secondary text-sm">
                              {workout.exercises.length} exercises • {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} sets
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      onClick={() => setViewMode('history')}
                      variant="ghost"
                      className="w-full button-base button-ghost mt-3"
                    >
                      View All Workouts →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Template Selector Modal */}
            {showTemplateSelector && (
              <LazyWorkoutTemplateSelector
                isOpen={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                onSelectTemplate={handleTemplateSelection}
              />
            )}
          </div>
        </div>
      )
  }
}