import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'
type ColorTheme = 'teal' | 'blue' | 'orange' | 'purple'

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
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  colorTheme: 'teal',
  setTheme: () => null,
  setColorTheme: () => null,
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
      const storedColorTheme = localStorage.getItem(colorStorageKey)
      if (storedColorTheme === 'teal' || storedColorTheme === 'blue' || storedColorTheme === 'orange' || storedColorTheme === 'purple') {
        return storedColorTheme
      }
    } catch (error) {
      // localStorage not available or other error
      console.warn('Failed to access localStorage for color theme:', error)
    }
    return defaultColorTheme
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
    root.classList.remove('color-teal', 'color-blue', 'color-orange', 'color-purple')
    
    // Add the current color theme class
    root.classList.add(`color-${colorTheme}`)
  }, [colorTheme])

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
        localStorage.setItem(colorStorageKey, newColorTheme)
      } catch (error) {
        console.warn('Failed to save color theme to localStorage:', error)
      }
      setColorTheme(newColorTheme)
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