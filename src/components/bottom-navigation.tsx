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
  const [location] = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-2xl">
      <div className="grid grid-cols-5 gap-2 p-4 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative',
                  isActive
                    ? 'text-cyan-400 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 shadow-lg shadow-cyan-500/25 border border-cyan-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 mb-1.5 transition-all duration-300',
                  isActive ? 'drop-shadow-md' : ''
                )} />
                <span className={cn(
                  'text-xs font-medium tracking-wide transition-all duration-300',
                  isActive ? 'font-semibold text-cyan-400' : ''
                )}>{label}</span>
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full shadow-sm animate-pulse"></div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}