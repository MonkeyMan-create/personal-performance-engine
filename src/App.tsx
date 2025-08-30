import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router, Route, Switch } from 'wouter'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider'
import HomePage from './pages/home'
import WorkoutsPage from './pages/workouts'
import NutritionPage from './pages/nutrition'
import ProgressPage from './pages/progress'
import ProfilePage from './pages/profile'
import NotFoundPage from './pages/not-found'
import BottomNavigation from './components/bottom-navigation'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <main className="pb-16">
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/workouts" component={WorkoutsPage} />
                  <Route path="/nutrition" component={NutritionPage} />
                  <Route path="/progress" component={ProgressPage} />
                  <Route path="/profile" component={ProfilePage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </main>
              <BottomNavigation />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App