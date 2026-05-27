import { motion } from 'framer-motion'
import { pageTransition } from '../animations/variants'
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart'
import { ProgressRing } from '../components/dashboard/ProgressRing'
import { useTasks } from '../context/TaskContext'
import {
  getPriorityBreakdown,
  getStatusBreakdown,
  getCategoryBreakdown,
  getTaskStats,
} from '../lib/taskAnalytics'
import { priorityOptions, statusOptions } from '../constants/tasks'
import { cn } from '../utils/cn'

function BreakdownBar({ label, count, completed, max, tone }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  const completedPct = count > 0 ? Math.round((completed / count) * 100) : 0
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold capitalize', tone)}>{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{count} tasks · {completedPct}% done</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
        <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-teal-500 transition-all duration-700" />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { tasks } = useTasks()
  const stats     = getTaskStats(tasks)
  const priority  = getPriorityBreakdown(tasks)
  const status    = getStatusBreakdown(tasks)
  const category  = getCategoryBreakdown(tasks)
  const maxPriority = Math.max(...priority.map((p) => p.count), 1)
  const maxCategory = Math.max(...category.map((c) => c.total), 1)

  return (
    <motion.div {...pageTransition} className="grid gap-6">

      {/* Top row */}
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <AnalyticsChart completed={stats.completed} pending={stats.pending} />
        <ProgressRing
          value={stats.completionRate}
          label="Completion rate"
          sublabel={`${stats.completed} of ${stats.total} tasks done`}
        />
      </div>

      {/* Breakdowns */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Priority */}
        <section className="glass-panel rounded-[28px] p-5 text-ink dark:text-white">
          <h2 className="mb-4 font-semibold">Priority breakdown</h2>
          <div className="grid gap-4">
            {priority.map((item) => {
              const opt = priorityOptions.find((p) => p.value === item.priority)
              return (
                <BreakdownBar
                  key={item.priority}
                  label={item.priority}
                  count={item.count}
                  completed={item.completed}
                  max={maxPriority}
                  tone={opt?.tone ?? ''}
                />
              )
            })}
          </div>
        </section>

        {/* Status */}
        <section className="glass-panel rounded-[28px] p-5 text-ink dark:text-white">
          <h2 className="mb-4 font-semibold">Status breakdown</h2>
          <div className="grid gap-4">
            {status.map((item) => {
              const opt = statusOptions.find((s) => s.value === item.status)
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0
              return (
                <div key={item.status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold capitalize', opt?.tone ?? '')}>
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{item.count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                    <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-blue-500 transition-all duration-700" />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Category */}
        <section className="glass-panel rounded-[28px] p-5 text-ink dark:text-white">
          <h2 className="mb-4 font-semibold">Category breakdown</h2>
          {category.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks yet.</p>
          ) : (
            <div className="grid gap-4">
              {category.map((item) => (
                <BreakdownBar
                  key={item.category}
                  label={item.category}
                  count={item.total}
                  completed={item.completed}
                  max={maxCategory}
                  tone="bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Due today',    value: stats.dueToday,    color: 'text-amber-600 dark:text-amber-300'  },
          { label: 'Overdue',      value: stats.overdue,     color: 'text-rose-600 dark:text-rose-300'    },
          { label: 'Avg progress', value: `${stats.avgProgress}%`, color: 'text-teal-600 dark:text-teal-300' },
          { label: 'Pinned',       value: stats.pinned,      color: 'text-purple-600 dark:text-purple-300'},
        ].map((item) => (
          <div key={item.label} className="glass-panel rounded-[24px] p-4 text-ink dark:text-white">
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className={cn('mt-1 text-3xl font-semibold tabular-nums', item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

    </motion.div>
  )
}
