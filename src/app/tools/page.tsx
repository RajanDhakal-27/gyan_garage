"use client";

import React, { Suspense } from "react";
import { StudyToolsManager } from "@/components/tools/study-tools-manager";
import { Loader2 } from "lucide-react";

export default function ToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#7C3AED]" />
        </div>
      }
    >
      <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0EA5E9]/10 px-4 py-1.5 font-heading text-xs font-extrabold uppercase tracking-wide text-[#0EA5E9]">
              Focus & timekeeping
            </span>
            <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl lg:text-5xl">
              Study Tools & Timekeeping
            </h1>
            <p className="text-sm leading-relaxed text-[#635F69] sm:text-base">
              A precision stopwatch for test simulations, customisable focus
              countdowns, and a daily revision ledger.
            </p>
          </div>

          <StudyToolsManager />
        </div>
      </div>
    </Suspense>
  );
}
