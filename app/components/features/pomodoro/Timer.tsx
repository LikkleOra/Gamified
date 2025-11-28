"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

export function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"work" | "short" | "long">("work");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const completePomodoroSession = useMutation(api.pomodoro.complete);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === "work") setTimeLeft(WORK_TIME);
        else if (mode === "short") setTimeLeft(SHORT_BREAK);
        else setTimeLeft(LONG_BREAK);
    };

    const changeMode = (newMode: "work" | "short" | "long") => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === "work") setTimeLeft(WORK_TIME);
        else if (newMode === "short") setTimeLeft(SHORT_BREAK);
        else setTimeLeft(LONG_BREAK);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);

            // Timer finished!
            if (mode === "work") {
                // Award XP here
                const duration = mode === "work" ? 25 : mode === "short" ? 5 : 15;
                completePomodoroSession({ duration })
                    .then(() => {
                        console.log(`Completed ${duration} min session, earned ${duration} XP!`);
                    })
                    .catch(console.error);

                new Audio("/sounds/complete.mp3").play().catch(() => { });
            } else {
                new Audio("/sounds/notification.mp3").play().catch(() => { });
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft, mode, completePomodoroSession]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = 100 - (timeLeft / (mode === "work" ? WORK_TIME : mode === "short" ? SHORT_BREAK : LONG_BREAK)) * 100;

    return (
        <div className="flex flex-col items-center justify-center p-8 glass rounded-3xl max-w-md mx-auto relative overflow-hidden">
            {/* Background Progress Circle (Simplified) */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000"
                style={{ width: `${progress}%` }}
            ></div>

            <div className="flex gap-2 mb-8 p-1 bg-bg-tertiary rounded-xl">
                <button
                    onClick={() => changeMode("work")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        mode === "work" ? "bg-primary text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
                    )}
                >
                    <Brain className="w-4 h-4 inline-block mr-2" />
                    Focus
                </button>
                <button
                    onClick={() => changeMode("short")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        mode === "short" ? "bg-success text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
                    )}
                >
                    <Coffee className="w-4 h-4 inline-block mr-2" />
                    Short Break
                </button>
                <button
                    onClick={() => changeMode("long")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        mode === "long" ? "bg-info text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
                    )}
                >
                    <Coffee className="w-4 h-4 inline-block mr-2" />
                    Long Break
                </button>
            </div>

            <div className="text-8xl font-bold font-mono tracking-tighter mb-8 gradient-text tabular-nums">
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={toggleTimer}
                    size="lg"
                    className={cn(
                        "w-32 h-16 text-xl rounded-2xl transition-all hover:scale-105",
                        isActive
                            ? "bg-bg-elevated text-text-primary hover:bg-bg-tertiary border border-border"
                            : "bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                    )}
                >
                    {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>

                <Button
                    onClick={resetTimer}
                    size="icon"
                    variant="ghost"
                    className="h-16 w-16 rounded-2xl border border-border/50 hover:bg-bg-elevated"
                >
                    <RotateCcw className="w-6 h-6 text-text-secondary" />
                </Button>
            </div>

            <div className="mt-6 text-sm text-text-muted">
                {mode === "work" ? "Stay focused and earn 100 XP!" : "Take a breather, you earned it."}
            </div>
        </div>
    );
}
