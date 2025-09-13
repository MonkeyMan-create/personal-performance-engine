import React from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  current: number
  goal: number
  label: string
  unit?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProgressRing({ 
  progress, 
  current, 
  goal, 
  label, 
  unit = '',
  size = 'lg',
  className = ''
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
          className="text-slate-700/40"
        />
        {/* Progress circle with teal gradient */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))'
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className={`font-bold text-slate-700 dark:text-slate-300 ${config.textSize}`} data-testid={`${label.toLowerCase().replace(' ', '-')}-current`}>
          {current.toLocaleString()}
        </div>
        <div className="text-xs text-slate-400 -mt-1">
          / {goal.toLocaleString()} {unit}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">
          {label}
        </div>
      </div>
    </div>
  )
}