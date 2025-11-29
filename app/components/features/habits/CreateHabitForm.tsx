"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, PlusCircle } from "lucide-react";

export function CreateHabitForm({ onClose }: { onClose: () => void }) {
    const create = useMutation(api.habits.create);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"positive" | "negative" | "both">("positive");
    const [difficulty, setDifficulty] = useState<"trivial" | "easy" | "medium" | "hard">("easy");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsLoading(true);
        try {
            await create({
                title,
                description,
                frequency: ["Daily"],
                xpReward: 0, // Legacy, calculated on backend now
                type,
                difficulty,
            });
            onClose();
        } catch (error) {
            console.error("Failed to create habit", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">New Habit</h3>
                <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g., Drink Water"
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="Add notes..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <div className="flex gap-1 bg-bg-tertiary p-1 rounded-lg">
                        {(["positive", "negative", "both"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${type === t
                                        ? "bg-bg-elevated shadow-sm text-primary"
                                        : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                {t === "both" ? "+/-" : t === "positive" ? "+" : "-"}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-primary focus:outline-none text-sm"
                    >
                        <option value="trivial">Trivial</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="gamified" disabled={isLoading || !title}>
                    {isLoading ? "Creating..." : "Create"}
                </Button>
            </div>
        </form>
    );
}
