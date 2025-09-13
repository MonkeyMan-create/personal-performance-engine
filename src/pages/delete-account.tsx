import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ArrowLeft, Trash2, AlertTriangle, Shield, Download, XCircle, CheckCircle } from 'lucide-react'
import { Link } from 'wouter'
import { useToast } from '../hooks/use-toast'

export default function DeleteAccountPage() {
  const { user, isGuestMode, logout } = useAuth()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [hasConfirmedWarnings, setHasConfirmedWarnings] = useState(false)
  
  const confirmationPhrase = "DELETE MY ACCOUNT"
  const isConfirmationValid = confirmationText === confirmationPhrase

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Account Deletion"
        description="Sign in to manage your account deletion settings."
      />
    )
  }

  const handleDeleteAccount = async () => {
    if (!isConfirmationValid || !hasConfirmedWarnings) {
      toast({
        title: "Confirmation Required",
        description: "Please complete all confirmation steps before proceeding.",
        variant: "destructive"
      })
      return
    }

    setIsDeleting(true)
    
    try {
      // Simulate account deletion process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: "Account Deletion Initiated",
        description: "Your account will be permanently deleted within 24 hours. You have been logged out."
      })
      
      // Log out the user
      await logout()
      
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to process account deletion. Please try again or contact support.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
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
          <h1 className="text-3xl font-bold text-white" data-testid="page-title">Delete Account</h1>
          <p className="text-slate-300 mt-2">Permanently remove your account and all associated data</p>
        </div>

        {/* Critical Warning */}
        <Card className="bg-red-50/10 dark:bg-red-900/20 border-red-200/30 dark:border-red-800/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-200 text-xl mb-3">
                  ⚠️ PERMANENT ACTION WARNING
                </h3>
                <p className="text-red-300 mb-4">
                  Account deletion is <strong>IRREVERSIBLE</strong>. Once deleted, you will lose:
                </p>
                <ul className="space-y-2 text-red-300">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    All workout history and exercise logs
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Nutrition data and meal tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Progress photos and body measurements
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Custom workout templates and routines
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Achievement milestones and personal records
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Data First */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-400" />
              Export Your Data First
            </CardTitle>
            <CardDescription className="text-slate-300">
              We strongly recommend downloading your data before deletion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50/10 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-800/50">
              <p className="text-blue-200 text-sm">
                <strong>Pro Tip:</strong> Export your data to keep a personal backup of your fitness journey. 
                You can import this data into other fitness apps or keep it for your records.
              </p>
            </div>
            
            <Link href="/data-export">
              <Button 
                variant="outline" 
                className="w-full h-12 border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              Account Information
            </CardTitle>
            <CardDescription className="text-slate-300">
              Review the account that will be deleted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Account Type:</label>
                <p className="text-white font-medium">
                  {isGuestMode ? 'Guest Account' : 'Registered Account'}
                </p>
              </div>
              
              {!isGuestMode && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email:</label>
                    <p className="text-white font-medium" data-testid="account-email">
                      {user?.email || 'Not available'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Display Name:</label>
                    <p className="text-white font-medium" data-testid="account-name">
                      {user?.displayName || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Member Since:</label>
                    <p className="text-white font-medium">
                      {user?.metadata?.creationTime 
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : 'Recently'
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {isGuestMode && (
              <div className="p-4 bg-amber-50/10 dark:bg-amber-900/20 rounded-lg border border-amber-200/30 dark:border-amber-800/50">
                <p className="text-amber-200 text-sm">
                  <strong>Guest Mode:</strong> Your data is stored locally on this device. 
                  Clearing your browser data or switching devices will already remove this information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deletion Process */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-400" />
              Deletion Process
            </CardTitle>
            <CardDescription className="text-slate-300">
              Complete all steps to proceed with account deletion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Understand Consequences */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Step 1: Confirm Understanding</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConfirmedWarnings}
                  onChange={(e) => setHasConfirmedWarnings(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-500 rounded border-slate-600 focus:ring-red-500"
                  data-testid="checkbox-confirm-warnings"
                />
                <span className="text-slate-300 text-sm">
                  I understand that deleting my account is permanent and irreversible. 
                  All my data will be permanently lost and cannot be recovered.
                </span>
              </label>
            </div>

            {/* Step 2: Type Confirmation */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Step 2: Type Confirmation Phrase</h3>
              <p className="text-slate-400 text-sm">
                To confirm, type <strong className="text-red-400">"{confirmationPhrase}"</strong> in the box below:
              </p>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={confirmationPhrase}
                className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 ${
                  confirmationText && !isConfirmationValid ? 'border-red-500' : ''
                } ${isConfirmationValid ? 'border-green-500' : ''}`}
                data-testid="input-confirmation"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="text-red-400 text-sm">Confirmation phrase doesn't match</p>
              )}
              {isConfirmationValid && (
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Confirmation phrase correct
                </p>
              )}
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t border-slate-700">
              <Button
                onClick={handleDeleteAccount}
                disabled={!isConfirmationValid || !hasConfirmedWarnings || isDeleting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold h-14 rounded-xl shadow-xl shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-delete-account"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting Account...
                  </div>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    PERMANENTLY DELETE MY ACCOUNT
                  </>
                )}
              </Button>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                This action cannot be undone. Your account will be deleted within 24 hours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold">
              Consider These Alternatives
            </CardTitle>
            <CardDescription className="text-slate-300">
              Before deleting, you might want to try these options instead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <h3 className="font-semibold text-white mb-2">Take a Break</h3>
                <p className="text-slate-300 text-sm mb-3">
                  Simply stop using the app. Your data will remain safe if you want to return later.
                </p>
                <Button variant="outline" size="sm" className="w-full border-slate-500 text-slate-300">
                  Just Log Out
                </Button>
              </div>
              
              <Link href="/data-export">
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-600/30 transition-all">
                  <h3 className="font-semibold text-white mb-2">Export & Keep Data</h3>
                  <p className="text-slate-300 text-sm mb-3">
                    Download your data to keep your fitness journey history forever.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-blue-400/50 text-blue-400">
                    Export Data
                  </Button>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}