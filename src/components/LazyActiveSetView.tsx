import React, { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Loader2, Dumbbell } from 'lucide-react'

// Lazy load the ActiveSetView component
const ActiveSetView = React.lazy(() => import('./ActiveSetView'))

interface LazyActiveSetViewProps {
  exerciseName: string
  onFinishExercise: () => void
  onBackToSelection: () => void
}

// Loading fallback component for the active set view
const ActiveSetLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)] flex items-center justify-center">
    <Card className="w-full max-w-md bg-[var(--color-surface)]/90 border-[var(--color-border)]/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Loading Workout...
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/80 to-primary rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-primary/30 mx-auto">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-primary/80 to-primary rounded-2xl blur-xl opacity-30 animate-pulse mx-auto"></div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-[var(--color-text-secondary)]">Preparing your set...</span>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function LazyActiveSetView(props: LazyActiveSetViewProps) {
  return (
    <Suspense fallback={<ActiveSetLoadingFallback />}>
      <ActiveSetView {...props} />
    </Suspense>
  )
}