import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    habits: defineTable({
        userId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        frequency: v.array(v.string()), // e.g., ["Mon", "Tue"] or ["Daily"]
        xpReward: v.number(),
        createdAt: v.number(),
        archived: v.boolean(),
    }).index("by_user", ["userId"]),

    habitLogs: defineTable({
        habitId: v.id("habits"),
        userId: v.string(),
        completedAt: v.number(),
        date: v.string(), // YYYY-MM-DD for easy daily querying
    })
        .index("by_user_date", ["userId", "date"])
        .index("by_habit", ["habitId"]),

    users: defineTable({
        userId: v.string(), // Clerk ID
        name: v.string(),
        email: v.string(),
        level: v.number(),
        xp: v.number(),
        streak: v.number(),
        lastLoginDate: v.optional(v.string()),
    }).index("by_userId", ["userId"]),

    pomodoroSessions: defineTable({
        userId: v.string(),
        duration: v.number(), // in minutes (25, 50, etc.)
        xpReward: v.number(),
        completedAt: v.number(),
        date: v.string(), // YYYY-MM-DD
    })
        .index("by_user", ["userId"])
        .index("by_user_date", ["userId", "date"]),
});
