import { motion } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, Clock3, ListTodo,
  TrendingUp, Zap, CalendarClock, Pin,
} from 'lucide-react'
import { pageTransition } from '../animations/variants'
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart'
import { ProgressRing } from '../components/dashboard/ProgressRing'
import { StatCard } from '../components/dashboard/StatCard'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { TaskCard } from '../components/tasks/TaskCard'
import { Skeleton } from '../components/ui/Skeleton'
import { EditTaskModal } from '../components/modals/EditTaskModal'
import { useTasks } from '../context/TaskContext'
import { useToast } from '../context/ToastContext'
import { useEditTask } from '../hooks/useEditTask'
import { getTaskStats } from '../lib/taskAnalytics'

export default function DashboardPage() {
  const { tasks, isLoading, updateTask, deleteTask, togglePin } = useTasks()
  const { notify } = useToast()
  const { editingTask, isSaving, openEdit, closeEdit, saveEdit } = useEditTask()

  const stats  = getTaskStats(tasks)
  // Show pinned first, then most recent — limit to 4
  const recent = [...tasks]
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return (b.createdAt ?? 0) - (a.createdAt ?? 0)
    })
    .slice(0, 4)

  async function handleToggle(task) {
    const id = task._id ?? task.id
    try {
      const next = !task.completed
      await updateTask(id, {
        completed: next,
        status: next ? 'completed' : 'in_progress',
        progress: next ? 100 : task.progress,
      })
    } catch (err) {
      notify(`Failed to update: ${err?.message ?? err}`, 'error')
    }
  }

  async function handleDelete(task) {
    const id = task._id ?? task.id
    try {
      await deleteTask(id)
      notify('Task deleted')
    } catch (err) {
      notify(`Failed to delete: ${err?.message ?? err}`, 'error')
    }
  }

  async function handlePin(task) {
    const id = task._id ?? task.id
    try {
      await togglePin(id)
    } catch (err) {
      notify(`Failed to pin: ${err?.message ?? err}`, 'error')
    }
  }

  return (
    <>
      <motion.div {...pageTransition} className="grid gap-6">

        {/* ── Stats row ── */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total tasks"
            value={stats.total}
            detail="in workspace"
            icon={ListTodo}
            accent="teal"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            detail={`${stats.completionRate}% done`}
            icon={CheckCircle2}
            accent="emerald"
          />
          <StatCard
            label="In progress"
            value={stats.inProgress}
            detail={`${stats.pending} pending`}
            icon={Clock3}
            accent="blue"
          />
          <StatCard
            label="High priority"
            value={stats.highPriority}
            detail={stats.urgent > 0 ? `${stats.urgent} urgent` : 'needs focus'}
            icon={AlertTriangle}
            accent="rose"
          />
        </section>

        {/* ── Secondary stats ── */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Due today"
            value={stats.dueToday}
            detail="scheduled"
            icon={CalendarClock}
            accent="amber"
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            detail="needs attention"
            icon={TrendingUp}
            accent="rose"
          />
          <StatCard
            label="Avg progress"
            value={`${stats.avgProgress}%`}
            detail="across all tasks"
            icon={Zap}
            accent="purple"
          />
          <StatCard
            label="Pinned"
            value={stats.pinned}
            detail="priority items"
            icon={Pin}
            accent="teal"
          />
        </section>

        {/* ── Charts row ── */}
        <section className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <AnalyticsChart completed={stats.completed} pending={stats.pending} />
          <ProgressRing value={stats.completionRate} />
        </section>

        {/* ── Recent tasks + Activity ── */}
        <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
          {/* Recent tasks */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent tasks</h2>
              <span className="text-xs text-slate-400">Auto-save enabled</span>
            </div>
            <div className="grid gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                </>
              ) : recent.length === 0 ? (
                <div className="glass-panel rounded-[24px] p-8 text-center text-sm text-slate-400">
                  No tasks yet. Create your first task with the button above.
                </div>
              ) : (
                recent.map((task) => (
                  <TaskCard
                    key={task._id ?? task.id}
                    task={task}
                    onEdit={() => openEdit(task)}
                    onDelete={() => handleDelete(task)}
                    onToggle={() => handleToggle(task)}
                    onPin={() => handlePin(task)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Activity feed */}
          <ActivityFeed />
        </section>

      </motion.div>

      {/* Edit modal — wired to useEditTask hook */}
      <EditTaskModal
        task={editingTask}
        open={Boolean(editingTask)}
        onClose={closeEdit}
        onSave={saveEdit}
        isSaving={isSaving}
      />
    </>
  )
}
