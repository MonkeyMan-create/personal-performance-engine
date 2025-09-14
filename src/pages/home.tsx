import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Plus, Utensils, Dumbbell, Clock, Moon, Sun, Calendar, Brain, Activity, Flame, Target, Apple, TrendingUp, Lightbulb, Award } from 'lucide-react'
import { Link } from 'wouter'
import ProgressRing from '../components/ProgressRing'

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
  const caloriesData = { current: 1450, goal: 2000 }
  const sleepData = { current: 7.2, goal: 8 }
  const waterData = { current: 6, goal: 8 }

  const stepsProgress = (stepsData.current / stepsData.goal) * 100
  const caloriesProgress = (caloriesData.current / caloriesData.goal) * 100
  const sleepProgress = (sleepData.current / sleepData.goal) * 100
  const waterProgress = (waterData.current / waterData.goal) * 100

  // Nutrition mock data
  const nutritionData = {
    calories: { current: 1450, goal: 2000 },
    protein: { current: 85, goal: 120 },
    carbs: { current: 180, goal: 250 },
    fat: { current: 65, goal: 80 },
    mealsLogged: 2
  }

  // Color mapping using consistent primary theming
  const colorMap = {
    purple: {
      bg: 'bg-[--color-primary]/20',
      text: 'text-[--color-primary]'
    },
    emerald: {
      bg: 'bg-[--color-primary]/20',
      text: 'text-[--color-primary]'
    },
    blue: {
      bg: 'bg-[--color-primary]/20',
      text: 'text-[--color-primary]'
    }
  }

  // Wellness insights
  const insights = [
    {
      id: 1,
      icon: Target,
      message: "You're 85% to your step goal! A 10-minute walk will get you there.",
      action: "Take a walk",
      color: "purple" as keyof typeof colorMap
    },
    {
      id: 2,
      icon: Award,
      message: "Great job hitting your protein target yesterday!",
      action: "Keep it up",
      color: "emerald" as keyof typeof colorMap
    },
    {
      id: 3,
      icon: Brain,
      message: "Consider a 5-minute meditation to reduce stress.",
      action: "Meditate",
      color: "blue" as keyof typeof colorMap
    }
  ]

  return (
    <div className="min-h-screen bg-[--color-background]">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Top Section - Greeting & Time */}
        <div className="pt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <GreetingIcon className="w-8 h-8 text-[--color-primary]" />
            <h1 className="text-3xl font-bold text-[--color-text-primary]" data-testid="greeting-text">
              {greeting.text}
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-[--color-text-secondary]">
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
        <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-[--color-text-primary] text-xl">How are you feeling today?</CardTitle>
            <CardDescription className="text-[--color-text-secondary]">
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
                      ? 'bg-[--color-primary]/20 ring-4 ring-[--color-primary]/50 shadow-lg shadow-[--color-primary]/20' 
                      : 'bg-[--color-surface] hover:bg-[--color-border]/50 border border-[--color-border]'
                  }`}
                  data-testid={`mood-${mood.value}`}
                  aria-label={`Select ${mood.label} mood`}
                >
                  <div className="text-3xl">{mood.emoji}</div>
                  <div className="text-xs text-[--color-text-secondary] mt-1 font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Central Progress Ring */}
        <div className="flex justify-center py-8">
          <ProgressRing
            progress={caloriesProgress}
            current={caloriesData.current}
            goal={caloriesData.goal}
            label="Calories"
            unit="cal"
            size="lg"
            className="drop-shadow-2xl [&>*]:!stroke-[--color-primary] [&_text]:!fill-[--color-primary]"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--color-primary]/20 rounded-lg">
                  <Activity className="w-5 h-5 text-[--color-primary]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[--color-text-secondary]">Steps</p>
                  <p className="text-lg font-bold text-[--color-text-primary]" data-testid="steps-count-metric">
                    {stepsData.current.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-[--color-border]/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[--color-primary] to-[--color-primary]/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, stepsProgress)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--color-primary]/20 rounded-lg">
                  <Flame className="w-5 h-5 text-[--color-primary]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[--color-text-secondary]">Burned</p>
                  <p className="text-lg font-bold text-[--color-text-primary]" data-testid="calories-burned-metric">
                    420 cal
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-[--color-border]/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[--color-primary] to-[--color-primary]/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `70%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--color-primary]/20 rounded-lg">
                  <Moon className="w-5 h-5 text-[--color-primary]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[--color-text-secondary]">Sleep</p>
                  <p className="text-lg font-bold text-[--color-text-primary]" data-testid="sleep-hours-metric">
                    {sleepData.current}h
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-[--color-border]/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[--color-primary] to-[--color-primary]/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, sleepProgress)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--color-primary]/20 rounded-lg">
                  <Target className="w-5 h-5 text-[--color-primary]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[--color-text-secondary]">Water</p>
                  <p className="text-lg font-bold text-[--color-text-primary]" data-testid="water-glasses-metric">
                    {waterData.current} / {waterData.goal}
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-[--color-border]/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[--color-primary] to-[--color-primary]/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, waterProgress)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-4">
          <Link href="/workouts">
            <Card 
              className="bg-gradient-to-r from-[--color-primary] to-[--color-primary] border-0 shadow-2xl shadow-[--color-primary]/25 hover:shadow-[--color-primary]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="card-log-workout"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Log Workout</h3>
                      <p className="text-white/80">Track your training session</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/nutrition">
            <Card 
              className="bg-gradient-to-r from-[--color-primary] to-[--color-primary] border-0 shadow-2xl shadow-[--color-primary]/25 hover:shadow-[--color-primary]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="card-log-meal"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Log Meal</h3>
                      <p className="text-white/80">Record what you ate</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/meditate">
            <Card 
              className="bg-gradient-to-r from-[--color-primary] to-[--color-primary] border-0 shadow-2xl shadow-[--color-primary]/25 hover:shadow-[--color-primary]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="card-meditate"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Meditate</h3>
                      <p className="text-white/80">Find your inner peace</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Daily Wellness Insights */}
        <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[--color-text-primary] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[--color-primary]" />
              Daily Wellness Insights
            </CardTitle>
            <CardDescription className="text-[--color-text-secondary]">
              Personalized tips to help you reach your goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => {
              const IconComponent = insight.icon
              const colors = colorMap[insight.color]
              return (
                <div 
                  key={insight.id} 
                  className="p-4 bg-[--color-surface]/50 rounded-lg border border-[--color-border] hover:bg-[--color-border]/30 transition-colors"
                  data-testid={`insight-${insight.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[--color-text-primary] text-sm leading-relaxed">{insight.message}</p>
                      <button 
                        className={`mt-2 text-[--color-primary] text-xs font-medium hover:opacity-80 transition-colors`}
                        data-testid={`insight-action-${insight.id}`}
                      >
                        {insight.action} →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Nutrition Snapshot */}
        <Card className="bg-[--color-surface]/90 border-[--color-border] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[--color-text-primary] flex items-center gap-2">
              <Apple className="w-5 h-5 text-[--color-primary]" />
              Nutrition Snapshot
            </CardTitle>
            <CardDescription className="text-[--color-text-secondary]">
              Today's nutritional breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Macros */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Protein</span>
                <span className="text-muted-foreground text-sm" data-testid="protein-count">
                  {nutritionData.protein.current}g / {nutritionData.protein.goal}g
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (nutritionData.protein.current / nutritionData.protein.goal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Carbs</span>
                <span className="text-muted-foreground text-sm" data-testid="carbs-count">
                  {nutritionData.carbs.current}g / {nutritionData.carbs.goal}g
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (nutritionData.carbs.current / nutritionData.carbs.goal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Fat</span>
                <span className="text-muted-foreground text-sm" data-testid="fat-count">
                  {nutritionData.fat.current}g / {nutritionData.fat.goal}g
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (nutritionData.fat.current / nutritionData.fat.goal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary" data-testid="meals-logged-count">{nutritionData.mealsLogged}</p>
                <p className="text-xs text-muted-foreground">Meals Logged</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary" data-testid="calories-remaining">
                  {nutritionData.calories.goal - nutritionData.calories.current}
                </p>
                <p className="text-xs text-muted-foreground">Calories Left</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">73%</p>
                <p className="text-xs text-muted-foreground">Daily Goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}