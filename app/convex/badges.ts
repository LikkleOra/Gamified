import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { badges: [], userBadges: [] };

        const badges = await ctx.db.query("badges").collect();
        const userBadges = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .collect();

        return { badges, userBadges };
    },
});

export const initializeBadges = mutation({
    args: {},
    handler: async (ctx) => {
        const existingBadges = await ctx.db.query("badges").collect();
        if (existingBadges.length > 0) return; // Already initialized

        const badgesToCreate = [
            {
                slug: "first-step",
                title: "First Step",
                description: "Complete your first habit",
                icon: "🦶",
                category: "habit",
                conditionValue: 1,
            },
            {
                slug: "habit-master",
                title: "Habit Master",
                description: "Complete 100 habits",
                icon: "👑",
                category: "habit",
                conditionValue: 100,
            },
            {
                slug: "focus-novice",
                title: "Focus Novice",
                description: "Complete 5 Pomodoro sessions",
                icon: "🍅",
                category: "pomodoro",
                conditionValue: 5,
            },
            {
                slug: "focus-guru",
                title: "Focus Guru",
                description: "Complete 50 Pomodoro sessions",
                icon: "🧘",
                category: "pomodoro",
                conditionValue: 50,
            },
            {
                slug: "streak-week",
                title: "On Fire",
                description: "Reach a 7-day streak",
                icon: "🔥",
                category: "streak",
                conditionValue: 7,
            },
            {
                slug: "level-5",
                title: "High Five",
                description: "Reach Level 5",
                icon: "🖐️",
                category: "level",
                conditionValue: 5,
            },
        ];

        for (const badge of badgesToCreate) {
            await ctx.db.insert("badges", badge as any);
        }
    },
});

// Internal mutation to award a badge if not already earned
export const awardBadge = mutation({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const badge = await ctx.db
            .query("badges")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!badge) return;

        const existing = await ctx.db
            .query("userBadges")
            .withIndex("by_user_badge", (q) =>
                q.eq("userId", identity.subject).eq("badgeId", badge._id)
            )
            .first();

        if (!existing) {
            await ctx.db.insert("userBadges", {
                userId: identity.subject,
                badgeId: badge._id,
                earnedAt: Date.now(),
            });
            return badge; // Return badge info to trigger notification on client
        }
        return null;
    },
});
