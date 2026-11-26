"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { cn } from "cn";

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

  const updateTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const currentElapsed = accumulatedRef.current + (now - startTimeRef.current);
      setElapsedMs(currentElapsed);
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  }, []);

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
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Stopwatch Chassis */}
      <div className="border border-border/80 bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Monotonic indicator tag */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-primary">
              Monotonic Chronometer
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            performance.now() High Precision
          </Badge>
        </div>

        {/* Big Digit Display */}
        <div className="py-8 text-center select-none">
          <div className="font-mono text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-primary tabular-nums">
            {hours !== "00" && <span>{hours}:</span>}
            <span>{minutes}</span>
            <span className="text-border">:</span>
            <span>{seconds}</span>
            <span className="text-muted-foreground text-3xl sm:text-5xl lg:text-6xl font-medium">
              .{centiseconds}
            </span>
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-3 uppercase tracking-widest">
            {hours !== "00" ? "Hours : Minutes : Seconds . Hundredths" : "Minutes : Seconds . Hundredths"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="font-mono text-xs gap-2 min-w-[130px]"
            >
              <Play className="size-4 fill-current" />
              {elapsedMs > 0 ? "Resume" : "Start"}
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
            onClick={handleLap}
            disabled={!isRunning}
            variant="outline"
            size="lg"
            className="font-mono text-xs gap-2 min-w-[120px]"
          >
            <Flag className="size-4" />
            Lap Split
          </Button>

          <Button
            onClick={handleReset}
            disabled={elapsedMs === 0 && laps.length === 0}
            variant="ghost"
            size="lg"
            className="font-mono text-xs gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Lap Splits Ledger */}
      {laps.length > 0 && (
        <div className="border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary font-bold">LAPS.</span>
              <h3 className="font-serif text-lg font-medium">Lap Recording Ledger</h3>
              <Badge variant="outline" className="font-mono text-[10px]">
                {laps.length} Splits
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLaps}
                className="font-mono text-xs gap-1.5"
                title="Copy all laps"
              >
                <Copy className="size-3.5" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearLaps}
                className="font-mono text-xs gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Clear
              </Button>
            </div>
          </div>

          <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
            {laps.map((lap) => {
              const lapFormatted = formatDisplay(lap.lapTimeMs);
              const overallFormatted = formatDisplay(lap.overallTimeMs);
              return (
                <div
                  key={lap.index}
                  className="py-2.5 px-3 flex items-center justify-between font-mono text-xs hover:bg-muted/40 transition-colors"
                >
                  <span className="text-muted-foreground font-semibold">
                    Lap #{String(lap.index).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="text-foreground font-medium">
                      +{lapFormatted}
                    </span>
                    <span className="text-muted-foreground tabular-nums w-28 text-right">
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
