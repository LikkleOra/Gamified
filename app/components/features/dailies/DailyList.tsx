"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DailyList() {
    const dailies = useQuery(api.dailies.get);
    const checkDaily = useMutation(api.dailies.check);
    const uncheckDaily = useMutation(api.dailies.uncheck);
    const createDaily = useMutation(api.dailies.create);

    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        await createDaily({
            title: newTitle,
            difficulty: "easy",
            daysActive: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        });
        setNewTitle("");
        setIsCreating(false);
    };

    const handleToggle = async (daily: any) => {
        if (daily.isCompleted) {
            await uncheckDaily({ dailyId: daily._id });
        } else {
            await checkDaily({ dailyId: daily._id });
        }
    };

    if (dailies === undefined) return <div className="animate-pulse">Loading dailies...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Dailies
                </h2>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(!isCreating)}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="glass p-3 rounded-xl flex gap-2 animate-fadeIn">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="New Daily..."
                        className="flex-1 bg-transparent border-none focus:outline-none"
                        autoFocus
                    />
                    <Button type="submit" size="sm">Add</Button>
                </form>
            )}

            <div className="space-y-2">
                {dailies.map((daily) => (
                    <div
                        key={daily._id}
                        className={`group p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${daily.isCompleted
                                ? "bg-bg-elevated/50 border-border/50 opacity-60"
                                : "glass border-border hover:border-orange-500/50"
                            }`}
                    >
                        <button
                            onClick={() => handleToggle(daily)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${daily.isCompleted
                                    ? "bg-orange-500 border-orange-500 text-white"
                                    : "border-text-muted hover:border-orange-500"
                                }`}
                        >
                            {daily.isCompleted && <Check className="w-4 h-4" />}
                        </button>

                        <div className="flex-1">
                            <div className={`font-medium ${daily.isCompleted ? "line-through text-text-muted" : ""}`}>
                                {daily.title}
                            </div>
                            <div className="text-xs text-text-secondary flex gap-2">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    Streak: {daily.streak}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {dailies.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-text-muted text-sm">
                        No dailies yet. Add one to build your streak!
                    </div>
                )}
            </div>
        </div>
    );
}
