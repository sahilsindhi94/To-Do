/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api, hasConvexUrl } from '../convex/api'
import { readTasks, writeTasks } from '../services/localTaskStore'

const TaskContext = createContext(null)
const ownerKeyStorageKey = 'momentum-owner-key'

function getOwnerKey() {
  if (typeof window === 'undefined') return 'server'
  const existing = window.localStorage.getItem(ownerKeyStorageKey)
  if (existing) return existing
  const ownerKey = crypto.randomUUID()
  window.localStorage.setItem(ownerKeyStorageKey, ownerKey)
  return ownerKey
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return (a.order ?? 0) - (b.order ?? 0)
  })
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'create':
      return sortTasks([
        {
          ...action.payload,
          id: crypto.randomUUID(),
          status: action.payload.status ?? 'pending',
          progress: action.payload.progress ?? 0,
          pinned: action.payload.pinned ?? false,
          colorLabel: action.payload.colorLabel ?? '',
          subtasks: action.payload.subtasks ?? [],
          estimatedMinutes: action.payload.estimatedMinutes,
          repeatOption: action.payload.repeatOption ?? '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          order: state.length + 1,
        },
        ...state,
      ])
    case 'update':
      return state.map((task) =>
        task.id === action.id
          ? { ...task, ...action.payload, updatedAt: Date.now() }
          : task
      )
    case 'delete':
      return state.filter((task) => task.id !== action.id)
    case 'reorder':
      return action.payload.map((task, index) => ({ ...task, order: index + 1, updatedAt: Date.now() }))
    case 'toggle_pin':
      return sortTasks(
        state.map((task) =>
          task.id === action.id ? { ...task, pinned: !task.pinned, updatedAt: Date.now() } : task
        )
      )
    default:
      return state
  }
}

// ─── Local (no Convex) provider ──────────────────────────────────────────────

function LocalTaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, readTasks)

  useEffect(() => {
    writeTasks(tasks)
  }, [tasks])

  const value = useMemo(() => ({
    tasks: sortTasks(tasks),
    isLoading: false,
    ownerKey: 'local',
    createTask:  async (payload) => dispatch({ type: 'create', payload }),
    updateTask:  async (id, payload) => dispatch({ type: 'update', id, payload }),
    deleteTask:  async (id) => dispatch({ type: 'delete', id }),
    reorderTasks: async (nextTasks) => dispatch({ type: 'reorder', payload: nextTasks }),
    togglePin:   async (id) => dispatch({ type: 'toggle_pin', id }),
  }), [tasks])

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// ─── Convex provider ─────────────────────────────────────────────────────────

function ConvexTaskProvider({ children }) {
  const ownerKey = useMemo(getOwnerKey, [])
  const tasks = useQuery(api.tasks.list, { ownerKey })

  const createTaskMutation  = useMutation(api.tasks.create)
  const updateTaskMutation  = useMutation(api.tasks.update)
  const deleteTaskMutation  = useMutation(api.tasks.remove)
  const reorderTasksMutation = useMutation(api.tasks.reorder)
  const togglePinMutation   = useMutation(api.tasks.togglePin)

  const value = useMemo(() => ({
    tasks: sortTasks(tasks ?? []),
    isLoading: tasks === undefined,
    ownerKey,

    createTask: (payload) =>
      createTaskMutation({ ownerKey, ...payload }),

    updateTask: (id, payload) => {
      // Pass only defined fields — Convex rejects undefined values
      const clean = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      )
      return updateTaskMutation({ ownerKey, id, ...clean })
    },

    deleteTask: (id) => deleteTaskMutation({ ownerKey, id }),

    reorderTasks: (nextTasks) =>
      reorderTasksMutation({
        ownerKey,
        orderedIds: nextTasks.map((t) => t._id || t.id),
      }),

    togglePin: (id) => togglePinMutation({ ownerKey, id }),
  }), [
    createTaskMutation,
    deleteTaskMutation,
    ownerKey,
    reorderTasksMutation,
    tasks,
    togglePinMutation,
    updateTaskMutation,
  ])

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function TaskProvider({ children }) {
  return hasConvexUrl
    ? <ConvexTaskProvider>{children}</ConvexTaskProvider>
    : <LocalTaskProvider>{children}</LocalTaskProvider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used inside TaskProvider')
  return context
}
