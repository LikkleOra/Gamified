"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Heart, Star, Zap, Menu, Search, Filter } from "lucide-react";
import { Coins } from "lucide-react";

export function MobileHeader() {
    const { user } = useUser();
    const userData = useQuery(api.users.get);

    const level = userData?.level || 1;
    const hp = userData?.hp || 50;
    const maxHp = userData?.maxHp || 50;
    const xp = userData?.xp || 0;
    const gold = userData?.gold || 0;

    // XP Calculation (Simplified)
    const xpForNextLevel = 1000;
    const currentLevelXp = xp % 1000;
    const xpProgress = (currentLevelXp / xpForNextLevel) * 100;
    const hpProgress = (hp / maxHp) * 100;

    return (
        <div className="md:hidden bg-bg-elevated border-b border-border/50 pb-4 pt-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3">
                <Menu className="w-6 h-6 text-text-secondary" />
                <span className="font-bold text-lg truncate max-w-[200px]">
                    {user?.username || user?.fullName || "Adventurer"}
                </span>
                <div className="flex gap-4">
                    <Search className="w-6 h-6 text-text-secondary" />
                    <Filter className="w-6 h-6 text-text-secondary" />
                </div>
            </div>

            {/* Stats Area */}
            <div className="flex gap-4 px-4 mt-2">
                {/* Avatar */}
                <div className="w-20 h-20 bg-bg-tertiary rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                    {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-2xl font-bold">
                            {user?.firstName?.[0] || "U"}
                        </div>
                    )}
                </div>

                {/* Bars */}
                <div className="flex-1 space-y-2">
                    {/* Health */}
                    <div className="relative h-5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-rose-500 transition-all duration-500"
                            style={{ width: `${hpProgress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow-md">
                            <Heart className="w-3 h-3 fill-white" />
                            <span>{hp} / {maxHp}</span>
                            <span>Health</span>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="relative h-5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-amber-400 transition-all duration-500"
                            style={{ width: `${xpProgress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow-md">
                            <Star className="w-3 h-3 fill-white" />
                            <span>{currentLevelXp} / {xpForNextLevel}</span>
                            <span>XP</span>
                        </div>
                    </div>

                    {/* Mana (Placeholder for now, maybe Energy?) */}
                    <div className="relative h-5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-sky-500 transition-all duration-500"
                            style={{ width: "100%" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow-md">
                            <Zap className="w-3 h-3 fill-white" />
                            <span>100 / 100</span>
                            <span>Energy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between px-4 mt-3 text-xs font-bold text-text-secondary">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-sky-500 rotate-45 rounded-sm"></div>
                    <span>Lv. {level} Novice</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-400">
                        <Coins className="w-4 h-4 fill-current" />
                        <span>{Math.floor(gold)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                        <div className="w-3 h-3 bg-emerald-400 rotate-45"></div>
                        <span>0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
