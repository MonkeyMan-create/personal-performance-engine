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
    <nav className="nav-bottom" data-testid="nav-bottom">
      <div className="nav-grid">
        {navItems.map(({ href, icon: Icon, label, testId }) => {
          const isActive = location === href
          
          return (
            <a 
              key={href} 
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              data-testid={testId}
            >
              <Icon className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`} />
              <span className={`nav-label ${isActive ? 'nav-label-active' : ''}`}>
                {label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div className="nav-indicator" data-testid={`${testId}-indicator`}></div>
              )}
            </a>
          )
        })}
      </div>
    </nav>
  )
}