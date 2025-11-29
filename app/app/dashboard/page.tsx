"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { HabitList } from "@/components/features/habits/HabitList";
import { DailyList } from "@/components/features/dailies/DailyList";
import { TodoList } from "@/components/features/todos/TodoList";
import { PomodoroTimer } from "@/components/features/pomodoro/Timer";
import { RewardShop } from "@/components/features/rewards/RewardShop";
import { LevelUpModal } from "@/components/features/gamification/LevelUpModal";

export default function DashboardPage() {
    console.log("Rendering Dashboard Page");
    const { user } = useUser();
    const syncUser = useMutation(api.users.syncUser);
    const syncDailies = useMutation(api.dailies.sync);
    const userData = useQuery(api.users.get);

    const [showLevelUp, setShowLevelUp] = useState(false);
    const [activeTab, setActiveTab] = useState<"habits" | "dailies" | "todos">("habits");
    const prevLevelRef = useRef<number | null>(null);

    // Sync User & Dailies on Load
    useEffect(() => {
        if (user) {
            syncUser({
                name: user.fullName || "User",
                email: user.primaryEmailAddress?.emailAddress || "",
            });
            syncDailies(); // Check for resets
        }
    }, [user, syncUser, syncDailies]);

    // Check for Level Up
    useEffect(() => {
        if (userData?.level) {
            // Initial load, just set the ref
            if (prevLevelRef.current === null) {
                prevLevelRef.current = userData.level;
            }
            // Level increased!
            else if (userData.level > prevLevelRef.current) {
                setShowLevelUp(true);
                prevLevelRef.current = userData.level;
            }
            // Level decreased (death), just update ref
            else if (userData.level < prevLevelRef.current) {
                prevLevelRef.current = userData.level;
            }
        }
    }, [userData?.level]);

    return (
        <div className="space-y-8 pb-20">
            {showLevelUp && userData && (
                <LevelUpModal level={userData.level} onClose={() => setShowLevelUp(false)} />
            )}

            {/* Focus Section */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Focus Session</h2>
                    <span className="text-sm text-text-secondary">Earn XP while you work</span>
                </div>
                <PomodoroTimer />
            </div>

            {/* Mobile Tab Navigation */}
            <div className="flex lg:hidden bg-bg-elevated p-1 rounded-xl mb-4">
                {(["habits", "dailies", "todos"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                                ? "bg-primary text-white shadow-lg"
                                : "text-text-muted hover:text-text-primary"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main RPG Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Habits */}
                <div className={`flex flex-col gap-4 ${activeTab === "habits" ? "block" : "hidden lg:flex"}`}>
                    <div className="glass p-4 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Habits</h2>
                        <HabitList />
                    </div>
                </div>

                {/* Column 2: Dailies */}
                <div className={`flex flex-col gap-4 ${activeTab === "dailies" ? "block" : "hidden lg:flex"}`}>
                    <div className="glass p-4 rounded-xl">
                        <DailyList />
                    </div>
                </div>

                {/* Column 3: To-Dos */}
                <div className={`flex flex-col gap-4 ${activeTab === "todos" ? "block" : "hidden lg:flex"}`}>
                    <div className="glass p-4 rounded-xl">
                        <TodoList />
                    </div>
                </div>
            </div>

            {/* Reward Shop */}
            <div className="glass p-6 rounded-2xl">
                <RewardShop />
            </div>
        </div>
    );
}
