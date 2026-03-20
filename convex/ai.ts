import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getReflections = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("aiReflections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const saveReflection = mutation({
  args: {
    prompt: v.string(),
    response: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("aiReflections", {
      userId,
      prompt: args.prompt,
      response: args.response,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});

// Claude API integration for generating spiritual content
export const generateReflection = action({
  args: {
    prompt: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Note: Claude API integration
    // In production with API key:
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': process.env.CLAUDE_API_KEY,
    //     'anthropic-version': '2023-06-01',
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-3-sonnet-20240229',
    //     max_tokens: 1024,
    //     messages: [{
    //       role: 'user',
    //       content: `You are a spiritual guide knowledgeable in both Christian and Jewish traditions. Please provide a thoughtful, respectful reflection on: ${args.prompt}`
    //     }]
    //   }),
    // });

    // Simulated response for demo
    const reflections: Record<string, string> = {
      scripture: `The Scripture reminds us that we are all children of the same Father, descendants of Abraham through faith. As it is written in Genesis 12:3, "I will bless those who bless you." This promise extends across generations, uniting Jewish and Christian traditions in a shared heritage of blessing and covenant.

Consider how the Psalms, treasured by both traditions, speak of God's unfailing love: "His steadfast love endures forever" (Psalm 136). May this truth anchor your soul today.`,

      prayer: `Lord of Abraham, Isaac, and Jacob, we come before You with humble hearts. We remember Your covenant promises and Your faithfulness through all generations.

Bless the house of Israel and all who seek Your face. Unite Your children in love and understanding, that together we may bring light to the world.

Baruch Atah Adonai, Blessed are You, O Lord. Amen.`,

      meditation: `Take a moment to breathe deeply and center yourself in God's presence.

Imagine yourself standing at the foot of Mount Sinai, where God revealed His word. Feel the weight of sacred history—the same God who spoke to Moses speaks to you today.

The Shema declares: "Hear, O Israel: The Lord our God, the Lord is one." Jesus affirmed this as the greatest commandment. In this truth, Jewish and Christian hearts beat as one.

Rest in the knowledge that you are beloved, chosen, and called to be a blessing to all nations.`,

      blessing: `May the Lord bless you and keep you.
May His face shine upon you and be gracious to you.
May He lift up His countenance upon you and give you shalom—peace.

This ancient Aaronic blessing (Numbers 6:24-26) has been spoken over God's people for thousands of years. Today, may it rest upon you afresh, reminding you of the unbroken thread of faith that connects all who love the God of Israel.`,
    };

    const response = reflections[args.category] || reflections.blessing;

    // Save the reflection
    await ctx.runMutation(api.ai.saveReflection, {
      prompt: args.prompt,
      response,
      category: args.category,
    });

    return { response };
  },
});
