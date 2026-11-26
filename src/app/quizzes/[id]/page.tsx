"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Quiz } from "@/types/database";
import { QuizAttemptRunner } from "@/components/quiz/quiz-attempt-runner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

function QuizAttemptContent() {
  const params = useParams();
  const id = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchErr } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchErr) throw fetchErr;
        if (!data) throw new Error("Quiz not found");

        setQuiz(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load quiz.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-20 text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-[#7C3AED]" />
        <p className="text-sm text-[#635F69]">
          Loading quiz questions and timer…
        </p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#DB2777]/10 text-[#DB2777]">
          <AlertCircle className="size-8" />
        </div>
        <h2 className="font-heading text-xl font-extrabold text-[#332F3A]">
          Quiz not found
        </h2>
        <p className="text-sm text-[#635F69]">
          {error || "The requested quiz could not be located."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/quizzes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="size-4" />
              <span>Back to quizzes</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <QuizAttemptRunner quiz={quiz} />;
}

export default function QuizAttemptPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-20 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-[#7C3AED]" />
          <p className="text-sm text-[#635F69]">Loading quiz questions…</p>
        </div>
      }
    >
      <QuizAttemptContent />
    </Suspense>
  );
}
