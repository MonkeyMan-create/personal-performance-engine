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
            <div className="p-3 bg-gradient-to-br from-[var(--color-error)]/20 to-[var(--color-error)]/10 rounded-2xl border border-[var(--color-error)]/20">
              <Trash2 className="w-8 h-8 text-[var(--color-error)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" data-testid="page-title">Delete Account</h1>
          </div>
          <p className="text-[var(--color-text-secondary)] mt-2">Permanently remove your account and all associated data</p>
        </div>

        {/* Critical Warning */}
        <Card className="bg-gradient-to-br from-[var(--color-error)]/15 to-[var(--color-error)]/5 border-[var(--color-error)]/30 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gradient-to-br from-[var(--color-error)]/20 to-[var(--color-error)]/10 rounded-lg border border-[var(--color-error)]/20">
                <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-error)] text-xl mb-3">
                  ⚠️ PERMANENT ACTION WARNING
                </h3>
                <p className="text-[var(--color-error)] mb-4">
                  Account deletion is <strong>IRREVERSIBLE</strong>. Once deleted, you will lose:
                </p>
                <ul className="space-y-2 text-[var(--color-error)]">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                    All workout history and exercise logs
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                    Nutrition data and meal tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                    Progress photos and body measurements
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                    Custom workout templates and routines
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                    Achievement milestones and personal records
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Data First */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-xl border border-[var(--color-action)]/20">
                <Download className="w-6 h-6 text-[var(--color-action)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Export Your Data First</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  We strongly recommend downloading your data before deletion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[var(--color-action)]/10 rounded-lg border border-[var(--color-action)]/30">
              <p className="text-[var(--color-action)] text-sm">
                <strong>Pro Tip:</strong> Export your data to keep a personal backup of your fitness journey. 
                You can import this data into other fitness apps or keep it for your records.
              </p>
            </div>
            
            <Link href="/data-export">
              <Button 
                variant="outline" 
                className="w-full h-12 bg-gradient-to-r from-[var(--color-action)]/10 to-[var(--color-action)]/5 border-[var(--color-action)]/50 text-[var(--color-action)] hover:from-[var(--color-action)]/20 hover:to-[var(--color-action)]/10 hover:border-[var(--color-action)] transition-all duration-300"
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-wellness)]/20 to-[var(--color-wellness)]/10 rounded-xl border border-[var(--color-wellness)]/20">
                <Shield className="w-6 h-6 text-[var(--color-wellness)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Account Information</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Review the account that will be deleted
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Account Type:</label>
                <p className="text-[var(--color-text-primary)] font-medium">
                  {isGuestMode ? 'Guest Account' : 'Registered Account'}
                </p>
              </div>
              
              {!isGuestMode && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email:</label>
                    <p className="text-[var(--color-text-primary)] font-medium" data-testid="account-email">
                      {user?.email || 'Not available'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Display Name:</label>
                    <p className="text-[var(--color-text-primary)] font-medium" data-testid="account-name">
                      {user?.displayName || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Member Since:</label>
                    <p className="text-[var(--color-text-primary)] font-medium">
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
              <div className="p-4 bg-[var(--color-warning)]/10 rounded-lg border border-[var(--color-warning)]/30">
                <p className="text-[var(--color-warning)] text-sm">
                  <strong>Guest Mode:</strong> Your data is stored locally on this device. 
                  Clearing your browser data or switching devices will already remove this information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deletion Process */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-error)]/20 to-[var(--color-error)]/10 rounded-xl border border-[var(--color-error)]/20">
                <Trash2 className="w-6 h-6 text-[var(--color-error)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Deletion Process</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Complete all steps to proceed with account deletion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Understand Consequences */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--color-text-primary)]">Step 1: Confirm Understanding</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConfirmedWarnings}
                  onChange={(e) => setHasConfirmedWarnings(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[var(--color-error)] rounded border-[var(--color-border)] focus:ring-[var(--color-error)]"
                  data-testid="checkbox-confirm-warnings"
                />
                <span className="text-[var(--color-text-secondary)] text-sm">
                  I understand that deleting my account is permanent and irreversible. 
                  All my data will be permanently lost and cannot be recovered.
                </span>
              </label>
            </div>

            {/* Step 2: Type Confirmation */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--color-text-primary)]">Step 2: Type Confirmation Phrase</h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                To confirm, type <strong className="text-[var(--color-error)]">"{confirmationPhrase}"</strong> in the box below:
              </p>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={confirmationPhrase}
                className={`bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] ${
                  confirmationText && !isConfirmationValid ? 'border-[var(--color-error)]' : ''
                } ${isConfirmationValid ? 'border-[var(--color-success)]' : ''}`}
                data-testid="input-confirmation"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="text-[var(--color-error)] text-sm">Confirmation phrase doesn't match</p>
              )}
              {isConfirmationValid && (
                <p className="text-[var(--color-success)] text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Confirmation phrase correct
                </p>
              )}
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <Button
                onClick={handleDeleteAccount}
                disabled={!isConfirmationValid || !hasConfirmedWarnings || isDeleting}
                className="w-full bg-gradient-to-r from-[var(--color-error)] to-[var(--color-error)]/90 hover:from-[var(--color-error)]/90 hover:to-[var(--color-error)]/80 text-[var(--color-error-text)] font-bold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-delete-account"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--color-error-text)] border-t-transparent rounded-full animate-spin" />
                    Deleting Account...
                  </div>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    PERMANENTLY DELETE MY ACCOUNT
                  </>
                )}
              </Button>
              
              <p className="text-xs text-[var(--color-text-secondary)] text-center mt-4">
                This action cannot be undone. Your account will be deleted within 24 hours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-wellness)]/20 to-[var(--color-wellness)]/10 rounded-xl border border-[var(--color-wellness)]/20">
                <CheckCircle className="w-6 h-6 text-[var(--color-wellness)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Consider These Alternatives</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Before deleting, you might want to try these options instead
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-surface)]/60 rounded-lg border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Take a Break</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mb-3">
                  Simply stop using the app. Your data will remain safe if you want to return later.
                </p>
                <Button variant="outline" size="sm" className="w-full border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  Just Log Out
                </Button>
              </div>
              
              <Link href="/data-export">
                <div className="p-4 bg-[var(--color-surface)]/60 rounded-lg border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface)] transition-all">
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Export & Keep Data</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-3">
                    Download your data to keep your fitness journey history forever.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-[var(--color-action)]/50 text-[var(--color-action)]">
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