import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
            .query("dailies")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .collect();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        notes: v.optional(v.string()),
        difficulty: v.union(v.literal("trivial"), v.literal("easy"), v.literal("medium"), v.literal("hard")),
        daysActive: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        await ctx.db.insert("dailies", {
            userId: identity.subject,
            title: args.title,
            notes: args.notes,
            difficulty: args.difficulty,
            daysActive: args.daysActive,
            checklist: [],
            startDate: Date.now(),
            isCompleted: false,
            streak: 0,
        });
    },
});

export const check = mutation({
    args: { dailyId: v.id("dailies") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const daily = await ctx.db.get(args.dailyId);
        if (!daily || daily.userId !== identity.subject) throw new Error("Not found");

        if (daily.isCompleted) return; // Already done

        const today = new Date().toISOString().split("T")[0];

        // Update daily
        await ctx.db.patch(daily._id, {
            isCompleted: true,
            lastCompletedDate: today,
            streak: daily.streak + 1,
        });

        // Award Rewards
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const rewards = DIFFICULTY_REWARDS[daily.difficulty as keyof typeof DIFFICULTY_REWARDS];
            const newXp = user.xp + rewards.xp;
            const newGold = (user.gold || 0) + rewards.gold;
            const newLevel = Math.floor(newXp / 1000) + 1;

            await ctx.db.patch(user._id, {
                xp: newXp,
                gold: newGold,
                level: newLevel,
            });
        }
    },
});

export const uncheck = mutation({
    args: { dailyId: v.id("dailies") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const daily = await ctx.db.get(args.dailyId);
        if (!daily || daily.userId !== identity.subject) throw new Error("Not found");

        if (!daily.isCompleted) return; // Already undone

        // Revert daily
        await ctx.db.patch(daily._id, {
            isCompleted: false,
            streak: Math.max(0, daily.streak - 1),
        });

        // Revert Rewards
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const rewards = DIFFICULTY_REWARDS[daily.difficulty as keyof typeof DIFFICULTY_REWARDS];
            const newXp = Math.max(0, user.xp - rewards.xp);
            const newGold = Math.max(0, (user.gold || 0) - rewards.gold);
            const newLevel = Math.floor(newXp / 1000) + 1;

            await ctx.db.patch(user._id, {
                xp: newXp,
                gold: newGold,
                level: newLevel,
            });
        }
    },
});

// The Lazy Reset Logic
export const sync = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const dailies = await ctx.db
            .query("dailies")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .collect();

        const today = new Date().toISOString().split("T")[0];
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) return;

        // Calculate yesterday's day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDay = yesterday.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue"

        let totalDamage = 0;

        for (const daily of dailies) {
            // If completed on a previous day, reset it
            if (daily.isCompleted && daily.lastCompletedDate !== today) {
                await ctx.db.patch(daily._id, {
                    isCompleted: false,
                });
            } else if (!daily.isCompleted && daily.startDate < Date.now() - 86400000) {
                // If not completed and was created before today (simple check)
                // Check if it was active yesterday
                if (daily.daysActive.includes(yesterdayDay) || daily.daysActive.includes("Everyday")) {
                    // Missed it!
                    const rewards = DIFFICULTY_REWARDS[daily.difficulty as keyof typeof DIFFICULTY_REWARDS] || DIFFICULTY_REWARDS.easy;
                    totalDamage += rewards.damage;
                }
            }
        }

        if (totalDamage > 0) {
            const currentHp = user.hp || 50;
            const newHp = currentHp - totalDamage;

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
        }
    },
});
