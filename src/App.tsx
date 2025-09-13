import React, { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router, Route, Switch } from 'wouter'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider'
import { MeasurementProvider } from './contexts/MeasurementContext'
import BottomNavigation from './components/bottom-navigation'
import { Toaster } from './components/ui/toaster'

// Original pages
const HomePage = React.lazy(() => import('./pages/home'))
const WorkoutsPage = React.lazy(() => import('./pages/workouts'))
const NutritionPage = React.lazy(() => import('./pages/nutrition'))
const ProgressPage = React.lazy(() => import('./pages/progress'))
const ProfilePage = React.lazy(() => import('./pages/profile'))
const HealthConnectionsPage = React.lazy(() => import('./pages/health-connections'))
const MissionModelPage = React.lazy(() => import('./pages/mission-model'))
const NotFoundPage = React.lazy(() => import('./pages/not-found'))

// New Settings pages
const ProfileEditPage = React.lazy(() => import('./pages/profile-edit'))
const ContactSupportPage = React.lazy(() => import('./pages/contact-support'))
const HelpCenterPage = React.lazy(() => import('./pages/help-center'))
const DataExportPage = React.lazy(() => import('./pages/data-export'))
const DeleteAccountPage = React.lazy(() => import('./pages/delete-account'))
const PrivacyTermsPage = React.lazy(() => import('./pages/privacy-terms'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 mx-auto">
          <svg 
            className="w-8 h-8 text-white animate-pulse" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl blur-xl opacity-30 animate-pulse mx-auto"></div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MeasurementProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <main className="pb-16">
                  <Switch>
                    <Route path="/">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <HomePage />
                      </Suspense>
                    </Route>
                    <Route path="/workouts">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <WorkoutsPage />
                      </Suspense>
                    </Route>
                    <Route path="/nutrition">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <NutritionPage />
                      </Suspense>
                    </Route>
                    <Route path="/progress">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <ProgressPage />
                      </Suspense>
                    </Route>
                    <Route path="/profile">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <ProfilePage />
                      </Suspense>
                    </Route>
                    <Route path="/health-connections">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <HealthConnectionsPage />
                      </Suspense>
                    </Route>
                    <Route path="/mission">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <MissionModelPage />
                      </Suspense>
                    </Route>
                    <Route path="/profile-edit">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <ProfileEditPage />
                      </Suspense>
                    </Route>
                    <Route path="/contact-support">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <ContactSupportPage />
                      </Suspense>
                    </Route>
                    <Route path="/help-center">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <HelpCenterPage />
                      </Suspense>
                    </Route>
                    <Route path="/data-export">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <DataExportPage />
                      </Suspense>
                    </Route>
                    <Route path="/delete-account">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <DeleteAccountPage />
                      </Suspense>
                    </Route>
                    <Route path="/privacy-terms">
                      <Suspense fallback={<PageLoadingFallback />}>
                        <PrivacyTermsPage />
                      </Suspense>
                    </Route>
                    <Route>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <NotFoundPage />
                      </Suspense>
                    </Route>
                  </Switch>
                </main>
                <BottomNavigation />
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </MeasurementProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App