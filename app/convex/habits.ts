import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("habits")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .filter((q) => q.eq(q.field("archived"), false))
            .collect();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        frequency: v.array(v.string()),
        xpReward: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const habitId = await ctx.db.insert("habits", {
            userId: identity.subject,
            title: args.title,
            description: args.description,
            frequency: args.frequency,
            xpReward: args.xpReward,
            createdAt: Date.now(),
            archived: false,
        });

        return habitId;
    },
});

export const getTodayLogs = query({
    args: { date: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("habitLogs")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", identity.subject).eq("date", args.date)
            )
            .collect();
    },
});

export const check = mutation({
    args: { habitId: v.id("habits"), date: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const habit = await ctx.db.get(args.habitId);
        if (!habit || habit.userId !== identity.subject) {
            throw new Error("Habit not found or unauthorized");
        }

        // Check if already completed
        const existingLog = await ctx.db
            .query("habitLogs")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", identity.subject).eq("date", args.date)
            )
            .filter((q) => q.eq(q.field("habitId"), args.habitId))
            .first();

        if (existingLog) return; // Already completed

        // Log completion
        await ctx.db.insert("habitLogs", {
            habitId: args.habitId,
            userId: identity.subject,
            date: args.date,
            completedAt: Date.now(),
        });

        // Award XP
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const newXp = user.xp + habit.xpReward;
            const newLevel = Math.floor(newXp / 1000) + 1;
            await ctx.db.patch(user._id, { xp: newXp, level: newLevel });
        }
    },
});

export const uncheck = mutation({
    args: { habitId: v.id("habits"), date: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const habit = await ctx.db.get(args.habitId);
        if (!habit || habit.userId !== identity.subject) {
            throw new Error("Habit not found or unauthorized");
        }

        const existingLog = await ctx.db
            .query("habitLogs")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", identity.subject).eq("date", args.date)
            )
            .filter((q) => q.eq(q.field("habitId"), args.habitId))
            .first();

        if (!existingLog) return; // Not completed

        await ctx.db.delete(existingLog._id);

        // Remove XP
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const newXp = Math.max(0, user.xp - habit.xpReward);
            const newLevel = Math.floor(newXp / 1000) + 1;
            await ctx.db.patch(user._id, { xp: newXp, level: newLevel });
        }
    },
});
