import { Outlet, useLocation } from 'react-router-dom'
import { Menu, Moon, Plus, Sun } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Button } from '../components/ui/Button'
import { IconButton } from '../components/ui/IconButton'
import { Modal } from '../components/ui/Modal'
import { TaskForm } from '../components/forms/TaskForm'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useTasks } from '../context/TaskContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { createTask } = useTasks()
  const { notify } = useToast()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const title = location.pathname === '/analytics' ? 'Analytics' : location.pathname === '/tasks' ? 'Tasks' : 'Dashboard'
  const shortcuts = useMemo(() => [
    { key: 'k', meta: true, handler: () => setIsCreateOpen(true) },
    { key: 'd', meta: true, handler: toggleTheme },
  ], [toggleTheme])

  useKeyboardShortcuts(shortcuts)

  async function handleCreate(payload) {
    try {
      await createTask(payload)
      setIsCreateOpen(false)
      notify('Task created and synced')
    } catch (err) {
      console.error('Failed to create task:', err)
      notify(`Failed to create task: ${err.message || err}`)
    }
  }

  return (
    <div className="min-h-screen text-ink dark:text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b soft-divider bg-white/72 px-4 py-3 backdrop-blur-2xl dark:bg-[#111827]/72 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconButton label="Open navigation" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </IconButton>
              <div>
                <p className="text-xs font-semibold uppercase text-teal-600 dark:text-teal-200">Momentum</p>
                <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconButton label="Toggle theme" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </IconButton>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New task</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <Modal open={isCreateOpen} title="Create task" onClose={() => setIsCreateOpen(false)}>
        <TaskForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
      </Modal>
    </div>
  )
}
