"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Coins, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RewardShop() {
    const rewards = useQuery(api.rewards.get);
    const createReward = useMutation(api.rewards.create);
    const purchaseReward = useMutation(api.rewards.purchase);
    const buyPotion = useMutation(api.rewards.buyPotion);
    const userData = useQuery(api.users.get);

    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newCost, setNewCost] = useState(10);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        await createReward({
            title: newTitle,
            cost: newCost,
            icon: "🎁",
        });
        setNewTitle("");
        setNewCost(10);
        setIsCreating(false);
    };

    const handlePurchase = async (reward: any) => {
        if (!userData || (userData.gold || 0) < reward.cost) return;

        try {
            await purchaseReward({ rewardId: reward._id });
        } catch (error) {
            console.error("Purchase failed", error);
        }
    };

    const handleBuyPotion = async () => {
        if (!userData || (userData.gold || 0) < 25) return;
        try {
            await buyPotion();
        } catch (error) {
            console.error("Potion purchase failed", error);
        }
    };

    if (rewards === undefined) return <div className="animate-pulse">Loading shop...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-500" />
                    Rewards
                </h2>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(!isCreating)}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="glass p-3 rounded-xl flex gap-2 items-center animate-fadeIn">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Reward Name..."
                        className="flex-1 bg-transparent border-none focus:outline-none"
                        autoFocus
                    />
                    <div className="flex items-center gap-1 bg-bg-tertiary px-2 py-1 rounded-lg">
                        <Coins className="w-3 h-3 text-amber-500" />
                        <input
                            type="number"
                            value={newCost}
                            onChange={(e) => setNewCost(parseInt(e.target.value) || 0)}
                            className="w-12 bg-transparent border-none focus:outline-none text-right"
                        />
                    </div>
                    <Button type="submit" size="sm">Add</Button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Default Health Potion */}
                <div className="group glass p-3 rounded-xl border border-border hover:border-purple-500/50 transition-all duration-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">🧪</div>
                        <div>
                            <div className="font-medium">Health Potion</div>
                            <div className="text-xs text-text-secondary">Restores 15 HP</div>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500"
                        disabled={(userData?.gold || 0) < 25}
                        onClick={handleBuyPotion}
                    >
                        <Coins className="w-3 h-3" /> 25
                    </Button>
                </div>

                {rewards.map((reward) => (
                    <div
                        key={reward._id}
                        className="group glass p-3 rounded-xl border border-border hover:border-purple-500/50 transition-all duration-200 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">{reward.icon || "🎁"}</div>
                            <div className="font-medium">{reward.title}</div>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className={`gap-1 ${(userData?.gold || 0) >= reward.cost ? "hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500" : "opacity-50"}`}
                            disabled={(userData?.gold || 0) < reward.cost}
                            onClick={() => handlePurchase(reward)}
                        >
                            <Coins className="w-3 h-3" /> {reward.cost}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
