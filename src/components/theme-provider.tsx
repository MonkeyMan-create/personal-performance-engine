import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'
type ColorTheme = 'teal' | 'blue' | 'orange' | 'purple' | 'ruby' | 'forest' | 'amber' | 'sapphire' | 'custom'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  storageKey?: string
  colorStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  hasCustomColor: boolean
  clearCustomColor: () => void
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  colorTheme: 'teal',
  setTheme: () => null,
  setColorTheme: () => null,
  hasCustomColor: false,
  clearCustomColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  defaultColorTheme = 'teal',
  storageKey = 'vite-ui-theme',
  colorStorageKey = 'app-color-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey)
      if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
        return storedTheme
      }
    } catch (error) {
      // localStorage not available or other error
      console.warn('Failed to access localStorage for theme:', error)
    }
    return defaultTheme
  })

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    try {
      // Check for custom color first
      const customColor = localStorage.getItem('custom-theme-color')
      if (customColor) {
        return 'custom'
      }
      
      const storedColorTheme = localStorage.getItem(colorStorageKey)
      if (storedColorTheme === 'teal' || storedColorTheme === 'blue' || storedColorTheme === 'orange' || storedColorTheme === 'purple' || storedColorTheme === 'ruby' || storedColorTheme === 'forest' || storedColorTheme === 'amber' || storedColorTheme === 'sapphire') {
        return storedColorTheme
      }
    } catch (error) {
      // localStorage not available or other error
      console.warn('Failed to access localStorage for color theme:', error)
    }
    return defaultColorTheme
  })

  const [hasCustomColor, setHasCustomColor] = useState<boolean>(() => {
    try {
      return localStorage.getItem('custom-theme-color') !== null
    } catch (error) {
      return false
    }
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all color theme classes
    root.classList.remove('color-teal', 'color-blue', 'color-orange', 'color-purple', 'color-ruby', 'color-forest', 'color-amber', 'color-sapphire')
    
    // Only add predefined color theme class if not using custom color
    if (colorTheme !== 'custom') {
      root.classList.add(`color-${colorTheme}`)
    }
  }, [colorTheme])

  // Initialize custom color on mount
  useEffect(() => {
    try {
      const savedCustomColor = localStorage.getItem('custom-theme-color')
      if (savedCustomColor) {
        // Import and call the initialization function
        import('./DynamicColorPicker').then(({ initializeCustomColor }) => {
          initializeCustomColor()
        })
        setHasCustomColor(true)
        setColorTheme('custom')
      }
    } catch (error) {
      console.warn('Failed to initialize custom color:', error)
    }
  }, [])

  const value = {
    theme,
    colorTheme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
      setTheme(newTheme)
    },
    setColorTheme: (newColorTheme: ColorTheme) => {
      try {
        if (newColorTheme !== 'custom') {
          // Clear custom color when switching to predefined theme
          localStorage.removeItem('custom-theme-color')
          setHasCustomColor(false)
          
          // Remove custom CSS variables to fall back to theme defaults
          const root = document.documentElement
          root.style.removeProperty('--color-primary')
          root.style.removeProperty('--color-primary-hover')
          root.style.removeProperty('--color-primary-text')
          root.style.removeProperty('--primary')
          root.style.removeProperty('--ring')
          root.style.removeProperty('--chart-1')
          
          localStorage.setItem(colorStorageKey, newColorTheme)
        }
      } catch (error) {
        console.warn('Failed to save color theme to localStorage:', error)
      }
      setColorTheme(newColorTheme)
    },
    hasCustomColor,
    clearCustomColor: () => {
      try {
        localStorage.removeItem('custom-theme-color')
        setHasCustomColor(false)
        
        // Remove custom CSS variables
        const root = document.documentElement
        root.style.removeProperty('--color-primary')
        root.style.removeProperty('--color-primary-hover')
        root.style.removeProperty('--color-primary-text')
        root.style.removeProperty('--primary')
        root.style.removeProperty('--ring')
        root.style.removeProperty('--chart-1')
        
        // Reset to default theme
        setColorTheme(defaultColorTheme)
        localStorage.setItem(colorStorageKey, defaultColorTheme)
      } catch (error) {
        console.warn('Failed to clear custom color:', error)
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}