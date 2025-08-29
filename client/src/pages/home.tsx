import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Dumbbell, Utensils, Trophy, Play } from "lucide-react";
import { LocalStorageService, WorkoutData, MealData } from "@/lib/localStorage";
import { useLocation } from "wouter";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [activeWorkout, setActiveWorkout] = useState<WorkoutData | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<MealData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({ workouts: 0, calories: 0 });

  useEffect(() => {
    // Load data
    const workout = LocalStorageService.getActiveWorkout();
    setActiveWorkout(workout);

    const meals = LocalStorageService.getMeals(new Date());
    setTodaysMeals(meals);

    // Calculate weekly stats
    const workouts = LocalStorageService.getWorkouts();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(w => 
      w.startTime >= weekAgo && w.isCompleted
    ).length;

    const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    setWeeklyStats({ workouts: weeklyWorkouts, calories: totalCalories });
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const continueWorkout = () => {
    setLocation('/workouts');
  };

  const startNewWorkout = () => {
    setLocation('/workouts');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">FitTracker Pro</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              data-testid="button-toggle-theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/profile')}
              className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold"
              data-testid="button-profile"
            >
              <span>JD</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Today's Overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Today's Overview</h2>
            <span className="text-sm text-muted-foreground">{currentDate}</span>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Workouts</p>
                    <p className="text-2xl font-bold text-accent" data-testid="text-weekly-workouts">
                      {weeklyStats.workouts}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This week</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="text-2xl font-bold text-primary" data-testid="text-daily-calories">
                      {weeklyStats.calories.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Today</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Workout Card */}
          {activeWorkout ? (
            <Card className="gradient-bg text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{activeWorkout.name}</h3>
                  <Badge className="bg-white/20 text-white border-white/20">
                    In Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">
                      {activeWorkout.exercises.length} exercises planned
                    </p>
                    <p className="text-lg font-semibold">
                      Started {new Date(activeWorkout.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Button
                    onClick={continueWorkout}
                    className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-white/90"
                    data-testid="button-continue-workout"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border border-border">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-foreground">Ready for a workout?</h3>
                  <p className="text-sm text-muted-foreground">Start your fitness journey today</p>
                </div>
                <Button
                  onClick={startNewWorkout}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-start-workout"
                >
                  Start New Workout
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress Chart Placeholder */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Weight Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="chart-container bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Trophy className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Progress visualization coming soon</p>
                  <p className="text-xs">Track your body metrics to see charts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Meals */}
          {todaysMeals.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Today's Nutrition</h3>
              {todaysMeals.slice(0, 2).map((meal) => (
                <Card key={meal.id} className="bg-card border border-border">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <img
                      src="https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                      alt={meal.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{meal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{meal.calories}</p>
                      <p className="text-xs text-muted-foreground">cal</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {todaysMeals.length > 2 && (
                <Button
                  variant="outline"
                  onClick={() => setLocation('/nutrition')}
                  className="w-full"
                  data-testid="button-view-all-meals"
                >
                  View All Meals
                </Button>
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
