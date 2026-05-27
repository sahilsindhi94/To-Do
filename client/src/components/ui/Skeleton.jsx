export function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-200/70 dark:bg-white/10 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  )
}
