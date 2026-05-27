import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { navigationItems } from '../../constants/navigation'
import { useTasks } from '../../context/TaskContext'
import { getTaskStats } from '../../lib/taskAnalytics'
import { cn } from '../../utils/cn'
import { IconButton } from '../ui/IconButton'

function SidebarContent({ onClose }) {
  const { tasks } = useTasks()
  const stats = getTaskStats(tasks)

  return (
    <aside className="flex h-full flex-col p-5">
      {/* Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white shadow-lift dark:bg-white dark:text-ink">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-300">Premium</p>
            <h2 className="text-xl font-semibold text-ink dark:text-white">Momentum</h2>
          </div>
        </div>
        <IconButton label="Close navigation" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </IconButton>
      </div>

      {/* Nav */}
      <nav className="mt-8 grid gap-1.5">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) => cn(
              'focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10',
              isActive && 'bg-white text-ink shadow-sm shadow-slate-200/50 dark:bg-white/15 dark:text-white dark:shadow-black/10',
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {[
          { label: 'Total',     value: stats.total     },
          { label: 'Done',      value: stats.completed },
          { label: 'Pending',   value: stats.pending   },
          { label: 'Progress',  value: `${stats.completionRate}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/60 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-ink dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass-panel mt-auto rounded-[24px] p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink dark:text-white">Today&apos;s rhythm</p>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-300">{stats.completionRate}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>
    </aside>
  )
}

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r soft-divider bg-white/56 backdrop-blur-2xl dark:bg-white/[0.04] lg:block">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close navigation overlay"
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl dark:bg-[#111827]"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
