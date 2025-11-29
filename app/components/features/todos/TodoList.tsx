"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check, Plus, Trash2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TodoList() {
    const todos = useQuery(api.todos.get);
    const createTodo = useMutation(api.todos.create);
    const completeTodo = useMutation(api.todos.complete);
    const deleteTodo = useMutation(api.todos.deleteTodo);

    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        await createTodo({
            title: newTitle,
            difficulty: "easy",
        });
        setNewTitle("");
        setIsCreating(false);
    };

    const handleComplete = async (todoId: any) => {
        await completeTodo({ todoId });
    };

    const handleDelete = async (todoId: any) => {
        await deleteTodo({ todoId });
    };

    if (todos === undefined) return <div className="animate-pulse">Loading to-dos...</div>;

    // Separate active and completed
    const activeTodos = todos.filter(t => !t.isCompleted);
    const completedTodos = todos.filter(t => t.isCompleted);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                    To-Dos
                </h2>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(!isCreating)}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="glass p-3 rounded-xl flex gap-2 animate-fadeIn">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="New To-Do..."
                        className="flex-1 bg-transparent border-none focus:outline-none"
                        autoFocus
                    />
                    <Button type="submit" size="sm">Add</Button>
                </form>
            )}

            <div className="space-y-2">
                {activeTodos.map((todo) => (
                    <div
                        key={todo._id}
                        className="group glass p-3 rounded-xl border border-border hover:border-blue-500/50 transition-all duration-200 flex items-center gap-3"
                    >
                        <button
                            onClick={() => handleComplete(todo._id)}
                            className="w-6 h-6 rounded-lg border-2 border-text-muted hover:border-blue-500 flex items-center justify-center transition-colors"
                        >
                        </button>

                        <div className="flex-1 font-medium">
                            {todo.title}
                        </div>

                        <button
                            onClick={() => handleDelete(todo._id)}
                            className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {completedTodos.length > 0 && (
                    <div className="pt-4">
                        <h3 className="text-xs font-bold text-text-muted uppercase mb-2">Completed</h3>
                        <div className="space-y-2 opacity-60">
                            {completedTodos.map((todo) => (
                                <div
                                    key={todo._id}
                                    className="p-3 rounded-xl border border-border/50 bg-bg-elevated/50 flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 line-through text-text-muted">
                                        {todo.title}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(todo._id)}
                                        className="text-text-muted hover:text-error"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {todos.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-text-muted text-sm">
                        No active tasks. You're all caught up!
                    </div>
                )}
            </div>
        </div>
    );
}
