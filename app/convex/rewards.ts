import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("rewards")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .collect();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        notes: v.optional(v.string()),
        cost: v.number(),
        icon: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        await ctx.db.insert("rewards", {
            userId: identity.subject,
            title: args.title,
            notes: args.notes,
            cost: args.cost,
            icon: args.icon,
        });
    },
});

export const purchase = mutation({
    args: { rewardId: v.id("rewards") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const reward = await ctx.db.get(args.rewardId);
        if (!reward || reward.userId !== identity.subject) throw new Error("Not found");

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        if ((user.gold || 0) < reward.cost) {
            throw new Error("Not enough gold");
        }

        // Deduct Gold
        await ctx.db.patch(user._id, {
            gold: (user.gold || 0) - reward.cost,
        });

        return { success: true, message: `Purchased ${reward.title}!` };
    },
});

export const buyPotion = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const COST = 25;
        const HEAL_AMOUNT = 15;

        if ((user.gold || 0) < COST) {
            throw new Error("Not enough gold");
        }

        // Deduct Gold and Heal
        const newHp = Math.min(user.maxHp || 50, (user.hp || 0) + HEAL_AMOUNT);

        await ctx.db.patch(user._id, {
            gold: (user.gold || 0) - COST,
            hp: newHp,
        });

        return { success: true, message: "Health restored!" };
    },
});
