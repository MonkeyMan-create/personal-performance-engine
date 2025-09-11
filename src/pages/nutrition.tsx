import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, X } from 'lucide-react'
import { saveMealLocally, getMealsByDateLocally } from '../utils/guestStorage'

interface MealData {
  mealType: string
  foodItem: string
  calories: string
}

interface SavedMeal {
  id: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodItem: string
  calories: number
  date: string
}

export default function NutritionPage() {
  const { user, isGuestMode } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [mealData, setMealData] = useState<MealData>({
    mealType: '',
    foodItem: '',
    calories: ''
  })
  const [meals, setMeals] = useState<SavedMeal[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load today's meals on component mount
  useEffect(() => {
    const loadMeals = async () => {
      setIsLoading(true)
      try {
        if (isGuestMode) {
          // Load today's meals from localStorage for guest users
          const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
          const guestMeals = getMealsByDateLocally(today)
          setMeals(guestMeals)
        } else if (user) {
          // TODO: Load today's meals from Firebase/cloud for authenticated users
          // This would be implemented when connecting to the backend
          setMeals([])
        }
      } catch (error) {
        console.error('Failed to load meals:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user || isGuestMode) {
      loadMeals()
    }
  }, [user, isGuestMode])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Nutrition"
        description="Track your food intake and calories to optimize your nutrition and reach your fitness goals."
      />
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      const calories = parseInt(mealData.calories)
      
      // Validate calories input
      if (isNaN(calories) || calories <= 0) {
        throw new Error('Please enter a valid positive number for calories')
      }

      const mealToSave = {
        mealType: mealData.mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        foodItem: mealData.foodItem,
        calories,
        date: today
      }

      if (isGuestMode) {
        // Save to localStorage for guest users (without ID)
        const savedId = saveMealLocally(mealToSave)
        // Reload today's meals from localStorage
        const updatedMeals = getMealsByDateLocally(today)
        setMeals(updatedMeals)
      } else if (user) {
        // TODO: Save to Firebase/cloud for authenticated users
        // This would be implemented when connecting to the backend
        console.log('Would save to cloud:', mealToSave)
      }

      // Reset form
      setShowForm(false)
      setMealData({ mealType: '', foodItem: '', calories: '' })
    } catch (error) {
      console.error('Failed to save meal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof MealData, value: string) => {
    setMealData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Nutrition</h1>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20"
            data-testid="button-log-meal"
          >
            <Plus className="w-4 h-4 mr-2" />
            + Log Meal
          </Button>
        </div>

        {showForm && (
          <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Log Meal</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  data-testid="button-close-form"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription className="text-slate-600 dark:text-slate-300">Track your food intake and calories</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="mealType" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                  Meal Type
                </label>
                <select
                  id="mealType"
                  value={mealData.mealType}
                  onChange={(e) => handleInputChange('mealType', e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                >
                  <option value="">Select meal type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label htmlFor="foodItem" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                  Food Item
                </label>
                <input
                  type="text"
                  id="foodItem"
                  value={mealData.foodItem}
                  onChange={(e) => handleInputChange('foodItem', e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter food item"
                  data-testid="input-food-item"
                  required
                />
              </div>

              <div>
                <label htmlFor="calories" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                  Calories
                </label>
                <input
                  type="number"
                  id="calories"
                  value={mealData.calories}
                  onChange={(e) => handleInputChange('calories', e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter calories"
                  min="1"
                  data-testid="input-calories"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 disabled:opacity-50"
                  data-testid="button-submit-meal"
                >
                  {isLoading ? 'Saving...' : 'Log Meal'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  data-testid="button-cancel-meal"
                >
                  Cancel
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Today's Meals</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Your logged meals and calories {isGuestMode && '(Guest Mode - stored locally)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-slate-600 dark:text-slate-300">Loading meals...</p>
            ) : meals.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-300">No meals logged yet. Start by adding your first meal!</p>
            ) : (
              <div className="space-y-3">
                {meals.map((meal) => (
                  <div 
                    key={meal.id} 
                    className="flex justify-between items-center p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-lg"
                    data-testid={`meal-item-${meal.id}`}
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{meal.foodItem}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">{meal.calories} cal</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{meal.date}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900 dark:text-white">Total Calories:</span>
                    <span className="font-bold text-lg text-cyan-600 dark:text-cyan-400">
                      {meals.reduce((total, meal) => total + meal.calories, 0)} cal
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}