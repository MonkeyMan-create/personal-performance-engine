import React, { createContext, useContext, useState, useEffect } from 'react'

type MeasurementUnit = 'lbs' | 'kg'

interface MeasurementContextType {
  unit: MeasurementUnit
  setUnit: (unit: MeasurementUnit) => void
  convertWeight: (weight: number, fromUnit?: MeasurementUnit) => number
  formatWeight: (weight: number, fromUnit?: MeasurementUnit) => string
}

const MeasurementContext = createContext<MeasurementContextType | undefined>(undefined)

export function MeasurementProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<MeasurementUnit>(() => {
    try {
      const saved = localStorage.getItem('measurementUnit')
      return saved === 'kg' || saved === 'lbs' ? saved : 'lbs'
    } catch {
      return 'lbs'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('measurementUnit', unit)
    } catch (error) {
      console.warn('Failed to save measurement unit:', error)
    }
  }, [unit])

  const setUnit = (newUnit: MeasurementUnit) => {
    setUnitState(newUnit)
  }

  const convertWeight = (weight: number, fromUnit: MeasurementUnit = unit): number => {
    if (fromUnit === unit) return weight
    
    if (fromUnit === 'lbs' && unit === 'kg') {
      return weight * 0.453592 // lbs to kg
    }
    if (fromUnit === 'kg' && unit === 'lbs') {
      return weight * 2.20462 // kg to lbs
    }
    
    return weight
  }

  const formatWeight = (weight: number, fromUnit: MeasurementUnit = unit): string => {
    const convertedWeight = convertWeight(weight, fromUnit)
    return `${convertedWeight.toFixed(1)} ${unit}`
  }

  return (
    <MeasurementContext.Provider 
      value={{ 
        unit, 
        setUnit, 
        convertWeight, 
        formatWeight 
      }}
    >
      {children}
    </MeasurementContext.Provider>
  )
}

export function useMeasurement() {
  const context = useContext(MeasurementContext)
  if (!context) {
    throw new Error('useMeasurement must be used within MeasurementProvider')
  }
  return context
}