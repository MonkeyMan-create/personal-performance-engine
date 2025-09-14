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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white" data-testid="page-title">Edit Profile</h1>
          <p className="text-slate-300 mt-2">Update your personal information and fitness goals</p>
        </div>

        {/* Profile Photo Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Profile Photo
            </CardTitle>
            <CardDescription className="text-slate-300">
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl relative" data-testid="current-avatar">
                {getCurrentProfilePicture() ? (
                  <img 
                    src={getCurrentProfilePicture()!} 
                    alt={profileData.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-3xl">
                    {isGuestMode ? 'G' : (profileData.displayName?.[0] || user?.displayName?.[0] || 'U')}
                  </div>
                )}
                {previewImage && (
                  <button
                    onClick={clearImagePreview}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
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
                  className="border-primary/50 text-primary hover:bg-primary/10"
                  data-testid="button-upload-photo"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {getCurrentProfilePicture() ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {getCurrentProfilePicture() && !previewImage && (
                  <Button 
                    variant="outline" 
                    onClick={() => setProfileData(prev => ({ ...prev, profilePicture: undefined }))}
                    className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                    data-testid="button-remove-photo"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-slate-500 text-center max-w-md">
                Upload a square image for best results. Maximum file size: 2MB. Supported formats: JPG, PNG, GIF.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-300">
              Update your basic profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display Name
                </label>
                <Input
                  value={profileData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Enter your display name"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-display-name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  type="email"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio (Optional)
                </label>
                <Input
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-bio"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Goals Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-green-400" />
              Personal Goals
            </CardTitle>
            <CardDescription className="text-slate-300">
              Set your fitness targets and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-green-400" />
                  Current Weight ({measurementUnit.toUpperCase()})
                </label>
                <Input
                  value={getDisplayValue(personalGoals.currentWeight, true)}
                  onChange={(e) => handleGoalChange('currentWeight', e.target.value)}
                  placeholder={`Enter your current weight in ${measurementUnit}`}
                  type="number"
                  step="0.1"
                  min="0"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-current-weight"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Target Weight ({measurementUnit.toUpperCase()})
                </label>
                <Input
                  value={getDisplayValue(personalGoals.targetWeight, true)}
                  onChange={(e) => handleGoalChange('targetWeight', e.target.value)}
                  placeholder={`Enter your target weight in ${measurementUnit}`}
                  type="number"
                  step="0.1"
                  min="0"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-target-weight"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  Daily Calorie Goal
                </label>
                <Input
                  value={getDisplayValue(personalGoals.dailyCalories)}
                  onChange={(e) => handleGoalChange('dailyCalories', e.target.value)}
                  placeholder="Enter your daily calorie target"
                  type="number"
                  min="0"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-daily-calories"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Weekly Workout Goal
                </label>
                <Input
                  value={getDisplayValue(personalGoals.weeklyWorkouts)}
                  onChange={(e) => handleGoalChange('weeklyWorkouts', e.target.value)}
                  placeholder="Enter weekly workout sessions"
                  type="number"
                  min="0"
                  max="14"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-weekly-workouts"
                />
              </div>
            </div>
            
            {/* Goal Progress Display */}
            {(personalGoals.currentWeight && personalGoals.targetWeight) && (
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  Weight Goal Progress
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Current: {formatWeight(personalGoals.currentWeight, 'lbs')}
                  </span>
                  <span className="text-slate-300">
                    Target: {formatWeight(personalGoals.targetWeight, 'lbs')}
                  </span>
                </div>
                <div className="mt-2 bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
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
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Personal Records
            </CardTitle>
            <CardDescription className="text-slate-300">
              Your best lifts and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {personalRecords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalRecords.map((pr, index) => (
                  <div 
                    key={`${pr.exerciseName}-${index}`}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                    data-testid={`pr-card-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white" data-testid={`pr-exercise-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}>
                          {pr.exerciseName}
                        </h4>
                        <p className="text-slate-300 text-sm" data-testid={`pr-weight-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}>
                          {formatWeight(pr.maxWeight, 'lbs')} × {pr.reps} rep{pr.reps !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-slate-500" data-testid={`pr-date-${pr.exerciseName.toLowerCase().replace(/\s+/g, '-')}`}>
                          {new Date(pr.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" data-testid="no-prs-message">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">No Personal Records Yet</h4>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Start logging your workouts to track your progress and see your personal bests for major exercises!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/80 text-white font-bold h-12 rounded-xl shadow-xl shadow-primary/25"
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
                  className="flex-1 sm:flex-none border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </Link>
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4">
              {isGuestMode ? 'Changes in Guest Mode are saved locally on this device' : 'Changes will be saved to your account'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}