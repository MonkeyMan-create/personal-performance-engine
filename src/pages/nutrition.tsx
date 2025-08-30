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
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Branded Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                {/* Stylized heartbeat/pulse logo */}
                <svg 
                  className="w-10 h-10 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Glowing effect */}
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="bg-slate-800/80 border-slate-700/50 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-2xl font-bold text-white">Nutrition</h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Please sign in to view your nutrition
              </p>
              <Button 
                onClick={signInWithGoogle} 
                className="w-full h-12 text-base font-semibold bg-slate-700 hover:bg-slate-600 text-white border-2 border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-cyan-400/20" 
                size="lg"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <p className="text-center text-sm text-slate-400 mt-6">
                Secure authentication powered by Google
              </p>
            </CardContent>
          </Card>

          {/* Subtle brand footer */}
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Elevate your fitness journey with smart technology
            </p>
          </div>
        </div>
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