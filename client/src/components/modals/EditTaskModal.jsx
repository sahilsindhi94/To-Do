import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Save, Loader2, Tag, Calendar, Flag, Layers,
  AlignLeft, Clock, Repeat, Pin, Palette, CheckSquare,
  Plus, Trash2, ChevronDown,
} from 'lucide-react'
import {
  priorityOptions, statusOptions, defaultCategories,
  colorLabels, repeatOptions,
} from '../../constants/tasks'
import { cn } from '../../utils/cn'
import { IconButton } from '../ui/IconButton'
import { Button } from '../ui/Button'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildDraft(task) {
  return {
    title:            task?.title            ?? '',
    description:      task?.description      ?? task?.notes ?? '',
    priority:         task?.priority         ?? 'medium',
    status:           task?.status           ?? 'pending',
    category:         task?.category         ?? 'Focus',
    tags:             Array.isArray(task?.tags) ? task.tags.join(', ') : (task?.tags ?? ''),
    dueDate:          task?.dueDate          ?? '',
    completed:        task?.completed        ?? false,
    progress:         task?.progress         ?? 0,
    pinned:           task?.pinned           ?? false,
    colorLabel:       task?.colorLabel       ?? '',
    estimatedMinutes: task?.estimatedMinutes ?? '',
    repeatOption:     task?.repeatOption     ?? '',
    subtasks:         Array.isArray(task?.subtasks)
      ? task.subtasks.map((s) => ({ ...s }))
      : [],
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, children }) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </p>
  )
}

function FieldWrap({ children, className }) {
  return <div className={cn('grid gap-1.5', className)}>{children}</div>
}

function ProgressSlider({ value, onChange }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600 dark:text-slate-300">Progress</span>
        <span className="font-semibold text-teal-600 dark:text-teal-300">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-500 dark:bg-white/10"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

function SubtaskItem({ subtask, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange({ ...subtask, completed: !subtask.completed })}
        className={cn(
          'grid h-5 w-5 flex-none place-items-center rounded-md border transition',
          subtask.completed
            ? 'border-teal-500 bg-teal-500 text-white'
            : 'border-slate-300 bg-white/60 dark:border-white/20 dark:bg-white/10',
        )}
      >
        {subtask.completed && <span className="text-[10px] font-bold">✓</span>}
      </button>
      <input
        type="text"
        value={subtask.title}
        onChange={(e) => onChange({ ...subtask, title: e.target.value })}
        placeholder="Subtask title"
        className={cn(
          'flex-1 rounded-xl border border-slate-200/80 bg-white/60 px-3 py-1.5 text-sm outline-none transition',
          'placeholder:text-slate-400 focus:border-teal-400 dark:border-white/10 dark:bg-white/10 dark:text-white',
          subtask.completed && 'line-through opacity-60',
        )}
      />
      <button
        type="button"
        onClick={onDelete}
        className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function EditTaskModal({ task, open, onClose, onSave, isSaving }) {
  const [draft, setDraft]         = useState(() => buildDraft(task))
  const [newSubtask, setNewSubtask] = useState('')
  const titleRef                  = useRef(null)

  // Re-populate when task changes (e.g. user clicks edit on a different task)
  useEffect(() => {
    setDraft(buildDraft(task))
    setNewSubtask('')
  }, [task])

  // Focus title on open
  useEffect(() => {
    if (open) setTimeout(() => titleRef.current?.focus(), 80)
  }, [open])

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft])

  function set(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  function addSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    set('subtasks', [
      ...draft.subtasks,
      { id: crypto.randomUUID(), title, completed: false },
    ])
    setNewSubtask('')
  }

  function updateSubtask(index, updated) {
    const next = [...draft.subtasks]
    next[index] = updated
    set('subtasks', next)
  }

  function deleteSubtask(index) {
    set('subtasks', draft.subtasks.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    if (!draft.title.trim()) return
    const payload = {
      ...draft,
      tags: draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      progress:         Number(draft.progress),
      estimatedMinutes: draft.estimatedMinutes !== '' ? Number(draft.estimatedMinutes) : undefined,
      // Sync completed ↔ status
      completed: draft.status === 'completed' ? true : draft.completed,
      status:    draft.completed && draft.status === 'pending' ? 'completed' : draft.status,
    }
    onSave(payload)
  }

  const completedSubtasks = draft.subtasks.filter((s) => s.completed).length
  const selectedColor = colorLabels.find((c) => c.value === draft.colorLabel)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 pt-16 sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#111827]/95"
          >
            {/* Color label accent bar */}
            {selectedColor?.hex && selectedColor.hex !== 'transparent' && (
              <div className="h-1 w-full" style={{ background: selectedColor.hex }} />
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-300">
                  <Flag className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">Edit Task</h2>
                  <p className="text-xs text-slate-400">Ctrl+Enter to save · Esc to cancel</p>
                </div>
              </div>
              <IconButton label="Close" onClick={onClose}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="grid gap-6">

                {/* Title */}
                <FieldWrap>
                  <SectionLabel icon={AlignLeft}>Title</SectionLabel>
                  <input
                    ref={titleRef}
                    type="text"
                    value={draft.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Task title"
                    required
                    className="field-control text-base font-medium"
                  />
                </FieldWrap>

                {/* Description */}
                <FieldWrap>
                  <SectionLabel icon={AlignLeft}>Description / Notes</SectionLabel>
                  <textarea
                    value={draft.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Add context, links, or acceptance criteria…"
                    rows={3}
                    className="field-control min-h-[80px] resize-y py-3 leading-6"
                  />
                </FieldWrap>

                {/* Progress */}
                <FieldWrap>
                  <ProgressSlider value={draft.progress} onChange={(v) => set('progress', v)} />
                </FieldWrap>

                {/* Priority + Status row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldWrap>
                    <SectionLabel icon={Flag}>Priority</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {priorityOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set('priority', opt.value)}
                          className={cn(
                            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                            draft.priority === opt.value
                              ? opt.tone + ' ring-2 ring-offset-1 ring-current'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15',
                          )}
                        >
                          <span className={cn('h-2 w-2 rounded-full', opt.dot)} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FieldWrap>

                  <FieldWrap>
                    <SectionLabel icon={Layers}>Status</SectionLabel>
                    <div className="relative">
                      <select
                        value={draft.status}
                        onChange={(e) => {
                          const s = e.target.value
                          set('status', s)
                          if (s === 'completed') set('completed', true)
                          else if (s === 'pending' || s === 'in_progress') set('completed', false)
                        }}
                        className="select-control pr-8"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FieldWrap>
                </div>

                {/* Category + Due date row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldWrap>
                    <SectionLabel icon={Layers}>Category</SectionLabel>
                    <div className="relative">
                      <select
                        value={draft.category}
                        onChange={(e) => set('category', e.target.value)}
                        className="select-control pr-8"
                      >
                        {defaultCategories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FieldWrap>

                  <FieldWrap>
                    <SectionLabel icon={Calendar}>Due Date</SectionLabel>
                    <input
                      type="date"
                      value={draft.dueDate}
                      onChange={(e) => set('dueDate', e.target.value)}
                      className="field-control"
                    />
                  </FieldWrap>
                </div>

                {/* Tags */}
                <FieldWrap>
                  <SectionLabel icon={Tag}>Tags</SectionLabel>
                  <input
                    type="text"
                    value={draft.tags}
                    onChange={(e) => set('tags', e.target.value)}
                    placeholder="planning, deep-work, review (comma separated)"
                    className="field-control"
                  />
                </FieldWrap>

                {/* Estimated time + Repeat row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldWrap>
                    <SectionLabel icon={Clock}>Estimated Time (min)</SectionLabel>
                    <input
                      type="number"
                      min={0}
                      step={15}
                      value={draft.estimatedMinutes}
                      onChange={(e) => set('estimatedMinutes', e.target.value)}
                      placeholder="e.g. 60"
                      className="field-control"
                    />
                  </FieldWrap>

                  <FieldWrap>
                    <SectionLabel icon={Repeat}>Repeat</SectionLabel>
                    <div className="relative">
                      <select
                        value={draft.repeatOption}
                        onChange={(e) => set('repeatOption', e.target.value)}
                        className="select-control pr-8"
                      >
                        {repeatOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FieldWrap>
                </div>

                {/* Color label + Pin row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldWrap>
                    <SectionLabel icon={Palette}>Color Label</SectionLabel>
                    <div className="flex flex-wrap gap-2">
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
                  </FieldWrap>

                  <FieldWrap>
                    <SectionLabel icon={Pin}>Options</SectionLabel>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => set('pinned', !draft.pinned)}
                        className={cn(
                          'flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition',
                          draft.pinned
                            ? 'border-teal-400 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-500/15 dark:text-teal-300'
                            : 'border-slate-200 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-300',
                        )}
                      >
                        <Pin className="h-3.5 w-3.5" />
                        {draft.pinned ? 'Pinned' : 'Pin task'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !draft.completed
                          set('completed', next)
                          set('status', next ? 'completed' : 'in_progress')
                          if (next) set('progress', 100)
                        }}
                        className={cn(
                          'flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition',
                          draft.completed
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'border-slate-200 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-300',
                        )}
                      >
                        <CheckSquare className="h-3.5 w-3.5" />
                        {draft.completed ? 'Completed' : 'Mark done'}
                      </button>
                    </div>
                  </FieldWrap>
                </div>

                {/* Subtasks */}
                <FieldWrap>
                  <SectionLabel icon={CheckSquare}>
                    Subtasks
                    {draft.subtasks.length > 0 && (
                      <span className="ml-1 rounded-full bg-teal-500/15 px-1.5 py-0.5 text-[10px] text-teal-600 dark:text-teal-300">
                        {completedSubtasks}/{draft.subtasks.length}
                      </span>
                    )}
                  </SectionLabel>

                  <div className="grid gap-2">
                    {draft.subtasks.map((subtask, i) => (
                      <SubtaskItem
                        key={subtask.id}
                        subtask={subtask}
                        onChange={(updated) => updateSubtask(i, updated)}
                        onDelete={() => deleteSubtask(i)}
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                      placeholder="Add subtask… (Enter to add)"
                      className="field-control flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addSubtask}
                      className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/80 bg-white/60 text-slate-500 transition hover:bg-teal-50 hover:text-teal-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </FieldWrap>

              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200/70 px-5 py-4 dark:border-white/10">
              <p className="text-xs text-slate-400">
                {draft.subtasks.length > 0 && `${completedSubtasks}/${draft.subtasks.length} subtasks · `}
                {draft.progress}% progress
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" type="button" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving || !draft.title.trim()}
                >
                  {isSaving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save task</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
