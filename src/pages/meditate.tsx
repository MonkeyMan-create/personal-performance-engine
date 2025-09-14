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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8 pb-24">
        
        {/* Header */}
        <div className="pt-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-gradient-to-br from-wellness to-wellness/80 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary" data-testid="text-page-title">Meditation</h1>
              <p className="text-secondary text-lg" data-testid="text-page-subtitle">Find your inner peace</p>
            </div>
          </div>
          <div className="card-wellness-header rounded-2xl p-4 border border-wellness/20">
            <p className="text-secondary text-lg flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-wellness" />
              Cultivate mindfulness and reduce stress
            </p>
          </div>
        </div>

        {!isSessionActive ? (
          <>
            {/* Session Type Selection */}
            <Card className="card-base shadow-2xl backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-wellness/5 via-transparent to-wellness/5 pointer-events-none"></div>
              <CardHeader className="bg-gradient-to-r from-wellness/10 to-wellness/5 relative">
                <CardTitle className="text-primary text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-wellness rounded-xl shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  Choose Your Practice
                </CardTitle>
                <CardDescription className="text-secondary text-lg">
                  Select the type of mindfulness practice you'd like to do
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessionTypes.map((type) => {
                    const IconComponent = type.icon
                    const isActive = sessionType === type.type
                    return (
                      <button
                        key={type.type}
                        onClick={() => setSessionType(type.type)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                          isActive
                            ? 'border-wellness card-wellness-light shadow-xl shadow-wellness/20'
                            : 'border-wellness/30 card-base hover:border-wellness/50 hover:shadow-lg'
                        }`}
                        data-testid={`button-session-${type.type}`}
                      >
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-wellness to-wellness/80 flex items-center justify-center mb-4 mx-auto shadow-lg ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-primary font-bold text-xl mb-2">{type.title}</h3>
                        <p className="text-secondary font-medium">{type.description}</p>
                        {isActive && (
                          <div className="mt-3 flex items-center justify-center">
                            <div className="w-2 h-2 bg-wellness rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Duration Selection */}
            <Card className="card-base shadow-2xl backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-wellness/5 via-transparent to-wellness/5 pointer-events-none"></div>
              <CardHeader className="bg-gradient-to-r from-wellness/10 to-wellness/5 relative">
                <CardTitle className="text-primary text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-wellness rounded-xl shadow-lg">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  Session Duration
                </CardTitle>
                <CardDescription className="text-secondary text-lg">
                  How long would you like to practice?
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {durationOptions.map((duration) => {
                    const isActive = selectedDuration === duration.value
                    return (
                      <button
                        key={duration.value}
                        onClick={() => setSelectedDuration(duration.value)}
                        className={`p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
                          isActive
                            ? 'border-wellness card-wellness-light shadow-lg shadow-wellness/20'
                            : 'border-wellness/30 card-base hover:border-wellness/50 hover:shadow-md'
                        }`}
                        data-testid={`button-duration-${duration.value}`}
                      >
                        <div className="text-center">
                          <p className={`font-bold text-2xl mb-1 ${isActive ? 'text-wellness' : 'text-primary'}`}>{duration.label}</p>
                          <p className="text-secondary text-sm font-medium">{duration.subtitle}</p>
                          {isActive && (
                            <div className="mt-2 flex items-center justify-center">
                              <div className="w-2 h-2 bg-wellness rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Start Session */}
            <div className="text-center">
              <Button
                onClick={sessionType === 'breathing' ? startBreathingExercise : startMeditationTimer}
                size="lg"
                className="button-wellness text-white px-12 py-6 text-2xl font-bold shadow-2xl shadow-wellness/30 hover:shadow-wellness/50 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] rounded-2xl"
                data-testid="button-start-session"
              >
                <Play className="w-8 h-8 mr-4" />
                Start {selectedDuration} Min {sessionType === 'breathing' ? 'Breathing' : 'Meditation'}
              </Button>
              <p className="text-secondary mt-4 text-lg font-medium">
                Take a moment to find a comfortable position
              </p>
            </div>
          </>
        ) : (
          /* Active Session Interface */
          <div className="space-y-8">
            {/* Session Progress */}
            <Card className="card-base border-wellness/30 shadow-2xl backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-wellness/10 via-wellness/5 to-wellness/10 pointer-events-none"></div>
              <CardContent className="p-10 relative">
                <div className="text-center space-y-8">
                  {/* Timer Display */}
                  <div className="space-y-4">
                    <div className="card-wellness-light rounded-3xl p-6 border border-wellness/20">
                      <h2 className="text-6xl font-bold text-wellness mb-3" data-testid="text-time-remaining">
                        {formatTime(breathingState.timeRemaining)}
                      </h2>
                      <p className="text-secondary text-xl font-medium">
                        {sessionType === 'breathing' ? 'Breathing Exercise' : 'Meditation'} - {selectedDuration} minutes
                      </p>
                    </div>
                  </div>

                  {/* Breathing Guide (only for breathing sessions) */}
                  {sessionType === 'breathing' && (
                    <div className="space-y-8">
                      {/* Breathing Circle */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div 
                            className={`w-40 h-40 rounded-full bg-gradient-to-br from-wellness to-wellness/80 shadow-2xl shadow-wellness/40 transition-transform duration-4000 ease-in-out ${
                              breathingState.isActive && !isPaused ? getBreathingScale() : 'scale-100'
                            }`}
                            style={{
                              transitionDuration: `${BREATHING_TIMING[breathingState.phase]}s`
                            }}
                            data-testid="breathing-circle"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Wind className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Breathing Instruction */}
                      <div className="bg-gradient-to-br from-wellness/10 to-wellness/5 rounded-2xl p-6 border border-wellness/20">
                        <h3 className="text-3xl font-bold text-wellness mb-3" data-testid="text-breathing-instruction">
                          {getBreathingInstruction()}
                        </h3>
                        <p className="text-secondary text-lg font-medium" data-testid="text-cycle-count">
                          Cycle {breathingState.currentCycle + 1}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Meditation Visual (for meditation sessions) */}
                  {sessionType === 'meditation' && (
                    <div className="space-y-8">
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-wellness to-wellness/80 shadow-2xl shadow-wellness/40 animate-pulse" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Brain className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-wellness/10 to-wellness/5 rounded-2xl p-6 border border-wellness/20">
                        <h3 className="text-3xl font-bold text-wellness mb-3">
                          Meditation in Progress
                        </h3>
                        <p className="text-secondary text-lg font-medium">
                          Focus on your breath and let thoughts pass by
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Session Controls */}
                  <div className="flex justify-center gap-6">
                    {!isPaused ? (
                      <Button
                        onClick={pauseSession}
                        variant="outline"
                        size="lg"
                        className="border-2 border-wellness/40 card-base text-wellness hover:bg-wellness/10 hover:border-wellness/60 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        data-testid="button-pause"
                      >
                        <Pause className="w-6 h-6 mr-3" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={resumeSession}
                        variant="outline"
                        size="lg"
                        className="border-2 border-wellness/40 bg-gradient-to-br from-wellness/10 to-wellness/5 text-wellness hover:bg-wellness/15 hover:border-wellness/60 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        data-testid="button-resume"
                      >
                        <Play className="w-6 h-6 mr-3" />
                        Resume
                      </Button>
                    )}
                    
                    <Button
                      onClick={stopSession}
                      variant="outline"
                      size="lg"
                      className="border-2 button-outline-error px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      data-testid="button-stop"
                    >
                      <Square className="w-6 h-6 mr-3" />
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
          <Card className="card-base shadow-2xl backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-wellness/5 via-transparent to-wellness/5 pointer-events-none"></div>
            <CardHeader className="bg-gradient-to-r from-wellness/10 to-wellness/5 relative">
              <CardTitle className="text-primary text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-wellness rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                Recent Sessions
              </CardTitle>
              <CardDescription className="text-wellness text-lg font-medium">
                Your mindfulness journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 relative">
              <div className="space-y-4">
                {completedSessions.slice(0, 5).map((session, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-wellness/5 to-wellness/10 rounded-xl border border-wellness/20 hover:shadow-lg transition-all duration-200"
                    data-testid={`session-${index}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wellness to-wellness/80 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-primary font-bold text-lg">
                          {session.duration} min {session.type === 'breathing' ? 'Breathing' : 'Meditation'}
                        </p>
                        <p className="text-secondary font-medium">
                          {session.completedAt.toLocaleDateString()} at {session.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-wellness font-bold text-xl">
                      ✓
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