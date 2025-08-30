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
                  'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95',
                  isActive
                    ? 'text-primary bg-primary/15 shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm'
                )}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-medium tracking-wide">{label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}