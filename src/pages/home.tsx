import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Activity, Target, TrendingUp, Zap } from 'lucide-react'

export default function HomePage() {
  const { user, signInWithGoogle } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Branded Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                {/* Stylized heartbeat/pulse logo */}
                <svg 
                  className="w-10 h-10 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Glowing effect */}
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="bg-slate-800/80 border-slate-700/50 shadow-2xl backdrop-blur-xl">
            <CardHeader className="text-center space-y-6 pb-6 pt-8">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Personal Performance Engine
              </CardTitle>
              <CardDescription className="text-slate-300 text-base max-w-sm mx-auto leading-relaxed">
                Track workouts, nutrition, and achieve your fitness goals with AI coaching
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <Button 
                onClick={signInWithGoogle} 
                className="w-full h-12 text-base font-semibold bg-slate-700 hover:bg-slate-600 text-white border-2 border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-cyan-400/20" 
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
              
              <p className="text-center text-sm text-slate-400 mt-6">
                Secure authentication powered by Google
              </p>
            </CardContent>
          </Card>

          {/* Subtle brand footer */}
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Elevate your fitness journey with smart technology
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8 pb-24">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, {user.displayName?.split(' ')[0]}</h1>
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