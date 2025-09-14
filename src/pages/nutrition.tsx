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
  ImageIcon,
  Flame
} from 'lucide-react'
import { saveMealLocally, getMealsByDateLocally, GuestMeal } from '../utils/guestStorage'
import { toast } from '../hooks/use-toast'
import LazyBarcodeScanner from '../components/LazyBarcodeScanner'
import { useLocalization } from '../contexts/LocalizationContext'

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
  const { getCountryCode } = useLocalization()
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
  
  // Hydration tracking state
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [showHydrationToast, setShowHydrationToast] = useState(false)

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

  // Load water count on mount
  useEffect(() => {
    const stored = localStorage.getItem('waterGlasses')
    if (stored) {
      setWaterGlasses(parseInt(stored))
    }
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
      const countryCode = getCountryCode()
      
      let searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`
      
      if (countryCode) {
        searchUrl += `&countries_tags_en=${countryCode}`
      }
      
      const response = await fetch(searchUrl)
      
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
      const countryCode = getCountryCode()
      
      const apiUrl = countryCode 
        ? `https://${countryCode}.openfoodfacts.org/api/v0/product/${barcode}.json`
        : `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok && countryCode) {
        console.log('Country-specific search failed, falling back to global...')
        const fallbackResponse = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        )
        
        if (!fallbackResponse.ok) throw new Error('Product not found')
        const fallbackData = await fallbackResponse.json()
        
        if (fallbackData.status === 1 && fallbackData.product) {
          const product = fallbackData.product
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
          return
        }
      }
      
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
      } else {
        throw new Error('Product not found')
      }
    } catch (error) {
      console.error('Barcode scan error:', error)
      toast({
        title: 'Product not found',
        description: 'This barcode was not found in our database. Try searching manually.',
        variant: 'destructive'
      })
    } finally {
      setIsSearching(false)
    }
  }

  const addToRecentFoods = (food: FoodItem) => {
    const newRecent = [food, ...recentFoods.filter(f => f.id !== food.id)].slice(0, 10)
    setRecentFoods(newRecent)
    localStorage.setItem('recentFoods', JSON.stringify(newRecent))
  }

  const logMeal = async (meal: MealToLog) => {
    try {
      const mealData = {
        date: new Date().toISOString().split('T')[0],
        mealType: meal.mealType,
        food: meal.foodItem,
        servings: meal.servings,
        totalCalories: Math.round(meal.foodItem.calories * meal.servings),
        notes: ''
      }
      
      const mealId = saveMealLocally(mealData)
      
      if (mealId) {
        addToRecentFoods(meal.foodItem)
        
        // Refresh today's meals
        const today = new Date().toISOString().split('T')[0]
        const updatedMeals = getMealsByDateLocally(today)
        setTodayMeals(updatedMeals)
        
        // Success toast
        toast({
          title: 'Meal logged successfully! 🍽️',
          description: `Added ${meal.foodItem.name} to ${meal.mealType} (${Math.round(meal.foodItem.calories * meal.servings)} calories)`
        })
        
        // Reset state
        setSelectedFood(null)
        setServings(1)
      } else {
        throw new Error('Failed to save meal')
      }
    } catch (error) {
      console.error('Failed to log meal:', error)
      toast({
        title: 'Error',
        description: 'Failed to log meal. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleCustomFoodSubmit = () => {
    if (!customFood.name || !customFood.calories) {
      toast({
        title: 'Missing information',
        description: 'Please enter at least a name and calories for your custom food.',
        variant: 'destructive'
      })
      return
    }
    
    const food: FoodItem = {
      id: `custom-${Date.now()}`,
      name: customFood.name,
      calories: parseInt(customFood.calories),
      protein: customFood.protein ? parseFloat(customFood.protein) : undefined,
      carbs: customFood.carbs ? parseFloat(customFood.carbs) : undefined,
      fat: customFood.fat ? parseFloat(customFood.fat) : undefined,
      serving: customFood.serving
    }
    
    setSelectedFood(food)
    setShowCustomSection(false)
    
    // Reset custom food form
    setCustomFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      serving: '100g'
    })
  }

  const openCameraScanner = () => {
    setIsCameraModalOpen(true)
  }

  const handleBarcodeDetected = (barcode: string) => {
    setIsCameraModalOpen(false)
    scanBarcode(barcode)
  }

  const increaseWater = () => {
    const newCount = waterGlasses + 1
    setWaterGlasses(newCount)
    localStorage.setItem('waterGlasses', newCount.toString())
    
    if (newCount === 8) {
      setShowHydrationToast(true)
      toast({
        title: 'Hydration goal reached! 💧',
        description: 'Great job staying hydrated today!'
      })
    }
  }

  const decreaseWater = () => {
    if (waterGlasses > 0) {
      const newCount = waterGlasses - 1
      setWaterGlasses(newCount)
      localStorage.setItem('waterGlasses', newCount.toString())
    }
  }

  const calculateTodayTotals = () => {
    return todayMeals.reduce((totals, meal) => {
      const calories = meal.totalCalories || 0
      const protein = (meal.food.protein || 0) * (meal.servings || 1)
      const carbs = (meal.food.carbs || 0) * (meal.servings || 1)
      const fat = (meal.food.fat || 0) * (meal.servings || 1)
      
      return {
        calories: totals.calories + calories,
        protein: totals.protein + protein,
        carbs: totals.carbs + carbs,
        fat: totals.fat + fat,
        meals: totals.meals + 1
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 })
  }

  const todayTotals = calculateTodayTotals()

  return (
    <div className="page-container">
      <div className="section-container space-y-6">
        {/* Header */}
        <div className="page-header">
          <div className="flex-center gap-3 mb-4">
            <div className="icon-badge icon-badge-nutrition">
              <Utensils className="w-8 h-8 text-nutrition" />
            </div>
            <h1 className="page-title">Nutrition Tracker</h1>
          </div>
          <p className="page-subtitle">
            Search millions of foods, scan barcodes, and track your daily nutrition
          </p>
        </div>

        {/* Today's Summary */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-primary flex-start gap-3">
              <div className="icon-badge icon-badge-nutrition">
                <Target className="w-5 h-5 text-nutrition" />
              </div>
              Today's Summary
            </CardTitle>
            <CardDescription className="text-secondary">
              Your nutritional intake for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-2 grid-md-4 mb-6">
              <div className="text-center p-4 action-item">
                <div className="text-2xl font-bold text-nutrition">{todayTotals.calories}</div>
                <div className="text-sm text-secondary">Calories</div>
              </div>
              <div className="text-center p-4 action-item">
                <div className="text-2xl font-bold text-protein">{Math.round(todayTotals.protein)}g</div>
                <div className="text-sm text-secondary">Protein</div>
              </div>
              <div className="text-center p-4 action-item">
                <div className="text-2xl font-bold text-carbs">{Math.round(todayTotals.carbs)}g</div>
                <div className="text-sm text-secondary">Carbs</div>
              </div>
              <div className="text-center p-4 action-item">
                <div className="text-2xl font-bold text-fat">{Math.round(todayTotals.fat)}g</div>
                <div className="text-sm text-secondary">Fat</div>
              </div>
            </div>

            {/* Hydration Tracker */}
            <div className="card-base p-4 space-y-4">
              <div className="flex-between">
                <h3 className="font-semibold text-primary flex-center gap-2">
                  <Droplets className="w-5 h-5 text-action" />
                  Water Intake
                </h3>
                <div className="flex-center gap-2">
                  <Button
                    onClick={decreaseWater}
                    variant="outline"
                    size="sm"
                    className="button-base button-outline h-8 w-8 p-0"
                    disabled={waterGlasses === 0}
                  >
                    -
                  </Button>
                  <span className="mx-3 font-bold text-lg">{waterGlasses} / 8</span>
                  <Button
                    onClick={increaseWater}
                    size="sm"
                    className="button-base button-default bg-action hover:bg-action/90 h-8 w-8 p-0"
                    data-testid="button-add-water"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-3 rounded-full transition-all ${
                      i < waterGlasses ? 'bg-action' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-primary flex-start gap-3">
              <div className="icon-badge icon-badge-action">
                <Search className="w-5 h-5 text-action" />
              </div>
              Add Food
            </CardTitle>
            <CardDescription className="text-secondary">
              Search for foods to add to your meal log
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-center gap-3">
              <Input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base flex-1"
                data-testid="input-food-search"
              />
              <Button
                type="submit"
                disabled={isSearching}
                className="button-base button-default bg-nutrition hover:bg-nutrition/90 px-6"
                data-testid="button-search-food"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </form>

            {/* Quick Action Buttons */}
            <div className="grid-3">
              <Button
                onClick={() => setShowBarcodeSection(!showBarcodeSection)}
                variant="outline"
                className="button-base button-outline h-12 flex-col gap-1"
                data-testid="button-barcode-toggle"
              >
                <Barcode className="w-5 h-5" />
                <span className="text-xs">Scan Barcode</span>
              </Button>
              
              <Button
                onClick={() => setShowRecentSection(!showRecentSection)}
                variant="outline"
                className="button-base button-outline h-12 flex-col gap-1"
                data-testid="button-recent-toggle"
              >
                <History className="w-5 h-5" />
                <span className="text-xs">Recent Foods</span>
              </Button>
              
              <Button
                onClick={() => setShowCustomSection(!showCustomSection)}
                variant="outline"
                className="button-base button-outline h-12 flex-col gap-1"
                data-testid="button-custom-toggle"
              >
                <ChefHat className="w-5 h-5" />
                <span className="text-xs">Custom Food</span>
              </Button>
            </div>

            {/* Barcode Section */}
            {showBarcodeSection && (
              <Card className="card-base">
                <CardContent className="p-4 space-y-4">
                  <div className="flex-between">
                    <h3 className="font-medium text-primary">Barcode Options</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBarcodeSection(false)}
                      className="button-base button-ghost h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={openCameraScanner}
                      className="w-full button-base button-default bg-action hover:bg-action/90"
                      data-testid="button-open-camera"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera Scanner
                    </Button>
                    
                    <Input
                      type="text"
                      placeholder="Enter barcode number..."
                      className="input-base"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          scanBarcode(e.currentTarget.value)
                          setShowBarcodeSection(false)
                        }
                      }}
                      data-testid="input-barcode-manual"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Foods Section */}
            {showRecentSection && (
              <Card className="card-base">
                <CardContent className="p-4">
                  <div className="flex-between mb-4">
                    <h3 className="font-medium text-primary">Recent Foods</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecentSection(false)}
                      className="button-base button-ghost h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {recentFoods.length === 0 ? (
                    <p className="text-center py-8 text-secondary">
                      No recent foods yet. Start logging to build your history!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentFoods.map((food) => (
                        <div
                          key={food.id}
                          className="action-item cursor-pointer"
                          onClick={() => setSelectedFood(food)}
                          data-testid={`recent-food-${food.id}`}
                        >
                          <div className="flex-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-primary">{food.name}</h4>
                              <div className="flex-center gap-3 mt-1 text-sm text-secondary">
                                <span className="font-medium text-nutrition">{food.calories} cal</span>
                                {food.protein && <span>P: {food.protein}g</span>}
                                {food.carbs && <span>C: {food.carbs}g</span>}
                                {food.fat && <span>F: {food.fat}g</span>}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-action" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Custom Food Section */}
            {showCustomSection && (
              <Card className="card-base">
                <CardContent className="p-4 space-y-4">
                  <div className="flex-between">
                    <h3 className="font-medium text-primary">Custom Food</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomSection(false)}
                      className="button-base button-ghost h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary">Food Name</label>
                      <Input
                        type="text"
                        placeholder="e.g., Homemade Salad"
                        value={customFood.name}
                        onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                        className="input-base"
                        data-testid="input-custom-name"
                      />
                    </div>
                    
                    <div className="grid-2">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Calories</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customFood.calories}
                          onChange={(e) => setCustomFood({...customFood, calories: e.target.value})}
                          className="input-base"
                          data-testid="input-custom-calories"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Serving Size</label>
                        <Input
                          type="text"
                          placeholder="100g"
                          value={customFood.serving}
                          onChange={(e) => setCustomFood({...customFood, serving: e.target.value})}
                          className="input-base"
                          data-testid="input-custom-serving"
                        />
                      </div>
                    </div>
                    
                    <div className="grid-3">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Protein (g)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customFood.protein}
                          onChange={(e) => setCustomFood({...customFood, protein: e.target.value})}
                          className="input-base"
                          data-testid="input-custom-protein"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Carbs (g)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customFood.carbs}
                          onChange={(e) => setCustomFood({...customFood, carbs: e.target.value})}
                          className="input-base"
                          data-testid="input-custom-carbs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Fat (g)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customFood.fat}
                          onChange={(e) => setCustomFood({...customFood, fat: e.target.value})}
                          className="input-base"
                          data-testid="input-custom-fat"
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleCustomFoodSubmit}
                      className="w-full button-base button-default bg-nutrition hover:bg-nutrition/90"
                      data-testid="button-add-custom-food"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Food
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {isSearching && searchQuery.trim() && (
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-primary flex-start gap-3">
                <div className="icon-badge icon-badge-nutrition">
                  <Loader2 className="w-5 h-5 animate-spin text-nutrition" />
                </div>
                Searching Foods...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-testid="search-loading">
              {[1, 2, 3].map((index) => (
                <div key={index} className="action-item animate-pulse">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-12"></div>
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {searchResults.length > 0 && !isSearching && (
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-primary flex-start gap-3">
                <div className="icon-badge icon-badge-nutrition">
                  <Search className="w-5 h-5 text-nutrition" />
                </div>
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  className="action-item cursor-pointer"
                  onClick={() => setSelectedFood(food)}
                  data-testid={`search-result-${food.id}`}
                >
                  <div className="flex-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-primary text-lg mb-1">{food.name}</h4>
                      {food.brand && (
                        <p className="text-sm text-secondary mb-3 font-medium">{food.brand}</p>
                      )}
                      <div className="flex-center gap-4 mb-2">
                        <span className="badge-base bg-nutrition text-white font-bold">{food.calories} cal</span>
                        {food.protein && <span className="badge-base bg-protein text-white">P: {food.protein}g</span>}
                        {food.carbs && <span className="badge-base bg-carbs text-white">C: {food.carbs}g</span>}
                        {food.fat && <span className="badge-base bg-fat text-white">F: {food.fat}g</span>}
                      </div>
                      <p className="text-xs text-secondary font-medium">
                        per {food.serving || '100g'}
                      </p>
                    </div>
                    <div className="icon-badge icon-badge-nutrition">
                      <ChevronRight className="w-5 h-5 text-nutrition" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {searchResults.length === 0 && !isSearching && searchQuery.trim() && (
          <Card className="card-base">
            <CardContent className="p-8 text-center" data-testid="search-empty-state">
              <div className="flex-col-center gap-4">
                <div className="icon-badge icon-badge-warning w-16 h-16">
                  <Search className="w-8 h-8 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary mb-2">No foods found</h3>
                  <p className="text-secondary">
                    We couldn't find any foods matching "{searchQuery}". Try a different search term or add a custom food.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Meals */}
        {todayMeals.length > 0 && (
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-primary flex-start gap-3">
                <div className="icon-badge icon-badge-success">
                  <Check className="w-5 h-5 text-success" />
                </div>
                Today's Meals ({todayMeals.length})
              </CardTitle>
              <CardDescription className="text-secondary">
                Your logged meals for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealTypeFilter) => {
                  const meals = todayMeals.filter(meal => meal.mealType === mealTypeFilter)
                  if (meals.length === 0) return null

                  return (
                    <div key={mealTypeFilter}>
                      <h4 className="font-semibold text-primary mb-3 capitalize">{mealTypeFilter}</h4>
                      <div className="space-y-2">
                        {meals.map((meal, index) => (
                          <div key={index} className="action-item">
                            <div className="flex-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-primary">{meal.food.name}</h5>
                                <p className="text-sm text-secondary">
                                  {meal.servings} serving(s) • {meal.totalCalories} calories
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="badge-base bg-nutrition text-white">
                                  {meal.totalCalories} cal
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Food Selection Dialog */}
        {selectedFood && (
          <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary">Log Food</DialogTitle>
                <DialogDescription className="text-secondary">
                  Add {selectedFood.name} to your meal log
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Food Details */}
                <div className="card-base p-4">
                  <h3 className="font-bold text-primary text-lg mb-2">{selectedFood.name}</h3>
                  {selectedFood.brand && (
                    <p className="text-sm text-secondary mb-3">{selectedFood.brand}</p>
                  )}
                  
                  <div className="flex gap-2 mb-3">
                    <span className="badge-base bg-nutrition text-white">{selectedFood.calories} cal</span>
                    {selectedFood.protein && <span className="badge-base bg-protein text-white">P: {selectedFood.protein}g</span>}
                    {selectedFood.carbs && <span className="badge-base bg-carbs text-white">C: {selectedFood.carbs}g</span>}
                    {selectedFood.fat && <span className="badge-base bg-fat text-white">F: {selectedFood.fat}g</span>}
                  </div>
                  
                  <p className="text-xs text-secondary">per {selectedFood.serving || '100g'}</p>
                </div>

                {/* Meal Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Meal Type</label>
                  <div className="grid-2">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                      <Button
                        key={type}
                        onClick={() => setMealType(type as any)}
                        variant={mealType === type ? 'default' : 'outline'}
                        className={`button-base capitalize ${
                          mealType === type 
                            ? 'button-default bg-nutrition text-white' 
                            : 'button-outline'
                        }`}
                        data-testid={`button-meal-type-${type}`}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Servings */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">
                    Servings ({Math.round(selectedFood.calories * servings)} calories total)
                  </label>
                  <div className="flex-center gap-3">
                    <Button
                      onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                      variant="outline"
                      size="sm"
                      className="button-base button-outline"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={servings}
                      onChange={(e) => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                      className="input-base text-center w-20"
                      data-testid="input-servings"
                    />
                    <Button
                      onClick={() => setServings(servings + 0.5)}
                      variant="outline"
                      size="sm"
                      className="button-base button-outline"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setSelectedFood(null)}
                    variant="outline"
                    className="flex-1 button-base button-outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => logMeal({ foodItem: selectedFood, mealType, servings })}
                    className="flex-1 button-base button-default bg-nutrition hover:bg-nutrition/90"
                    data-testid="button-log-food"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Food
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Camera Scanner Modal */}
        <LazyBarcodeScanner
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          onBarcodeDetected={handleBarcodeDetected}
        />
      </div>
    </div>
  )
}