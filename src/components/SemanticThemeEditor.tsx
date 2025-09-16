import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Palette, RotateCcw, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import tinycolor from 'tinycolor2'

interface ColorResult {
  hex: string
}

interface SemanticTheme {
  action: string      // Default: '#0D9488'
  activity: string    // Default: '#8B5CF6'  
  nutrition: string   // Default: '#F97316'
  wellness: string    // Default: '#4F46E5'
}

interface ColorCategory {
  id: keyof SemanticTheme
  label: string
  description: string
  defaultColor: string
  cssVariable: string
}

const colorCategories: ColorCategory[] = [
  {
    id: 'action',
    label: 'Action & Navigation',
    description: 'Primary buttons, active navigation, and interactive elements',
    defaultColor: '#0D9488',
    cssVariable: '--color-action'
  },
  {
    id: 'activity',
    label: 'Activity & Progress',
    description: 'Workout stats, step counters, and fitness progress',
    defaultColor: '#8B5CF6',
    cssVariable: '--color-activity'
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    description: 'Calorie tracking, food logging, and nutrition elements',
    defaultColor: '#F97316',
    cssVariable: '--color-nutrition'
  },
  {
    id: 'wellness',
    label: 'Wellness & Mood',
    description: 'Meditation, mood tracking, and mindfulness features',
    defaultColor: '#4F46E5',
    cssVariable: '--color-wellness'
  }
]

// Default theme colors
const DEFAULT_THEME: SemanticTheme = {
  action: '#0D9488',
  activity: '#8B5CF6',
  nutrition: '#F97316',
  wellness: '#4F46E5'
}

const STORAGE_KEY = 'semantic-theme-colors'

export default function SemanticThemeEditor() {
  const [currentTheme, setCurrentTheme] = useState<SemanticTheme>(DEFAULT_THEME)
  const [expandedSection, setExpandedSection] = useState<keyof SemanticTheme | null>(null)
  const [SketchPicker, setSketchPicker] = useState<any>(null)
  const [isColorPickerLoading, setIsColorPickerLoading] = useState(false)
  const { toast } = useToast()

  // Lazy load SketchPicker when needed
  const loadColorPicker = async () => {
    if (SketchPicker) return
    
    setIsColorPickerLoading(true)
    try {
      const { SketchPicker: Picker } = await import('react-color')
      setSketchPicker(() => Picker)
    } catch (error) {
      console.error('Failed to load color picker:', error)
    } finally {
      setIsColorPickerLoading(false)
    }
  }

  // Function to apply semantic colors with dynamic calculations
  const applySemanticColors = (colors: SemanticTheme) => {
    const root = document.documentElement
    
    // For each color category, calculate base, hover, and text colors
    Object.entries(colors).forEach(([category, color]) => {
      const baseColor = tinycolor(color)
      const hoverColor = baseColor.clone().darken(10)
      const textColor = baseColor.isLight() ? '#000000' : '#FFFFFF'
      
      root.style.setProperty(`--color-${category}`, color)
      root.style.setProperty(`--color-${category}-hover`, hoverColor.toHexString())
      root.style.setProperty(`--color-${category}-text`, textColor)
    })
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors))
    } catch (error) {
      console.warn('Failed to save semantic colors to localStorage:', error)
    }
  }

  // Load colors from localStorage on component mount
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem(STORAGE_KEY)
      if (savedColors) {
        const colors = JSON.parse(savedColors) as SemanticTheme
        setCurrentTheme(colors)
        applySemanticColors(colors)
      } else {
        // Apply default colors if no saved colors
        applySemanticColors(DEFAULT_THEME)
      }
    } catch (error) {
      console.warn('Failed to load semantic colors from localStorage:', error)
      applySemanticColors(DEFAULT_THEME)
    }
  }, [])

  const handleColorChange = (categoryId: keyof SemanticTheme, color: ColorResult) => {
    setCurrentTheme(prev => ({
      ...prev,
      [categoryId]: color.hex
    }))
  }

  const applyColor = (categoryId: keyof SemanticTheme) => {
    const category = colorCategories.find(cat => cat.id === categoryId)
    if (!category) return

    // Create a new theme with the updated color
    const updatedTheme = {
      ...currentTheme,
      [categoryId]: currentTheme[categoryId]
    }

    // Apply the semantic colors with dynamic calculations
    applySemanticColors(updatedTheme)
    
    setExpandedSection(null)
    
    toast({
      title: `${category.label} Updated!`,
      description: `Color changed to ${currentTheme[categoryId]} successfully.`,
    })
  }

  const resetColor = (categoryId: keyof SemanticTheme) => {
    const category = colorCategories.find(cat => cat.id === categoryId)
    if (!category) return

    const updatedTheme = {
      ...currentTheme,
      [categoryId]: category.defaultColor
    }

    setCurrentTheme(updatedTheme)
    applySemanticColors(updatedTheme)
    
    toast({
      title: `${category.label} Reset!`,
      description: `Color reset to default successfully.`,
    })
  }

  const resetAllColors = () => {
    setCurrentTheme(DEFAULT_THEME)
    setExpandedSection(null)
    
    // Apply default colors with dynamic calculations
    applySemanticColors(DEFAULT_THEME)
    
    toast({
      title: "All Colors Reset!",
      description: "All semantic colors have been reset to defaults.",
    })
  }

  const toggleSection = async (categoryId: keyof SemanticTheme) => {
    if (expandedSection !== categoryId) {
      // Load color picker when expanding a section
      await loadColorPicker()
    }
    setExpandedSection(expandedSection === categoryId ? null : categoryId)
  }

  return (
    <div className="space-y-6" data-testid="semantic-theme-editor">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Customize Your Theme
        </h3>
        <p className="text-sm text-muted-foreground">
          Personalize colors for different categories of information
        </p>
      </div>

      {/* Color Categories */}
      <div className="space-y-4">
        {colorCategories.map((category) => (
          <Card key={category.id} className="bg-card/50 border border-[var(--color-border)]">
            <CardHeader className="pb-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(category.id)}
                data-testid={`color-category-${category.id}`}
              >
                <div className="flex items-center gap-3">
                  {/* Color Preview */}
                  <div 
                    className="w-6 h-6 rounded-lg shadow-md border-2 border-background"
                    style={{ background: currentTheme[category.id] }}
                    data-testid={`color-preview-${category.id}`}
                  />
                  
                  <div>
                    <h4 className="font-semibold text-foreground">{category.label}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted rounded">
                    {currentTheme[category.id]}
                  </span>
                  {expandedSection === category.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {/* Expanded Color Picker */}
            {expandedSection === category.id && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Color Picker */}
                  <div className="flex justify-center">
                    {isColorPickerLoading ? (
                      <div className="w-60 h-60 bg-muted/30 rounded-lg flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-sm text-muted-foreground">Loading color picker...</span>
                        </div>
                      </div>
                    ) : SketchPicker ? (
                      <SketchPicker
                        color={currentTheme[category.id]}
                        onChange={(color: ColorResult) => handleColorChange(category.id, color)}
                        data-testid={`color-picker-${category.id}`}
                      />
                    ) : (
                      <div className="w-60 h-60 bg-muted/30 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Color picker not loaded</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetColor(category.id)}
                      className="flex items-center gap-2"
                      data-testid={`reset-color-${category.id}`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to Default
                    </Button>
                    
                    <Button
                      onClick={() => applyColor(category.id)}
                      className="flex items-center gap-2"
                      data-testid={`apply-color-${category.id}`}
                    >
                      <Check className="w-4 h-4" />
                      Apply Color
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Global Actions */}
      <div className="flex justify-center pt-4 border-t border-[var(--color-border)]">
        <Button
          variant="outline"
          onClick={resetAllColors}
          className="flex items-center gap-2"
          data-testid="reset-all-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Colors
        </Button>
      </div>
      
      {/* Current Theme Summary */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-sm text-foreground">Current Theme Colors:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {colorCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded border border-background"
                style={{ backgroundColor: currentTheme[category.id] }}
              />
              <span className="text-muted-foreground">{category.label}:</span>
              <span className="font-mono text-foreground">{currentTheme[category.id]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}