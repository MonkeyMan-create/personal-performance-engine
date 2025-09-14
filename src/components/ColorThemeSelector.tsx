import React from 'react'
import { useTheme } from './theme-provider'
import { Check } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

type ColorTheme = 'teal' | 'blue' | 'orange' | 'purple'

interface ColorThemeOption {
  id: ColorTheme
  name: string
  description: string
  primaryColor: string
  gradientFrom: string
  gradientTo: string
}

const colorThemes: ColorThemeOption[] = [
  {
    id: 'teal',
    name: 'Teal',
    description: 'Fresh and energetic teal accents',
    primaryColor: '#14B8A6',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-teal-600'
  },
  {
    id: 'blue',
    name: 'Blue',
    description: 'Professional and trustworthy blue',
    primaryColor: '#3B82F6',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600'
  },
  {
    id: 'orange',
    name: 'Orange',
    description: 'Vibrant and motivating orange',
    primaryColor: '#F97316',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600'
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Creative and inspiring purple',
    primaryColor: '#8B5CF6',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600'
  }
]

export default function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme()
  const { toast } = useToast()

  const handleColorThemeSelect = (newColorTheme: ColorTheme) => {
    if (newColorTheme === colorTheme) return // No change needed
    
    setColorTheme(newColorTheme)
    
    const selectedTheme = colorThemes.find(theme => theme.id === newColorTheme)
    toast({
      title: "Color Theme Updated!",
      description: `App accent color changed to ${selectedTheme?.name || newColorTheme} successfully.`,
    })
  }

  return (
    <div className="space-y-4" data-testid="color-theme-selector">
      <div className="text-sm text-slate-400">
        Choose your preferred accent color for buttons, links, and highlights
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {colorThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleColorThemeSelect(theme.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 text-left
              hover:scale-[1.02] active:scale-[0.98]
              ${colorTheme === theme.id 
                ? 'border-primary shadow-lg shadow-primary/25 bg-card' 
                : 'border-slate-700/50 hover:border-slate-600 bg-card/50'
              }
            `}
            data-testid={`color-theme-${theme.id}`}
            aria-label={`Select ${theme.name} color theme: ${theme.description}`}
          >
            {/* Color Swatch */}
            <div className="flex items-center gap-3 mb-2">
              <div 
                className={`
                  w-8 h-8 rounded-lg shadow-md ring-2 ring-offset-2 ring-offset-card
                  flex items-center justify-center
                  ${colorTheme === theme.id ? 'ring-primary' : 'ring-transparent'}
                `}
                style={{ backgroundColor: theme.primaryColor }}
              >
                {colorTheme === theme.id && (
                  <Check 
                    className="w-4 h-4 text-white font-bold" 
                    strokeWidth={3}
                    data-testid={`check-${theme.id}`}
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-foreground">{theme.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {theme.description}
                </div>
              </div>
            </div>
            
            {/* Preview Elements */}
            <div className="flex items-center gap-2 mt-3">
              <div 
                className="h-2 flex-1 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${theme.primaryColor}20, ${theme.primaryColor})`
                }}
              />
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: theme.primaryColor }}
              />
            </div>
            
            {/* Active Indicator */}
            {colorTheme === theme.id && (
              <div className="absolute -top-1 -right-1">
                <div 
                  className="w-6 h-6 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}dd)`
                  }}
                >
                  <Check className="w-3 h-3 text-white font-bold" strokeWidth={3} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Current Selection Display */}
      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Current: <span className="font-medium text-foreground">
          {colorThemes.find(theme => theme.id === colorTheme)?.name || 'Teal'}
        </span>
      </div>
    </div>
  )
}