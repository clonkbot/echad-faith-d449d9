import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { tradition: v.optional(v.union(v.literal("hebrew"), v.literal("christian"), v.literal("shared"))) },
  handler: async (ctx, args) => {
    if (args.tradition) {
      return await ctx.db
        .query("blessings")
        .withIndex("by_tradition", (q) => q.eq("tradition", args.tradition!))
        .order("desc")
        .take(50);
    }
    return await ctx.db
      .query("blessings")
      .withIndex("by_created")
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: {
    message: v.string(),
    tradition: v.union(v.literal("hebrew"), v.literal("christian"), v.literal("shared")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    const userName = user?.email?.split("@")[0] ?? "User";

    return await ctx.db.insert("blessings", {
      userId,
      userName,
      message: args.message,
      tradition: args.tradition,
      likes: 0,
      createdAt: Date.now(),
    });
  },
});

export const like = mutation({
  args: { id: v.id("blessings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const blessing = await ctx.db.get(args.id);
    if (blessing) {
      await ctx.db.patch(args.id, {
        likes: blessing.likes + 1,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("blessings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const blessing = await ctx.db.get(args.id);
    if (!blessing || blessing.userId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
