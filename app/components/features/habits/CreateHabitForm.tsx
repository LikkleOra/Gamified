"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CreateHabitForm({ onClose }: { onClose: () => void }) {
    const create = useMutation(api.habits.create);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [xpReward, setXpReward] = useState(50);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsLoading(true);
        try {
            await create({
                title,
                description,
                frequency: ["Daily"], // Default for now
                xpReward,
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
                <h3 className="font-bold">New Quest</h3>
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
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g., 8 glasses a day"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">XP Reward</label>
                <div className="flex gap-2">
                    {[10, 25, 50, 100].map((xp) => (
                        <button
                            key={xp}
                            type="button"
                            onClick={() => setXpReward(xp)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${xpReward === xp
                                    ? "bg-xp-color text-black shadow-glow"
                                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-elevated"
                                }`}
                        >
                            {xp} XP
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="gamified" disabled={isLoading || !title}>
                    {isLoading ? "Creating..." : "Create Quest"}
                </Button>
            </div>
        </form>
    );
}
