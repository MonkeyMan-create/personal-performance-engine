import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalStorageService, MealData } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface MealFormProps {
  meal?: MealData | null;
  onSave: () => void;
}

export function MealForm({ meal, onSave }: MealFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    mealType: "breakfast" as const,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name,
        mealType: meal.mealType || "breakfast",
        calories: meal.calories?.toString() || "",
        protein: meal.protein?.toString() || "",
        carbs: meal.carbs?.toString() || "",
        fat: meal.fat?.toString() || "",
        notes: meal.notes || "",
      });
    }
  }, [meal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      });
      return;
    }

    const user = LocalStorageService.getUser();
    const mealData: MealData = {
      id: meal?.id || Date.now().toString(),
      userId: user?.id || 'demo-user',
      name: formData.name.trim(),
      date: meal?.date || new Date(),
      mealType: formData.mealType,
      calories: parseFloat(formData.calories) || undefined,
      protein: parseFloat(formData.protein) || undefined,
      carbs: parseFloat(formData.carbs) || undefined,
      fat: parseFloat(formData.fat) || undefined,
      notes: formData.notes.trim() || undefined,
    };

    LocalStorageService.saveMeal(mealData);
    onSave();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {meal ? "Edit Meal" : "Log New Meal"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-name">Meal Name *</Label>
            <Input
              id="meal-name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Grilled Chicken Salad"
              className="bg-input border border-border"
              data-testid="input-meal-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={formData.mealType} onValueChange={(value) => updateField('mealType', value)}>
              <SelectTrigger id="meal-type" data-testid="select-meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => updateField('calories', e.target.value)}
                placeholder="0"
                className="bg-input border border-border"
                data-testid="input-calories"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={(e) => updateField('protein', e.target.value)}
                placeholder="0"
                className="bg-input border border-border"
                data-testid="input-protein"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => updateField('carbs', e.target.value)}
                placeholder="0"
                className="bg-input border border-border"
                data-testid="input-carbs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={(e) => updateField('fat', e.target.value)}
                placeholder="0"
                className="bg-input border border-border"
                data-testid="input-fat"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Add any notes about the meal..."
              className="bg-input border border-border resize-none h-20"
              data-testid="textarea-meal-notes"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-save-meal"
            >
              {meal ? "Update Meal" : "Log Meal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
