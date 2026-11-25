import { Suspense } from "react";
import { Metadata } from "next";
import { HomeworkManager } from "@/components/homework/homework-manager";

export const metadata: Metadata = {
  title: "Homework & Assignments | Gyan Garage",
  description: "View and manage homework assignments with due dates and directions.",
};

export default function HomeworkPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-muted/20 animate-pulse border" />
            ))}
          </div>
        </div>
      }
    >
      <HomeworkManager />
    </Suspense>
  );
}
