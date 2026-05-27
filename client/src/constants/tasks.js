export const priorityOptions = [
  { value: 'low',    label: 'Low',    tone: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',  dot: 'bg-emerald-500' },
  { value: 'medium', label: 'Medium', tone: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',        dot: 'bg-amber-500'   },
  { value: 'high',   label: 'High',   tone: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',           dot: 'bg-rose-500'    },
  { value: 'urgent', label: 'Urgent', tone: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',     dot: 'bg-purple-500'  },
]

export const statusOptions = [
  { value: 'pending',     label: 'Pending',     tone: 'bg-slate-500/15 text-slate-600 dark:text-slate-300'   },
  { value: 'in_progress', label: 'In Progress', tone: 'bg-blue-500/15 text-blue-700 dark:text-blue-300'      },
  { value: 'completed',   label: 'Completed',   tone: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
  { value: 'archived',    label: 'Archived',    tone: 'bg-slate-500/10 text-slate-500 dark:text-slate-400'   },
]

export const filterOptions = [
  { value: 'all',       label: 'All tasks'  },
  { value: 'active',    label: 'Active'     },
  { value: 'completed', label: 'Done'       },
  { value: 'today',     label: 'Due today'  },
  { value: 'pinned',    label: 'Pinned'     },
  { value: 'urgent',    label: 'Urgent'     },
]

export const defaultCategories = ['Focus', 'Product', 'Design', 'Personal', 'Ops', 'Learning', 'Health']

export const colorLabels = [
  { value: '',        label: 'None',   hex: 'transparent' },
  { value: 'teal',   label: 'Teal',   hex: '#2dd4bf'     },
  { value: 'blue',   label: 'Blue',   hex: '#60a5fa'     },
  { value: 'purple', label: 'Purple', hex: '#a78bfa'     },
  { value: 'rose',   label: 'Rose',   hex: '#fb7185'     },
  { value: 'amber',  label: 'Amber',  hex: '#fbbf24'     },
  { value: 'green',  label: 'Green',  hex: '#4ade80'     },
]

export const repeatOptions = [
  { value: '',        label: 'No repeat'  },
  { value: 'daily',   label: 'Daily'      },
  { value: 'weekly',  label: 'Weekly'     },
  { value: 'monthly', label: 'Monthly'    },
]

export const activityIcons = {
  created:          { emoji: '✨', label: 'Created'          },
  updated:          { emoji: '✏️',  label: 'Updated'          },
  deleted:          { emoji: '🗑️',  label: 'Deleted'          },
  completed:        { emoji: '✅', label: 'Completed'        },
  reopened:         { emoji: '🔄', label: 'Reopened'         },
  status_changed:   { emoji: '🔀', label: 'Status changed'   },
  priority_changed: { emoji: '🚨', label: 'Priority changed' },
}
