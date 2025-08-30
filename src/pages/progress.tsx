import { useAuth } from '../contexts/AuthContext'
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
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-2xl font-bold text-white">Progress</h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Please sign in to view your progress
              </p>
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