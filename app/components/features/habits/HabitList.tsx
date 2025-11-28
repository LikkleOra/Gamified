"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateHabitForm } from "./CreateHabitForm";

export function HabitList() {
    const today = format(new Date(), "yyyy-MM-dd");
    const habits = useQuery(api.habits.get);
    const logs = useQuery(api.habits.getTodayLogs, { date: today });
    const check = useMutation(api.habits.check);
    const uncheck = useMutation(api.habits.uncheck);
    const [isCreating, setIsCreating] = useState(false);

    if (!habits || !logs) {
        return <div className="animate-pulse">Loading habits...</div>;
    }

    const completedHabitIds = new Set(logs.map((log) => log.habitId));

    const toggleHabit = async (habitId: string, isCompleted: boolean) => {
        if (isCompleted) {
            await uncheck({ habitId: habitId as any, date: today });
        } else {
            await check({ habitId: habitId as any, date: today });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Daily Quests</h2>
                <Button onClick={() => setIsCreating(true)} variant="gamified" size="sm">
                    <Plus className="w-4 h-4 mr-2" /> New Quest
                </Button>
            </div>

            {isCreating && (
                <div className="mb-6 p-4 glass rounded-xl animate-fadeIn">
                    <CreateHabitForm onClose={() => setIsCreating(false)} />
                </div>
            )}

            <div className="space-y-3">
                {habits.length === 0 && !isCreating && (
                    <div className="text-center py-10 text-text-muted">
                        No active quests. Start your journey by adding one!
                    </div>
                )}

                {habits.map((habit) => {
                    const isCompleted = completedHabitIds.has(habit._id);

                    return (
                        <div
                            key={habit._id}
                            className={cn(
                                "group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer",
                                isCompleted
                                    ? "bg-success/10 border-success/30"
                                    : "bg-bg-elevated border-border/50 hover:border-primary/50 hover:bg-bg-tertiary"
                            )}
                            onClick={() => toggleHabit(habit._id, isCompleted)}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-300",
                                        isCompleted
                                            ? "bg-success border-success text-white scale-110"
                                            : "border-text-muted group-hover:border-primary"
                                    )}
                                >
                                    {isCompleted && <Check className="w-5 h-5" />}
                                </div>

                                <div>
                                    <h3 className={cn(
                                        "font-semibold transition-all",
                                        isCompleted && "text-text-muted line-through"
                                    )}>
                                        {habit.title}
                                    </h3>
                                    {habit.description && (
                                        <p className="text-xs text-text-muted">{habit.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-xp-color">+{habit.xpReward} XP</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
