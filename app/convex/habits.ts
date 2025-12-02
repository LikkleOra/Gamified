import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

const DIFFICULTY_REWARDS = {
    trivial: { xp: 5, gold: 0.5, damage: 2 },
    easy: { xp: 10, gold: 1, damage: 5 },
    medium: { xp: 20, gold: 2.5, damage: 10 },
    hard: { xp: 40, gold: 5, damage: 20 },
};

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
        xpReward: v.number(), // Legacy field, we might calculate this dynamically now
        type: v.union(v.literal("positive"), v.literal("negative"), v.literal("both")),
        difficulty: v.union(v.literal("trivial"), v.literal("easy"), v.literal("medium"), v.literal("hard")),
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
            type: args.type,
            difficulty: args.difficulty,
            streak: 0,
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
    args: {
        habitId: v.id("habits"),
        date: v.string(),
        asNegative: v.optional(v.boolean()) // If true, treat as negative action
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const habit = await ctx.db.get(args.habitId);
        if (!habit || habit.userId !== identity.subject) {
            throw new Error("Habit not found or unauthorized");
        }

        // Determine if this is a positive or negative action
        const isNegative = args.asNegative || habit.type === "negative";

        // Log the action
        await ctx.db.insert("habitLogs", {
            habitId: args.habitId,
            userId: identity.subject,
            date: args.date,
            completedAt: Date.now(),
            type: isNegative ? "negative" : "positive",
        });

        // Update User Stats
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const rewards = DIFFICULTY_REWARDS[habit.difficulty as keyof typeof DIFFICULTY_REWARDS] || DIFFICULTY_REWARDS.easy;

            if (isNegative) {
                // Deduct HP
                const currentHp = user.hp || 50;
                const damage = rewards.damage;
                const newHp = currentHp - damage;

                if (newHp <= 0) {
                    // Death Penalty
                    const newLevel = Math.max(1, (user.level || 1) - 1);
                    await ctx.db.patch(user._id, {
                        hp: 50, // Reset HP
                        gold: 0, // Lose all gold
                        level: newLevel,
                        xp: 0, // Reset XP
                    });
                } else {
                    await ctx.db.patch(user._id, { hp: newHp });
                }
            } else {
                // Award XP + Gold
                const newXp = user.xp + rewards.xp;
                const newGold = (user.gold || 0) + rewards.gold;
                const newLevel = Math.floor(newXp / 1000) + 1;

                // Update streak
                await ctx.db.patch(habit._id, { streak: (habit.streak || 0) + 1 });

                await ctx.db.patch(user._id, {
                    xp: newXp,
                    gold: newGold,
                    level: newLevel
                });

                // Check for badge awards
                const totalHabitLogs = await ctx.db
                    .query("habitLogs")
                    .withIndex("by_user_date", (q) => q.eq("userId", identity.subject))
                    .collect();

                const positiveHabits = totalHabitLogs.filter(log => log.type === "positive");

                // Award badges based on habit count
                if (positiveHabits.length === 1) {
                    await ctx.runMutation(api.badges.awardBadge, { slug: "first-step" });
                } else if (positiveHabits.length === 100) {
                    await ctx.runMutation(api.badges.awardBadge, { slug: "habit-master" });
                }
            }
        }
    },
});

export const uncheck = mutation({
    args: { logId: v.id("habitLogs") }, // Changed to take logId directly for easier undo
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const log = await ctx.db.get(args.logId);
        if (!log || log.userId !== identity.subject) throw new Error("Not found");

        const habit = await ctx.db.get(log.habitId);
        if (!habit) throw new Error("Habit not found");

        await ctx.db.delete(log._id);

        // Revert Stats
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const rewards = DIFFICULTY_REWARDS[habit.difficulty as keyof typeof DIFFICULTY_REWARDS] || DIFFICULTY_REWARDS.easy;
            const isNegative = log.type === "negative";

            if (isNegative) {
                // Restore HP
                const newHp = Math.min(user.maxHp || 50, (user.hp || 0) + rewards.damage);
                await ctx.db.patch(user._id, { hp: newHp });
            } else {
                // Remove XP + Gold
                const newXp = Math.max(0, user.xp - rewards.xp);
                const newGold = Math.max(0, (user.gold || 0) - rewards.gold);
                const newLevel = Math.floor(newXp / 1000) + 1;

                // Revert streak
                await ctx.db.patch(habit._id, { streak: Math.max(0, (habit.streak || 1) - 1) });

                await ctx.db.patch(user._id, {
                    xp: newXp,
                    gold: newGold,
                    level: newLevel
                });
            }
        }
    },
});
