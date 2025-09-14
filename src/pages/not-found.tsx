import { Link } from 'wouter'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AlertTriangle, Home, ArrowLeft, Search, BookOpen } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Header with Icon Badge */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-[var(--color-warning)]/20 to-[var(--color-warning)]/10 rounded-2xl border border-[var(--color-warning)]/20">
              <AlertTriangle className="w-12 h-12 text-[var(--color-warning)]" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-[var(--color-text-primary)] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">Page Not Found</h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Helpful Navigation Card */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3 justify-center">
              <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-xl border border-[var(--color-action)]/20">
                <Search className="w-6 h-6 text-[var(--color-action)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl">What would you like to do?</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Here are some helpful options to get you back on track
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/" data-testid="link-home">
                <Button 
                  className="w-full bg-gradient-to-r from-[var(--color-action)] to-[var(--color-action)]/90 hover:from-[var(--color-action)]/90 hover:to-[var(--color-action)]/80 text-[var(--color-action-text)] shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-go-home"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full bg-gradient-to-r from-[var(--color-surface)]/50 to-[var(--color-surface)]/30 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:from-[var(--color-surface)]/70 hover:to-[var(--color-surface)]/50 hover:text-[var(--color-text-primary)] transition-all duration-300"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
                Or explore these popular sections:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/workouts" data-testid="link-workouts">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-activity)]/10 to-[var(--color-activity)]/5 rounded-lg border border-[var(--color-activity)]/20 text-center hover:from-[var(--color-activity)]/20 hover:to-[var(--color-activity)]/10 transition-all duration-300 cursor-pointer">
                    <BookOpen className="w-5 h-5 text-[var(--color-activity)] mx-auto mb-1" />
                    <span className="text-xs text-[var(--color-activity)] font-medium">Workouts</span>
                  </div>
                </Link>
                <Link href="/nutrition" data-testid="link-nutrition">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-nutrition)]/10 to-[var(--color-nutrition)]/5 rounded-lg border border-[var(--color-nutrition)]/20 text-center hover:from-[var(--color-nutrition)]/20 hover:to-[var(--color-nutrition)]/10 transition-all duration-300 cursor-pointer">
                    <BookOpen className="w-5 h-5 text-[var(--color-nutrition)] mx-auto mb-1" />
                    <span className="text-xs text-[var(--color-nutrition)] font-medium">Nutrition</span>
                  </div>
                </Link>
                <Link href="/progress" data-testid="link-progress">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-wellness)]/10 to-[var(--color-wellness)]/5 rounded-lg border border-[var(--color-wellness)]/20 text-center hover:from-[var(--color-wellness)]/20 hover:to-[var(--color-wellness)]/10 transition-all duration-300 cursor-pointer">
                    <BookOpen className="w-5 h-5 text-[var(--color-wellness)] mx-auto mb-1" />
                    <span className="text-xs text-[var(--color-wellness)] font-medium">Progress</span>
                  </div>
                </Link>
                <Link href="/profile" data-testid="link-profile">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/10 to-[var(--color-action)]/5 rounded-lg border border-[var(--color-action)]/20 text-center hover:from-[var(--color-action)]/20 hover:to-[var(--color-action)]/10 transition-all duration-300 cursor-pointer">
                    <BookOpen className="w-5 h-5 text-[var(--color-action)] mx-auto mb-1" />
                    <span className="text-xs text-[var(--color-action)] font-medium">Profile</span>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}