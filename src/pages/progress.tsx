import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Calendar, Dumbbell, Apple, Target, Flame } from 'lucide-react'
import { getWorkoutsLocally, getMealsLocally, getProgressLocally, GuestWorkout, GuestMeal, GuestProgress } from '../utils/guestStorage'

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
          const sortedWorkoutDates = [...new Set(guestWorkouts.map(w => w.date))].sort().reverse()
          
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
          const uniqueDates = [...new Set(guestMeals.map(meal => meal.date))]
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
      weight: entry.weight!
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Progress</h1>
          {isGuestMode && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
              Guest Mode - Local Data
            </span>
          )}
        </div>

        {isLoading ? (
          <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <p className="text-slate-600 dark:text-slate-300">Loading your progress data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Dumbbell className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{workoutStats.totalWorkouts}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Total Workouts</div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{workoutStats.currentStreak}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Day Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Apple className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{nutritionStats.totalMealsLogged}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Meals Logged</div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{nutritionStats.averageCaloriesPerDay}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Avg Calories/Day</div>
                </CardContent>
              </Card>
            </div>

            {/* Weight Trend Section */}
            {weightTrendData.length > 0 ? (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <CardTitle className="text-slate-900 dark:text-white">Weight Trend</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Track your weight changes over time {isGuestMode && '(from your local progress entries)'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
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
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <CardTitle className="text-slate-900 dark:text-white">Weight Trend</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    No weight data available yet. Start logging your weight in the profile section to see trends.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Daily Calories Chart */}
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-slate-900 dark:text-white">Daily Calories (Last 7 Days)</CardTitle>
                </div>
                <CardDescription className="text-slate-600 dark:text-slate-300">
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
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="calories" 
                          fill="hsl(var(--primary))"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-300 text-center py-8">
                    No meals logged yet. Start tracking your nutrition to see daily calorie trends!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Workout Consistency Section */}
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-slate-900 dark:text-white">Workout Details</CardTitle>
                </div>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Your workout performance and consistency metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{workoutStats.workoutsThisMonth}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Workouts This Month</div>
                  </div>
                  <div className="text-center p-4 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{workoutStats.totalSets}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Total Sets Completed</div>
                  </div>
                </div>
                
                {workoutStats.averageRIR > 0 && (
                  <div className="text-center p-4 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{workoutStats.averageRIR}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Average RIR (Reps in Reserve)</div>
                  </div>
                )}

                {workoutStats.totalWorkouts > 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {workoutStats.currentStreak > 0 
                      ? `Great consistency! You're on a ${workoutStats.currentStreak}-day streak. Keep up the momentum!`
                      : "Keep building your consistency! Try to workout regularly to build a streak."
                    }
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
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