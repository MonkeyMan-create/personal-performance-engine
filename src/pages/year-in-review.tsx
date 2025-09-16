import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Calendar, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Award, 
  Target, 
  Flame, 
  Clock, 
  Trophy,
  Medal,
  Zap,
  Star,
  Activity,
  Heart,
  ChevronLeft
} from 'lucide-react'
import { getWorkoutsLocally, getMealsLocally, getProgressLocally, GuestWorkout, GuestMeal, GuestProgress } from '../utils/guestStorage'
import { useMeasurement } from '../contexts/MeasurementContext'
import { Button } from '../components/ui/button'
import { Link } from 'wouter'

interface YearlyStats {
  totalWorkouts: number
  totalSets: number
  totalReps: number
  totalWeightLifted: number
  favoriteExercises: Array<{ name: string; count: number }>
  strongestLifts: Array<{ exercise: string; maxWeight: number; date: string }>
  longestStreak: number
  activeDays: number
  totalMeals: number
  averageCalories: number
  totalCalories: number
  weightChange: number
  progressEntries: number
  monthlyWorkouts: Array<{ month: string; workouts: number }>
  activityHeatmap: Array<{ date: string; count: number }>
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  earned: boolean
  date?: string
  value?: number
}

export default function YearInReviewPage() {
  const { user, isGuestMode } = useAuth()
  const { convertWeight, formatWeight, unit } = useMeasurement()
  const [yearlyStats, setYearlyStats] = useState<YearlyStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [chartComponents, setChartComponents] = useState<any>(null)
  const [currentYear] = useState(new Date().getFullYear())

  // Colors for different chart elements
  const chartColors = {
    primary: 'hsl(var(--color-activity))',
    secondary: 'hsl(var(--color-nutrition))',
    accent: 'hsl(var(--color-wellness))',
    muted: 'hsl(var(--color-surface))'
  }

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
          Bar: recharts.Bar,
          Cell: recharts.Cell
        })
      } catch (error) {
        console.error('Failed to load chart components:', error)
      } finally {
        setChartsLoading(false)
      }
    }

    loadChartComponents()
  }, [])

  useEffect(() => {
    const calculateYearlyStats = async () => {
      setIsLoading(true)
      try {
        if (isGuestMode || user) {
          const workouts = getWorkoutsLocally()
          const meals = getMealsLocally()
          const progress = getProgressLocally()

          // Filter data for current year
          const yearStart = new Date(currentYear, 0, 1)
          const yearEnd = new Date(currentYear, 11, 31)
          
          const yearWorkouts = workouts.filter(w => {
            const date = new Date(w.date)
            return date >= yearStart && date <= yearEnd
          })
          
          const yearMeals = meals.filter(m => {
            const date = new Date(m.date)
            return date >= yearStart && date <= yearEnd
          })
          
          const yearProgress = progress.filter(p => {
            const date = new Date(p.date)
            return date >= yearStart && date <= yearEnd
          })

          // Calculate workout statistics
          const totalSets = yearWorkouts.reduce((sum, workout) => 
            sum + workout.exercises.reduce((exSum, ex) => exSum + ex.sets.length, 0), 0
          )
          
          const totalReps = yearWorkouts.reduce((sum, workout) => 
            sum + workout.exercises.reduce((exSum, ex) => 
              exSum + ex.sets.reduce((setSum, set) => setSum + set.reps, 0), 0
            ), 0
          )
          
          const totalWeightLifted = yearWorkouts.reduce((sum, workout) => 
            sum + workout.exercises.reduce((exSum, ex) => 
              exSum + ex.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0
            ), 0
          )

          // Calculate favorite exercises
          const exerciseCounts: Record<string, number> = {}
          yearWorkouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
              exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + exercise.sets.length
            })
          })
          
          const favoriteExercises = Object.entries(exerciseCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

          // Calculate strongest lifts
          const maxLifts: Record<string, { weight: number; date: string }> = {}
          yearWorkouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
              exercise.sets.forEach(set => {
                const current = maxLifts[exercise.name]
                if (!current || set.weight > current.weight) {
                  maxLifts[exercise.name] = { weight: set.weight, date: workout.date }
                }
              })
            })
          })
          
          const strongestLifts = Object.entries(maxLifts)
            .map(([exercise, data]) => ({ exercise, maxWeight: data.weight, date: data.date }))
            .sort((a, b) => b.maxWeight - a.maxWeight)
            .slice(0, 3)

          // Calculate activity patterns
          const workoutDates = new Set(yearWorkouts.map(w => w.date))
          const activeDays = workoutDates.size
          
          // Calculate monthly breakdown
          const monthlyWorkouts = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'short' })
            const monthWorkouts = yearWorkouts.filter(w => new Date(w.date).getMonth() === i).length
            return { month, workouts: monthWorkouts }
          })

          // Calculate activity heatmap (simplified)
          const activityHeatmap = Array.from({ length: 365 }, (_, i) => {
            const date = new Date(yearStart)
            date.setDate(date.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            const hasWorkout = workoutDates.has(dateStr)
            const mealCount = yearMeals.filter(m => m.date === dateStr).length
            return { 
              date: dateStr, 
              count: hasWorkout ? 2 : (mealCount > 0 ? 1 : 0) 
            }
          })

          // Calculate nutrition stats
          const totalCalories = yearMeals.reduce((sum, meal) => sum + meal.calories, 0)
          const averageCalories = yearMeals.length > 0 ? Math.round(totalCalories / yearMeals.length) : 0

          // Calculate weight change
          let weightChange = 0
          if (yearProgress.length >= 2) {
            const sortedProgress = yearProgress
              .filter(p => p.weight !== undefined)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            
            if (sortedProgress.length >= 2) {
              const firstWeight = sortedProgress[0].weight!
              const lastWeight = sortedProgress[sortedProgress.length - 1].weight!
              weightChange = convertWeight(lastWeight - firstWeight, 'lbs')
            }
          }

          // Calculate longest streak
          let longestStreak = 0
          let currentStreak = 0
          const sortedDates = Array.from(workoutDates).sort()
          
          for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
              currentStreak = 1
            } else {
              const prevDate = new Date(sortedDates[i - 1])
              const currDate = new Date(sortedDates[i])
              const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
              
              if (dayDiff === 1) {
                currentStreak++
              } else {
                longestStreak = Math.max(longestStreak, currentStreak)
                currentStreak = 1
              }
            }
          }
          longestStreak = Math.max(longestStreak, currentStreak)

          const stats: YearlyStats = {
            totalWorkouts: yearWorkouts.length,
            totalSets,
            totalReps,
            totalWeightLifted: Math.round(totalWeightLifted),
            favoriteExercises,
            strongestLifts,
            longestStreak,
            activeDays,
            totalMeals: yearMeals.length,
            averageCalories,
            totalCalories: Math.round(totalCalories),
            weightChange,
            progressEntries: yearProgress.length,
            monthlyWorkouts,
            activityHeatmap
          }

          setYearlyStats(stats)

          // Calculate achievements based on stats
          const calculatedAchievements: Achievement[] = [
            {
              id: 'workout-warrior',
              title: 'Workout Warrior',
              description: 'Complete 50+ workouts in a year',
              icon: Dumbbell,
              earned: stats.totalWorkouts >= 50,
              value: stats.totalWorkouts
            },
            {
              id: 'consistency-champion',
              title: 'Consistency Champion',
              description: 'Maintain a 7+ day workout streak',
              icon: Calendar,
              earned: stats.longestStreak >= 7,
              value: stats.longestStreak
            },
            {
              id: 'strength-seeker',
              title: 'Strength Seeker',
              description: 'Complete 500+ total sets',
              icon: Trophy,
              earned: stats.totalSets >= 500,
              value: stats.totalSets
            },
            {
              id: 'nutrition-tracker',
              title: 'Nutrition Tracker',
              description: 'Log 100+ meals',
              icon: Apple,
              earned: stats.totalMeals >= 100,
              value: stats.totalMeals
            },
            {
              id: 'progress-logger',
              title: 'Progress Logger',
              description: 'Track progress regularly',
              icon: TrendingUp,
              earned: stats.progressEntries >= 10,
              value: stats.progressEntries
            },
            {
              id: 'active-lifestyle',
              title: 'Active Lifestyle',
              description: 'Stay active 100+ days',
              icon: Activity,
              earned: stats.activeDays >= 100,
              value: stats.activeDays
            }
          ]

          setAchievements(calculatedAchievements)
        }
      } catch (error) {
        console.error('Failed to calculate yearly stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user || isGuestMode) {
      calculateYearlyStats()
    }
  }, [user, isGuestMode, currentYear, convertWeight])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Year in Review"
        description="See your complete fitness journey with detailed insights, achievements, and progress over the year."
      />
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-success/30 mx-auto">
              <Trophy className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-success rounded-2xl blur-xl opacity-30 animate-pulse mx-auto"></div>
          </div>
          <p className="text-secondary font-medium">Calculating your year...</p>
        </div>
      </div>
    )
  }

  if (!yearlyStats) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 space-y-6 pb-24">
          <div className="flex items-center gap-4 pt-4">
            <Link href="/profile">
              <Button variant="outline" size="sm" data-testid="button-back" className="text-secondary hover:text-primary">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-success rounded-xl border border-success/20">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Year in Review {currentYear}</h1>
            </div>
          </div>
          
          <Card className="card-base border-primary backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="p-4 icon-badge-success rounded-xl border border-success/20 w-fit mx-auto mb-4">
                <Trophy className="w-16 h-16 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">No Data Available</h3>
              <p className="text-secondary">
                Start tracking your workouts, meals, and progress to see your year in review!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Link href="/profile">
            <Button variant="outline" size="sm" data-testid="button-back" className="text-secondary hover:text-primary">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 icon-badge-success rounded-xl border border-success/20">
                <Trophy className="w-6 h-6 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Year in Review {currentYear}</h1>
            </div>
            {isGuestMode && (
              <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded mt-1 inline-block border border-warning/30">
                Guest Mode - Local Data
              </span>
            )}
          </div>
        </div>

        {/* Hero Stats */}
        <Card className="card-success border-success/30 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
              <div className="p-2 icon-badge-success rounded-xl border border-success/20">
                <Trophy className="w-8 h-8 text-success" />
              </div>
              Your Fitness Journey
            </CardTitle>
            <CardDescription className="text-lg text-secondary">
              An incredible year of growth and dedication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-activity" data-testid="stat-total-workouts">{yearlyStats.totalWorkouts}</div>
                <div className="text-sm font-medium text-secondary">Workouts</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-activity" data-testid="stat-total-sets">{yearlyStats.totalSets}</div>
                <div className="text-sm font-medium text-secondary">Total Sets</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-nutrition" data-testid="stat-total-meals">{yearlyStats.totalMeals}</div>
                <div className="text-sm font-medium text-secondary">Meals Logged</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-wellness" data-testid="stat-active-days">{yearlyStats.activeDays}</div>
                <div className="text-sm font-medium text-secondary">Active Days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="card-activity border-primary backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-success rounded-xl border border-success/20">
                <Award className="w-6 h-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl text-primary">Achievements Unlocked</CardTitle>
                <CardDescription className="text-secondary">
                  Milestones you've reached this year
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="achievements-grid">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned 
                        ? 'card-success border-success/30' 
                        : 'card-muted border-primary'
                    }`}
                    data-testid={`achievement-${achievement.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned 
                          ? 'bg-success text-white' 
                          : 'bg-surface text-secondary'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          achievement.earned 
                            ? 'text-success' 
                            : 'text-primary'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned 
                            ? 'text-success' 
                            : 'text-secondary'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.value !== undefined && (
                          <p className="text-xs font-medium text-secondary mt-1">
                            Progress: {achievement.value}
                          </p>
                        )}
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-success text-white">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Workout Activity */}
        <Card className="card-activity border-primary backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 icon-badge-activity rounded-xl border border-activity/20">
                <Calendar className="w-6 h-6 text-activity" />
              </div>
              <div>
                <CardTitle className="text-xl text-primary">Monthly Activity</CardTitle>
                <CardDescription className="text-secondary">
                  Your workout consistency throughout the year
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full" data-testid="monthly-activity-chart">
              {chartsLoading ? (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading chart...</span>
                  </div>
                </div>
              ) : chartComponents ? (
                <chartComponents.ResponsiveContainer width="100%" height="100%">
                  <chartComponents.BarChart data={yearlyStats.monthlyWorkouts}>
                    <chartComponents.CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <chartComponents.XAxis 
                      dataKey="month" 
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
                      formatter={(value: number) => [`${value} workouts`, 'Workouts']}
                    />
                    <chartComponents.Bar dataKey="workouts" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
                  </chartComponents.BarChart>
                </chartComponents.ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border border-border">
                  <span className="text-muted-foreground">Chart unavailable</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Exercises */}
        {yearlyStats.favoriteExercises.length > 0 && (
          <Card className="card-activity border-primary backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 icon-badge-activity rounded-xl border border-activity/20">
                  <Dumbbell className="w-6 h-6 text-activity" />
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">Favorite Exercises</CardTitle>
                  <CardDescription className="text-secondary">
                    The exercises you performed most often
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="favorite-exercises">
                {yearlyStats.favoriteExercises.map((exercise, index) => (
                  <div key={exercise.name} className="flex items-center justify-between p-3 card-muted rounded-lg border border-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-activity text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-primary">{exercise.name}</span>
                    </div>
                    <Badge variant="secondary" data-testid={`exercise-count-${index}`}>
                      {exercise.count} sets
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strongest Lifts */}
        {yearlyStats.strongestLifts.length > 0 && (
          <Card className="card-activity border-primary backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 icon-badge-success rounded-xl border border-success/20">
                  <Medal className="w-6 h-6 text-success" />
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">Personal Records</CardTitle>
                  <CardDescription className="text-secondary">
                    Your strongest lifts this year
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="strongest-lifts">
                {yearlyStats.strongestLifts.map((lift, index) => (
                  <div key={lift.exercise} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white">{lift.exercise}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(lift.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" data-testid={`lift-weight-${index}`}>
                      {formatWeight(lift.maxWeight, 'lbs')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-3">
              <Star className="w-7 h-7" />
              Year in Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Total Calories</span>
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300" data-testid="stat-total-calories">
                  {yearlyStats.totalCalories.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Total Reps</span>
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300" data-testid="stat-total-reps">
                  {yearlyStats.totalReps.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Longest Streak</span>
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300" data-testid="stat-longest-streak">
                  {yearlyStats.longestStreak} days
                </div>
              </div>
            </div>

            {/* Weight Change */}
            {yearlyStats.weightChange !== 0 && (
              <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-700 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Weight Change</span>
                </div>
                <div className={`text-2xl font-bold ${
                  yearlyStats.weightChange > 0 
                    ? 'text-primary' 
                    : 'text-green-600 dark:text-green-400'
                }`} data-testid="stat-weight-change">
                  {yearlyStats.weightChange > 0 ? '+' : ''}{yearlyStats.weightChange.toFixed(1)} {unit}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Amazing Progress!
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              You've shown incredible dedication this year. Every workout, every meal logged, and every step forward has brought you closer to your goals.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Here's to an even stronger {currentYear + 1}! 💪
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}