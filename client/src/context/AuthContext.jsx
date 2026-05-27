/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'
import { useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { hasConvexUrl } from '../convex/api'

const AuthContext = createContext(null)

// ─── Local fallback (no Convex URL) ──────────────────────────────────────────

function LocalAuthProvider({ children }) {
  const value = useMemo(() => ({
    isAuthenticated: true,
    isLoading: false,
    signIn: async () => {},
    signOut: async () => {},
  }), [])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Convex Auth provider ─────────────────────────────────────────────────────

function ConvexAuthProvider({ children }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn, signOut } = useAuthActions()

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    signIn: () => signIn('github'),
    signOut,
  }), [isAuthenticated, isLoading, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  return hasConvexUrl
    ? <ConvexAuthProvider>{children}</ConvexAuthProvider>
    : <LocalAuthProvider>{children}</LocalAuthProvider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
