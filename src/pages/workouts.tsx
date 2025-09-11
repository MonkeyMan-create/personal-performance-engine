import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'

export default function WorkoutsPage() {
  const { user, isGuestMode } = useAuth()

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Workouts"
        description="Track your exercises with RIR (Reps in Reserve) for optimal progressive overload and muscle growth."
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Workouts</h1>
          <Button 
            className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20"
            data-testid="button-add-workout"
          >
            <Plus className="w-4 h-4 mr-2" />
            + Add Workout
          </Button>
        </div>

        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Workout Logger</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Track your exercises with RIR (Reps in Reserve)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300">Start logging your first workout!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}