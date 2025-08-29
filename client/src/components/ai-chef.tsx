import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Clock, Users, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: number;
  servings: number;
}

export function AIChef() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [preferences, setPreferences] = useState({
    proteinTarget: "40",
    mealType: "lunch",
    cookingTime: "30",
    dietaryRestrictions: [] as string[],
  });
  const { toast } = useToast();

  const generateRecipe = async () => {
    if (!preferences.proteinTarget || !preferences.mealType) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/ai/recipe', {
        proteinTarget: parseInt(preferences.proteinTarget),
        mealType: preferences.mealType,
        cookingTime: parseInt(preferences.cookingTime),
        dietaryRestrictions: preferences.dietaryRestrictions,
      });

      const recipeData = await response.json();
      setRecipe(recipeData);
      
      toast({
        title: "Recipe Generated! 👨‍🍳",
        description: `Created a high-protein ${preferences.mealType} recipe for you`,
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
      
      // Fallback recipe for offline use
      const fallbackRecipe: Recipe = {
        name: "High-Protein Chicken Bowl",
        ingredients: [
          "200g grilled chicken breast",
          "100g quinoa (cooked)",
          "1 cup mixed vegetables",
          "2 tbsp olive oil",
          "1 tbsp lemon juice",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Cook quinoa according to package instructions",
          "Season and grill chicken breast until cooked through",
          "Steam or sauté mixed vegetables",
          "Slice chicken and arrange over quinoa",
          "Top with vegetables and drizzle with olive oil and lemon",
          "Season with salt and pepper to taste"
        ],
        macros: {
          calories: 520,
          protein: 45,
          carbs: 35,
          fat: 18
        },
        prepTime: 25,
        servings: 1
      };
      setRecipe(fallbackRecipe);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (field: string, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
          <ChefHat className="h-4 w-4 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Chef</h2>
          <p className="text-sm text-muted-foreground">Generate personalized high-protein recipes</p>
        </div>
      </div>

      {/* Recipe Preferences */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recipe Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein-target">Protein Target (g)</Label>
              <Input
                id="protein-target"
                type="number"
                value={preferences.proteinTarget}
                onChange={(e) => updatePreference('proteinTarget', e.target.value)}
                placeholder="40"
                className="bg-input border border-border"
                data-testid="input-protein-target"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cooking-time">Max Cooking Time (min)</Label>
              <Input
                id="cooking-time"
                type="number"
                value={preferences.cookingTime}
                onChange={(e) => updatePreference('cookingTime', e.target.value)}
                placeholder="30"
                className="bg-input border border-border"
                data-testid="input-cooking-time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={preferences.mealType} onValueChange={(value) => updatePreference('mealType', value)}>
              <SelectTrigger id="meal-type" data-testid="select-meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="post-workout">Post-Workout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dietary Restrictions (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto'].map((restriction) => (
                <Button
                  key={restriction}
                  variant={preferences.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDietaryRestriction(restriction)}
                  data-testid={`button-restriction-${restriction.toLowerCase()}`}
                >
                  {restriction}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={generateRecipe}
            disabled={isLoading}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            data-testid="button-generate-recipe"
          >
            {isLoading ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <ChefHat className="h-4 w-4 mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Recipe */}
      {recipe && (
        <Card className="bg-card border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{recipe.name}</CardTitle>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {recipe.prepTime}m
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {recipe.servings}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{recipe.macros.calories}</p>
                <p className="text-xs text-muted-foreground">cal</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-accent">{recipe.macros.protein}g</p>
                <p className="text-xs text-muted-foreground">protein</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-primary">{recipe.macros.carbs}g</p>
                <p className="text-xs text-muted-foreground">carbs</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-secondary">{recipe.macros.fat}g</p>
                <p className="text-xs text-muted-foreground">fat</p>
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Instructions</h4>
              <ol className="space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            <Button
              variant="outline"
              className="w-full"
              data-testid="button-save-recipe"
            >
              Save Recipe
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
