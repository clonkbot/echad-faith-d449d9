import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Daily devotionals and scripture readings
  devotionals: defineTable({
    title: v.string(),
    scripture: v.string(),
    scriptureReference: v.string(),
    reflection: v.string(),
    date: v.string(),
    tradition: v.union(v.literal("shared"), v.literal("christian"), v.literal("jewish")),
    createdAt: v.number(),
  }).index("by_date", ["date"]).index("by_tradition", ["tradition"]),

  // Prayer requests from the community
  prayerRequests: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    request: v.string(),
    category: v.string(),
    isAnonymous: v.boolean(),
    prayerCount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_created", ["createdAt"]),

  // Users who prayed for a request
  prayers: defineTable({
    userId: v.id("users"),
    prayerRequestId: v.id("prayerRequests"),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_request", ["prayerRequestId"]),

  // Generated worship music
  generatedMusic: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    title: v.string(),
    style: v.string(),
    status: v.union(v.literal("pending"), v.literal("generating"), v.literal("completed"), v.literal("failed")),
    audioUrl: v.optional(v.string()),
    lyrics: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_status", ["status"]),

  // AI-generated reflections and content
  aiReflections: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    response: v.string(),
    category: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Community blessings and encouragements
  blessings: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    message: v.string(),
    tradition: v.union(v.literal("hebrew"), v.literal("christian"), v.literal("shared")),
    likes: v.number(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]).index("by_tradition", ["tradition"]),
});
