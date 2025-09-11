import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Activity, Target, TrendingUp, Zap } from 'lucide-react'

export default function HomePage() {
  const { user, isGuestMode } = useAuth()

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Dashboard"
        description="Welcome to your fitness journey! Track workouts, log nutrition, and monitor your progress."
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8 pb-24">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {isGuestMode ? 'Guest User' : user?.displayName?.split(' ')[0]}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">Ready to crush your fitness goals today?</p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 hover:shadow-cyan-400/20 backdrop-blur-xl">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-cyan-500/15 dark:bg-cyan-400/20 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/25 dark:group-hover:bg-cyan-400/30 transition-colors">
                <Activity className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Quick Workout</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Log your training</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 hover:shadow-emerald-400/20 backdrop-blur-xl">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-emerald-500/15 dark:bg-emerald-400/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/25 dark:group-hover:bg-emerald-400/30 transition-colors">
                <Target className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Track Nutrition</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Log your meals</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 hover:shadow-blue-400/20 backdrop-blur-xl">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-blue-500/15 dark:bg-blue-400/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/25 dark:group-hover:bg-blue-400/30 transition-colors">
                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">View Progress</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">See your gains</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 hover:shadow-purple-400/20 backdrop-blur-xl">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-purple-500/15 dark:bg-purple-400/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/25 dark:group-hover:bg-purple-400/30 transition-colors">
                <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">AI Coaching</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Get smart advice</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}