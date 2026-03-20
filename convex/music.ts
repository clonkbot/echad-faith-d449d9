import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("generatedMusic")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("generatedMusic")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
    title: v.string(),
    style: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("generatedMusic", {
      userId,
      prompt: args.prompt,
      title: args.title,
      style: args.style,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("generatedMusic"),
    status: v.union(v.literal("pending"), v.literal("generating"), v.literal("completed"), v.literal("failed")),
    audioUrl: v.optional(v.string()),
    lyrics: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Suno API integration action
export const generateMusic = action({
  args: {
    musicId: v.id("generatedMusic"),
    prompt: v.string(),
    style: v.string(),
  },
  handler: async (ctx, args) => {
    // Update status to generating
    await ctx.runMutation(api.music.updateStatus, {
      id: args.musicId,
      status: "generating",
    });

    // Note: Suno API integration would go here
    // For demo purposes, we'll simulate the generation
    // In production, you would call the Suno API:
    // const response = await fetch('https://api.suno.ai/v1/generate', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     prompt: args.prompt,
    //     style: args.style,
    //   }),
    // });

    // Simulate completion with placeholder data
    const sampleLyrics = `Verse 1:
In the light of Your grace, we find our way
Through the darkness of night to a brighter day
Your love shines eternal, guiding our path
${args.style === "hebrew" ? "Baruch Hashem, we lift our praise" : "Hallelujah, we lift our praise"}

Chorus:
${args.prompt}
United in faith, we stand as one
Children of Abraham, beneath the sun`;

    await ctx.runMutation(api.music.updateStatus, {
      id: args.musicId,
      status: "completed",
      audioUrl: "https://example.com/sample-worship.mp3",
      lyrics: sampleLyrics,
    });

    return { success: true };
  },
});
