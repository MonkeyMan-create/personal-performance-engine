import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { useTheme } from '../components/theme-provider'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { User, Moon, Sun, LogOut, ChevronRight, Settings, Download, Trash2, HelpCircle, MessageCircle, FileText, Scale, Smartphone, Info } from 'lucide-react'
import { Link } from 'wouter'

export default function SettingsPage() {
  const { user, logout, isGuestMode } = useAuth()
  const { theme, setTheme } = useTheme()

  const [measurementUnit, setMeasurementUnit] = useState(() => {
    return localStorage.getItem('measurementUnit') || 'lbs'
  })

  useEffect(() => {
    localStorage.setItem('measurementUnit', measurementUnit)
  }, [measurementUnit])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Settings & Profile"
        description="Customize your fitness preferences, manage your account, and personalize your experience."
      />
    )
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleMeasurementToggle = () => {
    setMeasurementUnit(measurementUnit === 'lbs' ? 'kg' : 'lbs')
  }

  // Get user initials for fallback avatar
  const getInitials = (name: string | null | undefined) => {
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
  const SettingsItem = ({ icon: Icon, title, subtitle, action, showToggle = false, toggleState = false, showChevron = true, testId }: {
    icon: any
    title: string
    subtitle?: string
    action?: () => void
    showToggle?: boolean
    toggleState?: boolean
    showChevron?: boolean
    testId?: string
  }) => (
    <div 
      className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
      onClick={showToggle ? undefined : action}
      data-testid={testId}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-700/30 rounded-xl">
          <Icon className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      
      {showToggle ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            action?.()
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            toggleState ? 'bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25' : 'bg-slate-600'
          }`}
          data-testid={`${testId}-toggle`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
              toggleState ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ) : showChevron ? (
        <ChevronRight className="w-5 h-5 text-slate-400" />
      ) : null}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="pt-8 text-center">
          <h1 className="text-3xl font-bold text-white" data-testid="page-title">Settings</h1>
          <p className="text-slate-300 mt-2">Customize your experience and manage your account</p>
        </div>
        
        {/* User Header */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-400/30 shadow-xl" data-testid="user-avatar">
                {!isGuestMode && user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                    {isGuestMode ? 'G' : getInitials(user?.displayName)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-2xl text-white" data-testid="user-name">
                  {isGuestMode ? 'Guest User' : user?.displayName}
                </h2>
                <p className="text-slate-300 font-medium">
                  {isGuestMode ? 'Guest Session' : `Member since ${getMemberSinceDate()}`}
                </p>
                {!isGuestMode && user?.email && (
                  <p className="text-sm text-slate-400 mt-1" data-testid="user-email">{user.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-teal-400" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-slate-300">
              Manage your profile and app preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <SettingsItem
              icon={User}
              title="My Profile & Account"
              subtitle="View and edit your profile information"
              action={() => {/* Placeholder */}}
              testId="settings-profile"
            />
            <SettingsItem
              icon={theme === 'dark' ? Moon : Sun}
              title="Dark Mode"
              subtitle={`Currently ${theme === 'dark' ? 'enabled' : 'disabled'}`}
              action={handleThemeToggle}
              showToggle={true}
              toggleState={theme === 'dark'}
              showChevron={false}
              testId="settings-dark-mode"
            />
            <SettingsItem
              icon={Scale}
              title="Measurement Units"
              subtitle={`Using ${measurementUnit.toUpperCase()} for weights`}
              action={handleMeasurementToggle}
              showToggle={true}
              toggleState={measurementUnit === 'kg'}
              showChevron={false}
              testId="settings-measurement-units"
            />
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Download className="w-6 h-6 text-purple-400" />
              Data Management
            </CardTitle>
            <CardDescription className="text-slate-300">
              Manage your health data and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/health-connections">
              <div 
                className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
                data-testid="link-health-connections"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Smartphone className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Health Data Connections</p>
                    <p className="text-sm text-slate-400 mt-0.5">Connect Google Health & Apple HealthKit</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
            <SettingsItem
              icon={Download}
              title="Export Data"
              subtitle="Download your fitness and nutrition data"
              action={() => {/* Placeholder */}}
              testId="settings-export-data"
            />
            <SettingsItem
              icon={Trash2}
              title="Delete Account"
              subtitle="Permanently remove your account and all data"
              action={() => {/* Placeholder */}}
              testId="settings-delete-account"
            />
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-400" />
              Support & Help
            </CardTitle>
            <CardDescription className="text-slate-300">
              Get help and learn more about the app
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/mission">
              <div 
                className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
                data-testid="link-mission-model"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Info className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Our Mission & Model</p>
                    <p className="text-sm text-slate-400 mt-0.5">Learn about our commitment to free fitness tools</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
            <SettingsItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="Find answers to common questions"
              action={() => {/* Placeholder */}}
              testId="settings-help-center"
            />
            <SettingsItem
              icon={MessageCircle}
              title="Contact Support"
              subtitle="Get in touch with our support team"
              action={() => {/* Placeholder */}}
              testId="settings-contact-support"
            />
            <SettingsItem
              icon={FileText}
              title="Privacy & Terms"
              subtitle="View our privacy policy and terms of service"
              action={() => {/* Placeholder */}}
              testId="settings-legal"
            />
          </CardContent>
        </Card>

        {/* Sign Out Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <p className="text-slate-400 text-sm">Ready to take a break?</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="button-sign-out"
            >
              <LogOut className="w-6 h-6" />
              Sign Out
            </Button>
            <p className="text-xs text-slate-500 text-center mt-3">
              {isGuestMode ? 'End guest session' : 'You can always sign back in'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}