import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Smartphone, Heart, Activity, Moon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface HealthPlatform {
  id: string
  name: string
  platform: 'android' | 'ios'
  icon: typeof Smartphone
  description: string
  permissions: string[]
  connected: boolean
  available: boolean
}

interface PermissionStatus {
  granted: boolean
  denied: boolean
  requested: boolean
}

export default function HealthConnectionsPage() {
  const { user, isGuestMode } = useAuth()
  const [platforms, setPlatforms] = useState<HealthPlatform[]>([
    {
      id: 'google-health-connect',
      name: 'Google Health Connect',
      platform: 'android',
      icon: Smartphone,
      description: 'Connect to Google Health Connect to sync your Android health data',
      permissions: ['Sleep', 'Heart Rate', 'Steps'],
      connected: false,
      available: typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
    },
    {
      id: 'apple-healthkit',
      name: 'Apple HealthKit',
      platform: 'ios',
      icon: Heart,
      description: 'Connect to Apple HealthKit to sync your iOS health data',
      permissions: ['Sleep', 'Heart Rate', 'Steps'],
      connected: false,
      available: typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
    }
  ])

  const [permissionStatuses, setPermissionStatuses] = useState<Record<string, PermissionStatus>>({})
  const [isRequesting, setIsRequesting] = useState<string | null>(null)

  // Load connection status from localStorage (simulate persistence)
  useEffect(() => {
    const savedConnections = localStorage.getItem('health_connections')
    if (savedConnections) {
      try {
        const connections = JSON.parse(savedConnections)
        setPlatforms(prev => prev.map(platform => ({
          ...platform,
          connected: connections[platform.id] || false
        })))
      } catch (error) {
        console.error('Failed to load health connections:', error)
      }
    }
  }, [])

  // Simulate permission request flow
  const requestPermissions = async (platform: HealthPlatform) => {
    setIsRequesting(platform.id)
    
    try {
      // Simulate permission request delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate user response (for demo - 70% chance of approval)
      const userGranted = Math.random() > 0.3
      
      if (userGranted) {
        // Update platform connection status
        setPlatforms(prev => prev.map(p => 
          p.id === platform.id ? { ...p, connected: true } : p
        ))
        
        // Save to localStorage
        const currentConnections = JSON.parse(localStorage.getItem('health_connections') || '{}')
        currentConnections[platform.id] = true
        localStorage.setItem('health_connections', JSON.stringify(currentConnections))
        
        // Update permission status
        setPermissionStatuses(prev => ({
          ...prev,
          [platform.id]: { granted: true, denied: false, requested: true }
        }))
      } else {
        // User denied permission
        setPermissionStatuses(prev => ({
          ...prev,
          [platform.id]: { granted: false, denied: true, requested: true }
        }))
      }
    } catch (error) {
      console.error('Permission request failed:', error)
    } finally {
      setIsRequesting(null)
    }
  }

  const disconnectPlatform = (platform: HealthPlatform) => {
    // Update platform connection status
    setPlatforms(prev => prev.map(p => 
      p.id === platform.id ? { ...p, connected: false } : p
    ))
    
    // Remove from localStorage
    const currentConnections = JSON.parse(localStorage.getItem('health_connections') || '{}')
    delete currentConnections[platform.id]
    localStorage.setItem('health_connections', JSON.stringify(currentConnections))
    
    // Reset permission status
    setPermissionStatuses(prev => ({
      ...prev,
      [platform.id]: { granted: false, denied: false, requested: false }
    }))
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission.toLowerCase()) {
      case 'sleep': return Moon
      case 'heart rate': return Heart
      case 'steps': return Activity
      default: return Activity
    }
  }

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Connect Your Health Data"
        description="Sign in or continue as guest to manage your health platform connections and sync your fitness data securely."
      />
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Connect Your Health Data
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Sync your health data from your mobile devices to get personalized insights and track your wellness journey.
          </p>
        </div>

        {/* Technical Notice */}
        <Card className="bg-[var(--color-warning)]/20 border-[var(--color-warning)]/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[var(--color-warning)] mb-1">
                  Mobile Integration Required
                </h3>
                <p className="text-sm text-[var(--color-warning)]">
                  Health platform integrations require native mobile apps. This demo simulates the connection flow. 
                  In production, this would require React Native implementation or third-party health data aggregators.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Platforms */}
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => {
            const IconComponent = platform.icon
            const permissionStatus = permissionStatuses[platform.id]
            const isLoading = isRequesting === platform.id
            
            return (
              <Card 
                key={platform.id}
                className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--color-surface)]/80 rounded-lg">
                        <IconComponent className="w-6 h-6 text-[var(--color-text-secondary)]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[var(--color-text-primary)]">
                          {platform.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={platform.platform === 'android' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {platform.platform === 'android' ? 'Android' : 'iOS'}
                          </Badge>
                          {platform.connected ? (
                            <Badge variant="secondary" className="text-xs bg-[var(--color-success)]/20 text-[var(--color-success)]">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          ) : !platform.available ? (
                            <Badge variant="outline" className="text-xs text-[var(--color-text-secondary)]">
                              Not Available
                            </Badge>
                          ) : permissionStatus?.denied ? (
                            <Badge variant="destructive" className="text-xs">
                              <XCircle className="w-3 h-3 mr-1" />
                              Access Denied
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-[var(--color-text-secondary)]">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Permissions */}
                  <div>
                    <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Requested Permissions:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {platform.permissions.map((permission) => {
                        const PermissionIcon = getPermissionIcon(permission)
                        return (
                          <div 
                            key={permission}
                            className="flex items-center gap-1 px-2 py-1 bg-[var(--color-surface)]/60 rounded-md text-xs"
                          >
                            <PermissionIcon className="w-3 h-3" />
                            <span className="text-[var(--color-text-secondary)]">{permission}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Connection Actions */}
                  <div className="pt-2">
                    {platform.connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                          <CheckCircle className="w-4 h-4" />
                          Successfully connected and syncing health data
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => disconnectPlatform(platform)}
                          className="w-full border-[var(--color-error)]/50 text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                          data-testid={`button-disconnect-${platform.id}`}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => requestPermissions(platform)}
                          disabled={!platform.available || isLoading}
                          className="w-full bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-text)] border-2 border-[var(--color-action)]/50 hover:border-[var(--color-action)] disabled:opacity-50"
                          data-testid={`button-connect-${platform.id}`}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-[var(--color-action-text)] border-t-transparent rounded-full animate-spin" />
                              Requesting Permission...
                            </div>
                          ) : !platform.available ? (
                            `Requires ${platform.platform === 'android' ? 'Android' : 'iOS'} Device`
                          ) : (
                            `Connect to ${platform.name}`
                          )}
                        </Button>
                        
                        {permissionStatus?.denied && (
                          <Button
                            onClick={() => {
                              setPermissionStatuses(prev => ({
                                ...prev,
                                [platform.id]: { granted: false, denied: false, requested: false }
                              }))
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-[var(--color-warning)]/50 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10"
                            data-testid={`button-retry-${platform.id}`}
                          >
                            Try Again
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {permissionStatus?.denied && (
                      <p className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">
                        Permission was denied. You can try again or check your device settings.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Usage Info */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-primary)]">
              How We Use Your Health Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[var(--color-action)]/10 rounded-lg mx-auto flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[var(--color-action)]" />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)]">Personalized Insights</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Generate customized workout and nutrition recommendations based on your health metrics
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[var(--color-success)]/20 rounded-lg mx-auto flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[var(--color-success)]" />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)]">Health Monitoring</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Track trends in your heart rate, sleep quality, and activity levels over time
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[var(--color-action)]/10 rounded-lg mx-auto flex items-center justify-center">
                  <Moon className="w-6 h-6 text-[var(--color-action)]" />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)]">Recovery Optimization</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Use sleep and recovery data to optimize your training schedule and rest periods
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-secondary)] text-center">
                <strong>Privacy First:</strong> Your health data is encrypted and stored securely. We never share your personal health information with third parties.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}