"use client";

import React, { Suspense } from "react";
import { StudyToolsManager } from "@/components/tools/study-tools-manager";
import { Loader2 } from "lucide-react";

export default function ToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b border-border/80 pb-6 space-y-2 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Stationery Instruments
              </span>
              <span className="text-border">/</span>
              <span className="font-mono text-xs text-muted-foreground">Focus & Timekeeping</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Study Tools & Timekeeping
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground">
              Monotonic precision stopwatch for test simulations, customizable Pomodoro countdown intervals, and daily revision ledger.
            </p>
          </div>

          <StudyToolsManager />
        </div>
      </div>
    </Suspense>
  );
}
