"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatStopwatchTime } from "@/lib/stopwatch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  Trash2,
  Copy,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export interface Lap {
  index: number;
  lapTimeMs: number;
  overallTimeMs: number;
}

export function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);

  // Monotonic tracking references
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  function updateTimer() {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const currentElapsed = accumulatedRef.current + (now - startTimeRef.current);
      setElapsedMs(currentElapsed);
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  }

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  const handlePause = () => {
    if (!isRunning || startTimeRef.current === null) return;
    const now = performance.now();
    accumulatedRef.current += now - startTimeRef.current;
    startTimeRef.current = null;
    setIsRunning(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    setElapsedMs(accumulatedRef.current);
  };

  const handleReset = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    startTimeRef.current = null;
    accumulatedRef.current = 0;
    lastLapTimeRef.current = 0;
    setIsRunning(false);
    setElapsedMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    const current = elapsedMs;
    const lapTime = current - lastLapTimeRef.current;
    const newLap: Lap = {
      index: laps.length + 1,
      lapTimeMs: lapTime,
      overallTimeMs: current,
    };
    lastLapTimeRef.current = current;
    setLaps((prev) => [newLap, ...prev]);
  };

  const handleClearLaps = () => {
    setLaps([]);
    lastLapTimeRef.current = elapsedMs;
    toast.success("Lap history cleared.");
  };

  const handleCopyLaps = () => {
    if (laps.length === 0) return;
    const text = laps
      .map(
        (l) =>
          `Lap ${l.index}: ${formatDisplay(l.lapTimeMs)} (Overall: ${formatDisplay(
            l.overallTimeMs
          )})`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Lap splits copied to clipboard.");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const { hours, minutes, seconds, centiseconds } = formatStopwatchTime(elapsedMs);

  function formatDisplay(ms: number) {
    const t = formatStopwatchTime(ms);
    return `${t.hours}:${t.minutes}:${t.seconds}.${t.centiseconds}`;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Stopwatch Chassis */}
      <div className="relative overflow-hidden rounded-[48px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:p-10">
        {/* Monotonic indicator tag */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED]">
              <Clock className="size-4" />
            </span>
            <span className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#7C3AED]">
              Monotonic chronometer
            </span>
          </div>
          <Badge variant="outline">High precision</Badge>
        </div>

        {/* Big Digit Display */}
        <div className="select-none py-8 text-center">
          <div className="font-heading text-5xl font-black tabular-nums tracking-tight text-[#7C3AED] sm:text-7xl lg:text-8xl">
            {hours !== "00" && <span>{hours}:</span>}
            <span>{minutes}</span>
            <span className="text-[#635F69]/50">:</span>
            <span>{seconds}</span>
            <span className="text-3xl font-extrabold text-[#635F69] sm:text-5xl lg:text-6xl">
              .{centiseconds}
            </span>
          </div>
          <p className="mt-3 font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
            {hours !== "00"
              ? "Hours : Minutes : Seconds . Hundredths"
              : "Minutes : Seconds . Hundredths"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {!isRunning ? (
            <Button onClick={handleStart} size="lg" className="min-w-[140px]">
              <Play className="size-4 fill-current" />
              {elapsedMs > 0 ? "Resume" : "Start"}
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
            onClick={handleLap}
            disabled={!isRunning}
            variant="outline"
            size="lg"
            className="min-w-[130px]"
          >
            <Flag className="size-4" />
            Lap split
          </Button>

          <Button
            onClick={handleReset}
            disabled={elapsedMs === 0 && laps.length === 0}
            variant="ghost"
            size="lg"
            className="text-[#635F69] hover:text-[#332F3A]"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Lap Splits Ledger */}
      {laps.length > 0 && (
        <div className="space-y-4 rounded-[40px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/60 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                Lap recording ledger
              </h3>
              <Badge variant="outline">{laps.length} splits</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLaps}
                title="Copy all laps"
              >
                <Copy className="size-4" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearLaps}
                className="text-[#635F69] hover:bg-[#DB2777]/10 hover:text-[#DB2777]"
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
          </div>

          <div className="max-h-72 divide-y divide-white/60 overflow-y-auto">
            {laps.map((lap) => {
              const lapFormatted = formatDisplay(lap.lapTimeMs);
              const overallFormatted = formatDisplay(lap.overallTimeMs);
              return (
                <div
                  key={lap.index}
                  className="flex items-center justify-between rounded-2xl px-3 py-2.5 font-heading text-xs font-bold transition-colors hover:bg-[#EFEBF5]/70"
                >
                  <span className="text-[#635F69]">
                    Lap #{String(lap.index).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-6 tabular-nums">
                    <span className="text-[#332F3A]">+{lapFormatted}</span>
                    <span className="w-28 text-right text-[#635F69]">
                      {overallFormatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
