import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'

export default function WorkoutsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please sign in to access workouts</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Logger</CardTitle>
          <CardDescription>Track your exercises with RIR (Reps in Reserve)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Start logging your first workout!</p>
        </CardContent>
      </Card>
    </div>
  )
}