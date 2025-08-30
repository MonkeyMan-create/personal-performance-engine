import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, X } from 'lucide-react'

interface MealData {
  mealType: string
  foodItem: string
  calories: string
}

export default function NutritionPage() {
  const { user, signInWithGoogle } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [mealData, setMealData] = useState<MealData>({
    mealType: '',
    foodItem: '',
    calories: ''
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-lg">Please sign in to view your nutrition</p>
            <Button onClick={signInWithGoogle} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Meal logged:', mealData)
    setShowForm(false)
    setMealData({ mealType: '', foodItem: '', calories: '' })
  }

  const handleInputChange = (field: keyof MealData, value: string) => {
    setMealData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Nutrition</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          + Log Meal
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Log Meal</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Track your food intake and calories</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="mealType" className="block text-sm font-medium mb-2">
                  Meal Type
                </label>
                <select
                  id="mealType"
                  value={mealData.mealType}
                  onChange={(e) => handleInputChange('mealType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select meal type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label htmlFor="foodItem" className="block text-sm font-medium mb-2">
                  Food Item
                </label>
                <input
                  type="text"
                  id="foodItem"
                  value={mealData.foodItem}
                  onChange={(e) => handleInputChange('foodItem', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter food item"
                  required
                />
              </div>

              <div>
                <label htmlFor="calories" className="block text-sm font-medium mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  id="calories"
                  value={mealData.calories}
                  onChange={(e) => handleInputChange('calories', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter calories"
                  min="0"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Log Meal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
          <CardDescription>Your logged meals and calories</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No meals logged yet. Start by adding your first meal!</p>
        </CardContent>
      </Card>
    </div>
  )
}