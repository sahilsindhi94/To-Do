import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
  args: { ownerKey: v.string() },
  handler: async (ctx, { ownerKey }) => {
    return await ctx.db
      .query('categories')
      .withIndex('by_owner_order', (q) => q.eq('ownerKey', ownerKey))
      .collect()
  },
})

export const create = mutation({
  args: {
    ownerKey: v.string(),
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('categories')
      .withIndex('by_owner', (q) => q.eq('ownerKey', args.ownerKey))
      .collect()

    return await ctx.db.insert('categories', {
      ownerKey: args.ownerKey,
      name: args.name,
      color: args.color ?? '#2dd4bf',
      icon: args.icon ?? '',
      order: existing.length + 1,
      createdAt: Date.now(),
    })
  },
})

export const remove = mutation({
  args: { ownerKey: v.string(), id: v.id('categories') },
  handler: async (ctx, { ownerKey, id }) => {
    const category = await ctx.db.get(id)
    if (!category || category.ownerKey !== ownerKey) throw new Error('Category not found')
    await ctx.db.delete(id)
  },
})
