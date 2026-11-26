"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Bell,
  Sparkles,
  Coffee,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

const PRESETS = [
  { label: "5m Break", seconds: 5 * 60, icon: Coffee },
  { label: "15m Review", seconds: 15 * 60, icon: Sparkles },
  { label: "25m Pomodoro", seconds: 25 * 60, icon: Brain },
  { label: "45m Deep Work", seconds: 45 * 60, icon: Timer },
  { label: "60m Exam Mock", seconds: 60 * 60, icon: Timer },
];

export function CountdownTimer() {
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    if (remainingSeconds <= 0) return;
    setIsRunning(true);
    endTimeRef.current = Date.now() + remainingSeconds * 1000;

    intervalRef.current = setInterval(() => {
      if (endTimeRef.current !== null) {
        const diff = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setRemainingSeconds(diff);

        if (diff <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          endTimeRef.current = null;
          setIsRunning(false);
          toast.success("Timer interval finished! Great focus session.", {
            duration: 8000,
          });
          // Visual alert / audio beep simulation
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("Gyan Garage Study Timer", {
                body: "Your study interval has concluded.",
              });
            }
          }
        }
      }
    }, 200);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;
    setIsRunning(false);
  };

  const handleReset = () => {
    handlePause();
    setRemainingSeconds(totalDurationSeconds);
  };

  const setPreset = (secs: number) => {
    handlePause();
    setTotalDurationSeconds(secs);
    setRemainingSeconds(secs);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (isNaN(mins) || mins <= 0 || mins > 300) {
      toast.error("Please enter a duration between 1 and 300 minutes.");
      return;
    }
    setPreset(mins * 60);
    setCustomMinutes("");
    toast.success(`Timer set to ${mins} minutes.`);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const progressPercent = totalDurationSeconds > 0
    ? ((totalDurationSeconds - remainingSeconds) / totalDurationSeconds) * 100
    : 0;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Timer Chassis */}
      <div className="border border-border/80 bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Header Tag */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Timer className="size-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-primary">
              Pomodoro & Study Interval Timer
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            {Math.round(totalDurationSeconds / 60)}m Total Goal
          </Badge>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {PRESETS.map((p) => {
            const isSelected = totalDurationSeconds === p.seconds;
            const Icon = p.icon;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setPreset(p.seconds)}
                className={cn(
                  "px-3 py-1.5 font-mono text-xs border transition-colors flex items-center gap-1.5",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border/80 hover:border-primary/50"
                )}
              >
                <Icon className="size-3" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Big Countdown Digits */}
        <div className="py-6 text-center select-none">
          <div className="font-mono text-6xl sm:text-8xl font-bold tracking-tight text-primary tabular-nums">
            <span>{String(mins).padStart(2, "0")}</span>
            <span className="text-border mx-1">:</span>
            <span>{String(secs).padStart(2, "0")}</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-3 uppercase tracking-widest">
            Minutes : Seconds Remaining
          </p>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-secondary h-2 my-6 overflow-hidden border border-border/60">
          <div
            className="bg-primary h-full transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              disabled={remainingSeconds <= 0}
              size="lg"
              className="font-mono text-xs gap-2 min-w-[130px]"
            >
              <Play className="size-4 fill-current" />
              {remainingSeconds < totalDurationSeconds ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="font-mono text-xs gap-2 min-w-[130px]"
            >
              <Pause className="size-4 fill-current" />
              Pause
            </Button>
          )}

          <Button
            onClick={handleReset}
            disabled={remainingSeconds === totalDurationSeconds}
            variant="ghost"
            size="lg"
            className="font-mono text-xs gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        {/* Custom duration entry */}
        <form onSubmit={handleCustomSubmit} className="mt-8 pt-6 border-t border-border/60 flex items-center justify-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">Custom:</span>
          <Input
            type="number"
            min="1"
            max="300"
            placeholder="Minutes"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="w-24 font-mono text-xs bg-background h-8"
          />
          <Button type="submit" variant="outline" size="sm" className="font-mono text-xs h-8">
            Set
          </Button>
        </form>
      </div>
    </div>
  );
}
