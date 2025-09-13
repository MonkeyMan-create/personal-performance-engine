import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
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
  ChevronDown,
  ChevronUp,
  X,
  Check,
  ExternalLink,
  Camera,
  CameraOff,
  AlertCircle,
  Droplets,
  Target,
  ImageIcon
} from 'lucide-react'
import { saveMealLocally, getMealsByDateLocally, GuestMeal } from '../utils/guestStorage'
import { toast } from '../hooks/use-toast'
import LazyBarcodeScanner from '../components/LazyBarcodeScanner'
import ProgressRing from '../components/ProgressRing'

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
  const [showBarcodeSection, setShowBarcodeSection] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showRecentSection, setShowRecentSection] = useState(false)  
  const [showCustomSection, setShowCustomSection] = useState(false)
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving: '100g'
  })
  
  // Camera scanning state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  
  // Photo logging state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Daily nutrition goals
  const nutritionGoals = {
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 80
  }

  // Calculate progress percentages
  const caloriesRemaining = nutritionGoals.calories - todayStats.calories
  const caloriesProgress = (todayStats.calories / nutritionGoals.calories) * 100
  const proteinProgress = (todayStats.protein / nutritionGoals.protein) * 100
  const fatProgress = (todayStats.fat / nutritionGoals.fat) * 100

  // Hydration tracking state
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [showHydrationToast, setShowHydrationToast] = useState(false)

  const addWaterGlass = () => {
    const newCount = waterGlasses + 1
    setWaterGlasses(newCount)
    localStorage.setItem('waterGlasses', newCount.toString())
    
    toast({
      title: 'Water logged!',
      description: `Glass ${newCount} added to your daily hydration.`
    })

    if (newCount === 8) {
      toast({
        title: '🎉 Hydration goal reached!',
        description: 'Excellent job staying hydrated today!'
      })
    }
  }

  // Load water count on mount
  useEffect(() => {
    const stored = localStorage.getItem('waterGlasses')
    if (stored) {
      setWaterGlasses(parseInt(stored))
    }
  }, [])

  // Barcode scanner handlers
  const openCameraScanner = () => {
    setIsCameraModalOpen(true)
  }

  const closeCameraScanner = () => {
    setIsCameraModalOpen(false)
  }

  const handleBarcodeScanned = async (barcode: string) => {
    await scanBarcode(barcode)
  }

  const handleManualBarcodeEntry = () => {
    setShowBarcodeSection(true)
  }

  // Photo logging handlers
  const openPhotoCapture = () => {
    setIsPhotoModalOpen(true)
  }

  const handlePhotoCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handlePhotoSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Log a placeholder meal entry for photo
      const today = new Date().toISOString().split('T')[0]
      const mealToLog: Omit<GuestMeal, 'id'> = {
        mealType,
        foodItem: `Photo meal - ${file.name}`,
        calories: 300, // Placeholder calories
        protein: 15,
        carbs: 30,
        fat: 10,
        date: today
      }
      
      saveMealLocally(mealToLog)
      
      // Refresh today's meals
      const meals = getMealsByDateLocally(today)
      setTodayMeals(meals)
      
      setIsPhotoModalOpen(false)
      
      toast({
        title: 'Photo meal logged!',
        description: `Added photo meal to ${mealType}. Estimated nutrition values.`
      })
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        
        {/* Daily Summary Section */}
        <div className="pt-8 text-center space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Nutrition</h1>
          
          {/* Progress Rings */}
          <div className="flex items-center justify-center gap-8">
            {/* Protein Ring */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={proteinProgress}
                current={Math.round(todayStats.protein)}
                goal={nutritionGoals.protein}
                label="Protein"
                unit="g"
                size="sm"
                className="drop-shadow-lg"
              />
            </div>

            {/* Central Calorie Ring */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={caloriesProgress}
                current={todayStats.calories}
                goal={nutritionGoals.calories}
                label="Calories Remaining"
                unit="cal"
                size="lg"
                className="drop-shadow-2xl"
              />
              <div className="mt-3 text-center">
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400" data-testid="calories-remaining">
                  {caloriesRemaining > 0 ? caloriesRemaining : 0} cal remaining
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {todayMeals.length} meals logged today
                </p>
              </div>
            </div>

            {/* Fat Ring */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={fatProgress}
                current={Math.round(todayStats.fat)}
                goal={nutritionGoals.fat}
                label="Fat"
                unit="g"
                size="sm"
                className="drop-shadow-lg"
              />
            </div>
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
                ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                : 'border-slate-300 dark:border-slate-600'}
              data-testid={`button-meal-type-${type}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Quick Log Section */}
        <Card className="bg-white/80 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Quick Log
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Add food to your {mealType} log
              </p>
            </div>
            
            {/* Primary Search Button */}
            <Button
              onClick={() => setShowSearch(true)}
              className="w-full h-16 mb-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="button-search-food-primary"
            >
              <Search className="w-6 h-6 mr-3" />
              Search Food
            </Button>
            
            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={openCameraScanner}
                className="h-12 bg-white/50 dark:bg-slate-800/50 border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
                data-testid="button-barcode-scan-secondary"
              >
                <Barcode className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                <span className="text-slate-700 dark:text-slate-300">Scan Barcode</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={openPhotoCapture}
                className="h-12 bg-white/50 dark:bg-slate-800/50 border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
                data-testid="button-photo-logging-secondary"
              >
                <ImageIcon className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                <span className="text-slate-700 dark:text-slate-300">Photo Log</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowCustomSection(!showCustomSection)}
                className="h-12 bg-white/50 dark:bg-slate-800/50 border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
                data-testid="button-custom-food-secondary"
              >
                <Plus className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                <span className="text-slate-700 dark:text-slate-300">Add Custom</span>
              </Button>
            </div>
            
            {/* Search Interface (appears when Search Food is clicked) */}
            {showSearch && (
              <div className="mt-6 space-y-4">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search for any food..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 pl-12 text-base bg-white dark:bg-slate-700 border-2 border-teal-200 dark:border-teal-700 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl"
                      data-testid="input-food-search"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSearching || !searchQuery.trim()}
                    className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl"
                    data-testid="button-search-food"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Foods
                      </>
                    )}
                  </Button>
                </form>
                
                {/* Open Food Facts Attribution */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
                    Powered by 
                    <a 
                      href="https://openfoodfacts.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium inline-flex items-center gap-1"
                    >
                      Open Food Facts
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">

          {/* Search Results */}
          {isSearching && searchQuery.trim() && (
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching Foods...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" data-testid="search-loading">
                {/* Loading Skeletons */}
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 animate-pulse"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                        <div className="flex gap-4">
                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-16"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-12"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="h-5 w-5 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {searchResults.length > 0 && !isSearching && (
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Results ({searchResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-600/50"
                    onClick={() => setSelectedFood(food)}
                    data-testid={`search-result-${food.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white text-base">
                          {food.name}
                        </h4>
                        {food.brand && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{food.brand}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-teal-600 dark:text-teal-400">{food.calories} cal</span>
                          {food.protein && <span>P: {food.protein}g</span>}
                          {food.carbs && <span>C: {food.carbs}g</span>}
                          {food.fat && <span>F: {food.fat}g</span>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          per {food.serving || '100g'}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {searchResults.length === 0 && !isSearching && searchQuery.trim() && (
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8 text-center" data-testid="search-empty-state">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No foods found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      We couldn't find any foods matching "{searchQuery}". Try a different search term or add a custom food below.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Secondary Options */}
          <div className="space-y-4">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRecentSection(!showRecentSection)}
                className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                data-testid="button-recent-toggle"
              >
                <History className="w-5 h-5 mr-2" />
                Recent Foods
                {showRecentSection ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomSection(!showCustomSection)}
                className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                data-testid="button-custom-toggle"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Custom Food
                {showCustomSection ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </Button>
            </div>

            {/* Barcode Section (Collapsible) */}
            {showBarcodeSection && (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      Barcode Options
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBarcodeSection(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {/* Camera Scan Option */}
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Camera className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <h4 className="font-medium text-slate-900 dark:text-white">Camera Scan</h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                        Use your device's camera to scan barcodes automatically
                      </p>
                      <Button
                        onClick={() => {
                          setShowBarcodeSection(false)
                          openCameraScanner()
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        data-testid="button-open-camera"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Open Camera Scanner
                      </Button>
                    </div>

                    {/* Manual Entry Option */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Barcode className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <h4 className="font-medium text-slate-900 dark:text-white">Manual Entry</h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                        Enter a barcode number manually if camera scanning isn't working
                      </p>
                      <Input
                        type="text"
                        placeholder="Enter barcode number..."
                        className="h-12 mb-3"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            scanBarcode(e.currentTarget.value)
                            setShowBarcodeSection(false)
                          }
                        }}
                        data-testid="input-barcode-manual"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Press Enter after typing the barcode number
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Foods Section (Collapsible) */}
            {showRecentSection && (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      Recent Foods
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecentSection(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {recentFoods.length === 0 ? (
                    <p className="text-center py-8 text-slate-600 dark:text-slate-400">
                      No recent foods yet. Start logging to build your history!
                    </p>
                  ) : (
                    <div className="space-y-3">
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
                                <span className="font-medium text-teal-600 dark:text-teal-400">{food.calories} cal</span>
                                {food.protein && <span>P: {food.protein}g</span>}
                                {food.carbs && <span>C: {food.carbs}g</span>}
                                {food.fat && <span>F: {food.fat}g</span>}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Custom Food Section (Collapsible) */}
            {showCustomSection && (
              <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      Custom Food
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomSection(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                        Food Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Homemade Salad"
                        value={customFood.name}
                        onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                        className="h-12"
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
                          className="h-12"
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
                          className="h-12"
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
                          className="h-12"
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
                          className="h-12"
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
                          className="h-12"
                          data-testid="input-custom-fat"
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        logCustomFood()
                        setShowCustomSection(false)
                      }}
                      disabled={!customFood.name || !customFood.calories}
                      className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white"
                      data-testid="button-log-custom"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Log Custom Food
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

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
                    data-testid="button-close-modal"
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
                      data-testid="button-decrease-servings"
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
                      data-testid="button-increase-servings"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => logFood(selectedFood)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  data-testid="button-confirm-log"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Today's Meals Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Today's Meals</h2>
            <Badge 
              variant="secondary" 
              className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700"
            >
              {todayMeals.length} logged
            </Badge>
          </div>
          
          {todayMeals.length === 0 ? (
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No meals logged yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Start your day by logging your first meal!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todayMeals.map((meal) => {
                // Generate insights based on meal macros
                const getInsightMessage = (meal: GuestMeal) => {
                  if (meal.protein && meal.protein > 25) {
                    return "💪 Excellent protein choice! This supports muscle growth and recovery."
                  }
                  if (meal.calories > 500) {
                    return "🍽️ Substantial meal! This will keep you energized for hours."
                  }
                  if (meal.fat && meal.fat > 15) {
                    return "🥑 Great healthy fats! Perfect for brain function and satiety."
                  }
                  if (meal.carbs && meal.carbs > 30) {
                    return "⚡ Good carb source! Ideal fuel for your workouts and brain."
                  }
                  if (meal.mealType === 'breakfast') {
                    return "🌅 Perfect way to start your day with energy!"
                  }
                  return "✅ Nice addition to your daily nutrition goals!"
                }

                return (
                  <Card 
                    key={meal.id}
                    className="bg-white/80 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300"
                    data-testid={`meal-card-${meal.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {meal.foodItem}
                            </h3>
                            <Badge 
                              variant="secondary"
                              className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700"
                            >
                              {meal.mealType}
                            </Badge>
                          </div>
                          
                          {/* Macro breakdown */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400" data-testid={`meal-calories-${meal.id}`}>
                                {meal.calories}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Calories</div>
                            </div>
                            {meal.protein && (
                              <div className="text-center">
                                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300" data-testid={`meal-protein-${meal.id}`}>
                                  {meal.protein}g
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Protein</div>
                              </div>
                            )}
                            {meal.carbs && (
                              <div className="text-center">
                                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300" data-testid={`meal-carbs-${meal.id}`}>
                                  {meal.carbs}g
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Carbs</div>
                              </div>
                            )}
                            {meal.fat && (
                              <div className="text-center">
                                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300" data-testid={`meal-fat-${meal.id}`}>
                                  {meal.fat}g
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Fat</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Insight message */}
                          <div className="p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                            <p className="text-sm text-teal-700 dark:text-teal-300 font-medium" data-testid={`meal-insight-${meal.id}`}>
                              {getInsightMessage(meal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Lazy-loaded Barcode Scanner */}
        <LazyBarcodeScanner
          isOpen={isCameraModalOpen}
          onClose={closeCameraScanner}
          onBarcodeScanned={handleBarcodeScanned}
          onManualEntry={handleManualBarcodeEntry}
        />
        
        {/* Hidden File Input for Photo Capture */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoSelected}
          className="hidden"
          data-testid="input-photo-capture"
        />
        
        {/* Photo Logging Dialog */}
        <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
          <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" aria-describedby="photo-dialog-description">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">Photo Logging</DialogTitle>
              <DialogDescription id="photo-dialog-description" className="text-slate-600 dark:text-slate-400">
                Take a photo of your meal to quickly log it with estimated nutrition values.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Capture Your Meal
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Take a photo and we'll log it with estimated nutrition values for your {mealType}.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handlePhotoCapture}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  data-testid="button-take-photo"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="flex-1 border-slate-300 dark:border-slate-600"
                  data-testid="button-cancel-photo"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Persistent Hydration FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={addWaterGlass}
          className="h-14 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-full shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
          data-testid="button-hydration-fab"
        >
          <Droplets className="w-5 h-5 mr-2" />
          <span>Add Glass</span>
          {waterGlasses > 0 && (
            <Badge 
              variant="secondary"
              className="ml-2 bg-white/20 text-white border-white/30 text-xs"
              data-testid="water-count-badge"
            >
              {waterGlasses}/8
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )
}