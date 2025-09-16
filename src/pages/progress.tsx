import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TrendingUp, Calendar, Dumbbell, Apple, Target, Flame, Trophy, Award, Star, Zap, Shield, Crown, Medal, BadgeCheck } from 'lucide-react'
import { ProgressEmptyState } from '../components/EmptyState'
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
  const [chartsLoading, setChartsLoading] = useState(true)
  const [chartComponents, setChartComponents] = useState<any>(null)
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

  // Lazy load chart components
  useEffect(() => {
    const loadChartComponents = async () => {
      try {
        const recharts = await import('recharts')
        setChartComponents({
          LineChart: recharts.LineChart,
          Line: recharts.Line,
          XAxis: recharts.XAxis,
          YAxis: recharts.YAxis,
          CartesianGrid: recharts.CartesianGrid,
          Tooltip: recharts.Tooltip,
          ResponsiveContainer: recharts.ResponsiveContainer,
          BarChart: recharts.BarChart,
          Bar: recharts.Bar
        })
      } catch {
        // Silently handle chart component loading errors
      } finally {
        setChartsLoading(false)
      }
    }

    loadChartComponents()
  }, [])

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
      } catch {
        // Silently handle progress data loading errors
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
    <div className="page-container">
      <div className="section-container space-y-6">
        <div className="page-back-header">
          <h1 className="page-back-title">My Progress</h1>
          {isGuestMode && (
            <span className="badge-base badge-warning text-xs">
              Guest Mode - Local Data
            </span>
          )}
        </div>

        {isLoading ? (
          <Card 
            data-testid="card-loading-progress"
            className="card-glass"
          >
            <CardContent className="card-content">
              <p data-testid="text-loading-message" className="text-secondary">Loading your progress data...</p>
            </CardContent>
          </Card>
        ) : workoutStats.totalWorkouts === 0 && nutritionStats.totalMealsLogged === 0 && progressData.length === 0 ? (
          <ProgressEmptyState
            icon={TrendingUp}
            title="Start Your Progress Journey"
            description="Begin logging workouts, meals, and weight to see your fitness progress unfold. Your journey to better health starts with a single step!"
            actionText="View Workouts"
            onAction={() => window.location.href = '/workouts'}
            size="lg"
          />
        ) : (
          <>
            {/* My Highlights Section */}
            <div className="space-y-4">
              <div className="section-header">
                <h2 className="text-2xl font-bold text-primary flex-start gap-3">
                  <div className="icon-badge icon-badge-action">
                    <Trophy className="w-6 h-6" style={{ color: 'var(--color-text-on-action)' }} />
                  </div>
                  My Highlights
                </h2>
                <p className="text-secondary text-lg">Key metrics from your fitness journey</p>
              </div>
              <div className="grid-4 grid-md-4 gap-6">
                <Card 
                  data-testid="card-total-workouts"
                  className="card-activity interactive-enhanced"
                >
                  <CardContent className="card-content text-center space-y-4 aspect-square flex-col-center p-6">
                    <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-full flex-center shadow-xl">
                      <Dumbbell className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
                    </div>
                    <div className="space-y-2">
                      <div data-testid="text-total-workouts" className="text-4xl font-black drop-shadow-lg" style={{ color: 'var(--color-text-on-activity)' }}>{workoutStats.totalWorkouts}</div>
                      <div className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-on-activity)', opacity: 0.9 }}>Total Workouts</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  data-testid="card-day-streak"
                  className="card-action interactive-enhanced"
                >
                  <CardContent className="card-content text-center space-y-4 aspect-square flex-col-center p-6">
                    <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-full flex-center shadow-xl">
                      <Calendar className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
                    </div>
                    <div className="space-y-2">
                      <div data-testid="text-day-streak" className="text-4xl font-black drop-shadow-lg" style={{ color: 'var(--color-text-on-activity)' }}>{workoutStats.currentStreak}</div>
                      <div className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-on-activity)', opacity: 0.9 }}>Day Streak</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  data-testid="card-meals-logged"
                  className="card-nutrition interactive-enhanced"
                >
                  <CardContent className="card-content text-center space-y-4 aspect-square flex-col-center p-6">
                    <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-full flex-center shadow-xl">
                      <Apple className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
                    </div>
                    <div className="space-y-2">
                      <div data-testid="text-meals-logged" className="text-4xl font-black drop-shadow-lg" style={{ color: 'var(--color-text-on-activity)' }}>{nutritionStats.totalMealsLogged}</div>
                      <div className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-on-activity)', opacity: 0.9 }}>Meals Logged</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  data-testid="card-avg-calories"
                  className="card-error interactive-enhanced"
                >
                  <CardContent className="card-content text-center space-y-4 aspect-square flex-col-center p-6">
                    <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-full flex-center shadow-xl">
                      <Flame className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
                    </div>
                    <div className="space-y-2">
                      <div data-testid="text-avg-calories" className="text-4xl font-black drop-shadow-lg" style={{ color: 'var(--color-text-on-activity)' }}>{nutritionStats.averageCaloriesPerDay}</div>
                      <div className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-on-activity)', opacity: 0.9 }}>Avg Calories/Day</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Weight Trend Section */}
            {weightTrendData.length > 0 ? (
              <Card 
                data-testid="card-weight-trend"
                className="card-glass border-action/20 shadow-2xl"
              >
                <CardHeader className="card-header bg-gradient-to-r from-action/10 to-activity/5 rounded-t-xl">
                  <div className="flex-start gap-3">
                    <div className="icon-badge icon-badge-action">
                      <TrendingUp className="w-6 h-6" style={{ color: 'var(--color-text-on-action)' }} />
                    </div>
                    <CardTitle className="card-title text-primary text-2xl font-bold">Weight Trend Analysis</CardTitle>
                  </div>
                  <CardDescription className="card-description text-secondary text-lg">
                    Visualize your weight changes over time {isGuestMode && '(from your local progress entries)'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content space-y-6">
                  <div className="h-72 w-full">
                    {chartsLoading ? (
                      <div className="flex-center h-full bg-surface rounded-lg border-primary">
                        <div className="flex-start gap-3">
                          <div className="w-6 h-6 border-2 border-action rounded-full animate-spin"></div>
                          <span className="text-secondary">Loading chart...</span>
                        </div>
                      </div>
                    ) : chartComponents ? (
                      <chartComponents.ResponsiveContainer width="100%" height="100%">
                        <chartComponents.LineChart data={weightTrendData}>
                          <chartComponents.CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <chartComponents.XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                          />
                          <chartComponents.YAxis 
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                          />
                          <chartComponents.Tooltip 
                            contentStyle={{ 
                              background: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, 'Weight']}
                          />
                          <chartComponents.Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="var(--color-activity)" 
                            strokeWidth={3}
                            dot={{ fill: 'var(--color-activity)', strokeWidth: 2, r: 5 }}
                          />
                        </chartComponents.LineChart>
                      </chartComponents.ResponsiveContainer>
                    ) : (
                      <div className="flex-center h-full bg-surface rounded-lg border-primary">
                        <span className="text-secondary">Chart unavailable</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Motivational Insights */}
                  <div 
                    data-testid="weight-insights"
                    className="card-insight"
                  >
                    <div className="flex-start gap-4">
                      <div className="icon-badge icon-badge-lg bg-action rounded-xl shadow-lg">
                        <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-text-on-action)' }} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-xl text-primary">Weight Progress Insight</h4>
                        <p data-testid="text-weight-insight" className="text-base text-secondary leading-relaxed">
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
                className="card-wellness border-wellness/20 shadow-xl"
              >
                <CardHeader className="card-header bg-gradient-to-r from-wellness/10 to-action/5 rounded-t-xl">
                  <div className="flex-start gap-3">
                    <div className="icon-badge icon-badge-wellness">
                      <TrendingUp className="w-6 h-6" style={{ color: 'var(--color-text-on-action)' }} />
                    </div>
                    <CardTitle className="card-title text-primary text-2xl font-bold">Weight Trend Analysis</CardTitle>
                  </div>
                  <CardDescription className="card-description text-secondary text-lg">
                    No weight data available yet. Start logging your weight in the profile section to see trends.
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content p-8">
                  <div className="action-item text-center space-y-4">
                    <div className="icon-badge icon-badge-2xl bg-gradient-to-br from-wellness to-action rounded-full flex-center mx-auto shadow-2xl">
                      <TrendingUp className="w-10 h-10" style={{ color: 'var(--color-text-on-action)' }} />
                    </div>
                    <h4 className="font-bold text-2xl text-primary mb-3">Ready to Track Your Progress?</h4>
                    <p className="text-lg text-secondary leading-relaxed max-w-md mx-auto">
                      Start logging your weight regularly to visualize your fitness journey and get personalized insights!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badges & Achievements Section */}
            <div className="space-y-4">
              <div className="section-header">
                <h2 className="text-2xl font-bold text-primary flex-start gap-3">
                  <div className="icon-badge icon-badge-success">
                    <Trophy className="w-6 h-6" style={{ color: 'var(--color-text-on-action)' }} />
                  </div>
                  Badges & Achievements
                </h2>
                <p className="text-secondary text-lg">Celebrate your fitness milestones and unlock new badges</p>
              </div>
              <Card 
                data-testid="card-badges-achievements"
                className="card-success border-success/30 shadow-2xl"
              >
                <CardHeader className="card-header bg-gradient-to-r from-success/20 to-activity/10 rounded-t-xl">
                  <div className="flex-start gap-3">
                    <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                      <Trophy className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="card-title text-2xl font-bold" style={{ color: 'var(--color-text-on-action)' }}>Your Achievements</CardTitle>
                      <CardDescription className="card-description text-lg" style={{ color: 'var(--color-text-on-action)', opacity: 0.9 }}>
                        Unlock badges by hitting milestones in your fitness journey!
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    data-testid="badges-scroll-container"
                    className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {(() => {
                      const achievements = [
                        {
                          id: 'first-workout',
                          title: 'First Step',
                          description: 'Complete your first workout',
                          icon: Dumbbell,
                          cardClass: 'card-activity',
                          earned: workoutStats.totalWorkouts >= 1,
                          target: 1,
                          current: workoutStats.totalWorkouts
                        },
                        {
                          id: 'week-warrior',
                          title: 'Week Warrior',
                          description: 'Maintain a 7-day streak',
                          icon: Calendar,
                          cardClass: 'card-success',
                          earned: workoutStats.currentStreak >= 7,
                          target: 7,
                          current: workoutStats.currentStreak
                        },
                        {
                          id: 'workout-dozen',
                          title: 'Dirty Dozen',
                          description: 'Complete 12 workouts',
                          icon: Target,
                          cardClass: 'card-action',
                          earned: workoutStats.totalWorkouts >= 12,
                          target: 12,
                          current: workoutStats.totalWorkouts
                        },
                        {
                          id: 'meal-master',
                          title: 'Meal Master',
                          description: 'Log 25 meals',
                          icon: Apple,
                          cardClass: 'card-nutrition',
                          earned: nutritionStats.totalMealsLogged >= 25,
                          target: 25,
                          current: nutritionStats.totalMealsLogged
                        },
                        {
                          id: 'consistency-king',
                          title: 'Consistency King',
                          description: 'Achieve a 14-day streak',
                          icon: Crown,
                          cardClass: 'card-warning',
                          earned: workoutStats.currentStreak >= 14,
                          target: 14,
                          current: workoutStats.currentStreak
                        },
                        {
                          id: 'half-century',
                          title: 'Half Century',
                          description: 'Complete 50 workouts',
                          icon: Medal,
                          cardClass: 'card-wellness',
                          earned: workoutStats.totalWorkouts >= 50,
                          target: 50,
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
                            className={`flex-shrink-0 w-32 ${achievement.cardClass} border-2 border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300 interactive-enhanced group cursor-pointer ${
                              achievement.earned ? 'ring-4 ring-white/30 shadow-white/20' : 'opacity-85'
                            }`}
                          >
                            <div className="p-4 text-center space-y-3">
                              <div className="relative">
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex-center backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:scale-110 ${
                                  achievement.earned ? 'bg-white/25' : 'bg-white/15'
                                }`}>
                                  <IconComponent className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
                                </div>
                                
                                {/* Achievement checkmark */}
                                {achievement.earned && (
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-lg flex-center">
                                    <BadgeCheck className="w-4 h-4 text-green-500" />
                                  </div>
                                )}
                                
                                {/* Progress ring for locked badges */}
                                {!achievement.earned && achievement.current > 0 && (
                                  <div className="absolute inset-0 w-16 h-16 mx-auto">
                                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
                                      <circle
                                        cx="30"
                                        cy="30"
                                        r="28"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                        className="opacity-20"
                                      />
                                      <circle
                                        cx="30"
                                        cy="30"
                                        r="28"
                                        stroke="white"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeDasharray={`${progressPercent * 1.76} 176`}
                                        className="transition-all duration-700 shadow-lg"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <h4 
                                  data-testid={`text-badge-title-${achievement.id}`}
                                  className="text-sm font-black drop-shadow-lg"
                                  style={{ color: 'var(--color-text-on-action)' }}
                                >
                                  {achievement.title}
                                </h4>
                                <p 
                                  data-testid={`text-badge-progress-${achievement.id}`}
                                  className="text-xs font-medium"
                                  style={{ color: 'var(--color-text-on-action)', opacity: 0.9 }}
                                >
                                  {achievement.earned ? '✓ Earned!' : `${achievement.current}/${achievement.target}`}
                                </p>
                              </div>
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
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-medium text-primary">Achievement Progress</span>
                      </div>
                      <div 
                        data-testid="text-achievement-summary"
                        className="text-sm text-secondary"
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
              className="card-nutrition backdrop-blur-xl shadow-lg"
              style={{
                boxShadow: `0 10px 15px -3px rgba(var(--color-nutrition-rgb), 0.2), 0 4px 6px -2px rgba(var(--color-nutrition-rgb), 0.05)`
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl text-primary">Daily Calories (Last 7 Days)</CardTitle>
                </div>
                <CardDescription className="text-secondary">
                  Your daily calorie intake {isGuestMode && '(from your logged meals)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calorieChartData.some(data => data.calories > 0) ? (
                  <div className="h-64 w-full">
                    {chartsLoading ? (
                      <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-muted-foreground">Loading chart...</span>
                        </div>
                      </div>
                    ) : chartComponents ? (
                      <chartComponents.ResponsiveContainer width="100%" height="100%">
                        <chartComponents.BarChart data={calorieChartData}>
                          <chartComponents.CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <chartComponents.XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                          />
                          <chartComponents.YAxis 
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                          />
                          <chartComponents.Tooltip 
                            contentStyle={{ 
                              background: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '8px'
                            }}
                          />
                          <chartComponents.Bar 
                            dataKey="calories" 
                            fill="var(--color-nutrition)"
                            radius={[4, 4, 0, 0]}
                          />
                        </chartComponents.BarChart>
                      </chartComponents.ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border border-border">
                        <span className="text-muted-foreground">Chart unavailable</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-secondary text-center py-8">
                    No meals logged yet. Start tracking your nutrition to see daily calorie trends!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Workout Consistency Section */}
            <Card 
              data-testid="card-workout-details"
              className="card-base backdrop-blur-xl"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl text-primary">Workout Details</CardTitle>
                </div>
                <CardDescription className="text-secondary">
                  Your workout performance and consistency metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    data-testid="card-workouts-this-month"
                    className="text-center p-4 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg backdrop-blur-sm"
                  >
                    <div data-testid="text-workouts-this-month" className="text-2xl font-bold text-primary">{workoutStats.workoutsThisMonth}</div>
                    <div className="text-sm text-primary/80">Workouts This Month</div>
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
                    <div data-testid="text-average-rir" className="text-2xl font-bold text-primary">{workoutStats.averageRIR}</div>
                    <div className="text-sm text-primary/80">Average RIR (Reps in Reserve)</div>
                  </div>
                )}

                {workoutStats.totalWorkouts > 0 ? (
                  <p className="text-sm text-secondary">
                    {workoutStats.currentStreak > 0 
                      ? `Great consistency! You're on a ${workoutStats.currentStreak}-day streak. Keep up the momentum!`
                      : "Keep building your consistency! Try to workout regularly to build a streak."
                    }
                  </p>
                ) : (
                  <p className="text-sm text-secondary">
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