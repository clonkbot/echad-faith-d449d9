import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const devotional = await ctx.db
      .query("devotionals")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();
    return devotional;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 7;
    return await ctx.db
      .query("devotionals")
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    scripture: v.string(),
    scriptureReference: v.string(),
    reflection: v.string(),
    date: v.string(),
    tradition: v.union(v.literal("shared"), v.literal("christian"), v.literal("jewish")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("devotionals", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
