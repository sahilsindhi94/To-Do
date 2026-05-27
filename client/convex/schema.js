import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,

  tasks: defineTable({
    ownerKey:         v.string(),
    title:            v.string(),
    // Legacy field kept optional for existing docs
    notes:            v.optional(v.string()),
    // New fields — all optional so existing docs pass validation
    description:      v.optional(v.string()),
    priority:         v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent')),
    status:           v.optional(v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'), v.literal('archived'))),
    category:         v.string(),
    tags:             v.array(v.string()),
    dueDate:          v.optional(v.string()),
    completed:        v.boolean(),
    progress:         v.optional(v.number()),
    pinned:           v.optional(v.boolean()),
    colorLabel:       v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    repeatOption:     v.optional(v.string()),
    subtasks:         v.optional(v.array(v.object({
      id:        v.string(),
      title:     v.string(),
      completed: v.boolean(),
    }))),
    order:     v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner',           ['ownerKey'])
    .index('by_owner_completed', ['ownerKey', 'completed'])
    .index('by_owner_status',    ['ownerKey', 'status'])
    .index('by_owner_priority',  ['ownerKey', 'priority'])
    .index('by_owner_order',     ['ownerKey', 'order'])
    .index('by_owner_pinned',    ['ownerKey', 'pinned']),

  activity: defineTable({
    ownerKey:  v.string(),
    taskId:    v.optional(v.id('tasks')),
    taskTitle: v.optional(v.string()),
    type:      v.optional(v.union(
      v.literal('created'),
      v.literal('updated'),
      v.literal('deleted'),
      v.literal('completed'),
      v.literal('reopened'),
      v.literal('status_changed'),
      v.literal('priority_changed'),
    )),
    message:   v.string(),
    meta:      v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_owner_time', ['ownerKey', 'createdAt'])
    .index('by_task',       ['taskId']),

  categories: defineTable({
    ownerKey:  v.string(),
    name:      v.string(),
    color:     v.optional(v.string()),
    icon:      v.optional(v.string()),
    order:     v.number(),
    createdAt: v.number(),
  })
    .index('by_owner',       ['ownerKey'])
    .index('by_owner_order', ['ownerKey', 'order']),
})
