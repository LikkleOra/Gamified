"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface LevelUpModalProps {
    level: number;
    onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
    useEffect(() => {
        // Fire confetti!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-bg-elevated p-8 rounded-2xl border-2 border-amber-500 shadow-glow text-center max-w-sm w-full animate-bounce-in relative overflow-hidden">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <Trophy className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-amber-500 mb-2 relative z-10">Level Up!</h2>
                <p className="text-text-secondary mb-6 relative z-10">
                    Congratulations! You've reached <span className="text-white font-bold">Level {level}</span>.
                </p>
                <div className="flex justify-center relative z-10">
                    <Button onClick={onClose} variant="gamified" className="w-full">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
