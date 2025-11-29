"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trophy, Medal, Star, Flame, Target, Calendar } from "lucide-react";

export default function ProgressPage() {
    const userData = useQuery(api.users.get);
    const level = userData?.level || 1;
    const xp = userData?.xp || 0;
    const streak = userData?.streak || 0;

    // Mock achievements for now - in future we can store these in DB
    const achievements = [
        { id: 1, name: "First Steps", description: "Complete your first habit", icon: Target, unlocked: xp > 0 },
        { id: 2, name: "On Fire", description: "Reach a 3-day streak", icon: Flame, unlocked: streak >= 3 },
        { id: 3, name: "Level Up", description: "Reach Level 2", icon: Star, unlocked: level >= 2 },
        { id: 4, name: "Dedicated", description: "Earn 1000 XP", icon: Trophy, unlocked: xp >= 1000 },
        { id: 5, name: "Master", description: "Reach Level 10", icon: Medal, unlocked: level >= 10 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Your Progress</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Star className="w-6 h-6" />
                        </div>
                        <div className="text-lg font-semibold">Total XP</div>
                    </div>
                    <div className="text-3xl font-bold">{xp}</div>
                    <div className="text-sm text-text-secondary">Lifetime earnings</div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div className="text-lg font-semibold">Current Streak</div>
                    </div>
                    <div className="text-3xl font-bold">{streak} days</div>
                    <div className="text-sm text-text-secondary">Keep it going!</div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="text-lg font-semibold">Current Level</div>
                    </div>
                    <div className="text-3xl font-bold">{level}</div>
                    <div className="text-sm text-text-secondary">Adventurer</div>
                </div>
            </div>

            {/* Achievements Grid */}
            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Medal className="w-5 h-5 text-primary" />
                    Achievements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`p-4 rounded-xl border transition-all ${achievement.unlocked
                                    ? "glass border-primary/30 bg-primary/5"
                                    : "bg-bg-elevated/50 border-border/50 opacity-60 grayscale"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${achievement.unlocked ? "bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20" : "bg-bg-tertiary text-text-muted"
                                    }`}>
                                    <achievement.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">{achievement.name}</h3>
                                    <p className="text-sm text-text-secondary">{achievement.description}</p>
                                    {achievement.unlocked && (
                                        <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                            Unlocked
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
