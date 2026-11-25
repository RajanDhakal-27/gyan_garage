import { Suspense } from "react";
import { Metadata } from "next";
import { PlannerManager } from "@/components/planner/planner-manager";

export const metadata: Metadata = {
  title: "Student Study Planner & Targets | Gyan Garage",
  description: "Organize your study goals, track daily revision tasks, and monitor completion progress.",
};

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/20 animate-pulse border" />
            ))}
          </div>
        </div>
      }
    >
      <PlannerManager />
    </Suspense>
  );
}
