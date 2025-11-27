import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, Adventurer! 👋</h1>
                    <p className="text-text-secondary mt-2">Here's your daily quest log.</p>
                </div>
                <Button variant="gamified">
                    + New Quest
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border-l-4 border-primary">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">Daily Streak</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">12</span>
                        <span className="text-sm text-text-muted">days</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-secondary">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">XP Earned</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">2,450</span>
                        <span className="text-sm text-text-muted">this week</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-success">
                    <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">Habits Done</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">85%</span>
                        <span className="text-sm text-text-muted">completion</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Quests */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Active Quests</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated hover:bg-bg-tertiary transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-md border-2 border-primary/50 group-hover:border-primary transition-colors"></div>
                                <div>
                                    <div className="font-medium">Complete Morning Routine</div>
                                    <div className="text-xs text-text-muted">Daily Quest • 50 XP</div>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                In Progress
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
