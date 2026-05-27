import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { hasConvexUrl } from '../convex/api'
import { AuthProvider } from './AuthContext.jsx'
import { TaskProvider } from './TaskContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { ToastProvider } from './ToastContext.jsx'

const convex = hasConvexUrl ? new ConvexReactClient(import.meta.env.VITE_CONVEX_URL) : null

function DataProviders({ children }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  )
}

export function AppProviders({ children }) {
  const app = (
    <ThemeProvider>
      <ToastProvider>
        <DataProviders>{children}</DataProviders>
      </ToastProvider>
    </ThemeProvider>
  )

  // When Convex is available, wrap with ConvexAuthProvider (handles auth state)
  if (convex) {
    return <ConvexAuthProvider client={convex}>{app}</ConvexAuthProvider>
  }

  return app
}
