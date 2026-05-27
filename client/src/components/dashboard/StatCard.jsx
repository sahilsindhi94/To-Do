import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function StatCard({ label, value, detail, icon: Icon, accent = 'teal', trend }) {
  const accents = {
    teal:   'bg-teal-500/15 text-teal-600 dark:text-teal-300',
    amber:  'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    rose:   'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-300',
    blue:   'bg-blue-500/15 text-blue-600 dark:text-blue-300',
    emerald:'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-panel rounded-[24px] p-5 text-ink dark:text-white"
    >
      <div className="flex items-start justify-between">
        <div className={cn('grid h-10 w-10 place-items-center rounded-2xl', accents[accent] ?? accents.teal)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={cn(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            trend >= 0
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{detail}</p>}
    </motion.div>
  )
}
