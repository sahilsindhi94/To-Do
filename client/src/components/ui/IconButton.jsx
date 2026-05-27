import { cn } from '../../utils/cn'

export function IconButton({ label, className, ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/60 bg-white/65 text-slate-600 shadow-sm shadow-slate-200/30 transition duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:shadow-black/10 dark:hover:bg-white/15',
        className,
      )}
      {...props}
    />
  )
}
