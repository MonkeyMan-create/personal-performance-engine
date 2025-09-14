import React, { Suspense } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Loader2, Zap } from 'lucide-react'

// Lazy load the WorkoutTemplateSelector component
const WorkoutTemplateSelector = React.lazy(() => import('./WorkoutTemplateSelector'))

interface LazyWorkoutTemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (workoutForm: any) => void
}

// Loading fallback component for the workout template selector
const TemplateLoadingFallback = () => (
  <Dialog open={true}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[var(--color-background)]/95 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Loading Workout Templates...
        </DialogTitle>
      </DialogHeader>

      <div className="py-12 text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/80 to-primary rounded-3xl flex items-center justify-center ring-4 ring-primary/30 mx-auto">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-primary/80 to-primary rounded-3xl blur-xl opacity-30 animate-pulse mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-lg font-medium text-[var(--color-text-secondary)]">
              Loading workout templates...
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Preparing your personalized workout options
          </p>
        </div>

        {/* Loading skeletons for templates */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="p-6 bg-[var(--color-surface)] rounded-xl animate-pulse"
            >
              <div className="space-y-3">
                <div className="h-6 bg-[var(--color-surface)] rounded w-3/4"></div>
                <div className="h-4 bg-[var(--color-surface)] rounded w-full"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-[var(--color-surface)] rounded w-20"></div>
                  <div className="h-6 bg-[var(--color-surface)] rounded w-16"></div>
                </div>
                <div className="h-10 bg-[var(--color-surface)] rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default function LazyWorkoutTemplateSelector(props: LazyWorkoutTemplateSelectorProps) {
  // Only render when actually opened to ensure the dynamic import only happens when needed
  if (!props.isOpen) {
    return null
  }

  return (
    <Suspense fallback={<TemplateLoadingFallback />}>
      <WorkoutTemplateSelector {...props} />
    </Suspense>
  )
}