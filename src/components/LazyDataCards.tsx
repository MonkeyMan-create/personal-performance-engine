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
      <Card key={index} className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-700 rounded-xl">
                <Activity className="w-6 h-6 text-slate-500" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-700 rounded w-24"></div>
                <div className="h-4 bg-slate-700 rounded w-32"></div>
              </div>
            </div>
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
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