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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'meditation' as SessionType,
      title: 'Meditation Timer',
      description: 'Open meditation with timer',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">Meditation</h1>
            <p className="text-indigo-200" data-testid="text-page-subtitle">Find your inner peace</p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {!isSessionActive ? (
          <>
            {/* Session Type Selection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Choose Your Practice
                </CardTitle>
                <CardDescription className="text-indigo-200">
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
                            ? 'border-white bg-white/20 shadow-lg'
                            : 'border-white/30 bg-white/5 hover:bg-white/10'
                        }`}
                        data-testid={`button-session-${type.type}`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-3 mx-auto`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold">{type.title}</h3>
                        <p className="text-indigo-200 text-sm mt-1">{type.description}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Duration Selection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-green-400" />
                  Session Duration
                </CardTitle>
                <CardDescription className="text-indigo-200">
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
                          ? 'border-white bg-white/20 shadow-lg'
                          : 'border-white/30 bg-white/5 hover:bg-white/10'
                      }`}
                      data-testid={`button-duration-${duration.value}`}
                    >
                      <div className="text-center">
                        <p className="text-white font-semibold text-lg">{duration.label}</p>
                        <p className="text-indigo-200 text-xs">{duration.subtitle}</p>
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
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-green-500/25"
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
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Timer Display */}
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2" data-testid="text-time-remaining">
                      {formatTime(breathingState.timeRemaining)}
                    </h2>
                    <p className="text-indigo-200">
                      {sessionType === 'breathing' ? 'Breathing Exercise' : 'Meditation'} - {selectedDuration} minutes
                    </p>
                  </div>

                  {/* Breathing Guide (only for breathing sessions) */}
                  {sessionType === 'breathing' && (
                    <div className="space-y-6">
                      {/* Breathing Circle */}
                      <div className="flex justify-center">
                        <div 
                          className={`w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/30 transition-transform duration-4000 ease-in-out ${
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
                        <h3 className="text-2xl font-semibold text-white mb-2" data-testid="text-breathing-instruction">
                          {getBreathingInstruction()}
                        </h3>
                        <p className="text-indigo-200" data-testid="text-cycle-count">
                          Cycle {breathingState.currentCycle + 1}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Meditation Visual (for meditation sessions) */}
                  {sessionType === 'meditation' && (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-lg shadow-purple-500/30 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          Meditation in Progress
                        </h3>
                        <p className="text-indigo-200">
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
                        className="border-white/30 bg-white/10 text-white hover:bg-white/20"
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
                        className="border-white/30 bg-white/10 text-white hover:bg-white/20"
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
                      className="border-red-300/50 bg-red-500/20 text-red-100 hover:bg-red-500/30"
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
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Recent Sessions
              </CardTitle>
              <CardDescription className="text-indigo-200">
                Your mindfulness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedSessions.slice(0, 5).map((session, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    data-testid={`session-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {session.duration} min {session.type === 'breathing' ? 'Breathing' : 'Meditation'}
                        </p>
                        <p className="text-indigo-200 text-sm">
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