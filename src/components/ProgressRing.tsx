import React from 'react'
import tinycolor from 'tinycolor2'

interface ProgressRingProps {
  progress: number // 0-100
  current: number
  goal: number
  label: string
  unit?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string // Dynamic color support
}

export default function ProgressRing({ 
  progress, 
  current, 
  goal, 
  label, 
  unit = '',
  size = 'lg',
  className = '',
  color
}: ProgressRingProps) {
  // Size configurations
  const sizeConfig = {
    sm: { diameter: 80, strokeWidth: 6, textSize: 'text-sm' },
    md: { diameter: 120, strokeWidth: 8, textSize: 'text-lg' },
    lg: { diameter: 160, strokeWidth: 10, textSize: 'text-2xl' }
  }

  const config = sizeConfig[size]
  const radius = (config.diameter - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference

  // Resolve color from CSS variable or use default
  let resolvedColor = '#6366F1' // Default fallback
  if (color) {
    if (color.startsWith('var(')) {
      // Extract CSS variable and get computed value
      const cssVar = color.slice(4, -1) // Remove 'var(' and ')'
      const computedColor = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
      if (computedColor) {
        resolvedColor = computedColor
      }
    } else {
      resolvedColor = color
    }
  }

  // Generate gradient colors from base color
  const gradientColors = {
    start: resolvedColor,
    middle: tinycolor(resolvedColor).darken(5).toString(),
    end: tinycolor(resolvedColor).darken(10).toString()
  }

  // Generate unique gradient ID to avoid conflicts
  const gradientId = `progressGradient-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={`relative ${className}`} data-testid={`progress-ring-${label.toLowerCase().replace(' ', '-')}`}>
      <svg 
        width={config.diameter} 
        height={config.diameter} 
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle with dynamic gradient */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${tinycolor(resolvedColor).setAlpha(0.4).toString()})`
          }}
        />
        {/* Dynamic gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors.start} />
            <stop offset="50%" stopColor={gradientColors.middle} />
            <stop offset="100%" stopColor={gradientColors.end} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className={`font-bold text-primary ${config.textSize}`} data-testid={`${label.toLowerCase().replace(' ', '-')}-current`}>
          {current.toLocaleString()}
        </div>
        <div className="text-xs text-secondary -mt-1">
          / {goal.toLocaleString()} {unit}
        </div>
        <div className="text-xs text-tertiary mt-1 font-medium">
          {label}
        </div>
      </div>
    </div>
  )
}