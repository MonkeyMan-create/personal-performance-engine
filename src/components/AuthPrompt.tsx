import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import HeartbeatIcon from './icons/HeartbeatIcon'
import GoogleIcon from './icons/GoogleIcon'
import UserIcon from './icons/UserIcon'

interface AuthPromptProps {
  title: string
  description: string
}

export default function AuthPrompt({ title, description }: AuthPromptProps) {
  const { signInWithGoogle, enterGuestMode } = useAuth()

  const handleGuestMode = () => {
    enterGuestMode()
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-6)',
        backgroundColor: 'var(--color-background)'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '28rem', // equivalent to max-w-md
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-8)'
        }}
      >
        {/* Branded Logo */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--spacing-8)'
          }}
        >
          <div 
            style={{
              position: 'relative'
            }}
          >
            <div 
              style={{
                width: 'calc(var(--spacing-20))', // 80px equivalent
                height: 'calc(var(--spacing-20))', // 80px equivalent
                background: `linear-gradient(135deg, rgba(var(--color-action-rgb), 0.8), var(--color-action))`,
                borderRadius: 'var(--radius-2xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 0 4px rgba(var(--color-action-rgb), 0.3)`
              }}
            >
              {/* Stylized heartbeat/pulse logo */}
              <HeartbeatIcon 
                style={{
                  width: 'calc(var(--spacing-10))', // 40px equivalent
                  height: 'calc(var(--spacing-10))', // 40px equivalent
                  color: 'var(--color-action-text)'
                }}
              />
            </div>
            {/* Glowing effect */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                width: 'calc(var(--spacing-20))',
                height: 'calc(var(--spacing-20))',
                background: `linear-gradient(135deg, rgba(var(--color-action-rgb), 0.8), var(--color-action))`,
                borderRadius: 'var(--radius-2xl)',
                filter: 'blur(12px)',
                opacity: 0.3,
                animation: 'pulse 2s infinite'
              }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <Card 
          style={{
            backgroundColor: 'rgba(var(--color-surface-rgb), 0.8)',
            border: `1px solid var(--color-border)`,
            boxShadow: 'var(--shadow-2xl)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <CardHeader 
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)',
              paddingBottom: 'var(--spacing-4)'
            }}
          >
            <CardTitle 
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: '-0.025em', // tracking-tight equivalent
                background: `linear-gradient(90deg, rgba(var(--color-action-rgb), 0.8), var(--color-action))`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                margin: 0
              }}
            >
              Personal Performance Engine
            </CardTitle>
            <CardDescription 
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)',
                maxWidth: '24rem', // max-w-sm equivalent
                margin: '0 auto',
                lineHeight: 'var(--line-height-relaxed)'
              }}
            >
              Track workouts, nutrition, and achieve your fitness goals with AI coaching
            </CardDescription>
          </CardHeader>
          
          <CardContent 
            style={{
              padding: `0 var(--spacing-8) var(--spacing-8)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-6)'
            }}
          >
            {/* Page-specific content */}
            <div 
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)'
              }}
            >
              <h2 
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  margin: 0
                }}
              >
                {title}
              </h2>
              <p 
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 'var(--line-height-relaxed)',
                  margin: 0
                }}
              >
                {description}
              </p>
            </div>

            {/* Auth buttons */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-4)'
              }}
            >
              {/* Google Sign In Button */}
              <Button 
                onClick={signInWithGoogle} 
                style={{
                  width: '100%',
                  height: 'calc(var(--spacing-12))', // 48px equivalent
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  backgroundColor: 'var(--color-surface-secondary)',
                  color: 'var(--color-text-primary)',
                  border: `2px solid rgba(var(--color-action-rgb), 0.5)`,
                  transition: 'all var(--duration-slow) var(--easing-ease-out)',
                  transform: 'scale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-base)'
                }}
                data-testid="button-google-signin"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-interactive-hover)'
                  e.currentTarget.style.borderColor = 'var(--color-action)'
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = `0 0 0 4px rgba(var(--color-action-rgb), 0.2)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)'
                  e.currentTarget.style.borderColor = 'rgba(var(--color-action-rgb), 0.5)'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)'
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
              >
                <GoogleIcon 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)'
                  }}
                />
                Sign in with Google
              </Button>

              {/* Separator */}
              <div 
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  margin: 'var(--spacing-2) 0'
                }}
              >
                <div 
                  style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--color-border-secondary)'
                  }}
                />
                <span 
                  style={{
                    padding: `0 var(--spacing-4)`,
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-tertiary)',
                    backgroundColor: 'var(--color-background)'
                  }}
                >
                  OR
                </span>
                <div 
                  style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--color-border-secondary)'
                  }}
                />
              </div>

              {/* Guest Mode Button */}
              <Button
                onClick={handleGuestMode}
                variant="outline"
                style={{
                  width: '100%',
                  height: 'calc(var(--spacing-12))', // 48px equivalent
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  backgroundColor: 'transparent',
                  border: `2px solid var(--color-border-secondary)`,
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--duration-slow) var(--easing-ease-out)',
                  transform: 'scale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-base)'
                }}
                data-testid="button-guest-mode"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-interactive-hover)'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--color-border-secondary)'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)'
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
              >
                <UserIcon 
                  style={{
                    width: 'var(--icon-size-md)',
                    height: 'var(--icon-size-md)'
                  }}
                />
                Continue as Guest
              </Button>

              {/* Guest mode info */}
              <p 
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-tertiary)',
                  textAlign: 'center',
                  lineHeight: 'var(--line-height-relaxed)',
                  margin: 0
                }}
              >
                Try the app without creating an account. Your data will be saved locally on this device.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}