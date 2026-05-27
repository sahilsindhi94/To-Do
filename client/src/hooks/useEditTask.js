import { useState, useCallback } from 'react'
import { useTasks } from '../context/TaskContext'
import { useToast } from '../context/ToastContext'

/**
 * Centralised edit-task state + submit logic.
 * Used by both DashboardPage and TasksPage so the modal
 * always has the correct task._id and mutation path.
 */
export function useEditTask() {
  const [editingTask, setEditingTask] = useState(null)
  const [isSaving, setIsSaving]       = useState(false)
  const { updateTask } = useTasks()
  const { notify }     = useToast()

  const openEdit  = useCallback((task) => setEditingTask(task), [])
  const closeEdit = useCallback(() => setEditingTask(null), [])

  const saveEdit = useCallback(async (payload) => {
    if (!editingTask) return
    // Use _id for Convex, id for local fallback
    const id = editingTask._id ?? editingTask.id
    if (!id) {
      notify('Cannot save: task has no ID', 'error')
      return
    }
    setIsSaving(true)
    try {
      await updateTask(id, payload)
      notify('Task saved')
      setEditingTask(null)
    } catch (err) {
      console.error('[useEditTask] update failed:', err)
      notify(`Save failed: ${err?.message ?? err}`, 'error')
    } finally {
      setIsSaving(false)
    }
  }, [editingTask, notify, updateTask])

  return { editingTask, isSaving, openEdit, closeEdit, saveEdit }
}
