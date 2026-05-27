import { useQuery } from 'convex/react'
import { api, hasConvexUrl } from '../../convex/api'
import { useTasks } from '../../context/TaskContext'
import { activityIcons } from '../../constants/tasks'
import { formatRelativeTime } from '../../utils/date'
import { Skeleton } from '../ui/Skeleton'

function ActivityItem({ item }) {
  const meta = activityIcons[item.type] ?? { emoji: '•', label: item.type }
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-base leading-none">{meta.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">{item.message}</p>
        <p className="mt-0.5 text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</p>
      </div>
    </div>
  )
}

function LocalActivityFeed() {
  const { tasks } = useTasks()
  // Derive a simple activity feed from task updatedAt timestamps
  const items = [...tasks]
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    .slice(0, 8)
    .map((t) => ({
      _id: t._id ?? t.id,
      type: t.completed ? 'completed' : 'updated',
      message: t.completed ? `Completed "${t.title}"` : `Updated "${t.title}"`,
      createdAt: t.updatedAt ?? t.createdAt,
    }))

  if (!items.length) {
    return <p className="py-6 text-center text-sm text-slate-400">No activity yet.</p>
  }

  return (
    <div className="divide-y divide-slate-200/60 dark:divide-white/10">
      {items.map((item) => <ActivityItem key={item._id} item={item} />)}
    </div>
  )
}

function ConvexActivityFeed() {
  const { ownerKey } = useTasks()
  const items = useQuery(api.activity.recent, { ownerKey })

  if (items === undefined) {
    return (
      <div className="grid gap-3 py-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
      </div>
    )
  }

  if (!items.length) {
    return <p className="py-6 text-center text-sm text-slate-400">No activity yet.</p>
  }

  return (
    <div className="divide-y divide-slate-200/60 dark:divide-white/10">
      {items.map((item) => <ActivityItem key={item._id} item={item} />)}
    </div>
  )
}

export function ActivityFeed() {
  return (
    <section className="glass-panel rounded-[28px] p-5 text-ink dark:text-white">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Recent activity</h3>
        <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-600 dark:text-teal-300">
          Live
        </span>
      </div>
      {hasConvexUrl ? <ConvexActivityFeed /> : <LocalActivityFeed />}
    </section>
  )
}
