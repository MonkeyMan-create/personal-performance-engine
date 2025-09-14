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
import ColorThemeSelector from '../components/ColorThemeSelector'

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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-800 ${
            toggleState ? 'bg-gradient-to-r from-primary to-primary shadow-lg shadow-primary/25' : 'bg-slate-600'
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
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl" data-testid="user-avatar">
                {(isGuestMode && profileData.profilePicture) || (!isGuestMode && user?.photoURL) ? (
                  <img 
                    src={isGuestMode ? profileData.profilePicture! : user!.photoURL!} 
                    alt={(isGuestMode ? profileData.displayName : user?.displayName) || 'User'} 
                    className="w-full h-full object-cover"
                    data-testid="user-avatar-image"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-xl" data-testid="user-avatar-initials">
                    {isGuestMode ? getInitials(profileData.displayName) || 'G' : getInitials(user?.displayName)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-2xl text-white" data-testid="user-name">
                  {isGuestMode ? (profileData.displayName || 'Guest User') : user?.displayName}
                </h2>
                <p className="text-slate-300 font-medium">
                  {isGuestMode ? 'Guest Session' : `Member since ${getMemberSinceDate()}`}
                </p>
                {isGuestMode && profileData.email ? (
                  <p className="text-sm text-slate-400 mt-1" data-testid="user-email">{profileData.email}</p>
                ) : (!isGuestMode && user?.email && (
                  <p className="text-sm text-slate-400 mt-1" data-testid="user-email">{user.email}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-slate-300">
              Manage your profile and app preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <Link href="/profile-edit">
              <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-profile">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">My Profile & Account</p>
                    <p className="text-sm text-slate-400 mt-0.5">View and edit your profile information</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
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
            
            {/* Color Theme Selector */}
            <div className="p-4 rounded-lg mx-2" data-testid="settings-color-theme">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-slate-700/30 rounded-xl">
                  <Palette className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="font-semibold text-white">App Color Theme</p>
                  <p className="text-sm text-slate-400 mt-0.5">Choose your preferred accent color</p>
                </div>
              </div>
              <ColorThemeSelector />
            </div>
            
            {/* Language Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                data-testid="settings-language"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Languages className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Language</p>
                    <p className="text-sm text-slate-400 mt-0.5">{getLanguageDisplay()}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {showLanguageDropdown && (
                <div className="absolute top-full left-2 right-2 z-50 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-colors flex items-center gap-3 ${
                        language === lang.code ? 'bg-slate-700/30 text-primary' : 'text-white'
                      }`}
                      data-testid={`language-option-${lang.code}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {language === lang.code && <span className="ml-auto text-primary">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                data-testid="settings-country"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Globe className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Country/Region</p>
                    <p className="text-sm text-slate-400 mt-0.5">{getCountryDisplay()}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {showCountryDropdown && (
                <div className="absolute top-full left-2 right-2 z-50 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                  {SUPPORTED_COUNTRIES.map((country_) => (
                    <button
                      key={country_.code}
                      onClick={() => handleCountrySelect(country_.code)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-colors flex items-center gap-3 ${
                        country === country_.code ? 'bg-slate-700/30 text-primary' : 'text-white'
                      }`}
                      data-testid={`country-option-${country_.code}`}
                    >
                      <span className="text-lg">{country_.flag}</span>
                      <span className="font-medium">{country_.name}</span>
                      {country === country_.code && <span className="ml-auto text-primary">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <Link href="/year-in-review">
              <div 
                className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2"
                data-testid="link-year-in-review"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Trophy className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Year in Review</p>
                    <p className="text-sm text-slate-400 mt-0.5">See your fitness journey and achievements</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
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
            <Link href="/data-export">
              <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-export-data">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Download className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Export Data</p>
                    <p className="text-sm text-slate-400 mt-0.5">Download your fitness and nutrition data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
            <Link href="/delete-account">
              <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-delete-account">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <Trash2 className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Delete Account</p>
                    <p className="text-sm text-slate-400 mt-0.5">Permanently remove your account and all data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
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
            <Link href="/help-center">
              <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-help-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <HelpCircle className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Help Center</p>
                    <p className="text-sm text-slate-400 mt-0.5">Find answers to common questions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
            <Link href="/contact-support">
              <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-contact-support">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Contact Support</p>
                    <p className="text-sm text-slate-400 mt-0.5">Get in touch with our support team</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
            <Link href="/privacy-terms">
              <div className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer rounded-lg mx-2" data-testid="settings-legal">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/30 rounded-xl">
                    <FileText className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Privacy & Terms</p>
                    <p className="text-sm text-slate-400 mt-0.5">View our privacy policy and terms of service</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
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