"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Timer, Trophy, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-elevated/95 backdrop-blur-lg border-t border-border/50 md:hidden pb-safe">
            <nav className="flex justify-between items-center h-16 px-6 relative">
                {/* Left Side */}
                <Link
                    href="/dashboard"
                    className={cn("flex flex-col items-center gap-1", pathname === "/dashboard" ? "text-primary" : "text-text-muted")}
                >
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link
                    href="/dashboard/pomodoro"
                    className={cn("flex flex-col items-center gap-1", pathname === "/dashboard/pomodoro" ? "text-primary" : "text-text-muted")}
                >
                    <Timer className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Focus</span>
                </Link>

                {/* FAB - Central Action */}
                <div className="relative -top-6">
                    <button className="w-14 h-14 bg-purple-600 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-purple-600/40 border-4 border-bg-primary transition-transform active:scale-95">
                        <Plus className="w-8 h-8 text-white -rotate-45" />
                    </button>
                </div>

                {/* Right Side */}
                <Link
                    href="/dashboard/progress"
                    className={cn("flex flex-col items-center gap-1", pathname === "/dashboard/progress" ? "text-primary" : "text-text-muted")}
                >
                    <Trophy className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Stats</span>
                </Link>

                <Link
                    href="/dashboard/settings"
                    className={cn("flex flex-col items-center gap-1", pathname === "/dashboard/settings" ? "text-primary" : "text-text-muted")}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </nav>
        </div>
    );
}
