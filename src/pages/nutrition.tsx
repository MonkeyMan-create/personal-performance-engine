import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus, X } from 'lucide-react'

interface MealData {
  mealType: string
  foodItem: string
  calories: string
}

export default function NutritionPage() {
  const { user, isGuestMode } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [mealData, setMealData] = useState<MealData>({
    mealType: '',
    foodItem: '',
    calories: ''
  })

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Nutrition"
        description="Track your food intake and calories to optimize your nutrition and reach your fitness goals."
      />
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
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
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
                  min="0"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20">
                  Log Meal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
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
            <CardDescription className="text-slate-600 dark:text-slate-300">Your logged meals and calories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300">No meals logged yet. Start by adding your first meal!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}