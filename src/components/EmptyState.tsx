import React from 'react'
import { Button } from './ui/button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionText?: string
  onAction?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'subtle' | 'feature'
  className?: string
  testId?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  size = 'md',
  variant = 'default',
  className = '',
  testId = 'empty-state'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-12 h-12',
      iconBadge: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3'
    },
    md: {
      container: 'py-12 px-6',
      icon: 'w-16 h-16',
      iconBadge: 'w-24 h-24',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'w-20 h-20',
      iconBadge: 'w-28 h-28',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  }

  const variantClasses = {
    default: {
      container: 'text-center',
      iconBadge: 'bg-muted/20 border-2 border-muted/30',
      icon: 'text-muted-foreground',
      title: 'font-semibold text-primary',
      description: 'text-secondary',
      button: 'button-base button-default bg-primary hover:bg-primary/90'
    },
    subtle: {
      container: 'text-center',
      iconBadge: 'bg-background/50 border-2 border-border/50',
      icon: 'text-muted-foreground/70',
      title: 'font-medium text-muted-foreground',
      description: 'text-muted-foreground/80',
      button: 'button-base button-outline'
    },
    feature: {
      container: 'text-center',
      iconBadge: 'bg-primary/10 border-2 border-primary/20',
      icon: 'text-primary',
      title: 'font-bold text-primary',
      description: 'text-secondary',
      button: 'button-base button-default bg-primary hover:bg-primary/90'
    }
  }

  const sizes = sizeClasses[size]
  const variants = variantClasses[variant]

  return (
    <div 
      className={`flex flex-col items-center justify-center ${sizes.container} ${variants.container} ${className}`}
      data-testid={testId}
    >
      <div className={`${sizes.spacing}`}>
        {/* Icon Container */}
        <div 
          className={`${sizes.iconBadge} ${variants.iconBadge} rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg`}
          data-testid={`${testId}-icon`}
        >
          <Icon 
            className={`${sizes.icon} ${variants.icon}`} 
          />
        </div>

        {/* Content */}
        <div className={`${sizes.spacing}`}>
          <h3 
            className={`${sizes.title} ${variants.title} mb-2`}
            data-testid={`${testId}-title`}
          >
            {title}
          </h3>
          
          <p 
            className={`${sizes.description} ${variants.description} leading-relaxed`}
            data-testid={`${testId}-description`}
          >
            {description}
          </p>
        </div>

        {/* Action Button */}
        {actionText && onAction && (
          <div className="pt-2">
            <Button
              onClick={onAction}
              className={variants.button}
              data-testid={`${testId}-action`}
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Pre-configured empty state variants for common use cases
export const WorkoutEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    variant="feature"
    size="md"
    {...props}
    testId="empty-workouts"
  />
)

export const NutritionEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    variant="feature" 
    size="md"
    {...props}
    testId="empty-nutrition"
  />
)

export const ProgressEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    variant="subtle"
    size="md"
    {...props}
    testId="empty-progress"
  />
)

export const DataEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    variant="default"
    size="sm"
    {...props}
    testId="empty-data"
  />
)