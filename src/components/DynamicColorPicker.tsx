import React, { useState, useEffect, useCallback } from 'react'
import tinycolor from 'tinycolor2'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Palette, RotateCcw, Check } from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import { useTheme } from './theme-provider'

interface ColorResult {
  hex: string
}

interface DynamicColorPickerProps {
  onColorApply?: (color: string) => void
  onReset?: () => void
}

interface CustomColorData {
  primary: string
  primaryHover: string
  primaryText: string
}

const CUSTOM_COLOR_STORAGE_KEY = 'custom-theme-color'

export default function DynamicColorPicker({ onColorApply, onReset }: DynamicColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState('#14B8A6') // Default teal
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [SketchPicker, setSketchPicker] = useState<any>(null)
  const [isColorPickerLoading, setIsColorPickerLoading] = useState(false)
  const { toast } = useToast()
  const { colorTheme, setColorTheme, hasCustomColor, clearCustomColor } = useTheme()

  // Lazy load SketchPicker when needed
  const loadColorPicker = async () => {
    if (SketchPicker) return
    
    setIsColorPickerLoading(true)
    try {
      const { SketchPicker: Picker } = await import('react-color')
      setSketchPicker(() => Picker)
    } catch (error) {
      console.error('Failed to load color picker:', error)
      toast({
        title: 'Loading Error',
        description: 'Failed to load color picker. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsColorPickerLoading(false)
    }
  }

  // Sync selectedColor with theme provider state
  useEffect(() => {
    if (colorTheme === 'custom') {
      try {
        const savedCustomColor = localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY)
        if (savedCustomColor) {
          const colorData = JSON.parse(savedCustomColor)
          setSelectedColor(colorData.primary)
        }
      } catch (error) {
        console.warn('Failed to load custom color from localStorage:', error)
      }
    } else {
      // Reset to default when not using custom theme
      setSelectedColor('#14B8A6')
    }
  }, [colorTheme])

  // Calculate color variations using tinycolor2
  const calculateColorVariations = useCallback((hexColor: string): CustomColorData => {
    const baseColor = tinycolor(hexColor)
    
    // Calculate hover color (10% lighter for both light and dark modes)
    const hoverColor = baseColor.clone().lighten(10)
    
    // Calculate text color based on contrast
    const textColor = baseColor.isLight() ? '#000000' : '#FFFFFF'
    
    return {
      primary: baseColor.toHexString(),
      primaryHover: hoverColor.toHexString(),
      primaryText: textColor
    }
  }, [])

  // Apply custom color to CSS variables
  const applyCustomColor = useCallback((hexColor: string) => {
    const colorData = calculateColorVariations(hexColor)
    const root = document.documentElement

    // Apply custom CSS variables
    root.style.setProperty('--color-primary', `hsl(${tinycolor(colorData.primary).toHsl().h}, ${tinycolor(colorData.primary).toHsl().s * 100}%, ${tinycolor(colorData.primary).toHsl().l * 100}%)`)
    root.style.setProperty('--color-primary-hover', `hsl(${tinycolor(colorData.primaryHover).toHsl().h}, ${tinycolor(colorData.primaryHover).toHsl().s * 100}%, ${tinycolor(colorData.primaryHover).toHsl().l * 100}%)`)
    root.style.setProperty('--color-primary-text', colorData.primaryText)
    
    // Also update shadcn-compatible variables
    const primaryHsl = tinycolor(colorData.primary).toHsl()
    root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s * 100}% ${primaryHsl.l * 100}%`)
    root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s * 100}% ${primaryHsl.l * 100}%`)
    root.style.setProperty('--chart-1', `${primaryHsl.h} ${primaryHsl.s * 100}% ${primaryHsl.l * 100}%`)

    // Save to localStorage
    try {
      localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, JSON.stringify(colorData))
    } catch (error) {
      console.warn('Failed to save custom color to localStorage:', error)
    }

    // CRITICAL FIX: Notify theme provider about custom color
    setColorTheme('custom')

    // Notify parent component
    onColorApply?.(colorData.primary)
  }, [calculateColorVariations, onColorApply, setColorTheme])

  // Reset to remove custom color using theme provider
  const resetCustomColor = useCallback(() => {
    try {
      // Use theme provider's clearCustomColor method
      clearCustomColor()
      
      // Reset selected color to default
      setSelectedColor('#14B8A6')
      setShowColorPicker(false)

      onReset?.()
      
      toast({
        title: "Custom Color Reset!",
        description: "Returned to default theme colors successfully.",
      })
    } catch (error) {
      console.warn('Failed to reset custom color:', error)
      toast({
        title: "Reset Failed",
        description: "Could not reset custom color. Please try again.",
      })
    }
  }, [clearCustomColor, onReset, toast])

  // Handle color picker change
  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex)
  }

  // Handle apply button click
  const handleApplyColor = () => {
    applyCustomColor(selectedColor)
    setShowColorPicker(false)
    
    toast({
      title: "Custom Color Applied!",
      description: `Your theme is now using ${selectedColor.toUpperCase()} as the primary color.`,
    })
  }

  // Get preview of calculated colors
  const previewColors = calculateColorVariations(selectedColor)

  return (
    <Card className="bg-card/60 border border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-xl font-bold flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          Custom Color Theme
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Create your own personalized color theme with any color you like
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Color Display */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Current Selection</div>
          <div className="flex items-center gap-4">
            {/* Color Swatch */}
            <button
              onClick={async () => {
                if (!showColorPicker) {
                  await loadColorPicker()
                }
                setShowColorPicker(!showColorPicker)
              }}
              className="w-16 h-16 rounded-xl border-4 border-[var(--color-border)] shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              style={{ backgroundColor: selectedColor }}
              data-testid="color-swatch-button"
              aria-label={`Selected color: ${selectedColor}. Click to open color picker`}
            >
              <span className="sr-only">Open color picker</span>
            </button>
            
            {/* Color Information */}
            <div className="flex-1">
              <div className="text-lg font-semibold text-foreground" data-testid="selected-color-hex">
                {selectedColor.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">
                {hasCustomColor ? 'Active Custom Color' : 'Preview Color'}
              </div>
              
              {/* Color Preview Elements */}
              <div className="flex items-center gap-2 mt-2">
                <div 
                  className="h-3 flex-1 rounded-full max-w-32"
                  style={{
                    background: `linear-gradient(to right, ${selectedColor}20, ${selectedColor})`
                  }}
                />
                <div 
                  className="w-4 h-4 rounded-full shadow-sm border border-[var(--color-border)]"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>

            {/* Active Indicator */}
            {hasCustomColor && (
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="relative">
            <div className="absolute top-0 left-0 z-50">
              <div className="relative">
                {isColorPickerLoading ? (
                  <div className="w-60 h-80 bg-muted/30 rounded-lg flex items-center justify-center border border-[var(--color-border)]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-sm text-muted-foreground">Loading color picker...</span>
                    </div>
                  </div>
                ) : SketchPicker ? (
                  <SketchPicker
                    color={selectedColor}
                    onChange={handleColorChange}
                    disableAlpha={true}
                    presetColors={[
                      '#14B8A6', // Teal
                      '#3B82F6', // Blue
                      '#F97316', // Orange
                      '#8B5CF6', // Purple
                      '#dc2626', // Ruby
                      '#16a34a', // Forest
                      '#d97706', // Amber
                      '#1d4ed8', // Sapphire
                      '#FF6B6B', // Coral
                      '#4ECDC4', // Mint
                      '#45B7D1', // Sky
                      '#96CEB4', // Sage
                      '#FECA57', // Gold
                      '#FF9FF3', // Pink
                      '#54A0FF', // Electric Blue
                      '#5F27CD', // Deep Purple
                    ]}
                  />
                ) : (
                  <div className="w-60 h-80 bg-muted/30 rounded-lg flex items-center justify-center border border-[var(--color-border)]">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-sm text-muted-foreground">Failed to load color picker</span>
                      <button 
                        onClick={loadColorPicker}
                        className="text-xs text-primary hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-80 w-full" /> {/* Spacer for picker */}
          </div>
        )}

        {/* Color Variations Preview */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Color Variations Preview</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div 
                className="w-full h-12 rounded-lg border border-[var(--color-border)] shadow-sm mb-2"
                style={{ backgroundColor: previewColors.primary }}
              />
              <div className="text-xs text-muted-foreground">Primary</div>
              <div className="text-xs font-mono text-muted-foreground">{previewColors.primary}</div>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-12 rounded-lg border border-[var(--color-border)] shadow-sm mb-2"
                style={{ backgroundColor: previewColors.primaryHover }}
              />
              <div className="text-xs text-muted-foreground">Hover</div>
              <div className="text-xs font-mono text-muted-foreground">{previewColors.primaryHover}</div>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-12 rounded-lg border border-[var(--color-border)] shadow-sm mb-2 flex items-center justify-center text-lg font-bold"
                style={{ 
                  backgroundColor: previewColors.primary,
                  color: previewColors.primaryText 
                }}
              >
                Aa
              </div>
              <div className="text-xs text-muted-foreground">Text</div>
              <div className="text-xs font-mono text-muted-foreground">{previewColors.primaryText}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleApplyColor}
            className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-primary-hover hover:to-primary-hover text-primary-text font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="apply-custom-color-button"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Custom Color
          </Button>
          
          {hasCustomColor && (
            <Button
              onClick={resetCustomColor}
              variant="outline"
              className="border border-[var(--color-border)] hover:bg-muted/50"
              data-testid="reset-custom-color-button"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="mb-1">
            <strong>Pro tip:</strong> Your custom color will be automatically adjusted for optimal contrast and accessibility.
          </p>
          <p>
            The system calculates hover states and text colors to ensure your theme looks great in both light and dark modes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility function to initialize custom color on app startup
export const initializeCustomColor = () => {
  try {
    const savedCustomColor = localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY)
    if (savedCustomColor) {
      const colorData = JSON.parse(savedCustomColor)
      const root = document.documentElement

      // Apply saved custom color
      root.style.setProperty('--color-primary', `hsl(${tinycolor(colorData.primary).toHsl().h}, ${tinycolor(colorData.primary).toHsl().s * 100}%, ${tinycolor(colorData.primary).toHsl().l * 100}%)`)
      root.style.setProperty('--color-primary-hover', `hsl(${tinycolor(colorData.primaryHover).toHsl().h}, ${tinycolor(colorData.primaryHover).toHsl().s * 100}%, ${tinycolor(colorData.primaryHover).toHsl().l * 100}%)`)
      root.style.setProperty('--color-primary-text', colorData.primaryText)
      
      // Also update shadcn-compatible variables
      const primaryHsl = tinycolor(colorData.primary).toHsl()
      root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s * 100}% ${primaryHsl.l * 100}%`)
      root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s * 100}% ${primaryHsl.l * 100}%`)
      root.style.setProperty('--chart-1', `${primaryHsl.h} ${primaryHsl.s * 100}% ${primaryHsl.l * 100}%`)
    }
  } catch (error) {
    console.warn('Failed to initialize custom color:', error)
  }
}