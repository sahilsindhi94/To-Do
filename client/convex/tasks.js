import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// ─── Shared validators ────────────────────────────────────────────────────────

const priorityValidator = v.union(
  v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent')
)
const statusValidator = v.union(
  v.literal('pending'), v.literal('in_progress'), v.literal('completed'), v.literal('archived')
)
const subtaskValidator = v.object({ id: v.string(), title: v.string(), completed: v.boolean() })

// ─── Queries ──────────────────────────────────────────────────────────────────

export const list = query({
  args: { ownerKey: v.string() },
  handler: async (ctx, { ownerKey }) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_owner_order', (q) => q.eq('ownerKey', ownerKey))
      .collect()
  },
})

export const getById = query({
  args: { ownerKey: v.string(), id: v.id('tasks') },
  handler: async (ctx, { ownerKey, id }) => {
    const task = await ctx.db.get(id)
    if (!task || task.ownerKey !== ownerKey) return null
    return task
  },
})

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    ownerKey:         v.string(),
    title:            v.string(),
    description:      v.optional(v.string()),
    priority:         priorityValidator,
    status:           v.optional(statusValidator),
    category:         v.string(),
    tags:             v.array(v.string()),
    dueDate:          v.optional(v.string()),
    completed:        v.optional(v.boolean()),
    progress:         v.optional(v.number()),
    pinned:           v.optional(v.boolean()),
    colorLabel:       v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    repeatOption:     v.optional(v.string()),
    subtasks:         v.optional(v.array(subtaskValidator)),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const existing = await ctx.db
      .query('tasks')
      .withIndex('by_owner', (q) => q.eq('ownerKey', args.ownerKey))
      .collect()

    const taskId = await ctx.db.insert('tasks', {
      ownerKey:         args.ownerKey,
      title:            args.title,
      description:      args.description ?? '',
      priority:         args.priority,
      status:           args.status ?? 'pending',
      category:         args.category,
      tags:             args.tags,
      dueDate:          args.dueDate ?? '',
      completed:        args.completed ?? false,
      progress:         args.progress ?? 0,
      pinned:           args.pinned ?? false,
      colorLabel:       args.colorLabel ?? '',
      estimatedMinutes: args.estimatedMinutes,
      repeatOption:     args.repeatOption ?? '',
      subtasks:         args.subtasks ?? [],
      order:            existing.length + 1,
      createdAt:        now,
      updatedAt:        now,
    })

    await ctx.db.insert('activity', {
      ownerKey:  args.ownerKey,
      taskId,
      taskTitle: args.title,
      type:      'created',
      message:   `Created "${args.title}"`,
      createdAt: now,
    })

    return taskId
  },
})

export const update = mutation({
  args: {
    ownerKey:         v.string(),
    id:               v.id('tasks'),
    title:            v.optional(v.string()),
    description:      v.optional(v.string()),
    priority:         v.optional(priorityValidator),
    status:           v.optional(statusValidator),
    category:         v.optional(v.string()),
    tags:             v.optional(v.array(v.string())),
    dueDate:          v.optional(v.string()),
    completed:        v.optional(v.boolean()),
    progress:         v.optional(v.number()),
    pinned:           v.optional(v.boolean()),
    colorLabel:       v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    repeatOption:     v.optional(v.string()),
    subtasks:         v.optional(v.array(subtaskValidator)),
  },
  handler: async (ctx, { ownerKey, id, ...patch }) => {
    const task = await ctx.db.get(id)
    if (!task || task.ownerKey !== ownerKey) throw new Error('Task not found or access denied')

    const now = Date.now()

    // Only include defined fields in the patch
    const cleanPatch = Object.fromEntries(
      Object.entries(patch).filter(([, val]) => val !== undefined)
    )

    await ctx.db.patch(id, { ...cleanPatch, updatedAt: now })

    // Determine activity type
    let type    = 'updated'
    let message = `Updated "${patch.title ?? task.title}"`

    if (patch.completed !== undefined && patch.completed !== task.completed) {
      type    = patch.completed ? 'completed' : 'reopened'
      message = patch.completed
        ? `Completed "${task.title}"`
        : `Reopened "${task.title}"`
    } else if (patch.status !== undefined && patch.status !== task.status) {
      type    = 'status_changed'
      message = `Changed status of "${task.title}" to ${patch.status}`
    } else if (patch.priority !== undefined && patch.priority !== task.priority) {
      type    = 'priority_changed'
      message = `Changed priority of "${task.title}" to ${patch.priority}`
    }

    await ctx.db.insert('activity', {
      ownerKey,
      taskId:    id,
      taskTitle: patch.title ?? task.title,
      type,
      message,
      createdAt: now,
    })
  },
})

export const remove = mutation({
  args: { ownerKey: v.string(), id: v.id('tasks') },
  handler: async (ctx, { ownerKey, id }) => {
    const task = await ctx.db.get(id)
    if (!task || task.ownerKey !== ownerKey) throw new Error('Task not found or access denied')

    await ctx.db.delete(id)

    await ctx.db.insert('activity', {
      ownerKey,
      taskId:    id,
      taskTitle: task.title,
      type:      'deleted',
      message:   `Deleted "${task.title}"`,
      createdAt: Date.now(),
    })
  },
})

export const reorder = mutation({
  args: { ownerKey: v.string(), orderedIds: v.array(v.id('tasks')) },
  handler: async (ctx, { ownerKey, orderedIds }) => {
    await Promise.all(
      orderedIds.map(async (id, index) => {
        const task = await ctx.db.get(id)
        if (task && task.ownerKey === ownerKey) {
          await ctx.db.patch(id, { order: index + 1, updatedAt: Date.now() })
        }
      })
    )
  },
})

export const togglePin = mutation({
  args: { ownerKey: v.string(), id: v.id('tasks') },
  handler: async (ctx, { ownerKey, id }) => {
    const task = await ctx.db.get(id)
    if (!task || task.ownerKey !== ownerKey) throw new Error('Task not found')
    await ctx.db.patch(id, { pinned: !task.pinned, updatedAt: Date.now() })
  },
})
