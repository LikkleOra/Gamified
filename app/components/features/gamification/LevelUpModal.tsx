"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface LevelUpModalProps {
    level: number;
    onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-bg-elevated p-8 rounded-2xl border-2 border-amber-500 shadow-glow text-center max-w-sm w-full animate-bounce-in">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-amber-500 mb-2">Level Up!</h2>
                <p className="text-text-secondary mb-6">
                    Congratulations! You've reached <span className="text-white font-bold">Level {level}</span>.
                </p>
                <div className="flex justify-center">
                    <Button onClick={onClose} variant="gamified" className="w-full">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
