import { motion } from 'framer-motion'
import {
  CalendarDays, Check, Edit3, GripVertical, Pin,
  Trash2, Clock, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { listItem } from '../../animations/variants'
import { priorityOptions, statusOptions, colorLabels } from '../../constants/tasks'
import { cn } from '../../utils/cn'
import { formatDate, isOverdue } from '../../utils/date'
import { IconButton } from '../ui/IconButton'

function ProgressBar({ value }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
      <motion.div
        className="h-full rounded-full bg-teal-500"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}

export function TaskCard({ task, onEdit, onDelete, onToggle, onPin }) {
  const priority = priorityOptions.find((p) => p.value === task.priority) ?? priorityOptions[1]
  const status   = statusOptions.find((s) => s.value === task.status)
  const color    = colorLabels.find((c) => c.value === task.colorLabel)
  const overdue  = isOverdue(task.dueDate) && !task.completed

  const completedSubtasks = (task.subtasks ?? []).filter((s) => s.completed).length
  const totalSubtasks     = (task.subtasks ?? []).length

  return (
    <motion.article
      variants={listItem}
      layout
      className={cn(
        'glass-panel group relative overflow-hidden rounded-[24px] p-4 text-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-glow dark:text-white sm:p-5',
        task.completed && 'opacity-60',
        task.pinned && 'ring-1 ring-teal-400/40 dark:ring-teal-500/30',
      )}
    >
      {/* Color label accent */}
      {color?.hex && color.hex !== 'transparent' && (
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-[24px]"
          style={{ background: color.hex }}
        />
      )}

      <div className={cn('grid gap-3', color?.hex && color.hex !== 'transparent' && 'pl-3')}>
        {/* Top row: drag + toggle + meta */}
        <div className="flex items-start gap-3">
          <GripVertical className="mt-1 h-5 w-5 flex-none cursor-grab text-slate-300 group-active:cursor-grabbing" />

          {/* Completion toggle */}
          <button
            aria-label="Toggle completion"
            onClick={onToggle}
            className={cn(
              'focus-ring mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border-2 transition',
              task.completed
                ? 'border-teal-500 bg-teal-500 text-white'
                : 'border-slate-300 bg-white/60 dark:border-white/20 dark:bg-white/10',
            )}
          >
            {task.completed && <Check className="h-3.5 w-3.5" />}
          </button>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold capitalize', priority.tone)}>
                {priority.value === 'urgent' && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                {priority.label}
              </span>
              {status && (
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', status.tone)}>
                  {status.label}
                </span>
              )}
              <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-white/10 dark:text-slate-300">
                {task.category}
              </span>
              {task.pinned && (
                <span className="flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-600 dark:text-teal-300">
                  <Pin className="h-3 w-3" /> Pinned
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className={cn('mt-2 text-sm font-semibold leading-5 sm:text-base', task.completed && 'line-through')}>
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {task.description}
              </p>
            )}

            {/* Progress bar */}
            {(task.progress ?? 0) > 0 && (
              <div className="mt-3">
                <ProgressBar value={task.progress} />
                <p className="mt-1 text-right text-[10px] text-slate-400">{task.progress}%</p>
              </div>
            )}

            {/* Subtasks mini progress */}
            {totalSubtasks > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ChevronRight className="h-3 w-3" />
                <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
              </div>
            )}

            {/* Footer meta */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
                overdue
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                  : 'bg-white/60 dark:bg-white/10',
              )}>
                <CalendarDays className="h-3 w-3" />
                {formatDate(task.dueDate)}
                {overdue && ' · Overdue'}
              </span>

              {task.estimatedMinutes && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 dark:bg-white/10">
                  <Clock className="h-3 w-3" />
                  {task.estimatedMinutes}m
                </span>
              )}

              {(task.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-white/50 px-2 py-0.5 dark:bg-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-none flex-col gap-1.5">
            <IconButton label="Edit task" onClick={onEdit}>
              <Edit3 className="h-3.5 w-3.5" />
            </IconButton>
            {onPin && (
              <IconButton
                label={task.pinned ? 'Unpin task' : 'Pin task'}
                className={task.pinned ? 'text-teal-600 dark:text-teal-300' : ''}
                onClick={onPin}
              >
                <Pin className="h-3.5 w-3.5" />
              </IconButton>
            )}
            <IconButton
              label="Delete task"
              className="text-rose-500 dark:text-rose-400"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
