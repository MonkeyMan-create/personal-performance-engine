import React from 'react'
import { Card, CardContent } from './ui/card'
import { Activity, Flame, Moon } from 'lucide-react'

interface DataCardsProps {
  stepsData: { current: number; goal: number }
  caloriesData: { current: number; goal: number }
  sleepData: { current: number; goal: number }
}

export default function DataCards({ stepsData, caloriesData, sleepData }: DataCardsProps) {
  const stepsProgress = (stepsData.current / stepsData.goal) * 100
  const caloriesProgress = (caloriesData.current / caloriesData.goal) * 100
  const sleepProgress = (sleepData.current / sleepData.goal) * 100

  return (
    <div className="grid gap-4">
      {/* Steps Card */}
      <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/20 rounded-xl">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Steps Today</h3>
                <p className="text-slate-300" data-testid="steps-count">
                  {stepsData.current.toLocaleString()} / {stepsData.goal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(100, stepsProgress) / 100)}`}
                  strokeLinecap="round"
                  className="text-emerald-400 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-emerald-400" data-testid="steps-percentage">
                  {Math.round(stepsProgress)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calories Card */}
      <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">Calories Burnt</h3>
                <p className="text-slate-300" data-testid="calories-count">
                  {caloriesData.current} / {caloriesData.goal} cal
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary" data-testid="calories-percentage">
                  {Math.round(caloriesProgress)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, caloriesProgress)}%` }}
                data-testid="calories-progress-bar"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Card */}
      <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Moon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">Sleep Hours</h3>
                <p className="text-slate-300" data-testid="sleep-count">
                  {sleepData.current} / {sleepData.goal} hours
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary" data-testid="sleep-percentage">
                  {Math.round(sleepProgress)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, sleepProgress)}%` }}
                data-testid="sleep-progress-bar"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}