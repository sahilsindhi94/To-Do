import { cn } from '../../utils/cn'

export function TextField({ label, className, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      <input
        className={cn(
          'field-control',
          className,
        )}
        {...props}
      />
    </label>
  )
}
