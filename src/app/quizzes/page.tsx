import { Suspense } from "react";
import { Metadata } from "next";
import { QuizManager } from "@/components/quiz/quiz-manager";

export const metadata: Metadata = {
  title: "Objective Quizzes & Tests | Gyan Garage",
  description: "Browse and build timed multiple-choice quizzes for Nepali curriculum.",
};

export default function QuizzesPage() {
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
      <QuizManager />
    </Suspense>
  );
}
