import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../components/theme-provider'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { User, Moon, Sun, LogOut, ChevronRight, Settings, Download, Trash2, HelpCircle, MessageCircle, FileText, Scale } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout, signInWithGoogle } = useAuth()
  const { theme, setTheme } = useTheme()

  const [measurementUnit, setMeasurementUnit] = useState(() => {
    return localStorage.getItem('measurementUnit') || 'lbs'
  })

  useEffect(() => {
    localStorage.setItem('measurementUnit', measurementUnit)
  }, [measurementUnit])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Branded Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-2xl">
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
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Main Content Card */}
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Please sign in to access your settings
              </p>
              <Button 
                onClick={signInWithGoogle} 
                className="w-full h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
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

          {/* Subtle brand footer */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
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

  const handleMeasurementToggle = () => {
    setMeasurementUnit(measurementUnit === 'lbs' ? 'kg' : 'lbs')
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

  // Format member since date
  const getMemberSinceDate = () => {
    if (user?.metadata?.creationTime) {
      const creationDate = new Date(user.metadata.creationTime)
      return creationDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    }
    return 'Recently'
  }

  // Settings list item component
  const SettingsItem = ({ icon: Icon, title, subtitle, action, showToggle = false, toggleState = false, showChevron = true }: {
    icon: any
    title: string
    subtitle?: string
    action?: () => void
    showToggle?: boolean
    toggleState?: boolean
    showChevron?: boolean
  }) => (
    <div 
      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={showToggle ? undefined : action}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{title}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      
      {showToggle ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            action?.()
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            toggleState ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              toggleState ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ) : showChevron ? (
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      ) : null}
    </div>
  )

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold pt-4">Settings</h1>
      
      {/* User Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold">
                  {getInitials(user.displayName)}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">Member since {getMemberSinceDate()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <SettingsItem
              icon={User}
              title="My Profile & Account"
              subtitle="View and edit your profile information"
              action={() => {/* Placeholder */}}
            />
            <SettingsItem
              icon={theme === 'dark' ? Moon : Sun}
              title="Dark Mode"
              subtitle="Toggle dark mode appearance"
              action={handleThemeToggle}
              showToggle={true}
              toggleState={theme === 'dark'}
              showChevron={false}
            />
            <SettingsItem
              icon={Scale}
              title="Measurement Units"
              subtitle={`Currently using ${measurementUnit}`}
              action={handleMeasurementToggle}
              showToggle={true}
              toggleState={measurementUnit === 'kg'}
              showChevron={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <SettingsItem
              icon={Download}
              title="Data Export"
              subtitle="Download your fitness data"
              action={() => {/* Placeholder */}}
            />
            <SettingsItem
              icon={Trash2}
              title="Account & Data Deletion"
              subtitle="Permanently delete your account and data"
              action={() => {/* Placeholder */}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <SettingsItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="Get help and find answers"
              action={() => {/* Placeholder */}}
            />
            <SettingsItem
              icon={MessageCircle}
              title="Contact Us"
              subtitle="Get in touch with our support team"
              action={() => {/* Placeholder */}}
            />
            <SettingsItem
              icon={FileText}
              title="Legal"
              subtitle="Privacy policy and terms of service"
              action={() => {/* Placeholder */}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sign Out Button */}
      <Card>
        <CardContent className="p-6">
          <Button 
            variant="destructive" 
            onClick={logout}
            className="w-full flex items-center gap-2 h-12"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}