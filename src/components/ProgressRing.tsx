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
  style?: React.CSSProperties
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
  style,
  color
}: ProgressRingProps) {
  // Size configurations using theme variables
  const sizeConfig = {
    sm: { 
      diameter: 'calc(var(--spacing-20))', // 80px equivalent
      strokeWidth: 'calc(var(--spacing-6) * 0.25)', // 6px equivalent
      fontSize: 'var(--font-size-sm)'
    },
    md: { 
      diameter: 'calc(var(--spacing-30))', // 120px equivalent  
      strokeWidth: 'calc(var(--spacing-8) * 0.25)', // 8px equivalent
      fontSize: 'var(--font-size-lg)'
    },
    lg: { 
      diameter: 'calc(var(--spacing-40))', // 160px equivalent
      strokeWidth: 'calc(var(--spacing-10) * 0.25)', // 10px equivalent  
      fontSize: 'var(--font-size-2xl)'
    }
  }

  const config = sizeConfig[size]
  
  // Calculate numeric values for SVG calculations
  const numericDiameter = size === 'sm' ? 80 : size === 'md' ? 120 : 160
  const numericStrokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10
  const radius = (numericDiameter - numericStrokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference

  // Resolve color from CSS variable or use theme default
  let resolvedColor = 'var(--color-action)' // Theme default fallback
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
    <div 
      style={{
        position: 'relative',
        ...style
      }}
      className={className}
      data-testid={`progress-ring-${label.toLowerCase().replace(' ', '-')}`}
    >
      <svg 
        width={numericDiameter} 
        height={numericDiameter} 
        style={{
          transform: 'rotate(-90deg)'
        }}
      >
        {/* Background circle */}
        <circle
          cx={numericDiameter / 2}
          cy={numericDiameter / 2}
          r={radius}
          stroke="var(--color-border-secondary)"
          strokeWidth={numericStrokeWidth}
          fill="none"
        />
        {/* Progress circle with dynamic gradient */}
        <circle
          cx={numericDiameter / 2}
          cy={numericDiameter / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={numericStrokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'all 1s ease-out',
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
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            fontSize: config.fontSize
          }}
          data-testid={`${label.toLowerCase().replace(' ', '-')}-current`}
        >
          {current.toLocaleString()}
        </div>
        <div 
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)',
            marginTop: 'calc(var(--spacing-1) * -1)'
          }}
        >
          / {goal.toLocaleString()} {unit}
        </div>
        <div 
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
            marginTop: 'var(--spacing-1)',
            fontWeight: 'var(--font-weight-medium)'
          }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}