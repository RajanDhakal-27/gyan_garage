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

const TABS: { id: ToolTab; label: string; icon: React.ElementType }[] = [
  { id: "stopwatch", label: "Stopwatch", icon: Clock },
  { id: "timer", label: "Timer & Pomodoro", icon: Timer },
  { id: "targets", label: "Study targets", icon: ListTodo },
];

export function StudyToolsManager({
  initialTab = "stopwatch",
}: StudyToolsManagerProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ToolTab | null;
  const [activeTab, setActiveTab] = useState<ToolTab>(tabParam || initialTab);

  return (
    <div className="space-y-8">
      {/* Tool Navigation Switcher */}
      <div className="flex justify-center">
        <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 rounded-[28px] border border-white/70 bg-white/70 p-2 shadow-clayCard backdrop-blur-xl sm:w-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 font-heading text-xs font-extrabold transition-all duration-200 sm:flex-none sm:px-6 sm:text-sm",
                  isActive
                    ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                    : "text-[#635F69] hover:-translate-y-0.5 hover:bg-[#EFEBF5] hover:text-[#7C3AED]"
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
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
