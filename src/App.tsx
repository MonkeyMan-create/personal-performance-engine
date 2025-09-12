import React, { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider'
import BottomNavigation from './components/bottom-navigation'
import { Toaster } from './components/ui/toaster'

// Import the new screen components
import HomeScreen from './components/HomeScreen'
import NutritionLogScreen from './components/NutritionLogScreen'
import WorkoutLogScreen from './components/WorkoutLogScreen'

// Original pages for other routes
const WorkoutsPage = React.lazy(() => import('./pages/workouts'))
const NutritionPage = React.lazy(() => import('./pages/nutrition'))
const ProgressPage = React.lazy(() => import('./pages/progress'))
const ProfilePage = React.lazy(() => import('./pages/profile'))
const HealthConnectionsPage = React.lazy(() => import('./pages/health-connections'))
const MissionModelPage = React.lazy(() => import('./pages/mission-model'))
const NotFoundPage = React.lazy(() => import('./pages/not-found'))

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
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <main className="pb-16">
                <Routes>
                  {/* New routing structure for the screen components */}
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/log-nutrition" element={<NutritionLogScreen />} />
                  <Route path="/log-workout" element={<WorkoutLogScreen />} />
                  
                  {/* Keep existing routes for other functionality */}
                  <Route path="/workouts" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <WorkoutsPage />
                    </Suspense>
                  } />
                  <Route path="/nutrition" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <NutritionPage />
                    </Suspense>
                  } />
                  <Route path="/progress" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <ProgressPage />
                    </Suspense>
                  } />
                  <Route path="/profile" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <ProfilePage />
                    </Suspense>
                  } />
                  <Route path="/health-connections" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <HealthConnectionsPage />
                    </Suspense>
                  } />
                  <Route path="/mission" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <MissionModelPage />
                    </Suspense>
                  } />
                  <Route path="*" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <NotFoundPage />
                    </Suspense>
                  } />
                </Routes>
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