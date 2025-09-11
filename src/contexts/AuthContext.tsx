import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { auth } from '../lib/firebase'
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  isGuestMode: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  enterGuestMode: () => void
  exitGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuestMode, setIsGuestMode] = useState(() => {
    try {
      return localStorage.getItem('guestMode') === 'true'
    } catch {
      return false
    }
  })

  const exitGuestMode = useCallback(() => {
    setIsGuestMode(false)
    try {
      localStorage.removeItem('guestMode')
    } catch (error) {
      console.warn('Failed to remove guest mode from localStorage:', error)
    }
  }, [])

  const enterGuestMode = useCallback(() => {
    setIsGuestMode(true)
    try {
      localStorage.setItem('guestMode', 'true')
    } catch (error) {
      console.warn('Failed to save guest mode to localStorage:', error)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      // Exit guest mode if user signs in
      if (user && isGuestMode) {
        exitGuestMode()
      }
    })

    return unsubscribe
  }, [isGuestMode, exitGuestMode])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // Also exit guest mode when logging out
      exitGuestMode()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    isGuestMode,
    signInWithGoogle,
    logout,
    enterGuestMode,
    exitGuestMode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}