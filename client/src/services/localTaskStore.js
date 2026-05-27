const storageKey = 'momentum.tasks.v2'

export const starterTasks = [
  {
    id: 'task-1',
    title: 'Shape weekly execution plan',
    description: 'Turn the product backlog into a realistic, focused sprint plan.',
    priority: 'high',
    status: 'in_progress',
    category: 'Product',
    tags: ['planning', 'focus'],
    dueDate: new Date().toISOString().slice(0, 10),
    completed: false,
    progress: 40,
    pinned: true,
    colorLabel: 'teal',
    estimatedMinutes: 90,
    repeatOption: '',
    subtasks: [
      { id: 'st-1', title: 'Review backlog items', completed: true },
      { id: 'st-2', title: 'Assign priorities', completed: false },
      { id: 'st-3', title: 'Set sprint goals', completed: false },
    ],
    order: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    updatedAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 'task-2',
    title: 'Polish mobile task interactions',
    description: 'Review spacing, tap targets, and empty states on small screens.',
    priority: 'medium',
    status: 'pending',
    category: 'Design',
    tags: ['mobile', 'ui'],
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    completed: false,
    progress: 0,
    pinned: false,
    colorLabel: 'blue',
    estimatedMinutes: 60,
    repeatOption: '',
    subtasks: [],
    order: 2,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'task-3',
    title: 'Archive completed launch notes',
    description: 'Keep the dashboard clean and activity history accurate.',
    priority: 'low',
    status: 'completed',
    category: 'Ops',
    tags: ['cleanup'],
    dueDate: '',
    completed: true,
    progress: 100,
    pinned: false,
    colorLabel: '',
    estimatedMinutes: 30,
    repeatOption: '',
    subtasks: [
      { id: 'st-4', title: 'Export notes to archive', completed: true },
    ],
    order: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    updatedAt: Date.now() - 1000 * 60 * 60,
  },
]

export function readTasks() {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : starterTasks
  } catch {
    return starterTasks
  }
}

export function writeTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks))
}
