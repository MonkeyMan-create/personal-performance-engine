import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Dumbbell, Eye, ImageIcon, Loader2 } from 'lucide-react'

interface ExerciseImageProps {
  src?: string
  alt: string
  exerciseName: string
  className?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  showPlaceholder?: boolean
  lazy?: boolean
  onImageClick?: () => void
  fallbackType?: 'dumbbell' | 'generic'
}

export default function ExerciseImage({
  src,
  alt,
  exerciseName,
  className,
  size = 'medium',
  showPlaceholder = true,
  lazy = true,
  onImageClick,
  fallbackType = 'dumbbell'
}: ExerciseImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)

  // Size configurations
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
    full: 'w-full h-64 md:h-80'
  }

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    full: 'w-16 h-16'
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`exercise-image-${exerciseName}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [lazy, exerciseName])

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleClick = () => {
    if (onImageClick && !hasError && !isLoading) {
      onImageClick()
    }
  }

  // Placeholder component
  const PlaceholderContent = () => (
    <div className={cn(
      "flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-[var(--color-activity)] dark:text-[var(--color-activity)]",
      sizeClasses[size]
    )}>
      {fallbackType === 'dumbbell' ? (
        <Dumbbell className={cn(iconSizes[size], "mb-1")} />
      ) : (
        <ImageIcon className={cn(iconSizes[size], "mb-1")} />
      )}
      {size !== 'small' && (
        <span className="text-xs text-center px-1 font-medium">
          {size === 'full' ? exerciseName : 'Exercise'}
        </span>
      )}
    </div>
  )

  // Loading component
  const LoadingContent = () => (
    <div className={cn(
      "flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-700 text-[var(--color-activity)] dark:text-[var(--color-activity)]",
      sizeClasses[size]
    )}>
      <Loader2 className={cn(iconSizes[size], "animate-spin mb-1")} />
      {size !== 'small' && (
        <span className="text-xs font-medium">Loading...</span>
      )}
    </div>
  )

  return (
    <div
      id={`exercise-image-${exerciseName}`}
      className={cn(
        "relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 group",
        sizeClasses[size],
        onImageClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={handleClick}
      data-testid={`exercise-image-${exerciseName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {!isVisible ? (
        // Lazy loading placeholder
        <div className={cn(
          "flex items-center justify-center bg-slate-50 dark:bg-slate-800",
          sizeClasses[size]
        )}>
          <Eye className={cn(iconSizes[size], "text-[var(--color-activity)]")} />
        </div>
      ) : !src || hasError ? (
        // No image or error placeholder
        showPlaceholder ? <PlaceholderContent /> : null
      ) : (
        <>
          {/* Loading state */}
          {isLoading && <LoadingContent />}
          
          {/* Actual image */}
          <img
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            loading="lazy"
          />
          
          {/* Click overlay */}
          {onImageClick && !isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Eye className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: 'var(--color-text-on-primary)' }} />
            </div>
          )}
        </>
      )}
      
      {/* Badge for exercise type (optional) */}
      {size === 'full' && !hasError && !isLoading && (
        <div className="absolute top-2 right-2">
          <div className="bg-primary px-2 py-1 rounded-md text-xs font-medium shadow-lg" style={{ color: 'var(--color-text-on-primary)' }}>
            Exercise
          </div>
        </div>
      )}
    </div>
  )
}

// Convenience components for common use cases
export const ExerciseThumbnail = (props: Omit<ExerciseImageProps, 'size'>) => (
  <ExerciseImage {...props} size="small" />
)

export const ExercisePreview = (props: Omit<ExerciseImageProps, 'size'>) => (
  <ExerciseImage {...props} size="medium" />
)

export const ExerciseGallery = (props: Omit<ExerciseImageProps, 'size'>) => (
  <ExerciseImage {...props} size="large" />
)

export const ExerciseHero = (props: Omit<ExerciseImageProps, 'size'>) => (
  <ExerciseImage {...props} size="full" />
)