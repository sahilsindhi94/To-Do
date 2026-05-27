export function getTaskStats(tasks) {
  const total       = tasks.length
  const completed   = tasks.filter((t) => t.completed).length
  const pending     = tasks.filter((t) => !t.completed && t.status !== 'archived').length
  const inProgress  = tasks.filter((t) => t.status === 'in_progress').length
  const archived    = tasks.filter((t) => t.status === 'archived').length
  const pinned      = tasks.filter((t) => t.pinned).length
  const highPriority = tasks.filter((t) => (t.priority === 'high' || t.priority === 'urgent') && !t.completed).length
  const urgent      = tasks.filter((t) => t.priority === 'urgent' && !t.completed).length
  const completionRate = total ? Math.round((completed / total) * 100) : 0
  const avgProgress = total
    ? Math.round(tasks.reduce((sum, t) => sum + (t.progress ?? 0), 0) / total)
    : 0

  // Due today
  const today = new Date().toDateString()
  const dueToday = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false
    return new Date(t.dueDate).toDateString() === today
  }).length

  // Overdue
  const now = Date.now()
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false
    return new Date(t.dueDate).getTime() < now
  }).length

  return {
    total,
    completed,
    pending,
    inProgress,
    archived,
    pinned,
    highPriority,
    urgent,
    completionRate,
    avgProgress,
    dueToday,
    overdue,
  }
}

export function getPriorityBreakdown(tasks) {
  return ['urgent', 'high', 'medium', 'low'].map((priority) => ({
    priority,
    count: tasks.filter((t) => t.priority === priority).length,
    completed: tasks.filter((t) => t.priority === priority && t.completed).length,
  }))
}

export function getStatusBreakdown(tasks) {
  return ['pending', 'in_progress', 'completed', 'archived'].map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }))
}

export function getCategoryBreakdown(tasks) {
  const map = {}
  tasks.forEach((t) => {
    if (!map[t.category]) map[t.category] = { total: 0, completed: 0 }
    map[t.category].total++
    if (t.completed) map[t.category].completed++
  })
  return Object.entries(map)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.total - a.total)
}

export function getWeeklyActivity(tasks) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      date: d.toDateString(),
      created: 0,
      completed: 0,
    }
  })

  tasks.forEach((task) => {
    const createdDate = new Date(task.createdAt).toDateString()
    const updatedDate = new Date(task.updatedAt).toDateString()
    const dayCreated = days.find((d) => d.date === createdDate)
    if (dayCreated) dayCreated.created++
    if (task.completed) {
      const dayCompleted = days.find((d) => d.date === updatedDate)
      if (dayCompleted) dayCompleted.completed++
    }
  })

  return days
}
