import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        return user;
    },
});

export const getUser = get;

export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) {
            await ctx.db.insert("users", {
                userId: identity.subject,
                name: args.name,
                email: args.email,
                level: 1,
                xp: 0,
                streak: 0,
                gold: 0,
                hp: 50,
                maxHp: 50,
                lastLoginDate: new Date().toISOString().split('T')[0],
            });
        } else {
            // Update last login if needed, or other fields
            // Also ensure new fields exist for migrated users
            const updates: any = {
                name: args.name,
                email: args.email,
                lastLoginDate: new Date().toISOString().split('T')[0],
            };
            if (user.gold === undefined) updates.gold = 0;
            if (user.hp === undefined) updates.hp = 50;
            if (user.maxHp === undefined) updates.maxHp = 50;

            await ctx.db.patch(user._id, updates);
        }
    },
});

export const addXp = mutation({
    args: { amount: v.number() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const newXp = user.xp + args.amount;
        // Simple level up logic: Level = floor(sqrt(XP / 100)) + 1
        // or just every 1000 XP is a level. Let's do every 1000 XP for simplicity for now.
        const newLevel = Math.floor(newXp / 1000) + 1;

        await ctx.db.patch(user._id, {
            xp: newXp,
            level: newLevel,
        });

        return { newXp, newLevel, leveledUp: newLevel > user.level };
    },
});
