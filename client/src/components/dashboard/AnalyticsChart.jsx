import { motion } from 'framer-motion'
import { getWeeklyActivity } from '../../lib/taskAnalytics'
import { useTasks } from '../../context/TaskContext'

function Bar({ value, max, label, color }) {
  const height = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{value || ''}</span>
      <div className="relative flex h-24 w-full items-end justify-center">
        <motion.div
          className={`w-full max-w-[28px] rounded-t-lg ${color}`}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  )
}

export function AnalyticsChart({ completed, pending }) {
  const { tasks } = useTasks()
  const weekly = getWeeklyActivity(tasks)
  const maxVal = Math.max(...weekly.map((d) => Math.max(d.created, d.completed)), 1)
  const total  = Math.max(completed + pending, 1)

  return (
    <section className="glass-panel rounded-[28px] p-5 text-ink dark:text-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Weekly activity</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal-500" />Created</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />Done</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="mt-5 flex gap-1">
        {weekly.map((day) => (
          <div key={day.label} className="flex flex-1 gap-0.5">
            <Bar value={day.created}   max={maxVal} label={day.label} color="bg-teal-400/70" />
            <Bar value={day.completed} max={maxVal} label=""          color="bg-emerald-400/70" />
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Completed vs pending</span>
          <span>{total} total</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <div className="flex h-full">
            <motion.div
              className="bg-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completed / total) * 100}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.div
              className="bg-rose-400"
              initial={{ width: 0 }}
              animate={{ width: `${(pending / total) * 100}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/60 bg-white/55 p-3 dark:border-white/10 dark:bg-white/10">
            <p className="text-slate-500 dark:text-slate-400">Completed</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{completed}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/55 p-3 dark:border-white/10 dark:bg-white/10">
            <p className="text-slate-500 dark:text-slate-400">Pending</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{pending}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
