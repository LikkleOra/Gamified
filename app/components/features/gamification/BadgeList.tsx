"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Award, Lock } from "lucide-react";

export function BadgeList() {
    const badgeData = useQuery(api.badges.get);

    if (!badgeData) return <div className="animate-pulse">Loading badges...</div>;

    const { badges, userBadges } = badgeData;
    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

    const categorizedBadges = {
        habit: badges.filter((b) => b.category === "habit"),
        pomodoro: badges.filter((b) => b.category === "pomodoro"),
        streak: badges.filter((b) => b.category === "streak"),
        level: badges.filter((b) => b.category === "level"),
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Achievements
                </h2>
                <div className="text-sm text-text-secondary">
                    {userBadges.length} / {badges.length}
                </div>
            </div>

            {Object.entries(categorizedBadges).map(([category, categoryBadges]) => {
                if (categoryBadges.length === 0) return null;

                return (
                    <div key={category} className="space-y-3">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {categoryBadges.map((badge) => {
                                const isEarned = earnedBadgeIds.has(badge._id);
                                return (
                                    <div
                                        key={badge._id}
                                        className={`group relative p-4 rounded-xl border transition-all duration-200 ${isEarned
                                                ? "glass border-border hover:border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent"
                                                : "bg-bg-elevated/30 border-border/30 opacity-50"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className={`text-4xl ${!isEarned && "grayscale"}`}>
                                                {badge.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm flex items-center justify-center gap-1">
                                                    {badge.title}
                                                    {!isEarned && <Lock className="w-3 h-3 text-text-muted" />}
                                                </div>
                                                <div className="text-xs text-text-secondary mt-1">
                                                    {badge.description}
                                                </div>
                                            </div>
                                        </div>
                                        {isEarned && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {badges.length === 0 && (
                <div className="text-center py-8 text-text-muted text-sm">
                    No badges available yet. Check back soon!
                </div>
            )}
        </div>
    );
}
