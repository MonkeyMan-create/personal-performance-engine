import React, { createContext, useContext, useState, ReactNode } from 'react'

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

// Provider component props
interface AppStateProviderProps {
  children: ReactNode
}

// Provider component - the "Smart Home Hub"
export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  // Global state managed here
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(1200)
  const [calorieBudget, setCalorieBudget] = useState<number>(2500)
  
  // Action to add calories to consumed total
  const addCalories = (calories: number) => {
    setCaloriesConsumed(prev => prev + calories)
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