import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useMeasurement } from '../contexts/MeasurementContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ArrowLeft, Save, Upload, User, Mail, Camera, Target, Zap, Award, TrendingUp, Calendar, Weight, Activity, Flame, FileImage, X, Trophy, Dumbbell, BarChart3 } from 'lucide-react'
import { Link } from 'wouter'
import { useToast } from '../hooks/use-toast'
import { 
  saveProfileDataLocally, 
  getProfileDataLocally, 
  savePersonalGoalsLocally, 
  getPersonalGoalsLocally,
  getMajorExercisePRs,
  calculatePersonalRecords,
  ProfileData,
  PersonalGoals,
  PersonalRecord
} from '../utils/guestStorage'

export default function ProfileEditPage() {
  const { user, isGuestMode } = useAuth()
  const { unit: measurementUnit, convertWeight, formatWeight } = useMeasurement()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [personalGoals, setPersonalGoals] = useState<PersonalGoals>({})
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // Load existing data on component mount
  useEffect(() => {
    if (isGuestMode) {
      const existingProfile = getProfileDataLocally()
      const existingGoals = getPersonalGoalsLocally()
      const prs = getMajorExercisePRs()
      
      setProfileData({
        displayName: existingProfile.displayName || user?.displayName || '',
        email: existingProfile.email || user?.email || '',
        bio: existingProfile.bio || '',
        profilePicture: existingProfile.profilePicture || ''
      })
      setPersonalGoals(existingGoals)
      setPersonalRecords(prs)
    } else {
      // For authenticated users, use Firebase data
      setProfileData({
        displayName: user?.displayName || '',
        email: user?.email || '',
        bio: '',
        profilePicture: user?.photoURL || ''
      })
      const existingGoals = getPersonalGoalsLocally()
      setPersonalGoals(existingGoals)
      const prs = getMajorExercisePRs()
      setPersonalRecords(prs)
    }
  }, [user, isGuestMode])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Edit Profile"
        description="Sign in to view and edit your profile information."
      />
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleGoalChange = (field: keyof PersonalGoals, value: string) => {
    const numericValue = value === '' ? undefined : Number(value)
    if (value !== '' && (isNaN(numericValue!) || numericValue! < 0)) return
    
    let finalValue = numericValue
    // Convert weight goals from display unit to storage unit (lbs)
    if (field === 'targetWeight' || field === 'currentWeight') {
      finalValue = numericValue && measurementUnit === 'kg' 
        ? convertWeight(numericValue, 'kg') // Convert kg to lbs for storage
        : numericValue
    }
    
    setPersonalGoals(prev => ({ ...prev, [field]: finalValue }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      })
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file.",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewImage(result)
      setProfileData(prev => ({ ...prev, profilePicture: result }))
    }
    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "Failed to read the image file. Please try again.",
        variant: "destructive"
      })
    }
    reader.readAsDataURL(file)
  }

  const clearImagePreview = () => {
    setPreviewImage(null)
    setProfileData(prev => ({ ...prev, profilePicture: prev.profilePicture }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (isGuestMode) {
        // Save profile data to localStorage
        saveProfileDataLocally(profileData)
        savePersonalGoalsLocally(personalGoals)
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully."
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentProfilePicture = () => {
    if (previewImage) return previewImage
    if (profileData.profilePicture) return profileData.profilePicture
    if (!isGuestMode && user?.photoURL) return user.photoURL
    return null
  }

  const getDisplayValue = (value: number | undefined, isWeight = false) => {
    if (value === undefined || value === null) return ''
    if (isWeight && measurementUnit === 'kg') {
      return convertWeight(value, 'lbs').toFixed(1)
    }
    return value.toString()
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-2xl border border-[var(--color-action)]/20">
              <User className="w-8 h-8 text-[var(--color-action)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" data-testid="page-title">Edit Profile</h1>
          </div>
          <p className="text-[var(--color-text-secondary)] mt-2">Update your personal information and fitness goals</p>
        </div>

        {/* Profile Photo Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-xl border border-[var(--color-action)]/20">
                <User className="w-6 h-6 text-[var(--color-action)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Profile Photo</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Upload a profile picture to personalize your account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-action)]/30 shadow-xl relative" data-testid="current-avatar">
                {getCurrentProfilePicture() ? (
                  <img 
                    src={getCurrentProfilePicture()!} 
                    alt={profileData.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-action)] to-[var(--color-action)]/80 flex items-center justify-center text-[var(--color-action-text)] font-bold text-3xl">
                    {isGuestMode ? 'G' : (profileData.displayName?.[0] || user?.displayName?.[0] || 'U')}
                  </div>
                )}
                {previewImage && (
                  <button
                    onClick={clearImagePreview}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--color-error)] hover:bg-[var(--color-error)]/80 rounded-full flex items-center justify-center text-[var(--color-error-text)] shadow-lg transition-colors"
                    data-testid="button-clear-preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-[var(--color-action)]/10 to-[var(--color-action)]/5 border-[var(--color-action)]/50 text-[var(--color-action)] hover:from-[var(--color-action)]/20 hover:to-[var(--color-action)]/10 hover:border-[var(--color-action)] transition-all duration-300"
                  data-testid="button-upload-photo"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {getCurrentProfilePicture() ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {getCurrentProfilePicture() && !previewImage && (
                  <Button 
                    variant="outline" 
                    onClick={() => setProfileData(prev => ({ ...prev, profilePicture: undefined }))}
                    className="bg-gradient-to-r from-[var(--color-error)]/10 to-[var(--color-error)]/5 border-[var(--color-error)]/50 text-[var(--color-error)] hover:from-[var(--color-error)]/20 hover:to-[var(--color-error)]/10 hover:border-[var(--color-error)] transition-all duration-300"
                    data-testid="button-remove-photo"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] text-center max-w-md">
                Upload a square image for best results. Maximum file size: 2MB. Supported formats: JPG, PNG, GIF.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-activity)]/20 to-[var(--color-activity)]/10 rounded-xl border border-[var(--color-activity)]/20">
                <Mail className="w-6 h-6 text-[var(--color-activity)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Personal Information</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Update your basic profile information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Display Name
                </label>
                <Input
                  value={profileData.displayName || ''}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Enter your display name"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-display-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Email Address
                </label>
                <Input
                  value={profileData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  type="email"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Bio (Optional)
                </label>
                <Input
                  value={profileData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-bio"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Goals Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-wellness)]/20 to-[var(--color-wellness)]/10 rounded-xl border border-[var(--color-wellness)]/20">
                <Target className="w-6 h-6 text-[var(--color-wellness)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Personal Goals</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Set your fitness targets and track your progress
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-[var(--color-wellness)]" />
                  Current Weight ({measurementUnit.toUpperCase()})
                </label>
                <Input
                  value={getDisplayValue(personalGoals.currentWeight, true)}
                  onChange={(e) => handleGoalChange('currentWeight', e.target.value)}
                  placeholder={`Enter your current weight in ${measurementUnit}`}
                  type="number"
                  step="0.1"
                  min="0"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-current-weight"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--color-wellness)]" />
                  Target Weight ({measurementUnit.toUpperCase()})
                </label>
                <Input
                  value={getDisplayValue(personalGoals.targetWeight, true)}
                  onChange={(e) => handleGoalChange('targetWeight', e.target.value)}
                  placeholder={`Enter your target weight in ${measurementUnit}`}
                  type="number"
                  step="0.1"
                  min="0"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-target-weight"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[var(--color-nutrition)]" />
                  Daily Calorie Goal
                </label>
                <Input
                  value={getDisplayValue(personalGoals.dailyCalories)}
                  onChange={(e) => handleGoalChange('dailyCalories', e.target.value)}
                  placeholder="Enter your daily calorie target"
                  type="number"
                  min="0"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-daily-calories"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-activity)]" />
                  Weekly Workout Goal
                </label>
                <Input
                  value={getDisplayValue(personalGoals.weeklyWorkouts)}
                  onChange={(e) => handleGoalChange('weeklyWorkouts', e.target.value)}
                  placeholder="Enter weekly workout sessions"
                  type="number"
                  min="0"
                  max="14"
                  className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
                  data-testid="input-weekly-workouts"
                />
              </div>
            </div>
            
            {/* Goal Progress Display */}
            {(personalGoals.currentWeight && personalGoals.targetWeight) && (
              <div className="mt-6 p-4 bg-gradient-to-br from-[var(--color-wellness)]/10 to-[var(--color-wellness)]/5 rounded-lg border border-[var(--color-wellness)]/20">
                <h4 className="text-[var(--color-text-primary)] font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[var(--color-wellness)]" />
                  Weight Goal Progress
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Current: {formatWeight(personalGoals.currentWeight, 'lbs')}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    Target: {formatWeight(personalGoals.targetWeight, 'lbs')}
                  </span>
                </div>
                <div className="mt-2 bg-[var(--color-surface)] rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-wellness)] to-[var(--color-wellness)]/80 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, Math.abs((personalGoals.targetWeight - personalGoals.currentWeight) / personalGoals.targetWeight) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Records Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-success)]/20 to-[var(--color-success)]/10 rounded-xl border border-[var(--color-success)]/20">
                <Award className="w-6 h-6 text-[var(--color-success)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Personal Records</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Your best lifts and achievements
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {personalRecords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalRecords.map((pr, index) => (
                  <div 
                    key={`${pr.exerciseName}-${index}`}
                    className="p-4 bg-gradient-to-br from-[var(--color-surface)]/60 to-[var(--color-surface)]/40 rounded-lg border border-[var(--color-border)] hover:from-[var(--color-surface)]/80 hover:to-[var(--color-surface)]/60 transition-all duration-300"
                    data-testid={`pr-card-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success)]/80 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[var(--color-success-text)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--color-text-primary)]" data-testid={`pr-exercise-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}>
                          {pr.exerciseName}
                        </h4>
                        <p className="text-[var(--color-text-secondary)] text-sm" data-testid={`pr-weight-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}>
                          {formatWeight(pr.maxWeight, 'lbs')} × {pr.reps} rep{pr.reps !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]" data-testid={`pr-date-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}>
                          {new Date(pr.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" data-testid="no-prs-message">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-surface)]/80 to-[var(--color-surface)]/60 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border)]">
                  <Dumbbell className="w-8 h-8 text-[var(--color-text-secondary)]" />
                </div>
                <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">No Personal Records Yet</h4>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-md mx-auto">
                  Start logging your workouts to track your progress and see your personal bests for major exercises!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Section */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[var(--color-action)] to-[var(--color-action)]/90 hover:from-[var(--color-action)]/90 hover:to-[var(--color-action)]/80 text-[var(--color-action-text)] font-bold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-save-profile"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none bg-gradient-to-r from-[var(--color-surface)]/50 to-[var(--color-surface)]/30 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:from-[var(--color-surface)]/70 hover:to-[var(--color-surface)]/50 hover:text-[var(--color-text-primary)] transition-all duration-300"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </Link>
            </div>
            
            <p className="text-xs text-[var(--color-text-secondary)] text-center mt-4">
              {isGuestMode ? 'Changes in Guest Mode are saved locally on this device' : 'Changes will be saved to your account'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}