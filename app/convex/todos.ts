import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DIFFICULTY_REWARDS = {
    trivial: { xp: 5, gold: 0.5 },
    easy: { xp: 10, gold: 1 },
    medium: { xp: 20, gold: 2.5 },
    hard: { xp: 40, gold: 5 },
};

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("todos")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .filter((q) => q.eq(q.field("isCompleted"), false)) // Only show active todos by default? Or separate query?
            // Let's return all and filter on frontend for now, or just active.
            // Habitica usually moves completed to bottom.
            .collect();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        notes: v.optional(v.string()),
        difficulty: v.union(v.literal("trivial"), v.literal("easy"), v.literal("medium"), v.literal("hard")),
        dueDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        await ctx.db.insert("todos", {
            userId: identity.subject,
            title: args.title,
            notes: args.notes,
            difficulty: args.difficulty,
            dueDate: args.dueDate,
            checklist: [],
            isCompleted: false,
        });
    },
});

export const complete = mutation({
    args: { todoId: v.id("todos") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const todo = await ctx.db.get(args.todoId);
        if (!todo || todo.userId !== identity.subject) throw new Error("Not found");

        if (todo.isCompleted) return;

        // Mark completed
        await ctx.db.patch(todo._id, {
            isCompleted: true,
            completedAt: Date.now(),
        });

        // Award Rewards
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const rewards = DIFFICULTY_REWARDS[todo.difficulty as keyof typeof DIFFICULTY_REWARDS];
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

export const deleteTodo = mutation({
    args: { todoId: v.id("todos") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const todo = await ctx.db.get(args.todoId);
        if (!todo || todo.userId !== identity.subject) throw new Error("Not found");

        await ctx.db.delete(todo._id);
    },
});
