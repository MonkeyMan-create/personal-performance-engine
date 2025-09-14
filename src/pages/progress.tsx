import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Calendar, Dumbbell, Apple, Target, Flame, Trophy, Award, Star, Zap, Shield, Crown, Medal, BadgeCheck } from 'lucide-react'
import { getWorkoutsLocally, getMealsLocally, getProgressLocally, GuestWorkout, GuestMeal, GuestProgress } from '../utils/guestStorage'
import { useMeasurement } from '../contexts/MeasurementContext'

interface WorkoutStats {
  totalWorkouts: number
  workoutsThisMonth: number
  currentStreak: number
  totalSets: number
  averageRIR: number
}

interface NutritionStats {
  totalMealsLogged: number
  averageCaloriesPerDay: number
  totalCalories: number
  mealsThisWeek: number
}

interface WeightData {
  date: string
  weight: number
}

interface CalorieData {
  date: string
  calories: number
}

export default function ProgressPage() {
  const { user, isGuestMode } = useAuth()
  const { convertWeight, formatWeight, unit } = useMeasurement()
  const [workouts, setWorkouts] = useState<GuestWorkout[]>([])
  const [meals, setMeals] = useState<GuestMeal[]>([])
  const [progressData, setProgressData] = useState<GuestProgress[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    workoutsThisMonth: 0,
    currentStreak: 0,
    totalSets: 0,
    averageRIR: 0
  })
  const [nutritionStats, setNutritionStats] = useState<NutritionStats>({
    totalMealsLogged: 0,
    averageCaloriesPerDay: 0,
    totalCalories: 0,
    mealsThisWeek: 0
  })

  // Load data and calculate stats on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (isGuestMode) {
          // Load all data from localStorage for guest users
          const guestWorkouts = getWorkoutsLocally()
          const guestMeals = getMealsLocally()
          const guestProgress = getProgressLocally()

          setWorkouts(guestWorkouts)
          setMeals(guestMeals)
          setProgressData(guestProgress)

          // Calculate workout stats
          const currentDate = new Date()
          const currentMonth = currentDate.getMonth()
          const currentYear = currentDate.getFullYear()
          
          const workoutsThisMonth = guestWorkouts.filter(workout => {
            const workoutDate = new Date(workout.date)
            return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear
          }).length

          const totalSets = guestWorkouts.reduce((total, workout) => 
            total + workout.exercises.reduce((exerciseTotal, exercise) => 
              exerciseTotal + exercise.sets.length, 0
            ), 0
          )

          const allRIRValues = guestWorkouts.flatMap(workout => 
            workout.exercises.flatMap(exercise => 
              exercise.sets.map(set => set.rir)
            )
          )
          const averageRIR = allRIRValues.length > 0 
            ? allRIRValues.reduce((sum, rir) => sum + rir, 0) / allRIRValues.length 
            : 0

          // Calculate current streak (consecutive days with workouts)
          let currentStreak = 0
          const sortedWorkoutDates = Array.from(new Set(guestWorkouts.map(w => w.date))).sort().reverse()
          
          for (let i = 0; i < sortedWorkoutDates.length; i++) {
            const date = new Date(sortedWorkoutDates[i])
            const dayDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
            
            if (i === 0 && dayDiff <= 1) {
              currentStreak = 1
            } else if (i > 0) {
              const prevDate = new Date(sortedWorkoutDates[i - 1])
              const dateDiff = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
              
              if (dateDiff <= 1) {
                currentStreak++
              } else {
                break
              }
            } else {
              break
            }
          }

          setWorkoutStats({
            totalWorkouts: guestWorkouts.length,
            workoutsThisMonth,
            currentStreak,
            totalSets,
            averageRIR: Math.round(averageRIR * 10) / 10
          })

          // Calculate nutrition stats
          const totalCalories = guestMeals.reduce((total, meal) => total + meal.calories, 0)
          const uniqueDates = Array.from(new Set(guestMeals.map(meal => meal.date)))
          const averageCaloriesPerDay = uniqueDates.length > 0 ? Math.round(totalCalories / uniqueDates.length) : 0

          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          const mealsThisWeek = guestMeals.filter(meal => 
            new Date(meal.date) >= oneWeekAgo
          ).length

          setNutritionStats({
            totalMealsLogged: guestMeals.length,
            averageCaloriesPerDay,
            totalCalories,
            mealsThisWeek
          })

        } else if (user) {
          // TODO: Load data from Firebase/cloud for authenticated users
          setWorkouts([])
          setMeals([])
          setProgressData([])
        }
      } catch (error) {
        console.error('Failed to load progress data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user || isGuestMode) {
      loadData()
    }
  }, [user, isGuestMode])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Progress"
        description="Monitor your fitness journey with detailed progress tracking and visual charts of your improvements."
      />
    )
  }

  // Generate weight trend data from progress entries
  const weightTrendData: WeightData[] = progressData
    .filter(entry => entry.weight !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: convertWeight(entry.weight!, 'lbs') // Convert stored weight (lbs) to user's preferred unit
    }))

  // Generate daily calorie data for the last 7 days
  const calorieChartData: CalorieData[] = (() => {
    const last7Days: CalorieData[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayCalories = meals
        .filter(meal => meal.date === dateStr)
        .reduce((total, meal) => total + meal.calories, 0)
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: dayCalories
      })
    }
    
    return last7Days
  })()

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">My Progress</h1>
          {isGuestMode && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
              Guest Mode - Local Data
            </span>
          )}
        </div>

        {isLoading ? (
          <Card 
            data-testid="card-loading-progress"
            className="bg-[var(--color-surface)]/90 border border-[var(--color-border)] backdrop-blur-xl"
          >
            <CardContent className="p-6">
              <p data-testid="text-loading-message" className="text-[var(--color-text-secondary)]">Loading your progress data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* My Highlights Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">My Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card 
                  data-testid="card-total-workouts"
                  className="border border-[var(--color-activity)]/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(139 92 246 / 0.6), rgb(139 92 246 / 0.7))`,
                    boxShadow: `0 10px 15px -3px rgb(139 92 246 / 0.2), 0 4px 6px -2px rgb(139 92 246 / 0.05)`
                  }}
                >
                  <CardContent className="p-6 text-center space-y-3 aspect-square flex flex-col justify-center">
                    <div className="w-12 h-12 mx-auto bg-[var(--color-activity)] rounded-full flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div data-testid="text-total-workouts" className="text-3xl font-bold text-white">{workoutStats.totalWorkouts}</div>
                      <div className="text-sm font-medium text-white/90">Total Workouts</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  data-testid="card-day-streak"
                  className="border border-[var(--color-success)]/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(34 197 94 / 0.6), rgb(34 197 94 / 0.7))`,
                    boxShadow: `0 10px 15px -3px rgb(34 197 94 / 0.2), 0 4px 6px -2px rgb(34 197 94 / 0.05)`
                  }}
                >
                  <CardContent className="p-6 text-center space-y-3 aspect-square flex flex-col justify-center">
                    <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div data-testid="text-day-streak" className="text-3xl font-bold text-white">{workoutStats.currentStreak}</div>
                      <div className="text-sm font-medium text-white/90">Day Streak</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  data-testid="card-meals-logged"
                  className="border border-[var(--color-nutrition)]/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(249 115 22 / 0.6), rgb(249 115 22 / 0.7))`,
                    boxShadow: `0 10px 15px -3px rgb(249 115 22 / 0.2), 0 4px 6px -2px rgb(249 115 22 / 0.05)`
                  }}
                >
                  <CardContent className="p-6 text-center space-y-3 aspect-square flex flex-col justify-center">
                    <div className="w-12 h-12 mx-auto bg-[var(--color-nutrition)] rounded-full flex items-center justify-center">
                      <Apple className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div data-testid="text-meals-logged" className="text-3xl font-bold text-white">{nutritionStats.totalMealsLogged}</div>
                      <div className="text-sm font-medium text-white/90">Meals Logged</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  data-testid="card-avg-calories"
                  className="border border-[var(--color-warning)]/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(245 158 11 / 0.6), rgb(245 158 11 / 0.7))`,
                    boxShadow: `0 10px 15px -3px rgb(245 158 11 / 0.2), 0 4px 6px -2px rgb(245 158 11 / 0.05)`
                  }}
                >
                  <CardContent className="p-6 text-center space-y-3 aspect-square flex flex-col justify-center">
                    <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div data-testid="text-avg-calories" className="text-3xl font-bold text-white">{nutritionStats.averageCaloriesPerDay}</div>
                      <div className="text-sm font-medium text-white/90">Avg Calories/Day</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Weight Trend Section */}
            {weightTrendData.length > 0 ? (
              <Card 
                data-testid="card-weight-trend"
                className="border border-[var(--color-border)] backdrop-blur-xl shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, rgb(139 92 246 / 0.3), rgb(139 92 246 / 0.4))`,
                  boxShadow: `0 10px 15px -3px rgb(139 92 246 / 0.2), 0 4px 6px -2px rgb(139 92 246 / 0.05)`
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-[var(--color-activity)]" />
                    <CardTitle className="text-xl text-[var(--color-text-primary)]">Weight Trend</CardTitle>
                  </div>
                  <CardDescription className="text-[var(--color-text-secondary)]">
                    Track your weight changes over time {isGuestMode && '(from your local progress entries)'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weightTrendData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, 'Weight']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="var(--color-activity)" 
                          strokeWidth={3}
                          dot={{ fill: 'var(--color-activity)', strokeWidth: 2, r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Motivational Insights */}
                  <div 
                    data-testid="weight-insights"
                    className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-lg p-4 border border-[var(--color-primary)]/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">Weight Progress Insight</h4>
                        <p data-testid="text-weight-insight" className="text-sm text-[var(--color-primary)]/80 dark:text-[var(--color-primary)]/80">
                          {(() => {
                            if (weightTrendData.length < 2) {
                              return "Keep logging your weight to see meaningful trends and insights!"
                            }
                            
                            const firstWeight = weightTrendData[0].weight
                            const lastWeight = weightTrendData[weightTrendData.length - 1].weight
                            const weightChange = lastWeight - firstWeight
                            const percentChange = ((weightChange / firstWeight) * 100)
                            
                            // Convert threshold values to user's preferred unit for comparison
                            const threshold1 = convertWeight(1, 'lbs')
                            const threshold2 = convertWeight(2, 'lbs')
                            const threshold5 = convertWeight(5, 'lbs')
                            
                            if (Math.abs(weightChange) < threshold1) {
                              return "Excellent consistency! You're maintaining your weight within a healthy range. Keep up the great work!"
                            } else if (weightChange < -threshold5) {
                              return `Outstanding progress! You've lost ${Math.abs(weightChange).toFixed(1)} ${unit} (${Math.abs(percentChange).toFixed(1)}% reduction). Your dedication is paying off!`
                            } else if (weightChange < -threshold2) {
                              return `Great progress! You've lost ${Math.abs(weightChange).toFixed(1)} ${unit}. Steady and sustainable weight loss is the key to long-term success!`
                            } else if (weightChange < 0) {
                              return `Nice work! You've lost ${Math.abs(weightChange).toFixed(1)} ${unit}. Every ${unit === 'lbs' ? 'pound' : 'kilogram'} counts toward your health goals!`
                            } else if (weightChange > threshold5) {
                              return `You've gained ${weightChange.toFixed(1)} ${unit}. If this aligns with your goals (muscle building), great! Otherwise, consider reviewing your nutrition and exercise plan.`
                            } else if (weightChange > threshold2) {
                              return `You've gained ${weightChange.toFixed(1)} ${unit}. Monitor your progress and adjust your approach if needed to stay on track with your goals.`
                            } else {
                              return `You've gained ${weightChange.toFixed(1)} ${unit}. Small fluctuations are normal - focus on the overall trend and keep consistency!`
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card 
                data-testid="card-weight-trend-empty"
                className="border border-[var(--color-border)] backdrop-blur-xl shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, rgb(139 92 246 / 0.3), rgb(139 92 246 / 0.4))`,
                  boxShadow: `0 10px 15px -3px rgb(139 92 246 / 0.2), 0 4px 6px -2px rgb(139 92 246 / 0.05)`
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-[var(--color-activity)]" />
                    <CardTitle className="text-xl text-[var(--color-text-primary)]">Weight Trend</CardTitle>
                  </div>
                  <CardDescription className="text-[var(--color-text-secondary)]">
                    No weight data available yet. Start logging your weight in the profile section to see trends.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-lg p-6 border border-[var(--color-primary)]/30 text-center">
                    <div className="w-12 h-12 mx-auto bg-[var(--color-primary)] rounded-full flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-2">Ready to Track Your Progress?</h4>
                    <p className="text-sm text-[var(--color-primary)]/80 dark:text-[var(--color-primary)]/80">
                      Start logging your weight regularly to visualize your fitness journey and get personalized insights!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badges & Achievements Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Badges & Achievements</h2>
              <Card 
                data-testid="card-badges-achievements"
                className="bg-gradient-to-br from-[var(--color-success)]/15 via-[var(--color-success)]/8 to-[var(--color-success)]/3 border border-[var(--color-success)]/30 backdrop-blur-xl shadow-lg shadow-[var(--color-success)]/10"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[var(--color-success)]/20 rounded-xl">
                      <Trophy className="w-6 h-6 text-[var(--color-success)]" />
                    </div>
                    <CardTitle className="text-xl text-[var(--color-text-primary)]">Your Achievements</CardTitle>
                  </div>
                  <CardDescription className="text-[var(--color-text-secondary)]">
                    Unlock badges by hitting milestones in your fitness journey!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    data-testid="badges-scroll-container"
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {(() => {
                      const achievements = [
                        {
                          id: 'first-workout',
                          title: 'First Step',
                          description: 'Complete your first workout',
                          icon: Dumbbell,
                          color: 'from-[var(--color-activity)] to-[var(--color-activity)]/80',
                          earned: workoutStats.totalWorkouts >= 1,
                          target: 1,
                          current: workoutStats.totalWorkouts
                        },
                        {
                          id: 'week-warrior',
                          title: 'Week Warrior',
                          description: 'Maintain a 7-day streak',
                          icon: Calendar,
                          color: 'from-[var(--color-success)] to-[var(--color-success)]/80',
                          earned: workoutStats.currentStreak >= 7,
                          target: 7,
                          current: workoutStats.currentStreak
                        },
                        {
                          id: 'workout-dozen',
                          title: 'Dirty Dozen',
                          description: 'Complete 12 workouts',
                          icon: Target,
                          color: 'from-blue-400 to-blue-600',
                          earned: workoutStats.totalWorkouts >= 12,
                          target: 12,
                          current: workoutStats.totalWorkouts
                        },
                        {
                          id: 'meal-master',
                          title: 'Meal Master',
                          description: 'Log 25 meals',
                          icon: Apple,
                          color: 'from-[var(--color-nutrition)] to-[var(--color-nutrition)]/80',
                          earned: nutritionStats.totalMealsLogged >= 25,
                          target: 25,
                          current: nutritionStats.totalMealsLogged
                        },
                        {
                          id: 'consistency-king',
                          title: 'Consistency King',
                          description: 'Achieve a 14-day streak',
                          icon: Crown,
                          color: 'from-[var(--color-activity)] to-[var(--color-activity)]/80',
                          earned: workoutStats.currentStreak >= 14,
                          target: 14,
                          current: workoutStats.currentStreak
                        },
                        {
                          id: 'half-century',
                          title: 'Half Century',
                          description: 'Complete 50 workouts',
                          icon: Medal,
                          color: 'from-amber-400 to-amber-600',
                          earned: workoutStats.totalWorkouts >= 50,
                          target: 50,
                          current: workoutStats.totalWorkouts
                        },
                        {
                          id: 'nutrition-ninja',
                          title: 'Nutrition Ninja',
                          description: 'Log 100 meals',
                          icon: Zap,
                          color: 'from-red-400 to-red-600',
                          earned: nutritionStats.totalMealsLogged >= 100,
                          target: 100,
                          current: nutritionStats.totalMealsLogged
                        },
                        {
                          id: 'century-club',
                          title: 'Century Club',
                          description: 'Complete 100 workouts',
                          icon: BadgeCheck,
                          color: 'from-[var(--color-activity)] to-[var(--color-activity)]/80',
                          earned: workoutStats.totalWorkouts >= 100,
                          target: 100,
                          current: workoutStats.totalWorkouts
                        },
                        {
                          id: 'dedication-legend',
                          title: 'Dedication Legend',
                          description: 'Maintain a 30-day streak',
                          icon: Star,
                          color: 'from-pink-400 to-pink-600',
                          earned: workoutStats.currentStreak >= 30,
                          target: 30,
                          current: workoutStats.currentStreak
                        },
                        {
                          id: 'ultimate-warrior',
                          title: 'Ultimate Warrior',
                          description: 'Complete 500 workouts',
                          icon: Shield,
                          color: 'from-indigo-400 to-indigo-600',
                          earned: workoutStats.totalWorkouts >= 500,
                          target: 500,
                          current: workoutStats.totalWorkouts
                        }
                      ]

                      return achievements.map((achievement) => {
                        const IconComponent = achievement.icon
                        const progressPercent = Math.min((achievement.current / achievement.target) * 100, 100)
                        
                        return (
                          <div
                            key={achievement.id}
                            data-testid={`badge-${achievement.id}`}
                            className="flex-shrink-0 w-24 text-center group cursor-pointer"
                          >
                            <div className="relative">
                              <div 
                                className={`
                                  w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 
                                  ${achievement.earned 
                                    ? `bg-gradient-to-br ${achievement.color} shadow-lg group-hover:shadow-xl group-hover:scale-105` 
                                    : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
                                  }
                                `}
                              >
                                <IconComponent 
                                  className={`w-7 h-7 ${achievement.earned ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} 
                                />
                              </div>
                              
                              {/* Progress ring for locked badges */}
                              {!achievement.earned && achievement.current > 0 && (
                                <div className="absolute inset-0 w-16 h-16 mx-auto">
                                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
                                    <circle
                                      cx="30"
                                      cy="30"
                                      r="28"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      fill="none"
                                      className="text-slate-200 dark:text-slate-600"
                                    />
                                    <circle
                                      cx="30"
                                      cy="30"
                                      r="28"
                                      stroke="hsl(var(--primary))"
                                      strokeWidth="2"
                                      fill="none"
                                      strokeDasharray={`${progressPercent * 1.76} 176`}
                                      className="transition-all duration-500"
                                    />
                                  </svg>
                                </div>
                              )}

                              {/* Achievement notification dot */}
                              {achievement.earned && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" viewBox="0 0 10 10" fill="currentColor">
                                    <path d="M4 5.5L6.5 3l1 1L4 7.5 1.5 5l1-1L4 5.5z"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <h4 
                                data-testid={`text-badge-title-${achievement.id}`}
                                className={`text-xs font-semibold ${achievement.earned ? 'text-[var(--color-text-primary)]' : 'text-slate-500 dark:text-slate-400'}`}
                              >
                                {achievement.title}
                              </h4>
                              <p 
                                data-testid={`text-badge-progress-${achievement.id}`}
                                className="text-xs text-slate-500 dark:text-slate-400"
                              >
                                {achievement.earned ? '✓ Earned!' : `${achievement.current}/${achievement.target}`}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                  
                  {/* Achievement Summary */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[var(--color-primary)]" />
                        <span className="font-medium text-[var(--color-text-primary)]">Achievement Progress</span>
                      </div>
                      <div 
                        data-testid="text-achievement-summary"
                        className="text-sm text-[var(--color-text-secondary)]"
                      >
                        {(() => {
                          const totalAchievements = 10
                          const earnedCount = [
                            workoutStats.totalWorkouts >= 1,
                            workoutStats.currentStreak >= 7,
                            workoutStats.totalWorkouts >= 12,
                            nutritionStats.totalMealsLogged >= 25,
                            workoutStats.currentStreak >= 14,
                            workoutStats.totalWorkouts >= 50,
                            nutritionStats.totalMealsLogged >= 100,
                            workoutStats.totalWorkouts >= 100,
                            workoutStats.currentStreak >= 30,
                            workoutStats.totalWorkouts >= 500
                          ].filter(Boolean).length

                          return `${earnedCount} of ${totalAchievements} earned`
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Calories Chart */}
            <Card 
              data-testid="card-daily-calories"
              className="border border-[var(--color-border)] backdrop-blur-xl shadow-lg"
              style={{
                background: `linear-gradient(to bottom right, rgb(249 115 22 / 0.3), rgb(249 115 22 / 0.4))`,
                boxShadow: `0 10px 15px -3px rgb(249 115 22 / 0.2), 0 4px 6px -2px rgb(249 115 22 / 0.05)`
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[var(--color-primary)]" />
                  <CardTitle className="text-xl text-[var(--color-text-primary)]">Daily Calories (Last 7 Days)</CardTitle>
                </div>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Your daily calorie intake {isGuestMode && '(from your logged meals)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calorieChartData.some(data => data.calories > 0) ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calorieChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="calories" 
                          fill="var(--color-nutrition)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-[var(--color-text-secondary)] text-center py-8">
                    No meals logged yet. Start tracking your nutrition to see daily calorie trends!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Workout Consistency Section */}
            <Card 
              data-testid="card-workout-details"
              className="bg-[var(--color-surface)]/90 border border-[var(--color-border)] backdrop-blur-xl"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-[var(--color-primary)]" />
                  <CardTitle className="text-xl text-[var(--color-text-primary)]">Workout Details</CardTitle>
                </div>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Your workout performance and consistency metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    data-testid="card-workouts-this-month"
                    className="text-center p-4 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg backdrop-blur-sm"
                  >
                    <div data-testid="text-workouts-this-month" className="text-2xl font-bold text-[var(--color-primary)]">{workoutStats.workoutsThisMonth}</div>
                    <div className="text-sm text-[var(--color-primary)]/80">Workouts This Month</div>
                  </div>
                  <div 
                    data-testid="card-total-sets"
                    className="text-center p-4 bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg backdrop-blur-sm"
                  >
                    <div data-testid="text-total-sets" className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{workoutStats.totalSets}</div>
                    <div className="text-sm text-emerald-700 dark:text-emerald-300">Total Sets Completed</div>
                  </div>
                </div>
                
                {workoutStats.averageRIR > 0 && (
                  <div 
                    data-testid="card-average-rir"
                    className="text-center p-4 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg backdrop-blur-sm"
                  >
                    <div data-testid="text-average-rir" className="text-2xl font-bold text-[var(--color-primary)]">{workoutStats.averageRIR}</div>
                    <div className="text-sm text-[var(--color-primary)]/80">Average RIR (Reps in Reserve)</div>
                  </div>
                )}

                {workoutStats.totalWorkouts > 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {workoutStats.currentStreak > 0 
                      ? `Great consistency! You're on a ${workoutStats.currentStreak}-day streak. Keep up the momentum!`
                      : "Keep building your consistency! Try to workout regularly to build a streak."
                    }
                  </p>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Start logging workouts to see your consistency metrics and progress over time.
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}