import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-ink text-white shadow-lift hover:-translate-y-0.5 hover:bg-black active:translate-y-0 dark:bg-white dark:text-ink dark:hover:bg-slate-100',
  ghost: 'border border-white/60 bg-white/60 text-ink shadow-sm shadow-slate-200/40 hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-black/10 dark:hover:bg-white/15',
  danger: 'bg-coral/12 text-rose-700 hover:bg-coral/20 dark:text-rose-200',
}

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  return (
    <button
      className={cn(
        'focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-9 px-3 text-sm' : 'h-11 px-4 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
