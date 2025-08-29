import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bot, Target, TrendingUp } from "lucide-react";
import { LocalStorageService, MealData, NutritionGoalData } from "@/lib/localStorage";
import { NutritionTracker } from "@/components/nutrition-tracker";
import { MealForm } from "@/components/meal-form";
import { AIChef } from "@/components/ai-chef";
import { useToast } from "@/hooks/use-toast";

export default function Nutrition() {
  const [todaysMeals, setTodaysMeals] = useState<MealData[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoalData | null>(null);
  const [showMealForm, setShowMealForm] = useState(false);
  const [showAIChef, setShowAIChef] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const meals = LocalStorageService.getMeals(new Date());
    setTodaysMeals(meals);
    
    const goals = LocalStorageService.getNutritionGoals();
    setNutritionGoals(goals);
  };

  const calculateTotals = () => {
    return todaysMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + (meal.calories || 0),
        protein: totals.protein + (meal.protein || 0),
        carbs: totals.carbs + (meal.carbs || 0),
        fat: totals.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const totals = calculateTotals();
  const defaultGoals = {
    dailyCalories: 2500,
    dailyProtein: 180,
    dailyCarbs: 250,
    dailyFat: 83,
  };
  const goals = nutritionGoals || defaultGoals;

  const handleMealSaved = () => {
    loadData();
    setShowMealForm(false);
    setEditingMeal(null);
    toast({
      title: "Meal Saved!",
      description: "Your meal has been logged successfully.",
    });
  };

  const handleMealEdit = (meal: MealData) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  const handleMealDelete = (mealId: string) => {
    LocalStorageService.deleteMeal(mealId);
    loadData();
    toast({
      title: "Meal Deleted",
      description: "Meal has been removed from your log.",
    });
  };

  if (showMealForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {editingMeal ? "Edit Meal" : "Log Meal"}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowMealForm(false);
              setEditingMeal(null);
            }}
            data-testid="button-close-meal-form"
          >
            Cancel
          </Button>
        </div>
        <MealForm meal={editingMeal} onSave={handleMealSaved} />
      </div>
    );
  }

  if (showAIChef) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">AI Chef</h1>
          <Button
            variant="outline"
            onClick={() => setShowAIChef(false)}
            data-testid="button-close-ai-chef"
          >
            Back
          </Button>
        </div>
        <AIChef />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowAIChef(true)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          data-testid="button-open-ai-chef"
        >
          <Bot className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today" data-testid="tab-today">Today</TabsTrigger>
          <TabsTrigger value="goals" data-testid="tab-goals">Goals</TabsTrigger>
          <TabsTrigger value="tracker" data-testid="tab-tracker">Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {/* Macro Overview */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Today's Macros</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {totals.calories.toLocaleString()} / {goals.dailyCalories.toLocaleString()} cal
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="text-foreground font-medium">
                      {Math.round(totals.protein)}g / {goals.dailyProtein}g
                    </span>
                  </div>
                  <Progress 
                    value={(totals.protein / goals.dailyProtein) * 100} 
                    className="h-2"
                    data-testid="progress-protein"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="text-foreground font-medium">
                      {Math.round(totals.carbs)}g / {goals.dailyCarbs}g
                    </span>
                  </div>
                  <Progress 
                    value={(totals.carbs / goals.dailyCarbs) * 100} 
                    className="h-2"
                    data-testid="progress-carbs"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Fat</span>
                    <span className="text-foreground font-medium">
                      {Math.round(totals.fat)}g / {goals.dailyFat}g
                    </span>
                  </div>
                  <Progress 
                    value={(totals.fat / goals.dailyFat) * 100} 
                    className="h-2"
                    data-testid="progress-fat"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Meals */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Today's Meals</h3>
              <Button
                onClick={() => setShowMealForm(true)}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-add-meal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>

            {todaysMeals.length === 0 ? (
              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No meals logged today</p>
                    <p className="text-sm">Start tracking your nutrition</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {todaysMeals.map((meal) => (
                  <Card key={meal.id} className="bg-card border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src="https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                            alt={meal.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-foreground">{meal.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {meal.mealType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(meal.protein || 0)}g P • {Math.round(meal.carbs || 0)}g C • {Math.round(meal.fat || 0)}g F
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {meal.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{meal.calories}</p>
                          <p className="text-xs text-muted-foreground">cal</p>
                          <div className="flex space-x-1 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMealEdit(meal)}
                              data-testid={`button-edit-meal-${meal.id}`}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMealDelete(meal.id)}
                              data-testid={`button-delete-meal-${meal.id}`}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Nutrition Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{goals.dailyCalories}</p>
                  <p className="text-sm text-muted-foreground">Daily Calories</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-accent">{goals.dailyProtein}g</p>
                  <p className="text-sm text-muted-foreground">Daily Protein</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-secondary">{goals.dailyCarbs}g</p>
                  <p className="text-sm text-muted-foreground">Daily Carbs</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-chart-3">{goals.dailyFat}g</p>
                  <p className="text-sm text-muted-foreground">Daily Fat</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-edit-goals"
              >
                Edit Goals
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Nutrition trends coming soon</p>
                  <p className="text-xs">Track meals to see progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-4">
          <NutritionTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
