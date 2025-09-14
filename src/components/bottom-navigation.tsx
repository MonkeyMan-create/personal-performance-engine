import React from 'react'
import { Link, useLocation } from 'wouter'
import { Home, Dumbbell, Apple, TrendingUp, User } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/nutrition', icon: Apple, label: 'Nutrition' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/profile', icon: User, label: 'Profile' },
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
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-2xl">
      <div className="grid grid-cols-5 gap-2 p-4 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href
          return (
            <a 
              key={href} 
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              className="cursor-pointer"
            >
              <div
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative',
                  isActive
                    ? 'text-primary bg-gradient-to-br from-primary/20 to-primary/20 shadow-lg shadow-primary/25 border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 mb-1.5 transition-all duration-300',
                  isActive ? 'drop-shadow-md' : ''
                )} />
                <span className={cn(
                  'text-xs font-medium tracking-wide transition-all duration-300',
                  isActive ? 'font-semibold text-primary' : ''
                )}>{label}</span>
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-primary to-primary rounded-full shadow-sm animate-pulse"></div>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </nav>
  )
}