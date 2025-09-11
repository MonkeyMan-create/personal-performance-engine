import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { useTheme } from '../components/theme-provider'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { User, Moon, Sun, LogOut, ChevronRight, Settings, Download, Trash2, HelpCircle, MessageCircle, FileText, Scale, Smartphone } from 'lucide-react'
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
      className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
      onClick={showToggle ? undefined : action}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{title}</p>
          {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      
      {showToggle ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            action?.()
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
            toggleState ? 'bg-cyan-500' : 'bg-slate-400/30 dark:bg-slate-600/50'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              toggleState ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ) : showChevron ? (
        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      ) : null}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <h1 className="text-2xl font-bold pt-4 text-slate-900 dark:text-white">Settings</h1>
        
        {/* User Header */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/30">
                {!isGuestMode && user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                    {isGuestMode ? 'G' : getInitials(user?.displayName)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-lg text-slate-900 dark:text-white">
                  {isGuestMode ? 'Guest User' : user?.displayName}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isGuestMode ? 'Guest Session' : `Member since ${getMemberSinceDate()}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Section */}
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Account Settings</CardTitle>
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
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Data Management</CardTitle>
          </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <Link href="/health-connections">
              <div className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Health Data Connections</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Connect Google Health & Apple HealthKit</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
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
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Support</CardTitle>
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
        <Card className="bg-white/70 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full flex items-center gap-2 h-12 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}