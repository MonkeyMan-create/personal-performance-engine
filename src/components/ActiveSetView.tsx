import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { ArrowLeft, Check, Play, Pause, SkipForward, Info, Target, Dumbbell } from 'lucide-react'
import { getSmartDefaults, getCurrentWorkoutSession, addSetToCurrentSession } from '../utils/guestStorage'
import { getExerciseById } from '../data/exerciseDatabase'
import { useMeasurement } from '../contexts/MeasurementContext'
import { useToast } from '../hooks/use-toast'

interface ActiveSetViewProps {
  exerciseName: string
  onFinishExercise: () => void
  onBackToSelection: () => void
}

export default function ActiveSetView({ exerciseName, onFinishExercise, onBackToSelection }: ActiveSetViewProps) {
  // Get current session to determine set number
  const session = getCurrentWorkoutSession()
  const currentExercise = session?.exercises.find(ex => ex.name === exerciseName)
  const currentSetNumber = (currentExercise?.sets.length || 0) + 1

  // Exercise database lookup
  const exerciseData = getExerciseById(exerciseName.toLowerCase().replace(/\s+/g, '-')) ||
                       // Fallback: search by name if ID lookup fails
                       null

  // Measurement context for unit conversion
  const { unit, convertWeight, formatWeight } = useMeasurement()
  const { toast } = useToast()

  // Smart pre-filling
  const smartDefaults = getSmartDefaults(exerciseName)
  
  // Form state
  const [weight, setWeight] = useState(smartDefaults.weight)
  const [reps, setReps] = useState(smartDefaults.reps)
  const [rir, setRir] = useState(smartDefaults.rir)
  const [isLoading, setIsLoading] = useState(false)

  // Exercise info modal state
  const [showExerciseInfo, setShowExerciseInfo] = useState(false)

  // Rest timer state
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(90) // 90 seconds default
  const [remainingTime, setRemainingTime] = useState(90)
  const [isPaused, setIsPaused] = useState(false)

  // Rest timer effect
  useEffect(() => {
    if (isResting && !isPaused && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsResting(false)
            setRemainingTime(restTime)
            return restTime
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isResting, isPaused, remainingTime, restTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleLogSet = async () => {
    if (!weight.trim() || !reps.trim() || !rir.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields (weight, reps, RIR).",
        variant: "destructive"
      })
      return
    }

    const weightNum = parseFloat(weight)
    const repsNum = parseInt(reps)
    const rirNum = parseInt(rir)

    if (isNaN(weightNum) || isNaN(repsNum) || isNaN(rirNum)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for all fields.",
        variant: "destructive"
      })
      return
    }

    if (weightNum <= 0 || repsNum <= 0 || rirNum < 0 || rirNum > 10) {
      toast({
        title: "Invalid Values",
        description: "Weight and reps must be greater than 0. RIR must be between 0-10.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const success = addSetToCurrentSession(exerciseName, weightNum, repsNum, rirNum)
      
      if (success) {
        // Show success toast
        toast({
          title: "Set Logged! 💪",
          description: `${formatWeight(weightNum)} × ${repsNum} reps (RIR ${rirNum}) recorded successfully.`,
        })
        
        // Start rest timer
        setIsResting(true)
        setRemainingTime(restTime)
        setIsPaused(false)
        
        // Smart increment for next set
        if (rirNum >= 3) {
          // If they had 3+ RIR, suggest same weight, maybe more reps
          setReps(prev => (parseInt(prev) + 1).toString())
        } else if (rirNum <= 1) {
          // If they had 0-1 RIR, suggest more weight, fewer reps
          setWeight(prev => (parseFloat(prev) + 2.5).toString())
          setReps('8')
        }
        // Keep RIR the same for consistency
      } else {
        throw new Error('Failed to save set')
      }
    } catch (error) {
      console.error('Failed to log set:', error)
      toast({
        title: "Error",
        description: "Failed to log set. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setRemainingTime(restTime)
    setIsPaused(false)
  }

  const handleTogglePause = () => {
    setIsPaused(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl">
        <Button
          variant="ghost"
          onClick={onBackToSelection}
          className="text-slate-600 dark:text-slate-300"
          data-testid="button-back-to-selection"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change Exercise
        </Button>
        <Button
          variant="outline"
          onClick={onFinishExercise}
          className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
          data-testid="button-finish-exercise"
        >
          Finish Exercise
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                {exerciseName}
              </CardTitle>
              {exerciseData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExerciseInfo(true)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  data-testid="button-exercise-info"
                >
                  <Info className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Exercise Details */}
            {exerciseData && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {exerciseData.muscle_groups.slice(0, 3).map(mg => (
                  <Badge key={mg} variant="secondary" className="text-xs capitalize">
                    <Target className="w-3 h-3 mr-1" />
                    {mg}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs capitalize">
                  <Dumbbell className="w-3 h-3 mr-1" />
                  {exerciseData.equipment.join(', ')}
                </Badge>
              </div>
            )}
            
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
              Set {currentSetNumber}
            </p>
            {currentSetNumber > 1 && currentExercise && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last: {formatWeight(currentExercise.sets[currentExercise.sets.length - 1].weight, 'lbs')} × {currentExercise.sets[currentExercise.sets.length - 1].reps} (RIR {currentExercise.sets[currentExercise.sets.length - 1].rir})
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input Fields */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white text-center">
                  Weight
                </label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-center text-xl h-14 text-slate-900 dark:text-white bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="135"
                  min="0"
                  step="0.5"
                  data-testid="input-active-weight"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">{unit}</p>
              </div>

              <div>
                <label htmlFor="reps" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white text-center">
                  Reps
                </label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="text-center text-xl h-14 text-slate-900 dark:text-white bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="8"
                  min="1"
                  data-testid="input-active-reps"
                />
              </div>

              <div>
                <label htmlFor="rir" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white text-center">
                  RIR
                </label>
                <Input
                  id="rir"
                  type="number"
                  value={rir}
                  onChange={(e) => setRir(e.target.value)}
                  className="text-center text-xl h-14 text-slate-900 dark:text-white bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="2"
                  min="0"
                  max="10"
                  data-testid="input-active-rir"
                />
              </div>
            </div>

            {/* RIR Helper Text */}
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              RIR = Reps in Reserve (how many more reps you could do)
            </p>

            {/* Main Action Button */}
            {!isResting ? (
              <Button
                onClick={handleLogSet}
                disabled={isLoading || !weight || !reps || !rir || parseFloat(weight) <= 0 || parseInt(reps) <= 0 || parseInt(rir) < 0}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                data-testid="button-log-set"
              >
                {isLoading ? (
                  'Logging...'
                ) : (
                  <>
                    <Check className="w-6 h-6 mr-3" />
                    Log Set
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                {/* Rest Timer Display */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                    {formatTime(remainingTime)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Rest time remaining
                  </p>
                </div>

                {/* Timer Controls */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleTogglePause}
                    variant="outline"
                    className="flex-1 border-slate-300 dark:border-slate-600"
                    data-testid="button-toggle-pause-rest"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSkipRest}
                    variant="outline"
                    className="flex-1 border-slate-300 dark:border-slate-600"
                    data-testid="button-skip-rest"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {currentExercise && currentExercise.sets.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Today's Sets:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.sets.map((set, index) => (
                    <span
                      key={index}
                      className="text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded"
                    >
                      {set.weight}lbs × {set.reps}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exercise Information Modal */}
      {showExerciseInfo && exerciseData && (
        <Dialog open={showExerciseInfo} onOpenChange={setShowExerciseInfo}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {exerciseData.name}
                <Badge className={
                  exerciseData.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  exerciseData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }>
                  {exerciseData.difficulty}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Muscle Groups and Equipment */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exerciseData.muscle_groups.map(mg => (
                    <Badge key={mg} variant="secondary" className="capitalize">
                      {mg}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Equipment</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {exerciseData.equipment.join(', ')}
                </p>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {exerciseData.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {exerciseData.tips && exerciseData.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Tips & Safety</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {exerciseData.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowExerciseInfo(false)}
                  data-testid="button-close-exercise-info"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}