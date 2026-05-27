import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { hasConvexUrl } from './convex/api.js'
import { Skeleton } from './components/ui/Skeleton.jsx'

function AuthGate({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // No Convex = local mode, always authenticated
  if (!hasConvexUrl) return children

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="grid gap-3 w-64">
          <Skeleton className="h-12" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginPage />

  return children
}

export default function App() {
  const location = useLocation()

  return (
    <AuthGate>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AuthGate>
  )
}
