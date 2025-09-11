import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

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
          <CardHeader className="text-center space-y-4 pb-4">
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Personal Performance Engine
            </CardTitle>
            <CardDescription className="text-slate-300 text-base max-w-sm mx-auto leading-relaxed">
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
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
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
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
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