import { motion } from 'framer-motion'

export function ProgressRing({ value, label = 'Completion rate', sublabel = 'Tasks completed vs total' }) {
  const radius       = 52
  const circumference = 2 * Math.PI * radius
  const offset       = circumference - (value / 100) * circumference

  return (
    <div className="glass-panel rounded-[28px] p-6 text-center text-ink dark:text-white">
      <div className="relative mx-auto grid h-36 w-36 place-items-center">
        <svg viewBox="0 0 120 120" className="-rotate-90">
          <circle
            cx="60" cy="60" r={radius}
            fill="none" stroke="currentColor" strokeWidth="10"
            className="text-slate-200 dark:text-white/10"
          />
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none" stroke="currentColor" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-teal-500"
          />
        </svg>
        <strong className="absolute text-3xl font-semibold tabular-nums">{value}%</strong>
      </div>
      <h3 className="mt-4 font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sublabel}</p>
    </div>
  )
}
