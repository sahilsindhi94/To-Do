import { useState } from 'react'
import { defaultCategories, priorityOptions, colorLabels } from '../../constants/tasks'
import { Button } from '../ui/Button'
import { TextField } from './TextField'
import { cn } from '../../utils/cn'

const emptyTask = {
  title:            '',
  description:      '',
  priority:         'medium',
  status:           'pending',
  category:         'Focus',
  tags:             '',
  dueDate:          '',
  completed:        false,
  progress:         0,
  pinned:           false,
  colorLabel:       '',
  estimatedMinutes: '',
  repeatOption:     '',
  subtasks:         [],
}

export function TaskForm({ task, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(
    task
      ? { ...task, tags: (task.tags ?? []).join(', '), description: task.description ?? task.notes ?? '' }
      : emptyTask
  )

  function set(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await onSubmit({
      ...draft,
      tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      progress: Number(draft.progress) || 0,
      estimatedMinutes: draft.estimatedMinutes !== '' ? Number(draft.estimatedMinutes) : undefined,
    })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <TextField
        label="Task title"
        value={draft.title}
        onChange={(e) => set('title', e.target.value)}
        placeholder="Write a clear next action"
        required
        autoFocus
      />

      <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        <span>Description</span>
        <textarea
          className="field-control min-h-[80px] resize-y py-3 leading-6"
          value={draft.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Add context, links, or acceptance criteria"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>Priority</span>
          <select className="select-control" value={draft.priority} onChange={(e) => set('priority', e.target.value)}>
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>Category</span>
          <select className="select-control" value={draft.category} onChange={(e) => set('category', e.target.value)}>
            {defaultCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <TextField
          label="Due date"
          type="date"
          value={draft.dueDate || ''}
          onChange={(e) => set('dueDate', e.target.value)}
        />
      </div>

      <TextField
        label="Tags"
        value={draft.tags}
        onChange={(e) => set('tags', e.target.value)}
        placeholder="planning, deep-work (comma separated)"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Estimated time (min)"
          type="number"
          min={0}
          step={15}
          value={draft.estimatedMinutes}
          onChange={(e) => set('estimatedMinutes', e.target.value)}
          placeholder="e.g. 60"
        />

        <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>Color label</span>
          <div className="flex items-center gap-2 pt-1">
            {colorLabels.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => set('colorLabel', c.value)}
                className={cn(
                  'h-7 w-7 rounded-full border-2 transition',
                  draft.colorLabel === c.value
                    ? 'border-slate-700 scale-110 dark:border-white'
                    : 'border-transparent hover:scale-105',
                  c.hex === 'transparent' && 'border-dashed border-slate-300 dark:border-white/20',
                )}
                style={{ background: c.hex === 'transparent' ? undefined : c.hex }}
              />
            ))}
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{task ? 'Save task' : 'Create task'}</Button>
      </div>
    </form>
  )
}
