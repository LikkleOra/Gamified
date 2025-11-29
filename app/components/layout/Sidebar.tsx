"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Timer, Trophy, Settings, LogOut, Heart, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Habits", href: "/dashboard/habits", icon: CheckSquare },
    { name: "Pomodoro", href: "/dashboard/pomodoro", icon: Timer },
    { name: "Progress", href: "/dashboard/progress", icon: Trophy },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const userData = useQuery(api.users.get);

    const level = userData?.level || 1;
    const xp = userData?.xp || 0;
    const xpForNextLevel = 1000; // Fixed 1000 XP per level for now as per users.ts
    const currentLevelXp = xp % 1000;
    const xpProgress = (currentLevelXp / xpForNextLevel) * 100;

    return (
        <div className="flex h-full w-64 flex-col glass border-r border-border/50">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-border/50">
                <span className="text-2xl font-bold gradient-text">Gamified</span>
            </div>

            {/* User Stats */}
            <div className="p-4 m-4 rounded-xl bg-bg-elevated border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                        {user?.imageUrl ? (
                            <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.firstName?.[0] || "U"}</span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-semibold truncate">{user?.fullName || "User"}</div>
                        <div className="text-xs text-text-secondary">Level {level} Adventurer</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-rose-500">
                        <Heart className="w-3 h-3 fill-current" />
                        <span className="font-bold">{userData?.hp || 50} / {userData?.maxHp || 50} HP</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Coins className="w-3 h-3 fill-current" />
                        <span className="font-bold">{Math.floor(userData?.gold || 0)} Gold</span>
                    </div>
                </div>

                {/* XP Bar */}
                <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-xp-color to-warning transition-all duration-500"
                        style={{ width: `${xpProgress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>{currentLevelXp} XP</span>
                    <span>{xpForNextLevel} XP</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 transition-colors",
                                    isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border/50">
                <button className="flex w-full items-center px-4 py-3 text-sm font-medium text-text-secondary rounded-xl hover:bg-error/10 hover:text-error transition-colors">
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
