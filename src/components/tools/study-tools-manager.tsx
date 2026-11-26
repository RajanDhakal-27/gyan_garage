"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stopwatch } from "./stopwatch";
import { CountdownTimer } from "./countdown-timer";
import { PlannerManager } from "@/components/planner/planner-manager";
import { Clock, Timer, ListTodo } from "lucide-react";
import { cn } from "cn";

export type ToolTab = "stopwatch" | "timer" | "targets";

interface StudyToolsManagerProps {
  initialTab?: ToolTab;
}

export function StudyToolsManager({ initialTab = "stopwatch" }: StudyToolsManagerProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ToolTab | null;
  const [activeTab, setActiveTab] = useState<ToolTab>(tabParam || initialTab);

  return (
    <div className="space-y-8">
      {/* Tool Navigation Switcher */}
      <div className="flex items-center justify-center border-b border-border/80">
        <div className="inline-flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("stopwatch")}
            className={cn(
              "px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2",
              activeTab === "stopwatch"
                ? "border-primary text-primary bg-secondary/30"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="size-4" />
            <span>Monotonic Stopwatch</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timer")}
            className={cn(
              "px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2",
              activeTab === "timer"
                ? "border-primary text-primary bg-secondary/30"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Timer className="size-4" />
            <span>Interval & Pomodoro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("targets")}
            className={cn(
              "px-4 sm:px-6 py-3 font-mono text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2",
              activeTab === "targets"
                ? "border-primary text-primary bg-secondary/30"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <ListTodo className="size-4" />
            <span>Study Targets</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "stopwatch" && <Stopwatch />}
        {activeTab === "timer" && <CountdownTimer />}
        {activeTab === "targets" && <PlannerManager />}
      </div>
    </div>
  );
}
