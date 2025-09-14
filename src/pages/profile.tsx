import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { useTheme } from '../components/theme-provider'
import { useMeasurement } from '../contexts/MeasurementContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { User, Moon, Sun, LogOut, ChevronRight, Settings, Download, Trash2, HelpCircle, MessageCircle, FileText, Scale, Smartphone, Info, Globe, Languages, ChevronDown, Palette, Trophy } from 'lucide-react'
import { Link } from 'wouter'
import { useLocalization, SUPPORTED_LANGUAGES, SUPPORTED_COUNTRIES } from '../contexts/LocalizationContext'
import { getProfileDataLocally, ProfileData } from '../utils/guestStorage'
import { useToast } from '../hooks/use-toast'
import SemanticThemeEditor from '../components/SemanticThemeEditor'

export default function SettingsPage() {
  const { user, logout, isGuestMode } = useAuth()
  const { theme, setTheme } = useTheme()
  const { unit: measurementUnit, setUnit: setMeasurementUnit } = useMeasurement()
  const { language, country, setLanguage, setCountry } = useLocalization()
  const [profileData, setProfileData] = useState<ProfileData>({})
  const { toast } = useToast()
  
  // State for dropdown visibility - MUST be declared before any conditional logic
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // Load profile data including uploaded picture
  useEffect(() => {
    if (isGuestMode) {
      const existingProfile = getProfileDataLocally()
      setProfileData(existingProfile)
    }
  }, [isGuestMode])

  // Conditional rendering without early return to avoid hooks rule violation
  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Settings & Profile"
        description="Customize your fitness preferences, manage your account, and personalize your experience."
      />
    )
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    toast({
      title: "Theme Updated!",
      description: `Switched to ${newTheme} mode successfully.`,
    })
  }

  const handleMeasurementToggle = () => {
    const newUnit = measurementUnit === 'lbs' ? 'kg' : 'lbs'
    setMeasurementUnit(newUnit)
    toast({
      title: "Units Updated!",
      description: `Measurement units changed to ${newUnit.toUpperCase()} successfully.`,
    })
  }

  // Handlers for Language and Country
  const handleLanguageSelect = (langCode: string) => {
    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
    setLanguage(langCode)
    setShowLanguageDropdown(false)
    toast({
      title: "Language Updated!",
      description: `Language changed to ${selectedLang?.name || langCode} successfully.`,
    })
  }

  const handleCountrySelect = (countryCode: string) => {
    const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.code === countryCode)
    setCountry(countryCode)
    setShowCountryDropdown(false)
    toast({
      title: "Region Updated!",
      description: `Region changed to ${selectedCountry?.name || countryCode} successfully.`,
    })
  }

  // Helper functions to get display names
  const getLanguageDisplay = () => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === language)
    return lang ? `${lang.flag} ${lang.name}` : 'English'
  }

  const getCountryDisplay = () => {
    const country_ = SUPPORTED_COUNTRIES.find(c => c.code === country)
    return country_ ? `${country_.flag} ${country_.name}` : 'United States'
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

  // Settings list item component with vibrant card backgrounds
  const SettingsItem = ({ icon: Icon, title, subtitle, action, showToggle = false, toggleState = false, showChevron = true, testId, semanticColor = 'action' }: {
    icon: any
    title: string
    subtitle?: string
    action?: () => void
    showToggle?: boolean
    toggleState?: boolean
    showChevron?: boolean
    testId?: string
    semanticColor?: 'action' | 'wellness' | 'success' | 'warning' | 'activity'
  }) => (
    <div 
      className="flex items-center justify-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl backdrop-blur-sm"
      style={{
        background: `linear-gradient(to bottom right, rgba(var(--color-${semanticColor}-rgb), 0.6), rgba(var(--color-${semanticColor}-rgb), 0.7))`,
        borderColor: `rgba(var(--color-${semanticColor}-rgb), 0.5)`,
        borderWidth: '1px',
        boxShadow: `0 10px 15px -3px rgba(var(--color-${semanticColor}-rgb), 0.2), 0 4px 6px -2px rgba(var(--color-${semanticColor}-rgb), 0.05)`
      }}
      onClick={showToggle ? undefined : action}
      data-testid={testId}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
          <Icon className="w-5 h-5" style={{ color: 'white' }} />
        </div>
        <div>
          <p className="font-bold text-lg" style={{ color: 'white' }}>{title}</p>
          {subtitle && <p className="mt-1 font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{subtitle}</p>}
        </div>
      </div>
      
      {showToggle ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            action?.()
          }}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg ${
            toggleState ? 'bg-gradient-to-r from-white to-white/90 shadow-white/30' : 'bg-white/30'
          }`}
          data-testid={`${testId}-toggle`}
        >
          <span
            className="inline-block h-6 w-6 transform rounded-full shadow-lg transition-transform duration-300"
            style={{
              transform: toggleState ? 'translateX(1.75rem)' : 'translateX(0.25rem)',
              backgroundColor: toggleState ? `var(--color-${semanticColor})` : 'white'
            }}
          />
        </button>
      ) : showChevron ? (
        <div className="p-2 bg-white/20 rounded-lg shadow-lg backdrop-blur-sm">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      ) : null}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 space-y-8 pb-24">
        <div className="pt-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[var(--color-action)] to-[var(--color-action)]/80 rounded-2xl shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)]" data-testid="page-title">Settings</h1>
              <p className="text-[var(--color-text-secondary)] text-lg">Customize your experience</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[var(--color-action)]/15 via-[var(--color-action)]/10 to-[var(--color-action)]/15 rounded-2xl p-4 border border-[var(--color-action)]/20">
            <p className="text-[var(--color-text-secondary)] text-lg">Manage your profile and app preferences</p>
          </div>
        </div>
        
        {/* User Header */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border border-[var(--color-border)] shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-action)]/5 via-transparent to-[var(--color-action)]/5 pointer-events-none"></div>
          <CardContent className="p-8 relative">
            <div className="flex items-center gap-6">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-action)]/40 shadow-2xl" data-testid="user-avatar">
                  {(isGuestMode && profileData.profilePicture) || (!isGuestMode && user?.photoURL) ? (
                    <img 
                      src={isGuestMode ? profileData.profilePicture! : user!.photoURL!} 
                      alt={(isGuestMode ? profileData.displayName : user?.displayName) || 'User'} 
                      className="w-full h-full object-cover"
                      data-testid="user-avatar-image"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-action)] to-[var(--color-action)]/90 flex items-center justify-center text-white font-bold text-2xl shadow-inner" data-testid="user-avatar-initials">
                      {isGuestMode ? getInitials(profileData.displayName) || 'G' : getInitials(user?.displayName)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[var(--color-action)] to-[var(--color-action)]/90 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-3xl text-[var(--color-text-primary)] mb-2" data-testid="user-name">
                  {isGuestMode ? (profileData.displayName || 'Guest User') : user?.displayName}
                </h2>
                <p className="text-[var(--color-text-secondary)] font-medium text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--color-action)] rounded-full"></span>
                  {isGuestMode ? 'Guest Session' : `Member since ${getMemberSinceDate()}`}
                </p>
                {isGuestMode && profileData.email ? (
                  <p className="text-[var(--color-text-secondary)] mt-2 font-medium" data-testid="user-email">{profileData.email}</p>
                ) : (!isGuestMode && user?.email && (
                  <p className="text-[var(--color-text-secondary)] mt-2 font-medium" data-testid="user-email">{user.email}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-action)]/5 via-transparent to-[var(--color-action)]/5 pointer-events-none"></div>
          <CardHeader className="pb-6 bg-gradient-to-r from-[var(--color-action)]/10 to-[var(--color-action)]/5 relative">
            <CardTitle className="text-[var(--color-text-primary)] text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-[var(--color-action)] rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              Account Settings
            </CardTitle>
            <CardDescription className="text-[var(--color-text-secondary)] text-lg">
              Manage your profile and app preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/profile-edit">
              <div className="flex items-center justify-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl bg-gradient-to-br from-[var(--color-action)]/60 to-[var(--color-action)]/70 border border-[var(--color-action)]/50 backdrop-blur-sm shadow-[var(--color-action)]/20 hover:from-[var(--color-action)]/70 hover:to-[var(--color-action)]/80" data-testid="settings-profile">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">My Profile & Account</p>
                    <p className="text-white/90 mt-1 font-medium">View and edit your profile information</p>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg shadow-lg backdrop-blur-sm">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
            <SettingsItem
              icon={theme === 'dark' ? Moon : Sun}
              title="Dark Mode"
              subtitle={`Currently ${theme === 'dark' ? 'enabled' : 'disabled'}`}
              action={handleThemeToggle}
              showToggle={true}
              toggleState={theme === 'dark'}
              showChevron={false}
              testId="settings-dark-mode"
              semanticColor="activity"
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
              semanticColor="success"
            />
            
            {/* Semantic Theme Editor */}
            <div className="p-5 rounded-xl mx-3 bg-gradient-to-br from-[var(--color-action)]/5 to-[var(--color-action)]/10 border border-[var(--color-action)]/20" data-testid="settings-semantic-theme">
              <SemanticThemeEditor />
            </div>
            
            {/* Language Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center justify-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl bg-gradient-to-br from-[var(--color-warning)]/60 to-[var(--color-warning)]/70 border border-[var(--color-warning)]/50 backdrop-blur-sm shadow-[var(--color-warning)]/20 hover:from-[var(--color-warning)]/70 hover:to-[var(--color-warning)]/80"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                data-testid="settings-language"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                    <Languages className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Language</p>
                    <p className="text-white/90 mt-1 font-medium">{getLanguageDisplay()}</p>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg shadow-lg backdrop-blur-sm">
                  <ChevronDown className={`w-5 h-5 text-white transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              
              {showLanguageDropdown && (
                <div className="absolute top-full left-3 right-3 z-50 mt-2 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border border-[var(--color-action)]/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full text-left px-5 py-4 hover:bg-[var(--color-action)]/10 transition-all duration-200 flex items-center gap-4 border-b border-[var(--color-action)]/10 last:border-b-0 ${
                        language === lang.code ? 'bg-[var(--color-action)]/10 text-[var(--color-action)]' : 'text-[var(--color-text-primary)]'
                      }`}
                      data-testid={`language-option-${lang.code}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-bold text-lg">{lang.name}</span>
                      {language === lang.code && <span className="ml-auto text-[var(--color-action)] font-bold text-xl">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center justify-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl bg-gradient-to-br from-[var(--color-wellness)]/60 to-[var(--color-wellness)]/70 border border-[var(--color-wellness)]/50 backdrop-blur-sm shadow-[var(--color-wellness)]/20 hover:from-[var(--color-wellness)]/70 hover:to-[var(--color-wellness)]/80"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                data-testid="settings-country"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Country/Region</p>
                    <p className="text-white/90 mt-1 font-medium">{getCountryDisplay()}</p>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg shadow-lg backdrop-blur-sm">
                  <ChevronDown className={`w-5 h-5 text-white transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              
              {showCountryDropdown && (
                <div className="absolute top-full left-3 right-3 z-50 mt-2 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border border-[var(--color-wellness)]/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-64 overflow-y-auto">
                  {SUPPORTED_COUNTRIES.map((country_) => (
                    <button
                      key={country_.code}
                      onClick={() => handleCountrySelect(country_.code)}
                      className={`w-full text-left px-5 py-4 hover:bg-[var(--color-wellness)]/10 transition-all duration-200 flex items-center gap-4 border-b border-[var(--color-wellness)]/10 last:border-b-0 ${
                        country === country_.code ? 'bg-[var(--color-wellness)]/10 text-[var(--color-wellness)]' : 'text-[var(--color-text-primary)]'
                      }`}
                      data-testid={`country-option-${country_.code}`}
                    >
                      <span className="text-xl">{country_.flag}</span>
                      <span className="font-bold text-lg">{country_.name}</span>
                      {country === country_.code && <span className="ml-auto text-[var(--color-wellness)] font-bold text-xl">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border border-[var(--color-border)] shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-wellness)]/5 via-transparent to-[var(--color-wellness)]/5 pointer-events-none"></div>
          <CardHeader className="pb-6 bg-gradient-to-r from-[var(--color-wellness)]/10 to-[var(--color-wellness)]/5 relative">
            <CardTitle className="text-[var(--color-text-primary)] text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-[var(--color-wellness)] rounded-xl shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              Data Management
            </CardTitle>
            <CardDescription className="text-[var(--color-text-secondary)] text-lg">
              Manage your health data and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/year-in-review">
              <div 
                className="flex items-center justify-between p-5 hover:bg-[var(--color-wellness)]/10 transition-all duration-200 cursor-pointer rounded-xl mx-3 hover:shadow-lg border border-transparent hover:border-[var(--color-wellness)]/20"
                data-testid="link-year-in-review"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-success)]/20 to-[var(--color-success)]/10 rounded-xl shadow-md">
                    <Trophy className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] text-lg">Year in Review</p>
                    <p className="text-[var(--color-text-secondary)] mt-1 font-medium">See your fitness journey and achievements</p>
                  </div>
                </div>
                <div className="p-2 bg-[var(--color-success)]/20 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-[var(--color-success)]" />
                </div>
              </div>
            </Link>
            <Link href="/health-connections">
              <div 
                className="flex items-center justify-between p-5 hover:bg-[var(--color-wellness)]/10 transition-all duration-200 cursor-pointer rounded-xl mx-3 hover:shadow-lg border border-transparent hover:border-[var(--color-wellness)]/20"
                data-testid="link-health-connections"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-wellness)]/20 to-[var(--color-wellness)]/10 rounded-xl shadow-md">
                    <Smartphone className="w-5 h-5 text-[var(--color-wellness)]" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] text-lg">Health Data Connections</p>
                    <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Connect Google Health & Apple HealthKit</p>
                  </div>
                </div>
                <div className="p-2 bg-[var(--color-wellness)]/20 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-[var(--color-wellness)]" />
                </div>
              </div>
            </Link>
            <Link href="/data-export">
              <div className="flex items-center justify-between p-5 hover:bg-[var(--color-wellness)]/10 transition-all duration-200 cursor-pointer rounded-xl mx-3 hover:shadow-lg border border-transparent hover:border-[var(--color-wellness)]/20" data-testid="settings-export-data">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-wellness)]/20 to-[var(--color-wellness)]/10 rounded-xl shadow-md">
                    <Download className="w-5 h-5 text-[var(--color-wellness)]" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] text-lg">Export Data</p>
                    <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Download your fitness and nutrition data</p>
                  </div>
                </div>
                <div className="p-2 bg-[var(--color-wellness)]/20 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-[var(--color-wellness)]" />
                </div>
              </div>
            </Link>
            <Link href="/delete-account">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-delete-account">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <Trash2 className="w-5 h-5 text-[var(--color-warning)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Permanently remove your account and all data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-action)]" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/95 border-[var(--color-border)] shadow-2xl backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-nutrition)]/5 via-transparent to-[var(--color-nutrition)]/5 pointer-events-none"></div>
          <CardHeader className="pb-6 bg-gradient-to-r from-[var(--color-nutrition)]/10 to-[var(--color-nutrition)]/5 relative">
            <CardTitle className="text-[var(--color-text-primary)] text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-[var(--color-nutrition)] rounded-xl shadow-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              Support & Help
            </CardTitle>
            <CardDescription className="text-[var(--color-text-secondary)] text-lg">
              Get help and learn more about the app
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/mission">
              <div 
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
                data-testid="link-mission-model"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <Info className="w-5 h-5 text-[var(--color-action)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Our Mission & Model</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Learn about our commitment to free fitness tools</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-action)]" />
              </div>
            </Link>
            <Link href="/help-center">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-help-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <HelpCircle className="w-5 h-5 text-[var(--color-action)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Help Center</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Find answers to common questions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-action)]" />
              </div>
            </Link>
            <Link href="/contact-support">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-contact-support">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-[var(--color-action)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Contact Support</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Get in touch with our support team</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-action)]" />
              </div>
            </Link>
            <Link href="/privacy-terms">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-legal">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <FileText className="w-5 h-5 text-[var(--color-action)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Privacy & Terms</p>
                    <p className="text-sm text-muted-foreground mt-0.5">View our privacy policy and terms of service</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-action)]" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Sign Out Section */}
        <Card className="bg-card/60 border border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <p className="text-muted-foreground text-sm">Ready to take a break?</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-[var(--color-error)] to-[var(--color-error)] hover:from-[var(--color-error)]/90 hover:to-[var(--color-error)]/90 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-[var(--color-error)]/25 hover:shadow-[var(--color-error)]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="button-sign-out"
            >
              <LogOut className="w-6 h-6" />
              Sign Out
            </Button>
            <p className="text-xs text-[var(--color-text-secondary)] text-center mt-3">
              {isGuestMode ? 'End guest session' : 'You can always sign back in'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}