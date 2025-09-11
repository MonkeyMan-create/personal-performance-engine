import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

// Sample data for the weight trend chart
const weightData = [
  { date: 'Jan 1', weight: 180 },
  { date: 'Jan 8', weight: 179 },
  { date: 'Jan 15', weight: 178 },
  { date: 'Jan 22', weight: 177 },
  { date: 'Jan 29', weight: 176 },
  { date: 'Feb 5', weight: 175 },
]

export default function ProgressPage() {
  const { user, isGuestMode } = useAuth()

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Progress"
        description="Monitor your fitness journey with detailed progress tracking and visual charts of your improvements."
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <h1 className="text-2xl font-bold pt-4 text-slate-900 dark:text-white">My Progress</h1>

        {/* Weight Trend Section */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <CardTitle className="text-slate-900 dark:text-white">Weight Trend</CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300">Track your weight changes over time</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

        {/* Workout Consistency Section */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-slate-900 dark:text-white">Workout Consistency</CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300">Your workout frequency and streaks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">12</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Workouts This Month</div>
              </div>
              <div className="text-center p-4 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">5</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Current Streak (days)</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Great consistency! Keep up the momentum to reach your fitness goals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}