import React, { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Loader2, Search, X } from 'lucide-react'

// Lazy load the ExerciseSelector component
const ExerciseSelector = React.lazy(() => import('./ExerciseSelector'))

interface LazyExerciseSelectorProps {
  onSelectExercise: (exerciseName: string) => void
  onClose: () => void
}

// Loading fallback component for the exercise selector
const ExerciseSelectorLoadingFallback = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md max-h-[80vh] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 dark:text-white">Loading Exercises...</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-600 dark:text-slate-300"
            data-testid="button-close-exercise-selector"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-center py-8">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/80 to-primary rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-primary/30 mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-primary/80 to-primary rounded-2xl blur-xl opacity-30 animate-pulse mx-auto mb-4"></div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-slate-600 dark:text-slate-300">Loading exercise database...</span>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function LazyExerciseSelector(props: LazyExerciseSelectorProps) {
  return (
    <Suspense fallback={<ExerciseSelectorLoadingFallback onClose={props.onClose} />}>
      <ExerciseSelector {...props} />
    </Suspense>
  )
}