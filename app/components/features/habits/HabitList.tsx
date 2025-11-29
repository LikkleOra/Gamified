"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Plus, Minus, Trash2 } from "lucide-react";
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

    const handleCheck = async (habitId: string, asNegative: boolean = false) => {
        await check({ habitId: habitId as any, date: today, asNegative });
    };

    // We don't really "uncheck" habits in the new model easily unless we show a history log.
    // For now, let's just allow adding + and -. Undo is harder with multiple clicks.
    // We can add a small "undo" toast or button if needed, but for MVP let's stick to forward progress.

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(!isCreating)} className="ml-auto">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {isCreating && (
                <div className="mb-4 animate-fadeIn">
                    <CreateHabitForm onClose={() => setIsCreating(false)} />
                </div>
            )}

            <div className="space-y-2">
                {habits.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-text-muted text-sm">
                        No habits yet. Add one!
                    </div>
                )}

                {habits.map((habit) => {
                    const type = habit.type || "positive"; // Default to positive
                    const positiveCount = logs.filter(l => l.habitId === habit._id && l.type === "positive").length;
                    const negativeCount = logs.filter(l => l.habitId === habit._id && l.type === "negative").length;

                    return (
                        <div
                            key={habit._id}
                            className="group glass p-3 rounded-xl border border-border hover:border-primary/50 transition-all duration-200 flex items-center justify-between"
                        >
                            <div className="flex-1">
                                <div className="font-medium">{habit.title}</div>
                                <div className="text-xs text-text-secondary flex gap-2">
                                    {habit.difficulty && <span className="capitalize">{habit.difficulty}</span>}
                                    <span>•</span>
                                    <span>Streak: {habit.streak || 0}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {(type === "positive" || type === "both") && (
                                    <button
                                        onClick={() => handleCheck(habit._id, false)}
                                        className="w-8 h-8 rounded-lg bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                        {positiveCount > 0 && <span className="ml-1 text-xs font-bold">{positiveCount}</span>}
                                    </button>
                                )}

                                {(type === "negative" || type === "both") && (
                                    <button
                                        onClick={() => handleCheck(habit._id, true)}
                                        className="w-8 h-8 rounded-lg bg-error/10 text-error border border-error/30 hover:bg-error hover:text-white flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                        {negativeCount > 0 && <span className="ml-1 text-xs font-bold">{negativeCount}</span>}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
