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
      // Get country code for filtering
      const countryCode = getCountryCode()
      
      // Build URL with country filtering if available
      let searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`
      
      // Add country filter if a specific country is selected (not global)
      if (countryCode) {
        searchUrl += `&countries_tags_en=${countryCode}`
      }
      
      // Search Open Food Facts API with country filtering
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
      // Get country code for potential filtering
      const countryCode = getCountryCode()
      
      // Use country-specific URL if available, otherwise use global
      const apiUrl = countryCode 
        ? `https://${countryCode}.openfoodfacts.org/api/v0/product/${barcode}.json`
        : `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      
      const response = await fetch(apiUrl)
      
      // If country-specific request fails, fallback to global search
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
          toast({
            title: 'Product found!',
            description: `${food.name} - ${food.calories} cal per ${food.serving} (Global result)`
          })
        } else {
          throw new Error('Product not found')
        }
        return
      }
      
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
    
    // Validate required fields
    if (!customFood.name.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a food name.',
        variant: 'destructive'
      })
      return
    }

    if (!customFood.calories.trim() || isNaN(parseInt(customFood.calories)) || parseInt(customFood.calories) <= 0) {
      toast({
        title: 'Invalid Calories',
        description: 'Please enter a valid calorie amount greater than 0.',
        variant: 'destructive'
      })
      return
    }

    const mealToLog: Omit<GuestMeal, 'id'> = {
      mealType,
      foodItem: customFood.name,
      calories: parseInt(customFood.calories),
      protein: customFood.protein && !isNaN(parseInt(customFood.protein)) ? parseInt(customFood.protein) : undefined,
      carbs: customFood.carbs && !isNaN(parseInt(customFood.carbs)) ? parseInt(customFood.carbs) : undefined,
      fat: customFood.fat && !isNaN(parseInt(customFood.fat)) ? parseInt(customFood.fat) : undefined,
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
  const hydrationProgress = (waterGlasses / 8) * 100

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
        <div className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[var(--color-nutrition)] to-[var(--color-nutrition)]/80 rounded-2xl shadow-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">Nutrition</h1>
                <p className="text-[var(--color-text-secondary)] text-lg">Track your daily nutrition goals</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[var(--color-nutrition)]/15 via-[var(--color-nutrition)]/10 to-[var(--color-nutrition)]/15 rounded-2xl p-4 border border-[var(--color-nutrition)]/20">
              <p className="text-2xl font-bold text-[var(--color-nutrition)] flex items-center justify-center gap-2" data-testid="calories-remaining">
                <Target className="w-6 h-6" />
                {caloriesRemaining > 0 ? caloriesRemaining : 0} cal remaining
              </p>
              <p className="text-[var(--color-text-secondary)] mt-1 flex items-center justify-center gap-1">
                <Utensils className="w-4 h-4" />
                {todayMeals.length} meals logged today
              </p>
            </div>
          </div>
          
          {/* Daily Metrics Card */}
          <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-2xl backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-nutrition)]/5 via-transparent to-[var(--color-nutrition)]/5 pointer-events-none"></div>
            <CardContent className="p-7 relative">
              <div className="space-y-8">
                
                {/* Calories Metric */}
                <div className="bg-gradient-to-r from-[var(--color-nutrition)]/10 to-[var(--color-nutrition)]/5 rounded-xl p-5 border border-[var(--color-nutrition)]/20" data-testid="metric-calories">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--color-nutrition)] rounded-lg">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Calories</h3>
                    </div>
                    <span className="text-xl font-bold text-[var(--color-nutrition)]">
                      {todayStats.calories.toLocaleString()} / {nutritionGoals.calories.toLocaleString()} cal
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-surface)] rounded-full h-4 shadow-inner border border-[var(--color-border)]">
                    <div 
                      className="bg-gradient-to-r from-[var(--color-nutrition)] to-[var(--color-nutrition)]/90 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${Math.min(100, caloriesProgress)}%` }}
                      data-testid="progress-bar-calories"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-2">
                    <span>0 cal</span>
                    <span className="font-medium">{Math.round(caloriesProgress)}% of goal</span>
                    <span>{nutritionGoals.calories.toLocaleString()} cal</span>
                  </div>
                </div>

                {/* Protein Metric */}
                <div className="bg-gradient-to-r from-[var(--color-protein)]/10 to-[var(--color-protein)]/5 rounded-xl p-5 border border-[var(--color-protein)]/20" data-testid="metric-protein">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--color-protein)] rounded-lg">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Protein</h3>
                    </div>
                    <span className="text-xl font-bold text-[var(--color-protein)]">
                      {Math.round(todayStats.protein)}g / {nutritionGoals.protein}g
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-surface)] rounded-full h-4 shadow-inner border border-[var(--color-border)]">
                    <div 
                      className="bg-gradient-to-r from-[var(--color-protein)] to-[var(--color-protein)]/90 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${Math.min(100, proteinProgress)}%` }}
                      data-testid="progress-bar-protein"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-2">
                    <span>0g</span>
                    <span className="font-medium">{Math.round(proteinProgress)}% of goal</span>
                    <span>{nutritionGoals.protein}g</span>
                  </div>
                </div>

                {/* Fat Metric */}
                <div className="bg-gradient-to-r from-[var(--color-fat)]/10 to-[var(--color-fat)]/5 rounded-xl p-5 border border-[var(--color-fat)]/20" data-testid="metric-fat">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--color-fat)] rounded-lg">
                        <Droplets className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Fat</h3>
                    </div>
                    <span className="text-xl font-bold text-[var(--color-fat)]">
                      {Math.round(todayStats.fat)}g / {nutritionGoals.fat}g
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-surface)] rounded-full h-4 shadow-inner border border-[var(--color-border)]">
                    <div 
                      className="bg-gradient-to-r from-[var(--color-fat)] to-[var(--color-fat)]/90 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${Math.min(100, fatProgress)}%` }}
                      data-testid="progress-bar-fat"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-2">
                    <span>0g</span>
                    <span className="font-medium">{Math.round(fatProgress)}% of goal</span>
                    <span>{nutritionGoals.fat}g</span>
                  </div>
                </div>

                <div className="border-t-2 border-[var(--color-action)]/20 pt-6">
                  {/* Hydration Metric */}
                  <div className="bg-gradient-to-r from-[var(--color-action)]/10 to-[var(--color-action)]/5 rounded-xl p-5 border border-[var(--color-action)]/20" data-testid="metric-hydration">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--color-action)] rounded-lg">
                          <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Hydration</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-[var(--color-action)]">
                          {waterGlasses} / 8 glasses
                        </span>
                        <Button
                          onClick={addWaterGlass}
                          size="sm"
                          className="h-10 px-4 bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                          data-testid="button-add-water-inline"
                        >
                          <Droplets className="w-4 h-4 mr-2" />
                          Add Glass
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--color-surface)] rounded-full h-4 shadow-inner border border-[var(--color-border)]">
                      <div 
                        className="bg-gradient-to-r from-[var(--color-action)] to-[var(--color-action)]/90 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${Math.min(100, hydrationProgress)}%` }}
                        data-testid="progress-bar-hydration"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-2">
                      <span>0 glasses</span>
                      <span className="font-medium">{Math.round(hydrationProgress)}% of goal</span>
                      <span>8 glasses</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal Type Selector */}
        <div className="grid grid-cols-4 gap-3">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
            const isActive = mealType === type
            const icons = {
              breakfast: '🌅',
              lunch: '☀️', 
              dinner: '🌙',
              snack: '🍎'
            }
            return (
              <Button
                key={type}
                variant={isActive ? 'default' : 'outline'}
                size="lg"
                onClick={() => setMealType(type)}
                className={isActive 
                  ? 'h-16 bg-gradient-to-br from-[var(--color-nutrition)] to-[var(--color-nutrition)]/90 hover:from-[var(--color-nutrition-hover)] hover:to-[var(--color-nutrition-hover)]/90 text-white shadow-lg font-bold flex flex-col gap-1' 
                  : 'h-16 border-2 border-[var(--color-nutrition)]/30 text-[var(--color-nutrition)] hover:bg-[var(--color-nutrition)]/10 font-medium flex flex-col gap-1 transition-all duration-200'}
                data-testid={`button-meal-type-${type}`}
              >
                <span className="text-lg">{icons[type]}</span>
                <span className="text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </Button>
            )
          })}
        </div>

        {/* Quick Log Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-nutrition)]/5 via-transparent to-[var(--color-nutrition)]/5 pointer-events-none"></div>
          <CardContent className="p-7 relative">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-[var(--color-nutrition)] to-[var(--color-nutrition)]/80 rounded-xl shadow-lg">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                  Quick Log
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] text-lg">
                Add food to your <span className="text-[var(--color-nutrition)] font-semibold">{mealType}</span> log
              </p>
            </div>
            
            {/* Primary Search Button */}
            <Button
              onClick={() => setShowSearch(true)}
              className="w-full h-18 mb-6 bg-gradient-to-r from-[var(--color-nutrition)] to-[var(--color-nutrition)]/90 hover:from-[var(--color-nutrition-hover)] hover:to-[var(--color-nutrition-hover)]/90 text-white text-2xl font-bold rounded-2xl shadow-2xl shadow-[var(--color-nutrition)]/30 hover:shadow-[var(--color-nutrition)]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] py-5"
              data-testid="button-search-food-primary"
            >
              <Search className="w-7 h-7 mr-4" />
              Search Food Database
            </Button>
            
            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={openCameraScanner}
                className="h-16 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-2 border-[var(--color-nutrition)]/30 hover:bg-[var(--color-nutrition)]/10 hover:border-[var(--color-nutrition)]/50 transition-all duration-200 flex flex-col gap-1 shadow-md hover:shadow-lg"
                data-testid="button-barcode-scan-secondary"
              >
                <Barcode className="w-6 h-6 text-[var(--color-nutrition)]" />
                <span className="text-[var(--color-text-primary)] font-medium text-sm">Scan Barcode</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={openPhotoCapture}
                className="h-16 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-2 border-[var(--color-nutrition)]/30 hover:bg-[var(--color-nutrition)]/10 hover:border-[var(--color-nutrition)]/50 transition-all duration-200 flex flex-col gap-1 shadow-md hover:shadow-lg"
                data-testid="button-photo-logging-secondary"
              >
                <ImageIcon className="w-6 h-6 text-[var(--color-nutrition)]" />
                <span className="text-[var(--color-text-primary)] font-medium text-sm">Photo Log</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowCustomSection(!showCustomSection)}
                className="h-16 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-2 border-[var(--color-nutrition)]/30 hover:bg-[var(--color-nutrition)]/10 hover:border-[var(--color-nutrition)]/50 transition-all duration-200 flex flex-col gap-1 shadow-md hover:shadow-lg"
                data-testid="button-custom-food-secondary"
              >
                <Plus className="w-6 h-6 text-[var(--color-nutrition)]" />
                <span className="text-[var(--color-text-primary)] font-medium text-sm">Add Custom</span>
              </Button>
            </div>
            
            {/* Search Interface (appears when Search Food is clicked) */}
            {showSearch && (
              <div className="mt-8 space-y-6">
                <form onSubmit={handleSearch} className="space-y-5">
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[var(--color-nutrition)]" />
                    <Input
                      type="text"
                      placeholder="Search for any food..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-16 pl-16 pr-5 text-lg bg-gradient-to-r from-[var(--color-surface)] to-[var(--color-surface)]/95 border-2 border-[var(--color-nutrition)]/30 focus:border-[var(--color-nutrition)] dark:focus:border-[var(--color-nutrition)] rounded-2xl shadow-lg transition-all duration-200 focus:shadow-xl"
                      data-testid="input-food-search"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSearching || !searchQuery.trim()}
                    className="w-full h-14 bg-gradient-to-r from-[var(--color-nutrition)] to-[var(--color-nutrition)]/90 hover:from-[var(--color-nutrition-hover)] hover:to-[var(--color-nutrition-hover)]/90 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="button-search-food"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-3" />
                        Search Foods
                      </>
                    )}
                  </Button>
                </form>
                
                {/* Open Food Facts Attribution */}
                <div className="pt-4 border-t-2 border-[var(--color-nutrition)]/20">
                  <p className="text-sm text-[var(--color-text-secondary)] text-center flex items-center justify-center gap-2">
                    Powered by 
                    <a 
                      href="https://openfoodfacts.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--color-nutrition)] hover:text-[var(--color-nutrition-hover)] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      Open Food Facts
                      <ExternalLink className="w-4 h-4" />
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
            <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-nutrition)]/30 shadow-2xl backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-[var(--color-nutrition)]/10 to-[var(--color-nutrition)]/5">
                <CardTitle className="text-xl flex items-center gap-3 text-[var(--color-text-primary)]">
                  <div className="p-2 bg-[var(--color-nutrition)] rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                  Searching Foods...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6" data-testid="search-loading">
                {/* Loading Skeletons */}
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="p-5 bg-gradient-to-r from-[var(--color-nutrition)]/5 to-[var(--color-nutrition)]/10 rounded-xl border border-[var(--color-nutrition)]/20 animate-pulse"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-[var(--color-nutrition)]/20 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-[var(--color-nutrition)]/15 rounded-lg w-1/2"></div>
                        <div className="flex gap-4">
                          <div className="h-4 bg-[var(--color-nutrition)]/15 rounded-lg w-16"></div>
                          <div className="h-4 bg-[var(--color-nutrition)]/15 rounded-lg w-12"></div>
                          <div className="h-4 bg-[var(--color-nutrition)]/15 rounded-lg w-12"></div>
                        </div>
                      </div>
                      <div className="h-6 w-6 bg-[var(--color-nutrition)]/20 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {searchResults.length > 0 && !isSearching && (
            <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-nutrition)]/30 shadow-2xl backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-[var(--color-nutrition)]/10 to-[var(--color-nutrition)]/5">
                <CardTitle className="text-xl flex items-center gap-3 text-[var(--color-text-primary)]">
                  <div className="p-2 bg-[var(--color-nutrition)] rounded-lg">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  Search Results ({searchResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto p-6">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="p-5 bg-gradient-to-r from-[var(--color-nutrition)]/5 to-[var(--color-nutrition)]/10 rounded-xl hover:from-[var(--color-nutrition)]/10 hover:to-[var(--color-nutrition)]/15 transition-all duration-200 cursor-pointer border border-[var(--color-nutrition)]/20 hover:border-[var(--color-nutrition)]/30 hover:shadow-lg"
                    onClick={() => setSelectedFood(food)}
                    data-testid={`search-result-${food.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-[var(--color-text-primary)] text-lg mb-1">
                          {food.name}
                        </h4>
                        {food.brand && (
                          <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-medium">{food.brand}</p>
                        )}
                        <div className="flex items-center gap-4 mb-2">
                          <span className="bg-[var(--color-nutrition)] text-white px-3 py-1 rounded-full text-sm font-bold">{food.calories} cal</span>
                          {food.protein && <span className="bg-[var(--color-protein)] text-white px-2 py-1 rounded-full text-xs font-medium">P: {food.protein}g</span>}
                          {food.carbs && <span className="bg-[var(--color-carbs)] text-white px-2 py-1 rounded-full text-xs font-medium">C: {food.carbs}g</span>}
                          {food.fat && <span className="bg-[var(--color-fat)] text-white px-2 py-1 rounded-full text-xs font-medium">F: {food.fat}g</span>}
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                          per {food.serving || '100g'}
                        </p>
                      </div>
                      <div className="p-2 bg-[var(--color-nutrition)]/20 rounded-lg">
                        <ChevronRight className="w-5 h-5 text-[var(--color-nutrition)]" />
                      </div>
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
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                      No foods found
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
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
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
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
                    <div className="p-4 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Camera className="w-5 h-5 text-[var(--color-primary)] dark:text-[var(--color-primary)]" />
                        <h4 className="font-medium text-[var(--color-text-primary)]">Camera Scan</h4>
                      </div>
                      <p className="text-[var(--color-text-secondary)] text-sm mb-3">
                        Use your device's camera to scan barcodes automatically
                      </p>
                      <Button
                        onClick={() => {
                          setShowBarcodeSection(false)
                          openCameraScanner()
                        }}
                        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
                        data-testid="button-open-camera"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Open Camera Scanner
                      </Button>
                    </div>

                    {/* Manual Entry Option */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Barcode className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        <h4 className="font-medium text-[var(--color-text-primary)]">Manual Entry</h4>
                      </div>
                      <p className="text-[var(--color-text-secondary)] text-sm mb-3">
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
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
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
                    <p className="text-center py-8 text-[var(--color-text-secondary)]">
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
                              <h4 className="font-medium text-[var(--color-text-primary)]">
                                {food.name}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 text-sm text-[var(--color-text-secondary)]">
                                <span className="font-medium text-[var(--color-primary)] dark:text-[var(--color-primary)]">{food.calories} cal</span>
                                {food.protein && <span>P: {food.protein}g</span>}
                                {food.carbs && <span>C: {food.carbs}g</span>}
                                {food.fat && <span>F: {food.fat}g</span>}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-[var(--color-primary)] dark:text-[var(--color-primary)] mt-1" />
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
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
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
                      <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                      className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
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
                    <CardTitle className="text-[var(--color-text-primary)]">
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
                    <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {Math.round(selectedFood.calories * servings)}
                    </span>
                    <span className="text-[var(--color-text-secondary)] ml-1">cal</span>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    {selectedFood.protein && (
                      <span className="text-[var(--color-text-secondary)]">
                        P: {Math.round(selectedFood.protein * servings)}g
                      </span>
                    )}
                    {selectedFood.carbs && (
                      <span className="text-[var(--color-text-secondary)]">
                        C: {Math.round(selectedFood.carbs * servings)}g
                      </span>
                    )}
                    {selectedFood.fat && (
                      <span className="text-[var(--color-text-secondary)]">
                        F: {Math.round(selectedFood.fat * servings)}g
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)]">
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
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
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
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Today's Meals</h2>
            <Badge 
              variant="secondary" 
              className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary)] border-[var(--color-primary)]/30"
            >
              {todayMeals.length} logged
            </Badge>
          </div>
          
          {todayMeals.length === 0 ? (
            <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-[var(--color-primary)] dark:text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                      No meals logged yet
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
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
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                              {meal.foodItem}
                            </h3>
                            <Badge 
                              variant="secondary"
                              className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary)] border-[var(--color-primary)]/30"
                            >
                              {meal.mealType}
                            </Badge>
                          </div>
                          
                          {/* Macro breakdown */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)]" data-testid={`meal-calories-${meal.id}`}>
                                {meal.calories}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Calories</div>
                            </div>
                            {meal.protein && (
                              <div className="text-center">
                                <div className="text-lg font-semibold text-[var(--color-text-primary)]" data-testid={`meal-protein-${meal.id}`}>
                                  {meal.protein}g
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Protein</div>
                              </div>
                            )}
                            {meal.carbs && (
                              <div className="text-center">
                                <div className="text-lg font-semibold text-[var(--color-text-primary)]" data-testid={`meal-carbs-${meal.id}`}>
                                  {meal.carbs}g
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Carbs</div>
                              </div>
                            )}
                            {meal.fat && (
                              <div className="text-center">
                                <div className="text-lg font-semibold text-[var(--color-text-primary)]" data-testid={`meal-fat-${meal.id}`}>
                                  {meal.fat}g
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Fat</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Insight message */}
                          <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg">
                            <p className="text-sm text-[var(--color-primary)] dark:text-[var(--color-primary)] font-medium" data-testid={`meal-insight-${meal.id}`}>
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
              <DialogTitle className="text-[var(--color-text-primary)]">Photo Logging</DialogTitle>
              <DialogDescription id="photo-dialog-description" className="text-[var(--color-text-secondary)]">
                Take a photo of your meal to quickly log it with estimated nutrition values.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-[var(--color-primary)] dark:text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                    Capture Your Meal
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Take a photo and we'll log it with estimated nutrition values for your {mealType}.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handlePhotoCapture}
                  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
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

    </div>
  )
}