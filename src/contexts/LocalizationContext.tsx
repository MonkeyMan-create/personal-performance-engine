import React, { createContext, useContext, useState, useEffect } from 'react'

interface LocalizationContextType {
  language: string
  country: string
  setLanguage: (language: string) => void
  setCountry: (country: string) => void
  getCountryCode: () => string
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

// Language options (structured for future expansion)
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' }
] as const

// Country options with their codes for Open Food Facts API
export const SUPPORTED_COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'be', name: 'Belgium', flag: '🇧🇪' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'at', name: 'Austria', flag: '🇦🇹' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'global', name: 'Global (All Countries)', flag: '🌍' }
] as const

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('language')
      return saved && SUPPORTED_LANGUAGES.some(lang => lang.code === saved) ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  const [country, setCountryState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('country')
      return saved && SUPPORTED_COUNTRIES.some(c => c.code === saved) ? saved : 'us'
    } catch {
      return 'us'
    }
  })

  // Persist language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('language', language)
    } catch {
      // Silently handle localStorage errors
    }
  }, [language])

  // Persist country to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('country', country)
    } catch {
      // Silently handle localStorage errors
    }
  }, [country])

  const setLanguage = (newLanguage: string) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === newLanguage)) {
      setLanguageState(newLanguage)
    }
  }

  const setCountry = (newCountry: string) => {
    if (SUPPORTED_COUNTRIES.some(c => c.code === newCountry)) {
      setCountryState(newCountry)
    }
  }

  const getCountryCode = (): string => {
    return country === 'global' ? '' : country
  }

  return (
    <LocalizationContext.Provider 
      value={{ 
        language, 
        country, 
        setLanguage, 
        setCountry, 
        getCountryCode 
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider')
  }
  return context
}