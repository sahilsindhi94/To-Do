import { useMemo } from 'react'

function isToday(value) {
  if (!value) return false
  return new Date(value).toDateString() === new Date().toDateString()
}

export function useFilteredTasks(tasks, { query, filter, category }) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()

    return tasks.filter((task) => {
      // Text search across title, description, category, tags
      const matchesQuery = !q || [
        task.title,
        task.description,
        task.category,
        ...(task.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)

      // Status/filter
      const matchesFilter =
        filter === 'all'       ? true :
        filter === 'active'    ? !task.completed :
        filter === 'completed' ? task.completed :
        filter === 'today'     ? isToday(task.dueDate) :
        filter === 'pinned'    ? task.pinned :
        filter === 'urgent'    ? task.priority === 'urgent' :
        true

      // Category
      const matchesCategory = category === 'all' || task.category === category

      return matchesQuery && matchesFilter && matchesCategory
    })
  }, [category, filter, query, tasks])
}
