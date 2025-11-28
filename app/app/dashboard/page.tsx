"use client";

import { Button } from "@/components/ui/button";
import { HabitList } from "@/components/features/habits/HabitList";
import { PomodoroTimer } from "@/components/features/pomodoro/Timer";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateHabitForm } from "@/components/features/habits/CreateHabitForm";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
    const [isCreating, setIsCreating] = useState(false);
    const userData = useQuery(api.users.get);
    const pomodoroSessions = useQuery(api.pomodoro.getTodaySessions);

    const todayPomodoroCount = pomodoroSessions?.length || 0;
    const level = userData?.level || 1;
    const xp = userData?.xp || 0;
    const streak = userData?.streak || 0;
    const xpForNextLevel = level * 1000;
    const xpProgress = (xp % 1000) / 10; // Percentage for current level

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, Adventurer! 👋</h1>
                    <p className="text-text-secondary mt-2">Here's your daily quest log.</p>
                </div>
                <Button variant="gamified" onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" /> New Quest
                </Button>
            </div>

            {isCreating && (
                <div className="mb-6 p-4 glass rounded-xl animate-fadeIn">
                    <CreateHabitForm onClose={() => setIsCreating(false)} />
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl border-l-4 border-primary">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">Level</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold gradient-text">{level}</span>
                    </div>
                    <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${xpProgress}%` }}
                        />
                    </div>
                    <div className="text-xs text-text-muted mt-1">{xp % 1000} / 1000 XP</div>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-secondary">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">Daily Streak</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{streak}</span>
                        <span className="text-sm text-text-muted">days 🔥</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-success">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">Total XP</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{xp.toLocaleString()}</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-info">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">Pomodoros Today</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{todayPomodoroCount}</span>
                        <span className="text-sm text-text-muted">sessions ⏱️</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Habits - 2 columns */}
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                    <HabitList />
                </div>

                {/* Pomodoro Timer - 1 column */}
                <div className="lg:col-span-1">
                    <PomodoroTimer />
                </div>
            </div>
        </div>
    );
}
