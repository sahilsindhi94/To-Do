/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'

const AuthContext = createContext(null)

function LocalAuthProvider({ children }) {
  const value = useMemo(() => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Portfolio User', email: 'local@todo.app' },
    signIn: async () => {},
    signOut: async () => {},
  }), [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }) {
  return <LocalAuthProvider>{children}</LocalAuthProvider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
