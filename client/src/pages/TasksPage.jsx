import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { pageTransition } from '../animations/variants'
import { defaultCategories, filterOptions } from '../constants/tasks'
import { TaskBoard } from '../components/tasks/TaskBoard'
import { EditTaskModal } from '../components/modals/EditTaskModal'
import { Skeleton } from '../components/ui/Skeleton'
import { useFilteredTasks } from '../hooks/useFilteredTasks'
import { useEditTask } from '../hooks/useEditTask'
import { useTasks } from '../context/TaskContext'
import { useToast } from '../context/ToastContext'
import { cn } from '../utils/cn'

export default function TasksPage() {
  const [query,    setQuery]    = useState('')
  const [filter,   setFilter]   = useState('all')
  const [category, setCategory] = useState('all')

  const { tasks, isLoading, updateTask, deleteTask, reorderTasks, togglePin } = useTasks()
  const { notify } = useToast()
  const { editingTask, isSaving, openEdit, closeEdit, saveEdit } = useEditTask()

  const categories     = useMemo(() => ['all', ...defaultCategories], [])
  const filteredTasks  = useFilteredTasks(tasks, { query, filter, category })
  const hasActiveFilter = query || filter !== 'all' || category !== 'all'

  function clearFilters() {
    setQuery('')
    setFilter('all')
    setCategory('all')
  }

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
      <motion.div {...pageTransition} className="grid gap-5">

        {/* ── Filter bar ── */}
        <section className="page-panel">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            {/* Search */}
            <label className="field-control flex h-11 items-center gap-2.5 px-4">
              <Search className="h-4 w-4 flex-none text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, tags, categories…"
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            {/* Status filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select-control h-11"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-control h-11"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
              ))}
            </select>

            {/* Clear filters */}
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 px-4 text-sm font-medium text-slate-500 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {/* Active filter pills */}
          {hasActiveFilter && (
            <div className="mt-3 flex flex-wrap gap-2">
              {query && (
                <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                  Search: "{query}"
                  <button onClick={() => setQuery('')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filter !== 'all' && (
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {filterOptions.find((f) => f.value === filter)?.label}
                  <button onClick={() => setFilter('all')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {category !== 'all' && (
                <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                  {category}
                  <button onClick={() => setCategory('all')}><X className="h-3 w-3" /></button>
                </span>
              )}
              <span className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                filteredTasks.length === 0
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400',
              )}>
                {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </section>

        {/* ── Task board ── */}
        {isLoading ? (
          <div className="grid gap-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            onEdit={openEdit}
            onDelete={handleDelete}
            onReorder={reorderTasks}
            onToggle={handleToggle}
            onPin={handlePin}
          />
        )}

      </motion.div>

      {/* Edit modal */}
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
