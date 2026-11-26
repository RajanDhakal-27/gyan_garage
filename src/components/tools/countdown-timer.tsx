"use client";

import React, { useState, useEffect, useRef } from "react";
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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Timer Chassis */}
      <div className="relative overflow-hidden rounded-[48px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:p-10">
        {/* Header Tag */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
              <Timer className="size-4" />
            </span>
            <span className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#0284C7]">
              Pomodoro & study interval
            </span>
          </div>
          <Badge variant="outline">
            {Math.round(totalDurationSeconds / 60)}m total goal
          </Badge>
        </div>

        {/* Preset Selector */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((p) => {
            const isSelected = totalDurationSeconds === p.seconds;
            const Icon = p.icon;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setPreset(p.seconds)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-heading text-[11px] font-extrabold transition-all duration-200",
                  isSelected
                    ? "bg-gradient-to-br from-[#67E8F9] to-[#0EA5E9] text-white shadow-clayButton"
                    : "border border-white/70 bg-[#EFEBF5] text-[#635F69] shadow-clayPressed hover:-translate-y-0.5 hover:text-[#0284C7]"
                )}
              >
                <Icon className="size-3.5" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Big Countdown Digits */}
        <div className="select-none py-6 text-center">
          <div className="font-heading text-6xl font-black tabular-nums tracking-tight text-[#0EA5E9] sm:text-8xl">
            <span>{String(mins).padStart(2, "0")}</span>
            <span className="mx-1 text-[#635F69]/40">:</span>
            <span>{String(secs).padStart(2, "0")}</span>
          </div>
          <p className="mt-3 font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
            Minutes : seconds remaining
          </p>
        </div>

        {/* Linear Progress Bar */}
        <div className="my-6 h-3 w-full overflow-hidden rounded-full bg-[#EFEBF5] shadow-clayPressed">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#67E8F9] to-[#0EA5E9] transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              disabled={remainingSeconds <= 0}
              size="lg"
              className="min-w-[140px]"
            >
              <Play className="size-4 fill-current" />
              {remainingSeconds < totalDurationSeconds ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="min-w-[140px]"
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
            className="text-[#635F69] hover:text-[#332F3A]"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        {/* Custom duration entry */}
        <form
          onSubmit={handleCustomSubmit}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-white/60 pt-6"
        >
          <span className="flex items-center gap-1.5 font-heading text-xs font-extrabold text-[#635F69]">
            <Bell className="size-3.5" />
            Custom:
          </span>
          <Input
            type="number"
            min="1"
            max="300"
            placeholder="Minutes"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="h-12 w-28 text-xs"
            aria-label="Custom duration in minutes"
          />
          <Button type="submit" variant="outline" size="sm">
            Set
          </Button>
        </form>
      </div>
    </div>
  );
}
