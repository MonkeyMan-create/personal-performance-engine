import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Target } from "lucide-react";
import { LocalStorageService, MealData } from "@/lib/localStorage";

export function NutritionTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState<{ date: Date; meals: MealData[] }[]>([]);

  useEffect(() => {
    loadWeeklyData();
  }, [selectedDate]);

  const loadWeeklyData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() - i);
      const meals = LocalStorageService.getMeals(date);
      weekData.push({ date, meals });
    }
    setWeeklyData(weekData);
  };

  const calculateDayTotals = (meals: MealData[]) => {
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + (meal.calories || 0),
        protein: totals.protein + (meal.protein || 0),
        carbs: totals.carbs + (meal.carbs || 0),
        fat: totals.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getWeeklyAverages = () => {
    const totalDays = weeklyData.length;
    const weekTotals = weeklyData.reduce(
      (acc, day) => {
        const dayTotals = calculateDayTotals(day.meals);
        return {
          calories: acc.calories + dayTotals.calories,
          protein: acc.protein + dayTotals.protein,
          carbs: acc.carbs + dayTotals.carbs,
          fat: acc.fat + dayTotals.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      calories: Math.round(weekTotals.calories / totalDays),
      protein: Math.round(weekTotals.protein / totalDays),
      carbs: Math.round(weekTotals.carbs / totalDays),
      fat: Math.round(weekTotals.fat / totalDays),
    };
  };

  const weeklyAverages = getWeeklyAverages();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Weekly Nutrition Tracker</h3>
        <Button variant="outline" size="sm" data-testid="button-select-date">
          <Calendar className="h-4 w-4 mr-2" />
          This Week
        </Button>
      </div>

      {/* Weekly Averages */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Weekly Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl font-bold text-primary">{weeklyAverages.calories}</p>
              <p className="text-sm text-muted-foreground">Avg Calories</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl font-bold text-accent">{weeklyAverages.protein}g</p>
              <p className="text-sm text-muted-foreground">Avg Protein</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl font-bold text-secondary">{weeklyAverages.carbs}g</p>
              <p className="text-sm text-muted-foreground">Avg Carbs</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl font-bold text-chart-3">{weeklyAverages.fat}g</p>
              <p className="text-sm text-muted-foreground">Avg Fat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Daily Breakdown</h4>
        {weeklyData.map((day, index) => {
          const dayTotals = calculateDayTotals(day.meals);
          const isToday = day.date.toDateString() === new Date().toDateString();
          
          return (
            <Card key={index} className={`bg-card border ${isToday ? 'border-primary' : 'border-border'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-foreground">
                      {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h5>
                    {isToday && <Badge variant="default">Today</Badge>}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {day.meals.length} meals
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">{dayTotals.calories}</p>
                    <p className="text-xs text-muted-foreground">cal</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{Math.round(dayTotals.protein)}g</p>
                    <p className="text-xs text-muted-foreground">protein</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{Math.round(dayTotals.carbs)}g</p>
                    <p className="text-xs text-muted-foreground">carbs</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{Math.round(dayTotals.fat)}g</p>
                    <p className="text-xs text-muted-foreground">fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Goals Check */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Goal tracking coming soon</p>
            <p className="text-xs">Set nutrition goals to see weekly progress</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
