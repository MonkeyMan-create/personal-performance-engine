import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Search, 
  Barcode, 
  Plus, 
  ChefHat,
  History,
  Star,
  Utensils,
  Loader2,
  ChevronRight,
  X,
  Check
} from 'lucide-react'
import { saveMealLocally, getMealsByDateLocally, GuestMeal } from '../utils/guestStorage'
import { toast } from '../hooks/use-toast'

interface FoodItem {
  id: string
  name: string
  brand?: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  serving?: string
  imageUrl?: string
  barcode?: string
}

interface MealToLog {
  foodItem: FoodItem
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  servings: number
}

export default function NutritionPage() {
  const { user, isGuestMode } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [servings, setServings] = useState(1)
  const [todayMeals, setTodayMeals] = useState<GuestMeal[]>([])
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([])
  const [activeTab, setActiveTab] = useState('search')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving: '100g'
  })

  // Load today's meals and recent foods
  useEffect(() => {
    if (user || isGuestMode) {
      const today = new Date().toISOString().split('T')[0]
      const meals = getMealsByDateLocally(today)
      setTodayMeals(meals)
      
      // Load recent foods from localStorage
      const stored = localStorage.getItem('recentFoods')
      if (stored) {
        setRecentFoods(JSON.parse(stored))
      }
    }
  }, [user, isGuestMode])

  // Update meal type based on current time
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 10) setMealType('breakfast')
    else if (hour < 14) setMealType('lunch')
    else if (hour < 18) setMealType('snack')
    else setMealType('dinner')
  }, [])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Nutrition Tracker"
        description="Search millions of foods, scan barcodes, and track your nutrition with ease."
      />
    )
  }

  const searchFoods = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    try {
      // Search Open Food Facts API
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`
      )
      
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      
      const foods: FoodItem[] = data.products.map((product: any) => ({
        id: product.code || product._id,
        name: product.product_name || 'Unknown Product',
        brand: product.brands,
        calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
        protein: product.nutriments?.proteins_100g,
        carbs: product.nutriments?.carbohydrates_100g,
        fat: product.nutriments?.fat_100g,
        serving: product.serving_size || '100g',
        imageUrl: product.image_url,
        barcode: product.code
      })).filter((food: FoodItem) => food.name !== 'Unknown Product')
      
      setSearchResults(foods)
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Search failed',
        description: 'Unable to search foods. Please try again.',
        variant: 'destructive'
      })
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchFoods(searchQuery)
  }

  const scanBarcode = async (barcode: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      )
      
      if (!response.ok) throw new Error('Product not found')
      
      const data = await response.json()
      
      if (data.status === 1 && data.product) {
        const product = data.product
        const food: FoodItem = {
          id: product.code,
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
          protein: product.nutriments?.proteins_100g,
          carbs: product.nutriments?.carbohydrates_100g,
          fat: product.nutriments?.fat_100g,
          serving: product.serving_size || '100g',
          imageUrl: product.image_url,
          barcode: product.code
        }
        
        setSelectedFood(food)
        toast({
          title: 'Product found!',
          description: `${food.name} - ${food.calories} cal per ${food.serving}`
        })
      } else {
        throw new Error('Product not found')
      }
    } catch (error) {
      toast({
        title: 'Barcode scan failed',
        description: 'Product not found in database. Try searching by name.',
        variant: 'destructive'
      })
    } finally {
      setIsSearching(false)
    }
  }

  const logFood = async (food: FoodItem) => {
    const today = new Date().toISOString().split('T')[0]
    
    const mealToLog: Omit<GuestMeal, 'id'> = {
      mealType,
      foodItem: food.name + (food.brand ? ` (${food.brand})` : ''),
      calories: Math.round(food.calories * servings),
      protein: food.protein ? Math.round(food.protein * servings) : undefined,
      carbs: food.carbs ? Math.round(food.carbs * servings) : undefined,
      fat: food.fat ? Math.round(food.fat * servings) : undefined,
      date: today
    }
    
    saveMealLocally(mealToLog)
    
    // Update recent foods
    const updatedRecent = [food, ...recentFoods.filter(f => f.id !== food.id)].slice(0, 10)
    setRecentFoods(updatedRecent)
    localStorage.setItem('recentFoods', JSON.stringify(updatedRecent))
    
    // Refresh today's meals
    const meals = getMealsByDateLocally(today)
    setTodayMeals(meals)
    
    // Reset form
    setSelectedFood(null)
    setServings(1)
    setSearchQuery('')
    setSearchResults([])
    
    toast({
      title: 'Meal logged!',
      description: `Added ${food.name} to ${mealType}`
    })
  }

  const logCustomFood = () => {
    const today = new Date().toISOString().split('T')[0]
    
    const mealToLog: Omit<GuestMeal, 'id'> = {
      mealType,
      foodItem: customFood.name,
      calories: parseInt(customFood.calories) || 0,
      protein: customFood.protein ? parseInt(customFood.protein) : undefined,
      carbs: customFood.carbs ? parseInt(customFood.carbs) : undefined,
      fat: customFood.fat ? parseInt(customFood.fat) : undefined,
      date: today
    }
    
    saveMealLocally(mealToLog)
    
    // Create food item for recent foods
    const foodItem: FoodItem = {
      id: `custom_${Date.now()}`,
      name: customFood.name,
      calories: parseInt(customFood.calories) || 0,
      protein: customFood.protein ? parseInt(customFood.protein) : undefined,
      carbs: customFood.carbs ? parseInt(customFood.carbs) : undefined,
      fat: customFood.fat ? parseInt(customFood.fat) : undefined,
      serving: customFood.serving
    }
    
    // Update recent foods
    const updatedRecent = [foodItem, ...recentFoods].slice(0, 10)
    setRecentFoods(updatedRecent)
    localStorage.setItem('recentFoods', JSON.stringify(updatedRecent))
    
    // Refresh today's meals
    const meals = getMealsByDateLocally(today)
    setTodayMeals(meals)
    
    // Reset form
    setShowCustomForm(false)
    setCustomFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      serving: '100g'
    })
    
    toast({
      title: 'Custom meal logged!',
      description: `Added ${foodItem.name} to ${mealType}`
    })
  }

  const todayStats = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nutrition</h1>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>Today: {todayStats.calories} cal</span>
            {todayStats.protein > 0 && <span>P: {todayStats.protein}g</span>}
            {todayStats.carbs > 0 && <span>C: {todayStats.carbs}g</span>}
            {todayStats.fat > 0 && <span>F: {todayStats.fat}g</span>}
          </div>
        </div>

        {/* Meal Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
            <Button
              key={type}
              variant={mealType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMealType(type)}
              className={mealType === type 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'border-slate-300 dark:border-slate-600'}
              data-testid={`button-meal-type-${type}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-slate-800/80">
            <TabsTrigger value="search" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-1" />
              Search
            </TabsTrigger>
            <TabsTrigger value="barcode" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Barcode className="w-4 h-4 mr-1" />
              Scan
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <History className="w-4 h-4 mr-1" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <ChefHat className="w-4 h-4 mr-1" />
              Custom
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for any food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    data-testid="input-food-search"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSearching}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    data-testid="button-search-food"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Search Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((food) => (
                    <div
                      key={food.id}
                      className="p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedFood(food)}
                      data-testid={`search-result-${food.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {food.name}
                          </h4>
                          {food.brand && (
                            <p className="text-xs text-slate-600 dark:text-slate-400">{food.brand}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">{food.calories} cal</span>
                            {food.protein && <span>P: {food.protein}g</span>}
                            {food.carbs && <span>C: {food.carbs}g</span>}
                            {food.fat && <span>F: {food.fat}g</span>}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            per {food.serving || '100g'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Barcode Tab */}
          <TabsContent value="barcode" className="space-y-4">
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Barcode className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Scan Barcode
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Enter a barcode number to find product information
                  </p>
                  <Input
                    type="text"
                    placeholder="Enter barcode number..."
                    className="max-w-xs mx-auto mb-4"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        scanBarcode(e.currentTarget.value)
                      }
                    }}
                    data-testid="input-barcode"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Camera scanning coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Foods Tab */}
          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Recent Foods</CardTitle>
                <CardDescription>Quick access to foods you've logged before</CardDescription>
              </CardHeader>
              <CardContent>
                {recentFoods.length === 0 ? (
                  <p className="text-center py-8 text-slate-600 dark:text-slate-400">
                    No recent foods yet. Start logging to build your history!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentFoods.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedFood(food)}
                        data-testid={`recent-food-${food.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {food.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
                              <span className="font-medium">{food.calories} cal</span>
                              {food.protein && <span>P: {food.protein}g</span>}
                              {food.carbs && <span>C: {food.carbs}g</span>}
                              {food.fat && <span>F: {food.fat}g</span>}
                            </div>
                          </div>
                          <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Food Tab */}
          <TabsContent value="custom" className="space-y-4">
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Custom Food</CardTitle>
                <CardDescription>Create a custom food entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                    Food Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Homemade Salad"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                    data-testid="input-custom-name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Calories
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({...customFood, calories: e.target.value})}
                      data-testid="input-custom-calories"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Serving Size
                    </label>
                    <Input
                      type="text"
                      placeholder="100g"
                      value={customFood.serving}
                      onChange={(e) => setCustomFood({...customFood, serving: e.target.value})}
                      data-testid="input-custom-serving"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Protein (g)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({...customFood, protein: e.target.value})}
                      data-testid="input-custom-protein"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Carbs (g)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({...customFood, carbs: e.target.value})}
                      data-testid="input-custom-carbs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                      Fat (g)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={customFood.fat}
                      onChange={(e) => setCustomFood({...customFood, fat: e.target.value})}
                      data-testid="input-custom-fat"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={logCustomFood}
                  disabled={!customFood.name || !customFood.calories}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-log-custom"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Custom Food
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Food Modal */}
        {selectedFood && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 animate-in slide-in-from-bottom-4">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-slate-900 dark:text-white">
                      {selectedFood.name}
                    </CardTitle>
                    {selectedFood.brand && (
                      <CardDescription>{selectedFood.brand}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFood(null)}
                    className="text-slate-600 dark:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {Math.round(selectedFood.calories * servings)}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 ml-1">cal</span>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    {selectedFood.protein && (
                      <span className="text-slate-600 dark:text-slate-400">
                        P: {Math.round(selectedFood.protein * servings)}g
                      </span>
                    )}
                    {selectedFood.carbs && (
                      <span className="text-slate-600 dark:text-slate-400">
                        C: {Math.round(selectedFood.carbs * servings)}g
                      </span>
                    )}
                    {selectedFood.fat && (
                      <span className="text-slate-600 dark:text-slate-400">
                        F: {Math.round(selectedFood.fat * servings)}g
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                    Number of Servings ({selectedFood.serving || '100g'} each)
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                      className="h-10 w-10"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                      className="text-center"
                      step="0.5"
                      min="0.5"
                      data-testid="input-servings"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setServings(servings + 0.5)}
                      className="h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => logFood(selectedFood)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-confirm-log"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Today's Summary */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            {todayMeals.length === 0 ? (
              <p className="text-center py-8 text-slate-600 dark:text-slate-400">
                No meals logged yet today
              </p>
            ) : (
              <div className="space-y-2">
                {todayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg"
                    data-testid={`logged-meal-${meal.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {meal.foodItem}
                        </h4>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {meal.mealType}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {meal.calories} cal
                        </span>
                        <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {meal.protein && <span>P:{meal.protein}g</span>}
                          {meal.carbs && <span>C:{meal.carbs}g</span>}
                          {meal.fat && <span>F:{meal.fat}g</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}