"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings, X, Volume2, VolumeX } from "lucide-react";

type TimerMode = "work" | "shortBreak" | "longBreak";

export default function PomodoroPage() {
    // Settings
    const [workDuration, setWorkDuration] = useState(25);
    const [shortBreakDuration, setShortBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);
    const [autoStartBreaks, setAutoStartBreaks] = useState(false);
    const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem("pomodoroSettings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setWorkDuration(parsed.workDuration || 25);
                setShortBreakDuration(parsed.shortBreakDuration || 5);
                setLongBreakDuration(parsed.longBreakDuration || 15);
                setAutoStartBreaks(parsed.autoStartBreaks || false);
                setAutoStartPomodoros(parsed.autoStartPomodoros || false);
                setSoundEnabled(parsed.soundEnabled ?? true);
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        const settings = {
            workDuration,
            shortBreakDuration,
            longBreakDuration,
            autoStartBreaks,
            autoStartPomodoros,
            soundEnabled,
        };
        localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    }, [workDuration, shortBreakDuration, longBreakDuration, autoStartBreaks, autoStartPomodoros, soundEnabled]);

    // Timer state
    const [mode, setMode] = useState<TimerMode>("work");
    const [timeLeft, setTimeLeft] = useState(workDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const completeSession = useMutation(api.pomodoro.completeSession);
    const todaySessions = useQuery(api.pomodoro.getTodaySessions);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate initial time when mode or settings change
    useEffect(() => {
        if (!isActive) {
            const duration = mode === "work"
                ? workDuration
                : mode === "shortBreak"
                    ? shortBreakDuration
                    : longBreakDuration;
            setTimeLeft(duration * 60);
        }
    }, [mode, workDuration, shortBreakDuration, longBreakDuration, isActive]);

    // Timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);

    const handleTimerComplete = async () => {
        setIsActive(false);

        // Play sound
        if (soundEnabled) {
            const audio = new Audio("/notification.mp3");
            audio.play().catch(() => { });
        }

        // Award XP if work session
        if (mode === "work") {
            await completeSession({
                duration: workDuration,
                xpReward: workDuration * 2,
            });
            setSessionsCompleted((prev) => prev + 1);

            // Auto-start break
            const nextMode = sessionsCompleted % 4 === 3 ? "longBreak" : "shortBreak";
            setMode(nextMode);
            if (autoStartBreaks) {
                setIsActive(true);
            }
        } else {
            // Break finished, auto-start work
            setMode("work");
            if (autoStartPomodoros) {
                setIsActive(true);
            }
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        const duration = mode === "work"
            ? workDuration
            : mode === "shortBreak"
                ? shortBreakDuration
                : longBreakDuration;
        setTimeLeft(duration * 60);
    };

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
    };

    // Format time
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Progress percentage
    const totalDuration = mode === "work"
        ? workDuration * 60
        : mode === "shortBreak"
            ? shortBreakDuration * 60
            : longBreakDuration * 60;
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

    const todaySessionCount = todaySessions?.length || 0;
    const todayTotalMinutes = todaySessions?.reduce((sum, s) => sum + s.duration, 0) || 0;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Background gradient based on mode */}
            <div className={`fixed inset-0 -z-10 transition-all duration-1000 ${mode === "work"
                    ? "bg-gradient-to-br from-rose-500/10 via-bg-primary to-orange-500/10"
                    : mode === "shortBreak"
                        ? "bg-gradient-to-br from-blue-500/10 via-bg-primary to-cyan-500/10"
                        : "bg-gradient-to-br from-purple-500/10 via-bg-primary to-pink-500/10"
                }`} />

            {/* Settings Button */}
            <button
                onClick={() => setShowSettings(true)}
                className="absolute top-4 right-4 p-3 glass rounded-xl hover:bg-bg-elevated transition-colors"
            >
                <Settings className="w-5 h-5" />
            </button>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-primary">{todaySessionCount}</div>
                    <div className="text-xs text-text-muted">Sessions Today</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-secondary">{todayTotalMinutes}m</div>
                    <div className="text-xs text-text-muted">Focus Time</div>
                </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 mb-8 bg-bg-elevated p-1 rounded-xl">
                <button
                    onClick={() => switchMode("work")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === "work"
                            ? "bg-rose-500 text-white shadow-lg"
                            : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    Work
                </button>
                <button
                    onClick={() => switchMode("shortBreak")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === "shortBreak"
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    Short Break
                </button>
                <button
                    onClick={() => switchMode("longBreak")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === "longBreak"
                            ? "bg-purple-500 text-white shadow-lg"
                            : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    Long Break
                </button>
            </div>

            {/* Timer Display */}
            <div className="relative mb-8">
                {/* Progress Ring */}
                <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-bg-elevated"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}%`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}%`}
                        pathLength={100}
                        className={`transition-all duration-1000 ${mode === "work" ? "text-rose-500" : mode === "shortBreak" ? "text-blue-500" : "text-purple-500"
                            }`}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl md:text-7xl font-bold mb-2">{displayTime}</div>
                        <div className="text-xs md:text-sm text-text-muted uppercase tracking-wider">
                            {mode === "work" ? "Focus Time" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <Button
                    onClick={toggleTimer}
                    size="lg"
                    variant="gamified"
                    className="w-32 h-14 text-lg"
                >
                    {isActive ? (
                        <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 mr-2" />
                            Start
                        </>
                    )}
                </Button>
                <Button
                    onClick={resetTimer}
                    size="lg"
                    variant="outline"
                    className="w-14 h-14"
                >
                    <RotateCcw className="w-5 h-5" />
                </Button>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-bg-elevated p-8 rounded-2xl border border-border max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-bg-tertiary rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Time Settings */}
                            <div>
                                <h3 className="font-semibold mb-3">Timer Duration (minutes)</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-text-secondary">Work</label>
                                        <input
                                            type="number"
                                            value={workDuration}
                                            onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                                            className="w-full mt-1 px-3 py-2 bg-bg-tertiary rounded-lg border border-border focus:border-primary focus:outline-none"
                                            min="1"
                                            max="60"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-text-secondary">Short Break</label>
                                        <input
                                            type="number"
                                            value={shortBreakDuration}
                                            onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)}
                                            className="w-full mt-1 px-3 py-2 bg-bg-tertiary rounded-lg border border-border focus:border-primary focus:outline-none"
                                            min="1"
                                            max="30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-text-secondary">Long Break</label>
                                        <input
                                            type="number"
                                            value={longBreakDuration}
                                            onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
                                            className="w-full mt-1 px-3 py-2 bg-bg-tertiary rounded-lg border border-border focus:border-primary focus:outline-none"
                                            min="1"
                                            max="60"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Auto-start Settings */}
                            <div>
                                <h3 className="font-semibold mb-3">Auto-start</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg cursor-pointer">
                                        <span className="text-sm">Auto-start Breaks</span>
                                        <input
                                            type="checkbox"
                                            checked={autoStartBreaks}
                                            onChange={(e) => setAutoStartBreaks(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg cursor-pointer">
                                        <span className="text-sm">Auto-start Pomodoros</span>
                                        <input
                                            type="checkbox"
                                            checked={autoStartPomodoros}
                                            onChange={(e) => setAutoStartPomodoros(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Sound Settings */}
                            <div>
                                <h3 className="font-semibold mb-3">Sound</h3>
                                <label className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg cursor-pointer">
                                    <span className="text-sm">Notification Sound</span>
                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                                    >
                                        {soundEnabled ? (
                                            <Volume2 className="w-5 h-5 text-primary" />
                                        ) : (
                                            <VolumeX className="w-5 h-5 text-text-muted" />
                                        )}
                                    </button>
                                </label>
                            </div>
                        </div>

                        <Button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-6"
                            variant="gamified"
                        >
                            Save Settings
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
