import { Link } from 'wouter'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AlertTriangle, Home, ArrowLeft, Search, BookOpen } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="page-container flex-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Header with Icon Badge */}
        <div className="space-y-4">
          <div className="flex-center gap-3 mb-4">
            <div className="icon-badge icon-badge-lg icon-badge-warning">
              <AlertTriangle className="w-12 h-12 text-warning" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">Page Not Found</h2>
          <p className="text-lg text-secondary max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Helpful Navigation Card */}
        <Card className="card-glass">
          <CardHeader>
            <div className="flex-center gap-3">
              <div className="icon-badge icon-badge-action">
                <Search className="w-6 h-6 text-action" />
              </div>
              <div>
                <CardTitle className="text-primary text-xl">What would you like to do?</CardTitle>
                <CardDescription className="text-secondary">
                  Here are some helpful options to get you back on track
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/" data-testid="link-home">
                <Button 
                  className="w-full bg-action shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-go-home"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full border-primary text-secondary hover:text-primary transition-all duration-300"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="pt-4 border-t border-primary">
              <p className="text-sm text-secondary text-center mb-4">
                Or explore these popular sections:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/workouts" data-testid="link-workouts">
                  <div className="action-item text-center">
                    <BookOpen className="w-5 h-5 text-activity mx-auto mb-1" />
                    <span className="text-xs text-activity font-medium">Workouts</span>
                  </div>
                </Link>
                <Link href="/nutrition" data-testid="link-nutrition">
                  <div className="action-item text-center">
                    <BookOpen className="w-5 h-5 text-nutrition mx-auto mb-1" />
                    <span className="text-xs text-nutrition font-medium">Nutrition</span>
                  </div>
                </Link>
                <Link href="/progress" data-testid="link-progress">
                  <div className="action-item text-center">
                    <BookOpen className="w-5 h-5 text-wellness mx-auto mb-1" />
                    <span className="text-xs text-wellness font-medium">Progress</span>
                  </div>
                </Link>
                <Link href="/profile" data-testid="link-profile">
                  <div className="action-item text-center">
                    <BookOpen className="w-5 h-5 text-action mx-auto mb-1" />
                    <span className="text-xs text-action font-medium">Profile</span>
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