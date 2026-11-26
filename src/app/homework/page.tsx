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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-6 h-10 w-52 animate-pulse rounded-full bg-[#EFEBF5]" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-[32px] border border-white/60 bg-white/40 shadow-clayPressed"
              />
            ))}
          </div>
        </div>
      }
    >
      <HomeworkManager />
    </Suspense>
  );
}
