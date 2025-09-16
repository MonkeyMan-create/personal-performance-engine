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

  // Settings list item component with vibrant card backgrounds and perfect alignment
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
      className={`flex items-center justify-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl card-${semanticColor} min-h-[76px]`}
      onClick={showToggle ? undefined : action}
      data-testid={testId}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="icon-badge bg-white rounded-xl flex items-center justify-center p-3 flex-shrink-0">
          <Icon className="w-5 h-5" style={{ color: `var(--color-${semanticColor})` }} />
        </div>
        <div className="flex flex-col justify-center py-1 min-w-0 flex-1">
          <p className="font-bold text-lg leading-tight" style={{ color: `var(--color-text-on-${semanticColor})` }}>{title}</p>
          {subtitle && <p className="font-medium text-sm leading-relaxed mt-1" style={{ color: `var(--color-text-secondary-on-${semanticColor})` }}>{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center justify-center flex-shrink-0 ml-4">
        {showToggle ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              action?.()
            }}
            className={`relative inline-flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg ${
              toggleState ? 'bg-gradient-to-r from-white to-white/90 shadow-white/30' : 'bg-white/30'
            }`}
            data-testid={`${testId}-toggle`}
          >
            <span
              className="inline-block h-6 w-6 transform rounded-full shadow-lg transition-transform duration-300"
              style={{
                transform: toggleState ? 'translateX(1.75rem)' : 'translateX(0.25rem)',
                background: toggleState ? 'currentColor' : 'white'
              }}
            />
          </button>
        ) : showChevron ? (
          <div className="icon-badge icon-badge-sm bg-white rounded-lg flex items-center justify-center p-2">
            <ChevronRight className="w-5 h-5" style={{ color: `var(--color-${semanticColor})` }} />
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="section-container space-y-8">
        <div className="page-header space-y-6">
          <div className="flex-center gap-6">
            <div className="icon-badge icon-badge-action icon-badge-2xl shadow-2xl">
              <Settings className="w-10 h-10" style={{ color: 'var(--color-text-on-action)' }} />
            </div>
            <div className="text-center space-y-2">
              <h1 className="page-title text-4xl" data-testid="page-title">Settings & Profile</h1>
              <p className="text-secondary text-xl font-medium">Customize your fitness experience</p>
            </div>
          </div>
          <div className="card-insight text-center">
            <p className="text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Manage your profile, customize app preferences, and control your fitness data
            </p>
          </div>
        </div>
        
        {/* User Header */}
        <Card className="card-action border-action/30 shadow-2xl">
          <CardContent className="card-content p-10">
            <div className="flex-start gap-8">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm" data-testid="user-avatar">
                  {(isGuestMode && profileData.profilePicture) || (!isGuestMode && user?.photoURL) ? (
                    <img 
                      src={isGuestMode ? profileData.profilePicture! : user!.photoURL!} 
                      alt={(isGuestMode ? profileData.displayName : user?.displayName) || 'User'} 
                      className="w-full h-full object-cover"
                      data-testid="user-avatar-image"
                    />
                  ) : (
                    <div className="w-full h-full bg-action flex-center font-bold text-2xl" style={{ color: 'var(--color-text-on-action)' }} data-testid="user-avatar-initials">
                      {isGuestMode ? getInitials(profileData.displayName) || 'G' : getInitials(user?.displayName)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 icon-badge icon-badge-lg bg-white/20 backdrop-blur-sm rounded-full flex-center shadow-xl">
                  <User className="w-5 h-5" style={{ color: 'var(--color-text-on-action)' }} />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-black text-4xl mb-3 drop-shadow-lg" style={{ color: 'var(--color-text-on-action)' }} data-testid="user-name">
                  {isGuestMode ? (profileData.displayName || 'Guest User') : user?.displayName}
                </h2>
                <p className="font-bold text-xl flex-start gap-3 mb-2" style={{ color: 'var(--color-text-secondary-on-action)' }}>
                  <span className="w-3 h-3 bg-white rounded-full shadow-lg"></span>
                  {isGuestMode ? 'Guest Session' : `Member since ${getMemberSinceDate()}`}
                </p>
                {isGuestMode && profileData.email ? (
                  <p className="mt-3 font-medium text-lg" style={{ color: 'var(--color-text-secondary-on-action)' }} data-testid="user-email">{profileData.email}</p>
                ) : (!isGuestMode && user?.email && (
                  <p className="mt-3 font-medium text-lg" style={{ color: 'var(--color-text-secondary-on-action)' }} data-testid="user-email">{user.email}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Section */}
        <Card className="card-wellness border-wellness/30 shadow-2xl">
          <CardHeader className="card-header bg-gradient-to-r from-wellness/20 to-action/10 rounded-t-xl">
            <div className="flex-start gap-4">
              <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl">
                <Settings className="w-8 h-8" style={{ color: 'var(--color-text-on-wellness)' }} />
              </div>
              <div className="space-y-2">
                <CardTitle className="card-title text-3xl font-black drop-shadow-lg" style={{ color: 'var(--color-text-on-wellness)' }}>
                  Account Settings
                </CardTitle>
                <CardDescription className="card-description text-lg font-medium" style={{ color: 'var(--color-text-secondary-on-wellness)' }}>
                  Manage your profile and app preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/profile-edit">
              <div className="action-item card-action" data-testid="settings-profile">
                <div className="flex-start gap-4">
                  <div className="icon-badge bg-white rounded-xl">
                    <User className="w-5 h-5 text-action" />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: 'var(--color-text-on-action)' }}>My Profile & Account</p>
                    <p className="mt-1 font-medium" style={{ color: 'var(--color-text-secondary-on-action)' }}>View and edit your profile information</p>
                  </div>
                </div>
                <div className="icon-badge bg-white rounded-lg">
                  <ChevronRight className="w-5 h-5 text-action" />
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
            <div className="action-item" data-testid="settings-semantic-theme">
              <SemanticThemeEditor />
            </div>
            
            {/* Language Dropdown */}
            <div className="relative">
              <div 
                className="flex-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl card-warning"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                data-testid="settings-language"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                    <Languages className="w-5 h-5" style={{ color: 'var(--color-text-on-warning)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: 'var(--color-text-on-warning)' }}>Language</p>
                    <p className="mt-1 font-medium" style={{ color: 'var(--color-text-secondary-on-warning)' }}>{getLanguageDisplay()}</p>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg shadow-lg backdrop-blur-sm">
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-on-warning)' }} />
                </div>
              </div>
              
              {showLanguageDropdown && (
                <div className="absolute top-full left-3 right-3 z-50 mt-2 card-glass rounded-xl shadow-2xl overflow-hidden">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full text-left px-5 py-4 hover:bg-action/10 transition-all duration-200 flex-start gap-4 border-b border-primary last:border-b-0 ${
                        language === lang.code ? 'bg-action/10 text-action' : 'text-primary'
                      }`}
                      data-testid={`language-option-${lang.code}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-bold text-lg">{lang.name}</span>
                      {language === lang.code && <span className="ml-auto text-action font-bold text-xl">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <div 
                className="flex-between p-5 transition-all duration-300 cursor-pointer rounded-xl mx-3 shadow-lg hover:shadow-xl card-wellness"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                data-testid="settings-country"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                    <Globe className="w-5 h-5" style={{ color: 'var(--color-text-on-wellness)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: 'var(--color-text-on-wellness)' }}>Country/Region</p>
                    <p className="mt-1 font-medium" style={{ color: 'var(--color-text-secondary-on-wellness)' }}>{getCountryDisplay()}</p>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg shadow-lg backdrop-blur-sm">
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-on-wellness)' }} />
                </div>
              </div>
              
              {showCountryDropdown && (
                <div className="absolute top-full left-3 right-3 z-50 mt-2 card-glass rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                  {SUPPORTED_COUNTRIES.map((country_) => (
                    <button
                      key={country_.code}
                      onClick={() => handleCountrySelect(country_.code)}
                      className={`w-full text-left px-5 py-4 hover:bg-wellness/10 transition-all duration-200 flex-start gap-4 border-b border-primary last:border-b-0 ${
                        country === country_.code ? 'bg-wellness/10 text-wellness' : 'text-primary'
                      }`}
                      data-testid={`country-option-${country_.code}`}
                    >
                      <span className="text-xl">{country_.flag}</span>
                      <span className="font-bold text-lg">{country_.name}</span>
                      {country === country_.code && <span className="ml-auto text-wellness font-bold text-xl">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card className="card-activity border-activity/30 shadow-2xl">
          <CardHeader className="card-header bg-gradient-to-r from-activity/20 to-nutrition/10 rounded-t-xl">
            <div className="flex-start gap-4">
              <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl">
                <Download className="w-8 h-8" style={{ color: 'var(--color-text-on-activity)' }} />
              </div>
              <div className="space-y-2">
                <CardTitle className="card-title text-3xl font-black drop-shadow-lg" style={{ color: 'var(--color-text-on-activity)' }}>
                  Data Management
                </CardTitle>
                <CardDescription className="card-description text-lg font-medium" style={{ color: 'var(--color-text-secondary-on-activity)' }}>
                  Manage your health data and account information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/year-in-review">
              <div 
                className="action-item card-success border-2 border-white/20 interactive-enhanced shadow-xl"
                data-testid="link-year-in-review"
              >
                <div className="flex-start gap-5">
                  <div className="icon-badge icon-badge-xl bg-white/25 backdrop-blur-sm rounded-2xl shadow-xl">
                    <Trophy className="w-8 h-8" style={{ color: 'var(--color-text-on-success)' }} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl drop-shadow-lg" style={{ color: 'var(--color-text-on-success)' }}>Year in Review</p>
                    <p className="font-medium text-base leading-relaxed" style={{ color: 'var(--color-text-secondary-on-success)' }}>See your fitness journey and achievements</p>
                  </div>
                </div>
                <div className="icon-badge bg-white/25 backdrop-blur-sm rounded-xl shadow-lg">
                  <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-text-on-success)' }} />
                </div>
              </div>
            </Link>
            <Link href="/health-connections">
              <div 
                className="action-item card-wellness border-2 border-white/20 interactive-enhanced shadow-xl"
                data-testid="link-health-connections"
              >
                <div className="flex-start gap-5">
                  <div className="icon-badge icon-badge-xl bg-white/25 backdrop-blur-sm rounded-2xl shadow-xl">
                    <Smartphone className="w-8 h-8" style={{ color: 'var(--color-text-on-wellness)' }} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl drop-shadow-lg" style={{ color: 'var(--color-text-on-wellness)' }}>Health Data Connections</p>
                    <p className="font-medium text-base leading-relaxed" style={{ color: 'var(--color-text-secondary-on-wellness)' }}>Connect Google Health & Apple HealthKit</p>
                  </div>
                </div>
                <div className="icon-badge bg-white/25 backdrop-blur-sm rounded-xl shadow-lg">
                  <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-text-on-success)' }} />
                </div>
              </div>
            </Link>
            <Link href="/data-export">
              <div className="action-item card-action border-2 border-white/20 interactive-enhanced shadow-xl" data-testid="settings-export-data">
                <div className="flex-start gap-5">
                  <div className="icon-badge icon-badge-xl bg-white/25 backdrop-blur-sm rounded-2xl shadow-xl">
                    <Download className="w-8 h-8" style={{ color: 'var(--color-text-on-action)' }} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-xl drop-shadow-lg" style={{ color: 'var(--color-text-on-action)' }}>Export Data</p>
                    <p className="font-medium text-base leading-relaxed" style={{ color: 'var(--color-text-secondary-on-action)' }}>Download your fitness and nutrition data</p>
                  </div>
                </div>
                <div className="icon-badge bg-white/25 backdrop-blur-sm rounded-xl shadow-lg">
                  <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-text-on-success)' }} />
                </div>
              </div>
            </Link>
            <Link href="/delete-account">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-delete-account">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <Trash2 className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Permanently remove your account and all data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-action" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="card-glass relative">
          <div className="absolute inset-0 bg-nutrition/5 pointer-events-none"></div>
          <CardHeader className="pb-6 bg-nutrition/10 relative">
            <CardTitle className="text-primary text-2xl font-bold flex-start gap-3">
              <div className="icon-badge bg-nutrition rounded-xl shadow-lg">
                <HelpCircle className="w-6 h-6" style={{ color: 'var(--color-text-on-nutrition)' }} />
              </div>
              Support & Help
            </CardTitle>
            <CardDescription className="text-secondary text-lg">
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
                    <Info className="w-5 h-5 text-action" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Our Mission & Model</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Learn about our commitment to free fitness tools</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-action" />
              </div>
            </Link>
            <Link href="/help-center">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-help-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted/30 rounded-xl">
                    <HelpCircle className="w-5 h-5 text-action" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Help Center</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Find answers to common questions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-action" />
              </div>
            </Link>
            <Link href="/contact-support">
              <div className="action-item card-wellness border-2 border-white/20 interactive-enhanced shadow-xl" data-testid="settings-contact-support">
                <div className="flex-start gap-5">
                  <div className="icon-badge icon-badge-xl bg-white/25 backdrop-blur-sm rounded-2xl shadow-xl">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-white text-xl drop-shadow-lg">Contact Support</p>
                    <p className="text-white/90 font-medium text-base leading-relaxed">Get in touch with our support team</p>
                  </div>
                </div>
                <div className="icon-badge bg-white/25 backdrop-blur-sm rounded-xl shadow-lg">
                  <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-text-on-success)' }} />
                </div>
              </div>
            </Link>
            <Link href="/privacy-terms">
              <div className="action-item card-action border-2 border-white/20 interactive-enhanced shadow-xl" data-testid="settings-legal">
                <div className="flex-start gap-5">
                  <div className="icon-badge icon-badge-xl bg-white/25 backdrop-blur-sm rounded-2xl shadow-xl">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-white text-xl drop-shadow-lg">Privacy & Terms</p>
                    <p className="text-white/90 font-medium text-base leading-relaxed">View our privacy policy and terms of service</p>
                  </div>
                </div>
                <div className="icon-badge bg-white/25 backdrop-blur-sm rounded-xl shadow-lg">
                  <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-text-on-success)' }} />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Sign Out Section */}
        <Card className="card-error border-error/30 shadow-2xl">
          <CardContent className="card-content p-8">
            <div className="text-center mb-6">
              <div className="icon-badge icon-badge-xl bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl mx-auto mb-4">
                <LogOut className="w-8 h-8" style={{ color: 'var(--color-text-on-action)' }} />
              </div>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-secondary-on-action)' }}>Ready to take a break?</p>
              <p className="text-base" style={{ color: 'var(--color-text-secondary-on-action)' }}>{isGuestMode ? 'End your guest session' : 'You can always sign back in anytime'}</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full flex-center gap-4 h-16 bg-white/20 backdrop-blur-sm text-white font-black text-xl rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/30 active:scale-[0.98] border-2 border-white/30"
              data-testid="button-sign-out"
            >
              <LogOut className="w-7 h-7" />
              {isGuestMode ? 'End Session' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}