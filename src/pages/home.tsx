import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Activity, Target, TrendingUp, Zap } from 'lucide-react'

export default function HomePage() {
  const { user, signInWithGoogle } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/30">
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8 pt-12">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Personal Performance Engine</CardTitle>
            <CardDescription className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Track workouts, nutrition, and achieve your fitness goals with AI coaching
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12">
            <Button 
              onClick={signInWithGoogle} 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
              size="lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Secure authentication powered by Google
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8 pb-24">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user.displayName?.split(' ')[0]}</h1>
        <p className="text-lg text-muted-foreground">Ready to crush your fitness goals today?</p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-primary/15 rounded-xl flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Activity className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Quick Workout</h3>
            <p className="text-sm text-muted-foreground">Log your training</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-emerald-500/15 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
              <Target className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-lg">Track Nutrition</h3>
            <p className="text-sm text-muted-foreground">Log your meals</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-blue-500/15 rounded-xl flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
              <TrendingUp className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="font-semibold text-lg">View Progress</h3>
            <p className="text-sm text-muted-foreground">See your gains</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-purple-500/15 rounded-xl flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
              <Zap className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="font-semibold text-lg">AI Coaching</h3>
            <p className="text-sm text-muted-foreground">Get smart advice</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}