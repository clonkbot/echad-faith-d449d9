import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("prayerRequests")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const getMyRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("prayerRequests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    request: v.string(),
    category: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    const userName = args.isAnonymous ? "Anonymous" : (user?.email?.split("@")[0] ?? "User");

    return await ctx.db.insert("prayerRequests", {
      userId,
      userName,
      request: args.request,
      category: args.category,
      isAnonymous: args.isAnonymous,
      prayerCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const pray = mutation({
  args: { prayerRequestId: v.id("prayerRequests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already prayed
    const existing = await ctx.db
      .query("prayers")
      .withIndex("by_request", (q) => q.eq("prayerRequestId", args.prayerRequestId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existing) return;

    // Add prayer record
    await ctx.db.insert("prayers", {
      userId,
      prayerRequestId: args.prayerRequestId,
      createdAt: Date.now(),
    });

    // Increment prayer count
    const request = await ctx.db.get(args.prayerRequestId);
    if (request) {
      await ctx.db.patch(args.prayerRequestId, {
        prayerCount: request.prayerCount + 1,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("prayerRequests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.id);
    if (!request || request.userId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
