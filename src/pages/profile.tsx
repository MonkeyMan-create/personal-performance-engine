import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../components/theme-provider'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { User, Moon, Sun, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout, signInWithGoogle } = useAuth()
  const { theme, setTheme } = useTheme()

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
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Please sign in to view your profile
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

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Get user initials for fallback avatar
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <h1 className="text-2xl font-bold text-white pt-4">My Profile</h1>
        
        {/* User Information Card */}
        <Card className="bg-slate-800/80 border-slate-700/50 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-slate-300">Your profile details from Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            {/* Custom Avatar Component */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {getInitials(user.displayName)}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-lg text-white">{user.displayName}</p>
              <p className="text-sm text-slate-300">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Settings Card */}
        <Card className="bg-slate-800/80 border-slate-700/50 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Settings</CardTitle>
            <CardDescription className="text-slate-300">Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-cyan-400" />}
                <div>
                  <p className="font-medium text-white">Dark Theme</p>
                  <p className="text-sm text-slate-300">Toggle dark mode appearance</p>
                </div>
              </div>
            {/* Custom Toggle Switch */}
            <button
              onClick={handleThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                theme === 'dark' ? 'bg-cyan-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-slate-600">
              <Button 
                variant="destructive" 
                onClick={logout}
                className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-500"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}