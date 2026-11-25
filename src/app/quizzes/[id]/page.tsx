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
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <Loader2 className="size-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Loading quiz questions and timer...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <AlertCircle className="size-10 text-destructive mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Quiz Not Found</h2>
        <p className="text-xs text-muted-foreground">
          {error || "The requested quiz could not be located."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/quizzes">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="size-3.5" />
              <span>Back to Quizzes</span>
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
        <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
          <Loader2 className="size-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading quiz questions...</p>
        </div>
      }
    >
      <QuizAttemptContent />
    </Suspense>
  );
}
