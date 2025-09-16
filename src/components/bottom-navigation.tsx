import React from 'react'
import { useLocation } from 'wouter'
import { Home, Dumbbell, Apple, TrendingUp, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home', testId: 'nav-home', semanticColor: 'action' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts', testId: 'nav-workouts', semanticColor: 'activity' },
  { href: '/nutrition', icon: Apple, label: 'Nutrition', testId: 'nav-nutrition', semanticColor: 'nutrition' },
  { href: '/progress', icon: TrendingUp, label: 'Progress', testId: 'nav-progress', semanticColor: 'action' },
  { href: '/profile', icon: User, label: 'Profile', testId: 'nav-profile', semanticColor: 'wellness' },
]

export default function BottomNavigation() {
  const [location, setLocation] = useLocation()

  // Custom navigation handler with precise routing logic
  const handleNavigation = (href: string, event: React.MouseEvent) => {
    event.preventDefault()
    
    // Define base route and main pages
    const BASE_ROUTE = '/'
    const MAIN_PAGES = ['/workouts', '/nutrition', '/progress', '/profile']
    
    const isCurrentlyOnBase = location === BASE_ROUTE
    const isCurrentlyOnMainPage = MAIN_PAGES.includes(location)
    const isNavigatingToMainPage = MAIN_PAGES.includes(href)
    
    // Rule 1: FROM Dashboard TO main page = NEW history entry (pushState)
    if (isCurrentlyOnBase && isNavigatingToMainPage) {
      setLocation(href) // Creates new history entry
    }
    // Rule 2: BETWEEN main pages = REPLACE current history entry (replaceState)
    else if (isCurrentlyOnMainPage && isNavigatingToMainPage) {
      window.history.replaceState(null, '', href)
      // Force wouter to recognize the URL change without adding to history
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    // Rule 3: All other navigation (including back to Dashboard) = normal navigation
    else {
      setLocation(href) // Uses normal pushState behavior
    }
  }

  return (
    <nav 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--gradient-glass)',
        borderTop: `1px solid var(--border-glass)`,
        zIndex: 'var(--z-index-fixed)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-navigation)',
        transition: 'all var(--duration-slow) var(--easing-ease-out)'
      }}
      data-testid="nav-bottom"
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0,
          maxWidth: '480px',
          margin: '0 auto',
          padding: `var(--spacing-2) var(--spacing-4)`
        }}
      >
        {navItems.map(({ href, icon: Icon, label, testId, semanticColor }) => {
          // Define route groupings for proper active state management
          const homeRelatedRoutes = ['/', '/meditate']
          const profileRelatedRoutes = [
            '/profile', '/help-center', '/mission-model', '/health-connections', 
            '/privacy-terms', '/data-export', '/contact-support', '/delete-account', 
            '/year-in-review', '/profile-edit'
          ]
          
          // Check if current route should show this nav item as active
          const isActive = href === '/' 
            ? homeRelatedRoutes.includes(location)
            : href === '/profile' 
            ? profileRelatedRoutes.includes(location)
            : location === href
          
          // Get semantic color variables
          const getSemanticColor = (color: string) => `var(--color-${color})`
          const getSemanticColorRgb = (color: string) => `var(--color-${color}-rgb)`
          const getSemanticShadow = (color: string) => `var(--shadow-${color})`
          
          return (
            <a 
              key={href} 
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-1)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-xl)',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all var(--duration-slow) var(--easing-ease-out)',
                background: isActive ? `rgba(${getSemanticColorRgb(semanticColor)}, 0.15)` : 'transparent',
                color: isActive ? getSemanticColor(semanticColor) : 'var(--color-text-secondary)',
                transform: isActive ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
                cursor: 'pointer',
                boxShadow: isActive ? getSemanticShadow(semanticColor) : 'none',
                border: isActive ? `1px solid rgba(${getSemanticColorRgb(semanticColor)}, 0.2)` : '1px solid transparent'
              }}
              data-testid={testId}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = `rgba(${getSemanticColorRgb(semanticColor)}, 0.08)`
                  e.currentTarget.style.color = getSemanticColor(semanticColor)
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                  e.currentTarget.style.borderColor = `rgba(${getSemanticColorRgb(semanticColor)}, 0.1)`
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
            >
              <Icon 
                style={{
                  width: 'var(--icon-size-lg)',
                  height: 'var(--icon-size-lg)',
                  transition: 'all var(--duration-slow) var(--easing-ease-out)',
                  color: 'inherit',
                  filter: isActive ? `drop-shadow(0 2px 4px rgba(${getSemanticColorRgb(semanticColor)}, 0.3))` : 'none'
                }} 
              />
              <span 
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                  color: 'inherit',
                  textAlign: 'center',
                  lineHeight: 'var(--line-height-tight)',
                  transition: 'all var(--duration-slow) var(--easing-ease-out)'
                }}
              >
                {label}
              </span>
              {/* Enhanced active indicator */}
              {isActive && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'var(--spacing-1)',
                    right: 'var(--spacing-2)',
                    width: 'var(--spacing-2)',
                    height: 'var(--spacing-2)',
                    background: `linear-gradient(135deg, ${getSemanticColor(semanticColor)}, rgba(${getSemanticColorRgb(semanticColor)}, 0.7))`,
                    borderRadius: 'var(--radius-full)',
                    boxShadow: `0 0 8px rgba(${getSemanticColorRgb(semanticColor)}, 0.5)`,
                    animation: 'pulse 2s infinite'
                  }}
                  data-testid={`${testId}-indicator`}
                />
              )}
            </a>
          )
        })}
      </div>
    </nav>
  )
}