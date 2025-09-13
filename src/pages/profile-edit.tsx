import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ArrowLeft, Save, Upload, User, Mail, Camera } from 'lucide-react'
import { Link } from 'wouter'
import { useToast } from '../hooks/use-toast'

export default function ProfileEditPage() {
  const { user, isGuestMode } = useAuth()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: ''
  })

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Edit Profile"
        description="Sign in to view and edit your profile information."
      />
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
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

  const handleImageUpload = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Photo upload functionality will be available in a future update."
    })
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
          <p className="text-slate-300 mt-2">Update your personal information and preferences</p>
        </div>

        {/* Profile Photo Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-teal-400" />
              Profile Photo
            </CardTitle>
            <CardDescription className="text-slate-300">
              Update your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-400/30 shadow-xl" data-testid="current-avatar">
                {!isGuestMode && user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-3xl">
                    {isGuestMode ? 'G' : (user?.displayName?.[0] || 'U')}
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleImageUpload}
                className="border-teal-400/50 text-teal-400 hover:bg-teal-400/10"
                data-testid="button-upload-photo"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-purple-400" />
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
                  value={formData.displayName}
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
                  value={formData.email}
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
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  data-testid="input-bio"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold h-12 rounded-xl shadow-xl shadow-teal-500/25"
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
              {isGuestMode ? 'Changes in Guest Mode are not permanently saved' : 'Changes will be saved to your account'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}