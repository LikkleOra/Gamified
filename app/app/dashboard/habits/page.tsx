import { HabitList } from "@/components/features/habits/HabitList";

export default function HabitsPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Quest Log</h1>
                <p className="text-text-secondary">
                    Manage your daily habits and earn XP for consistency.
                </p>
            </div>

            <HabitList />
        </div>
    );
}
