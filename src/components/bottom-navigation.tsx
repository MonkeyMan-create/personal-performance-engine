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
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}