import React from 'react'
import { useLocation } from 'wouter'
import { Home, Dumbbell, Apple, TrendingUp, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home', testId: 'nav-home' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts', testId: 'nav-workouts' },
  { href: '/nutrition', icon: Apple, label: 'Nutrition', testId: 'nav-nutrition' },
  { href: '/progress', icon: TrendingUp, label: 'Progress', testId: 'nav-progress' },
  { href: '/profile', icon: User, label: 'Profile', testId: 'nav-profile' },
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
        backgroundColor: 'var(--color-surface)',
        borderTop: `1px solid var(--color-border)`,
        zIndex: 'var(--z-index-fixed)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-lg)'
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
        {navItems.map(({ href, icon: Icon, label, testId }) => {
          const isActive = location === href
          
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
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all var(--duration-base) var(--easing-ease-out)',
                backgroundColor: isActive ? 'rgba(var(--color-action-rgb), 0.1)' : 'transparent',
                color: isActive ? 'var(--color-action)' : 'var(--color-text-secondary)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                cursor: 'pointer'
              }}
              data-testid={testId}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-interactive-hover)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }
              }}
            >
              <Icon 
                style={{
                  width: 'var(--icon-size-lg)',
                  height: 'var(--icon-size-lg)',
                  transition: 'all var(--duration-base) var(--easing-ease-out)',
                  color: isActive ? 'var(--color-action)' : 'inherit'
                }} 
              />
              <span 
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  color: 'inherit',
                  textAlign: 'center',
                  lineHeight: 'var(--line-height-tight)'
                }}
              >
                {label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'var(--spacing-1)',
                    right: 'var(--spacing-2)',
                    width: 'var(--spacing-2)',
                    height: 'var(--spacing-2)',
                    backgroundColor: 'var(--color-action)',
                    borderRadius: 'var(--radius-full)',
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