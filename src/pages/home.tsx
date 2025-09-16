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

  // Wellness insights
  const insights = [
    {
      id: 1,
      icon: Target,
      message: "You're 85% to your step goal! A 10-minute walk will get you there.",
      action: "Take a walk",
      badgeClass: "icon-badge-activity"
    },
    {
      id: 2,
      icon: Award,
      message: "Great job hitting your protein target yesterday!",
      action: "Keep it up",
      badgeClass: "icon-badge-nutrition"
    },
    {
      id: 3,
      icon: Brain,
      message: "Consider a 5-minute meditation to reduce stress.",
      action: "Meditate",
      badgeClass: "icon-badge-wellness"
    }
  ]

  return (
    <div className="page-container">
      <div className="section-container space-y-6">
        
        {/* Top Section - Greeting & Time */}
        <div className="page-header">
          <div className="flex-center gap-3 mb-2">
            <GreetingIcon className="w-8 h-8 text-action" />
            <h1 className="page-title" data-testid="greeting-text">
              {greeting.text}
            </h1>
          </div>
          
          <div className="flex-center gap-4 text-secondary">
            <div className="flex-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-semibold" data-testid="current-time">{formatTime(currentTime)}</span>
            </div>
            <div className="flex-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg" data-testid="current-date">{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>

        {/* Mood Check-in */}
        <Card className="card-wellness">
          <CardHeader className="text-center">
            <CardTitle className="text-primary text-xl flex-center gap-2">
              <Brain className="w-6 h-6 text-wellness" />
              How are you feeling today?
            </CardTitle>
            <CardDescription className="text-secondary">
              Tap an emoji to check in with your mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex-center gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`
                    p-4 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95
                    ${selectedMood === mood.value 
                      ? 'card-wellness' 
                      : 'card-base hover:bg-surface-secondary'
                    }
                  `}
                  data-testid={`mood-${mood.value}`}
                  aria-label={`Select ${mood.label} mood`}
                >
                  <div className="text-3xl">{mood.emoji}</div>
                  <div className="text-xs text-white/80 mt-1 font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Central Progress Ring */}
        <div className="flex-center py-8">
          <ProgressRing
            progress={caloriesProgress}
            current={caloriesData.current}
            goal={caloriesData.goal}
            label="Calories"
            unit="cal"
            size="lg"
            color="var(--color-nutrition)"
            className="drop-shadow-2xl"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid-2">
          <div className="data-card">
            <div className="data-card-header">
              <Activity className="data-card-icon" />
              Steps
            </div>
            <div className="data-card-value" data-testid="steps-count-metric">
              {stepsData.current.toLocaleString()}
            </div>
          </div>

          <div className="data-card">
            <div className="data-card-header">
              <Flame className="data-card-icon" />
              Burned
            </div>
            <div className="data-card-value" data-testid="calories-burned-metric">
              420<span className="data-card-unit">cal</span>
            </div>
          </div>

          <div className="data-card">
            <div className="data-card-header">
              <Moon className="data-card-icon" />
              Sleep
            </div>
            <div className="data-card-value" data-testid="sleep-hours-metric">
              {sleepData.current}<span className="data-card-unit">h</span>
            </div>
          </div>

          <div className="data-card">
            <div className="data-card-header">
              <Target className="data-card-icon" />
              Water
            </div>
            <div className="data-card-value" data-testid="water-glasses-metric">
              {waterData.current} / {waterData.goal}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-4">
          <Link href="/workouts">
            <Card 
              className="card-activity transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              data-testid="card-log-workout"
            >
              <CardContent className="p-6">
                <div className="flex-between">
                  <div className="flex-start gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Log Workout</h3>
                      <p className="opacity-80">Track your training session</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/nutrition">
            <Card 
              className="card-nutrition transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              data-testid="card-log-meal"
            >
              <CardContent className="p-6">
                <div className="flex-between">
                  <div className="flex-start gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Log Meal</h3>
                      <p className="opacity-80">Record what you ate</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/meditate">
            <Card 
              className="card-wellness transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              data-testid="card-meditate"
            >
              <CardContent className="p-6">
                <div className="flex-between">
                  <div className="flex-start gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Meditate</h3>
                      <p className="opacity-80">Find your inner peace</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Daily Wellness Insights */}
        <Card className="card-wellness">
          <CardHeader>
            <CardTitle className="text-white flex-start gap-2">
              <div className="icon-badge bg-white/20 backdrop-blur-sm">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              Daily Wellness Insights
            </CardTitle>
            <CardDescription className="text-white/80">
              Personalized tips to help you reach your goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => {
              const IconComponent = insight.icon
              return (
                <div 
                  key={insight.id} 
                  className="action-item"
                  data-testid={`insight-${insight.id}`}
                >
                  <div className="flex-start gap-3">
                    <div className={`icon-badge ${insight.badgeClass}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">{insight.message}</p>
                      <button 
                        className="mt-2 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
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
        <Card className="card-nutrition">
          <CardHeader>
            <CardTitle className="text-white flex-start gap-2">
              <div className="icon-badge bg-white/20 backdrop-blur-sm">
                <Apple className="w-5 h-5 text-white" />
              </div>
              Nutrition Snapshot
            </CardTitle>
            <CardDescription className="text-white/80">
              Today's nutritional breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Macros */}
            <div className="space-y-3">
              <div className="flex-between">
                <span className="font-medium text-white">Protein</span>
                <span className="text-white/80 text-sm" data-testid="protein-count">
                  {nutritionData.protein.current}g / {nutritionData.protein.goal}g
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-protein h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (nutritionData.protein.current / nutritionData.protein.goal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex-between">
                <span className="font-medium text-white">Carbs</span>
                <span className="text-white/80 text-sm" data-testid="carbs-count">
                  {nutritionData.carbs.current}g / {nutritionData.carbs.goal}g
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-carbs h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (nutritionData.carbs.current / nutritionData.carbs.goal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex-between">
                <span className="font-medium text-white">Fat</span>
                <span className="text-white/80 text-sm" data-testid="fat-count">
                  {nutritionData.fat.current}g / {nutritionData.fat.goal}g
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-fat h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (nutritionData.fat.current / nutritionData.fat.goal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-between pt-4 border-t border-white/20">
              <div className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <p className="text-2xl font-bold text-white" data-testid="meals-logged-count">{nutritionData.mealsLogged}</p>
                <p className="text-xs text-white/80 font-medium">Meals Logged</p>
              </div>
              <div className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <p className="text-2xl font-bold text-white" data-testid="calories-remaining">
                  {nutritionData.calories.goal - nutritionData.calories.current}
                </p>
                <p className="text-xs text-white/80 font-medium">Calories Left</p>
              </div>
              <div className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">73%</p>
                <p className="text-xs text-white/80 font-medium">Daily Goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}