import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Plus, Utensils, Dumbbell, Clock, Footprints, Flame, Moon, Sun, Calendar } from 'lucide-react'
import { Link } from 'wouter'

export default function HomePage() {
  const { user, isGuestMode } = useAuth()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Daily Diary"
        description="Your personal fitness command center - track every meal, every workout, every day."
      />
    )
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: 'Good Morning', icon: Sun }
    if (hour < 18) return { text: 'Good Afternoon', icon: Sun }
    return { text: 'Good Evening', icon: Moon }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const moods = [
    { emoji: '😄', label: 'Excellent', value: 'excellent' },
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😴', label: 'Tired', value: 'tired' }
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Mock data for progress indicators
  const stepsData = { current: 7234, goal: 10000 }
  const caloriesData = { current: 420, goal: 600 }
  const sleepData = { current: 7.2, goal: 8 }

  const stepsProgress = (stepsData.current / stepsData.goal) * 100
  const caloriesProgress = (caloriesData.current / caloriesData.goal) * 100
  const sleepProgress = (sleepData.current / sleepData.goal) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Top Section - Greeting & Time */}
        <div className="pt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <GreetingIcon className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white" data-testid="greeting-text">
              {greeting.text}
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-semibold" data-testid="current-time">{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg" data-testid="current-date">{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>

        {/* Mood Check-in */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl">How are you feeling today?</CardTitle>
            <CardDescription className="text-slate-300">
              Tap an emoji to check in with your mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                    selectedMood === mood.value 
                      ? 'bg-purple-600/40 ring-4 ring-purple-400/50 shadow-lg shadow-purple-400/20' 
                      : 'bg-slate-700/50 hover:bg-slate-600/50'
                  }`}
                  data-testid={`mood-${mood.value}`}
                  aria-label={`Select ${mood.label} mood`}
                >
                  <div className="text-3xl">{mood.emoji}</div>
                  <div className="text-xs text-slate-300 mt-1 font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Log Workout Card */}
          <Link href="/workouts">
            <Card 
              className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="card-log-workout"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Dumbbell className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Log Workout</h3>
                      <p className="text-purple-100 text-lg">Track your training session</p>
                    </div>
                  </div>
                  <Plus className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Log Meal Card */}
          <Link href="/nutrition">
            <Card 
              className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="card-log-meal"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Log Meal</h3>
                      <p className="text-purple-100 text-lg">Record what you ate</p>
                    </div>
                  </div>
                  <Plus className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Data Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Steps Today */}
          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600/20 rounded-xl">
                    <Footprints className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Steps Today</h3>
                    <p className="text-slate-300" data-testid="steps-count">{stepsData.current.toLocaleString()} / {stepsData.goal.toLocaleString()}</p>
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(100, stepsProgress) / 100)}`}
                      strokeLinecap="round"
                      className="text-emerald-400 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400" data-testid="steps-percentage">
                      {Math.round(stepsProgress)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calories Burnt */}
          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-600/20 rounded-xl">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">Calories Burnt</h3>
                    <p className="text-slate-300" data-testid="calories-count">{caloriesData.current} / {caloriesData.goal} cal</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-400" data-testid="calories-percentage">
                      {Math.round(caloriesProgress)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, caloriesProgress)}%` }}
                    data-testid="calories-progress-bar"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sleep Hours */}
          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600/20 rounded-xl">
                    <Moon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">Sleep Hours</h3>
                    <p className="text-slate-300" data-testid="sleep-count">{sleepData.current} / {sleepData.goal} hours</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-400" data-testid="sleep-percentage">
                      {Math.round(sleepProgress)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, sleepProgress)}%` }}
                    data-testid="sleep-progress-bar"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}