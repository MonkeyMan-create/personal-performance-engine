import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the shape of our global app state
interface AppState {
  caloriesConsumed: number
  calorieBudget: number
}

// Define the context type including state and actions
interface AppStateContextType {
  // State values
  caloriesConsumed: number
  calorieBudget: number
  
  // Actions to modify state
  setCaloriesConsumed: (calories: number) => void
  setCalorieBudget: (budget: number) => void
  addCalories: (calories: number) => void
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

// localStorage key for persisting app state
const STORAGE_KEY = 'fitnessTrackerAppState'

// Provider component props
interface AppStateProviderProps {
  children: ReactNode
}

// Helper functions for localStorage
const loadStateFromStorage = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        caloriesConsumed: parsed.caloriesConsumed || 1200,
        calorieBudget: parsed.calorieBudget || 2500
      }
    }
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error)
  }
  
  // Return default values if no stored data or error
  return {
    caloriesConsumed: 1200,
    calorieBudget: 2500
  }
}

const saveStateToStorage = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error)
  }
}

// Provider component - the "Smart Home Hub"
export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  // Load initial state from localStorage
  const initialState = loadStateFromStorage()
  
  // Global state managed here
  const [caloriesConsumed, setCaloriesConsumedState] = useState<number>(initialState.caloriesConsumed)
  const [calorieBudget, setCalorieBudgetState] = useState<number>(initialState.calorieBudget)
  
  // Enhanced setters that also save to localStorage
  const setCaloriesConsumed = (calories: number) => {
    setCaloriesConsumedState(calories)
    const newState = { caloriesConsumed: calories, calorieBudget }
    saveStateToStorage(newState)
  }
  
  const setCalorieBudget = (budget: number) => {
    setCalorieBudgetState(budget)
    const newState = { caloriesConsumed, calorieBudget: budget }
    saveStateToStorage(newState)
  }
  
  // Action to add calories to consumed total
  const addCalories = (calories: number) => {
    const newConsumed = caloriesConsumed + calories
    setCaloriesConsumedState(newConsumed)
    const newState = { caloriesConsumed: newConsumed, calorieBudget }
    saveStateToStorage(newState)
  }
  
  // Context value that will be provided to all child components
  const value: AppStateContextType = {
    caloriesConsumed,
    calorieBudget,
    setCaloriesConsumed,
    setCalorieBudget,
    addCalories
  }
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

// Custom hook to use the app state context
export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}