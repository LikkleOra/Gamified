import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const completeSession = mutation({
    args: {
        duration: v.number(),
        xpReward: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const xpReward = args.xpReward ?? args.duration;
        const today = new Date().toISOString().split("T")[0];

        // Log the session
        await ctx.db.insert("pomodoroSessions", {
            userId: identity.subject,
            duration: args.duration,
            xpReward,
            completedAt: Date.now(),
            date: today,
        });

        // Award XP
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user) {
            const newXp = user.xp + xpReward;
            const newLevel = Math.floor(newXp / 1000) + 1;
            await ctx.db.patch(user._id, { xp: newXp, level: newLevel });

            // Check for pomodoro badges
            const totalSessions = await ctx.db
                .query("pomodoroSessions")
                .withIndex("by_user", (q) => q.eq("userId", identity.subject))
                .collect();

            if (totalSessions.length === 5) {
                await ctx.runMutation(api.badges.awardBadge, { slug: "focus-novice" });
            } else if (totalSessions.length === 50) {
                await ctx.runMutation(api.badges.awardBadge, { slug: "focus-guru" });
            }
        }

        return { xpReward };
    },
});

export const getTodaySessions = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const today = new Date().toISOString().split("T")[0];

        return await ctx.db
            .query("pomodoroSessions")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", identity.subject).eq("date", today)
            )
            .collect();
    },
});
