import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    habits: defineTable({
        userId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        frequency: v.array(v.string()), // e.g., ["Mon", "Tue"] or ["Daily"]
        xpReward: v.number(),
        type: v.optional(v.union(v.literal("positive"), v.literal("negative"), v.literal("both"))),
        difficulty: v.optional(v.union(v.literal("trivial"), v.literal("easy"), v.literal("medium"), v.literal("hard"))),
        streak: v.optional(v.number()),
        createdAt: v.number(),
        archived: v.boolean(),
    }).index("by_user", ["userId"]),

    habitLogs: defineTable({
        habitId: v.id("habits"),
        userId: v.string(),
        completedAt: v.number(),
        date: v.string(), // YYYY-MM-DD for easy daily querying
        type: v.optional(v.string()), // "positive" or "negative" action
    })
        .index("by_user_date", ["userId", "date"])
        .index("by_habit", ["habitId"]),

    dailies: defineTable({
        userId: v.string(),
        title: v.string(),
        notes: v.optional(v.string()),
        checklist: v.array(v.object({ id: v.string(), text: v.string(), completed: v.boolean() })),
        startDate: v.number(),
        daysActive: v.array(v.string()), // ["Mon", "Tue", ...] or ["Everyday"]
        difficulty: v.union(v.literal("trivial"), v.literal("easy"), v.literal("medium"), v.literal("hard")),
        isCompleted: v.boolean(),
        lastCompletedDate: v.optional(v.string()), // YYYY-MM-DD
        streak: v.number(),
    }).index("by_user", ["userId"]),

    todos: defineTable({
        userId: v.string(),
        title: v.string(),
        notes: v.optional(v.string()),
        checklist: v.array(v.object({ id: v.string(), text: v.string(), completed: v.boolean() })),
        difficulty: v.union(v.literal("trivial"), v.literal("easy"), v.literal("medium"), v.literal("hard")),
        dueDate: v.optional(v.number()),
        isCompleted: v.boolean(),
        completedAt: v.optional(v.number()),
    }).index("by_user", ["userId"]),

    rewards: defineTable({
        userId: v.string(),
        title: v.string(),
        notes: v.optional(v.string()),
        cost: v.number(),
        icon: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    badges: defineTable({
        slug: v.string(),
        title: v.string(),
        description: v.string(),
        icon: v.string(),
        category: v.union(v.literal("habit"), v.literal("pomodoro"), v.literal("streak"), v.literal("level")),
        conditionValue: v.number(),
    }).index("by_slug", ["slug"]),

    userBadges: defineTable({
        userId: v.string(),
        badgeId: v.id("badges"),
        earnedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_badge", ["userId", "badgeId"]),

    users: defineTable({
        userId: v.string(), // Clerk ID
        name: v.string(),
        email: v.string(),
        level: v.number(),
        xp: v.number(),
        streak: v.number(), // Current streak
        longestStreak: v.optional(v.number()),
        gold: v.optional(v.number()),
        hp: v.optional(v.number()),
        maxHp: v.optional(v.number()),
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
