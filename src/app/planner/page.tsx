import { Suspense } from "react";
import { Metadata } from "next";
import { StudyToolsManager } from "@/components/tools/study-tools-manager";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Study Planner & Targets | Gyan Garage",
  description: "Organize your study goals, track daily revision tasks, and monitor completion progress.",
};

export default function PlannerPage() {
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
            <span className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED]/10 px-4 py-1.5 font-heading text-xs font-extrabold uppercase tracking-wide text-[#7C3AED]">
              Revision Desk
            </span>
            <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl lg:text-5xl">
              Study Planner & Precision Tools
            </h1>
            <p className="text-sm leading-relaxed text-[#635F69] sm:text-base">
              Track your daily revision tasks, monitor completion progress, and
              time your study sessions with precision.
            </p>
          </div>

          <StudyToolsManager initialTab="targets" />
        </div>
      </div>
    </Suspense>
  );
}
