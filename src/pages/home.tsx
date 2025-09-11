import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Plus, Utensils, Dumbbell, Clock, Flame, TrendingUp, Calendar, ChevronRight } from 'lucide-react'
import { Link } from 'wouter'
import { getWorkoutsLocally, getMealsByDateLocally, getPreferencesLocally, GuestWorkout, GuestMeal } from '../utils/guestStorage'

interface DailyStats {
  consumed: number
  burned: number
  goal: number
  protein: number
  carbs: number
  fat: number
}

interface ActivityItem {
  id: string
  type: 'meal' | 'workout'
  time: string
  data: GuestMeal | GuestWorkout
}

export default function HomePage() {
  const { user, isGuestMode } = useAuth()
  const [todayStats, setTodayStats] = useState<DailyStats>({
    consumed: 0,
    burned: 0,
    goal: 2000,
    protein: 0,
    carbs: 0,
    fat: 0
  })
  const [todayActivities, setTodayActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTodayData = () => {
      setIsLoading(true)
      try {
        const today = new Date().toISOString().split('T')[0]
        
        // Load preferences for calorie goal
        const preferences = getPreferencesLocally()
        const calorieGoal = preferences.goalCalories || 2000
        
        // Load today's meals
        const todayMeals = getMealsByDateLocally(today)
        const mealStats = todayMeals.reduce((acc, meal) => ({
          consumed: acc.consumed + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fat: acc.fat + (meal.fat || 0)
        }), { consumed: 0, protein: 0, carbs: 0, fat: 0 })
        
        // Load today's workouts
        const allWorkouts = getWorkoutsLocally()
        const todayWorkouts = allWorkouts.filter(w => w.date === today)
        
        // Estimate calories burned (rough estimate: 5 cal/min for strength training)
        const burnedCalories = todayWorkouts.reduce((acc, workout) => 
          acc + (workout.duration ? workout.duration * 5 : 0), 0
        )
        
        // Combine and sort activities chronologically
        const activities: ActivityItem[] = [
          ...todayMeals.map(meal => ({
            id: meal.id,
            type: 'meal' as const,
            time: meal.mealType === 'breakfast' ? '08:00' : 
                  meal.mealType === 'lunch' ? '12:00' : 
                  meal.mealType === 'dinner' ? '18:00' : '15:00',
            data: meal
          })),
          ...todayWorkouts.map(workout => ({
            id: workout.id,
            type: 'workout' as const,
            time: '10:00', // Default time, could be enhanced with actual time tracking
            data: workout
          }))
        ].sort((a, b) => a.time.localeCompare(b.time))
        
        setTodayStats({
          consumed: mealStats.consumed,
          burned: burnedCalories,
          goal: calorieGoal,
          protein: mealStats.protein,
          carbs: mealStats.carbs,
          fat: mealStats.fat
        })
        setTodayActivities(activities)
      } catch (error) {
        console.error('Failed to load today data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user || isGuestMode) {
      loadTodayData()
    }
  }, [user, isGuestMode])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Daily Diary"
        description="Your personal fitness command center - track every meal, every workout, every day."
      />
    )
  }

  const netCalories = todayStats.consumed - todayStats.burned
  const remaining = todayStats.goal - netCalories
  const progressPercentage = Math.min(100, (netCalories / todayStats.goal) * 100)
  const isOverBudget = netCalories > todayStats.goal

  // Function to get meal type icon and color
  const getMealTypeInfo = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return { icon: '🌅', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' }
      case 'lunch':
        return { icon: '☀️', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' }
      case 'dinner':
        return { icon: '🌙', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
      case 'snack':
        return { icon: '🍿', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' }
      default:
        return { icon: '🍽️', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/30' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Header with Date */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Today</h1>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Calorie Budget Ring/Bar */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Circular Progress Ring */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    {/* Background circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                      className={`transition-all duration-500 ${
                        isOverBudget 
                          ? 'text-red-500 dark:text-red-400' 
                          : 'text-cyan-500 dark:text-cyan-400'
                      }`}
                    />
                  </svg>
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {remaining > 0 ? remaining : 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {isOverBudget ? 'Over Budget' : 'Remaining'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Utensils className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {todayStats.consumed}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Consumed</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {todayStats.burned}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Burned</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {todayStats.goal}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Goal</div>
                </div>
              </div>

              {/* Macros Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Protein: {todayStats.protein}g</span>
                  <span>Carbs: {todayStats.carbs}g</span>
                  <span>Fat: {todayStats.fat}g</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-blue-500 transition-all duration-500"
                    style={{ width: `${(todayStats.protein * 4 / todayStats.consumed) * 100 || 0}%` }}
                  />
                  <div 
                    className="bg-green-500 transition-all duration-500"
                    style={{ width: `${(todayStats.carbs * 4 / todayStats.consumed) * 100 || 0}%` }}
                  />
                  <div 
                    className="bg-yellow-500 transition-all duration-500"
                    style={{ width: `${(todayStats.fat * 9 / todayStats.consumed) * 100 || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Bar */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/nutrition">
            <Button 
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-700/20"
              data-testid="button-quick-add-meal"
            >
              <Plus className="w-5 h-5 mr-2" />
              <Utensils className="w-5 h-5 mr-2" />
              Log Meal
            </Button>
          </Link>
          <Link href="/workouts">
            <Button 
              className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800 text-white shadow-lg shadow-cyan-600/20 dark:shadow-cyan-700/20"
              data-testid="button-quick-add-workout"
            >
              <Plus className="w-5 h-5 mr-2" />
              <Dumbbell className="w-5 h-5 mr-2" />
              Log Workout
            </Button>
          </Link>
        </div>

        {/* Today's Log - Chronological Feed */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Today's Log</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Your activity timeline for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                Loading today's activities...
              </div>
            ) : todayActivities.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Start Your Day Right!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Log your first meal or workout to begin tracking
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/nutrition">
                      <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20">
                        <Utensils className="w-4 h-4 mr-2" />
                        Add Meal
                      </Button>
                    </Link>
                    <Link href="/workouts">
                      <Button variant="outline" size="sm" className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-600 dark:text-cyan-400 dark:hover:bg-cyan-900/20">
                        <Dumbbell className="w-4 h-4 mr-2" />
                        Add Workout
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {todayActivities.map((activity) => {
                  if (activity.type === 'meal') {
                    const meal = activity.data as GuestMeal
                    const mealInfo = getMealTypeInfo(meal.mealType)
                    return (
                      <div 
                        key={activity.id} 
                        className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                        data-testid={`activity-meal-${activity.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mealInfo.bgColor}`}>
                              <span className="text-lg">{mealInfo.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                  {meal.foodItem}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {meal.mealType}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium">{meal.calories} cal</span>
                                {meal.protein && <span>P: {meal.protein}g</span>}
                                {meal.carbs && <span>C: {meal.carbs}g</span>}
                                {meal.fat && <span>F: {meal.fat}g</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 mt-2" />
                        </div>
                      </div>
                    )
                  } else {
                    const workout = activity.data as GuestWorkout
                    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
                    return (
                      <div 
                        key={activity.id} 
                        className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                        data-testid={`activity-workout-${activity.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                              <Dumbbell className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                                Workout Session
                              </h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                  <span>{workout.exercises.length} exercises</span>
                                  <span>{totalSets} sets</span>
                                  {workout.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {workout.duration} min
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {workout.exercises.map(ex => ex.name).slice(0, 3).join(', ')}
                                  {workout.exercises.length > 3 && ` +${workout.exercises.length - 3} more`}
                                </div>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 mt-2" />
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}