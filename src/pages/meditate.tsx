import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, Play, Pause, Square, RotateCcw, Brain, Timer, Wind, Heart, CheckCircle, Star } from 'lucide-react'
import { Link } from 'wouter'
import { useToast } from '../hooks/use-toast'

type SessionType = 'breathing' | 'meditation'
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause'

interface MeditationSession {
  type: SessionType
  duration: number
  completedAt: Date
}

interface BreathingState {
  phase: BreathingPhase
  isActive: boolean
  currentCycle: number
  timeRemaining: number
  totalDuration: number
}

const BREATHING_TIMING = {
  inhale: 4,
  hold: 4,
  exhale: 4,
  pause: 1
}

export default function MeditatePage() {
  const { user, isGuestMode } = useAuth()
  const { toast } = useToast()
  const [sessionType, setSessionType] = useState<SessionType>('breathing')
  const [selectedDuration, setSelectedDuration] = useState(3) // minutes
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completedSessions, setCompletedSessions] = useState<MeditationSession[]>([])
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Breathing exercise state
  const [breathingState, setBreathingState] = useState<BreathingState>({
    phase: 'inhale',
    isActive: false,
    currentCycle: 0,
    timeRemaining: 0,
    totalDuration: 0
  })

  // Load completed sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('meditationSessions')
    if (stored) {
      try {
        const sessions = JSON.parse(stored).map((s: any) => ({
          ...s,
          completedAt: new Date(s.completedAt)
        }))
        setCompletedSessions(sessions)
      } catch (error) {
        console.error('Failed to load meditation sessions:', error)
      }
    }
  }, [])

  // Save sessions to localStorage
  const saveSession = (session: MeditationSession) => {
    const updatedSessions = [session, ...completedSessions]
    setCompletedSessions(updatedSessions)
    localStorage.setItem('meditationSessions', JSON.stringify(updatedSessions))
  }

  // Start breathing exercise
  const startBreathingExercise = () => {
    const totalTime = selectedDuration * 60 // Convert to seconds
    const cycleTime = Object.values(BREATHING_TIMING).reduce((sum, time) => sum + time, 0)
    
    setBreathingState({
      phase: 'inhale',
      isActive: true,
      currentCycle: 0,
      timeRemaining: totalTime,
      totalDuration: totalTime
    })
    setIsSessionActive(true)
    setIsPaused(false)

    // Start breathing cycle
    startBreathingCycle()
    
    // Start session countdown
    sessionTimerRef.current = setInterval(() => {
      setBreathingState(prev => {
        if (prev.timeRemaining <= 1) {
          completeSession()
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)
  }

  const startBreathingCycle = () => {
    let phaseIndex = 0
    const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'pause']
    
    const runPhase = () => {
      if (!isSessionActive || isPaused) return
      
      const currentPhase = phases[phaseIndex]
      setBreathingState(prev => ({ ...prev, phase: currentPhase }))
      
      breathingIntervalRef.current = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length
        if (phaseIndex === 0) {
          setBreathingState(prev => ({ ...prev, currentCycle: prev.currentCycle + 1 }))
        }
        runPhase()
      }, BREATHING_TIMING[currentPhase] * 1000)
    }
    
    runPhase()
  }

  // Start meditation timer
  const startMeditationTimer = () => {
    const totalTime = selectedDuration * 60
    
    setBreathingState({
      phase: 'inhale',
      isActive: true,
      currentCycle: 0,
      timeRemaining: totalTime,
      totalDuration: totalTime
    })
    setIsSessionActive(true)
    setIsPaused(false)

    sessionTimerRef.current = setInterval(() => {
      setBreathingState(prev => {
        if (prev.timeRemaining <= 1) {
          completeSession()
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)
  }

  const pauseSession = () => {
    setIsPaused(true)
    if (breathingIntervalRef.current) {
      clearTimeout(breathingIntervalRef.current)
    }
  }

  const resumeSession = () => {
    setIsPaused(false)
    if (sessionType === 'breathing') {
      startBreathingCycle()
    }
  }

  const stopSession = () => {
    setIsSessionActive(false)
    setIsPaused(false)
    if (breathingIntervalRef.current) {
      clearTimeout(breathingIntervalRef.current)
    }
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current)
    }
    setBreathingState({
      phase: 'inhale',
      isActive: false,
      currentCycle: 0,
      timeRemaining: 0,
      totalDuration: 0
    })
  }

  const completeSession = () => {
    const session: MeditationSession = {
      type: sessionType,
      duration: selectedDuration,
      completedAt: new Date()
    }
    
    saveSession(session)
    stopSession()
    
    toast({
      title: "Session Completed! 🧘",
      description: `Great job! You completed a ${selectedDuration}-minute ${sessionType === 'breathing' ? 'breathing exercise' : 'meditation session'}.`,
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (breathingIntervalRef.current) {
        clearTimeout(breathingIntervalRef.current)
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get breathing instruction text
  const getBreathingInstruction = () => {
    switch (breathingState.phase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      case 'pause':
        return 'Pause'
      default:
        return 'Prepare'
    }
  }

  // Get breathing circle scale
  const getBreathingScale = () => {
    switch (breathingState.phase) {
      case 'inhale':
        return 'scale-150'
      case 'hold':
        return 'scale-150'
      case 'exhale':
        return 'scale-75'
      case 'pause':
        return 'scale-75'
      default:
        return 'scale-100'
    }
  }

  // Session type options
  const sessionTypes = [
    {
      type: 'breathing' as SessionType,
      title: 'Guided Breathing',
      description: 'Follow the breathing guide',
      icon: Wind,
      color: 'from-primary/80 to-primary'
    },
    {
      type: 'meditation' as SessionType,
      title: 'Meditation Timer',
      description: 'Open meditation with timer',
      icon: Brain,
      color: 'from-secondary/80 to-secondary'
    }
  ]

  // Duration options
  const durationOptions = [
    { value: 1, label: '1 min', subtitle: 'Quick' },
    { value: 3, label: '3 min', subtitle: 'Beginner' },
    { value: 5, label: '5 min', subtitle: 'Standard' },
    { value: 10, label: '10 min', subtitle: 'Extended' }
  ]

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Meditation & Mindfulness"
        description="Find your inner peace with guided breathing exercises and meditation sessions."
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">Meditation</h1>
            <p className="text-slate-600 dark:text-slate-300" data-testid="text-page-subtitle">Find your inner peace</p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {!isSessionActive ? (
          <>
            {/* Session Type Selection */}
            <Card className="bg-white/80 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Choose Your Practice
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Select the type of mindfulness practice you'd like to do
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.type}
                        onClick={() => setSessionType(type.type)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          sessionType === type.type
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }`}
                        data-testid={`button-session-${type.type}`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-3 mx-auto`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-semibold">{type.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{type.description}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Duration Selection */}
            <Card className="bg-white/80 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  Session Duration
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  How long would you like to practice?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {durationOptions.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setSelectedDuration(duration.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedDuration === duration.value
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                      data-testid={`button-duration-${duration.value}`}
                    >
                      <div className="text-center">
                        <p className="text-slate-900 dark:text-white font-semibold text-lg">{duration.label}</p>
                        <p className="text-slate-600 dark:text-slate-300 text-xs">{duration.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Start Session */}
            <div className="text-center">
              <Button
                onClick={sessionType === 'breathing' ? startBreathingExercise : startMeditationTimer}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/25"
                data-testid="button-start-session"
              >
                <Play className="w-6 h-6 mr-3" />
                Start {selectedDuration} Min {sessionType === 'breathing' ? 'Breathing' : 'Meditation'}
              </Button>
            </div>
          </>
        ) : (
          /* Active Session Interface */
          <div className="space-y-8">
            {/* Session Progress */}
            <Card className="bg-white/80 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Timer Display */}
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2" data-testid="text-time-remaining">
                      {formatTime(breathingState.timeRemaining)}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      {sessionType === 'breathing' ? 'Breathing Exercise' : 'Meditation'} - {selectedDuration} minutes
                    </p>
                  </div>

                  {/* Breathing Guide (only for breathing sessions) */}
                  {sessionType === 'breathing' && (
                    <div className="space-y-6">
                      {/* Breathing Circle */}
                      <div className="flex justify-center">
                        <div 
                          className={`w-32 h-32 rounded-full bg-gradient-to-r from-primary/80 to-primary shadow-lg shadow-primary/30 transition-transform duration-4000 ease-in-out ${
                            breathingState.isActive && !isPaused ? getBreathingScale() : 'scale-100'
                          }`}
                          style={{
                            transitionDuration: `${BREATHING_TIMING[breathingState.phase]}s`
                          }}
                          data-testid="breathing-circle"
                        />
                      </div>

                      {/* Breathing Instruction */}
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2" data-testid="text-breathing-instruction">
                          {getBreathingInstruction()}
                        </h3>
                        <p className="text-primary" data-testid="text-cycle-count">
                          Cycle {breathingState.currentCycle + 1}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Meditation Visual (for meditation sessions) */}
                  {sessionType === 'meditation' && (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-secondary/80 to-secondary shadow-lg shadow-secondary/30 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                          Meditation in Progress
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          Focus on your breath and let thoughts pass by
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Session Controls */}
                  <div className="flex justify-center gap-4">
                    {!isPaused ? (
                      <Button
                        onClick={pauseSession}
                        variant="outline"
                        size="lg"
                        className="border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                        data-testid="button-pause"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={resumeSession}
                        variant="outline"
                        size="lg"
                        className="border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                        data-testid="button-resume"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </Button>
                    )}
                    
                    <Button
                      onClick={stopSession}
                      variant="outline"
                      size="lg"
                      className="border-red-300/50 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30"
                      data-testid="button-stop"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Sessions */}
        {completedSessions.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Recent Sessions
              </CardTitle>
              <CardDescription className="text-primary">
                Your mindfulness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedSessions.slice(0, 5).map((session, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/30 rounded-lg"
                    data-testid={`session-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">
                          {session.duration} min {session.type === 'breathing' ? 'Breathing' : 'Meditation'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          {session.completedAt.toLocaleDateString()} at {session.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}