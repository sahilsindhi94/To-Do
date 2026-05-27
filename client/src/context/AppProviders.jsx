import { ConvexProvider, ConvexReactClient } from 'convex/react'
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

  if (!convex) return app

  return <ConvexProvider client={convex}>{app}</ConvexProvider>
}
