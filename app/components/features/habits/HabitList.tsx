"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Plus, Minus, Trash2, Edit2, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateHabitForm } from "./CreateHabitForm";

export function HabitList() {
    const today = format(new Date(), "yyyy-MM-dd");
    const habits = useQuery(api.habits.get);
    const logs = useQuery(api.habits.getTodayLogs, { date: today });
    const check = useMutation(api.habits.check);
    const [isCreating, setIsCreating] = useState(false);

    if (!habits || !logs) {
        return <div className="animate-pulse">Loading habits...</div>;
    }

    const onCheck = async (habitId: string, asNegative: boolean = false) => {
        await check({ habitId: habitId as any, date: today, asNegative });
    };

    const getHabitColor = (id: string) => {
        const colors = [
            { bg: "bg-emerald-500", text: "text-emerald-500" },
            { bg: "bg-cyan-500", text: "text-cyan-500" },
            { bg: "bg-amber-500", text: "text-amber-500" },
            { bg: "bg-rose-500", text: "text-rose-500" },
            { bg: "bg-indigo-500", text: "text-indigo-500" },
        ];
        // Simple hash
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold hidden md:block">Habits</h2>
                <Button
                    onClick={() => setIsCreating(!isCreating)}
                    size="sm"
                    className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" /> New Habit
                </Button>
            </div>

            {isCreating && (
                <div className="mb-4">
                    <CreateHabitForm onClose={() => setIsCreating(false)} />
                </div>
            )}

            <div className="space-y-3">
                {habits.map((habit) => {
                    const color = getHabitColor(habit._id);
                    const type = habit.type || "positive";
                    const isPositive = type === "positive" || type === "both";
                    const isNegative = type === "negative" || type === "both";

                    return (
                        <div key={habit._id} className="flex h-24 rounded-xl overflow-hidden shadow-lg bg-bg-elevated">
                            {/* Positive Action (Left) */}
                            <button
                                onClick={() => onCheck(habit._id, false)}
                                disabled={!isPositive}
                                className={`w-16 flex items-center justify-center transition-colors ${isPositive
                                    ? `${color.bg} hover:brightness-110 active:brightness-90`
                                    : "bg-bg-tertiary cursor-not-allowed opacity-50"
                                    }`}
                            >
                                <Plus className={`w-8 h-8 ${isPositive ? "text-white" : "text-text-muted"}`} />
                            </button>

                            {/* Content (Center) */}
                            <div className="flex-1 p-3 flex flex-col justify-center border-y border-border/50 bg-bg-elevated relative group">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-base leading-tight mb-1">{habit.title}</h3>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                                        <button className="text-text-muted hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                                        <button className="text-text-muted hover:text-error"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                </div>
                                {habit.description && <p className="text-xs text-text-secondary line-clamp-2">{habit.description}</p>}
                                <div className="mt-2 flex items-center gap-2 text-[10px] text-text-muted uppercase tracking-wider">
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> +{habit.difficulty === "hard" ? "2" : "1"}
                                    </span>
                                    {(habit.streak ?? 0) > 0 && (
                                        <span className="flex items-center gap-1 text-amber-500">
                                            <Trophy className="w-3 h-3" /> {habit.streak}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Negative Action (Right) */}
                            <button
                                onClick={() => onCheck(habit._id, true)}
                                disabled={!isNegative}
                                className={`w-16 flex items-center justify-center transition-colors ${isNegative
                                    ? `${color.bg} hover:brightness-110 active:brightness-90`
                                    : "bg-bg-tertiary cursor-not-allowed opacity-50"
                                    }`}
                            >
                                <Minus className={`w-8 h-8 ${isNegative ? "text-white" : "text-text-muted"}`} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
