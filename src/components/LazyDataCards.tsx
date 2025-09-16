import React, { Suspense } from 'react'
import { Card, CardContent } from './ui/card'
import { Loader2, Activity } from 'lucide-react'

// Lazy load the DataCards component
const DataCards = React.lazy(() => import('./DataCards'))

interface LazyDataCardsProps {
  stepsData: { current: number; goal: number }
  caloriesData: { current: number; goal: number }
  sleepData: { current: number; goal: number }
}

// Loading fallback component for data cards
const DataCardsLoadingFallback = () => (
  <div className="grid gap-4">
    {[1, 2, 3].map((index) => (
      <Card key={index} className="bg-surface/60 border-border/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Activity className="w-6 h-6 text-tertiary" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-tertiary animate-spin" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function LazyDataCards(props: LazyDataCardsProps) {
  return (
    <Suspense fallback={<DataCardsLoadingFallback />}>
      <DataCards {...props} />
    </Suspense>
  )
}