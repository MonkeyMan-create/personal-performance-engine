import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import HeartbeatIcon from './icons/HeartbeatIcon'
import GoogleIcon from './icons/GoogleIcon'
import UserIcon from './icons/UserIcon'

interface AuthPromptProps {
  title: string
  description: string
}

export default function AuthPrompt({ title, description }: AuthPromptProps) {
  const { signInWithGoogle, enterGuestMode } = useAuth()

  const handleGuestMode = () => {
    enterGuestMode()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Branded Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              {/* Stylized heartbeat/pulse logo */}
              <HeartbeatIcon className="w-10 h-10 text-white" />
            </div>
            {/* Glowing effect */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-card/80 border-border shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-4">
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Personal Performance Engine
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
              Track workouts, nutrition, and achieve your fitness goals with AI coaching
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8 space-y-6">
            {/* Page-specific content */}
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Auth buttons */}
            <div className="space-y-4">
              {/* Google Sign In Button */}
              <Button 
                onClick={signInWithGoogle} 
                className="w-full h-12 text-base font-semibold bg-slate-700 hover:bg-slate-600 text-white border-2 border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-cyan-400/20" 
                size="lg"
                data-testid="button-google-signin"
              >
                <GoogleIcon className="w-5 h-5 mr-3" />
                Sign in with Google
              </Button>

              {/* Separator */}
              <div className="relative flex items-center">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="px-4 text-xs text-slate-400 bg-slate-800">OR</span>
                <div className="flex-1 h-px bg-slate-600"></div>
              </div>

              {/* Guest Mode Button */}
              <Button
                onClick={handleGuestMode}
                variant="outline"
                className="w-full h-12 text-base font-medium bg-transparent border-2 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
                data-testid="button-guest-mode"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                Continue as Guest
              </Button>

              {/* Guest mode info */}
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Try the app without creating an account. Your data will be saved locally on this device.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}