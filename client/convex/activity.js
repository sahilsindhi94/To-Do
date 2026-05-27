import { v } from 'convex/values'
import { query } from './_generated/server'

export const recent = query({
  args: { ownerKey: v.string() },
  handler: async (ctx, { ownerKey }) => {
    return await ctx.db
      .query('activity')
      .withIndex('by_owner_time', (q) => q.eq('ownerKey', ownerKey))
      .order('desc')
      .take(12)
  },
})

export const forTask = query({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    return await ctx.db
      .query('activity')
      .withIndex('by_task', (q) => q.eq('taskId', taskId))
      .order('desc')
      .collect()
  },
})
